// Source of truth for the "Also shipped" shelf — Template B brief-work entries
// rendered as committed book-spine blocks on the home page. Parallel to
// case-studies.ts.
//
// Colors are NOT stored here: `brand` maps to the --qh-{brand}-base / -foil CSS
// tokens via the [data-brand] selectors in globals.css, so dark mode cascades
// server-side with no client theme read. v1 is a non-interactive shelf.

export type QuickHitBrand = 'lionsgate' | 'red-cross' | 'bbc' | 'k-hovnanian';

export interface QuickHit {
  /** Maps to the --qh-{brand}-* tokens via data-brand; also the list key. */
  brand: QuickHitBrand;
  /** Brand name set in the site face, uppercased by text-eyebrow (not logo art). */
  wordmark: string;
  /** Short editorial title, book-title casing, 2-4 words. */
  title: string;
  /** Industry, shown as the right-aligned meta. */
  industry: string;
}

export const quickHits: QuickHit[] = [
  { brand: 'lionsgate', wordmark: 'Lionsgate', title: 'Opening Night', industry: 'Entertainment' },
  { brand: 'red-cross', wordmark: 'American Red Cross', title: 'Before the Hesitation', industry: 'Humanitarian' },
  { brand: 'bbc', wordmark: 'BBC', title: 'The Reading Room', industry: 'Media' },
  { brand: 'k-hovnanian', wordmark: 'K. Hovnanian', title: 'Before the Build', industry: 'Real Estate' },
  // 5th slot — populate when ready (add the brand id + its --qh-{brand}-base/-foil tokens):
  // { brand: '...', wordmark: '', title: '', industry: '' },
];
