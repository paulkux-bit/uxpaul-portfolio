import { Fragment } from 'react';
import manifest from './testimony-manifest.json';

/** The literal marker sitting in the manifest's quote strings. */
const ELISION = '[…]';

/**
 * Two voices in the slot FramedPair fills in BARD, FDT-E and Nuuly. Those three
 * open with two before-screens; this study has none, because the deck's only
 * screens are ideation and solution work. The prose had been compensating, which
 * is why section 01 ran several times longer than the others. The honest
 * substitute is testimony: this study's problem evidence is what people said, not
 * what a screen looked like.
 *
 * NO GEOMETRY. Two cells, a rule above each, three text nodes per cell.
 *
 * CAPTION CONTRACT IS FRAMEDPAIR'S, WITH THE ORDER INVERTED, DELIBERATELY.
 * FramedPair puts its caption below the image (uscg-bard.mdx:50-76). Here the
 * lead sits above the quote: an image is legible at a glance and a 45-word quote
 * is not, so the takeaway has to be catchable before the reader commits. It also
 * keeps the two leads level at the top, where they read as a pair. The version
 * with the lead underneath is A1 in docs/previews/quote-pair-A.html and it fails
 * for exactly that reason - the quotes are different lengths, so the takeaways
 * land at different heights and never pair up.
 *
 * NO OUTER FIGCAPTION. FramedPair has none either. Do not add one.
 *
 * The component supplies the opening and closing curly double quotes; the
 * manifest holds the words, including the curly apostrophes inside them. Every
 * string comes from testimony-manifest.json and neither quote may be reworded -
 * see its $quoteDoc.
 */
export default function TestimonyPair() {
  return (
    <figure className="testimony-pair">
      <div className="testimony-pair__grid">
        {manifest.cells.map((cell) => (
          <div className="testimony-pair__cell" key={cell.source}>
            <p className="testimony-pair__lead">{cell.lead}</p>
            <p className="testimony-pair__quote">
              {'“'}
              {/* A span, never <i>: globals.css remaps em and i to font-weight 600
                  because Commissioner ships no italic, so an <i> here would render
                  the elision marks bold instead of muted. An editorial elision is
                  not stress emphasis either way. */}
              {cell.quote.split(ELISION).map((part, i) => (
                <Fragment key={i}>
                  {i > 0 ? <span className="testimony-pair__elision">{ELISION}</span> : null}
                  {part}
                </Fragment>
              ))}
              {'”'}
            </p>
            <span className="testimony-pair__source">{cell.source}</span>
          </div>
        ))}
      </div>
    </figure>
  );
}
