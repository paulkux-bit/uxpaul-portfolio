import type { ComponentType, SVGProps } from 'react';
import DagrTyped from './dagr-beats/typed';
import DagrFixed from './dagr-beats/fixed';
import DagrStale from './dagr-beats/stale';

type DagrBeatVariant = 'typed' | 'fixed' | 'stale';

const FIGURES: Record<DagrBeatVariant, ComponentType<SVGProps<SVGSVGElement>>> = {
  typed: DagrTyped,
  fixed: DagrFixed,
  stale: DagrStale,
};

interface DagrBeatFigureProps {
  /** Which failure of the threat picture this figure depicts (typed from memory /
   *  only what stands still / seventy-two hours old). */
  variant: DagrBeatVariant;
  /** Accessible description of the figure, and the figure's accessible name. */
  alt: string;
}

/**
 * One Dagr friction-beat figure: an inline, monochrome line drawing, mirroring
 * PromiseBeatFigure (components/promise-beat-figure.tsx). Drawn by Paul, normalized
 * and traced by scripts/normalize-beat-figure.py, then regenerated into .tsx wrappers
 * by scripts/regen-dagr-beats-tsx.mjs. The .svg beside each .tsx is the source of
 * truth and the .tsx is never hand-edited.
 *
 * House SVG format, which the regen script's guard asserts: one merged compound path,
 * fill="currentColor" and fill-rule="evenodd" on the inner <g>, NO stroke attribute in
 * the art. Verified on all three before wiring: one <svg>, one <g>, one <path>, no
 * stroke attribute of any kind, no width or height on the root. Server-rendered, so
 * the path data stays in the HTML and off the JS bundle. Floats on paper, with no box,
 * border or background.
 *
 * NO SECOND CLASS, and that is the decision rather than an omission. .fdte-figure and
 * .nuuly-beat-figure exist only to hang the 0.75px non-scaling-stroke floor on, and the
 * two sets that needed one measured 8u (fdte-01, 0.87px) and 4u (nuuly-01, 0.44px).
 * Measured pen width, modal, in viewBox units at the 300px column cap: typed 10u /
 * 1.09px, fixed 12u / 1.31px, stale 12u / 1.31px. All three sit at or above Delivery
 * Promise's phantom (10u) and BARD's oku-02 (11u), neither of which carries a floor, so
 * a class here would be a selector with no declarations. If a re-trace ever drops the
 * pen below about 8u, the fix is a `.dagr-beat-figure svg path` rule of its own, NOT
 * adding this study to the fdte/nuuly selector list. That separation is deliberate:
 * globals.css keeps those two scoped independently so retuning one study's art never
 * silently retunes another's.
 *
 * Renders at a 300px cap in the beat's right column at >=1024, and at the same 300px
 * cap when the beats stack below it. .oku-figure supplies the width, the per-mode ink
 * and the in-column margin; nothing was added to globals.css for this set.
 */
export function DagrBeatFigure({ variant, alt }: DagrBeatFigureProps) {
  const Svg = FIGURES[variant];
  return (
    <figure className="oku-figure" role="img" aria-label={alt}>
      <Svg aria-hidden />
    </figure>
  );
}
