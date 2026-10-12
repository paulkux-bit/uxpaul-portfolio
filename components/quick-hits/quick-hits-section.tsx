import { QuickHitsList } from './quick-hits-list';
import { ClientWorkDialog } from '@/components/client-work/client-work-dialog';

/**
 * "Earlier work": the shelf of four agency-era client pieces (Template B),
 * below Selected Work on the home page. Server Component. The section gap is
 * owned by the home wrapper's vertical rhythm (space-y), matching the Selected
 * Work section; the label is the same sentence-case treatment as "Selected work".
 * No agency name appears on the shelf or in the dialog. The internal name stays
 * client-work (the id below, the dialog and its CSS).
 *
 * The client work dialog renders once, after the list: the one client island
 * here besides the list's reveal. It renders nothing until a row is opened.
 */
export function QuickHitsSection() {
  return (
    <section aria-labelledby="client-work" className="space-y-m">
      <p id="client-work" className="text-caption font-semibold tracking-wide text-muted">
        Earlier work
      </p>
      <QuickHitsList />
      <ClientWorkDialog />
    </section>
  );
}
