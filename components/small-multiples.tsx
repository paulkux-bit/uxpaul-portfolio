import Image from 'next/image';
import type { ReactNode } from 'react';
import { PlaceholderFrame } from './_placeholder-utils';

interface SmallMultiplesItem {
  src: string;
  alt: string;
  label?: string;
}

interface SmallMultiplesProps {
  items: SmallMultiplesItem[];
  caption?: ReactNode;
  placeholder?: boolean;
  ratio?: string;
  /** Hint for srcset sizing; defaults are good for 3–5 across. */
  columns?: 3 | 4 | 5;
}

/**
 * 3–5 thumbnails in a row, wraps on narrower screens. For filter taxonomies,
 * the four insight surfaces, status lifecycles — anything that reads as a set.
 */
export function SmallMultiples({
  items,
  caption,
  placeholder,
  ratio = '4 / 3',
  columns = 4,
}: SmallMultiplesProps) {
  const sizes = `(max-width: 768px) 50vw, ${Math.floor(100 / columns)}vw`;

  return (
    <figure className="figure figure--small-multiples" data-columns={columns}>
      <div className="small-multiples__grid">
        {items.map((item) => (
          <div key={item.src} className="small-multiples__cell">
            {placeholder ? (
              <PlaceholderFrame src={item.src} ratio={ratio} label={item.label ?? 'Thumb'} />
            ) : (
              <Image
                src={item.src}
                alt={item.alt}
                width={800}
                height={600}
                sizes={sizes}
                quality={75}
                className="figure__image"
              />
            )}
            {item.label ? <span className="small-multiples__label">{item.label}</span> : null}
          </div>
        ))}
      </div>
      {caption ? <figcaption className="figure__caption">{caption}</figcaption> : null}
    </figure>
  );
}
