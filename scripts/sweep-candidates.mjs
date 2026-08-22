/**
 * Hero-clause candidate harness.
 *
 * The three case-study hero clauses below hold one line only because
 * `font-stretch: 88%` buys them ~12% more characters per line. The next/font
 * fallback is Arial-based with no `wdth` axis, so during the swap window they
 * set at 100 and reflow — a live R9 violation on the LCP element of the three
 * most important pages (see docs/commissioner-linebreak-measurement.md,
 * Finding 1 and the addendum).
 *
 * The fix is copy. This measures what copy has to achieve.
 *
 *   node scripts/sweep-candidates.mjs                 # targets only
 *   node scripts/sweep-candidates.mjs candidates.json # targets + candidates
 *
 * THE GATE IS PX OF SET WIDTH, NOT A CHARACTER COUNT. Truncating the shipped
 * string one character at a time would prove only that 26 of THOSE characters
 * fit; `i/l/t/f` and `m/w/W` differ by more than 2x in advance, so a character
 * budget sends the author at the wrong target and the candidates then fail for
 * reasons the number did not predict. A character count is reported beside the
 * px, explicitly as a drafting heuristic and not as the gate.
 *
 * EVERY NUMBER THIS PRINTS IS WIDTH-NEUTRALISED. The injected rule sets wdth 100
 * before anything is read, so the "sets @wdth 100" column is the SHIPPED STRING AT
 * WIDTH 100 and never its as-shipped width at 88. That column was briefly labelled
 * "shipped sets", which reads as as-shipped and cost a round of reconciliation
 * against another rig. Room is unaffected either way: it is the parent <h1>'s
 * content box, which is layout-derived and independent of font-stretch.
 *
 * Method: the real page, at the real rung-5 clamp, in the real container, with
 * width neutralised to 100 by an injected rule. Set width is read with
 * `white-space: nowrap` applied, so it is the string's intrinsic width whether
 * or not it currently wraps. Available width is the parent <h1>'s content box.
 *
 * A clause must clear its target at BOTH edges of the band it holds at 88 —
 * the container and the font-size both grow with the viewport, so the two
 * edges are two different constraints and the binding one is not always the
 * same. Both are reported; `need` is the worse of them.
 *
 * candidates.json shape — a wording is only ever reported measured:
 *   { "uscg-bard-anxious": ["...", "..."], "nuuly-open": ["..."] }
 */

import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const CANDIDATE_FILE = process.argv[2] ?? null;

/* Width neutralised the same way the `bricolage-nowdth` control does it: the
   state every one of these clauses is in during the swap window, and the state
   Commissioner would put them in permanently. */
const NO_WIDTH = '*, *::before, *::after { font-stretch: 100% !important; }';

/* The three that lose their single-line band. The other three hero clauses
   ("until someone works it.", "The data was there.", "and no process.") keep
   theirs at width 100 and are deliberately absent — they need no copy work. */
const CLAUSES = [
  {
    key: 'uscg-bard-anxious',
    route: '/case-studies/uscg-bard',
    sel: '.hero-block__sentence--anxious',
    band: [560, 928],
  },
  {
    key: 'us-navy-fdt-e-open',
    route: '/case-studies/us-navy-fdt-e',
    sel: '.hero-block__sentence--open',
    band: [528, 976],
  },
  {
    key: 'nuuly-open',
    route: '/case-studies/nuuly',
    sel: '.hero-block__sentence--open',
    band: [544, 960],
  },
];

/* ── Card titles: a different question from the hero clauses ──────────────
   The hero clauses ask "does this hold ONE line inside a band". The home card
   titles ask "do these two cards AGREE", which is a position question a line
   count cannot answer: in the current render BARD's title starts HIGHER than
   FDT-E's precisely because it has more lines. So this pair is measured on
   line count AND on the title's top edge.

   .case-card__title-link was the noisiest element in the whole earlier sweep,
   oscillating 3/4/5 lines across the viewport range in BOTH faces, so a
   single-viewport check would miss the failure mode it actually has. */
const CARD_PAIR = {
  route: '/',
  // Indexed, not nth-of-type: the titles are .case-card__title-link inside
  // <h2 class="text-cover">, and the card WRAPPER carries no stable class to
  // key off. There are three cards; the top row is 0 and 1.
  sel: '.case-card__title-link',
  a: { label: 'BARD', i: 0 },
  b: { label: 'FDT-E', i: 1 },
};

const SWEEP_MIN = 320;
const SWEEP_MAX = 1600;
const SWEEP_STEP = 16;

/** Intrinsic set width of `text` in this element, and the room it has. */
const measure = (page, sel, text) =>
  page.evaluate(
    ({ sel, text }) => {
      const el = document.querySelector(sel);
      const original = el.textContent;
      if (text !== null) el.textContent = text;

      const prevWS = el.style.whiteSpace;
      el.style.whiteSpace = 'nowrap';
      const range = document.createRange();
      range.selectNodeContents(el);
      const set = range.getBoundingClientRect().width;
      el.style.whiteSpace = prevWS;

      // Room is the parent <h1>'s content box: the clause is a block-level span
      // inside it, so that is the width it actually gets to wrap in.
      const parent = el.parentElement;
      const cs = getComputedStyle(parent);
      const avail =
        parent.getBoundingClientRect().width -
        parseFloat(cs.paddingLeft) -
        parseFloat(cs.paddingRight);

      const fontSize = parseFloat(getComputedStyle(el).fontSize);
      if (text !== null) el.textContent = original;
      return { set, avail, fontSize };
    },
    { sel, text }
  );

/** The viewport band in which `text` occupies exactly one line. */
const sweepBand = async (page, sel, text) => {
  const bands = [];
  for (let w = SWEEP_MIN; w <= SWEEP_MAX; w += SWEEP_STEP) {
    await page.setViewportSize({ width: w, height: 900 });
    const lines = await page.evaluate(
      ({ sel, text }) => {
        const el = document.querySelector(sel);
        const original = el.textContent;
        if (text !== null) el.textContent = text;
        const range = document.createRange();
        range.selectNodeContents(el);
        const rects = [...range.getClientRects()].filter((r) => r.width > 0.5);
        const n = new Set(rects.map((r) => Math.round(r.top))).size;
        if (text !== null) el.textContent = original;
        return n;
      },
      { sel, text }
    );
    const last = bands.at(-1);
    if (last && last.lines === lines) last.to = w;
    else bands.push({ from: w, to: w, lines });
  }
  return bands.filter((b) => b.lines === 1);
};

const fmt = (n) => n.toFixed(1).padStart(7);

const candidates = CANDIDATE_FILE
  ? JSON.parse(readFileSync(CANDIDATE_FILE, 'utf8'))
  : {};

const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}
);

for (const c of CLAUSES) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: 'light' });
  const page = await ctx.newPage();
  await page.goto(BASE + c.route, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: NO_WIDTH });

  // WARMUP. NO_WIDTH is a font-variation change, and the wdth-100 instance is
  // not necessarily resolved by the time the next measurement runs — awaiting
  // fonts.ready ONCE at setup does not cover an instance requested afterwards.
  // Without this the FIRST measurement of each clause renders against the
  // previous instance and reads wide, which is a defect that looks like data
  // rather than like an error. One throwaway read, then re-await, costs ~50ms
  // and removes the whole class. Found 21 Aug 2026 when two independent rigs
  // disagreed by 60px on exactly one number: each rig's first.
  await measure(page, c.sel, null);
  await page.evaluate(() => document.fonts.ready);

  const shipped = await page.evaluate(
    (sel) => document.querySelector(sel).textContent.trim(),
    c.sel
  );

  console.log(`\n${'='.repeat(78)}`);
  console.log(`${c.key}   ${c.route}  ${c.sel}`);
  console.log(`shipped: "${shipped}"  (${shipped.length} chars)`);
  console.log(`band held at wdth 88: ${c.band[0]}-${c.band[1]}px\n`);

  // Targets: the two edges of the band it must reproduce at width 100. Both
  // the container and the font-size grow with the viewport and they do not
  // grow at the same rate, so each edge is its own constraint. The binding one
  // is the larger set/room RATIO, not the smaller room in px — a string sized
  // to clear the narrow low edge is scaled up by the clamp at the high edge and
  // can fail there. Reporting only min(room) would set the wrong target.
  const edges = [];
  for (const edge of c.band) {
    await page.setViewportSize({ width: edge, height: 900 });
    const m = await measure(page, c.sel, null);
    edges.push({ edge, ...m, ratio: m.set / m.avail });
    const over = m.set - m.avail;
    console.log(
      `  @${String(edge).padStart(4)}px  font ${m.fontSize.toFixed(1)}px` +
        `  room ${fmt(m.avail)}px  sets @wdth 100 ${fmt(m.set)}px` +
        `  ${over > 0 ? `OVER by ${over.toFixed(1)}px (${((over / m.set) * 100).toFixed(1)}% must come out)` : `fits, ${(-over).toFixed(1)}px spare`}`
    );
  }
  const bind = edges.reduce((a, e) => (e.ratio > a.ratio ? e : a));
  console.log(
    `\n  TARGET: set under ${bind.avail.toFixed(1)}px at the ${bind.edge}px viewport ` +
      `(binding edge, font ${bind.fontSize.toFixed(1)}px).` +
      `\n          That is ${((1 - 1 / bind.ratio) * 100).toFixed(1)}% off the shipped set width. ` +
      `At ${(shipped.length / (edges[0].set / edges[0].fontSize)).toFixed(2)} chars per em today, ` +
      `roughly ${Math.ceil(shipped.length * (1 - 1 / bind.ratio))} characters — a drafting heuristic, not the gate.`
  );

  const list = candidates[c.key] ?? [];
  if (list.length) {
    console.log(`\n  candidates (${list.length}):`);
    for (const text of list) {
      const results = [];
      for (const edge of c.band) {
        await page.setViewportSize({ width: edge, height: 900 });
        results.push({ edge, ...(await measure(page, c.sel, text)) });
      }
      const holds = results.every((r) => r.set <= r.avail);
      const worst = results.reduce((a, r) => (r.set - r.avail > a.set - a.avail ? r : a));
      console.log(
        `\n    ${holds ? 'PASS' : 'FAIL'}  "${text}"  (${text.length} chars)`
      );
      for (const r of results)
        console.log(
          `          @${String(r.edge).padStart(4)}px  sets ${fmt(r.set)}px  room ${fmt(r.avail)}px  ${r.set <= r.avail ? 'ok' : `over by ${(r.set - r.avail).toFixed(1)}px`}`
        );
      if (holds) {
        const oneLine = await sweepBand(page, c.sel, text);
        console.log(
          `          band at wdth 100: ` +
            (oneLine.length
              ? oneLine.map((b) => `${b.from}-${b.to}px`).join(', ')
              : 'never one line')
        );
      } else {
        console.log(
          `          still ${(worst.set - worst.avail).toFixed(1)}px too wide at ${worst.edge}px`
        );
      }
    }
  }

  await ctx.close();
}

/* ── The card pair ────────────────────────────────────────────────────── */
if (process.env.CARDS === '1') {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: 'light' });
  const page = await ctx.newPage();
  await page.goto(BASE + CARD_PAIR.route, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  console.log(`\n${'='.repeat(78)}\nCARD PAIR — line count and TOP EDGE alignment`);
  const rows = [];
  for (let w = SWEEP_MIN; w <= SWEEP_MAX; w += SWEEP_STEP) {
    await page.setViewportSize({ width: w, height: 1000 });
    const r = await page.evaluate(({ sel, a, b }) => {
      const els = [...document.querySelectorAll(sel)];
      const read = (i) => {
        const el = els[i];
        if (!el) return null;
        // THE sr-only SPAN MUST BE EXCLUDED. These links carry a visually-hidden
        // ". BARD, U.S. Coast Guard case study" for screen readers. It is
        // clipped to 1px but still generates client rects, so selectNodeContents
        // on the link counted it as extra LINES — inflating every card title by
        // two. The earlier sweep that recorded this element as "3/4/5 lines
        // oscillating" was measuring that artifact, not the headline.
        const hidden = [...el.querySelectorAll('.sr-only')];
        const prev = hidden.map((h) => h.style.display);
        hidden.forEach((h) => { h.style.display = 'none'; });
        const rg = document.createRange();
        rg.selectNodeContents(el);
        const rects = [...rg.getClientRects()].filter((x) => x.width > 0.5);
        const out = { lines: new Set(rects.map((x) => Math.round(x.top))).size,
                      top: Math.round(el.getBoundingClientRect().top) };
        hidden.forEach((h, k) => { h.style.display = prev[k]; });
        return out;
      };
      return { a: read(a.i), b: read(b.i) };
    }, CARD_PAIR);
    if (r.a && r.b) rows.push({ w, aL: r.a.lines, bL: r.b.lines, dTop: r.a.top - r.b.top });
  }
  // compress to bands of identical (aL,bL,aligned)
  const bands = [];
  for (const x of rows) {
    const aligned = Math.abs(x.dTop) <= 1;
    const last = bands.at(-1);
    if (last && last.aL === x.aL && last.bL === x.bL && last.aligned === aligned) last.to = x.w;
    else bands.push({ from: x.w, to: x.w, aL: x.aL, bL: x.bL, aligned, dTop: x.dTop });
  }
  for (const bd of bands)
    console.log(`  ${String(bd.from).padStart(4)}-${String(bd.to).padStart(4)}px   ` +
      `${CARD_PAIR.a.label} ${bd.aL}L / ${CARD_PAIR.b.label} ${bd.bL}L   ` +
      `top edges ${bd.aligned ? 'ALIGNED' : `off by ${bd.dTop}px`}`);
  await ctx.close();
}

await browser.close();
