// Temporary source of truth for the case-study index until MDX-driven indexing
// lands. Field names match the frontmatter contract.
//
// headline / summary / role / timeframe were removed 20 Aug 2026. They were
// placeholder tokens ('[OUTCOME METRIC]', '[ROLE]') on all five entries and
// every consumer of this module read none of them. The SEO description that
// looks like it uses `summary` reads MDX frontmatter through
// app/case-studies/[slug]/page.tsx, which imports case-study-routes, not this
// file. Do not reintroduce a field here before something renders it.

export interface CaseStudy {
  /** Route segment: /case-studies/[slug] */
  slug: string;
  /** First-person problem framing — the card's primary title. */
  problemFraming: string;
  projectName: string;
  client: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'uscg-bard',
    problemFraming: 'How do 56 jurisdictions align without changing?',
    projectName: 'Bard',
    client: 'U.S. Coast Guard',
  },
  {
    slug: 'us-navy-fdt-e',
    problemFraming: 'How do you verify what the AI thinks it saw?',
    projectName: 'FDT-E',
    client: 'U.S. Navy',
  },
  {
    slug: 'us-navy-dagr',
    problemFraming: 'What can the enemy see?',
    projectName: 'Dagr',
    client: 'U.S. Navy',
  },
  {
    // Slug only, 23 Aug. projectName and problemFraming are deliberately NOT updated to
    // the MDX frontmatter's "Delivery Promise" / "Why did free shipping stop working?":
    // the name is still open, the frontmatter's framing is a flagged placeholder, and the
    // house rule is write the study THEN the card. Bard shipped a card describing a
    // project that had stopped existing because the card was written first.
    slug: 'urbn-delivery-promise',
    problemFraming: 'Why were customers not excited by free shipping?',
    projectName: 'Shipping',
    client: 'URBN',
  },
  {
    slug: 'nuuly',
    problemFraming: 'How does a rented dress get back out in time?',
    projectName: 'Nuuly',
    client: 'URBN',
  },
];
