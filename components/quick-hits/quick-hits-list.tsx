import { RevealList } from '@/components/reveal-list';
import { QuickHit } from './quick-hit';
import { templateB } from '@/app/data/template-b';

/**
 * The "Client work" shelf list. Server Component — renders the semantic <ol>
 * (via RevealList, which owns the scroll-reveal client island) with each row
 * as an <li>. No stagger (short list).
 */
export function QuickHitsList() {
  return (
    <RevealList className="list-none space-y-m md:space-y-l">
      {templateB.map((piece) => (
        <li key={piece.slug}>
          <QuickHit piece={piece} />
        </li>
      ))}
    </RevealList>
  );
}
