import type { CSSProperties } from 'react';
import type { Take } from '@/app/data/takes';

/**
 * The typographic mark for a take. Decorative — `aria-hidden`, since the
 * eyebrow + thought below carry the accessible content (a screen reader
 * shouldn't spell out "W K W" or read coordinate strings). One dispatcher over
 * the four mark types (stacked / coords render line-per-item; inline / play
 * are single). The entrance pattern + stagger delay ride on this element (it's
 * what transitions); an optional per-take axisCharacter overrides the slot's
 * default width/weight via font-variation-settings (carried from the v5 pattern).
 */
export function TakeMark({
  mark,
  entrance,
  delaySeconds,
}: {
  mark: NonNullable<Take['mark']>;
  entrance: Take['entrance'];
  delaySeconds: number;
}) {
  const style: CSSProperties = { ['--take-delay' as string]: `${delaySeconds}s` };
  const a = mark.axisCharacter;
  if (a) {
    const parts: string[] = [];
    if (a.opsz != null) parts.push(`'opsz' ${a.opsz}`);
    if (a.wght != null) parts.push(`'wght' ${a.wght}`);
    if (a.wdth != null) parts.push(`'wdth' ${a.wdth}`);
    if (parts.length) style.fontVariationSettings = parts.join(', ');
  }

  const cls = `mark mark-${mark.type} entrance-${entrance}`;
  const lines = Array.isArray(mark.content) ? mark.content : null;

  return (
    <span className={cls} style={style} aria-hidden="true">
      {lines ? lines.map((line, i) => <span key={i}>{line}</span>) : (mark.content as string)}
    </span>
  );
}
