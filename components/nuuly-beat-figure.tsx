import type { ComponentType, SVGProps } from 'react';
import BeatStation from './nuuly-beats/beat-01-station';
import BeatHandoff from './nuuly-beats/beat-02-handoff';
import BeatHands from './nuuly-beats/beat-03-hands';

type NuulyBeat = 'station' | 'handoff' | 'hands';

const FIGURES: Record<NuulyBeat, ComponentType<SVGProps<SVGSVGElement>>> = {
  station: BeatStation,
  handoff: BeatHandoff,
  hands: BeatHands,
};

/**
 * One Nuuly friction-beat figure. Same contract as FdteFigure: inline single-colour
 * art, `fill="currentColor"`, no box, flips with theme, .svg is the source of truth
 * (scripts/regen-nuuly-beats-tsx.mjs regenerates the .tsx — never hand-edit it).
 *
 * NO Nuuly-specific class. An earlier pass applied `.nuuly-beat-figure` as a "just in
 * case" hook mirroring `.fdte-figure`, then decided the fdte treatment did not apply —
 * and left the hook behind with no rule anywhere. check 9 caught it. `.oku-figure`
 * supplies everything these need: width, per-mode ink, and the `.friction-beat
 * .oku-figure { margin: 0 }` layout rule. If Paul's traced art later needs a Nuuly-only
 * adjustment, add the class AND its rule in the same commit.
 *
 * Specifically NOT `.fdte-figure`: that adds a 0.75px non-scaling stroke for FDT-E's
 * hairline-heavy filled paths, and globals.css marks it an FDT-E-scoped one-off.
 *
 * FINAL ART, traced 18 Aug from Paul's generated raster. House format: one merged
 * compound path, fill="currentColor", fill-rule="evenodd", NO stroke attribute.
 * Regenerate with `npm run regen:nuuly-beats` after editing a .svg.
 *
 * All three show the SAME rolling workstation. Keeping one recurring object across
 * the set is what differentiates this from FDT-E's beats, whose figures share a
 * person type but no shared prop. The three deliberately sit at three camera
 * distances (wide cart / mid figure and rail / extreme close on hands) so they read
 * as distinct thumbnails at 300px rather than three views of the same furniture.
 *
 * Renders at a 300px cap in the beat's right column — see .friction-beat's
 * grid-template-columns in globals.css. Verified legible at true size, light and
 * dark, before commit. Detail below ~40px of the 169px height disappears; keep any
 * replacement to one figure and one oversized object.
 */
export function NuulyBeatFigure({ variant, alt }: { variant: NuulyBeat; alt: string }) {
  const Svg = FIGURES[variant];
  return (
    <figure className="oku-figure" role="img" aria-label={alt}>
      <Svg aria-hidden />
    </figure>
  );
}
