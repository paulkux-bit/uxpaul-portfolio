import type { Take } from '@/app/data/takes';
import { TakeMark } from './take-mark';

/**
 * One take. Server Component, NON-INTERACTIVE (no link/destination/hover-scale;
 * hover is a background tint only). The `comp-{composition}` class drives the
 * card's layout + per-template axis + thought scale (globals.css); the slot
 * drives base sizing; computed `dividerRight`/`dividerBottom` drive the
 * hairline grid. `statement` has no mark; eyebrow is optional.
 *
 * Entrance stagger: order → delay = 0.10 + (order−1)×0.08s, capped at order 8.
 */
export function TakeCard({
  take,
  dividerRight,
  dividerBottom,
  order,
}: {
  take: Take;
  dividerRight: boolean;
  dividerBottom: boolean;
  order: number;
}) {
  const delaySeconds = 0.1 + (Math.min(order, 8) - 1) * 0.08;

  const cls = [
    'take-card',
    `slot-${take.slot}`,
    `comp-${take.composition}`,
    dividerRight ? 'div-r' : '',
    dividerBottom ? 'div-b' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <article className={cls}>
      {take.mark && (
        <TakeMark mark={take.mark} entrance={take.entrance} delaySeconds={delaySeconds} />
      )}
      <div className="take-content">
        {take.eyebrow && <p className="take-eyebrow">{take.eyebrow}</p>}
        <p className="take-thought">{take.thought}</p>
      </div>
    </article>
  );
}
