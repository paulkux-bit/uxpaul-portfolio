import { notFound } from 'next/navigation';

/**
 * Sandbox subtree gate. These are scratch pages — a bento stress test, a type
 * specimen, a card experiment — and they were reaching the production
 * deployment. The repo is public, so app/sandbox/ shipping alongside the case
 * studies showed no separation between scratch work and finished work, and
 * /sandbox/type-bard was the single heaviest route on the site at 374 KB,
 * larger than either published case study.
 *
 * PRODUCTION ONLY. Renders normally under `next dev` AND on Vercel preview
 * deployments, because reviewing a stress page from a phone via a preview link
 * is a real workflow. Only the production deployment 404s.
 *
 * THIS IS NOT A LAUNCH FLAG, and must not become one. It keys on VERCEL_ENV,
 * which Vercel sets, and has no relationship to BLOCK_INDEXING in
 * seo.config.mjs. Sandbox should 404 in production forever, not until launch,
 * so this never needs touching. If you find yourself editing this on launch
 * day, something has gone wrong upstream. (BLOCK_INDEXING is permanent too, and
 * also not a launch switch - that file no longer promises a one-edit launch.)
 *
 * THIS LAYOUT IS NOT THE SAFETY NET. __tests__/sandbox-guard.test.mjs is.
 *
 * The layout cannot catch a page that forgets its own guard, because the layout
 * is what produces the 404 that makes the omission look fine. Each sandbox page
 * carries the same guard, and it has to, because the two are not equivalent:
 *
 *   layout guard only   404, but 173,677 bytes with the page's content still
 *                       serialized into the RSC flight payload
 *   page guard          404, 9,718 bytes, content absent
 *
 * notFound() in a layout aborts its own segment but the page segment is still
 * rendered and shipped in the response body. Measured on /sandbox/type-bard,
 * which embeds the whole BARD case study: the layout-only version still had
 * "fifty-six jurisdictions" in the 404 response. So the PAGE guard is what
 * keeps content out of the artifact; this layout is what catches a fourth
 * sandbox page whose author forgets to add one. Keep both.
 *
 * WHAT NEITHER DOES: remove the route from the bundle. The chunks still ship;
 * the routes are unreachable, not absent. Removing them would mean conditional
 * pageExtensions, which makes a local `npm run build` produce a different route
 * set from Vercel's — and every verification in this project compares those two
 * as the same artifact. That trade was considered and refused.
 */
export default function SandboxLayout({ children }: { children: React.ReactNode }) {
  if (process.env.VERCEL_ENV === 'production') notFound();
  return <>{children}</>;
}
