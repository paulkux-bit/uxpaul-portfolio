import Image from 'next/image';
import type { ReactNode } from 'react';
import { PlaceholderFrame } from './_placeholder-utils';

interface FramedPairItem {
  src: string;
  alt: string;
  /** Per-image caption — rendered below each panel (not a shared caption).
   *  ReactNode so authors can include <cite>/<a> if needed. */
  caption?: ReactNode;
}

interface FramedPairProps {
  left: FramedPairItem;
  right: FramedPairItem;
  /** Render both panels as quiet placeholders until real images land. */
  placeholder?: boolean;
  /** Warm "shown specimen" treatment around each image (shared with Figure). Default true. */
  framed?: boolean;
  /** Aspect ratio of each panel. Default 16 / 9 — at half-band each reads ~293px tall. */
  ratio?: string;
  /** Stack the two panels vertically below md (default). Set false to keep them
   *  side by side on mobile when they remain legible at ~190px wide. */
  stackMobile?: boolean;
}

/**
 * Two parallel framed evidence panels side by side, each with its OWN caption.
 * Distinct from <Compare> (before/after, divider, short labels + one shared
 * caption): FramedPair is for two co-equal pieces of evidence shown together,
 * captioned independently. Fills its container (e.g. a .cs-section band → half
 * each); stacks below md by default for legibility. Server-rendered.
 */
export function FramedPair({
  left,
  right,
  placeholder,
  framed = true,
  ratio = '16 / 9',
  stackMobile = true,
}: FramedPairProps) {
  const cellClass = 'figure framed-pair__cell' + (framed ? ' figure--framed' : '');
  const sizes =
    '(max-width: 767px) 100vw, (max-width: 1023px) 50vw, min(calc((min(100vw - 4rem, 1088px) - 1.5rem) / 2), 540px)';

  const panels: FramedPairItem[] = [left, right];

  return (
    <div className="framed-pair" data-stack-mobile={stackMobile ? 'true' : 'false'}>
      {panels.map((panel, i) => (
        <figure key={i} className={cellClass}>
          {placeholder ? (
            <PlaceholderFrame src={panel.src} ratio={ratio} />
          ) : (
            <Image
              src={panel.src}
              alt={panel.alt}
              width={1600}
              height={900}
              sizes={sizes}
              quality={85}
              className="figure__image"
            />
          )}
          {panel.caption ? (
            <figcaption className="figure__caption">{panel.caption}</figcaption>
          ) : null}
        </figure>
      ))}
    </div>
  );
}
