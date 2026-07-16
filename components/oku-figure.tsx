import type { ComponentType, SVGProps } from 'react';
import OkuForks from './oku/oku-01-forks';
import OkuOnceAYear from './oku/oku-02-once-a-year';
import OkuReconciliation from './oku/oku-03-reconciliation';

type OkuVariant = 'forms-diverge' | 'insight-trapped' | 'manual-reconcile';

const FIGURES: Record<OkuVariant, ComponentType<SVGProps<SVGSVGElement>>> = {
  'forms-diverge': OkuForks,
  'insight-trapped': OkuOnceAYear,
  'manual-reconcile': OkuReconciliation,
};

interface OkuFigureProps {
  /** Which friction this figure depicts (forms diverge / insight trapped / manual reconcile). */
  variant: OkuVariant;
  /** Accessible description of the figure — the figure's accessible name. */
  alt: string;
}

/**
 * One friction's figure: an inline, monochrome line diagram. The SVG is authored
 * with fill="currentColor", so it renders in the figure's text-ink color and flips
 * with theme. A static server component: the path data stays in the HTML and off
 * the JS bundle, with no client wrapper and no entrance animation.
 * Floats on paper, no box, border, or background.
 */
export function OkuFigure({ variant, alt }: OkuFigureProps) {
  const Svg = FIGURES[variant];
  return (
    <figure className="oku-figure" role="img" aria-label={alt}>
      <Svg aria-hidden />
    </figure>
  );
}
