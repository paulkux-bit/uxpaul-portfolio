'use client';

import Image from 'next/image';
import { useState, type CSSProperties } from 'react';

export interface FrictionMomentImage {
  src: string;
  width: number;
  height: number;
}

export interface FrictionMomentVehicle {
  /** The moving drawing: black ink on transparent, inverted in dark mode. */
  ink: FrictionMomentImage;
  /** The drawing's silhouette, used only as the mask for its knockout. */
  mask: FrictionMomentImage;
  /** End position and size, in percent of the stage (left/width of its width,
   *  top/height of its height). */
  box: { left: number; top: number; width: number; height: number };
}

export interface FrictionMomentProps {
  /** The still drawing the vehicles move across. */
  base: FrictionMomentImage;
  vehicles: FrictionMomentVehicle[];
  /** Accessible name for the art (the stage carries role="img"). */
  label: string;
  /** Caption lead, set like a bento caption's bold lead. */
  caption: string;
  /** Caption gloss, set muted after the lead. */
  gloss?: string;
}

/* The stage's widths for `sizes`: the section band (1088 at most) from 1024 up,
   the viewport less the page gutters below it. Same shape as bento.tsx's
   BREAKOUT_SIZES, because the moment sits at the same full content width. */
const STAGE_MAX_PX = 1088;
const stageSizes = (pct = 100) =>
  `(max-width: 1152px) calc((100vw - 4rem) * ${pct / 100}), ${Math.round((STAGE_MAX_PX * pct) / 100)}px`;

/**
 * The friction moment (ruling M2, 5 Oct 2026): one drawn moment in place of the
 * three friction-beat figures, with subtle motion. Built for Line of Sight's
 * convoy and kept generic, because each Template A study is to get one.
 *
 * STRUCTURE. The stage holds the still base drawing and, per vehicle, an
 * absolutely positioned box carrying a knockout (a --bg-canvas fill masked by the
 * vehicle's silhouette, so the base's lines do not show through it) under the
 * vehicle's ink. The stage is the accessible image (role="img" with the label);
 * the pause button is its sibling inside .friction-moment__art, not its child,
 * because the children of role="img" are presentational and a button there would
 * vanish from the accessibility tree. The art wrapper is also what positions the
 * button at the drawing's bottom right rather than the figure's, which includes
 * the caption.
 *
 * MOTION IS ALL CSS (globals.css, .friction-moment): a 10s loop on left, top and
 * opacity inside `prefers-reduced-motion: no-preference`. Each box carries its end
 * position twice, as left/top and as --l/--t, and the keyframes offset from
 * --l/--t. So with reduced motion, or before the stylesheet's animation applies,
 * every vehicle already sits at its end position, and the button is hidden by CSS.
 * Left and top rather than a transform: transform percentages resolve against the
 * box, not the stage, and the result was not shown to be pixel-identical, so the
 * swap is on the finesse list rather than done here.
 *
 * The client boundary is the button and nothing else: pausing sets
 * data-paused="true" on the figure, and CSS sets animation-play-state from it
 * (WCAG 2.2.2, a loop longer than five seconds needs a way to stop it).
 */
export function FrictionMoment({ base, vehicles, label, caption, gloss }: FrictionMomentProps) {
  const [paused, setPaused] = useState(false);

  return (
    <figure className="friction-moment" data-paused={paused ? 'true' : 'false'}>
      <div className="friction-moment__art">
        <div className="friction-moment__stage" role="img" aria-label={label}>
          <Image
            className="friction-moment__base friction-moment__ink"
            src={base.src}
            width={base.width}
            height={base.height}
            alt=""
            sizes={stageSizes()}
            quality={85}
          />
          {vehicles.map((v) => {
            const { left, top, width, height } = v.box;
            const style = {
              left: `${left}%`,
              top: `${top}%`,
              width: `${width}%`,
              height: `${height}%`,
              '--l': `${left}%`,
              '--t': `${top}%`,
            } as CSSProperties;
            return (
              <div key={v.ink.src} className="friction-moment__vehicle" style={style}>
                <div
                  className="friction-moment__knockout"
                  style={{ maskImage: `url(${v.mask.src})`, WebkitMaskImage: `url(${v.mask.src})` }}
                />
                <Image
                  className="friction-moment__sprite friction-moment__ink"
                  src={v.ink.src}
                  width={v.ink.width}
                  height={v.ink.height}
                  alt=""
                  sizes={stageSizes(width)}
                  quality={85}
                />
              </div>
            );
          })}
        </div>
        <button
          type="button"
          className="friction-moment__toggle"
          onClick={() => setPaused((p) => !p)}
        >
          {paused ? 'Play motion' : 'Pause motion'}
        </button>
      </div>
      <figcaption className="bento-theme__caption friction-moment__caption">
        <strong className="bento-theme__lead">{caption}</strong>
        {gloss ? <span className="bento-theme__gloss">{' '}{gloss}</span> : null}
      </figcaption>
    </figure>
  );
}
