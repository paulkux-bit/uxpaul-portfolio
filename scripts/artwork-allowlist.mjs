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
  ARTWORK_DIRS.some((d) => rel.startsWith(`${d.path}/`));

export const isFixturePath = (rel) =>
  FIXTURE_DIRS.some((d) => rel === d || rel.startsWith(`${d}/`));

export const isArtworkSnippet = (text) =>
  ARTWORK_SNIPPETS.some((s) => text.includes(s.snippet));
