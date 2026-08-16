import type { ComponentType, ReactNode, SVGProps } from 'react';
import NuulyEconomics from './nuuly/nuuly-01-economics';
import NuulyRange from './nuuly/nuuly-02-range';

type NuulyVariant = 'economics' | 'range';

const FIGURES: Record<NuulyVariant, ComponentType<SVGProps<SVGSVGElement>>> = {
  economics: NuulyEconomics,
  range: NuulyRange,
};

interface NuulyFigureProps {
  /** Which claim this figure draws (the subscription trade / the range at launch). */
  variant: NuulyVariant;
  /** Accessible description of the drawing — the SVG's accessible name. */
  alt: string;
  /** Visible caption below the drawing. Carries the claim the drawing illustrates. */
  caption?: ReactNode;
}

/**
 * One Nuuly problem-section figure: an inline, monochrome line drawing on the
 * FdteFigure pattern (components/fdte-figure.tsx). The .svg beside each .tsx is the
 * source of truth; scripts/regen-nuuly-tsx.mjs regenerates the wrapper. Server-rendered
 * (path data stays in the HTML, off the JS bundle); reuses the generic `.oku-figure`
 * ink + margin treatment so it flips with theme. Floats on paper — no box or border.
 *
 * DELIBERATELY NOT `.fdte-figure`: that class adds a 0.75px non-scaling stroke to every
 * path, and globals.css marks it an FDT-E-scoped one-off for single hand-drawn FILLED
 * paths whose hairlines collapse. These drawings are authored as strokes with their own
 * weight, like Bard's Oku figures, so the exception does not apply. Adding it would
 * double the line weight.
 *
 * Unlike FdteFigure, role="img" sits on the <svg>, not the <figure>. role="img" on the
 * figure would prune the subtree and hide the <figcaption> from assistive tech.
 */
export function NuulyFigure({ variant, alt, caption }: NuulyFigureProps) {
  const Svg = FIGURES[variant];
  return (
    <figure className="oku-figure nuuly-figure">
      <Svg role="img" aria-label={alt} />
      {caption ? <figcaption className="nuuly-figure__caption">{caption}</figcaption> : null}
    </figure>
  );
}
