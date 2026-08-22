/**
 * Does a font-level declaration actually render, at the size the selector sets?
 *
 *   node scripts/measure-flare-ink.mjs                 (needs `next start` on :3000)
 *   ONLY=qh-brand node scripts/measure-flare-ink.mjs   one target
 *
 * GENERALISED IN C6a FROM FLARE TO ANY PROPERTY, and the reason is the noise
 * floor rather than tidiness. C6a needed the same question asked of
 * `font-feature-settings: 'case'` on the Also Shipped wordmarks. Writing a
 * second script would have duplicated the toggle, the clip handling and the
 * self-diff — and a noise floor that exists in two places is a noise floor that
 * will exist correctly in one of them. Each target names its own `prop`, `on`
 * and `off`; FLAR is the default.
 *
 * WHY A NEW INSTRUMENT, AND WHY NOT THE TWO THAT LOOK LIKE IT.
 *
 * scripts/sig-ink.mjs counts ink, but on a synthetic page at a fixed 88px with
 * fontsource builds — it answers a question about the TYPEFACE. This one runs
 * against the shipped site at the sizes the CSS actually produces, which is a
 * question about the DESIGN. The 88px answer does not transfer: flare is a
 * detail on the stem ends, so whether it survives is a function of size.
 *
 * scripts/measure-linebreaks.mjs answers "did anything re-break", and for this
 * change it is expected to return ZERO — see below. A zero from that harness
 * cannot distinguish "the flare was removed and it did not move a line break"
 * from "the flare was never rendering". THAT is the distinction this exists for,
 * and the rule it serves is the one C4 paid for: when a verification returns
 * zero, prove the mechanism fired.
 *
 * METHOD. For each selector, on the live page, set --flar to 100 and to 0 on the
 * element itself and screenshot the SAME clip box at 2x both times. Report:
 *
 *   ink      dark pixels (greyscale < 128), and the delta between the two
 *   diff     share of pixels that differ at all, which catches a shape change
 *            that adds and removes equal ink
 *   set      summed width of the element's line boxes, to 4dp
 *
 * `set` is the metric question and it is asked separately on purpose. The 0
 * advance was already measured identical at FLAR 0 and 100 (0.6525em @400), so
 * the expectation is that flare changes outlines and NOT metrics. If set width
 * moves here, that measurement was too narrow — one glyph is not the font.
 *
 * MEASUREMENT CONDITION, stated rather than implied: light mode, 2x, the
 * shipped woff2, `prefers-reduced-motion: reduce`, and a warmup pass after every
 * variation change. A font-variation change needs a frame before it is on the
 * screen, and this harness has returned confident wrong numbers without one.
 *
 * AND IT MEASURES ITS OWN NOISE FLOOR. After the two states it shoots the FIRST
 * state again and diffs it against itself. Anything that is not the axis —
 * scroll-triggered motion mid-flight, a lazy image, a hover artifact — shows up
 * there, and a flare diff only means something above it. The first run of this
 * script reported 95% of pixels changed on a 32px headline sitting inside a
 * scroll-reveal, which is the number that bought this control.
 */

import { chromium } from 'playwright';
import sharp from 'sharp';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';

/* `expect` is written down BEFORE the run so the numbers can contradict it.
   For the flare rows it is what the 52px cut predicts: 'gone' = flare is being
   removed here and should be visible in the before state; 'kept' = it stays and
   is the control. For the C6a row it is 'inert', which is a PREDICTION OF ZERO
   and the only row where zero is the pass. */
const FLARE = { prop: '--flar', on: '100', off: '0' };
const TARGETS = [
  { sel: '.text-cover',               route: '/',                        px: 32, expect: 'gone' },
  { sel: '.friction-beat__headline',  route: '/case-studies/uscg-bard',  px: 32, expect: 'gone' },
  { sel: '.about-phase__title',       route: '/about',                   px: 40, expect: 'gone' },
  { sel: '.case-study-prose h2',      route: '/case-studies/uscg-bard',  px: 52, expect: 'kept' },
  { sel: '.about-hero__pov',          route: '/about',                   px: 56, expect: 'kept' },
  { sel: '.hero-block__title',        route: '/case-studies/uscg-bard',  px: 72, expect: 'kept' },
  { sel: '.milestone__date',          route: '/case-studies/uscg-bard',  px: 88, expect: 'kept' },

  /* C6a. Commissioner's `case` feature substitutes 18 glyphs in the shipped
     subset and `period` is not one of them — a full stop is baseline-anchored in
     both cases, so there is nothing to raise. None of the four wordmarks
     (LIONSGATE, AMERICAN RED CROSS, BBC, K. HOVNANIAN) contains a glyph the
     feature touches. This row exists to render that claim rather than read it
     out of a GSUB table, because a table read is a static claim about a font and
     the question is about a page. Zero is the pass. */
  { sel: '[data-brand="k-hovnanian"] .qh-brand', route: '/', px: 14, expect: 'inert',
    label: 'qh-brand', prop: 'font-feature-settings', on: "'case' 1", off: 'normal' },
];

const VIEWPORTS = [1440, 1920];

const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}
);

const ink = async (buf) => {
  const { data, info } = await sharp(buf).greyscale().raw().toBuffer({ resolveWithObject: true });
  let dark = 0;
  for (let i = 0; i < data.length; i++) if (data[i] < 128) dark++;
  return { dark, px: info.width * info.height, data };
};

const rows = [];

const ONLY = process.env.ONLY;

for (const width of VIEWPORTS) {
  for (const t of TARGETS.filter((t) => !ONLY || t.label === ONLY || t.sel.includes(ONLY))) {
    const { prop, on, off } = { ...FLARE, ...t };
    const page = await browser.newPage({
      viewport: { width, height: 1000 }, deviceScaleFactor: 2, colorScheme: 'light',
      reducedMotion: 'reduce',
    });
    await page.goto(BASE + t.route, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    const found = await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      el.setAttribute('data-flare-probe', '');
      el.scrollIntoView({ block: 'center' });
      return { size: parseFloat(getComputedStyle(el).fontSize) };
    }, t.sel);

    if (!found) { rows.push({ ...t, width, missing: true }); await page.close(); continue; }
    await page.waitForTimeout(120); // settle the scroll before the clip is taken

    /* One clip box for both states, AND the box is re-read in each state so a
       move is caught rather than diffed. A fullPage clip is in document
       coordinates: if toggling the axis re-wraps this element or anything above
       it, the same clip lands on different content and the pixel diff reports a
       page shift as a glyph change. That defect produced a 95% reading on the
       first run of this script. */
    const box = await page.evaluate(() => {
      const r = document.querySelector('[data-flare-probe]').getBoundingClientRect();
      // Document coordinates, not viewport: `clip` on a fullPage screenshot is
      // measured from the top of the document and the probe is scrolled to.
      return { x: r.x + window.scrollX, y: r.y + window.scrollY, width: r.width, height: r.height };
    });
    const clip = { x: Math.floor(box.x), y: Math.floor(box.y),
                   width: Math.ceil(box.width), height: Math.ceil(box.height) };

    const shot = async (v) => {
      await page.evaluate(([p, val]) => {
        document.querySelector('[data-flare-probe]').style.setProperty(p, val);
      }, [prop, v]);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(80); // warmup: a variation change needs a frame
      const set = await page.evaluate(() => {
        const el = document.querySelector('[data-flare-probe]');
        const r = document.createRange();
        r.selectNodeContents(el);
        const rects = [...r.getClientRects()].filter((x) => x.width > 0.01);
        return { total: rects.reduce((a, x) => a + x.width, 0), lines: rects.length,
                 box: el.getBoundingClientRect().width };
      });
      const here = await page.evaluate(() => {
        const r = document.querySelector('[data-flare-probe]').getBoundingClientRect();
        return { x: r.x + window.scrollX, y: r.y + window.scrollY, w: r.width, h: r.height };
      });
      const buf = await page.screenshot({ clip, fullPage: true });
      return { set, here, ...(await ink(buf)) };
    };

    const a = await shot(on);
    const b = await shot(off);
    const a2 = await shot(on); // noise control: same state, later frame

    let differing = 0, noise = 0;
    for (let i = 0; i < a.data.length; i++) {
      if (a.data[i] !== b.data[i]) differing++;
      if (a.data[i] !== a2.data[i]) noise++;
    }

    /* Sub-pixel is fine; a whole pixel of movement means the clip is no longer
       comparing like with like and the diff number is void, not small. */
    const moved = Math.max(Math.abs(a.here.x - b.here.x), Math.abs(a.here.y - b.here.y)) >= 1
               || Math.abs(a.here.h - b.here.h) >= 1;

    rows.push({
      ...t, width, size: found.size, prop,
      ink100: a.dark, ink0: b.dark, px: a.px,
      set100: a.set.total, set0: b.set.total, lines: a.set.lines,
      differing, noise, moved, dy: (b.here.y - a.here.y).toFixed(2), dh: (b.here.h - a.here.h).toFixed(2),
    });
    await page.close();
  }
}
await browser.close();

console.log(`\nFONT-DECLARATION INK — light mode, 2x, reduced motion, shipped woff2.\nEach row toggles its own property ON -> OFF on the element and diffs the same clip.\n`);
for (const width of VIEWPORTS) {
  console.log(`  @${width}px`);
  console.log(`    ${'selector'.padEnd(26)} ${'size'.padStart(6)} ${'ink@100'.padStart(8)} ${'ink@0'.padStart(8)} ${'d ink'.padStart(7)} ${'d pixels'.padStart(9)} ${'noise'.padStart(8)} ${'set@100'.padStart(9)} ${'set@0'.padStart(9)} ${'d set'.padStart(8)}`);
  for (const r of rows.filter((x) => x.width === width)) {
    if (r.missing) { console.log(`    ${r.sel.padEnd(26)}  MATCHES NOTHING on ${r.route}`); continue; }
    const dInk = ((r.ink100 - r.ink0) / r.ink0) * 100;
    const dPx = (r.differing / r.px) * 100;
    const nPx = (r.noise / r.px) * 100;
    const dSet = ((r.set100 - r.set0) / r.set0) * 100;
    console.log(
      `    ${r.sel.padEnd(26)} ${(r.size.toFixed(1) + 'px').padStart(6)} ${String(r.ink100).padStart(8)} ${String(r.ink0).padStart(8)}` +
      ` ${(dInk >= 0 ? '+' : '') + dInk.toFixed(2) + '%'}`.padStart(8) +
      ` ${r.moved ? 'MOVED' : dPx.toFixed(3) + '%'}`.padStart(10) +
      ` ${nPx.toFixed(3) + '%'}`.padStart(9) +
      ` ${r.set100.toFixed(3).padStart(9)} ${r.set0.toFixed(3).padStart(9)}` +
      ` ${(dSet >= 0 ? '+' : '') + dSet.toFixed(4) + '%'}`.padStart(9) +
      `   ${r.expect}${r.prop === '--flar' ? '' : '  [' + r.prop + ']'}`
    );
  }
  console.log('');
}

const moved = rows.filter((r) => r.moved);
if (moved.length) {
  console.log('  MOVED — the element changed position or height between the two states, so the');
  console.log('  pixel-diff column is void for it. Ink and set width are still comparable.');
  for (const r of moved)
    console.log(`    @${r.width}  ${r.sel.padEnd(26)} dy ${String(r.dy).padStart(7)}px  dh ${String(r.dh).padStart(6)}px`);
  console.log('');
}
