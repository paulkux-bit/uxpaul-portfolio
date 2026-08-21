/**
 * For the display strings the line-break diff flagged, find the exact viewport
 * band in which each one occupies one line versus two. Run once per face; the
 * two runs are read side by side.
 *
 *   node scripts/sweep-breakpoints.mjs <label>
 */

import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';

const LABEL = process.argv[2] ?? 'run';
const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const VARIANT = process.argv[3] ?? '';

const TARGETS = [
  { route: '/case-studies/uscg-bard', sel: '.hero-block__sentence--open' },
  { route: '/case-studies/uscg-bard', sel: '.hero-block__sentence--anxious' },
  { route: '/case-studies/us-navy-fdt-e', sel: '.hero-block__sentence--open' },
  { route: '/case-studies/us-navy-fdt-e', sel: '.hero-block__sentence--anxious' },
  { route: '/case-studies/nuuly', sel: '.hero-block__sentence--open' },
  { route: '/case-studies/nuuly', sel: '.hero-block__sentence--anxious' },
  { route: '/', sel: '.case-card__title-link' },
];

const WIDTHS = [];
for (let w = 320; w <= 1600; w += 16) WIDTHS.push(w);

const run = async () => {
  const browser = await chromium.launch(
    process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}
  );
  const out = [];

  for (const t of TARGETS) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: 'light' });
    const page = await ctx.newPage();
    await page.goto(BASE + t.route, { waitUntil: 'networkidle' });
    if (VARIANT) await page.addStyleTag({ content: VARIANT });
    await page.evaluate(() => document.fonts.ready);

    const series = [];
    for (const w of WIDTHS) {
      await page.setViewportSize({ width: w, height: 900 });
      const r = await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const range = document.createRange();
        range.selectNodeContents(el);
        const rects = Array.from(range.getClientRects()).filter((x) => x.width > 0.5);
        const tops = new Set(rects.map((x) => Math.round(x.top)));
        return { lines: tops.size, text: el.textContent.trim().slice(0, 60), size: parseFloat(getComputedStyle(el).fontSize) };
      }, t.sel);
      if (!r) break;
      series.push({ w, ...r });
    }
    if (series.length) {
      // compress to bands
      const bands = [];
      for (const s of series) {
        const last = bands.at(-1);
        if (last && last.lines === s.lines) last.to = s.w;
        else bands.push({ from: s.w, to: s.w, lines: s.lines });
      }
      out.push({ ...t, text: series[0].text, bands });
    }
    await ctx.close();
  }

  await browser.close();
  mkdirSync('measurements', { recursive: true });
  writeFileSync(`measurements/sweep-${LABEL}.json`, JSON.stringify(out, null, 1));
  for (const o of out) {
    console.log(`\n${o.route}  ${o.sel}\n  "${o.text}"`);
    console.log('  ' + o.bands.map((b) => `${b.from}-${b.to}px: ${b.lines} line${b.lines > 1 ? 's' : ''}`).join('  |  '));
  }
};

run();
