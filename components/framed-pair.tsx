import Image from 'next/image';
import type { ReactNode } from 'react';
import { PlaceholderFrame } from './_placeholder-utils';

interface FramedPairItem {
  src: string;
  alt: string;
  /** Per-image caption — rendered below each panel (not a shared caption).
   *  ReactNode so authors can include <cite>/<a> if needed. */
  caption?: ReactNode;
  /** Intrinsic pixel dimensions. Additive — default to 1600×900 (16:9) so existing
   *  callers are unchanged. Pass the real pixels for non-16:9 art (e.g. 3:2 crops)
   *  so next/image renders the true ratio instead of letterboxing into 16:9. */
  width?: number;
  height?: number;
  /** A black-ink drawing (an engraving, not a screenshot), shipped as ink on a
   *  TRANSPARENT ground, alpha = 255 - luminance. Adds .cover-art, whose invert
   *  turns the ink light in dark mode; the transparency is what lets the page show
   *  through, because on the page the blend has no backdrop (see .cover-art in
   *  globals.css). A white-ground file here renders as a black box in dark mode. */
  ink?: boolean;
  /** A simplified ink file shown only in dark mode (ruling draw-c, 9 Oct 2026):
   *  the same drawing with its faintest strokes dropped, because the full file
   *  reads too busy inverted on the dark page. Same size and treatment as `src`;
   *  requires `ink`. Both files render, and html.dark decides which shows
   *  (.framed-pair__ink-light / __ink-dark in globals.css). The site themes by
   *  the class on <html>, so <picture> with prefers-color-scheme would be wrong. */
  darkSrc?: string;
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
 *
 * The caption renders BELOW its image, deliberately — do not "fix" this to match
 * the bento captions. These annotate legacy screenshots with a verdict, and a
 * verdict reads after the evidence it judges; above, it would tell the reader
 * what to see before they can check it. The panels are static images, not
 * controls, so nothing depends on the caption as an accessible name. The bento
 * captions sit above for exactly that opposite reason; see BreakoutCaption in
 * components/bento.tsx.
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
            <>
              <Image
                src={panel.src}
                alt={panel.alt}
                width={panel.width ?? 1600}
                height={panel.height ?? 900}
                sizes={sizes}
                quality={85}
                className={
                  panel.ink
                    ? `figure__image cover-art${panel.darkSrc ? ' framed-pair__ink-light' : ''}`
                    : 'figure__image'
                }
              />
              {/* Both stay lazy (next/image's default), so the hidden one is not
                  fetched up front where the browser defers display:none lazy
                  images: Chromium does, measured 9 Oct 2026. WebKit fetched the
                  hidden file too, so Safari in dark mode may download both; that
                  cost was accepted (ruling A1). display:none also keeps the
                  hidden copy and its alt out of the accessibility tree. */}
              {panel.ink && panel.darkSrc ? (
                <Image
                  src={panel.darkSrc}
                  alt={panel.alt}
                  width={panel.width ?? 1600}
                  height={panel.height ?? 900}
                  sizes={sizes}
                  quality={85}
                  className="figure__image cover-art framed-pair__ink-dark"
                />
              ) : null}
            </>
          )}
          {panel.caption ? (
            <figcaption className="figure__caption">{panel.caption}</figcaption>
          ) : null}
        </figure>
      ))}
    </div>
  );
}
