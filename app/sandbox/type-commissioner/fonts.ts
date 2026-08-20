import { Commissioner } from 'next/font/google';

/**
 * SANDBOX ONLY — route-local font loader for /sandbox/type-commissioner.
 *
 * Deliberately NOT in app/fonts.ts. That module is imported by the root layout,
 * so anything added there preloads on every route on the site. Commissioner is a
 * candidate, not a decision; calling next/font here means the woff2 is requested
 * only by this page and disappears entirely when the spike is deleted.
 *
 * `axes` — the same trap app/fonts.ts documents, with a different list. This repo
 * shipped the bug once: with the axes array absent, next/font/google served a
 * weight-only file and every font-stretch / optical-sizing rule was silently
 * inert in production. Under Commissioner the same failure is quieter still,
 * because there is no broken-looking fallback — the page renders as a competent
 * plain grotesque with every display voice missing and nothing throws. The
 * probe in page.tsx is what catches that; this line is what prevents it.
 *
 * VERIFIED against next@16.2.6's own font-data.json, which lists Commissioner
 * with all four axes:
 *
 *     FLAR 0-100 · VOLM 0-100 · slnt -12-0 · wght 100-900
 *
 * so custom uppercase tags are accepted and no self-host is required. Next
 * builds the request URL from that table, so the v2 API's uppercase-before-
 * lowercase axis sort cannot be got wrong by hand.
 *
 * `wght` is the default axis and must NOT be listed, exactly as in app/fonts.ts.
 *
 * `slnt` IS listed here and the shipping system would probably drop it. It costs
 * ~37 KB for a pure shear — contour and point counts are identical between the
 * roman and the oblique, so there are no italic outlines in this family. The
 * feasibility study's R9' already declines to use it for prose emphasis. It is
 * loaded here only so the spike can prove that conclusion by eye rather than
 * inherit it. If the answer holds, the production list is ['FLAR','VOLM'].
 */
export const commissioner = Commissioner({
  subsets: ['latin'],
  variable: '--font-commissioner',
  display: 'swap',
  axes: ['FLAR', 'VOLM', 'slnt'],
});
