import Image from 'next/image';
import {
  Children,
  isValidElement,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react';

/**
 * <BentoTheme> / <BentoItem> — a reusable, count-driven bento gallery.
 *
 * Generalizes the engine "Spine" into one component: the author lists 2–5
 * captioned images; the component picks a balanced preset, assigns each item a
 * slot (12-col span + aspect), and places ANY asset in ANY slot via
 * object-fit:cover + object-position derived from the item's `focal`. That
 * focal→object-position step is the core capability — it decouples a crop's
 * native aspect from the slot it lands in, so a 3:4 screenshot can sit in a
 * 16:10 slot without beheading content.
 *
 * Server component, render-time only (no client JS). Authored inline (in TSX or
 * MDX); the crop manifest.json is a reference catalog, never read at runtime.
 *
 * Naming: `.bento-theme__*` (the `.bento__*` namespace belongs to the older,
 * unrelated <BentoGrid>). Salvages EngineSurfaces' two-part caption treatment +
 * ResolutionBento's per-row subgrid caption baseline-lock; drops the rejected
 * colored-container fill/mask entirely (bare Paper, inset hairline only).
 */

type Slot = 'feature' | 'wide' | 'standard' | 'tall' | 'compact';
type Focal = 'center' | 'top' | { x: number; y: number };

/** src REQUIRES alt (SC 1.1.1 type-level guard; alt="" for a decorative image).
 *  Omit both for a sandbox geometry placeholder (grey box at the slot aspect). */
type BentoItemProps = {
  caption: string;
  /** Optional muted continuation after the bold lead (Ramp two-part label).
   *  Carries its own leading connector (a space or ", ") so it renders flush. */
  gloss?: string;
  /** Crop anchor for object-position. Default center; 'top'/{x,y} only when a
   *  center crop would clip key content. */
  focal?: Focal;
  /** Author hint — wins over the preset's assignment. Omit and the theme assigns. */
  slot?: Slot;
  srcDark?: string;
} & ({ src: string; alt: string } | { src?: undefined; alt?: undefined });

interface BentoThemeProps {
  /** Optional short intro above the grid (held to the reading measure). */
  intro?: ReactNode;
  children: ReactNode; // BentoItem[]
}

// Slot widths come from each row being `repeat(N, 1fr)` on the 1088 band (1rem
// gaps): a wide pair → 536 each, a tall trio → 352 each, a lone feature → 1088 —
// identical to the 12-col span model (feature 12 / wide·standard 6 / tall·compact 4),
// so no explicit grid-column span is needed. Only aspect + sizes vary per slot.
const SLOT_ASPECT: Record<Slot, string> = {
  feature: '16 / 10',
  wide: '16 / 10',
  standard: '3 / 4',
  tall: '3 / 4',
  compact: '1 / 1',
};

/** `sizes` per slot: lg+ band fractions; below lg, span-6 slots go full-width and
 *  span-4 (satellite) slots collapse to a capped 2-col. */
const SLOT_SIZES: Record<Slot, string> = {
  feature: '(min-width: 1024px) min(calc(100vw - 4rem), 1088px), calc(100vw - 3rem)',
  wide: '(min-width: 1024px) min(calc(50vw - 2.5rem), 536px), (min-width: 768px) calc(100vw - 4rem), calc(100vw - 3rem)',
  standard:
    '(min-width: 1024px) min(calc(50vw - 2.5rem), 536px), (min-width: 768px) calc(100vw - 4rem), calc(100vw - 3rem)',
  tall: '(min-width: 1024px) min(calc(33.34vw - 2rem), 352px), (min-width: 768px) calc(50vw - 2.75rem), calc(50vw - 2rem)',
  compact:
    '(min-width: 1024px) min(calc(33.34vw - 2rem), 352px), (min-width: 768px) calc(50vw - 2.75rem), calc(50vw - 2rem)',
};

/** count → rows of slots. Within a row slots share aspect → one height → the
 *  per-row subgrid caption lock holds. No L-shapes / masonry, no 5-equal. */
const PRESETS: Record<number, Slot[][]> = {
  2: [['wide', 'wide']],
  3: [['feature'], ['standard', 'standard']],
  4: [
    ['wide', 'wide'],
    ['standard', 'standard'],
  ],
  // THE SPINE: 2× 16:10 anchors over 3× 3:4 satellites.
  5: [
    ['wide', 'wide'],
    ['tall', 'tall', 'tall'],
  ],
};

/** Designed range is 2–5. Outside it, degrade gracefully rather than break. */
function fallbackPreset(count: number): Slot[][] {
  if (count <= 0) return [];
  if (count === 1) return [['feature']];
  const rows: Slot[][] = [];
  for (let i = 0; i < count; i += 3) {
    rows.push(Array<Slot>(Math.min(3, count - i)).fill('tall'));
  }
  return rows;
}

function focalToPosition(focal: Focal = 'center'): string {
  if (focal === 'top') return '50% 0%';
  if (focal === 'center') return '50% 50%';
  return `${focal.x}% ${focal.y}%`;
}

function BentoFigure({
  slot,
  priority,
  ...item
}: BentoItemProps & { slot: Slot; priority: boolean }) {
  const objectPosition = focalToPosition(item.focal);
  const sizes = SLOT_SIZES[slot];
  return (
    <figure
      className="bento-theme__item"
      data-slot={slot}
      style={{ '--bento-aspect': SLOT_ASPECT[slot] } as CSSProperties}
    >
      <p className="bento-theme__caption">
        <span className="bento-theme__lead">{item.caption}</span>
        {item.gloss ? <span className="bento-theme__gloss">{item.gloss}</span> : null}
      </p>
      <div className="bento-theme__media" data-has-dark={item.srcDark ? 'true' : undefined}>
        {item.src ? (
          <>
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes={sizes}
              priority={priority}
              className="bento-theme__img bento-theme__img--light"
              style={{ objectPosition }}
            />
            {item.srcDark ? (
              <Image
                src={item.srcDark}
                alt=""
                aria-hidden
                fill
                sizes={sizes}
                className="bento-theme__img bento-theme__img--dark"
                style={{ objectPosition }}
              />
            ) : null}
          </>
        ) : (
          // Sandbox geometry placeholder — grey box at the true slot aspect.
          <div className="figure-placeholder bento-theme__placeholder" aria-hidden />
        )}
      </div>
    </figure>
  );
}

/** Authoring surface. Inside <BentoTheme> the parent reads these props and
 *  renders the figure with the assigned slot; this standalone fallback only
 *  fires if a <BentoItem> is used outside a <BentoTheme>. */
export function BentoItem(props: BentoItemProps) {
  return <BentoFigure {...props} slot={props.slot ?? 'standard'} priority={false} />;
}

export function BentoTheme({ intro, children }: BentoThemeProps) {
  const items = Children.toArray(children).filter(isValidElement) as ReactElement<BentoItemProps>[];
  const preset = PRESETS[items.length] ?? fallbackPreset(items.length);
  // Flat item index where each row begins (pure — no render-time mutation).
  const rowOffsets = preset.map((_, ri) =>
    preset.slice(0, ri).reduce((n, row) => n + row.length, 0),
  );

  return (
    <figure className="figure--bento-theme">
      {intro ? <div className="bento-theme__intro">{intro}</div> : null}
      <div className="bento-theme__rows">
        {preset.map((rowSlots, ri) => (
          <div className="bento-theme__row" data-cols={rowSlots.length} key={ri}>
            {rowSlots.map((presetSlot, ci) => {
              const i = rowOffsets[ri] + ci;
              const item = items[i];
              if (!item) return null;
              // Author slot wins over the preset's assignment.
              const slot = item.props.slot ?? presetSlot;
              return <BentoFigure key={ci} {...item.props} slot={slot} priority={i === 0} />;
            })}
          </div>
        ))}
      </div>
    </figure>
  );
}
