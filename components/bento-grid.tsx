import Image from 'next/image';
import type { ReactNode } from 'react';
import { PlaceholderFrame } from './_placeholder-utils';

type Span = 1 | 2 | 3 | 4;
type Columns = 3 | 4;

export interface BentoItem {
  src: string;
  alt: string;
  label?: string;
  /** Column span on md+ (mobile collapses every cell to single span). Default 1. */
  span?: Span;
  framed?: boolean;
  ratio?: string;
}

interface BentoGridProps {
  columns: Columns;
  items: BentoItem[];
  caption?: ReactNode;
  /** Shorthand — when true, every item renders in placeholder mode. */
  placeholder?: boolean;
}

/**
 * Editorial grid where cells of unequal column span share rows. The move that
 * separates a bento from a uniform tile gallery is that one cell (often the
 * "lead" specimen) spans wider than the others. Mobile collapses to a 2-col
 * grid where every cell is equal — the bento composition only manifests at
 * md+. Adopts the shared lg+ breakout.
 *
 * Items-prop API mirrors `<SmallMultiples>` — confirmed net-positive over a
 * compound `<BentoGrid.Cell>` API in the Phase 5 audit (MDX authoring
 * ergonomics + discriminated-union type safety + parity with the existing
 * idiom). Don't refactor without a new triggering case.
 */
export function BentoGrid({ columns, items, caption, placeholder }: BentoGridProps) {
  return (
    <figure className="figure figure--bento" data-columns={columns}>
      <div className="bento__grid">
        {items.map((item) => {
          const span: Span = item.span ?? 1;
          const ratio = item.ratio ?? '4 / 3';
          const isPlaceholder = placeholder ?? false;
          const framedClass = item.framed ? ' figure--framed' : '';

          // Approximate the cell's share of the article inner width at md+.
          // (Ignoring gap math — within ~2-3% per cell, irrelevant for srcset.)
          const fractionalShare = span / columns;
          // Mobile collapses to a 2-col grid where every cell is single span,
          // EXCEPT cells whose declared span equals or exceeds `columns` — those
          // take the full row and want 100vw on mobile, not 50vw.
          const mobileWidth = span >= columns ? '100vw' : '50vw';
          // Quality ladder: thumb-scale single-span cells stay at 80; wider
          // specimens (span ≥ 3) jump to 85 so the L4-style editorial cell
          // doesn't soften on a 1088px breakout.
          const cellQuality = span >= 3 ? 85 : 80;

          return (
            <div
              key={item.src}
              className={`bento__cell${framedClass}`}
              data-span={span}
            >
              {isPlaceholder ? (
                <PlaceholderFrame src={item.src} ratio={ratio} label={item.label ?? 'Bento cell'} />
              ) : (
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={1600}
                  height={1200}
                  sizes={`(max-width: 767px) ${mobileWidth}, calc(min(100vw - 4rem, 1088px) * ${fractionalShare})`}
                  quality={cellQuality}
                  className="figure__image"
                />
              )}
              {item.label ? <span className="bento__label">{item.label}</span> : null}
            </div>
          );
        })}
      </div>
      {caption ? <figcaption className="figure__caption">{caption}</figcaption> : null}
    </figure>
  );
}
