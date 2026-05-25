import { RevealList } from '@/components/reveal-list';
import { QuickHit } from './quick-hit';
import { quickHits } from '@/app/data/quick-hits';

/**
 * The "Also shipped" shelf list. Server Component — renders the semantic <ol>
 * (via RevealList, which owns the scroll-reveal client island) with each book
 * as an <li>. No stagger (short list).
 */
export function QuickHitsList() {
  return (
    <RevealList className="list-none space-y-6 md:space-y-8">
      {quickHits.map((hit) => (
        <li key={hit.brand}>
          <QuickHit hit={hit} />
        </li>
      ))}
    </RevealList>
  );
}
