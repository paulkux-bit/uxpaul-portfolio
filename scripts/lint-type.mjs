// Usage: node scripts/lint-type.mjs   (no build required — parses source CSS)
//
// Typography gate for the v3 type system (`docs/type-system-v3-locked.md` §7).
// Parses app/globals.css and asserts the nine checks the locked doc enumerates.
//
// THIS SCRIPT IS THE MIGRATION CHECKLIST. It is red on purpose. Each commit in
// `docs/type-system-v3-migration-plan.md` (C1..C7) turns exactly one check
// green by changing the CODE. The rules are written once, at full strength, in
// C0 and are not softened afterwards: if a rule would have to bend to make a
// commit look clean, the commit is wrong, not the rule.
//
// Not wired into `npm run build` until C8. Until then it is a to-do list with a
// definition of done attached.
//
// WHAT THIS IS NOT: the Impeccable `detector` is a separate, external, VISUAL
// anti-pattern scanner and `/impeccable typeset` is an LLM authoring mode with
// no code, no config and no exit status. Neither reads app/globals.css, and
// neither asserts anything below. There is no overlap. See CLAUDE.md.
//
// Uses postcss (already present via @tailwindcss/postcss) rather than regex:
// globals.css has single-line multi-declaration rules, a clamp() hidden inside
// a var() fallback, !important overrides nested in @media, property names
// inside comments, and a font-size clamp expression embedded in a calc() on
// margin-block-start. Regex gets several of those wrong.
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import postcss from 'postcss';

const CSS_FILE = 'app/globals.css';
const FONTS_FILE = 'app/fonts.ts';
const JSX_ROOTS = ['app', 'components'];

// ── The system's fixed values (locked doc §3.1, §3.2, §4) ──────────────────
const WIDTH_BANDS = [100, 94, 88]; // §3.1 — there is no fourth value
const SIGNATURE_WEIGHTS = [340, 720]; // §3.2 — the reserved pair
const SIGNATURE_MIN_CEILING_PX = 40; // §3.2 — illegal below this
const MIN_FONT_PX = 14; // §2 — hard floor everywhere
const MIN_STEP_RATIO = 1.15; // §4 R5 — adjacent rungs, 320..2560
const VIEWPORT_MIN = 320;
const VIEWPORT_MAX = 2560;
const ROOT_PX = 16;

// ── Allowlist ──────────────────────────────────────────────────────────────
// EMPTY IN C0, ON PURPOSE. Every entry must carry a one-line reason.
//   widths[]    — exception surfaces exempt from the three-band rule (§6).
//                 C6 adds Also Shipped and the takes wall.
//   fvs[]       — selectors permitted to pin axes via font-variation-settings
//                 (§6: only .milestone__date and .text-qh-title survive). C6.
//   signature[] — the three placements allowed to use 340/720 (§3.2). C4.
// Match on exact selector string as written in globals.css.
const ALLOWLIST = {
  widths: [], // e.g. { selector: '.slot-large .mark', reason: '...' }
  fvs: [],
  signature: [],
};

// ── The ladder (§3.3), mapped to the selectors that carry each rung ────────
// Not stated in the doc, but provable: rungs 6 and 4 already match v3's clamps
// character-for-character, and rungs 5 and 2 already match its endpoints.
// C3 retunes rungs 5, 3 and 2. Check 3 is scoped to the CLAMPED rungs because
// §7.3 says "computed from the clamps" — the fixed rungs cannot satisfy 1.15 by
// construction (18/16 = 1.125, 16/14 = 1.143), so including them would make
// §3.3's "worst adjacent ratio is now 1.15" false as written and check 3
// unturnable by C3.
const RUNGS = [
  { rung: 6, role: 'Arrival crescendo', selector: '.milestone__date' },
  { rung: 5, role: 'Case-study hero', selector: '.hero-block__title' },
  { rung: 4, role: 'Section heading', selector: '.case-study-prose h2' },
  { rung: 3, role: 'Numbered headline', selector: '.friction-beat__headline' },
  { rung: 2, role: 'Standfirst', selector: '.case-study-prose .section-lede' },
];

// ── Value helpers ──────────────────────────────────────────────────────────

const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, ' ');

// px for a length token. rem is root-relative (16px); em is context-dependent
// and returns null so callers can skip rather than guess.
function toPx(token) {
  const m = /^(-?[\d.]+)(px|rem|em)?$/.exec(token.trim());
  if (!m) return null;
  const n = parseFloat(m[1]);
  if (m[2] === 'rem') return n * ROOT_PX;
  if (m[2] === 'px' || !m[2]) return n;
  return null; // em
}

// Split a function's argument list on top-level commas.
function splitArgs(s) {
  const out = [];
  let depth = 0;
  let cur = '';
  for (const ch of s) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) {
      out.push(cur);
      cur = '';
    } else cur += ch;
  }
  if (cur.trim()) out.push(cur);
  return out;
}

// Pull the first clamp(...) out of a value, even when wrapped in var(--x, clamp(...)).
function extractClamp(value) {
  const i = value.indexOf('clamp(');
  if (i === -1) return null;
  let depth = 0;
  for (let j = i + 5; j < value.length; j++) {
    if (value[j] === '(') depth++;
    else if (value[j] === ')') {
      depth--;
      if (depth === 0) return value.slice(i + 6, j);
    }
  }
  return null;
}

// Evaluate a clamp's preferred term (`Avw + Brem` / `Avw` / a length) at a viewport.
function evalPreferred(expr, vw) {
  let total = 0;
  const parts = expr.replace(/\s*-\s*/g, ' + -').split('+');
  for (const raw of parts) {
    const t = raw.trim();
    if (!t) continue;
    const vwm = /^(-?[\d.]+)vw$/.exec(t);
    if (vwm) {
      total += (parseFloat(vwm[1]) / 100) * vw;
      continue;
    }
    const px = toPx(t);
    if (px === null) return null;
    total += px;
  }
  return total;
}

// Resolve a font-size value to px at a given viewport. Returns null if unknowable.
function sizeAtViewport(value, vw) {
  const clampBody = extractClamp(value);
  if (clampBody) {
    const [lo, pref, hi] = splitArgs(clampBody).map((s) => s.trim());
    const loPx = toPx(lo);
    const hiPx = toPx(hi);
    const prefPx = evalPreferred(pref, vw);
    if (loPx === null || hiPx === null || prefPx === null) return null;
    return Math.min(Math.max(prefPx, loPx), hiPx);
  }
  return toPx(value.replace(/!important/g, '').trim());
}

// The declared ceiling of a font-size (clamp max, or the fixed value).
function ceilingPx(value) {
  const clampBody = extractClamp(value);
  if (clampBody) {
    const args = splitArgs(clampBody).map((s) => s.trim());
    return toPx(args[args.length - 1]);
  }
  return toPx(value.replace(/!important/g, '').trim());
}

// Every 'wdth' / 'wght' axis value inside a font-variation-settings string.
function fvsAxes(value) {
  const out = [];
  for (const m of value.matchAll(/['"](\w{4})['"]\s+([^,]+)/g)) {
    const num = parseFloat(m[2]);
    out.push({ axis: m[1], value: Number.isNaN(num) ? null : num, raw: m[2].trim() });
  }
  return out;
}

const allowed = (list, selector) => list.some((e) => e.selector === selector);

// ── Walk the stylesheet ────────────────────────────────────────────────────

const css = await readFile(CSS_FILE, 'utf8');
const root = postcss.parse(css, { from: CSS_FILE });

// Every declaration, tagged with the selector that owns it. @utility blocks
// are named without a leading dot in source; normalise so `.text-lede` and
// `text-lede` resolve the same way for allowlist / rung matching.
const decls = [];
root.walkDecls((decl) => {
  const parent = decl.parent;
  if (!parent || parent.type !== 'rule') {
    // @utility text-lede { ... } parses as an at-rule with params as the name.
    if (parent && parent.type === 'atrule' && parent.name === 'utility') {
      decls.push({
        selector: `.${parent.params.trim()}`,
        prop: decl.prop.toLowerCase(),
        value: decl.value,
        line: decl.source?.start?.line ?? 0,
      });
    }
    return;
  }
  decls.push({
    selector: parent.selector.replace(/\s+/g, ' ').trim(),
    prop: decl.prop.toLowerCase(),
    value: decl.value,
    line: decl.source?.start?.line ?? 0,
  });
});

const byProp = (p) => decls.filter((d) => d.prop === p);
// Font-size of a selector, for cross-referencing weight against size.
const sizeOf = (selector) => byProp('font-size').find((d) => d.selector === selector)?.value ?? null;

// ── The checks ─────────────────────────────────────────────────────────────

const checks = [];
const add = (id, title, failures, note) =>
  checks.push({ id, title, failures, note, pass: failures.length === 0 });

// 1 — width: font-stretch and FVS 'wdth' must be one of the three bands.
{
  const f = [];
  for (const d of byProp('font-stretch')) {
    if (allowed(ALLOWLIST.widths, d.selector)) continue;
    const raw = d.value.replace(/!important/g, '').trim();
    if (raw.includes('var(')) continue; // token-driven — resolved by the token's own value
    const n = parseFloat(raw);
    if (Number.isNaN(n) || !WIDTH_BANDS.includes(n))
      f.push({ selector: d.selector, line: d.line, detail: `font-stretch: ${raw}` });
  }
  for (const d of byProp('font-variation-settings')) {
    if (allowed(ALLOWLIST.widths, d.selector)) continue;
    for (const a of fvsAxes(d.value)) {
      if (a.axis !== 'wdth' || a.value === null) continue;
      if (!WIDTH_BANDS.includes(a.value))
        f.push({ selector: d.selector, line: d.line, detail: `FVS 'wdth' ${a.value}` });
    }
  }
  add(1, `Width is one of {${WIDTH_BANDS.join(', ')}} (§3.1)`, f);
}

// 2 — the 14px floor.
{
  const f = [];
  for (const d of byProp('font-size')) {
    // Smallest value the declaration can ever render: the clamp floor, or the fixed size.
    const clampBody = extractClamp(d.value);
    const px = clampBody
      ? toPx(splitArgs(clampBody)[0].trim())
      : toPx(d.value.replace(/!important/g, '').trim());
    if (px !== null && px < MIN_FONT_PX)
      f.push({ selector: d.selector, line: d.line, detail: `${d.value} = ${px}px` });
  }
  add(2, `No font-size below ${MIN_FONT_PX}px (§2)`, f);
}

// 3 — adjacent rungs hold >=1.15x at every viewport in 320..2560.
{
  const f = [];
  const resolved = RUNGS.map((r) => ({ ...r, value: sizeOf(r.selector) }));
  const missing = resolved.filter((r) => !r.value);
  for (const r of missing)
    f.push({
      selector: r.selector,
      line: 0,
      detail: `rung ${r.rung} (${r.role}) has no font-size — ladder cannot be verified`,
    });

  const usable = resolved.filter((r) => r.value);
  for (let i = 0; i < usable.length - 1; i++) {
    const hi = usable[i];
    const lo = usable[i + 1];
    let worst = Infinity;
    let worstVw = 0;
    for (let vw = VIEWPORT_MIN; vw <= VIEWPORT_MAX; vw++) {
      const a = sizeAtViewport(hi.value, vw);
      const b = sizeAtViewport(lo.value, vw);
      if (a === null || b === null || b === 0) continue;
      const ratio = a / b;
      if (ratio < worst) {
        worst = ratio;
        worstVw = vw;
      }
    }
    if (worst < MIN_STEP_RATIO)
      f.push({
        selector: `rung ${hi.rung} / rung ${lo.rung}`,
        line: byProp('font-size').find((d) => d.selector === hi.selector)?.line ?? 0,
        detail: `${worst.toFixed(3)}x at ${worstVw}px (${hi.selector} vs ${lo.selector})`,
      });
  }
  add(3, `Adjacent rungs >= ${MIN_STEP_RATIO}x across ${VIEWPORT_MIN}-${VIEWPORT_MAX}px (§4 R5)`, f);
}

// 4 — the 340/720 signature pair: >=40px ceiling AND an allowlisted placement.
{
  const f = [];
  const hits = [];
  for (const d of byProp('font-weight')) {
    const n = parseFloat(d.value);
    if (SIGNATURE_WEIGHTS.includes(n)) hits.push({ ...d, weight: n });
  }
  for (const d of byProp('font-variation-settings')) {
    for (const a of fvsAxes(d.value))
      if (a.axis === 'wght' && SIGNATURE_WEIGHTS.includes(a.value))
        hits.push({ ...d, weight: a.value });
  }
  for (const h of hits) {
    const size = sizeOf(h.selector);
    const ceil = size ? ceilingPx(size) : null;
    // (a) size gate
    if (ceil !== null && ceil < SIGNATURE_MIN_CEILING_PX)
      f.push({
        selector: h.selector,
        line: h.line,
        detail: `weight ${h.weight} at a ${ceil}px ceiling — signature is illegal below ${SIGNATURE_MIN_CEILING_PX}px`,
      });
    // (b) placement gate
    if (!allowed(ALLOWLIST.signature, h.selector))
      f.push({
        selector: h.selector,
        line: h.line,
        detail: `weight ${h.weight} is not one of the three allowlisted signature placements`,
      });
  }
  add(
    4,
    `The ${SIGNATURE_WEIGHTS.join('/')} signature is >= ${SIGNATURE_MIN_CEILING_PX}px and allowlisted (§3.2)`,
    f,
  );
}

// 5 — `strong` must have an authored weight in the base layer.
// Without `strong, b { font-weight: 600 }` prose <strong> falls through to
// Tailwind preflight's `bolder` -> 700, making 18px body the heaviest thing
// on the page (§4 R4).
{
  const f = [];
  const bare = decls.filter((d) => {
    const sels = d.selector.split(',').map((s) => s.trim());
    return sels.some((s) => s === 'strong' || s === 'b') && d.prop === 'font-weight';
  });
  if (bare.length === 0)
    f.push({
      selector: 'strong, b',
      line: 0,
      detail:
        "no base-layer rule authors a weight — <strong> inherits Tailwind preflight's `bolder` (700)",
    });
  add(5, 'Emphasis is authored, not inherited from preflight (§4 R4)', f);
}

// 6 — no color: color-mix(... currentColor ...). Text colour comes from tokens
// (§2, §4 R7). Scoped to the `color` property: currentColor mixes on borders and
// backgrounds are a different concern and the colour system does not ban them.
{
  const f = [];
  for (const d of decls) {
    if (d.prop !== 'color') continue;
    const v = d.value.toLowerCase();
    if (v.includes('color-mix(') && v.includes('currentcolor'))
      f.push({ selector: d.selector, line: d.line, detail: `color: ${d.value}` });
  }
  add(6, 'No color-mix(... currentColor ...) on text colour (§4 R7)', f);
}

// 7 — font-variation-settings only where allowlisted. FVS inherits as a string,
// so any descendant of an FVS rule is pinned and cannot be re-weighted (§4 R8).
{
  const f = [];
  for (const d of byProp('font-variation-settings')) {
    if (allowed(ALLOWLIST.fvs, d.selector)) continue;
    f.push({ selector: d.selector, line: d.line, detail: `font-variation-settings: ${d.value}` });
  }
  add(7, 'font-variation-settings only where allowlisted (§6)', f);
}

// 8a — STATIC: the variable font is configured with all three axes.
// next/font/google ships ONLY the default wght axis unless `axes` names the
// others. Without it every font-stretch and optical-sizing rule in the system
// is silently inert in production — a bug this repo actually shipped once.
// Green today; kept as a regression guard.
{
  const f = [];
  let src = '';
  try {
    src = stripComments(await readFile(FONTS_FILE, 'utf8'));
  } catch {
    f.push({ selector: FONTS_FILE, line: 0, detail: 'file not found' });
  }
  if (src) {
    const m = /axes\s*:\s*\[([^\]]*)\]/.exec(src);
    const declared = m ? [...m[1].matchAll(/['"](\w+)['"]/g)].map((x) => x[1]) : [];
    for (const axis of ['opsz', 'wdth']) {
      if (!declared.includes(axis))
        f.push({
          selector: FONTS_FILE,
          line: 0,
          detail: `axes: [...] does not load '${axis}' — every ${axis === 'wdth' ? 'font-stretch' : 'font-optical-sizing'} rule is inert`,
        });
    }
  }
  add('8a', 'app/fonts.ts loads the opsz + wdth axes (§2)', f);
}

// 8b — RUNTIME: a client-side probe that the variable font actually loaded.
// Every width decision in v3 is invisible in the Arial-based next/font fallback
// (§4 R9), and this is the only check that can fail in production while passing
// in CI. C7 adds the probe as app code.
{
  const f = [];
  const found = [];
  async function walk(dir) {
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
      const p = join(dir, e.name);
      if (e.isDirectory()) await walk(p);
      else if (/\.(tsx?|jsx?|mjs)$/.test(e.name)) {
        const s = stripComments(await readFile(p, 'utf8'));
        if (/document\.fonts|new FontFace|fonts\.ready|fonts\.check/.test(s)) found.push(p);
      }
    }
  }
  for (const r of JSX_ROOTS) await walk(r);
  if (found.length === 0)
    f.push({
      selector: JSX_ROOTS.join(', '),
      line: 0,
      detail:
        'no runtime font-load assertion found (document.fonts / FontFace) — width decisions are unverified against the Arial fallback',
    });
  add('8b', 'A runtime assertion that the variable font loaded (§7.8)', f);
}

// ── Known gap, surfaced rather than silently passed ────────────────────────
// The 720 half of the signature ships as a Tailwind arbitrary utility in JSX
// (font-[720]), which a globals.css-only parser cannot see. C4 adds the JSX
// scan alongside the allowlist. Reported, not asserted.
const jsxWeights = [];
{
  async function walk(dir) {
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
      const p = join(dir, e.name);
      if (e.isDirectory()) await walk(p);
      else if (/\.(tsx|jsx|mdx)$/.test(e.name)) {
        const s = await readFile(p, 'utf8');
        for (const m of s.matchAll(/\bfont-\[(\d{2,3})\]/g))
          jsxWeights.push({ file: p, weight: parseInt(m[1], 10) });
      }
    }
  }
  for (const r of JSX_ROOTS) await walk(r);
}

// ── Report ─────────────────────────────────────────────────────────────────

console.log(`type-lint: ${CSS_FILE} (${root.nodes.length} top-level nodes)\n`);

for (const c of checks) {
  console.log(`${c.pass ? '✓' : '✗'} ${c.id}. ${c.title}`);
  if (c.pass) {
    console.log('    PASS');
  } else {
    for (const x of c.failures) {
      const at = x.line ? `${CSS_FILE}:${x.line}` : '—';
      console.log(`    ✗ ${x.selector}  (${at})`);
      console.log(`        ${x.detail}`);
    }
  }
  console.log('');
}

if (jsxWeights.length) {
  const sig = jsxWeights.filter((w) => SIGNATURE_WEIGHTS.includes(w.weight));
  console.log(
    `⚠ UNCHECKED: ${jsxWeights.length} arbitrary font-weight utilit${jsxWeights.length === 1 ? 'y' : 'ies'} in JSX ` +
      `(${sig.length} using the ${SIGNATURE_WEIGHTS.join('/')} signature pair). ` +
      `Check 4 parses ${CSS_FILE} only and cannot see these. The JSX scan lands in C4.`,
  );
  for (const w of sig) console.log(`    font-[${w.weight}]  ${w.file}`);
  console.log('');
}

const passing = checks.filter((c) => c.pass).length;
const failing = checks.length - passing;
console.log(
  `Result: ${passing} of ${checks.length} passing, ${failing} failing` +
    (failing ? '  — each failure is a migration step, not a regression.' : ''),
);
process.exit(failing === 0 ? 0 : 1);
