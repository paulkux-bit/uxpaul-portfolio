// Usage: node scripts/lint-space.mjs   (no build required — parses source)
//
// Spacing gate for the v1 spacing system (`docs/spacing-system-v1-locked.md` §7).
// Parses app/globals.css AND every .tsx/.mdx, because §3.3 is explicit: spacing
// is authored on two surfaces and a scale that governs one of them is not a
// system. 117 of this project's spacing declarations live in JSX/MDX.
//
// THIS SCRIPT IS THE MIGRATION CHECKLIST. It is red on purpose. Each commit in
// the migration turns one assertion green by changing the CODE. The rules are
// written once, at full strength, in S0 and are not softened afterwards: a rule
// that has to bend to make a commit look clean means the commit is wrong.
//
// Not wired into `npm run build` until S6.
//
// Sibling of scripts/lint-type.mjs; same house style, same postcss dependency
// (present via @tailwindcss/postcss), same allowlist-with-a-reason discipline.
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import postcss from 'postcss';

const CSS_FILE = 'app/globals.css';
const JSX_ROOTS = ['app', 'components'];

// ── The scale (§3) ─────────────────────────────────────────────────────────
const STEPS = {
  '3xs': 0.25,
  '2xs': 0.5,
  xs: 0.75,
  s: 1,
  m: 1.5,
  l: 2,
  xl: 3,
  '2xl': 4,
};
const FLUID = ['section', 'gutter']; // clamp-valued, checked by assertion 5

const GRID_FINE = 0.25; // below 1rem, step by 4px
const GRID_COARSE = 0.5; // at and above 1rem, step by 8px

// Properties that carry spacing.
const SPACING_PROP =
  /^(margin|padding|gap|row-gap|column-gap|(margin|padding)-(top|right|bottom|left|block|inline)(-(start|end))?)$/;

// §3.2: em is banned on BLOCK-LEVEL layout spacing. The spec enumerates —
// margin-block, padding-block, gap — so this enumerates too rather than
// inferring, which would wrongly catch the optical crops the spec permits.
const EM_BANNED_PROP =
  /^(gap|row-gap|column-gap|(margin|padding)-(top|bottom|block)(-(start|end))?)$/;

// §3.2 names one permanent exception that is NOT an allowlist entry, because it
// is not project debt: the standard visually-hidden clip idiom, which every
// design system carries and which must be px.
const SR_ONLY_EXCEPTION = { selector: '.sr-only', prop: 'margin', value: '-1px' };

// ── Allowlist ──────────────────────────────────────────────────────────────
// EMPTY IN S0, ON PURPOSE. Every entry carries a one-line reason.
//
// The test for what belongs here is RHYTHM versus LAYOUT: a spacing declaration
// that a fluid token replaces gets migrated; one doing layout work — cancelling
// a breakout, collapsing a grid to one column, changing direction — is
// allowlisted. "I did not get to it" is not a reason.
const ALLOWLIST = {
  values: [], // literals that may stay: { selector, prop, value, reason }
  media: [], // spacing inside @media that does layout: { selector, prop, reason }
  fluid: [], // sanctioned clamp() pairs beyond the two tokens: { selector, reason }
  responsive: [], // JSX responsive variants that do layout: { file, util, reason }
};

const inList = (list, pred) => list.some(pred);

// ── Value helpers ──────────────────────────────────────────────────────────

const isZero = (t) => /^-?0(\.0+)?([a-z%]+)?$/.test(t);
const isKeyword = (t) => /^(auto|inherit|initial|unset|revert|revert-layer|!important)$/i.test(t);

/** Split a value on top-level whitespace, keeping calc()/clamp()/var() intact. */
function splitTerms(value) {
  const out = [];
  let depth = 0;
  let cur = '';
  for (const ch of value) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (/\s/.test(ch) && depth === 0) {
      if (cur.trim()) out.push(cur.trim());
      cur = '';
    } else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

/** The preferred (middle) argument of a clamp(), or null. */
function clampPreferred(term) {
  const i = term.indexOf('clamp(');
  if (i === -1) return null;
  let depth = 0;
  let body = null;
  for (let j = i + 5; j < term.length; j++) {
    if (term[j] === '(') depth++;
    else if (term[j] === ')') {
      depth--;
      if (depth === 0) {
        body = term.slice(i + 6, j);
        break;
      }
    }
  }
  if (body === null) return null;
  const args = [];
  let d = 0;
  let c = '';
  for (const ch of body) {
    if (ch === '(') d++;
    if (ch === ')') d--;
    if (ch === ',' && d === 0) {
      args.push(c);
      c = '';
    } else c += ch;
  }
  args.push(c);
  return args.length === 3 ? args[1].trim() : null;
}

/**
 * A term is a token reference only if it names a token that EXISTS. Accepting
 * any `--spacing-*` spelling would let `var(--spacing-md)` — not a token on
 * this scale — pass as though it were one, and an undefined custom property
 * resolves to nothing rather than erroring, so the space would silently vanish.
 */
const KNOWN_TOKENS = new Set([...Object.keys(STEPS), ...FLUID]);
function tokenRef(term) {
  const m = /^var\(\s*--spacing-([a-z0-9]+)\s*\)$/.exec(term.trim());
  return m && KNOWN_TOKENS.has(m[1]) ? m : null;
}

// ── Gather ─────────────────────────────────────────────────────────────────

const css = await readFile(CSS_FILE, 'utf8');
const root = postcss.parse(css, { from: CSS_FILE });

// Custom-property definitions, so var() spacing can be resolved rather than
// skipped. This is the trap that let var(--qh-wdth, 100) defeat width check 1
// during the type migration: a value the parser cannot follow is not a value
// the parser may ignore.
const customProps = new Map();
root.walkDecls((d) => {
  if (d.prop.startsWith('--')) customProps.set(d.prop, d.value.trim());
});
function resolveVars(term, depth = 0) {
  if (depth > 4) return term;
  return term.replace(/var\(\s*(--[\w-]+)\s*(?:,([^)]*))?\)/g, (whole, name, fallback) => {
    if (name.startsWith('--spacing-')) return whole; // a token: leave for tokenRef
    if (customProps.has(name)) return resolveVars(customProps.get(name), depth + 1);
    return fallback !== undefined ? fallback.trim() : whole;
  });
}

const decls = [];
root.walkDecls((d) => {
  if (!SPACING_PROP.test(d.prop.toLowerCase())) return;
  let mq = null;
  let p = d.parent;
  while (p) {
    if (p.type === 'atrule' && p.name === 'media') {
      mq = p.params.trim();
      break;
    }
    p = p.parent;
  }
  const par = d.parent;
  let sel = '?';
  if (par.type === 'rule') sel = par.selector.replace(/\s+/g, ' ').trim();
  else if (par.type === 'atrule' && par.name === 'utility') sel = `.${par.params.trim()}`;
  decls.push({
    prop: d.prop.toLowerCase(),
    value: d.value.trim(),
    sel,
    mq,
    line: d.source?.start?.line ?? 0,
  });
});

const isSrOnly = (d) =>
  d.sel === SR_ONLY_EXCEPTION.selector &&
  d.prop === SR_ONLY_EXCEPTION.prop &&
  d.value.replace(/\s+/g, ' ') === SR_ONLY_EXCEPTION.value;

// JSX/MDX spacing utilities.
const SP_UTIL = /^(-?(?:m|p)[trblxyse]?|gap|gap-x|gap-y|space-x|space-y)-(.+)$/;
const jsxUtils = [];
async function walkJsx(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) await walkJsx(p);
    else if (/\.(tsx|jsx|mdx)$/.test(e.name)) {
      const src = await readFile(p, 'utf8');
      const lines = src.split('\n');
      lines.forEach((line, i) => {
        for (const m of line.matchAll(/class(?:Name)?=(?:"([^"]*)"|\{`([^`]*)`\}|\{"([^"]*)"\})/g)) {
          const cls = m[1] || m[2] || m[3] || '';
          for (const tok of cls.split(/\s+/).filter(Boolean)) {
            const v = /^([\w-]+):(.+)$/.exec(tok);
            const bare = v ? v[2] : tok;
            if (!SP_UTIL.test(bare)) continue;
            jsxUtils.push({ file: p, line: i + 1, token: tok, variant: v ? v[1] : null, bare });
          }
        }
      });
    }
  }
}
for (const r of JSX_ROOTS) await walkJsx(r);

// ── Checks ─────────────────────────────────────────────────────────────────

const checks = [];
const add = (id, title, failures) =>
  checks.push({ id, title, failures, pass: failures.length === 0 });

const blindSpots = [];

// 1 — every margin/padding/gap term resolves to a scale token.
{
  const f = [];
  for (const d of decls) {
    if (isSrOnly(d)) continue;
    if (inList(ALLOWLIST.values, (a) => a.selector === d.sel && a.prop === d.prop)) continue;
    for (const raw of splitTerms(d.value.replace(/!important/gi, ''))) {
      // The ZERO TERM is exempt, not the declaration. `margin: 4rem 0 1.5rem`
      // still has 4rem and 1.5rem checked; exempting whole declarations would
      // blind this to 51 of them.
      if (isZero(raw) || isKeyword(raw)) continue;
      if (tokenRef(raw)) continue;
      const resolved = resolveVars(raw);
      if (tokenRef(resolved)) continue;
      if (/var\(/.test(resolved)) {
        blindSpots.push({
          kind: 'unresolvable var()',
          where: `${CSS_FILE}:${d.line}`,
          detail: `${d.sel} { ${d.prop}: ${raw} }`,
        });
        continue;
      }
      if (/clamp\(/.test(resolved)) continue; // assertion 5 owns fluid values
      if (/^calc\(/.test(resolved)) continue; // assertion 3 owns the units inside
      f.push({ where: `${CSS_FILE}:${d.line}`, detail: `${d.sel} { ${d.prop}: ${raw} }` });
    }
  }
  add(1, 'Every margin/padding/gap resolves to a scale token (§3)', f);
}

// 2 — no px; no em on block-level layout spacing (§3.2).
{
  const f = [];
  for (const d of decls) {
    if (isSrOnly(d)) continue;
    const v = d.value;
    if (/(?<![\w-])-?[\d.]+px/.test(v))
      f.push({ where: `${CSS_FILE}:${d.line}`, detail: `px — ${d.sel} { ${d.prop}: ${v} }` });
    if (/(?<![\w-])-?[\d.]+em(?![a-z])/.test(v) && EM_BANNED_PROP.test(d.prop))
      f.push({
        where: `${CSS_FILE}:${d.line}`,
        detail: `em on block-level ${d.prop} — ${d.sel} { ${d.prop}: ${v} }`,
      });
  }
  add(2, 'No px; no em on block-level spacing (ruling 1, §3.2)', f);
}

// 3 — the grid: 4px below 1rem, 8px at and above.
{
  const f = [];
  const offGrid = (n) => {
    const a = Math.abs(n);
    const step = a < 1 ? GRID_FINE : GRID_COARSE;
    return Math.abs(a / step - Math.round(a / step)) > 1e-9;
  };
  for (const d of decls) {
    if (isSrOnly(d)) continue;
    if (inList(ALLOWLIST.values, (a) => a.selector === d.sel && a.prop === d.prop)) continue;
    for (const raw of splitTerms(resolveVars(d.value.replace(/!important/gi, '')))) {
      if (isZero(raw) || isKeyword(raw) || tokenRef(raw)) continue;
      for (const m of raw.matchAll(/(?<![\w-])(-?[\d.]+)rem(?![a-z])/g)) {
        const n = parseFloat(m[1]);
        if (offGrid(n))
          f.push({
            where: `${CSS_FILE}:${d.line}`,
            detail: `${n}rem off the ${Math.abs(n) < 1 ? '4px' : '8px'} grid — ${d.sel} { ${d.prop} }`,
          });
      }
    }
  }
  add(3, 'On grid: 4px below 1rem, 8px at and above (ruling 2)', f);
}

// 4 — no spacing inside a media query without an allowlist entry.
{
  const f = [];
  for (const d of decls) {
    if (!d.mq) continue;
    if (inList(ALLOWLIST.media, (a) => a.selector === d.sel && a.prop === d.prop)) continue;
    f.push({
      where: `${CSS_FILE}:${d.line}`,
      detail: `@media ${d.mq} — ${d.sel} { ${d.prop}: ${d.value} }`,
    });
  }
  add(4, 'No unallowlisted spacing inside a media query (§7.4)', f);
}

// 5 — a fluid pair's preferred term must carry a rem component (§2).
// A clamp preferring vw alone stops responding to the reader's root size,
// giving back the accessibility win in the act of fixing the drift.
{
  const f = [];
  const seen = new Set();
  const checkClamp = (label, where, term) => {
    const pref = clampPreferred(term);
    if (pref === null) return;
    if (!/(?<![\w-])[\d.]+rem(?![a-z])/.test(pref))
      f.push({ where, detail: `${label} — preferred term "${pref.trim()}" has no rem component` });
  };
  for (const [name, val] of customProps) {
    if (!name.startsWith('--spacing-')) continue;
    if (!/clamp\(/.test(val)) continue;
    seen.add(name);
    checkClamp(name, `${CSS_FILE} (@theme)`, val);
  }
  for (const d of decls) {
    if (inList(ALLOWLIST.fluid, (a) => a.selector === d.sel)) continue;
    for (const raw of splitTerms(d.value)) {
      if (/clamp\(/.test(raw)) checkClamp(`${d.sel} { ${d.prop} }`, `${CSS_FILE}:${d.line}`, raw);
    }
  }
  add(5, 'Every fluid pair keeps a rem term in its preferred value (§2)', f);
}

// 6 — no responsive spacing utility in JSX/MDX (§7.6).
// A fluid token makes the breakpoint variant unnecessary. This assertion is
// specifically what stops the 1920 step-up surviving the migration by hiding in
// `2xl:space-y-32` after the CSS media queries are deleted.
{
  const f = [];
  for (const u of jsxUtils) {
    if (!u.variant) continue;
    if (inList(ALLOWLIST.responsive, (a) => a.file === u.file && a.util === u.token)) continue;
    f.push({ where: `${u.file}:${u.line}`, detail: `responsive spacing utility "${u.token}"` });
  }
  add(6, 'No responsive spacing utilities in JSX/MDX (§7.6)', f);
}

// ── Blind spots, reported rather than passed over ──────────────────────────
const arbitrary = jsxUtils.filter((u) => /\[/.test(u.bare));
if (arbitrary.length)
  for (const a of arbitrary)
    blindSpots.push({
      kind: 'arbitrary-value spacing utility',
      where: `${a.file}:${a.line}`,
      detail: a.token,
    });

// ── Report ─────────────────────────────────────────────────────────────────

console.log(
  `space-lint: ${CSS_FILE} (${decls.length} spacing declarations) + ` +
    `${jsxUtils.length} spacing utilities in JSX/MDX\n`,
);

for (const c of checks) {
  console.log(`${c.pass ? '✓' : '✗'} ${c.id}. ${c.title}`);
  if (c.pass) console.log('    PASS');
  else {
    const shown = c.failures.slice(0, 12);
    for (const x of shown) console.log(`    ✗ ${x.where}\n        ${x.detail}`);
    if (c.failures.length > shown.length)
      console.log(`    … and ${c.failures.length - shown.length} more (${c.failures.length} total)`);
  }
  console.log('');
}

if (blindSpots.length) {
  const byKind = new Map();
  for (const b of blindSpots) {
    if (!byKind.has(b.kind)) byKind.set(b.kind, []);
    byKind.get(b.kind).push(b);
  }
  for (const [kind, list] of byKind) {
    console.log(
      `⚠ UNCHECKED: ${list.length} ${kind}${list.length === 1 ? '' : 's'} — ` +
        `this is a blind spot, not an exemption.`,
    );
    for (const b of list.slice(0, 8)) console.log(`    ${b.where}  ${b.detail}`);
    if (list.length > 8) console.log(`    … and ${list.length - 8} more`);
    console.log('');
  }
}

const passing = checks.filter((c) => c.pass).length;
const failing = checks.length - passing;
const totalFailures = checks.reduce((s, c) => s + c.failures.length, 0);
console.log(
  `Result: ${passing} of ${checks.length} passing, ${failing} failing` +
    (failing ? `  — ${totalFailures} declarations to move. Each failure is a migration step.` : ''),
);
process.exit(failing === 0 ? 0 : 1);
