/**
 * Does the case-study hero reflow during the font swap?
 *
 * R9 says anything that matters must survive the fallback, because the
 * next/font fallback is Arial-based with no wdth and no opsz. The hero
 * sentences hold one line only at font-stretch 88%. This measures what the
 * fallback actually renders, by aborting the woff2 request.
 *
 *   node scripts/measure-fallback-shift.mjs
 */
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const ROUTES = ['/case-studies/uscg-bard', '/case-studies/us-navy-fdt-e', '/case-studies/nuuly'];
const SEL = ['.hero-block__sentence--open', '.hero-block__sentence--anxious'];

const read = async (page) =>
  page.evaluate((sels) =>
    sels.map((s) => {
      const el = document.querySelector(s);
      if (!el) return null;
      const r = document.createRange();
      r.selectNodeContents(el);
      const rects = [...r.getClientRects()].filter((x) => x.width > 0.5);
      return {
        sel: s,
        text: el.textContent.trim().slice(0, 40),
        lines: new Set(rects.map((x) => Math.round(x.top))).size,
        family: getComputedStyle(el).fontFamily.split(',')[0],
        blockTop: Math.round(el.getBoundingClientRect().top),
      };
    }), SEL);

const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}
);

for (const width of [768, 1440]) {
  console.log(`\n=== viewport ${width} ===`);
  for (const route of ROUTES) {
    // real load
    const a = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: 'light' });
    const pa = await a.newPage();
    await pa.goto(BASE + route, { waitUntil: 'networkidle' });
    await pa.evaluate(() => document.fonts.ready);
    const real = await read(pa);
    await a.close();

    // fallback: abort the woff2 so the size-adjusted Arial fallback renders
    const b = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: 'light' });
    const pb = await b.newPage();
    await pb.route('**/*.woff2', (r) => r.abort());
    await pb.goto(BASE + route, { waitUntil: 'networkidle' });
    await pb.waitForTimeout(400);
    const fall = await read(pb);
    await b.close();

    real.forEach((r, i) => {
      if (!r || !fall[i]) return;
      const f = fall[i];
      const flag = r.lines !== f.lines ? '  <-- REFLOWS' : '';
      console.log(
        `  ${route.split('/').pop().padEnd(14)} ${r.sel.replace('.hero-block__sentence--', '').padEnd(8)} ` +
        `loaded ${r.lines}L / fallback ${f.lines}L${flag}   "${r.text}"`
      );
    });
  }
}
await browser.close();
