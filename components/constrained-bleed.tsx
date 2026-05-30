import Image from 'next/image';
import type { ReactNode } from 'react';
import { PlaceholderFrame } from './_placeholder-utils';

interface ConstrainedBleedProps {
  src: string;
  alt: string;
  caption?: ReactNode;
  placeholder?: boolean;
  priority?: boolean;
  width?: number;
  height?: number;
  ratio?: string;
}

/**
 * Breaks out of the 660px reading column at lg+ up to the article inner width
 * (`var(--page-max-width)` minus the article's inline padding) — never to the
 * viewport edge. Use for editorial-weight images that deserve more than the
 * prose column but don't earn the FullBleed treatment (which is reserved for
 * the hero). Below lg, renders inside the prose column like a regular Figure.
 *
 * The breakout itself lives in `app/globals.css` (the shared lg+ rule covering
 * .figure--constrained-bleed, .figure--asymmetric-pair, .figure--bento,
 * .figure--mode-pair[data-breakout='true'], and .figure--compare).
 */
export function ConstrainedBleed({
  src,
  alt,
  caption,
  placeholder,
  priority,
  width = 2400,
  height = 1500,
  ratio = '16 / 10',
}: ConstrainedBleedProps) {
  return (
    <figure className="figure figure--constrained-bleed">
      {placeholder ? (
        <PlaceholderFrame src={src} caption={caption} ratio={ratio} label="Constrained-bleed pending" />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          // Below lg: prose column (~660 at md, ~100vw at sm). At lg+: article inner,
          // capped at the shared --page-max-width minus 4rem inline padding.
          sizes="(max-width: 1023px) 100vw, min(calc(100vw - 4rem), 1088px)"
          quality={priority ? 90 : 85}
          className="figure__image"
        />
      )}
      {caption ? <figcaption className="figure__caption">{caption}</figcaption> : null}
    </figure>
  );
}
