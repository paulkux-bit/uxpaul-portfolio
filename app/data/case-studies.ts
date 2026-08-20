// Temporary source of truth for the case-study index until MDX-driven indexing
// lands. Field names match the frontmatter contract. Outcome metric, summary,
// role, and timeframe are placeholder tokens to be filled per case study.

export interface CaseStudy {
  /** Route segment: /case-studies/[slug] */
  slug: string;
  /** First-person problem framing — the card's primary title. */
  problemFraming: string;
  projectName: string;
  client: string;
  /** Outcome headline — placeholder token until real metrics land. */
  headline: string;
  /** 1–2 sentence summary — placeholder. */
  summary: string;
  role: string;
  timeframe: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'uscg-bard',
    problemFraming: 'How do you unify 56 jurisdictions without changing one?',
    projectName: 'Bard',
    client: 'U.S. Coast Guard',
    headline: '[OUTCOME METRIC]',
    summary: '[1–2 sentence summary placeholder]',
    role: '[ROLE]',
    timeframe: '[TIMEFRAME]',
  },
  {
    slug: 'us-navy-fdt-e',
    problemFraming: 'How do you verify what the AI thinks it saw?',
    projectName: 'FDT-E',
    client: 'U.S. Navy',
    headline: '[OUTCOME METRIC]',
    summary: '[1–2 sentence summary placeholder]',
    role: '[ROLE]',
    timeframe: '[TIMEFRAME]',
  },
  {
    slug: 'us-navy-dagr',
    problemFraming: 'What can the enemy see?',
    projectName: 'Dagr',
    client: 'U.S. Navy',
    headline: '[OUTCOME METRIC]',
    summary: '[1–2 sentence summary placeholder]',
    role: '[ROLE]',
    timeframe: '[TIMEFRAME]',
  },
  {
    slug: 'urbn-shipping',
    problemFraming: 'Why were customers not excited by free shipping?',
    projectName: 'Shipping',
    client: 'URBN',
    headline: '[OUTCOME METRIC]',
    summary: '[1–2 sentence summary placeholder]',
    role: '[ROLE]',
    timeframe: '[TIMEFRAME]',
  },
  {
    slug: 'nuuly',
    problemFraming: 'How does a rented dress get back out in time?',
    projectName: 'Nuuly',
    client: 'URBN',
    headline: '[OUTCOME METRIC]',
    summary: '[1–2 sentence summary placeholder]',
    role: '[ROLE]',
    timeframe: '[TIMEFRAME]',
  },
];
