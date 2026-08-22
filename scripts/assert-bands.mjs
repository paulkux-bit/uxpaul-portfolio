/**
 * Does the voice actually reach the elements it is supposed to reach, and
 * only those?
 *
 *   node scripts/assert-bands.mjs        (needs `next start` on :3000)
 *
 * WHY THIS EXISTS AND WHY IT IS NOT lint:type. lint:type check 11 asserts the
 * CSS band list matches RUNGS' `band: 'display'` set. That is a comparison of
 * two lists. It cannot tell you whether either list matches a real element,
 * which is exactly how the Commissioner bench's rung-5 band rendered nothing
 * for an entire judgment session while every gate stayed green.
 *
 * AND IT ASSERTS THE COMPUTED VALUE, NOT THE MATCH COUNT. "This selector
 * matches >= 1 element" is the CSS-presence question wearing a DOM costume; it
 * is the same shape as 8b greping for `document.fonts`, and proves a thing
 * exists rather than that it does anything. --flar is registered as <number>,
 * so getComputedStyle returns a resolved value and the real question is
 * answerable: does this element actually compute to 100?
 *
 * Two directions, because a leak and a gap are different failures:
 *
 *   1. Every display-band selector matches >= 1 element, and every matched
 *      element computes --flar: 100. Catches a band that matches but is
 *      overridden downstream.
 *   2. Known body-rung elements compute --flar: 0. `--flar` inherits, so a
 *      band value set on a CONTAINER leaks into every descendant, including
 *      prose. THIS IS THE ACTUAL LEAK DETECTOR: the line-break diff only sees
 *      a leak that happens to change a line break, and a leak into a short
 *      paragraph that does not re-break is invisible to it.
 *
 * Route coverage is reported per selector, because a selector whose only home
 * is a route outside the five would fail here for the wrong reason.
 */

import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const ROUTES = ['/', '/about', '/case-studies/uscg-bard', '/case-studies/us-navy-fdt-e', '/case-studies/nuuly'];

/** Mirrors RUNGS' `band: 'display'` set. lint:type check 11 keeps them equal. */
const DISPLAY_BAND = [
  '.milestone__date',
  '.hero-block__title',
  '.case-study-prose h2',
  '.friction-beat__headline',
  '.text-cover',
  '.text-lede',
  '.about-phase__title',
  '.about-hero__pov',
];

/**
 * In globals.css, banded nowhere, rendering nowhere. Carried here so a reader
 * can see they were considered and excluded rather than forgotten — the same
 * reason they keep their RUNGS entries with `dead: true`.
 *   .resolution-block__headline, .text-statement, .transformation
 * and, already known, .text-hero and .case-study-prose > h1.
 */

/** Reading surfaces that must stay at 0. A leak lands here first. */
const READING = [
  '.case-study-prose p',
  '.case-study-prose .section-lede',
  '.about-row__body',
  // C4a: the phase titles are flared and these two sit right beside them.
  // .about-phase__note follows a flared <h2> as a SIBLING, and
  // .about-contact__body follows another - if either ever became a child, the
  // flare would reach prose and only this check would notice.
  '.about-phase__note',
  '.about-contact__body',
  '.hero-block__role',
  '.figure__caption',
];

/**
 * `exclude` drops elements that also match a display-band selector. A reading
 * selector like `.case-study-prose p` legitimately matches `.milestone__date`,
 * which is a <p> at rung 6 and correctly carries 100 — counting that as a leak
 * is the checker's bug, not the CSS's. Excluding the band generically means
 * this stays honest as the band grows, rather than needing a :not() per member.
 */
const read = (page, selectors, exclude = []) =>
  page.evaluate(({ sels, exclude }) =>
    sels.map((sel) => {
      let els = [...document.querySelectorAll(sel)];
      if (exclude.length) els = els.filter((el) => !exclude.some((x) => el.matches(x)));
      const vals = els.map((el) => getComputedStyle(el).getPropertyValue('--flar').trim());
      return { sel, count: els.length, values: [...new Set(vals)] };
    }), { sels: selectors, exclude });

const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}
);

const band = {}, reading = {};
for (const route of ROUTES) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(BASE + route, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  for (const r of await read(page, DISPLAY_BAND)) {
    band[r.sel] ??= { total: 0, routes: [], values: new Set() };
    if (r.count) { band[r.sel].total += r.count; band[r.sel].routes.push(route); }
    r.values.forEach((v) => band[r.sel].values.add(v));
  }
  for (const r of await read(page, READING, DISPLAY_BAND)) {
    reading[r.sel] ??= { total: 0, values: new Set() };
    reading[r.sel].total += r.count;
    r.values.forEach((v) => reading[r.sel].values.add(v));
  }
  await page.close();
}
await browser.close();

const fails = [];
console.log('\nDISPLAY BAND — must match >= 1 element and compute --flar: 100');
for (const sel of DISPLAY_BAND) {
  const b = band[sel];
  const vals = [...b.values].filter(Boolean);
  const ok = b.total > 0 && vals.length === 1 && vals[0] === '100';
  if (b.total === 0) fails.push(`${sel} matches ZERO elements on all five routes`);
  else if (!(vals.length === 1 && vals[0] === '100'))
    fails.push(`${sel} computes --flar ${JSON.stringify(vals)}, expected ["100"]`);
  console.log(
    `  ${ok ? 'ok  ' : 'FAIL'} ${sel.padEnd(32)} ${String(b.total).padStart(3)} el  --flar ${JSON.stringify(vals).padEnd(9)} on ${b.routes.map((r) => r === '/' ? '/' : r.split('/').pop()).join(', ') || '(nowhere)'}`,
  );
}

console.log('\nREADING SURFACES — must compute --flar: 0 (the leak detector)');
for (const sel of READING) {
  const r = reading[sel];
  const vals = [...r.values].filter(Boolean);
  const ok = r.total === 0 || (vals.length === 1 && vals[0] === '0');
  if (r.total > 0 && !(vals.length === 1 && vals[0] === '0'))
    fails.push(`LEAK: ${sel} computes --flar ${JSON.stringify(vals)}, expected ["0"]`);
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${sel.padEnd(32)} ${String(r.total).padStart(3)} el  --flar ${JSON.stringify(vals)}`);
}

console.log('');
if (fails.length) {
  for (const f of fails) console.log('  ' + f);
  console.log(`\nFAILED: ${fails.length}`);
  process.exit(1);
}
console.log('OK — every band selector renders its value, no reading surface carries flare.');
