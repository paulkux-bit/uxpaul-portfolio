// Usage: node scripts/lint-color.mjs   (no build required — parses source)
//
// Colour gate for the v2 colour system (`docs/color-system-v2-locked.md` §7).
// Parses app/globals.css and every .tsx/.mdx.
//
// THIS SCRIPT IS THE MIGRATION CHECKLIST. It is red on purpose. Each commit
// turns assertions green by changing the CODE. The rules are written once, at
// full strength, in K0 and are not softened afterwards: a rule that has to bend
// to make a commit look clean means the commit is wrong.
//
// Not wired into `npm run build` until K5.
//
// Third in the family, after lint-type.mjs and lint-space.mjs. Same house
// style, same postcss dependency, same allowlist-with-a-reason discipline, and
// the same lesson carried forward: four checks in the spacing migration passed
// for a reason other than the one intended, so every assertion here ships with
// a deliberately failing case proved before any value moves.
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import postcss from 'postcss';

const CSS_FILE = 'app/globals.css';
const JSX_ROOTS = ['app', 'components'];

// ── The palette's shape (§4) ───────────────────────────────────────────────
const SURFACES = ['--bg-canvas', '--bg-surface', '--bg-surface-elevated', '--bg-sunken'];
const TEXTS = ['--text-primary', '--text-secondary', '--text-muted', '--text-subtle'];
const BORDERS = ['--border-subtle', '--border-default', '--border-strong', '--border-interactive'];
const SEMANTIC = [...SURFACES, ...TEXTS, ...BORDERS];

// §5 floors. --text-subtle is AA-large only; everything else is AA-normal.
const FLOOR_NORMAL = 4.5;
const FLOOR_LARGE = 3.0;
const LARGE_ONLY = new Set(['--text-subtle']);

// §9 / R1: state layers, scrims and shadows may carry alpha. Nothing that names
// a surface, a text role or a border may. These are the sanctioned names.
const ALPHA_ALLOWED = /^--(focus-ring|focus-glow|shadow-rest|shadow-hover)$/;

// ── Allowlist ──────────────────────────────────────────────────────────────
// EMPTY IN K0, ON PURPOSE. Every entry carries a one-line reason.
const ALLOWLIST = {
  literals: [], // inline colours that may stay: { selector, prop, reason }
  pairs: [], // text-on-surface pairs exempt from a floor: { text, surface, mode, reason }
};
const inList = (l, p) => l.some(p);

// ── oklch → contrast ───────────────────────────────────────────────────────
// Implemented rather than estimated, because §5 and R5 both require the number
// to be measured and written down.
function oklchToLinearRgb(L, C, Hdeg) {
  const h = (Hdeg * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((v) => Math.min(1, Math.max(0, v)));
}
const relLuminance = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
function contrast(a, b) {
  const la = relLuminance(oklchToLinearRgb(...a));
  const lb = relLuminance(oklchToLinearRgb(...b));
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

// ── Parse ──────────────────────────────────────────────────────────────────
const css = await readFile(CSS_FILE, 'utf8');
const root = postcss.parse(css, { from: CSS_FILE });

/** mode -> { token -> raw value } */
const byMode = { light: new Map(), dark: new Map() };
const allDefs = new Map();
const perMode = new Map();
const decls = [];
root.walkDecls((d) => {
  const p = d.parent;
  const sel =
    p.type === 'rule'
      ? p.selector.replace(/\s+/g, ' ').trim()
      : p.type === 'atrule'
        ? `@${p.name} ${p.params || ''}`.trim()
        : '?';
  const rec = { prop: d.prop, value: d.value.trim(), sel, line: d.source?.start?.line ?? 0 };
  decls.push(rec);
  if (!d.prop.startsWith('--')) return;
  allDefs.set(d.prop, rec);
  // Keyed by SELECTOR + property as well: allDefs alone collides :root with
  // .dark, so a per-mode check would only ever see the last definition of each
  // token — 12 of 24. Found by the count disagreeing with the palette's size.
  perMode.set(`${sel}|${d.prop}`, rec);
  // @theme static and :root are the light/default layer; .dark overrides it.
  if (sel === ':root' || sel.startsWith('@theme')) byMode.light.set(d.prop, rec.value);
  if (sel === '.dark' || sel.startsWith('html.dark')) byMode.dark.set(d.prop, rec.value);
});
// dark inherits anything it does not override
for (const [k, v] of byMode.light) if (!byMode.dark.has(k)) byMode.dark.set(k, v);

/** The oklch() body, paren-balanced. A regex cannot do this: the old pattern
 *  allowed ONE level of nesting, so it read a literal oklch(0.165 0.020 50)
 *  correctly and truncated a composed calc(var(--chroma-unit) * 3) at the first
 *  inner ')'. Check 4 then failed with "cannot resolve" on every pair — still
 *  red, so the score never lied, but red for the wrong reason and no longer
 *  measuring anything. Depth-count instead. */
function oklchBody(value) {
  const i = value.search(/oklch\(/i);
  if (i < 0) return null;
  let depth = 0;
  for (let j = i + 5; j < value.length; j++) {
    if (value[j] === '(') depth++;
    else if (value[j] === ')' && --depth === 0) return value.slice(i + 6, j);
  }
  return null;
}

/** Resolve a composed oklch() to [L, C, H], or null. */
function resolveOklch(value, mode) {
  const body = oklchBody(value);
  if (body === null) return null;
  if (/\//.test(body)) return null; // has alpha; assertion 2 owns it
  const parts = [];
  let depth = 0;
  let cur = '';
  for (const ch of body) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (/\s/.test(ch) && depth === 0) {
      if (cur.trim()) parts.push(cur.trim());
      cur = '';
    } else cur += ch;
  }
  if (cur.trim()) parts.push(cur.trim());
  if (parts.length < 3) return null;
  const num = (t) => {
    let s = t;
    for (let i = 0; i < 6 && /var\(/.test(s); i++) {
      s = s.replace(/var\(\s*(--[\w-]+)\s*(?:,([^)]*))?\)/g, (w, n, fb) => {
        const v = byMode[mode].get(n);
        return v !== undefined ? v : fb !== undefined ? fb.trim() : w;
      });
    }
    const cm = /^calc\((.*)\)$/s.exec(s.trim());
    if (cm) {
      const e = cm[1];
      if (!/^[-+*/(). 0-9]+$/.test(e)) return NaN;
      try {
        return Function(`"use strict";return (${e})`)();
      } catch {
        return NaN;
      }
    }
    const f = parseFloat(s);
    return Number.isNaN(f) ? NaN : f;
  };
  const [L, C, H] = parts.map(num);
  return [L, C, H].some(Number.isNaN) ? null : [L, C, H];
}

// JSX/MDX scan
const jsxHits = [];
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
      const src = await readFile(p, 'utf8');
      src.split('\n').forEach((line, i) => {
        for (const m of line.matchAll(/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/g))
          jsxHits.push({ where: `${p}:${i + 1}`, detail: m[0] });
      });
    }
  }
}
for (const r of JSX_ROOTS) await walk(r);

// ── Checks ─────────────────────────────────────────────────────────────────
const checks = [];
const add = (id, title, failures) =>
  checks.push({ id, title, failures, pass: failures.length === 0 });

// 1 — everything is oklch.
{
  const f = [];
  const NAMED =
    /(?<![\w-])(white|black|red|blue|green|gray|grey|silver|maroon|olive|lime|aqua|teal|navy|fuchsia|purple|orange|pink|brown|beige|ivory|coral|gold)(?![\w-])/i;
  for (const d of decls) {
    const v = d.value;
    if (/#[0-9a-fA-F]{3,8}\b/.test(v))
      f.push({ where: `${CSS_FILE}:${d.line}`, detail: `hex — ${d.sel} { ${d.prop}: ${v} }` });
    if (/\brgba?\(/i.test(v))
      f.push({ where: `${CSS_FILE}:${d.line}`, detail: `rgb() — ${d.sel} { ${d.prop} }` });
    if (/\bhsla?\(/i.test(v))
      f.push({ where: `${CSS_FILE}:${d.line}`, detail: `hsl() — ${d.sel} { ${d.prop} }` });
    if (NAMED.test(v) && /color|background|border|fill|stroke/i.test(d.prop))
      f.push({ where: `${CSS_FILE}:${d.line}`, detail: `named colour — ${d.sel} { ${d.prop}: ${v} }` });
  }
  for (const h of jsxHits) f.push({ where: h.where, detail: `${h.detail} in JSX/MDX` });
  add(1, 'Every colour is oklch — no hex, rgb(), hsl() or named (§7.1)', f);
}

// 2 — no alpha on a surface, text or border token (R1).
{
  const f = [];
  // Iterate EVERY definition record, not allDefs — that map is keyed by
  // property name, so :root and .dark collide and only the last survives. An
  // alpha added to the light --border-strong went undetected until the
  // both-directions proof injected one. Same collision as check 3; fixing one
  // site and not the other is how a check passes for the wrong reason.
  for (const rec of decls) {
    const tok = rec.prop;
    if (!SEMANTIC.includes(tok)) continue;
    if (ALPHA_ALLOWED.test(tok)) continue;
    if (/oklch\([^)]*\/[^)]*\)/i.test(rec.value) || /color-mix\([^)]*transparent/i.test(rec.value))
      f.push({ where: `${CSS_FILE}:${rec.line}`, detail: `alpha on ${tok} (${rec.sel}): ${rec.value}` });
  }
  add(2, 'No alpha on a surface, text or border token (R1, §7.2)', f);
}

// 3 — no semantic token authored as a literal oklch(). R4 is about DEPENDENCE:
// a literal value stops following its primitive, which is how the last palette
// drifted. A multiplier or degree offset keeps the token dependent, so both are
// legal; a bare oklch(0.310 0.020 58) is not.
{
  const f = [];
  for (const mode of ['light', 'dark']) {
    for (const tok of SEMANTIC) {
      const rec = perMode.get(`${mode === 'dark' ? '.dark' : ':root'}|${tok}`);
      if (!rec) continue;
      if (inList(ALLOWLIST.literals, (a) => a.selector === rec.sel && a.prop === tok)) continue;
      if (!/var\(\s*--(chroma-unit|hue-ground|hue-surface|hue-text)\s*\)/.test(rec.value))
        f.push({
          where: `${CSS_FILE}:${rec.line}`,
          detail: `${mode}: ${tok} is independent of the primitives — ${rec.value}`,
        });
    }
  }
  add(3, 'No semantic token authored independently of a primitive (R4, §7.3)', f);
}

// 4 — every text-on-surface pair clears its floor, computed from the tokens.
{
  const f = [];
  for (const mode of ['light', 'dark']) {
    for (const t of TEXTS) {
      for (const s of SURFACES) {
        if (inList(ALLOWLIST.pairs, (a) => a.text === t && a.surface === s && a.mode === mode))
          continue;
        const tv = resolveOklch(byMode[mode].get(t) ?? '', mode);
        const sv = resolveOklch(byMode[mode].get(s) ?? '', mode);
        if (!tv || !sv) {
          f.push({ where: CSS_FILE, detail: `${mode}: cannot resolve ${t} on ${s}` });
          continue;
        }
        const floor = LARGE_ONLY.has(t) ? FLOOR_LARGE : FLOOR_NORMAL;
        const r = contrast(tv, sv);
        if (r < floor)
          f.push({
            where: CSS_FILE,
            detail: `${mode}: ${t} on ${s} = ${r.toFixed(2)}, floor ${floor.toFixed(1)}`,
          });
      }
    }
  }
  add(4, 'Every text-on-surface pair clears its floor (§5, §7.4)', f);
}

// 5 — no color-mix(… currentColor …) on a text colour. Carried from the
// spacing migration: mix to author a token, never to apply one.
{
  const f = [];
  for (const d of decls) {
    if (d.prop !== 'color') continue;
    const v = d.value.toLowerCase();
    if (v.includes('color-mix(') && v.includes('currentcolor'))
      f.push({ where: `${CSS_FILE}:${d.line}`, detail: `${d.sel} { color: ${d.value} }` });
  }
  add(5, 'No color-mix(… currentColor …) on a text colour (§7.5)', f);
}

// 6 — every referenced colour token resolves to a definition. Carried from
// lint:space assertion 7: checking that a name is legal is not checking that it
// exists, and an undefined custom property resolves to nothing rather than
// erroring.
{
  const f = [];
  const seen = new Map();
  const COLOUR_TOKEN = /^--(bg|text|border|focus|selection|link|shadow|popup|qh|chroma|hue|color)[\w-]*$/;
  for (const d of decls) {
    for (const m of d.value.matchAll(/var\(\s*(--[\w-]+)\s*[,)]/g)) {
      if (!COLOUR_TOKEN.test(m[1])) continue;
      if (!seen.has(m[1])) seen.set(m[1], `${CSS_FILE}:${d.line}`);
    }
  }
  for (const [tok, where] of seen)
    if (!allDefs.has(tok))
      f.push({ where, detail: `${tok} is referenced but never defined — it resolves to nothing` });
  add(6, 'Every referenced colour token resolves to a definition (§7.6)', f);
}

// ── Report ─────────────────────────────────────────────────────────────────
console.log(`color-lint: ${CSS_FILE} (${allDefs.size} custom properties)\n`);
for (const c of checks) {
  console.log(`${c.pass ? '✓' : '✗'} ${c.id}. ${c.title}`);
  if (c.pass) console.log('    PASS');
  else {
    for (const x of c.failures.slice(0, 14)) console.log(`    ✗ ${x.where}\n        ${x.detail}`);
    if (c.failures.length > 14)
      console.log(`    … and ${c.failures.length - 14} more (${c.failures.length} total)`);
  }
  console.log('');
}
const passing = checks.filter((c) => c.pass).length;
const failing = checks.length - passing;
console.log(
  `Result: ${passing} of ${checks.length} passing, ${failing} failing` +
    (failing ? '  — each failure is a migration step, not a regression.' : ''),
);
process.exit(failing === 0 ? 0 : 1);
