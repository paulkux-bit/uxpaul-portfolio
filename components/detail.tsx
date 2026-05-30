import Image from 'next/image';
import type { ReactNode } from 'react';
import { PlaceholderFrame } from './_placeholder-utils';

interface DetailProps {
  src: string;
  alt: string;
  caption?: ReactNode;
  placeholder?: boolean;
  /** Present the image on a warm-tinted canvas with padding around it. Pays
   *  hardest at this size — a 480px chip on a tinted frame reads as a curated
   *  specimen. */
  framed?: boolean;
  width?: number;
  height?: number;
  ratio?: string;
}

/**
 * Tight crop, narrower than the prose column. For badges, status chips,
 * a "look here" zoom on one element.
 */
export function Detail({
  src,
  alt,
  caption,
  placeholder,
  framed,
  width = 720,
  height = 540,
  ratio = '4 / 3',
}: DetailProps) {
  const className = `figure figure--detail${framed ? ' figure--framed' : ''}`;
  return (
    <figure className={className}>
      {placeholder ? (
        <PlaceholderFrame src={src} caption={caption} ratio={ratio} label="Detail" />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(max-width: 768px) 100vw, 480px"
          quality={80}
          className="figure__image"
        />
      )}
      {caption ? <figcaption className="figure__caption">{caption}</figcaption> : null}
    </figure>
  );
}
