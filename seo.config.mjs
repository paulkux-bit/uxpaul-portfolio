// ============================================================================
// PERMANENT NOINDEX  --  site-wide search-engine indexing
//
// BLOCK_INDEXING is true and STAYS TRUE. It is not a launch switch. Do not set
// it to false.
//
// Paul does not want this site discoverable by name search, by anyone, ever.
// The goal is a site that works for anyone he sends the link to, and never
// surfaces when a past or current employer searches his name. That is a
// permanent property of the site, not a pre-launch state to grow out of.
//
// LAUNCH IS THE DNS CUTOVER to uxpaul.com, with noindex still on. Launching
// changes where the site lives, not whether search engines can index it.
//
// While true, the whole site is kept out of search indexes two ways, on every
// route:
//   1. app/robots.ts    -> robots.txt "Disallow: /"           (advisory)
//   2. next.config.mjs   -> X-Robots-Tag: noindex, nofollow   (enforcing header)
//
// This comment block used to read ">>> TO LAUNCH: set BLOCK_INDEXING to false.
// That is the ONE edit. <<<", and justified itself with a temporary reason -
// that four of five case studies 404 and /about was a placeholder. Both are
// replaced deliberately. The old instruction would undo the thing Paul wants,
// and a temporary reason invites re-enabling once the conditions pass. The
// real reason has nothing to do with build state.
//
// __tests__/noindex.test.mjs asserts this, because a comment does not stop
// anyone and this failure is invisible: flipping the flag breaks no gate, ships
// green, and the consequence only appears once Google has crawled the site.
//
// Note: this flag does NOT touch the per-page noindex on app/sandbox/* pages,
// which also 404 in production via app/sandbox/layout.tsx.
// ============================================================================

export const BLOCK_INDEXING = true;
