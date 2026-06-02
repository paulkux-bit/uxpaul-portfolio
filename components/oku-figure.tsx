import type { ComponentType, SVGProps } from 'react';
import { OkuReveal } from './oku-reveal';
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
 * with theme. It renders server-side (path data stays in the HTML, off the JS
 * bundle) and is wrapped in the client <OkuReveal> for a gentle scroll fade/rise.
 * Floats on paper — no box, border, or background.
 */
export function OkuFigure({ variant, alt }: OkuFigureProps) {
  const Svg = FIGURES[variant];
  return (
    <OkuReveal className="oku-figure" ariaLabel={alt}>
      <Svg aria-hidden />
    </OkuReveal>
  );
}
