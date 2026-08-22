// Pixel harness for the interaction migration.
//   node scripts/shoot-interaction.mjs <outdir> [--reduced]
//
// Committed rather than improvised so a future reader can rerun a proof instead
// of reconstructing one, the same principle as the lint fixtures.
//
// DO NOT SWEEP THIS AS ORPHANED. Nothing in the repo references it by name, so a
// string-grep census reports it as dead. That census is wrong: line ~71 below is
// one of four places recording the Also Shipped shelf's NON-INTERACTIVE decision,
// alongside app/data/quick-hits.ts:7, components/quick-hits/quick-hit.tsx:5 and
// app/page.tsx:84. It is a decision record that happens to be executable, and
// grep cannot tell those apart from dead code. Checked 22 Aug 2026.
//
// It exists because the extension-screenshot route was not trustworthy. Its null
// test — two captures with no change between — found two independent sources of
// nondeterminism: the mix-blend-mode cover art settling into one of two stable
// compositor states (14,196 px, all inside the art, zero outside), and the
// sticky header still settling after a programmatic scroll (89,947 px, max
// delta 245). At that second noise level a real regression is indistinguishable
// from the harness.
//
// Playwright removes every one of those variables:
//   page.hover()              a real :hover without moving an OS cursor
//   animations: 'disabled'    freezes the settle instead of waiting it out
//   type: 'png'               lossless, so no encoder variance
//   clip                      the element box only, so the sticky header is
//                             outside the frame entirely
//   reducedMotion             the media emulation the extension cannot reach
//
// ── I3: THREE ROUTES, NOT ONE ──────────────────────────────────────────────
//
// Through I1 and I2 this shot the home page only, which left .about-btn,
// .about-row, .about-work-band and .skip-link outside the frame — stated at the
// time as a coverage caveat rather than discovered later. I3 changes the button,
// the focus ring and five figure surfaces, most of them on routes never
// captured, so the harness is extended BEFORE the migration that needs it. The
// before/after baseline has to come from the same instrument.
//
// EVERY TARGET IS REPORTED as found or missing. A target that silently produces
// no capture is indistinguishable from one that passed, which is the failure
// mode this project keeps finding.
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const OUT = process.argv[2];
const REDUCED = process.argv.includes('--reduced');
if (!OUT) { console.error('usage: shoot-interaction.mjs <outdir> [--reduced]'); process.exit(2); }
const BASE = process.env.BASE_URL ?? 'http://localhost:3000';

const PUB = 'article:has(a[href^="/case-studies"])';
const UNPUB = 'article:not(:has(a[href^="/case-studies"]))';
const MAIL = 'a[href^="mailto:"]';

// The two-layer focus halo draws OUTSIDE the box: 2px ring + 3px offset + 6px
// glow = 11px, so a clip tight to the element would crop the very thing a
// focus capture is for. 16 leaves slack for the radius change itself.
const HALO = 16;

/**
 * name    file suffix; `<mode>-<name>.png`
 * sel     element to clip to; null means the viewport
 * states  rest | hover | focus
 * inflate px to grow the clip by, for anything drawing outside its box
 * prep    optional async (page) => void, run once before this target
 * focusOn optional descendant selector to focus instead of the element
 */
const ROUTES = [
  {
    path: '/',
    targets: [
      { name: 'page', sel: null, states: ['rest'] },
      { name: 'pub', sel: PUB, states: ['rest', 'hover', 'focus'], focusOn: 'a[href^="/case-studies"]', inflate: HALO },
      { name: 'unpub', sel: UNPUB, states: ['rest', 'hover'] },
      { name: 'mail', sel: MAIL, states: ['rest', 'hover', 'focus'], inflate: HALO },
      { name: 'theme-toggle', sel: '.theme-toggle', states: ['rest', 'hover', 'focus'], inflate: HALO },
      { name: 'nav-link', sel: '.nav-link', states: ['rest', 'hover', 'focus'], inflate: HALO },
      // DECISION RECORD, not an oversight: 'rest' ONLY, no hover and no focus,
      // because the Also Shipped shelf is non-interactive in v1. The ABSENCE of
      // the other two states is the thing being recorded. See the header.
      { name: 'quick-hit', sel: '.quick-hit', states: ['rest'] },
      // The skip link sits at translateY(-160%) until focused. Tab from the top
      // of the document is the only way to see it.
      { name: 'skip-link', sel: '.skip-link', states: ['focus'], inflate: HALO,
        prep: async (page) => { await page.evaluate(() => window.scrollTo(0, 0)); await page.keyboard.press('Tab'); } },
    ],
  },
  {
    path: '/about',
    targets: [
      { name: 'about-btn', sel: '.about-btn', states: ['rest', 'hover', 'focus'], inflate: HALO },
      { name: 'about-work-band', sel: '.about-work-band', states: ['rest', 'hover'] },
      { name: 'about-row-closed', sel: '.about-row', states: ['rest'] },
      { name: 'about-row-open', sel: '.about-row', states: ['rest'],
        prep: async (page) => { await page.locator('.about-row__summary').first().click(); await page.waitForTimeout(500); } },
      // inside the open drawer, so it follows the row above
      { name: 'about-roles-step', sel: '.about-roles__step', states: ['rest'] },
    ],
  },
  {
    path: '/case-studies/uscg-bard',
    targets: [
      { name: 'figure-image', sel: '.figure__image', states: ['rest'] },
      { name: 'hero-callout', sel: '.hero-block__callout', states: ['rest'] },
      { name: 'milestone', sel: '.milestone', states: ['rest'] },
      { name: 'bento-theme-media', sel: '.bento-theme__media', states: ['rest'] },
      { name: 'bento-band-media', sel: '.bento-band__media', states: ['rest'] },
      { name: 'bento-ribbon', sel: '.bento-ribbon__canvas', states: ['rest'] },
      // KNOWN TO RENDER NOWHERE, and kept on purpose so the gap stays printed
      // every run rather than becoming a target nobody remembers was dropped.
      // Probed on /, /about and both case studies: zero instances of each.
      // ModePair is already recorded as live-capable dead code in
      // docs/unspecified-surfaces.md; the three figure surfaces were not.
      { name: 'figure-framed', sel: '.figure--framed', states: ['rest'] },
      { name: 'figure-placeholder', sel: '.figure-placeholder', states: ['rest'] },
      { name: 'mode-pair-cell', sel: '.mode-pair__cell', states: ['rest'] },
      { name: 'mode-pair-label', sel: '.mode-pair__label', states: ['rest'] },
      { name: 'cs-link', sel: 'a[href^="https://www.linkedin.com"]', states: ['rest', 'focus'], inflate: HALO },
    ],
  },
];

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const notes = [];
const found = [];
const missing = [];

for (const scheme of ['light', 'dark']) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    colorScheme: scheme,
    reducedMotion: REDUCED ? 'reduce' : 'no-preference',
  });
  const page = await ctx.newPage();
  const tag = `${scheme}${REDUCED ? '-reduced' : ''}`;

  for (const route of ROUTES) {
    await page.goto(BASE + route.path, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);

    for (const t of route.targets) {
      const el = t.sel ? page.locator(t.sel).first() : null;
      if (t.prep) await t.prep(page);

      if (el && (await el.count()) === 0) {
        missing.push(`${tag} ${route.path} ${t.name} (${t.sel})`);
        continue;
      }
      if (el) { await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(300); }

      for (const state of t.states) {
        if (state === 'hover') { await el.hover(); await page.waitForTimeout(600); }
        if (state === 'focus') {
          if (t.focusOn) await el.locator(t.focusOn).focus();
          else if (!t.prep) await el.focus().catch(() => {});
          await page.waitForTimeout(600);
        }

        let clip;
        if (el) {
          // A focus capture frames the FOCUSED element, not its container.
          // Otherwise the ring's corners land mid-frame and any corner-based
          // analysis of the diff is measuring the wrong rectangle — which is
          // exactly what happened to the card's focus capture during I3.
          const box = state === 'focus' && t.focusOn ? el.locator(t.focusOn).first() : el;
          const b = await box.boundingBox();
          if (!b) { missing.push(`${tag} ${route.path} ${t.name}:${state} (no box)`); continue; }
          const g = t.inflate ?? 0;
          clip = {
            x: Math.max(0, b.x - g), y: Math.max(0, b.y - g),
            width: b.width + g * 2, height: b.height + g * 2,
          };
        }
        const buf = await page.screenshot({ animations: 'disabled', caret: 'hide', type: 'png', ...(clip ? { clip } : {}) });
        await writeFile(join(OUT, `${tag}-${t.name}-${state}.png`), buf);
        found.push(`${tag}-${t.name}-${state}`);

        if (state === 'hover') await page.mouse.move(0, 0);
        if (state === 'focus') await page.locator('body').evaluate((b2) => b2.ownerDocument.activeElement?.blur());
        await page.waitForTimeout(200);
      }
    }
  }

  notes.push(`${tag}: html.dark=${await page.evaluate(() => document.documentElement.classList.contains('dark'))}`);
  await ctx.close();
}

await browser.close();
console.log(notes.join('\n'));
console.log(`captured ${found.length}`);
if (missing.length) {
  console.log(`MISSING ${missing.length} — reported, not skipped:`);
  for (const m of missing) console.log(`  ${m}`);
}
console.log(`wrote ${OUT}`);
