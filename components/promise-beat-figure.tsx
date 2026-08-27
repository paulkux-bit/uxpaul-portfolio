import type { ComponentType, SVGProps } from 'react';
import PromiseBlind from './promise-beats/blind';
import PromisePhantom from './promise-beats/phantom';
import PromiseSplit from './promise-beats/split';

type PromiseBeatVariant = 'blind' | 'phantom' | 'split';

const FIGURES: Record<PromiseBeatVariant, ComponentType<SVGProps<SVGSVGElement>>> = {
  blind: PromiseBlind,
  phantom: PromisePhantom,
  split: PromiseSplit,
};

interface PromiseBeatFigureProps {
  /** Which break in the order this figure depicts (no date / paid for nothing / one order as several). */
  variant: PromiseBeatVariant;
  /** Accessible description of the figure — the figure's accessible name. */
  alt: string;
}

/**
 * One Delivery Promise friction-beat figure: an inline, monochrome line drawing,
 * mirroring the FdteFigure pattern (components/fdte-figure.tsx). Drawn by Paul,
 * normalized and traced by scripts/normalize-beat-figure.py, then regenerated into
 * .tsx wrappers by scripts/regen-promise-beats-tsx.mjs — the .svg beside each .tsx
 * is the source of truth and the .tsx is never hand-edited.
 *
 * House SVG format, which the regen script's guard asserts: one merged compound
 * path, fill="currentColor" and fill-rule="evenodd" on the inner <g>, NO stroke
 * attribute in the art. Server-rendered, so the path data stays in the HTML and off
 * the JS bundle. Floats on paper — no box, border, or background.
 *
 * NO SECOND CLASS, and that is the decision rather than an omission. .fdte-figure
 * and .nuuly-beat-figure exist only to hang the 0.75px non-scaling-stroke floor on;
 * this art does not need one, so a study class here would be a selector with no
 * declarations. Measured pen width, modal, in viewBox units at the 300px column cap:
 * blind 11u / 1.20px, phantom 10u / 1.09px, split 13u / 1.42px. The reference set is
 * oku-02 11u, oku-03 12u, fdte-01 8u, nuuly-01 4u — all three sit at or above
 * oku-02, which carries no floor either. If a re-trace ever drops the pen below
 * ~8u, add `.promise-beat-figure svg path` as its own rule (not folded into the
 * fdte/nuuly selector list — that separation is deliberate) and add the class here.
 */
export function PromiseBeatFigure({ variant, alt }: PromiseBeatFigureProps) {
  const Svg = FIGURES[variant];
  return (
    <figure className="oku-figure" role="img" aria-label={alt}>
      <Svg aria-hidden />
    </figure>
  );
}
