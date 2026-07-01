// Typed accessor over lib/bento-slots.json — the SINGLE SOURCE OF TRUTH for bento
// slot geometry (see the JSON's `$doc`). This file adds NO numbers of its own; it
// only re-exports the JSON's values with types so the component and the crop.py
// retina-floor check can never disagree. crop.py reads the same JSON directly.
import data from './bento-slots.json';

export type Slot = 'feature' | 'wide' | 'standard' | 'tall' | 'compact';

interface SlotGeom {
  aspect: [number, number];
  cols: number;
  maxRenderedWidthPx: number;
}

const slots = data.slots as unknown as Record<Slot, SlotGeom>;
const SLOT_KEYS = Object.keys(slots) as Slot[];

const bySlot = <T,>(pick: (g: SlotGeom) => T): Record<Slot, T> =>
  Object.fromEntries(SLOT_KEYS.map((s) => [s, pick(slots[s])])) as Record<Slot, T>;

/** CSS `aspect-ratio` string, e.g. `'16 / 10'` — fed to `--bento-aspect`. */
export const SLOT_ASPECT: Record<Slot, string> = bySlot((g) => `${g.aspect[0]} / ${g.aspect[1]}`);

/** Items-per-row capacity (drives override-mode chunking). */
export const SLOT_COLS: Record<Slot, number> = bySlot((g) => g.cols);

/** Max rendered width in CSS px across all breakpoints (the retina-floor basis). */
export const SLOT_MAX_WIDTH: Record<Slot, number> = bySlot((g) => g.maxRenderedWidthPx);

export const CONTAINER = data.container;
export const RETINA_DPR = data.retina.dpr;
