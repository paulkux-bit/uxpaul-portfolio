import Image from 'next/image';
import manifest from './walk-manifest.json';

/**
 * Section 05 — one delivery date walked through five stages of an order.
 *
 * A WALK, NOT A BENTO, AND THE DIFFERENCE IS THE WHOLE POINT. <BentoTheme> groups
 * tiles by ASPECT: `overrideRows` chunks consecutive same-slot items into shared
 * rows. A journey is an ORDER. Feeding this sequence to the bento is what produced
 * the four-screen grid this replaced, where the reader could see the screens but not
 * the sequence. So the layout here is a fixed vertical list and nothing repacks it.
 *
 * THE LABEL COLUMN IS THE SPINE. Aligned left at one edge down the whole section,
 * the five stage names read as a sequence before a reader looks at any image. That
 * is the reason for every other decision in this file: no full-width exception (it
 * would move one label out of the column), `align-items: start` on the stage (so the
 * labels line up rather than centring on medias of different heights), and one label
 * per stage even when the stage holds two screens.
 *
 * THE STAGE NAMES ARE JOURNEYLINE'S, VERBATIM. The reader met Arrive / Browse /
 * Decide / Purchase / Post purchase in section 03, on a line that ended angry.
 * Reading them again with a screen against each is what makes this a payoff rather
 * than a gallery. See $stageDoc; they move with JourneyLine or not at all.
 *
 * THE MEDIA CELL IS CAPPED AT 536px FOR A RETINA REASON, NOT A TASTE ONE — at the
 * 1088 band four of the six crops are under their floor full-width. See $retinaDoc.
 * Every crop is sized to be read at that width; nothing here pans or scrolls, and
 * $cartDoc records the one that tried to and why it was cut instead.
 *
 * Every string and every dimension lives in walk-manifest.json. Edit that, not this.
 */

/** The cap lives in CSS; `sizes` states it so the browser picks the right source.
 *  620px is where the container first exceeds the 536px cap. */
const SIZES = '(min-width: 620px) 536px, calc(100vw - 3rem)';

export default function PromiseWalk() {
  return (
    <div className="promise-walk">
      {manifest.stages.map((stage) => (
        <section className="promise-walk__stage" key={stage.label} aria-label={stage.label}>
          {/* ONE LABEL PER STAGE, SPANNING ITS MEDIA. Decide holds two screens; an
              earlier draft printed its name twice and a column of six labels with a
              repeated word reads as a mistake before it reads as a decision. The
              span is what makes the spine five entries and says the true thing:
              one stage that took two screens to answer. */}
          <p className="promise-walk__label">{stage.label}</p>

          {stage.media.map((m) => (
            <figure className="promise-walk__figure" key={m.src}>
              <figcaption className="bento-theme__caption">
                <span className="bento-theme__gloss">{m.caption}</span>
              </figcaption>

              {/* NO SCROLL TRACK, AND ITS ABSENCE IS A DECISION. The first build gave
                  the cart a focusable horizontal track floored at 1088 so a full
                  desktop page could pan inside a 536px cell. It measured as a
                  rendering fault rather than a control: the banner cut mid-word and
                  the panel the caption promised sat off-frame. Purchase now carries a
                  crop of the panel itself, which needs no track, and no other stage
                  ever wanted one. The branch and its CSS are gone rather than left
                  unused - see $cartDoc. */}
              <Image
                src={m.src}
                alt={m.alt}
                width={m.width}
                height={m.height}
                sizes={SIZES}
                className="promise-walk__img"
              />
            </figure>
          ))}
        </section>
      ))}
    </div>
  );
}
