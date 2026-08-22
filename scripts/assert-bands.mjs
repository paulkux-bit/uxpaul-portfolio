/**
 * Does the voice actually reach the elements it is supposed to reach, and
 * only those?
 *
 *   node scripts/assert-bands.mjs        (needs `next start` on :3000)
 *
 * WHY THIS EXISTS AND WHY IT IS NOT lint:type. lint:type check 11 asserts the
 * CSS flared list matches RUNGS' `voice: 'flared'` set. That is a comparison of
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
 * Three directions, because a leak, a gap and a stowaway are different failures:
 *
 *   1. Every FLARED selector matches >= 1 element, and every matched element
 *      computes --flar: 100. Catches a voice that matches but is overridden
 *      downstream.
 *   2. Every PLAIN selector matches >= 1 element and computes --flar: 0.
 *      NEW IN C5, AND THE POINT OF THE COMMIT. .text-cover and
 *      .friction-beat__headline were previously flared; they are now display
 *      type that must NOT be flared, which is a claim nothing checked before.
 *      An unasserted zero is indistinguishable from a value nobody set. The
 *      >= 1 requirement stays: a plain selector matching nothing is the same
 *      rung-5 blindness with a different value.
 *   3. Known body-rung elements compute --flar: 0. `--flar` inherits, so a
 *      value set on a CONTAINER leaks into every descendant, including prose.
 *      THIS IS THE ACTUAL LEAK DETECTOR: the line-break diff only sees a leak
 *      that happens to change a line break, and a leak into a short paragraph
 *      that does not re-break is invisible to it.
 *
 * Route coverage is reported per selector, because a selector whose only home
 * is a route outside the five would fail here for the wrong reason.
 */

import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const ROUTES = ['/', '/about', '/case-studies/uscg-bard', '/case-studies/us-navy-fdt-e', '/case-studies/nuuly'];

/** Mirrors RUNGS' `voice: 'flared'` set. lint:type check 11 keeps them equal. */
const FLARED = [
  '.milestone__date',     //  88px
  '.hero-block__title',   //  72px
  '.text-lede',           //  60px
  '.about-hero__pov',     //  51.2px @1440 — judgment, see RUNGS
  '.case-study-prose h2', //  52px — the boundary the cut was taken at
];

/**
 * Display type that the 52px cut leaves plain. `band: 'display'` in RUNGS,
 * `voice: 'plain'` — the two keys disagreeing here is the whole reason they
 * were split, so this list is where the split is proved to render.
 *
 * No CSS declares --flar: 0 on these. @property's initial-value does, which is
 * exactly why they need asserting: there is no declaration to read, so the only
 * way to know the value arrived is to ask the element.
 */
const PLAIN = [
  '.about-phase__title',      // 36.4px @1440, 40px ceiling
  '.text-cover',              // 32px
  '.friction-beat__headline', // 32px
];

/**
 * In globals.css, given no voice, rendering nowhere. Carried here so a reader
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
  // Added in C4a when the phase titles above them were flared. C5 made those
  // titles plain, so the ADJACENCY these two were guarding is gone — and they
  // stay, because the reason they stay is different from the reason they came:
  // /about is the one route whose h1 is flared while everything under it is
  // not, so it is where an inherited 100 would be least expected and least
  // visible. Keeping a check whose stated premise expired without restating it
  // is how an assertion turns into decoration.
  '.about-phase__note',
  '.about-contact__body',
  '.hero-block__role',
  '.figure__caption',
];

/**
 * `exclude` drops elements that also match a MAPPED selector — flared or plain,
 * not just flared. A reading selector like `.case-study-prose p` legitimately
 * matches `.milestone__date`, which is a <p> at rung 6 and correctly carries
 * 100 — counting that as a leak is the checker's bug, not the CSS's. Excluding
 * the whole map generically means this stays honest as the map grows or splits
 * again, rather than needing a :not() per member.
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

const MAPPED = [...FLARED, ...PLAIN];

const voiced = {}, reading = {};
for (const route of ROUTES) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(BASE + route, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  for (const r of await read(page, MAPPED)) {
    voiced[r.sel] ??= { total: 0, routes: [], values: new Set() };
    if (r.count) { voiced[r.sel].total += r.count; voiced[r.sel].routes.push(route); }
    r.values.forEach((v) => voiced[r.sel].values.add(v));
  }
  for (const r of await read(page, READING, MAPPED)) {
    reading[r.sel] ??= { total: 0, values: new Set() };
    reading[r.sel].total += r.count;
    r.values.forEach((v) => reading[r.sel].values.add(v));
  }
  await page.close();
}
await browser.close();

const fails = [];

/* One function, two expectations. A separate pass for plain would be a second
   place for the same rule to live, and one of them would drift. */
const assertVoice = (title, selectors, expected) => {
  console.log(`\n${title}`);
  for (const sel of selectors) {
    const b = voiced[sel];
    const vals = [...b.values].filter(Boolean);
    const ok = b.total > 0 && vals.length === 1 && vals[0] === expected;
    if (b.total === 0) fails.push(`${sel} matches ZERO elements on all five routes`);
    else if (!(vals.length === 1 && vals[0] === expected))
      fails.push(`${sel} computes --flar ${JSON.stringify(vals)}, expected ["${expected}"]`);
    console.log(
      `  ${ok ? 'ok  ' : 'FAIL'} ${sel.padEnd(32)} ${String(b.total).padStart(3)} el  --flar ${JSON.stringify(vals).padEnd(9)} on ${b.routes.map((r) => r === '/' ? '/' : r.split('/').pop()).join(', ') || '(nowhere)'}`,
    );
  }
};

assertVoice("FLARED — must match >= 1 element and compute --flar: 100", FLARED, '100');
assertVoice("PLAIN — display type below the 52px cut; must match >= 1 element and compute --flar: 0", PLAIN, '0');

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
console.log('OK — every mapped selector renders its voice, no reading surface carries flare.');
