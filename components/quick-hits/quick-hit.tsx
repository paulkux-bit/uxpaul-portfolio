import type { TemplateBPiece } from '@/app/data/template-b';

/**
 * One row on the "Earlier work" shelf (direction A, Signature list, ruled
 * 11 Oct 2026; docs/shelf-review-cc.md). Server Component. The row borrows the
 * hero signature's grammar: the project name, then its client in a softer
 * colour, in one link, with the industry at the right on the title's baseline
 * from 768 and under the client below it. A ruled band, no brand colour.
 *
 * The link opens the piece in the client work dialog
 * (components/client-work/client-work-dialog.tsx) by the URL hash `#slug`, and
 * is stretched over the row (`.shelf__link::after`), so the whole row is the
 * target. Without JavaScript it is a harmless hash change. Hover is the site's
 * standard (`.quiet-link` plus the global a:hover). On touch the name carries
 * the resting underline, focus draws one halo round the row, and the row sinks
 * 1px when pressed (globals.css, EARLIER WORK shelf).
 *
 * The link's name is `piece.name`, the full name line, as the dialog title's
 * is. A punctuation mark in an sr-only span would become its own box in name
 * computation and read "Politics , pitched" (the dialog's build review, path
 * item 4), so the BBC's comma rides in the label instead.
 */
export function QuickHit({ piece }: { piece: TemplateBPiece }) {
  return (
    <li className="shelf__row">
      {/* Parallel to the Selected Work card titles, so an <h2>. */}
      <h2 className="shelf__title text-primary">
        <a
          href={`#${piece.slug}`}
          data-client-work={piece.slug}
          aria-label={piece.name}
          className="shelf__link quiet-link"
        >
          <span className="shelf__name">{piece.title}</span>{' '}
          <span className="shelf__by text-secondary">{piece.byline}</span>
        </a>
      </h2>
      <p className="shelf__industry text-caption text-muted">
        <span className="sr-only">Industry: </span>
        {piece.industry}
      </p>
    </li>
  );
}
