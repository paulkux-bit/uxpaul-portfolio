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
 * `.nuuly-beat-figure` NOW EXISTS AND CARRIES A RULE. An earlier pass applied it as a
 * "just in case" hook mirroring `.fdte-figure`, decided the fdte treatment did not
 * apply, and left the hook behind with no rule anywhere; check 9 caught it. The note
 * left in its place said to add the class AND its rule in the same commit if the traced
 * art ever needed a Nuuly-only adjustment. That case arrived. The final art is hairline,
 * and at the 300px column its linework goes sub-pixel and antialiases to grey, so the
 * class carries a stroke floor and nothing else. `.oku-figure` still supplies everything
 * else: width, per-mode ink, and the `.friction-beat .oku-figure { margin: 0 }` layout
 * rule. The rule and its reasoning live in globals.css beside FDT-E's.
 *
 * Still NOT `.fdte-figure`, even though the two rules are now declaration-for-declaration
 * identical: globals.css scopes that one to FDT-E by name. What these figures share with
 * FDT-E's is a hairline source line weight, not a licence to reuse its exception.
 *
 * FINAL ART, traced 18 Aug from Paul's generated raster. House format: one merged
 * compound path, fill="currentColor", fill-rule="evenodd", NO stroke attribute IN THE
 * ART. The stroke floor is CSS-only on purpose: the regen guard reads the source, so do
 * not "reconcile" the two by adding a stroke attribute to the .svg.
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
    <figure className="oku-figure nuuly-beat-figure" role="img" aria-label={alt}>
      <Svg aria-hidden />
    </figure>
  );
}
