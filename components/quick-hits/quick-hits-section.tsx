import { QuickHitsList } from './quick-hits-list';

/**
 * "Client work": the shelf of four agency-era client pieces (Template B),
 * below Selected Work on the home page. Server Component. The section gap is
 * owned by the home wrapper's vertical rhythm (space-y), matching the Selected
 * Work section; the label is the same sentence-case treatment as "Selected work".
 * No agency name appears on the shelf or in the dialog.
 */
export function QuickHitsSection() {
  return (
    <section aria-labelledby="client-work" className="space-y-m">
      <p id="client-work" className="text-caption font-semibold tracking-wide text-muted">
        Client work
      </p>
      <QuickHitsList />
    </section>
  );
}
