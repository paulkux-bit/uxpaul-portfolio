// ============================================================================
// LAUNCH GATE  --  site-wide search-engine indexing
//
// While BLOCK_INDEXING is true, the WHOLE site is kept out of search indexes
// two ways, on every route:
//   1. app/robots.ts    -> robots.txt "Disallow: /"           (advisory)
//   2. next.config.mjs   -> X-Robots-Tag: noindex, nofollow   (enforcing header)
//
// Why: the site is pre-launch. Four of five case studies 404 and /about is a
// placeholder, so it must not be crawled yet.
//
//   >>> TO LAUNCH: set BLOCK_INDEXING to false. That is the ONE edit. <<<
//   (It re-enables indexing everywhere; nothing else needs changing.)
//
// Note: this flag does NOT touch the per-page noindex on app/sandbox/* pages.
// Those stay noindex via their own route metadata, launch or not.
// ============================================================================

export const BLOCK_INDEXING = true;
