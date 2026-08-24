import type { CSSProperties } from 'react';
import type { Take } from '@/app/data/takes';

/**
 * The typographic mark for a take. Decorative — `aria-hidden`, since the
 * eyebrow + thought below carry the accessible content (a screen reader
 * shouldn't spell out "W K W" or read coordinate strings). One dispatcher over
 * the four mark types (stacked / coords render line-per-item; inline / play
 * are single). The entrance pattern + stagger delay ride on this element (it's
 * what transitions); an optional per-take axisCharacter overrides the slot's
 * default weight via font-variation-settings (carried from the v5 pattern).
 *
 * WEIGHT IS THE ONLY AXIS LEFT. This built 'opsz' and 'wdth' into the string too,
 * carried over from Bricolage; Commissioner has neither, so both were inert strings
 * asking the renderer for axes the font does not expose. Removed with the migration's
 * other Bricolage residue. No take sets axisCharacter today, so nothing rendered
 * changes — this is the dead half of a live component going away.
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
    if (a.wght != null) style.fontVariationSettings = `'wght' ${a.wght}`;
  }

  const cls = `mark mark-${mark.type} entrance-${entrance}`;
  const lines = Array.isArray(mark.content) ? mark.content : null;

  return (
    <span className={cls} style={style} aria-hidden="true">
      {lines ? lines.map((line, i) => <span key={i}>{line}</span>) : (mark.content as string)}
    </span>
  );
}
