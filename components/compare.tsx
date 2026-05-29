import Image from 'next/image';
import type { ReactNode } from 'react';
import { PlaceholderFrame } from './_placeholder-utils';

interface CompareProps {
  a: string;
  b: string;
  labelA: string;
  labelB: string;
  alt: string;
  caption?: ReactNode;
  placeholder?: boolean;
  ratio?: string;
}

/**
 * Two labeled states side by side — for Your View / USCG View, before/after,
 * or any "one record, two readings" comparison. Stacks on mobile.
 */
export function Compare({ a, b, labelA, labelB, alt, caption, placeholder, ratio = '4 / 3' }: CompareProps) {
  return (
    <figure className="figure figure--compare">
      <div className="compare__grid">
        <div className="compare__cell">
          <span className="compare__label">{labelA}</span>
          {placeholder ? (
            <PlaceholderFrame src={a} ratio={ratio} label={labelA} />
          ) : (
            <Image
              src={a}
              alt={`${alt} — ${labelA}`}
              width={1200}
              height={900}
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={80}
              className="figure__image"
            />
          )}
        </div>
        <div className="compare__divider" aria-hidden />
        <div className="compare__cell">
          <span className="compare__label">{labelB}</span>
          {placeholder ? (
            <PlaceholderFrame src={b} ratio={ratio} label={labelB} />
          ) : (
            <Image
              src={b}
              alt={`${alt} — ${labelB}`}
              width={1200}
              height={900}
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={80}
              className="figure__image"
            />
          )}
        </div>
      </div>
      {caption ? <figcaption className="figure__caption">{caption}</figcaption> : null}
    </figure>
  );
}
