/**
 * Line-break delta harness.
 *
 * Renders every text-bearing element on the shipped surfaces and records, per
 * element, how many line boxes it occupies and where each line breaks. Run once
 * per face; `diff-linebreaks.mjs` compares the JSON.
 *
 * Elements are matched across runs by ordinal position in the walk, because the
 * DOM is byte-identical between the two builds — only the font differs. A text
 * digest is stored per element so misalignment is detected rather than assumed
 * away.
 *
 *   node scripts/measure-linebreaks.mjs <label> [cssVariant]
 */

import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';

const LABEL = process.argv[2] ?? 'run';
const VARIANT = process.argv[3] ?? 'none';
const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';

/* FALLBACK=1 aborts the woff2 so the size-adjusted Arial fallback renders.
   That is R9's control, and it is NOT the same question as the `nowdth`
   variant: neutralising width compares Bricolage-at-88 with Bricolage-at-100,
   whereas the fallback is a DIFFERENT FACE at size-adjust 105.43%, wider than
   either. Scoping an R9 question against the width control is what let
   "The data was there." be excluded from Phase 0a as already-short-enough
   while it still reflowed at 1440.

   An env var rather than a third positional: argv[2] and argv[3] are already
   LABEL and VARIANT, and the two compose — a run can be fallback AND varied. */
const FALLBACK = process.env.FALLBACK === '1';

const ROUTES = [
  '/',
  '/about',
  '/case-studies/uscg-bard',
  '/case-studies/us-navy-fdt-e',
  '/case-studies/nuuly',
];

const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 900 },
  { name: 'tablet', width: 768, height: 1000 },
  { name: 'desktop', width: 1440, height: 1000 },
];

/* ── Variant CSS ──────────────────────────────────────────────────
   `target` is the realistic Commissioner end state rather than a naive
   swap: voice by rung per the spike's `soft` preset, the 19px body the
   x-height measurement implies, and the rung-0 split. Injected rather
   than built so both Commissioner configurations come from one build. */

const VARIANTS = {
  none: '',
  target: `
    /* voice by rung — spike 'soft' preset */
    :root { font-variation-settings: 'FLAR' 0, 'VOLM' 0; }
    .case-study-prose h2, .case-study-prose > h3,
    .friction-beat__headline, .resolution-block__headline,
    .text-cover, .text-statement {
      font-variation-settings: 'FLAR' 40, 'VOLM' 0;
    }
    .case-study-prose > h1, .milestone__date, .text-hero, .text-lede,
    .transformation, .hero-block__sentence {
      font-variation-settings: 'FLAR' 70, 'VOLM' 40;
    }
    /* body 18 -> 19, x-height match */
    .case-study-prose p { font-size: 1.1875rem; }
    /* rung 0 split: lowercase captions up to 15, all-caps eyebrows down to 13.
       Deliberately NOT a bare figcaption selector — bento glosses live in bare
       figcaptions at body size and are not rung 0. */
    figcaption.figure__caption, .text-caption, cite { font-size: 0.9375rem; }
    .text-eyebrow, .hero-block__eyebrow, .hero-block__callout-label { font-size: 0.8125rem; }
  `,
  readflare: `
    :root { font-variation-settings: 'FLAR' 15, 'VOLM' 0; }
  `,

  /* Control, run against the BRICOLAGE build. Neutralises every width
     declaration so Bricolage sets at wdth 100 everywhere — the same state
     Commissioner is permanently in, since it has no wdth axis. Comparing
     bricolage → bricolage-nowdth isolates how much of the Commissioner
     re-break is "the width band was doing fitting work" rather than "the new
     face is a different width". */
  nowdth: `
    * { font-stretch: 100% !important; font-variation-settings: normal !important; }
  `,

  /* Commissioner with only the 19px body, no voice and no rung-0 split. */
  body19: `
    .case-study-prose p { font-size: 1.1875rem; }
  `,

  /* Tracking steps for the display-band decision, 21 Aug 2026. Injected as
     named variants rather than written to globals.css, so the cost of each
     step is measurable without applying it. Step 1 puts --open on -0.020,
     which is exactly rung 6's existing value: the eye-derived step and the
     convention-derived correction of rung 5's anomaly land on the same
     number. Tracking is monotonic, so step2's changed set must be a SUPERSET
     of step1's; if it is not, the injection is wrong, not the value. */
  'track-step1': `
    .hero-block__sentence--open    { letter-spacing: -0.020em; }
    .hero-block__sentence--anxious { letter-spacing: -0.015em; }
    .milestone__date               { letter-spacing: -0.015em; }
  `,
  'track-step2': `
    .hero-block__sentence--open    { letter-spacing: -0.015em; }
    .hero-block__sentence--anxious { letter-spacing: -0.010em; }
    .milestone__date               { letter-spacing: -0.010em; }
  `,

  /* WIDTH ONLY. `nowdth` above also sets font-variation-settings: normal,
     which additionally strips the §6-sanctioned opsz pin on .milestone__date
     and all four .text-qh-title axis sets — fine for the Commissioner
     comparison it was written for, wrong for isolating the width axis, because
     it conflates "no wdth" with "no optical pins" across 5 elements.
     Matches NO_WIDTH in sweep-candidates.mjs. `nowdth` is left untouched so the
     earlier Commissioner runs stay comparable. */
  nowdthonly: `
    *, *::before, *::after { font-stretch: 100% !important; }
  `,
};

const collect = () => {
  const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG', 'PATH', 'HEAD', 'META', 'LINK']);
  const out = [];
  let ordinal = 0;

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
  let el = document.body;
  do {
    if (SKIP.has(el.tagName) || el.closest('svg')) continue;

    // Only elements that directly own visible text.
    const ownText = Array.from(el.childNodes)
      .filter((n) => n.nodeType === 3 && n.textContent.trim().length)
      .map((n) => n.textContent)
      .join(' ')
      .trim();
    if (!ownText) continue;

    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') continue;

    ordinal += 1;

    // Word-level break map: one Range per word, grouped by rect top.
    const lines = [];
    let current = null;
    const EPS = 2;
    for (const node of Array.from(el.childNodes)) {
      if (node.nodeType !== 3) {
        // inline child (e.g. <strong>, <a>) — treat its text as one token run
        if (node.nodeType === 1 && node.textContent.trim()) {
          const r = document.createRange();
          r.selectNodeContents(node);
          const rects = Array.from(r.getClientRects()).filter((x) => x.width > 0);
          for (const rr of rects) {
            if (!current || Math.abs(rr.top - current.top) > EPS) {
              current = { top: rr.top, words: [], left: rr.left, right: rr.right };
              lines.push(current);
            }
            current.right = Math.max(current.right, rr.right);
          }
          if (current) current.words.push(node.textContent.trim());
        }
        continue;
      }
      const text = node.textContent;
      const re = /\S+/g;
      let m;
      while ((m = re.exec(text)) !== null) {
        const r = document.createRange();
        r.setStart(node, m.index);
        r.setEnd(node, m.index + m[0].length);
        const rr = r.getClientRects()[0];
        if (!rr) continue;
        if (!current || Math.abs(rr.top - current.top) > EPS) {
          current = { top: rr.top, words: [], left: rr.left, right: rr.right };
          lines.push(current);
        }
        current.right = Math.max(current.right, rr.right);
        current.words.push(m[0]);
      }
    }

    out.push({
      ordinal,
      tag: el.tagName.toLowerCase(),
      cls: (typeof el.className === 'string' ? el.className : '').slice(0, 120),
      chars: ownText.length,
      words: ownText.split(/\s+/).length,
      head: ownText.slice(0, 60),
      fontSize: parseFloat(cs.fontSize),
      fontWeight: cs.fontWeight,
      fvs: cs.fontVariationSettings,
      boxWidth: Math.round(rect.width * 10) / 10,
      boxHeight: Math.round(rect.height * 10) / 10,
      // Document-absolute, not viewport-relative: + scrollY so the value holds
      // whether or not the page happens to be at scroll 0. This is what makes
      // an above-the-fold tier possible — without it there is no way to tell an
      // element a visitor sees from one 1200px down, and that tier is the only
      // one a visitor actually feels.
      boxTop: Math.round(rect.top + window.scrollY),
      lineCount: lines.length,
      lines: lines.map((l) => ({
        text: l.words.join(' '),
        width: Math.round((l.right - l.left) * 10) / 10,
      })),
    });
  } while ((el = walker.nextNode()));

  return out;
};

const run = async () => {
  const browser = await chromium.launch(
    process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}
  );
  const result = { label: LABEL, variant: VARIANT, routes: {} };

  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
      colorScheme: 'light',
      reducedMotion: 'reduce',
    });
    const page = await ctx.newPage();

    // Registered BEFORE any goto, or the first route loads the real font.
    if (FALLBACK) await page.route('**/*.woff2', (r) => r.abort());

    for (const route of ROUTES) {
      await page.goto(BASE + route, { waitUntil: 'networkidle' });
      if (VARIANTS[VARIANT]) await page.addStyleTag({ content: VARIANTS[VARIANT] });
      // fonts.ready resolves on load FAILURE too, so this is correct under
      // FALLBACK — but a stall here would hang a 15-route run silently rather
      // than erroring, so it degrades to the settle below instead of blocking.
      // measure-fallback-shift.mjs sidesteps this with a bare timeout; this
      // keeps the guarantee when it is available and gives it up when it is not.
      await Promise.race([
        page.evaluate(() => document.fonts.ready),
        new Promise((r) => setTimeout(r, 3000)),
      ]);
      // settle any entrance animation that could displace boxes
      await page.waitForTimeout(600);
      await page.evaluate(() => {
        document.querySelectorAll('*').forEach((n) => {
          n.style.animation = 'none';
          n.style.transition = 'none';
        });
      });
      await page.waitForTimeout(150);

      const data = await page.evaluate(collect);
      result.routes[`${route}@${vp.name}`] = data;
      process.stdout.write(`${LABEL} ${route}@${vp.name}: ${data.length} elements\n`);
    }
    await ctx.close();
  }

  await browser.close();
  mkdirSync('measurements', { recursive: true });
  writeFileSync(`measurements/${LABEL}.json`, JSON.stringify(result, null, 1));
};

run();
