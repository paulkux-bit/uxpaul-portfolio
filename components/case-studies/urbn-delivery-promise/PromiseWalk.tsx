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
 * the five stage names read as a sequence before a reader looks at any image. That is
 * the reason for every other decision in this file: `align-items: start` on the stage
 * so the labels line up rather than centring on medias of different heights, one
 * label per stage even when the stage holds two screens, and no full-width exception.
 *
 * THE NO-EXCEPTION ARGUMENT IS RESTATED FOR THE NEW GEOMETRY rather than inherited.
 * It used to reason about a `minmax(0, 1fr)` label column; the column is a fixed
 * 200px now and the conclusion is unchanged, and slightly stronger for it. A stage
 * rendered full width has no left column to sit in, so its label falls above its own
 * media while the other four stay beside theirs. One break in five, and the line a
 * skimmer was reading stops being a line.
 *
 * THE LABEL IS BODY TYPE, NOT AN EYEBROW. It shipped as 14px tracked uppercase, which
 * is chart chrome; nothing in the body of any of the four studies is set that way. It
 * is 18 / 600 / --text-primary now, which is .bento-theme__lead's setting exactly, so
 * label and caption share a rung and separate on weight and colour.
 *
 * THE STAGE NAMES ARE JOURNEYLINE'S, VERBATIM. The reader met Arrive / Browse /
 * Decide / Purchase / Post purchase in section 03, on a line that ended angry.
 * Reading them again with a screen against each is what makes this a payoff rather
 * than a gallery. See $stageDoc; they move with JourneyLine or not at all.
 *
 * THE MEDIA CELL IS 660px, AND 380px FOR THE TWO PHONE STAGES. Both caps are retina
 * decisions and both are stated in $retinaDoc rather than here, so the file and the
 * manifest cannot drift. The claim this replaces — that 536 was forced because four
 * of six crops sat under their floor at full width — was true of the asset set that
 * shipped on 30 Aug and is not true of this one. Nothing here pans or scrolls;
 * $cartDoc records the one frame that tried to and why it was re-cut instead.
 *
 * EIGHT FRAMES, FIVE STAGES: every desktop-page stage is a context frame then a
 * detail frame, and the two phone stages are single. See $stageDoc — that is a rule,
 * not a per-stage judgement, and it is what the previous set was missing.
 *
 * Every string and every dimension lives in walk-manifest.json. Edit that, not this.
 */

/** The caps live in CSS; `sizes` states them so the browser picks the right source.
 *  BOTH CROSSINGS ARE MEASURED, NOT DERIVED. The figure's rendered width was read at
 *  1px steps and these are where it stops growing for each cap: 708px of viewport for
 *  the 660 cell, 428px for the 380 phone cell. Condition: the .cs-section container at
 *  its default page padding, light mode, no scrollbar. Arithmetic would have given the
 *  same pair here, but an over-declared `sizes` is already an open item on
 *  hero-block.tsx across all four studies and this does not add a fifth. */
const SIZES = '(min-width: 708px) 660px, calc(100vw - 3rem)';
const SIZES_PHONE = '(min-width: 428px) 380px, calc(100vw - 3rem)';

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
            <figure
              className={
                'variant' in m && m.variant === 'phone'
                  ? 'promise-walk__figure promise-walk__figure--phone'
                  : 'promise-walk__figure'
              }
              key={m.src}
            >
              {/* lead THEN gloss, with the same {' '} separator TierChart, NodeChart,
                  JourneyLine and RoadmapTable all use. Until 31 Aug this rendered a
                  gloss alone, the only captioned component in the study that did, and
                  with no bold slot to put a feature name in the captions had drifted
                  into full sentences and cross-references. See $captionDoc. */}
              <figcaption className="bento-theme__caption">
                <span className="bento-theme__lead">{m.caption.lead}</span>{' '}
                <span className="bento-theme__gloss">{m.caption.gloss}</span>
              </figcaption>

              <Image
                src={m.src}
                alt={m.alt}
                width={m.width}
                height={m.height}
                sizes={'variant' in m && m.variant === 'phone' ? SIZES_PHONE : SIZES}
                className="promise-walk__img"
              />
            </figure>
          ))}
        </section>
      ))}
    </div>
  );
}
