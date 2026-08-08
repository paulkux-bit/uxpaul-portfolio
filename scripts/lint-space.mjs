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
const FLUID = ['section', 'gutter', 'crescendo']; // clamp-valued, checked by assertion 5

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

// The second of §3.2's two permanent px exceptions. --spacing-gutter is a
// container edge, not rhythm: it must HOLD under text-only scaling (a wider
// gutter takes from a measure that has already halved) while still responding
// to browser zoom. px is the only unit that does both. Named here rather than
// allowlisted so nobody "cleans it up" later.
//
// Assertion 2 consults this BY NAME rather than relying on the fact that a
// @theme definition is not a spacing declaration and so never reaches it. That
// incidental safety would evaporate the moment anyone inlined the clamp on a
// container, and it records nothing about intent where the rule lives.
const PX_EXCEPTION_TOKENS = new Set(['--spacing-gutter']);

// ── Allowlist ──────────────────────────────────────────────────────────────
// EMPTY IN S0, ON PURPOSE. Every entry carries a one-line reason.
//
// The test for what belongs here is RHYTHM versus LAYOUT: a spacing declaration
// that a fluid token replaces gets migrated; one doing layout work — cancelling
// a breakout, collapsing a grid to one column, changing direction — is
// allowlisted. "I did not get to it" is not a reason.
const ALLOWLIST = {
  values: [
    {
      selector: '.about-row__mark',
      prop: 'margin-block-start',
      reason:
        'S1 — optical centring, not a spacing choice: (line-height − mark height) / 2 against the company name’s first line. Its rem terms are the text-h3 font-size clamp and the mark’s own 1.25rem box, neither of which is on the spacing scale.',
    },
  ], // literals that may stay: { selector, prop, value, reason }
  media: [
    // LAYOUT, not rhythm. Each of these does something no spacing token can
    // express: changes alignment, changes grid direction, or cancels a value
    // that only makes sense in the other layout. Only --spacing-section and
    // --spacing-gutter are fluid, so an override of a STATIC value is never
    // made inert by a token — deleting one would be a design change wearing a
    // migration's clothes. The five that WERE redundant were deleted in S3.
    { selector: '.case-study-prose', prop: 'margin-left', reason: 'S3 layout — the reading column stops being centred and left-aligns at 1024' },
    { selector: '.case-study-prose', prop: 'margin-right', reason: 'S3 layout — pair of the margin-left switch above' },
    { selector: '.case-study-prose > .cs-section', prop: 'margin-inline', reason: 'S3 layout — cancels the negative breakout once the column has room for it' },
    { selector: ".case-study-prose > .figure--constrained-bleed, .case-study-prose > .figure--asymmetric-pair, .case-study-prose > .figure--bento, .case-study-prose > .figure--mode-pair[data-breakout='true'], .case-study-prose > .figure--compare, .case-study-prose > .hero-block", prop: 'margin-inline', reason: 'S3 layout — same breakout cancellation, for every figure variant that breaks out' },
    { selector: '.thread-cols', prop: 'column-gap', reason: 'S3 layout — a column gap only exists once the spine is three columns at 1024' },
    { selector: '.thread-cols li', prop: 'padding', reason: 'S3 layout — stacked rows need vertical padding, columns do not' },
    { selector: '.friction-beat', prop: 'gap', reason: 'S3 layout — the beat has no gap stacked; the gap appears with the two-column grid' },
    { selector: '.friction-beat .oku-figure', prop: 'margin', reason: 'S3 layout — the figure loses its prose margin inside a grid cell' },
    { selector: '.compare__grid', prop: 'gap', reason: 'S3 layout — a deliberate zero so the two halves read as one seamless comparison' },
    { selector: '.compare__divider', prop: 'margin', reason: 'S3 layout — the divider only exists in the two-up arrangement' },
    { selector: '.bento-theme__item', prop: 'column-gap', reason: 'S3 layout — caption sits beside its media at 1024, not beneath it' },
    { selector: '.bento-theme__row', prop: 'row-gap', reason: 'S3 layout — row rhythm changes with the caption-beside arrangement' },
    { selector: '.about-row__summary', prop: 'column-gap', reason: 'S3 layout — the resume row is stacked below 900 and four columns above; the gap is zero in one and real in the other' },
    { selector: '.about-row__summary', prop: 'row-gap', reason: 'S3 layout — pair of the column-gap switch' },
    { selector: '.about-row__company', prop: 'padding-inline-end', reason: 'S3 layout — only the 600-899 band puts the company beside its meta line' },
    { selector: '.about-row__role::after', prop: 'margin-inline', reason: 'S3 layout — the interpunct exists only in the 600-899 phrase form' },
    { selector: ".framed-pair[data-stack-mobile='true']", prop: 'row-gap', reason: 'S3 layout — a row gap only exists once the pair stacks below 767' },

    // DELIBERATE PER-BREAKPOINT DENSITY. These retune a static value at a
    // breakpoint. No fluid token replaces them, so deleting them would change
    // the design rather than migrate it. They are candidates for a measured
    // fluid pair later (S5 measures; §3.1 forbids inventing pairs), and until
    // one is measured they stay, declared, with a reason.
    { selector: '.quick-hit', prop: 'column-gap', reason: 'S3 density — the shelf row loosens from 16 to 32 when it goes multi-column at 768; no measured pair yet' },
    { selector: '.take-card', prop: 'padding', reason: 'S3 density — tighter card inset below 767; unmounted surface, no measured pair' },
    { selector: '.case-study-meta', prop: 'column-gap', reason: 'S3 density — meta columns separate widely once they sit on one line at 640' },
    { selector: '.transformation', prop: 'gap', reason: 'S3 density — before/after tighten when they stack below 640' },
    { selector: '.asymmetric-pair__grid', prop: 'gap', reason: 'S3 density — pair loosens from 24 to 32 when side by side at 768' },
    { selector: '.bento-theme__row', prop: 'column-gap', reason: 'S3 density — caption-beside arrangement sets its own column rhythm at 1024' },
    { selector: ".figure--framed .figure__image, .figure--framed .figure-placeholder", prop: 'padding', reason: 'S3 density — framed inset drops from 32 to 24 below 640 so the image keeps its width' },
    { selector: '.hero-block', prop: 'gap', reason: 'S3 density — type column to image opens from 48 to 64 at 1024 where they sit side by side' },
    { selector: '.about-hero', prop: 'gap', reason: 'S3 density — portrait to text opens from 32 to 48 at 768' },
    { selector: '.about-creds__item', prop: 'gap', reason: 'S3 density — credential label and value sit on one line at 768 and need a real column gap' },
  ], // spacing inside @media that does layout: { selector, prop, reason }
  fluid: [], // sanctioned clamp() pairs beyond the two tokens: { selector, reason }
  responsive: [
    // SANDBOX — out of scope by instruction, not by merit. app/sandbox/* and
    // components/sandbox/* are private scratch routes; the migration brief
    // excludes them explicitly. They carry the same non-monotonic rhythm the
    // home page had, because home-video is a clone of it. If a sandbox is ever
    // promoted, it comes into scope with everything else.
    { file: 'app/sandbox/home-video/page.tsx', util: 'md:pt-20', reason: 'S3.5 sandbox — excluded by the migration brief' },
    { file: 'app/sandbox/home-video/page.tsx', util: 'xl:pt-16', reason: 'S3.5 sandbox — excluded by the migration brief' },
    { file: 'app/sandbox/home-video/page.tsx', util: '2xl:pt-28', reason: 'S3.5 sandbox — excluded by the migration brief' },
    { file: 'app/sandbox/home-video/page.tsx', util: 'xl:space-y-20', reason: 'S3.5 sandbox — excluded by the migration brief' },
    { file: 'app/sandbox/home-video/page.tsx', util: '2xl:space-y-32', reason: 'S3.5 sandbox — excluded by the migration brief' },
    { file: 'app/sandbox/show-the-work/page.tsx', util: 'md:mt-40', reason: 'S3.5 sandbox — excluded by the migration brief' },
    { file: 'app/sandbox/show-the-work/page.tsx', util: 'md:mt-40!', reason: 'S3.5 sandbox — excluded by the migration brief' },
    { file: 'app/sandbox/show-the-work/page.tsx', util: 'md:mb-14', reason: 'S3.5 sandbox — excluded by the migration brief' },
    { file: 'components/sandbox/video-cover-card.tsx', util: 'md:p-8', reason: 'S3.5 sandbox — excluded by the migration brief' },
    { file: 'components/sandbox/video-cover-card.tsx', util: 'md:px-8', reason: 'S3.5 sandbox — excluded by the migration brief' },
    { file: 'components/sandbox/video-cover-card.tsx', util: 'md:pb-8', reason: 'S3.5 sandbox — excluded by the migration brief' },

    // COMPONENT INSETS — density, the same category S3 allowlisted in CSS. Each
    // opens a card or a chrome element at md where it gains room. No fluid
    // token replaces a static inset, and §3.1 forbids inventing a pair for a
    // relationship nobody has measured, so these stay declared with a reason.
    { file: 'components/case-study-card.tsx', util: 'md:px-8', reason: 'S3.5 density — card inset opens 24 -> 32 at md' },
    { file: 'components/case-study-card.tsx', util: 'md:py-12', reason: 'S3.5 density — card inset opens 32 -> 48 at md' },
    { file: 'components/case-study-card.tsx', util: 'md:mb-8', reason: 'S3.5 density — cover art to title opens at md' },
    { file: 'components/case-study-card.tsx', util: 'md:p-8', reason: 'S3.5 density — media-tier card inset' },
    { file: 'components/quick-hits/quick-hit.tsx', util: 'md:px-8', reason: 'S3.5 density — shelf row inset matches the card' },
    { file: 'components/quick-hits/quick-hits-list.tsx', util: 'md:space-y-8', reason: 'S3.5 density — shelf rows separate further once each is one line' },
    { file: 'components/site-footer.tsx', util: 'md:px-8', reason: 'S3.5 density — footer inset tracks the page container' },
    { file: 'components/site-footer.tsx', util: 'md:py-12', reason: 'S3.5 density — footer inset tracks the page container' },
    { file: 'components/site-header.tsx', util: 'md:gap-6', reason: 'S3.5 density — nav items separate once the header is one row' },
  ], // JSX responsive variants that do layout: { file, util, reason }
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
  const t = term.trim();
  // A plain reference, or a negated one. `calc(var(--spacing-s) * -1)` is how a
  // negative value stays on the scale instead of reintroducing a literal.
  const m =
    /^var\(\s*--spacing-([a-z0-9]+)\s*\)$/.exec(t) ||
    /^calc\(\s*var\(\s*--spacing-([a-z0-9]+)\s*\)\s*\*\s*-1\s*\)$/.exec(t);
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
  return term.replace(/var\(\s*(--[\w-]+)\s*(?:,((?:[^()]|\([^()]*\))*))?\)/g, (whole, name, fallback) => {
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
// Longest alternatives FIRST: with `gap` before `gap-x`, the utility `gap-x-8`
// parses as prefix `gap` and key `x-8`, which assertion 7 then reads as a
// reference to a token named --spacing-x-8.
const SP_UTIL = /^(-?(?:m|p)[trblxyse]?|gap-x|gap-y|gap|space-x|space-y)-(.+)$/;
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
      // §3.2-permitted em. Assertion 1 read alone would fail these, which would
      // make §3.2 unreachable: it names three declarations that "stay", and a
      // scale token cannot express an optical offset that must track the text
      // beside it. Assertion 2 owns the em rule and enforces the block-level
      // ban; this defers to it rather than contradicting it. Hard-coded like
      // the sr-only idiom, not allowlisted — a permanent unit rule is not debt.
      if (/^-?[\d.]+em$/.test(raw) && !EM_BANNED_PROP.test(d.prop)) continue;
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
  const fromPxException = (v) =>
    [...PX_EXCEPTION_TOKENS].some((t) => resolveVars(v).includes(t) || v.includes(t));
  for (const d of decls) {
    if (isSrOnly(d)) continue; // §3.2 exception 1, by name
    const v = d.value;
    // §3.2 exception 2, by name: px reaching a declaration THROUGH one of the
    // named px tokens is the system working, not a defect.
    if (/(?<![\w-])-?[\d.]+px/.test(v) && !fromPxException(v))
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
    // §2's rem requirement is about PAIRS, which must keep responding to the
    // reader's root. --spacing-gutter is explicitly not a pair (§3.1) and is
    // px by design, so demanding a rem term of it would enforce the opposite
    // of what §4 wants.
    if (PX_EXCEPTION_TOKENS.has(name)) continue;
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

// 7 — every referenced token must RESOLVE to a definition (§7.7).
// Checking that a name is legal is not the same as checking that it exists. An
// undefined custom property resolves to nothing rather than erroring, so the
// space silently collapses to zero while assertion 1 stays green on spelling.
// Added after exactly that near-miss: .milestone consumed --spacing-crescendo
// for a few minutes before its definition was written, and only a grep caught
// it. Covers both authoring surfaces — a JSX `gap-m` implies --spacing-m just
// as much as a CSS var() does.
{
  const f = [];
  const defined = new Set([...customProps.keys()]);
  const seen = new Map(); // token -> where first referenced

  for (const d of decls) {
    for (const m of d.value.matchAll(/var\(\s*(--spacing-[\w-]+)\s*[,)]/g))
      if (!seen.has(m[1])) seen.set(m[1], `${CSS_FILE}:${d.line}`);
  }
  // Tailwind utilities name the token implicitly: gap-m -> --spacing-m.
  for (const u of jsxUtils) {
    const m = SP_UTIL.exec(u.bare);
    if (!m) continue;
    const key = m[2].replace(/!$/, '');
    if (/^\[/.test(key) || /^\d/.test(key) || key === 'auto' || key === 'px') continue;
    const token = `--spacing-${key}`;
    if (!seen.has(token)) seen.set(token, `${u.file}:${u.line}`);
  }
  for (const [token, where] of seen) {
    if (!defined.has(token))
      f.push({ where, detail: `${token} is referenced but never defined — it resolves to nothing, and the space silently collapses to zero` });
  }
  add(7, 'Every referenced spacing token resolves to a definition (§7.7)', f);
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
