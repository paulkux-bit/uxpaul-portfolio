/**
 * Single source of truth for which case studies have a live route.
 *
 * Adding an entry here is what publishes a case study: it creates the
 * /case-studies/[slug] route AND turns that study's index card back into a
 * link. There is no second list to keep in sync, and no `published` boolean
 * to forget.
 *
 * The dynamic imports stay literal string arguments so Next.js can still
 * analyze them statically and build the routes at compile time.
 */
export const caseStudyRoutes = {
  'uscg-bard': () => import('@/app/content/case-studies/uscg-bard.mdx'),
  'us-navy-fdt-e': () => import('@/app/content/case-studies/us-navy-fdt-e.mdx'),
  'us-navy-dagr': () => import('@/app/content/case-studies/us-navy-dagr.mdx'),
  'urbn-delivery-promise': () => import('@/app/content/case-studies/urbn-delivery-promise.mdx'),
  'nuuly': () => import('@/app/content/case-studies/nuuly.mdx'),
} as const;

export type PublishedSlug = keyof typeof caseStudyRoutes;

/** True when the slug has a route to link to. */
export function isPublished(slug: string): slug is PublishedSlug {
  return slug in caseStudyRoutes;
}
