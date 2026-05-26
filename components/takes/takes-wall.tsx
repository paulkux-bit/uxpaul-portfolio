import { getWallTakes, SLOT_SPAN, type Take } from '@/app/data/takes';
import { RevealWall } from './reveal-wall';
import { TakeCard } from './take-card';

/**
 * The 12-col typographic wall. Server Component. Renders the build-seeded
 * curated selection (getWallTakes — 6-8 from the featured pool, mixed
 * compositions, no adjacent template dupes, deterministic per deploy). Hairlines
 * are computed from the *selected* set's slot spans (greedy row-pack), so they
 * scale to any count/mix. RevealWall (client) owns the one-shot entrance.
 */
function computeDividers(items: Take[]) {
  const rows: Take[][] = [];
  let row: Take[] = [];
  let sum = 0;
  for (const t of items) {
    const span = SLOT_SPAN[t.slot];
    if (sum + span > 12) {
      rows.push(row);
      row = [];
      sum = 0;
    }
    row.push(t);
    sum += span;
  }
  if (row.length) rows.push(row);

  const lastRow = rows.length - 1;
  const flags = new Map<string, { right: boolean; bottom: boolean }>();
  rows.forEach((r, ri) =>
    r.forEach((t, ci) =>
      flags.set(t.id, { right: ci !== r.length - 1, bottom: ri === lastRow }),
    ),
  );
  return flags;
}

export function TakesWall() {
  const selected = getWallTakes();
  const dividers = computeDividers(selected);
  return (
    <RevealWall className="takes-wall">
      {selected.map((take, i) => {
        const d = dividers.get(take.id)!;
        return (
          <TakeCard
            key={take.id}
            take={take}
            dividerRight={d.right}
            dividerBottom={d.bottom}
            order={i + 1}
          />
        );
      })}
    </RevealWall>
  );
}
