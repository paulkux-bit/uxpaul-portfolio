import Image from 'next/image';
import type { ReactNode } from 'react';
import { PlaceholderFrame } from './_placeholder-utils';

interface FullBleedProps {
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
 * Breaks out of the reading column to the page wrapper width. Use sparingly:
 * the hero, the strongest outcome screen, maybe one more. Use `priority` only
 * on the LCP image — never below the fold.
 */
export function FullBleed({
  src,
  alt,
  caption,
  placeholder,
  priority,
  width = 2400,
  height = 1500,
  ratio = '16 / 10',
}: FullBleedProps) {
  return (
    <figure className="figure figure--full-bleed">
      {placeholder ? (
        <PlaceholderFrame src={src} caption={caption} ratio={ratio} label="Full-bleed pending" />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          sizes="100vw"
          quality={priority ? 90 : 85}
          className="figure__image"
        />
      )}
      {caption && !placeholder ? <figcaption className="figure__caption">{caption}</figcaption> : null}
    </figure>
  );
}
