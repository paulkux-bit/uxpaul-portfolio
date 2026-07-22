import type { ComponentType, SVGProps } from 'react';
import FdteIntConvergence from './fdte/fdte-01-int-convergence';
import FdteTempoSustained from './fdte/fdte-02-tempo-sustained';
import FdteTempoTraining from './fdte/fdte-03-tempo-training';
import FdteTempoWar from './fdte/fdte-04-tempo-war';

type FdteVariant = 'int-convergence' | 'tempo-sustained' | 'tempo-training' | 'tempo-war';

const FIGURES: Record<FdteVariant, ComponentType<SVGProps<SVGSVGElement>>> = {
  'int-convergence': FdteIntConvergence,
  'tempo-sustained': FdteTempoSustained,
  'tempo-training': FdteTempoTraining,
  'tempo-war': FdteTempoWar,
};

interface FdteFigureProps {
  /** Which FDT-E concept this figure depicts. */
  variant: FdteVariant;
  /** Accessible description of the figure — the figure's accessible name. */
  alt: string;
}

/**
 * One FDT-E concept figure: an inline, monochrome line diagram, mirroring the
 * OkuFigure pattern (components/oku-figure.tsx). currentColor fill/stroke so it
 * renders in the figure's text-ink color and flips with theme; server-rendered
 * (path data in the HTML, off the JS bundle); reuses the generic `.oku-figure`
 * ink + margin treatment. Floats on paper — no box, border, or background.
 *
 * ALL FOUR VARIANTS ARE CURRENTLY STUBS (see components/fdte/*) — placeholder
 * sketches so the page builds and renders. The real line art is a later pass.
 */
export function FdteFigure({ variant, alt }: FdteFigureProps) {
  const Svg = FIGURES[variant];
  return (
    <figure className="oku-figure" role="img" aria-label={alt}>
      <Svg aria-hidden />
    </figure>
  );
}
