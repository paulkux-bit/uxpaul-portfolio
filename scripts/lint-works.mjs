// Usage: node scripts/lint-works.mjs   (run from the repo root, after `next build`)
//
// The fine art moments' gate. One painting per Template A study, recorded in
// app/data/works.json and rendered by components/friction-moment.tsx. This runs in
// `npm run build` AFTER `next build`, beside lint:prose, because it checks the
// rendered pages: what ships, not what the source claims.
//
// No colour or tone assertion, on purpose: the artwork is judged by eye (ruled
// 8 Oct 2026). What is checked is everything a reader or a museum could hold
// against the page: that each study shows its own work, that every work carries
// its alt, caption, credit fields and licence, and that every delivery file the
// page asks for exists at the size the record says.
//
// THE INDEX, NOT ONLY THE DISK. scripts/check-manifest-assets.mjs records why: on
// 19 Sep 2026 six replacement crops existed on disk, untracked, every local gate
// went green, and Vercel built from git without them. So when a .git directory is
// present each delivery file must also be in `git ls-files`. Where it is absent
// (a deploy checkout may not carry one) the disk half still runs, and an
// untracked file is missing from that disk, so the deploy fails here instead of
// shipping a broken figure. The skip is printed, never silent.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';

/** The square every work must fit at 1x, in CSS px: --art-max-height (40rem) at
 *  the default root, which is also the reading measure at 1440. */
export const BOX = 640;

const REQUIRED = ['slug', 'study', 'artist', 'title', 'date', 'institution', 'accession', 'objectUrl', 'licence', 'alt'];

const decode = (s) =>
  s
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

/** Template A slugs, from the MDX frontmatter. */
function templateASlugs(mdxDir) {
  return readdirSync(mdxDir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => readFileSync(join(mdxDir, f), 'utf8'))
    .map((src) => src.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '')
    .filter((fm) => /^template:\s*"A"\s*$/m.test(fm))
    .map((fm) => fm.match(/^slug:\s*"([^"]+)"\s*$/m)?.[1])
    .filter(Boolean);
}

/** Every rendered friction moment on a page: its image src and alt. */
function renderedMoments(html) {
  const figures = [...html.matchAll(/<figure class="friction-moment"[\s\S]*?<\/figure>/g)].map((m) => m[0]);
  return figures.map((fig) => {
    const img = fig.match(/<img[^>]*class="friction-moment__image"[^>]*>/)?.[0] ?? '';
    return {
      src: img.match(/\ssrc="([^"]*)"/)?.[1] ?? null,
      alt: decode(img.match(/\salt="([^"]*)"/)?.[1] ?? ''),
    };
  });
}

function trackedPaths(root) {
  if (!existsSync(join(root, '.git'))) return null;
  const out = execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  return new Set(out.split('\n').filter(Boolean));
}

export async function run({
  root = process.cwd(),
  worksPath = join(root, 'app/data/works.json'),
  mdxDir = join(root, 'app/content/case-studies'),
  htmlDir = join(root, '.next/server/app/case-studies'),
  publicDir = join(root, 'public'),
  tracked = trackedPaths(root),
} = {}) {
  const { works } = JSON.parse(readFileSync(worksPath, 'utf8'));
  const checks = [];
  const add = (id, title, failures, notes = []) => checks.push({ id, title, failures, notes });

  // 1. Every Template A study renders exactly one moment, from its own record.
  const studies = templateASlugs(mdxDir);
  const f1 = [];
  const renderedBy = new Map();
  for (const slug of studies) {
    const htmlPath = join(htmlDir, `${slug}.html`);
    if (!existsSync(htmlPath)) {
      f1.push(`${slug}: no rendered page at ${htmlPath} (run next build first)`);
      continue;
    }
    const moments = renderedMoments(readFileSync(htmlPath, 'utf8'));
    if (moments.length !== 1) {
      f1.push(`${slug}: renders ${moments.length} friction moments, expected exactly 1`);
      continue;
    }
    const [m] = moments;
    const work = works.find((w) => w.files.webp[0] === m.src);
    if (!work) {
      f1.push(`${slug}: its moment's src ${m.src} belongs to no record`);
      continue;
    }
    if (work.study !== slug) f1.push(`${slug}: renders ${work.slug}, whose record says study "${work.study}"`);
    if (m.alt !== work.alt) f1.push(`${slug}: rendered alt does not match the record for ${work.slug}`);
    renderedBy.set(work.slug, [...(renderedBy.get(work.slug) ?? []), slug]);
  }
  add(1, `Every Template A study renders exactly one friction moment, from its own record (${studies.length} studies)`, f1);

  // 2. Every record is rendered, by exactly one study.
  const f2 = works
    .filter((w) => (renderedBy.get(w.slug) ?? []).length !== 1)
    .map((w) => `${w.slug}: rendered by ${(renderedBy.get(w.slug) ?? []).length} studies, expected 1`);
  add(2, 'Every record is rendered by exactly one study', f2);

  // 3. The fields the alt, caption and credit are built from are never empty.
  const blank = (v) => typeof v !== 'string' || v.trim() === '';
  const f3 = [];
  for (const w of works) {
    for (const k of REQUIRED) if (blank(w[k])) f3.push(`${w.slug ?? '(no slug)'}: ${k} is empty`);
    if (blank(w.caption?.lead)) f3.push(`${w.slug}: caption.lead is empty`);
    if (blank(w.caption?.gloss)) f3.push(`${w.slug}: caption.gloss is empty`);
  }
  add(3, 'Alt, caption, credit fields and licence are non-empty in every record', f3);

  // 4. Every delivery file exists at its recorded size, and is tracked.
  const f4 = [];
  const notes4 = [];
  if (!tracked) notes4.push('no .git here: the index half was skipped, the disk half ran');
  for (const w of works) {
    for (const format of ['avif', 'webp']) {
      const list = w.files?.[format] ?? [];
      if (list.length !== 2) {
        f4.push(`${w.slug}: ${format} lists ${list.length} files, expected 1x and 2x`);
        continue;
      }
      for (const [i, file] of list.entries()) {
        const rel = join('public', file);
        const abs = join(publicDir, file);
        if (!existsSync(abs)) {
          f4.push(`${w.slug}: ${rel} does not exist`);
          continue;
        }
        if (tracked && !tracked.has(rel)) f4.push(`${w.slug}: ${rel} exists on disk but is not in the git index`);
        const { width, height } = await sharp(abs).metadata();
        const want = [w.display.width * (i + 1), w.display.height * (i + 1)];
        if (width !== want[0] || height !== want[1]) {
          f4.push(`${w.slug}: ${rel} is ${width}x${height}, the record says ${want[0]}x${want[1]}`);
        }
      }
    }
  }
  add(4, 'Every delivery file exists at its recorded size, and is in the git index', f4, notes4);

  // 5. The 1x box fits the cap and keeps the master's aspect.
  const f5 = [];
  for (const w of works) {
    const { width, height } = w.display;
    if (width > BOX || height > BOX) f5.push(`${w.slug}: ${width}x${height} exceeds the ${BOX} box`);
    if (width !== BOX && height !== BOX) f5.push(`${w.slug}: ${width}x${height} touches neither side of the ${BOX} box`);
    const expectH = (w.master.height * width) / w.master.width;
    if (Math.abs(expectH - height) > 1) f5.push(`${w.slug}: ${width}x${height} is not the master's aspect (height ${expectH.toFixed(1)})`);
  }
  add(5, `Every work fits the ${BOX} x ${BOX} box at its natural aspect`, f5);

  return { checks };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const { checks } = await run();
  let failing = 0;
  console.log('works-lint: app/data/works.json against the rendered study pages\n');
  for (const c of checks) {
    const ok = c.failures.length === 0;
    if (!ok) failing++;
    console.log(`${ok ? '✓' : '✗'} ${c.id}. ${c.title}`);
    console.log(`    ${ok ? 'PASS' : 'FAIL'}`);
    for (const f of c.failures) console.log(`      ${f}`);
    for (const n of c.notes) console.log(`    NOTE: ${n}`);
    console.log('');
  }
  console.log(`Result: ${checks.length - failing} of ${checks.length} passing, ${failing} failing`);
  process.exit(failing ? 1 : 0);
}
