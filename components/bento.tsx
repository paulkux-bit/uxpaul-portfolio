import Image from 'next/image';
import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react';
import { type Slot, SLOT_ASPECT, SLOT_COLS } from '@/lib/bento-slots';

/**
 * <BentoTheme> / <BentoItem> + breakouts <BentoBand> / <BentoRibbon>
 * — a reusable, count-driven bento gallery.
 *
 * BentoTheme lists 2–5 standard items; it picks a balanced preset, assigns each
 * a slot (12-col span + aspect), and places ANY asset in ANY slot via
 * object-fit:cover + object-position derived from the item's `focal` (0..1).
 * That focal→object-position step decouples a crop's native aspect from the slot
 * it lands in. Within a row, slots share one aspect → equal height → the per-row
 * subgrid caption baseline-lock holds.
 *
 * BentoBand (variable solo aspect, e.g. 4.9:1) and BentoRibbon (extreme aspect,
 * 13:1 / 22:1, horizontal-scroll on mobile) are full-width SOLO rows that never
 * share a row — that isolation is what preserves the per-row baseline-lock for
 * the standard tiles. Authored inline as BentoTheme children; BentoTheme counts
 * only standard items for the preset and interleaves breakouts at their document
 * position.
 *
 * Images never swap with theme (no srcDark): a light-design or dark-design screen
 * stays as-is on either canvas. Server component, zero JS. `.bento-theme__*`
 * namespace (`.bento__*` belongs to the unrelated <BentoGrid>).
 */

/** Crop anchor, 0..1 (manifest-native). 'top'/'center' are sugar. */
type Focal = 'center' | 'top' | { x: number; y: number };

/** src REQUIRES alt (SC 1.1.1 type-level guard; alt="" for decorative). Omit both
 *  for a sandbox geometry placeholder (grey box at the slot aspect). */
type BentoItemProps = {
  caption: string;
  /** Muted continuation after the bold lead; carries its own leading connector. */
  gloss?: string;
  focal?: Focal;
  /** Author hint — wins over the preset. If ALL items set it, the preset is bypassed. */
  slot?: Slot;
  /** Sandbox placeholder label, e.g. "02 · wide · 16:10" (rendered only when no src). */
  label?: string;
  /** Sandbox placeholder tone — fixed warm oklch stand-in for a fixed-pixel screenshot. */
  tone?: 'light' | 'dark';
} & ({ src: string; alt: string } | { src?: undefined; alt?: undefined });

/** Breakout tiles (band / ribbon). Same SC 1.1.1 guard; `aspect` is N:1. */
type BreakoutProps = {
  caption?: string;
  gloss?: string;
  focal?: Focal;
  aspect: number;
  label?: string;
} & ({ src: string; alt: string } | { src?: undefined; alt?: undefined });

interface BentoThemeProps {
  intro?: ReactNode;
  children: ReactNode;
}

/** Row aspect family — drives the MOBILE 1-up/2-up + lock decision (keyed on ratio,
 *  not column count, so 3:4 standard pairs go 2-up instead of towering full-width). */
const SLOT_RATIO: Record<Slot, 'landscape' | 'portrait' | 'square'> = {
  feature: 'landscape',
  wide: 'landscape',
  standard: 'portrait',
  tall: 'portrait',
  compact: 'square',
};

/** `sizes` per slot: lg+ band fractions; below lg, span-6 full-width, span-4 2-col. */
const SLOT_SIZES: Record<Slot, string> = {
  feature: '(min-width: 1024px) min(calc(100vw - 4rem), 1088px), calc(100vw - 3rem)',
  wide: '(min-width: 1024px) min(calc(50vw - 2.5rem), 536px), (min-width: 768px) calc(100vw - 4rem), calc(100vw - 3rem)',
  standard:
    '(min-width: 1024px) min(calc(50vw - 2.5rem), 536px), (min-width: 768px) calc(100vw - 4rem), calc(100vw - 3rem)',
  tall: '(min-width: 1024px) min(calc(33.34vw - 2rem), 352px), (min-width: 768px) calc(50vw - 2.75rem), calc(50vw - 2rem)',
  compact:
    '(min-width: 1024px) min(calc(33.34vw - 2rem), 352px), (min-width: 768px) calc(50vw - 2.75rem), calc(50vw - 2rem)',
};

/** Full-width breakout sizes (feature/band/ribbon span the band). */
const BREAKOUT_SIZES = '(max-width: 1152px) calc(100vw - 4rem), 1088px';

/** count → rows of slots. Within a row slots share aspect → one height → subgrid lock. */
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

/** Override mode: author slots drive the layout — chunk consecutive same-slot
 *  items into rows at SLOT_COLS capacity (three `compact` → one [1:1,1:1,1:1]). */
function overrideRows(slots: Slot[]): Slot[][] {
  const rows: Slot[][] = [];
  for (const s of slots) {
    const last = rows[rows.length - 1];
    if (last && last[0] === s && last.length < SLOT_COLS[s]) last.push(s);
    else rows.push([s]);
  }
  return rows;
}

function focalToPosition(focal: Focal = 'center'): string {
  if (focal === 'top') return '50% 0%';
  if (focal === 'center') return '50% 50%';
  return `${focal.x * 100}% ${focal.y * 100}%`;
}

/** Shared media inner: a real <Image fill> or a labeled placeholder box. The inset
 *  hairline is a CSS `::after` overlay on the wrapper (above the fill image), so it
 *  doesn't get painted over — handled in globals.css, not here. */
// Plain optional src/alt (not a union): callers destructure the authoring union
// apart, so the src⇒alt correlation is enforced up there, not here. alt is always
// defined when src is; `alt ?? ''` is a safe floor.
interface MediaInnerProps {
  src?: string;
  alt?: string;
  label?: string;
  tone?: 'light' | 'dark';
  sizes: string;
  objectPosition: string;
  priority: boolean;
}

function BentoMediaInner({ src, alt, label, tone, sizes, objectPosition, priority }: MediaInnerProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt ?? ''}
        fill
        sizes={sizes}
        priority={priority}
        className="bento-theme__img"
        style={{ objectPosition }}
      />
    );
  }
  // Toned placeholders drop `.figure-placeholder` so its mode-aware background
  // can't override the fixed warm-oklch tone in dark mode (a fixed-pixel screen
  // never swaps with the theme). Untoned ones keep the mode-aware tint.
  const className = tone
    ? `bento-theme__placeholder bento-theme__placeholder--${tone}`
    : 'figure-placeholder bento-theme__placeholder';
  return (
    <div className={className} aria-hidden>
      {label ? <span className="bento-theme__plabel">{label}</span> : null}
    </div>
  );
}

function BreakoutCaption({ caption, gloss }: { caption?: string; gloss?: string }) {
  if (!caption) return null;
  return (
    <figcaption className="bento-theme__caption">
      <span className="bento-theme__lead">{caption}</span>
      {gloss ? <span className="bento-theme__gloss">{' '}{gloss}</span> : null}
    </figcaption>
  );
}

function BentoFigure({ slot, priority, ...item }: BentoItemProps & { slot: Slot; priority: boolean }) {
  return (
    <figure
      className="bento-theme__item"
      data-slot={slot}
      style={{ '--bento-aspect': SLOT_ASPECT[slot] } as CSSProperties}
    >
      <figcaption className="bento-theme__caption">
        <span className="bento-theme__lead">{item.caption}</span>
        {item.gloss ? <span className="bento-theme__gloss">{' '}{item.gloss}</span> : null}
      </figcaption>
      <div className="bento-theme__media">
        <BentoMediaInner
          src={item.src}
          alt={item.alt}
          label={item.label}
          tone={item.tone}
          sizes={SLOT_SIZES[slot]}
          objectPosition={focalToPosition(item.focal)}
          priority={priority}
        />
      </div>
    </figure>
  );
}

/** Authoring surface. Inside <BentoTheme> the parent reads props and renders with
 *  the assigned slot; this standalone fallback fires only if used outside a theme. */
export function BentoItem(props: BentoItemProps) {
  return <BentoFigure {...props} slot={props.slot ?? 'standard'} priority={false} />;
}

/** Variable-aspect solo-row tile (e.g. 4.9:1). Full-width, upright at every breakpoint. */
export function BentoBand({ src, alt, caption, gloss, focal, aspect, label }: BreakoutProps) {
  return (
    <figure className="bento-band" style={{ '--band-aspect': `${aspect} / 1` } as CSSProperties}>
      <BreakoutCaption caption={caption} gloss={gloss} />
      <div className="bento-band__media">
        <BentoMediaInner
          src={src}
          alt={alt}
          label={label}
          sizes={BREAKOUT_SIZES}
          objectPosition={focalToPosition(focal)}
          priority={false}
        />
      </div>
    </figure>
  );
}

/** Extreme-aspect solo-row strip (13:1 / 22:1). Full-width on ≥md; on mobile a
 *  fixed-height horizontal-scroll track (the full strip is present, swipe to reveal). */
export function BentoRibbon({ src, alt, caption, gloss, focal, aspect, label }: BreakoutProps) {
  return (
    <figure className="bento-ribbon" style={{ '--ribbon-aspect': `${aspect} / 1` } as CSSProperties}>
      <BreakoutCaption caption={caption} gloss={gloss} />
      {/* Focusable scroll region so keyboard users can scroll the strip on mobile
          (the track is the overflow container; arrow keys need a focused scroller). */}
      <div
        className="bento-ribbon__track"
        tabIndex={0}
        role="group"
        aria-label={caption ?? alt ?? 'Scrollable wide image'}
      >
        <div className="bento-ribbon__canvas">
          <BentoMediaInner
            src={src}
            alt={alt}
            label={label}
            sizes={BREAKOUT_SIZES}
            objectPosition={focalToPosition(focal)}
            priority={false}
          />
        </div>
      </div>
    </figure>
  );
}

function isBreakout(el: ReactElement): boolean {
  return el.type === BentoBand || el.type === BentoRibbon;
}

export function BentoTheme({ intro, children }: BentoThemeProps) {
  const kids = Children.toArray(children).filter(isValidElement) as ReactElement[];

  // Split standard items from breakouts; count ONLY standard items for the preset.
  const itemEls: ReactElement<BentoItemProps>[] = [];
  const breakouts: { anchor: number; el: ReactElement }[] = [];
  for (const el of kids) {
    if (isBreakout(el)) breakouts.push({ anchor: itemEls.length, el });
    else itemEls.push(el as ReactElement<BentoItemProps>);
  }

  // Author slot wins. If ALL items are slotted → override mode (bypass the preset).
  const allSlotted = itemEls.length > 0 && itemEls.every((el) => el.props.slot);
  const rows: Slot[][] = allSlotted
    ? overrideRows(itemEls.map((el) => el.props.slot as Slot))
    : PRESETS[itemEls.length] ?? fallbackPreset(itemEls.length);

  // Per-ROW mixed-aspect guard (dev-only warn; never a whole-theme check, never a throw).
  if (process.env.NODE_ENV !== 'production') {
    rows.forEach((rowSlots, ri) => {
      const aspects = new Set(rowSlots.map((s) => SLOT_ASPECT[s]));
      if (aspects.size > 1) {
        console.warn(
          `[BentoTheme] row ${ri} mixes aspects (${rowSlots.join(', ')}). A shared row must share one aspect — use <BentoBand>/<BentoRibbon> for mixed aspects.`,
        );
      }
    });
  }

  const rowOffsets = rows.map((_, ri) => rows.slice(0, ri).reduce((n, r) => n + r.length, 0));
  // A breakout emits after the row that CONTAINS the item just before it (anchor−1) — i.e. the first
  // row whose cumulative end exceeds anchor−1. anchor 0 → before all rows (-1). This keeps a breakout
  // at its document position even when authored mid-row (rows are atomic, so it emits after its row
  // rather than floating to the top); trailing breakouts still emit after the last row.
  const emitAfter = breakouts.map((b) =>
    b.anchor === 0 ? -1 : rows.findIndex((_, i) => rowOffsets[i] + rows[i].length > b.anchor - 1),
  );

  return (
    <figure className="figure--bento-theme">
      {intro ? <div className="bento-theme__intro">{intro}</div> : null}
      <div className="bento-theme__rows">
        {breakouts.map((b, bi) =>
          emitAfter[bi] === -1 ? cloneElement(b.el, { key: `bo-pre-${bi}` }) : null,
        )}
        {rows.map((rowSlots, ri) => (
          <Fragment key={`r-${ri}`}>
            <div
            className="bento-theme__row"
            data-cols={rowSlots.length}
            data-ratio={SLOT_RATIO[rowSlots[0]]}
          >
              {rowSlots.map((presetSlot, ci) => {
                const i = rowOffsets[ri] + ci;
                const item = itemEls[i];
                if (!item) return null;
                const slot = item.props.slot ?? presetSlot;
                return <BentoFigure key={ci} {...item.props} slot={slot} priority={i === 0} />;
              })}
            </div>
            {breakouts.map((b, bi) =>
              emitAfter[bi] === ri ? cloneElement(b.el, { key: `bo-${ri}-${bi}` }) : null,
            )}
          </Fragment>
        ))}
      </div>
    </figure>
  );
}
