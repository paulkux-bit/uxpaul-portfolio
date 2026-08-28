import { Fragment } from 'react';
import manifest from './testimony-manifest.json';

/** The literal marker a quote span would carry if it elided anything. */
const ELISION = '[…]';

/**
 * Two voices in the slot FramedPair fills in BARD, FDT-E and Nuuly. Those three
 * open with two before-screens; this study has none, because the deck's only
 * screens are ideation and solution work. The prose had been compensating, which
 * is why section 01 ran several times longer than the others. The honest
 * substitute is testimony: this study's problem evidence is what people said, not
 * what a screen looked like.
 *
 * NO GEOMETRY. Two cells, two text nodes each: a quote and a source.
 *
 * REBUILT 28 AUG, AND THE OLD RATIONALE DOES NOT SETTLE THE NEW CASE. This
 * component used to put a lead above each quote and defend that against A1
 * (docs/previews/quote-pair-A.html), where the lead sat underneath. That
 * rejection was of a BARE quote with a lead below it: nothing framed the quote,
 * so the takeaway was the only thing catchable at a glance and it had to come
 * first. A bounded object on a raised surface is legible before it is read -
 * which is the exact property that licensed caption-below for images in
 * FramedPair - so the box answers what the lead was answering. A1 is still worth
 * reading for the history; it is not evidence against this.
 *
 * The leads are gone entirely, not moved. Section 01's closer says what they said
 * sixty words later, in Paul's voice. See the manifest's $leadDoc before
 * restoring them for any reason.
 *
 * NO OUTER FIGCAPTION. FramedPair has none either. Do not add one.
 *
 * The component supplies the opening and closing curly double quotes; the
 * manifest holds the words. Every string comes from testimony-manifest.json and
 * neither quote may be reworded - see its $quoteDoc. The bold spans are
 * editorial, not the speakers' stress: see $emphasisDoc.
 */
export default function TestimonyPair() {
  return (
    <figure className="testimony-pair">
      <div className="testimony-pair__grid">
        {manifest.cells.map((cell) => (
          <div className="testimony-pair__cell" key={cell.source}>
            <p className="testimony-pair__quote">
              {'“'}
              {cell.quote.map((span, s) => {
                /* THE SPLIT RENDERS NOTHING TODAY, AND IS NOT DEAD CODE. Both
                   quotes are continuous runs, so no span carries a marker and
                   this produces zero elision elements. It is the enforcement of
                   the transcription rule: the next quote that needs a cut gets
                   its marker rendered as muted editorial text without anyone
                   remembering to wire it up. It moved from the whole quote
                   string to each span's text when the manifest became
                   structured; the behaviour is unchanged.

                   A span, never <i>: globals.css remaps em and i to
                   font-weight 600 because Commissioner ships no italic, so an
                   <i> here would render the elision marks bold instead of
                   muted. An editorial elision is not stress emphasis either
                   way. */
                const parts = span.text.split(ELISION).map((part, i) => (
                  <Fragment key={i}>
                    {i > 0 ? <span className="testimony-pair__elision">{ELISION}</span> : null}
                    {part}
                  </Fragment>
                ));
                /* <b>, never <strong>: this emphasis is the designer's, and <b>
                   is stylistic offset without added importance. <strong> would
                   assert the speaker stressed it, which neither did. The weight
                   comes from the base `b, strong { font-weight: 600 }` rule, so
                   this module authors none of its own. */
                return 'em' in span && span.em ? (
                  <b key={s}>{parts}</b>
                ) : (
                  <Fragment key={s}>{parts}</Fragment>
                );
              })}
              {'”'}
            </p>
            <span className="testimony-pair__source">{cell.source}</span>
          </div>
        ))}
      </div>
    </figure>
  );
}
