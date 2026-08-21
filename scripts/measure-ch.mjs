/**
 * `ch` measure inventory.
 *
 * `ch` is the used advance of the "0" glyph IN THE FONT USED TO RENDER. Under
 * `font-display: swap` it resolves against the size-adjusted Arial fallback
 * first and re-resolves when the real font arrives, so every `ch`-based measure
 * on the site changes width at swap time — today, in Bricolage. This is the
 * second pre-existing layout shift the Commissioner work exposed
 * (docs/commissioner-linebreak-measurement.md; staging plan §1f).
 *
 *   node scripts/measure-ch.mjs
 *
 * Reports, per `ch` declaration in globals.css, at 390 / 768 / 1440: the
 * element's computed font-size, the browser's own resolution of the measure in
 * px, and a MEASURED `1ch` for that element.
 *
 * The conversion factor is measured per element rather than assumed, because
 * these selectors span several weight/width combinations and `ch` tracks all of
 * them. A probe child with `width: 1ch` inherits font-family, size, weight,
 * stretch and variation settings from the element, so the browser resolves the
 * same `ch` the `max-width` does.
 *
 * The fluid/fixed split is derived, not declared: an element whose font-size
 * differs across the three viewports is fluid, and `ch` on a fluid element
 * scales with its own font-size exactly as `em` does — which is why such a
 * measure cannot be frozen into `rem` without killing the behaviour the clamp
 * exists to provide.
 *
 * Nothing here converts anything. It produces the numbers a ruling needs.
 */

import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const CSS_FILE = 'app/globals.css';

const ROUTES = [
  '/',
  '/about',
  '/case-studies/uscg-bard',
  '/case-studies/us-navy-fdt-e',
  '/case-studies/nuuly',
];

const VIEWPORTS = [390, 768, 1440];

/* ── Parse the ch declarations out of globals.css ──────────────────────────
   A brace walker rather than a CSS parser: this only needs the selector that
   owns each `max-width: Nch`, and the nesting here is one level deep. */
const parseCh = () => {
  const lines = readFileSync(CSS_FILE, 'utf8').split('\n');
  const stack = [];
  const found = [];
  lines.forEach((line, i) => {
    const code = line.split('/*')[0];
    if (code.includes('{')) stack.push(line.split('{')[0].trim());
    const m = /max-width:\s*([\d.]+)ch/.exec(line);
    if (m) {
      const sel = stack.filter((s) => s && !s.startsWith('@')).at(-1);
      if (sel) found.push({ selector: sel, ch: parseFloat(m[1]), line: i + 1 });
    }
    if (code.includes('}')) stack.pop();
  });
  return found;
};

/**
 * Every element the selector matches, reduced to DISTINCT font signatures.
 *
 * Not `querySelector`: a measure rule can match elements set at different
 * sizes, weights or widths, and `ch` resolves against each element's own font.
 * When that happens, one authored `ch` value silently produces more than one
 * column width, which is a finding rather than a detail — reporting only the
 * first match would hide it.
 *
 * `governed` separates matching from winning. `:where(.case-study-prose) p` is
 * specificity 0,0,1 by design (CLAUDE.md: so component rules win), so it
 * matches 24 paragraphs but governs only the 12 that have no measure of their
 * own. Counting all 24 as one value rendering eight ways would be a false
 * finding; an element is governed only when its computed max-width IS this
 * declaration resolved against its own `ch`.
 */
const probe = (page, selector, chValue) =>
  page.evaluate(({ sel, chValue }) => {
    let els;
    try {
      els = [...document.querySelectorAll(sel)];
    } catch {
      return { error: 'unqueryable selector' };
    }
    if (!els.length) return null;

    const sigs = new Map();
    for (const el of els) {
      const cs = getComputedStyle(el);
      // A child inherits font-family / size / weight / stretch / variation
      // settings, so `1ch` inside it is the same `ch` the max-width resolves.
      const p = document.createElement('div');
      p.style.cssText = 'width:1ch;height:0;visibility:hidden;position:absolute;';
      el.appendChild(p);
      const chPx = p.getBoundingClientRect().width;
      p.remove();

      const rec = {
        fontSize: parseFloat(cs.fontSize),
        maxWidth: parseFloat(cs.maxWidth),
        chPx,
        weight: cs.fontWeight,
        stretch: cs.fontStretch,
      };
      // Does THIS declaration win here, or has a more specific rule replaced it?
      // 1px, not 0.5: the computed value is the browser's own sub-pixel
      // resolution of N*ch and rounds differently from this multiplication.
      rec.governed = Math.abs(rec.maxWidth - chValue * chPx) < 1;
      const key = `${rec.fontSize}|${rec.weight}|${rec.stretch}|${rec.chPx.toFixed(4)}`;
      const hit = sigs.get(key);
      if (hit) hit.count++;
      else sigs.set(key, { ...rec, count: 1, tag: el.tagName.toLowerCase(), cls: el.className });
    }
    const all = [...sigs.values()].sort((a, b) => b.count - a.count);
    // Three states, not two: this declaration wins somewhere, or it matches
    // elements but a more specific measure beats it, or it matches nothing.
    // Collapsing the middle case into "dead" would report a live-but-overridden
    // rule as absent, which is a different defect with a different fix.
    return { sigs: all.filter((s) => s.governed), overridden: all.filter((s) => !s.governed) };
  }, { sel: selector, chValue });

const decls = parseCh();
console.log(`${decls.length} \`ch\` declarations in ${CSS_FILE}\n`);

const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}
);

const rows = [];

for (const d of decls) {
  const per = {};
  let route = null;
  let overridden = null;

  for (const r of ROUTES) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' });
    const page = await ctx.newPage();
    await page.goto(BASE + r, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const hit = await probe(page, d.selector, d.ch);
    if (hit && !hit.error && !hit.sigs.length && hit.overridden.length && !overridden)
      overridden = { route: r, by: hit.overridden };
    if (hit && !hit.error && hit.sigs.length) {
      route = r;
      for (const w of VIEWPORTS) {
        await page.setViewportSize({ width: w, height: 900 });
        per[w] = (await probe(page, d.selector, d.ch)).sigs;
      }
    }
    await ctx.close();
    if (route) break;
  }

  if (!route) {
    rows.push({ ...d, route: null, overridden });
    continue;
  }

  // The dominant signature (most elements) drives the fluid/fixed call and the
  // conversion; any others are reported beside it as a split.
  const main = VIEWPORTS.map((w) => per[w][0]);
  const fluid = new Set(main.map((s) => s.fontSize.toFixed(2))).size > 1;
  const factors = main.map((s) => s.chPx / s.fontSize);
  rows.push({ ...d, route, per, main, fluid, factors });
}

await browser.close();

const dead = [];
for (const r of rows) {
  if (!r.route) {
    dead.push(r);
    continue;
  }
  const f = r.factors[0];
  const em = r.ch * f;
  console.log(`\n${r.selector}   ${r.ch}ch   (${CSS_FILE}:${r.line})  on ${r.route}`);
  console.log(
    `  ${r.fluid ? 'FLUID  (font-size clamps)' : 'FIXED  (font-size constant)'}` +
      `   weight ${r.main[2].weight}  stretch ${r.main[2].stretch}` +
      `   ${r.per[1440].reduce((a, s) => a + s.count, 0)} element(s)`
  );
  for (let i = 0; i < VIEWPORTS.length; i++) {
    const w = VIEWPORTS[i];
    const p = r.main[i];
    console.log(
      `    @${String(w).padStart(4)}  font ${p.fontSize.toFixed(2).padStart(6)}px` +
        `  measure ${p.maxWidth.toFixed(1).padStart(7)}px` +
        `  1ch ${p.chPx.toFixed(4)}px  =${(p.chPx / p.fontSize).toFixed(4)}em`
    );
  }
  const spread = Math.max(...r.factors) - Math.min(...r.factors);
  console.log(
    `    -> ${r.ch}ch = ${em.toFixed(4)}em` +
      (r.fluid
        ? `   (em preserves the clamp; rem would freeze it)`
        : `  = ${((em * r.main[2].fontSize) / 16).toFixed(4)}rem at ${r.main[2].fontSize}px`) +
      (spread > 0.0001 ? `   [factor varies by ${spread.toFixed(4)} across viewports]` : '')
  );
  if (r.per[1440].length > 1) {
    console.log(`    !! ONE VALUE, ${r.per[1440].length} RENDERED WIDTHS — this declaration governs elements set differently:`);
    for (const s of r.per[1440])
      console.log(
        `         ${String(s.count).padStart(3)}x  ${s.tag}${s.cls ? '.' + String(s.cls).split(' ').join('.') : ''}` +
          `  ${s.fontSize}px/${s.weight}/${s.stretch}  -> measure ${s.maxWidth.toFixed(1)}px`
      );
  }
}

const overriddenRows = dead.filter((r) => r.overridden);
const deadRows = dead.filter((r) => !r.overridden);

if (overriddenRows.length) {
  console.log(`\n${'='.repeat(70)}\nNEVER WINS — the selector matches, but a more specific measure beats it\neverywhere it does. Converting these changes nothing on screen:`);
  for (const r of overriddenRows) {
    console.log(`\n  ${r.selector}  ${r.ch}ch  (${CSS_FILE}:${r.line})  on ${r.overridden.route}`);
    for (const s of r.overridden.by)
      console.log(
        `      ${String(s.count).padStart(3)}x  ${s.tag}${s.cls ? '.' + String(s.cls).split(' ').join('.') : ''}` +
          `  ${s.fontSize}px/${s.weight}/${s.stretch}` +
          `  -> ${s.maxWidth.toFixed(1)}px wins, this rule would give ${(r.ch * s.chPx).toFixed(1)}px`
      );
  }
}

if (deadRows.length) {
  console.log(`\n${'='.repeat(70)}\nGOVERNS NOTHING — selector matches no element on any of the five routes:`);
  for (const r of deadRows) console.log(`  ${r.selector}  ${r.ch}ch  (${CSS_FILE}:${r.line})`);
}

mkdirSync('measurements', { recursive: true });
writeFileSync('measurements/ch-inventory.json', JSON.stringify(rows, null, 1));
console.log(`\nwrote measurements/ch-inventory.json`);
