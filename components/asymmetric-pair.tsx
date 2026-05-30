import Image from 'next/image';
import type { ReactNode } from 'react';
import { PlaceholderFrame } from './_placeholder-utils';

type Ratio = '65/35' | '60/40' | '70/30';

type ImageCell = {
  kind: 'image';
  src: string;
  alt: string;
  placeholder?: boolean;
  framed?: boolean;
  ratio?: string;
};

type TextCell = {
  kind: 'text';
  label?: string;
  body: ReactNode;
};

type Cell = ImageCell | TextCell;

interface AsymmetricPairProps {
  /** Column ratio on md+; stacks 1fr on mobile. Default '65/35'. */
  ratio?: Ratio;
  left: Cell;
  right: Cell;
  /** Optional shared caption rendered below the grid in .figure__caption style. */
  caption?: ReactNode;
}

const RATIO_COLS: Record<Ratio, string> = {
  '65/35': '65fr 35fr',
  '60/40': '60fr 40fr',
  '70/30': '70fr 30fr',
};

const LEFT_FRACTION: Record<Ratio, number> = {
  '65/35': 0.65,
  '60/40': 0.6,
  '70/30': 0.7,
};

/**
 * Two-cell row with configurable ratio. Either cell can be an image or a text
 * block — the "caption-as-text" move that lets a piece of writing become a
 * layout element instead of fine print. Stacks 1fr on mobile.
 *
 * Adopts the same lg+ breakout as ConstrainedBleed (see the shared rule in
 * app/globals.css). The image-cell `sizes` hint is computed from the cell's
 * fractional share of the article inner width.
 */
export function AsymmetricPair({ ratio = '65/35', left, right, caption }: AsymmetricPairProps) {
  const leftFraction = LEFT_FRACTION[ratio];
  const rightFraction = 1 - leftFraction;

  return (
    <figure
      className="figure figure--asymmetric-pair"
      style={{ ['--pair-cols' as string]: RATIO_COLS[ratio] }}
    >
      <div className="asymmetric-pair__grid">
        <PairCell cell={left} fraction={leftFraction} />
        <PairCell cell={right} fraction={rightFraction} />
      </div>
      {caption ? <figcaption className="figure__caption">{caption}</figcaption> : null}
    </figure>
  );
}

function PairCell({ cell, fraction }: { cell: Cell; fraction: number }) {
  if (cell.kind === 'text') {
    return (
      <div className="asymmetric-pair__text">
        {cell.label ? <span className="asymmetric-pair__label">{cell.label}</span> : null}
        <div className="asymmetric-pair__body">{cell.body}</div>
      </div>
    );
  }

  const ratio = cell.ratio ?? '4 / 3';
  const framedClass = cell.framed ? ' figure--framed' : '';

  return (
    <div className={`asymmetric-pair__image${framedClass}`}>
      {cell.placeholder ? (
        <PlaceholderFrame src={cell.src} ratio={ratio} label="Image pending" />
      ) : (
        <Image
          src={cell.src}
          alt={cell.alt}
          width={1600}
          height={1200}
          // Below md: full column. md–lg: prose-column share. lg+: article-inner share.
          sizes={`(max-width: 767px) 100vw, (max-width: 1023px) ${Math.round(660 * fraction)}px, calc(min(100vw - 4rem, 1088px) * ${fraction})`}
          quality={80}
          className="figure__image"
        />
      )}
    </div>
  );
}
