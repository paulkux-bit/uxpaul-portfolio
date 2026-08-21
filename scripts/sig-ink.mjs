/**
 * Perceived-weight proxy for the 340/720 signature.
 *
 * The feasibility study's §7 argues the pair from design-space position after
 * `avar`, and says of that method, correctly, that it is "a proxy for perceived
 * weight, not a proof". This measures a different proxy — rendered ink — by
 * setting a string at 88px, screenshotting at 2x and counting dark pixels.
 * Still a proxy. Better than the first one, and it points the other way.
 *
 *   npm i -D @fontsource-variable/bricolage-grotesque @fontsource-variable/commissioner
 *   node scripts/sig-ink.mjs
 */

import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const FS_DIR = 'node_modules/@fontsource-variable';
const b64 = (p) => readFileSync(p).toString('base64');
const BRI = b64(process.env.BRICOLAGE_WOFF2 ??
  `${FS_DIR}/bricolage-grotesque/files/bricolage-grotesque-latin-standard-normal.woff2`);
const CMS = b64(process.env.COMMISSIONER_WOFF2 ??
  `${FS_DIR}/commissioner/files/commissioner-latin-full-normal.woff2`);

/* Deliberately NOT the site's signature string. The home hero's heavy half is
   `consumer / enterprise / defense`, which carries no `g` — so the clumsy
   heavy-weight counter §7 flags is not exposed there. This probe puts two of
   them in on purpose, so the weakness is visible if it is going to be. */
const STR = 'designing gauges';
const WEIGHTS = [300,320,340,360,380,400,500,600,650,700,720,760,800,820,860,900];

const html = readFileSync('scripts/sig-ink-source.html', 'utf8')
  .replace('__BRICOLAGE_WOFF2_BASE64__', BRI)
  .replace('__COMMISSIONER_WOFF2_BASE64__', CMS);

const run = async () => {
  const browser = await chromium.launch(
    process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}
  );
  const page = await browser.newPage({ viewport: { width: 1500, height: 200 }, deviceScaleFactor: 2 });
  await page.setContent(html);
  await page.evaluate(() => document.fonts.ready);

  const measure = async (family, weight, fvs) => {
    await page.evaluate(([f, w, v, s]) => {
      const o = document.getElementById('out');
      o.innerHTML = `<div class="row" style="font-family:${f};font-weight:${w};font-variation-settings:${v}">${s}</div>`;
    }, [family, weight, fvs, STR]);
    await page.evaluate(() => document.fonts.ready);
    const el = await page.$('.row');
    const buf = await el.screenshot();
    return buf;
  };

  const ink = async (buf) => {
    // count non-white pixels via sharp
    const sharp = (await import('sharp')).default;
    const { data, info } = await sharp(buf).greyscale().raw().toBuffer({ resolveWithObject: true });
    let dark = 0;
    for (let i = 0; i < data.length; i++) if (data[i] < 128) dark++;
    return { dark, total: info.width * info.height, w: info.width };
  };

  const results = [];
  for (const [label, fam, fvs] of [['bricolage','B',"'wdth' 88"], ['commissioner','C',"'FLAR' 0, 'VOLM' 0"], ['commissioner-flare','C',"'FLAR' 70, 'VOLM' 40"]]) {
    for (const w of WEIGHTS) {
      const buf = await measure(fam, w, fvs);
      const { dark, w: width } = await ink(buf);
      results.push({ label, w, dark, width });
    }
  }
  await browser.close();

  const byLabel = {};
  for (const r of results) (byLabel[r.label] ??= []).push(r);
  for (const [label, rs] of Object.entries(byLabel)) {
    console.log(`\n${label}`);
    for (const r of rs) console.log(`  wght ${String(r.w).padStart(3)}  ink ${String(r.dark).padStart(7)}  advance ${r.width}px`);
  }
  console.log('\n--- ink ratio of the signature pair ---');
  const get = (l, w) => byLabel[l].find((r) => r.w === w).dark;
  console.log(`bricolage    340/720 : ${(get('bricolage',720)/get('bricolage',340)).toFixed(3)}`);
  for (const heavy of [700,720,760,800,820,860,900]) {
    console.log(`commissioner 340/${heavy} : ${(get('commissioner',heavy)/get('commissioner',340)).toFixed(3)}`);
  }
};
run();
