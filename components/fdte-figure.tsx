import type { ComponentType, SVGProps } from 'react';
import FdteTempo from './fdte/fdte-01-tempo';
import FdteParalysis from './fdte/fdte-02-paralysis';
import FdteBlackbox from './fdte/fdte-03-blackbox';

type FdteVariant = 'tempo' | 'paralysis' | 'black-box';

const FIGURES: Record<FdteVariant, ComponentType<SVGProps<SVGSVGElement>>> = {
  tempo: FdteTempo,
  paralysis: FdteParalysis,
  'black-box': FdteBlackbox,
};

interface FdteFigureProps {
  /** Which FDT-E finding this figure depicts (tempo dial / hesitation / black box). */
  variant: FdteVariant;
  /** Accessible description of the figure — the figure's accessible name. */
  alt: string;
}

/**
 * One FDT-E finding's figure: an inline, monochrome line drawing, mirroring the
 * OkuFigure pattern (components/oku-figure.tsx). The SVGs are authored with
 * fill="currentColor" (single path, drawn by Paul), regenerated into .tsx wrappers
 * by scripts/regen-fdte-tsx.mjs — the .svg beside each .tsx is the source of truth.
 * Server-rendered (path data stays in the HTML, off the JS bundle); reuses the
 * generic `.oku-figure` ink + margin treatment so it flips with theme. Floats on
 * paper — no box, border, or background.
 */
export function FdteFigure({ variant, alt }: FdteFigureProps) {
  const Svg = FIGURES[variant];
  return (
    <figure className="oku-figure fdte-figure" role="img" aria-label={alt}>
      <Svg aria-hidden />
    </figure>
  );
}
