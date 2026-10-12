import type { TemplateBPiece } from '@/app/data/template-b';

/**
 * One row on the "Client work" shelf: a calm bordered row (Wise "Choose a
 * debit card" register). Server Component. The title is a link that opens the
 * piece in the client work dialog (components/client-work/client-work-dialog.tsx),
 * by the URL hash `#slug`. Without JavaScript the link is a harmless hash change.
 *
 * THE LINK IS THE ONLY INTERACTIVE CHANGE, ON PURPOSE (ruling Q3, 11 Oct 2026).
 * The shelf's look is redesigned in a later pass, so the row keeps its resting
 * treatment and adds the site's standard link states and nothing else: `.quiet-link`
 * gives no underline at rest and the global a:hover underline on hover, and focus
 * is the global :focus-visible halo. There is no new border, card or hover rule. The
 * link is stretched over the row the way the case card stretches its title
 * (components/case-study-card.tsx), so the whole row is the target and the
 * accessible name is the project name alone.
 *
 * Calm faint brand FILL + a 1.5px brand-color BORDER carry the identity (no
 * saturated fill competing with Selected Work); typography does the work. Three
 * columns on desktop (wordmark, title, industry), stacking on mobile. The title
 * is left-set like every other line on the site (closing review A7b, 1 Oct 2026),
 * and the grid lives in `.quick-hit` (globals.css). The title is the moment:
 * `text-qh-title` carries the per-brand weight (`--qh-wght`, 500-650) against
 * the labels' 600. That contrast used to be width as well; Commissioner has no
 * wdth axis, so weight and colour carry it alone (v3 §6).
 *
 * Color comes from `data-brand` (aliases --base + --fill). Title/labels use the
 * standard text tokens (AAA on the faint fill, both modes). The border is the
 * primary identity element, so it carries through forced-colors.
 */
export function QuickHit({ piece }: { piece: TemplateBPiece }) {
  return (
    <article
      data-brand={piece.brand}
      className="quick-hit relative border-[var(--base)] bg-[var(--fill)] px-m py-m md:min-h-[6rem] md:px-l"
    >
      <p className="qh-brand text-eyebrow text-secondary">{piece.wordmark}</p>
      {/* Parallel to Selected Work card titles → <h2> element. The weight move. */}
      <h2 className="qh-title text-qh-title text-primary">
        <a
          href={`#${piece.slug}`}
          data-client-work={piece.slug}
          className="quiet-link after:absolute after:inset-0 after:content-['']"
        >
          {piece.title}
        </a>
      </h2>
      <p className="qh-industry text-caption text-right text-secondary">{piece.industry}</p>
    </article>
  );
}
