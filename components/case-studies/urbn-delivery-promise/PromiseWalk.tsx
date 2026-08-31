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
 * OPTION C, 31 Aug: THERE IS NO LABEL COLUMN. Each stage label sits above its own
 * figures and the hairline rule carries the boundary. THIS FILE USED TO SAY THE
 * OPPOSITE - "THE LABEL COLUMN IS THE SPINE", with a no-full-width-exception rule
 * derived from it - and that conclusion is REVERSED here rather than deleted, because
 * a later pass reading only these rules would restore the column.
 *
 * THE EVIDENCE THAT REVERSED IT, measured in a render before the decision. The column
 * was 200px holding one word, with every frame capped at 660 inside a 1088 band. At
 * 660 a 1440px page renders at 46%, so 14px of product UI lands at 6.4px - texture by
 * definition. At 1088 the same page renders at 76% and 10.6px, and the product-page
 * frame resolves "Free 2-day Shipping to 16507 / Arrives by Sept 13, 2019" above Add
 * To Cart. THE LINE THE STUDY IS NAMED FOR WAS INVISIBLE IN THE FRAME THAT SHOWS IT
 * IN CONTEXT.
 *
 * WHAT C COST, AND PAUL ACCEPTED IT WITH THE RENDER IN FRONT OF HIM: five labels at
 * one left edge are parsed in a single fixation and five labels stacked down the page
 * are not. The spine is weaker as a scanning object; the frames are legible. That was
 * the trade, and it is not a defect to be fixed by putting the column back.
 *
 * THE WIDTHS NOW COME FROM lib/bento-slots.json - 1088 (container max / `feature`),
 * 660 (`wide`), 352 (`tall`). Two of the three used to be numbers picked by hand. See
 * $retinaDoc, which carries the same account so the file and the manifest agree.
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
 * A DETAIL FRAME EXISTS ONLY WHERE THE PAGE FRAME CANNOT CARRY THE CLAIM. See
 * $stageDoc. That is the rule C produced: raising the page frames to 1088 made
 * Purchase's detail frame redundant and it was deleted, where Browse's and Decide's
 * are still meaningfully clearer than their pages. Seven frames, five stages, and the
 * count is inferable rather than arbitrary.
 *
 * Every string and every dimension lives in walk-manifest.json. Edit that, not this.
 */

/** The caps live in CSS; `sizes` states them so the browser picks the right source.
 *  ALL THREE CROSSINGS ARE MEASURED, NOT DERIVED. The rendered figure width was read
 *  at 1px viewport steps and these are where it stops growing for each cap. Condition
 *  is stated because a crossing without one is the defect this repo keeps hitting:
 *  .cs-section at its default page padding, light mode, headless so no scrollbar.
 *  Stepped 340 to 1220: the band cap is reached at 1152, the wide cap at 708 and the
 *  phone cap at 400. The band crossing is above 1024 because .cs-section breaks out
 *  to min(100vw - 4rem, 1088) there, where the other two are still inside the 660
 *  prose measure at 100vw - 3rem. */
const SIZES_BAND = '(min-width: 1152px) 1088px, calc(100vw - 3rem)';
const SIZES = '(min-width: 708px) 660px, calc(100vw - 3rem)';
const SIZES_PHONE = '(min-width: 400px) 352px, calc(100vw - 3rem)';

/** Variant → the CSS modifier and the `sizes` that matches its cap. One place, so a
 *  width and the sizes declaring it cannot drift apart. */
const VARIANT = {
  band:  { cls: 'promise-walk__figure promise-walk__figure--band',  sizes: SIZES_BAND },
  phone: { cls: 'promise-walk__figure promise-walk__figure--phone', sizes: SIZES_PHONE },
  wide:  { cls: 'promise-walk__figure',                              sizes: SIZES },
} as const;
const pick = (v?: string) => VARIANT[(v === 'band' || v === 'phone' ? v : 'wide')];

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
            <figure className={pick('variant' in m ? m.variant : undefined).cls} key={m.src}>
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
                sizes={pick('variant' in m ? m.variant : undefined).sizes}
                className="promise-walk__img"
              />
            </figure>
          ))}
        </section>
      ))}
    </div>
  );
}
