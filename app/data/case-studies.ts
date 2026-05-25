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
  /** Path to the card's motion preview. Empty until motion files land. */
  motionVideo: string;
  /**
   * Static cover image from the case study's own UI — the default card cover
   * once content lands. Empty string until the content pass populates it.
   */
  coverImage: string;
  /**
   * Voice-quality alt for `coverImage` ("Navigation prototype showing
   * four-brand cross-shopping," not "screenshot of design"). Required whenever
   * `coverImage` is set — enforced by the data test, not the type system.
   */
  coverImageAlt: string;
  role: string;
  timeframe: string;
}

/** Which cover a card renders. Resolved by {@link coverTier}. */
export type CoverTier = 'motion' | 'image' | 'typographic';

/**
 * Resolve a study's cover tier by asset priority: motion > image >
 * typographic fallback. The typographic tier is the deliberate, content-less
 * cover (the problem framing set large), not an empty state.
 */
export function coverTier(study: CaseStudy): CoverTier {
  if (study.motionVideo) return 'motion';
  if (study.coverImage) return 'image';
  return 'typographic';
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'uscg-bard',
    problemFraming: 'How do you turn fleet data into a funding argument?',
    projectName: 'Bard',
    client: 'U.S. Coast Guard',
    headline: '[OUTCOME METRIC]',
    summary: '[1–2 sentence summary placeholder]',
    motionVideo: '',
    coverImage: '',
    coverImageAlt: '',
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
    motionVideo: '',
    coverImage: '',
    coverImageAlt: '',
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
    motionVideo: '',
    coverImage: '',
    coverImageAlt: '',
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
    motionVideo: '',
    coverImage: '',
    coverImageAlt: '',
    role: '[ROLE]',
    timeframe: '[TIMEFRAME]',
  },
  {
    slug: 'nuuly',
    problemFraming: 'How does a rented dress get back out in time?',
    projectName: 'Nuuly',
    client: 'Nuuly',
    headline: '[OUTCOME METRIC]',
    summary: '[1–2 sentence summary placeholder]',
    motionVideo: '',
    coverImage: '',
    coverImageAlt: '',
    role: '[ROLE]',
    timeframe: '[TIMEFRAME]',
  },
];
