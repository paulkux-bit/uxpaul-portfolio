// The single list of "this is artwork, not UI chrome".
//
// Created for lint:interaction check 4 (no hand-authored <svg> icons), which is
// the first check that actually needs it. The colour system draws the same line
// in prose — its check 7 exempts "artwork" — but encodes no list, because it
// never had to: the illustrations were regenerated to `currentColor` fills and
// the paper grain is an feColorMatrix, so none of them contains a colour
// literal and there was nothing for check 7 to exclude.
//
// It lives in its own module so that when a second linter needs the same line
// drawn, it imports this rather than writing a second list. Two lists
// describing one set of files is the failure three migrations have been spent
// removing, and the second one always drifts.
//
// Each entry states why the thing is artwork rather than an icon.

/** Directories whose SVG content is illustration. */
export const ARTWORK_DIRS = [
  {
    path: 'components/fdte',
    reason: 'FDT-E case-study illustrations — traced line art, regenerated from .svg by scripts/regen-fdte-tsx.mjs, sized by layout not by adjacent type',
  },
  {
    path: 'components/oku',
    reason: 'OKU case-study illustrations — same pipeline (scripts/regen-oku-tsx.mjs), artwork with its own viewBox',
  },
  {
    path: 'components/nuuly-beats',
    reason: 'Nuuly friction-beat illustrations — same pipeline (scripts/regen-nuuly-beats-tsx.mjs), sized by layout not by adjacent type',
  },
  {
    path: 'components/promise-beats',
    reason: 'Delivery Promise friction-beat illustrations — same pipeline (scripts/regen-promise-beats-tsx.mjs), sized by layout not by adjacent type',
  },
];

/** Individual artwork FILES, where the surrounding directory is not all artwork.
 *
 * ARTWORK_DIRS cannot express these: the two Delivery Promise drawings sit beside
 * PromiseSequence.tsx, which is layout and must stay checked. Exempting the whole
 * case-study directory would quietly cover any future icon dropped in there, which
 * is the failure mode this list exists to prevent. Exact paths instead.
 *
 * These are DRAWN DATA, not icons: each has its own viewBox, is sized by layout
 * rather than by adjacent type, and carries no glyph an icon set could supply.
 * R3 ("Lucide is the only icon source") is about chrome; a hand-drawn journey line
 * has no Lucide equivalent to reach for. */
export const ARTWORK_FILES = [
  {
    path: 'components/case-studies/urbn-delivery-promise/JourneyLine.tsx',
    reason: 'Delivery Promise journey line — one shopper\'s order drawn as a line, ported from the approved Track A prototype; shape in a 1000x350 viewBox, not an icon',
  },
  {
    path: 'components/case-studies/urbn-delivery-promise/InversionChart.tsx',
    reason: 'Delivery Promise inversion chart — two plotted series in the same viewBox and line vocabulary as JourneyLine; drawn data, not an icon',
  },
];

/** Individual non-icon SVG payloads, matched by a distinctive substring. */
export const ARTWORK_SNIPPETS = [
  {
    snippet: 'feTurbulence',
    reason: 'the paper-grain noise texture on body::before — a generated texture, not a drawn icon (spec §2.4)',
  },
];

/** Fixture trees: test data for the linters themselves, never product code. */
export const FIXTURE_DIRS = ['scripts/fixtures'];

/** True when a repo-relative path is artwork or fixture data. */
export const isArtworkPath = (rel) =>
  ARTWORK_DIRS.some((d) => rel.startsWith(`${d.path}/`)) ||
  ARTWORK_FILES.some((f) => rel === f.path);

/** The reason a path is artwork, whichever list it came from. */
export const artworkReason = (rel) =>
  ARTWORK_DIRS.find((d) => rel.startsWith(`${d.path}/`))?.reason ??
  ARTWORK_FILES.find((f) => rel === f.path)?.reason;

export const isFixturePath = (rel) =>
  FIXTURE_DIRS.some((d) => rel === d || rel.startsWith(`${d}/`));

export const isArtworkSnippet = (text) =>
  ARTWORK_SNIPPETS.some((s) => text.includes(s.snippet));
