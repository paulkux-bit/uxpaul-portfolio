import Image from 'next/image';
import type { ReactNode } from 'react';
import { PlaceholderFrame } from './_placeholder-utils';

interface ModePairProps {
  light: string;
  dark: string;
  alt: string;
  caption?: ReactNode;
  placeholder?: boolean;
  /** Break out of the 660px reading column at lg+ to the article inner width
   *  (shared rule in globals.css). Use when the dashboards need legible
   *  per-cell width — two cells at 660px = ~310 each, too small. */
  breakout?: boolean;
  ratio?: string;
}

/**
 * Side-by-side light + dark. Stacks on mobile. Showing both at once proves
 * the dual-mode token system at a glance — stronger evidence than rendering
 * only the active theme.
 */
export function ModePair({
  light,
  dark,
  alt,
  caption,
  placeholder,
  breakout,
  ratio = '16 / 10',
}: ModePairProps) {
  // When `breakout` is set, each cell renders at half the article inner width
  // (capped by --page-max-width − 4rem). Without breakout, each cell renders
  // at ~50vw of the prose column. The hint matters: at 1920 with breakout,
  // 50vw = 960px is wrong — actual cell is ~544px. Pinning the hint avoids the
  // browser fetching a needlessly larger srcset rung.
  const sizes = breakout
    ? '(max-width: 768px) 100vw, calc(min(100vw - 4rem, 1088px) / 2)'
    : '(max-width: 768px) 100vw, 50vw';

  return (
    <figure
      className="figure figure--mode-pair"
      {...(breakout ? { 'data-breakout': 'true' } : {})}
    >
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
              sizes={sizes}
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
              sizes={sizes}
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
