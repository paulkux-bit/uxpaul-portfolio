import { RevealList } from '@/components/reveal-list';
import { QuickHit } from './quick-hit';
import { templateB } from '@/app/data/template-b';

/**
 * The "Earlier work" shelf list. Server Component. Renders the semantic <ol>
 * (via RevealList, which owns the scroll-reveal client island), each row an
 * <li>. The rows separate by their hairlines, not by space, and the list
 * reveals as one unit.
 */
export function QuickHitsList() {
  return (
    <RevealList className="shelf__list">
      {templateB.map((piece) => (
        <QuickHit key={piece.slug} piece={piece} />
      ))}
    </RevealList>
  );
}
