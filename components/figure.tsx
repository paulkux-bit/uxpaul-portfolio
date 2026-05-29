import Image from 'next/image';
import type { ReactNode } from 'react';
import { PlaceholderFrame } from './_placeholder-utils';

interface FigureProps {
  src: string;
  alt: string;
  caption?: ReactNode;
  /** Set true while the screenshot is still missing. Shows a labeled box. */
  placeholder?: boolean;
  width?: number;
  height?: number;
  ratio?: string;
}

/**
 * Workhorse in-column figure. Stays inside the reading column.
 */
export function Figure({
  src,
  alt,
  caption,
  placeholder,
  width = 1440,
  height = 900,
  ratio,
}: FigureProps) {
  return (
    <figure className="figure">
      {placeholder ? (
        <PlaceholderFrame src={src} caption={caption} ratio={ratio} />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(max-width: 768px) 100vw, 680px"
          quality={80}
          className="figure__image"
        />
      )}
      {caption && !placeholder ? <figcaption className="figure__caption">{caption}</figcaption> : null}
    </figure>
  );
}
