import type { QuickHit as QuickHitData } from '@/app/data/quick-hits';

/**
 * One entry on the "Also shipped" shelf — a calm bordered row (Wise "Choose a
 * debit card" register). Server Component, NON-INTERACTIVE in v1.
 *
 * Calm faint brand FILL + a 1.5px brand-color BORDER carry the identity (no
 * saturated fill competing with Selected Work); typography does the work. Three
 * columns on desktop (wordmark · centered title · industry), stacking on mobile
 * — the grid lives in `.quick-hit` (globals.css). The title is the moment:
 * `text-qh-title` compresses Bricolage's wdth axis to 90% against the 100%
 * labels — a designed width contrast, not just weight.
 *
 * Color comes from `data-brand` (aliases --base + --fill). Title/labels use the
 * standard text tokens (AAA on the faint fill, both modes). The border is the
 * primary identity element, so it carries through forced-colors.
 */
export function QuickHit({ hit }: { hit: QuickHitData }) {
  return (
    <article
      data-brand={hit.brand}
      className="quick-hit rounded-[12px] border-[1.5px] border-[var(--base)] bg-[var(--fill)] px-6 py-5 md:min-h-[6rem] md:px-8"
    >
      <p className="qh-brand text-eyebrow text-secondary">{hit.wordmark}</p>
      {/* Parallel to Selected Work card titles → <h2> element. The wdth move. */}
      <h2 className="qh-title text-qh-title text-primary md:text-center">{hit.title}</h2>
      <p className="qh-industry text-caption text-right text-secondary">{hit.industry}</p>
    </article>
  );
}
