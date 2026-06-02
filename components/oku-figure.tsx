type OkuVariant = 'forms-diverge' | 'insight-trapped' | 'manual-reconcile';

interface OkuFigureProps {
  /** Which transformation this figure depicts; selects the animation later. */
  variant: OkuVariant;
  /** Accessible description of the transformation — the figure's accessible name. */
  alt: string;
  /** Existing placeholder convention — true in this build (renders the quiet static box). */
  placeholder?: boolean;
  /** Aspect ratio. LOCKED to OKU_RATIO for cross-column alignment — only override to
   *  change all three figures together; never per-figure (that breaks the triptych baseline). */
  ratio?: string;
}

/** Locked aspect ratio shared by every oku figure so the three friction beats align and the
 *  eventual animation drops into the exact frame with zero layout shift. 3/2 (not 4/3) keeps
 *  the figure short enough on mobile that it doesn't create dead scroll. */
const OKU_RATIO = '3 / 2';

/**
 * Oku figure — a small monochrome line diagram of one friction in THREE FRICTIONS (the
 * solution section will add resolution counterparts so the figures rhyme by number).
 * PLACEHOLDER in this build: renders the quiet `.figure-placeholder` box at the locked
 * aspect ratio, wrapped in a labeled <figure> so the empty box still has an accessible name.
 *
 * EVENTUAL ANIMATION CONTRACT (documented only — do NOT build yet):
 *   - Inline SVG. `stroke: var(--color-text-primary)` / `currentColor`. NO fills, monochrome
 *     only. No persimmon / no accent (honors the chromatic-restraint reservation).
 *   - Scroll-triggered, play-once, via IntersectionObserver — reuse the observer pattern in
 *     components/popup.tsx (rootMargin '0px 0px -15% 0px', threshold 0, disconnect after the
 *     first intersection).
 *   - `prefers-reduced-motion: reduce` → render the FINAL static frame (static-first); never
 *     strip to nothing.
 *   - At that point this becomes a client component ('use client'); the MDX section stays
 *     server. Placeholder box and animation share OKU_RATIO, so the swap is a clean drop-in.
 */
export function OkuFigure({ variant, alt, ratio = OKU_RATIO }: OkuFigureProps) {
  // `placeholder` (part of the figure-family convention) is accepted but not yet consumed —
  // today every render is the static box; when the animation lands, a false `placeholder`
  // selects the animated SVG branch per the contract above.
  return (
    <figure className="oku-figure" data-variant={variant} role="img" aria-label={alt}>
      <div className="figure-placeholder" style={{ aspectRatio: ratio }} />
    </figure>
  );
}
