import { QuickHitsList } from './quick-hits-list';

/**
 * "Also shipped" — the brief-work shelf, below Selected Work on the home page.
 * Server Component. The section gap is owned by the home wrapper's vertical
 * rhythm (space-y), matching the Selected Work section; the label is the same
 * sentence-case treatment as "Selected work".
 */
export function QuickHitsSection() {
  return (
    <section aria-labelledby="also-shipped" className="space-y-8">
      <p id="also-shipped" className="text-caption font-semibold tracking-wide text-muted">
        Also shipped
      </p>
      <QuickHitsList />
    </section>
  );
}
