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
 *   node scripts/measure-linebreaks.mjs <label> [cssVariant] [--exclude-hidden]
 *
 * IT COUNTS VISUALLY-HIDDEN TEXT BY DEFAULT, AND THE REASON IS THE NON-OBVIOUS
 * HALF. The filter below drops `visibility: hidden` and `display: none`, but
 * `.sr-only` uses the CLIP IDIOM — position absolute, a 1px box, clip to nothing
 * — which is neither. Those spans own text, have a non-zero rect, and are
 * counted. Three of them ship on `/` (one per card, case-study-card.tsx).
 *
 * They are counted ON PURPOSE rather than by oversight. Every baseline this
 * migration captured includes them, and elements are matched across runs BY
 * ORDINAL POSITION IN THE WALK. Dropping them by default would renumber the
 * walk, so a new run diffed against a stored baseline would compare two
 * different populations and manufacture changes that never happened. The
 * defect is real and its silent fix would be worse than itself.
 *
 * So: the count is PRINTED on every run, and exclusion is OPT-IN via
 * `--exclude-hidden`, valid only when BOTH sides of a diff were captured under
 * it. Never applied across that boundary.
 *
 * BASELINES ARE LOCAL AND GITIGNORED (`measurements/`, .gitignore:81). Nothing
 * in there is committed, deliberately: a current baseline is ~2 minutes from any
 * build, so committing 550 KB to save that is a bad trade.
 *
 * THE PRE-MIGRATION BASELINES ARE NOT REGENERABLE, AND THAT IS PERMANENT.
 * bricolage.json, after-0a, after-0b, c2-commissioner, c3-baseline, r9-* and
 * sweep-bricolage* were captured against a Bricolage build that no longer exists
 * on main. If they are gone from your working copy they are gone. Do not spend an
 * afternoon trying to reproduce them — their conclusions are recorded in
 * docs/commissioner-linebreak-measurement.md.
 *
 * Found 22 Aug 2026, after the same artifact had already been fixed in
 * sweep-candidates.mjs and not here — where it had inflated a card title's line
 * count by two and produced the claim that .case-card__title-link was "the
 * noisiest element in the whole sweep". See the correction header on
 * docs/commissioner-linebreak-measurement.md.
 */

import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';

const POSITIONAL = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const LABEL = POSITIONAL[0] ?? 'run';
const VARIANT = POSITIONAL[1] ?? 'none';
const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';

/* FALLBACK=1 aborts the woff2 so the size-adjusted Arial fallback renders.
   That is R9's control: the fallback is a DIFFERENT FACE at size-adjust
   105.43%, and R9 says anything that matters must survive it.

   It used to be contrasted here with a `nowdth` width control, and scoping an
   R9 question against that control is what let "The data was there." be
   excluded from Phase 0a as already-short-enough while it still reflowed at
   1440. The width control is now deleted (see VARIANTS); the lesson is that
   the fallback and any same-face variant are different questions, which is
   still true of every variant below.

   It also SUBSUMES scripts/measure-fallback-shift.mjs, deleted 22 Aug 2026:
   that script asked the same question about three hero selectors only.

   An env var rather than a third positional: argv[2] and argv[3] are already
   LABEL and VARIANT, and the two compose — a run can be fallback AND varied. */
const FALLBACK = process.env.FALLBACK === '1';

/* A flag rather than an env var, unlike FALLBACK: this one changes the shape of
   the recorded population, so it belongs where a reader of the command line
   sees it. FALLBACK changes what renders; this changes what is counted. */
const EXCLUDE_HIDDEN = process.argv.includes('--exclude-hidden');

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

  /* `nowdth` and `nowdthonly` were DELETED 22 Aug 2026, after the migration.
     Both injected `font-stretch: 100% !important` to neutralise the width axis.
     Commissioner has no wdth axis, so both were INERT — they would have
     reported a clean diff and let a reader conclude that width is neutral. It
     is not neutral, it is absent, and a tool that returns a confident wrong
     answer is the worst category in this project's fault tally.

     This is the same defect C3 deleted 49 instances of from globals.css and
     that lint:type check 10 now fails the build on. No lint reaches scripts/,
     which is the only reason these survived it.

     The runs that used them (r9-nowdth, sweep-bricolage-nowdth) are not
     reproducible either way: they were captured against a Bricolage build that
     no longer exists on main. Their conclusions are in
     docs/commissioner-linebreak-measurement.md, which is where a conclusion
     belongs. */
};

/* THE DELETION ABOVE CREATED THIS, SO IT IS PART OF THE DELETION.
   An unknown variant name used to be impossible to notice: the run does
   `if (VARIANTS[VARIANT]) addStyleTag(...)`, so a typo — or a command copied
   from a doc that still says `nowdth` — SILENTLY injected nothing and produced a
   normal run under a variant label. That is the same confident-wrong-answer
   class the deleted variants were removed for, and removing them without this
   would have moved the defect rather than fixed it. */
const KNOWN = new Set(Object.keys(VARIANTS));
const RETIRED = { nowdth: 'deleted 22 Aug 2026 — inert, Commissioner has no wdth axis',
                  nowdthonly: 'deleted 22 Aug 2026 — inert, Commissioner has no wdth axis' };
if (!KNOWN.has(VARIANT)) {
  const why = RETIRED[VARIANT] ? `\n  '${VARIANT}' was ${RETIRED[VARIANT]}.` : '';
  console.error(`unknown variant '${VARIANT}'.${why}\n  known: ${[...KNOWN].join(', ')}`);
  process.exit(1);
}

const collect = (excludeHidden) => {
  const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG', 'PATH', 'HEAD', 'META', 'LINK']);
  const out = [];
  const hidden = [];
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

    /* Detected by the OBSERVABLE PROPERTY rather than by class name: an element
       that owns text inside a box one pixel or less in either dimension cannot
       be read by a sighted visitor, however that was achieved. Matching
       `.sr-only` would only find the idiom this repo happens to use today. The
       zero case is already gone above, so this is exactly the 1px clip. */
    const isHidden = rect.width <= 1 || rect.height <= 1;
    if (isHidden) {
      hidden.push({ tag: el.tagName.toLowerCase(), head: ownText.slice(0, 40) });
      if (excludeHidden) continue;
    }

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

  /* The stored value stays the ARRAY — see the call site. Returning a pair here
     rather than counting in a second walk keeps ONE predicate: two walks would
     be two places for "what counts as hidden" to drift apart. */
  return { items: out, hidden };
};

const run = async () => {
  const browser = await chromium.launch(
    process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}
  );
  const result = { label: LABEL, variant: VARIANT, routes: {} };
  const hiddenSeen = [];
  let total = 0;

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

      const { items, hidden } = await page.evaluate(collect, EXCLUDE_HIDDEN);
      result.routes[`${route}@${vp.name}`] = items;
      hiddenSeen.push(...hidden.map((h) => ({ ...h, where: `${route}@${vp.name}` })));
      total += items.length;
      process.stdout.write(
        `${LABEL} ${route}@${vp.name}: ${items.length} elements` +
        (hidden.length ? `  (+${hidden.length} visually hidden${EXCLUDE_HIDDEN ? ', EXCLUDED' : ', counted'})` : '') +
        `\n`,
      );
    }
    await ctx.close();
  }

  await browser.close();
  mkdirSync('measurements', { recursive: true });
  writeFileSync(`measurements/${LABEL}.json`, JSON.stringify(result, null, 1));

  /* Printed at the point of use, every run, whether or not the flag is set. A
     defect recorded only in a document is a defect the next person inherits
     without reading about it. */
  const n = hiddenSeen.length;
  console.log(
    `\n${total} measurements recorded` +
    (EXCLUDE_HIDDEN
      ? `, ${n} visually-hidden EXCLUDED (--exclude-hidden).\n` +
        `  Only comparable against a baseline captured under the same flag.`
      : `, OF WHICH ${n} are visually hidden and counted.\n` +
        `  Pure population would be ${total - n}. Run with --exclude-hidden for that,\n` +
        `  and recapture the other side of the diff under the same flag — ordinals renumber.`),
  );
  if (n) {
    const by = {};
    for (const h of hiddenSeen) (by[`${h.tag} "${h.head}"`] ??= []).push(h.where);
    for (const [k, wheres] of Object.entries(by))
      console.log(`    ${String(wheres.length).padStart(2)}x  ${k}  on ${wheres.map((w) => w.split('@')[1]).join(', ')}`);
  }
};

run();
