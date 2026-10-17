/**
 * npm run sweep: no text runs past the edge of the page, on every route, at the
 * four conditions people actually reach (step 6 part 4, ruling 6a, 16 Oct 2026).
 *
 *   320 at 100%   the WCAG 1.4.10 reflow width
 *   195 at 100%   a 390 phone at 200% page zoom (iOS Safari, Chrome Android)
 *   390 at 200%   a phone with its text size at 200% (Android, Firefox text zoom)
 *   1440 at 200%  a desktop with the browser's font size at 200%
 *
 * LOCAL ONLY, NOT IN THE BUILD: it needs a browser and a running server, and the
 * Vercel build has neither. Start a production server first:
 *
 *   NODE_ENV=production npm run build && npx next start -p 3000
 *   npm run sweep                       # BASE_URL=http://127.0.0.1:3000 by default
 *
 * The 200% conditions set the root font size in CSS. That scales every rem and
 * em-based length but not media queries written in em, which respond only to the
 * browser's own font-size setting; the site's breakpoints are px, so the two agree
 * here. Exits 1 and lists each text run past the edge (selector, right edge, text).
 * A run inside its own scroll container (a chart track, the dialog) is skipped.
 */

import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const ROUTES = ['/', '/about', '/case-studies/uscg-bard', '/case-studies/us-navy-fdt-e',
  '/case-studies/us-navy-dagr', '/case-studies/urbn-delivery-promise', '/case-studies/nuuly'];
const CONDITIONS = [['320 at 100%', 320, 100], ['195 at 100%', 195, 100], ['390 at 200%', 390, 200], ['1440 at 200%', 1440, 200]];

const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const failures = [];
for (const [name, width, pct] of CONDITIONS) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: 'networkidle' });
    if (pct !== 100) await page.addStyleTag({ content: `html { font-size: ${pct}% !important; }` });
    await page.evaluate(() => document.fonts.ready);
    const found = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const inScroller = (el) => {
        for (let a = el.parentElement; a && a !== document.body; a = a.parentElement)
          if (/(auto|scroll|hidden|clip)/.test(getComputedStyle(a).overflowX) && a.getBoundingClientRect().right <= vw + 1) return true;
        return false;
      };
      const out = [];
      const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let n = walk.nextNode(); n; n = walk.nextNode()) {
        const el = n.parentElement;
        if (!n.textContent.trim() || el.closest('.sr-only, [aria-hidden="true"], dialog:not([open])')) continue;
        const range = document.createRange();
        range.selectNodeContents(n);
        const past = [...range.getClientRects()].find((r) => r.width > 0 && r.right > vw + 0.5);
        if (past && !inScroller(el)) out.push(`${el.tagName.toLowerCase()}.${String(el.className).trim().split(/\s+/)[0]} to ${Math.round(past.right)}px: "${n.textContent.trim().slice(0, 32)}"`);
      }
      const sw = document.documentElement.scrollWidth;
      if (sw > vw + 1 && out.length === 0) out.push(`the page scrolls sideways to ${sw}px (no text run found past the edge)`);
      return out;
    });
    for (const f of found) failures.push(`${name}  ${route}  ${f}`);
  }
  await ctx.close();
}
await browser.close();

if (failures.length) {
  console.log(`sweep: ${failures.length} text run(s) past the edge\n  ${failures.join('\n  ')}`);
  process.exit(1);
}
console.log(`sweep: 0 text past the edge, ${ROUTES.length} routes x ${CONDITIONS.length} conditions`);
