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
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import postcss from 'postcss';

const CSS_FILE = 'app/globals.css';
const FONTS_FILE = 'app/fonts.ts';
const JSX_ROOTS = ['app', 'components'];

// ── The system's fixed values (locked doc §3.1, §3.2, §4) ──────────────────
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
  // §3.2 permits three signature placements sitewide. ONE is spent. The home
  // hero is a single placement covering four declarations: .text-lede carries
  // the 340, and the three font-[720] spans in app/page.tsx are noun phrases
  // inside that same h1. The about opener and one case-study moment are unspent.
  signature: [
    { selector: '.text-lede', reason: '§3.2 placement 1 of 3 — the home hero h1; its 340 and the three font-[720] spans inside it are one signature, ceiling 60px' },
  ],
};

// ── The type map: one list, three keys ─────────────────────────────────────
// `ladder: true`  -> check 3 walks these pairwise for the 1.15 ratio.
// `band`          -> what the type IS: display or reading. Assigned by the
//                    rung's ceiling, per v3 §5's width table, which is where
//                    this key came from and why it survives the split below.
// `voice`         -> what the type GETS: 'flared' (FLAR 100) or 'plain' (0).
//                    Check 11 reads THIS, not `band`.
//
// BAND AND VOICE WERE ONE KEY UNTIL C5 AND THAT WAS A LATENT BUG. C4 used
// `band: 'display'` to mean both, which held only while every display selector
// wanted flare. The 52px cut broke it: .text-cover and .friction-beat__headline
// are 32px display type by size, weight and rung, and the only way to take the
// flare off them through one key was to relabel them reading — a lie in the map,
// which is the thing this branch has spent six commits removing.
//
// Same failure as check 3 conflating rung with selector. When one key answers
// two questions, the second question eventually gets the wrong answer.
//
// `band` IS STILL READ, by a human and by §5. Do not delete it as unused
// because check 11 stopped consuming it; it is the record of what each selector
// is, and it is what a future width system would key off if the typeface ever
// regains a wdth axis.
//
// THE 52px CUT IS A JUDGMENT AND CARRIES ITS PROVENANCE. It was taken on a
// render at five sizes — 88, 72, 52, 32, 18px — after a UI review found flare
// illegible at 32. Nothing was ever tested at 51 or at 40. Selectors within a
// few pixels of the line are ruled on, not looked up, and the ruling is written
// on the entry. Read as a number, 51.2px would send .about-hero__pov plain and
// leave the whole about page flat.
//
// Measured against it, ceiling first:
//   88 .milestone__date        72 .hero-block__title      60 .text-lede
//   56 .about-hero__pov        52 .case-study-prose h2    <- flared
//   40 .about-phase__title     32 .text-cover             32 .friction-beat__headline
//
// TWO CONSUMERS, ONE LIST, AND THAT IS THE POINT. The Commissioner bench kept
// its own hand-written band list beside this one; it named a class that does not
// exist, omitted .hero-block__title, and therefore rendered no flare at rung 5
// for an entire judgment session while every gate stayed green. Two lists where
// one is authoritative is the shape of that failure, so there is now one list.
//
// Check 3 stays scoped to the CLAMPED rungs (§7.3: "computed from the clamps").
// The fixed rungs cannot satisfy 1.15 by construction (18/16 = 1.125,
// 16/14 = 1.143), and neither can a display role that shares a ceiling with the
// rung below it — .text-cover ceilings at 32px, exactly rung 3's ceiling, so an
// unflagged entry would compute 1.00 and fail a check that is green for good
// reason. `ladder: false` is what keeps membership and ratio separable.
const RUNGS = [
  { rung: 6, role: 'Arrival crescendo', selector: '.milestone__date', band: 'display', voice: 'flared', ladder: true },
  { rung: 5, role: 'Case-study hero', selector: '.hero-block__title', band: 'display', voice: 'flared', ladder: true },
  { rung: 4, role: 'Section heading', selector: '.case-study-prose h2', band: 'display', voice: 'flared', ladder: true },
  { rung: 3, role: 'Numbered headline', selector: '.friction-beat__headline', band: 'display', voice: 'plain' /* 32px: tested, cut */, ladder: true },
  { rung: 2, role: 'Standfirst', selector: '.case-study-prose .section-lede', band: 'read', voice: 'plain' /* reading type */, ladder: true },

  // ── Display roles that v3 §5 bands but §3.3 never put on the ladder ──────
  // Mechanical additions: the spec already assigns these a band, and only the
  // linter was missing them.
  { rung: 3, role: 'Card cover', selector: '.text-cover', band: 'display', voice: 'plain' /* 32px: tested, cut */, ladder: false },

  // ── `dead: true` — in the CSS, on no page ────────────────────────────────
  // MARKED, NOT DELETED, AND THAT IS THE WHOLE POINT. Removing an entry makes
  // the map lie by omission, which is precisely what produced the rung-5
  // blindness: a band that named a class that does not exist and omitted the
  // one that does, invisibly, for an entire judgment session. An entry that
  // says "this selector exists in globals.css, is display-ceilinged, and
  // matches zero elements on all five routes" is a fact the map should carry.
  //
  // The flare derivation and check 11 both filter these out, so the band never
  // names them and assert-bands.mjs stays green — green because the band is
  // honest, not because the fact was deleted.
  //
  // Found by scripts/assert-bands.mjs on its FIRST RUN. .resolution-block__headline
  // had already appeared in the ch-measure audit's "governs nothing" list days
  // earlier and the two were not connected.
  { rung: 3, role: 'Resolution headline', selector: '.resolution-block__headline', band: 'display', voice: 'plain' /* 32px, and dead */, ladder: false, dead: true },
  // .transformation is a grid CONTAINER with no font-size of its own, so it has
  // no ceiling to measure and the cut cannot be applied to it at all. `plain` is
  // the safe value rather than a derived one — and having no size is a second,
  // independent reason it was never display type. Filed as such.
  { rung: null, role: 'Transformation', selector: '.transformation', band: 'display', voice: 'plain', ladder: false, dead: true },

  // SAME CONDITION, ALREADY KNOWN, deliberately left as a comment rather than
  // entries: `.text-hero` is used by no component or MDX, and
  // `.case-study-prose > h1` matches no element on any route. Both are still
  // discussed as live open questions in v3 §9. They are not in this map because
  // nothing has ever ruled on them, and inventing map membership for them here
  // would be a different kind of dishonesty from the one above. Five dead
  // display selectors total; see the backlog.

  // ── Banded ahead of their rung, by ruling, 21 Aug 2026 ───────────────────
  // v3 §9 lists these under "Six shipped selectors have size ceilings that sit
  // on no rung" and leaves the rung open on purpose: where a selector sits on
  // the ladder is a question about size relative to its neighbours and about
  // tracking, and it needs real content in front of it. Two of the five case
  // studies do not exist yet.
  //
  // FLARE IS A SEPARABLE AND NARROWER QUESTION: display type or reading type.
  // A 60px lede and a 96px statement are display by any reading, whatever rung
  // they eventually land on, so the band is answerable now and answering it does
  // not constrain the ladder answer later.
  //
  // `rung: null` is deliberate and load-bearing. An explicit null in the one
  // list is visibly open; ABSENCE from the list is invisible, and invisible
  // absence is what produced the rung-5 blindness. See docs/unspecified-surfaces.md.
  { rung: null, role: 'Home hero', selector: '.text-lede', band: 'display', voice: 'flared', ladder: false },

  // The about page's two display surfaces. v3 does not mention EITHER of them
  // anywhere - they are not in §3.3's ladder, not in §5's width table, and not
  // in §9's list of six unbanded selectors. So there was no rung to inherit and
  // no band to read; the band below is a ruling, not a lookup.
  //
  // Banded on function: the five phase titles do structural work at 36px against
  // 16px prose, and the POV line at 51px is the largest type on the page. Both
  // are display type by what they do. Neither ruling touches where they sit on
  // the ladder, which stays open. See docs/unspecified-surfaces.md.
  //
  // C5 SPLIT THE VOICE OFF AND BOTH BANDINGS SURVIVED UNCHANGED. The phase
  // titles are still display type; they just set at 36-40px, inside the range
  // the 52px cut found indistinct, so they take the plain voice. The POV line
  // sets at 51.2px and is flared on the judgment above, not on the number.
  // This is the pair the split was tested against, and neither C4a ruling moved.
  { rung: null, role: 'About phase title', selector: '.about-phase__title', band: 'display', voice: 'plain' /* 40px: judgment */, ladder: false },
  { rung: null, role: 'About hero POV', selector: '.about-hero__pov', band: 'display', voice: 'flared' /* 51.2px: judgment */, ladder: false },

  // Banded on 21 Aug and the application WITHDRAWN the same day: it renders on
  // no route, so the ruling was made about an element that does not exist. The
  // reasoning survives and is recorded as a conditional in
  // docs/unspecified-surfaces.md — if this ever renders, it is display band.
  { rung: null, role: 'Home statement', selector: '.text-statement', band: 'display', voice: 'flared' /* 96px, and dead */, ladder: false, dead: true },
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
// Split on TOP-LEVEL commas: an axis value can itself be a var() with a comma
// fallback (`'wdth' var(--qh-wdth, 100)`), which a naive /[^,]+/ truncates.
function fvsAxes(value) {
  const out = [];
  for (const part of splitArgs(value)) {
    const m = /^\s*['"](\w{4})['"]\s+(.+)$/.exec(part);
    if (!m) continue;
    const raw = m[2].trim();
    const num = parseFloat(raw);
    // Only a bare number is resolvable; anything var()-driven is a blind spot.
    out.push({ axis: m[1], value: /^[\d.]+$/.test(raw) && !Number.isNaN(num) ? num : null, raw });
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

// 10 — NO font-stretch, anywhere, at any value. Replaces check 1.
//
// Check 1 policed font-stretch against three bands {100, 94, 88}. Commissioner
// has no wdth axis, so there is no band to be in and no correct value: every
// font-stretch declaration is inert. 49 of them sat in this file for a day
// after the swap looking exactly as correct as they had the week before, which
// is the whole argument for this check existing rather than the range simply
// being deleted. INERT-BUT-PLAUSIBLE CSS IS THE CLASS 8a EXISTS TO CATCH, and
// this is its CSS-side twin: a property the renderer ignores is worse than a
// wrong value, because a wrong value shows.
//
// Scoped to shipped CSS. font-optical-sizing goes the same way and for the same
// reason (no opsz axis), so both are checked here.
{
  const f = [];
  for (const prop of ['font-stretch', 'font-optical-sizing']) {
    for (const d of byProp(prop)) {
      f.push({
        selector: d.selector,
        line: d.line,
        detail: `${prop}: ${d.value} — Commissioner has no ${prop === 'font-stretch' ? 'wdth' : 'opsz'} axis; this declaration is inert`,
      });
    }
  }
  add(10, 'No font-stretch or font-optical-sizing: the axes do not exist (§3.1)', f);
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
  // ladder: true only. The map now also carries display roles that are banded
  // but not on the ladder; including them here would compare a card cover
  // against the rung it shares a ceiling with and fail on a 1.00 ratio.
  const resolved = RUNGS.filter((r) => r.ladder).map((r) => ({ ...r, value: sizeOf(r.selector) }));
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

// 7 (R8') — EXACTLY ONE font-variation-settings declaration, and it is the
// universal one. No allowlist: there is nothing left to make an exception for.
//
// FVS inherits as a string and overrides the high-level properties per axis
// regardless of source order, so a second declaration anywhere pins every
// descendant's whole axis list. The old form of this check policed a
// nine-entry allowlist; C3 emptied every one of those rules, and C4 replaces
// the whole arrangement with a single `*` declaration reading var(--flar).
// That is what makes R8' trivially checkable rather than a matter of judgement,
// and it is the point of the architecture.
{
  const f = [];
  const decls = byProp('font-variation-settings');
  const universal = decls.filter((d) => d.selector === '*');
  const others = decls.filter((d) => d.selector !== '*');

  for (const d of others)
    f.push({
      selector: d.selector,
      line: d.line,
      detail: `font-variation-settings outside the universal rule: ${d.value} — R8' allows exactly one, on *`,
    });

  if (universal.length === 0)
    f.push({
      selector: '*',
      line: 0,
      detail: 'no universal font-variation-settings rule — the voice system is not wired at all',
    });
  else if (universal.length > 1)
    f.push({ selector: '*', line: universal[0].line, detail: `${universal.length} universal FVS rules; expected 1` });
  else if (!/var\(\s*--flar/.test(universal[0].value))
    f.push({
      selector: '*',
      line: universal[0].line,
      detail: `universal FVS does not read var(--flar): ${universal[0].value}`,
    });

  add(7, "Exactly one font-variation-settings, on * , reading --flar (R8')", f);
}

// 11 — the flared set in CSS is exactly the `voice: 'flared'` set in RUNGS.
//
// THIS IS THE CHECK THE BENCH NEEDED AND DID NOT HAVE. Its hand-written band
// list named `.case-study-prose > h1` (matches nothing) and `.text-hero` (used
// by no component), and omitted `.hero-block__title`, which is the only live
// rung-5 element. Rung 5 therefore rendered no flare for an entire judgment
// session, and every gate stayed green because no gate compared the two lists.
//
// So: one list in RUNGS, one rule in CSS, and a build failure the moment they
// disagree in either direction — a selector in CSS that is not flared, or a
// flared selector missing from CSS.
//
// IT READS `voice`, NOT `band`, AS OF C5. Those were the same key until the 52px
// cut needed .text-cover and .friction-beat__headline to keep `band: 'display'`
// (which is true of them) while losing the flare (which is the ruling). `band`
// is still on every entry and is deliberately not read here.
//
// WHAT THIS CANNOT SEE, stated rather than implied: whether any of these
// selectors matches a real element. That is a DOM question and this is a CSS
// parser. scripts/assert-bands.mjs answers it, and it needs a running server,
// so it gates the commit by being run rather than by npm run build.
{
  const f = [];
  // `!r.dead` — a selector that renders nowhere is not given a voice value. It
  // stays in the map so the fact is visible; it stays out of the band so the
  // band means something.
  const expected = new Set(
    RUNGS.filter((r) => r.voice === 'flared' && !r.dead).map((r) => r.selector),
  );

  // The rule that sets --flar: 100. Selectors are comma-separated; postcss keeps
  // them as one string.
  const flareRules = decls.filter((d) => d.prop === '--flar' && d.value.trim() === '100');
  if (flareRules.length === 0) {
    f.push({ selector: '(none)', line: 0, detail: 'no rule sets --flar: 100 — the flared voice is unwired' });
  } else {
    const inCss = new Set(
      flareRules.flatMap((d) => d.selector.split(',').map((x) => x.replace(/\s+/g, ' ').trim())),
    );
    for (const sel of expected)
      if (!inCss.has(sel))
        f.push({ selector: sel, line: 0, detail: `RUNGS gives it voice 'flared' but no CSS rule gives it --flar: 100` });
    for (const sel of inCss)
      if (!expected.has(sel))
        f.push({ selector: sel, line: flareRules[0].line, detail: `takes --flar: 100 but RUNGS gives it voice 'plain'` });
  }
  add(11, "The flared set in CSS matches RUNGS' voice: 'flared', both ways (§3.4)", f);
}

// 8a — STATIC: the self-hosted font is wired to a file that exists.
//
// This used to assert that next/font/google's `axes` array named opsz and wdth,
// because omitting it served a weight-only file and made every font-stretch and
// optical-sizing rule silently inert — a bug this repo actually shipped. Under
// next/font/local there IS no axes array: the axes come from the binary. So the
// failure mode moved rather than went away, and the guard moves with it.
//
// THREE LAYERS, AND NONE OF THEM CLAIMS THE OTHERS' COVERAGE:
//   scripts/build-commissioner-font.sh  asserts the BINARY's axes and ranges
//   this check (8a)                     asserts the WIRING is intact
//   components/font-load-probe.tsx (8b) asserts FLAR actually RENDERS
// Checking the binary's axes from here would mean parsing woff2 in a CSS linter;
// the build script already does it at the point the bytes are produced.
{
  const f = [];
  let src = '';
  try {
    src = stripComments(await readFile(FONTS_FILE, 'utf8'));
  } catch {
    f.push({ selector: FONTS_FILE, line: 0, detail: 'file not found' });
  }
  if (src) {
    if (!/next\/font\/local/.test(src))
      f.push({ selector: FONTS_FILE, line: 0, detail: 'does not use next/font/local' });

    // src path must RESOLVE. This is the one member of the family that fails
    // closed at build; asserting it here names it rather than leaving it to a
    // stack trace.
    const srcM = /src\s*:\s*['"]([^'"]+)['"]/.exec(src);
    if (!srcM) f.push({ selector: FONTS_FILE, line: 0, detail: 'no src: path found' });
    else {
      const rel = srcM[1].replace(/^\.\//, '');
      if (!existsSync(join('app', rel)))
        f.push({ selector: FONTS_FILE, line: 0, detail: `src points at app/${rel}, which does not exist` });
    }

    // The variable name must match what globals.css consumes. A mismatch FAILS
    // OPEN: the font simply never applies and the page renders in fallback.
    const varM = /variable\s*:\s*['"]([^'"]+)['"]/.exec(src);
    const varName = varM ? varM[1] : null;
    if (!varName) f.push({ selector: FONTS_FILE, line: 0, detail: 'no variable: name found' });
    else if (!css.includes(`var(${varName})`))
      f.push({
        selector: FONTS_FILE,
        line: 0,
        detail: `variable is ${varName} but ${CSS_FILE} never reads var(${varName}) — the font would silently not apply`,
      });

    // Declared range must match the instanced binary, so the browser and the
    // file give the same answer to a request above 720.
    const wM = /weight\s*:\s*['"]([^'"]+)['"]/.exec(src);
    if (!wM || wM[1].trim() !== '340 720')
      f.push({
        selector: FONTS_FILE,
        line: 0,
        detail: `weight is ${wM ? `'${wM[1]}'` : 'unset'}, expected '340 720' to match the instanced binary`,
      });
  }
  add('8a', 'app/fonts.ts is wired to an existing local font file (§2)', f);
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
        // stripComments, because app/page.tsx's own doc-comment says
        // "three domain nouns jump to font-[720]" and was being counted as a
        // fourth shipped utility. A blind-spot report that overcounts is a
        // different lie from one that undercounts, and neither is acceptable
        // in a message whose whole job is to state a limit accurately.
        const s = stripComments(await readFile(p, 'utf8'));
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
      `Check 4 parses ${CSS_FILE} only and cannot see these.`,
  );
  {
    // DO NOT READ THE COUNT AS LIVE SURFACES. It walks app/ and components/,
    // and app/sandbox/home-video/page.tsx duplicates the home hero verbatim,
    // so the sandbox copy is counted beside the real one. Measured 21 Aug:
    // 7 occurrences, 3 of them the live home hero (consumer / enterprise /
    // defense inside .text-lede), 4 the sandbox duplicate. The blind spot is
    // real; it is smaller than the number looks.
    const live = sig.filter((w) => !w.file.includes('/sandbox/'));
    console.log(
      `    of which ${live.length} on live routes and ${sig.length - live.length} in app/sandbox/ (duplicated markup, not a second surface)`,
    );
  }
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
