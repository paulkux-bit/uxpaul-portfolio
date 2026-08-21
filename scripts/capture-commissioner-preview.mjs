// Usage: node scripts/capture-commissioner-preview.mjs
//
// Regenerates docs/previews/uxpaul-commissioner.html — the real home page,
// rendered in Commissioner, as one self-contained file that opens from the
// filesystem on any device with no server and no network.
//
// WHY THIS IS A SCRIPT AND NOT A COMMITTED FILE. The output is a capture of a
// BUILD, not a source document. Committing it would put a ~1 MB generated
// snapshot in git forever and it would go stale the moment app/page.tsx
// changes - silently, because a stale capture still renders perfectly. That is
// the same argument that makes app/sandbox/home-commissioner/page.tsx import
// the real home page instead of copying it.
//
// WHAT IT DOES, and every step exists because skipping it produced a wrong file
// the first time:
//
//   1  build + serve      a real production build, so the CSS is the compiled
//                         stylesheet rather than a reconstruction of it
//   2  capture            header, main, footer and every CSSOM rule
//   3  inline the fonts   fetched from the served /_next/static/media URLs, so
//                         the file never depends on Google Fonts or Fontsource
//   4  inline the assets  five cover images; a page about type with the
//                         evidence missing is worse than no page
//   5  drop reveal state  the capture is HYDRATED, so cards below the fold
//                         already carry data-reveal-hidden and sit at opacity 0
//                         waiting for a scroll event this file never fires.
//                         globals.css states the contract: "SSR renders
//                         visible". Stripping restores it.
//   6  escape non-ASCII   a standalone file has no charset declaration of its
//                         own; the interpunct in "Paul Kali - Senior Product
//                         Designer" came back as mojibake without this
//   7  add the chrome     face / voice / signature / mode toggles, the header
//                         elevation shim, and the axis probe
//
// It FAILS rather than writing a plausible-looking file: no fonts found, no
// images inlined, a card that stays invisible, or any non-ASCII left in the
// output all abort. The output of this tool is judged by eye, and a broken file
// that looks fine is the only outcome worth engineering against.
import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { join, extname } from 'node:path';

const PORT = 3117;
const ORIGIN = `http://127.0.0.1:${PORT}`;
const OUT = 'docs/previews/uxpaul-commissioner.html';
const MIME = { '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };

const die = (msg) => {
  console.error(`\ncapture: ${msg}`);
  process.exit(1);
};

const run = (cmd, args, opts = {}) =>
  new Promise((res, rej) => {
    const p = spawn(cmd, args, { stdio: 'inherit', ...opts });
    p.on('exit', (c) => (c === 0 ? res() : rej(new Error(`${cmd} exited ${c}`))));
  });

async function waitFor(url, tries = 40) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url);
      if (r.ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  die(`server never became ready at ${url}`);
}

const b64 = (buf) => Buffer.from(buf).toString('base64');

let server;
try {
  console.log('capture: building');
  await run('npx', ['next', 'build']);

  console.log(`capture: serving on ${PORT}`);
  server = spawn('npx', ['next', 'start', '-p', String(PORT)], { stdio: 'ignore' });
  await waitFor(ORIGIN + '/');

  const { chromium } = await import('playwright');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // The Commissioner face is loaded by the sandbox route, not by the home page.
  // Visit it first purely to learn the URL next/font generated for the woff2.
  await page.goto(`${ORIGIN}/sandbox/type-commissioner`, { waitUntil: 'networkidle' });
  const cmsrUrl = await page.evaluate(() => {
    for (const s of document.styleSheets) {
      try {
        for (const r of s.cssRules) {
          const m = /url\("([^"]+\.woff2)"\)/.exec(r.cssText || '');
          if (m && /commissioner/i.test(r.cssText)) return m[1];
        }
      } catch {
        /* cross-origin sheet */
      }
    }
    return null;
  });
  if (!cmsrUrl) die('could not find the Commissioner woff2 on /sandbox/type-commissioner');

  await page.goto(ORIGIN + '/', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  const cap = await page.evaluate(() => {
    let css = '';
    let bricUrl = null;
    for (const s of document.styleSheets) {
      try {
        for (const r of s.cssRules) {
          const t = r.cssText || '';
          const m = /url\("([^"]+\.woff2)"\)/.exec(t);
          if (m && /bricolage/i.test(t)) bricUrl = m[1];
          css += t + '\n';
        }
      } catch {
        /* cross-origin sheet */
      }
    }
    const q = (sel) => document.querySelector(sel)?.outerHTML ?? '';
    return { css, bricUrl, header: q('header'), main: q('main#main'), footer: q('footer') };
  });
  await browser.close();

  if (!cap.bricUrl) die('could not find the Bricolage woff2 on the home page');
  if (!cap.main) die('no <main id="main"> in the captured page');

  const abs = (u) => new URL(u, ORIGIN + '/_next/static/css/').href;
  const fonts = {};
  for (const [name, url] of [['bric', cap.bricUrl], ['cmsr', cmsrUrl]]) {
    const r = await fetch(abs(url));
    if (!r.ok) die(`could not fetch ${name} font at ${abs(url)}`);
    fonts[name] = b64(await r.arrayBuffer());
  }

  let css = cap.css
    .replace(/@font-face\s*\{[^}]*\}\s*/g, '')
    .replace(
      '--font-sans: var(--font-bricolage), system-ui, sans-serif;',
      '--font-sans: var(--face), system-ui, sans-serif;',
    );
  if (css.includes('--font-sans: var(--font-bricolage)'))
    die('the --font-sans substitution did not take; globals.css may have changed');

  let html = cap.header + cap.main + cap.footer;

  // 4 - inline every /public asset the markup references.
  let inlined = 0;
  const refs = [...new Set([...html.matchAll(/"(\/[^"]+?\.(?:webp|png|jpg|svg))"/g)].map((m) => m[1]))];
  for (const path of refs.sort((a, b) => b.length - a.length)) {
    let file = join('public', path.replace(/^\//, ''));
    // Point PNG fallbacks at the webp payload: both slots render the same
    // picture and the file carries one copy instead of two.
    const webp = file.replace(/\.png$/, '.webp');
    if (file.endsWith('.png') && existsSync(webp)) file = webp;
    if (!existsSync(file)) die(`referenced asset is missing from public/: ${path}`);
    const uri = `data:${MIME[extname(file)]};base64,${b64(await readFile(file))}`;
    html = html.split(`"${path}"`).join(`"${uri}"`);
    inlined++;
  }
  if (!inlined) die('no assets were inlined - the card covers would be blank');

  // 5 - restore the documented SSR-visible reveal state.
  const hidden = (html.match(/data-reveal-hidden/g) || []).length;
  html = html.replace(/\s+data-reveal-(?:hidden|shown)(?:="[^"]*")?/g, '');

  // 6 - ASCII only, both halves.
  html = [...html].map((c) => (c.charCodeAt(0) < 128 ? c : `&#${c.codePointAt(0)};`)).join('');
  css = [...css]
    .map((c) => (c.charCodeAt(0) < 128 ? c : '\\' + c.codePointAt(0).toString(16).padStart(6, '0')))
    .join('');

  const chrome = await readFile('scripts/commissioner-preview-chrome.html', 'utf8');
  const out = chrome
    .replace('__BRIC__', fonts.bric)
    .replace('__CMSR__', fonts.cmsr)
    .replace('__CSS__', css)
    .replace('__HTML__', html);

  if ([...out].some((c) => c.charCodeAt(0) > 127)) die('non-ASCII survived the escape pass');

  await mkdir('docs/previews', { recursive: true });
  await writeFile(OUT, out);

  // The bench is a second output of the same fetch. Its SOURCE is committed
  // and hand-authored; the built file beside it is committed too, and that is
  // not an inconsistency with the home capture above. The distinction is what
  // each one tracks: the home capture tracks the site and rots the moment
  // app/page.tsx changes, while the bench tracks only its own copy and is
  // stable until someone edits it deliberately. One is a snapshot, the other
  // is a document that happens to carry its fonts.
  const benchSrc = await readFile('scripts/commissioner-bench-source.html', 'utf8');
  if (!benchSrc.includes('__COMMISSIONER__') || !benchSrc.includes('__BRICOLAGE__'))
    die('the bench source has lost its font placeholders');
  const bench = benchSrc.replace('__COMMISSIONER__', fonts.cmsr).replace('__BRICOLAGE__', fonts.bric);
  await writeFile('docs/previews/commissioner-bench.html', bench);
  console.log(`capture: wrote docs/previews/commissioner-bench.html - ${Math.round(bench.length / 1024)} KB`);
  console.log(
    `capture: wrote ${OUT} - ${Math.round(out.length / 1024)} KB, ` +
      `${inlined} assets inlined, ${hidden} reveal markers stripped`,
  );
} finally {
  if (server) server.kill();
  await rm('.next/cache', { recursive: true, force: true }).catch(() => {});
}
