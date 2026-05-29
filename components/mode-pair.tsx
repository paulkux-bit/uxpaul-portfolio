import Image from 'next/image';
import type { ReactNode } from 'react';
import { PlaceholderFrame } from './_placeholder-utils';

interface ModePairProps {
  light: string;
  dark: string;
  alt: string;
  caption?: ReactNode;
  placeholder?: boolean;
  ratio?: string;
}

/**
 * Side-by-side light + dark. Stacks on mobile. Showing both at once proves
 * the dual-mode token system at a glance — stronger evidence than rendering
 * only the active theme.
 */
export function ModePair({ light, dark, alt, caption, placeholder, ratio = '16 / 10' }: ModePairProps) {
  return (
    <figure className="figure figure--mode-pair">
      <div className="mode-pair__grid">
        <div className="mode-pair__cell mode-pair__cell--light" data-mode="light">
          <span className="mode-pair__label">Light</span>
          {placeholder ? (
            <PlaceholderFrame src={light} ratio={ratio} label="Light mode" />
          ) : (
            <Image
              src={light}
              alt={`${alt} (light mode)`}
              width={1440}
              height={900}
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={80}
              className="figure__image"
            />
          )}
        </div>
        <div className="mode-pair__cell mode-pair__cell--dark" data-mode="dark">
          <span className="mode-pair__label">Dark</span>
          {placeholder ? (
            <PlaceholderFrame src={dark} ratio={ratio} label="Dark mode" />
          ) : (
            <Image
              src={dark}
              alt={`${alt} (dark mode)`}
              width={1440}
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
