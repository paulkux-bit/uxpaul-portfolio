import Image from 'next/image';
import type { CSSProperties, ReactNode } from 'react';
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
  /** Dark mode's version of an `ink` drawing: the simplified drawing (ruling
   *  draw-c, faintest strokes dropped) as a MASK, not an image (ruling 2b, 9 Oct
   *  2026). The tile shows a block filled with --text-secondary through it, so the
   *  ink takes the token's colour and follows the theme instead of rendering as
   *  inverted white. The value is a base path; scripts/build-ink-masks.mjs writes
   *  `${base}-640` and `${base}-1080`, each as .avif and .webp. html.dark decides
   *  which of the image and the mask shows (.framed-pair__ink-light / __ink-mask). */
  darkMask?: string;
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
/** The mask widths scripts/build-ink-masks.mjs writes: 640 for 1x screens, 1080
 *  for 2x and 3x. Change both together. */
const INK_MASK_WIDTHS = [640, 1080] as const;

/** image-set() for a mask: AVIF first with a WebP fallback (ruling A1). The
 *  unprefixed declaration comes last, so a browser that parses it uses it; one
 *  that cannot parse `type()` drops it at parse time and keeps the -webkit- WebP
 *  set. The URLs are literal, never var(): a var() would make an unparseable value
 *  invalid only at computed time, which leaves NO mask and paints a solid block. */
function inkMaskStyle(base: string): CSSProperties {
  const [w1, w2] = INK_MASK_WIDTHS;
  const webp = `-webkit-image-set(url("${base}-${w1}.webp") 1x, url("${base}-${w2}.webp") 2x)`;
  const set =
    `image-set(url("${base}-${w1}.avif") type("image/avif") 1x, url("${base}-${w2}.avif") type("image/avif") 2x, ` +
    `url("${base}-${w1}.webp") type("image/webp") 1x, url("${base}-${w2}.webp") type("image/webp") 2x)`;
  return { WebkitMaskImage: webp, maskImage: set };
}

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
          ) : panel.ink && panel.darkMask ? (
            /* The dark-mode ink is a mask laid OVER the light image, which stays in
               the layout in both themes (hidden with visibility in dark, not
               display). So the tile is exactly as tall in dark as in light: the
               image's height comes from the file the browser was served, and a
               block sized from the declared ratio put the two captions 1 CSS px
               apart at 1024 @2x (measured 9 Oct 2026). The cost is that dark mode
               downloads the light image too. visibility:hidden takes the image
               out of the accessibility tree, so the mask carries the alt. */
            <div className="framed-pair__ink">
              <Image
                src={panel.src}
                alt={panel.alt}
                width={panel.width ?? 1600}
                height={panel.height ?? 900}
                sizes={sizes}
                quality={85}
                className="figure__image cover-art framed-pair__ink-light"
              />
              <div
                role="img"
                aria-label={panel.alt}
                className="framed-pair__ink-mask"
                style={inkMaskStyle(panel.darkMask)}
              />
            </div>
          ) : (
            <Image
              src={panel.src}
              alt={panel.alt}
              width={panel.width ?? 1600}
              height={panel.height ?? 900}
              sizes={sizes}
              quality={85}
              className={panel.ink ? 'figure__image cover-art' : 'figure__image'}
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
