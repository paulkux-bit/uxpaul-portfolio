import Image from 'next/image';
import { BentoBand } from '@/components/bento';
import manifest from './walk-manifest.json';

/**
 * Section 05 — one delivery date walked through five stages of an order.
 *
 * THE THREE PAGE FRAMES ARE <BentoBand>s. THE OTHER FOUR ARE NOT, AND THAT SPLIT IS
 * MEASURED RATHER THAN PREFERRED. This paragraph used to say <BentoTheme> "groups
 * tiles by ASPECT" and that a journey therefore could not use the engine. THAT WAS
 * FALSE: `overrideRows` preserves document order and chunks by slot identity and
 * column capacity, not by aspect.
 *
 * WHAT IS TRUE, RENDERED ON A THROWAWAY ROUTE MOUNTING THIS EXACT SEVEN-ELEMENT
 * SEQUENCE, is that the engine cannot carry the four narrow frames for three separate
 * reasons. BentoTheme extracts breakouts BEFORE chunking (bento.tsx splits `kids` into
 * `itemEls` and `breakouts`, then calls overrideRows on `itemEls` alone), so the bands
 * between these items cannot separate them: browse--facet and options--wide are both
 * `wide` and PAIRED into one row at 536 each. The pairing then REORDERED THE JOURNEY,
 * because a breakout emits after the row containing its anchor, so cart--page landed
 * adjacent to pdp--page and the Decide detail rendered before the Decide page. And a
 * solo `standard` or `tall` row is `data-ratio=portrait`, which is `repeat(2, 1fr)`
 * below lg, so ad--post and sms--standard rendered at 187px of a 390 viewport with an
 * empty column beside them.
 *
 * SO: cols DETERMINES RENDERED WIDTH in bento-slots.json - feature cols 1 is 1088,
 * standard and wide cols 2 are 536 and 660, tall and compact cols 3 are 352. A new
 * `cols: 1` slot cannot deliver an arbitrary narrow width; it is full-band by
 * definition. That is the thing to know before proposing one.
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
 * EVERY WIDTH COMES FROM lib/bento-slots.json, AND THE VALUES ARE NOT REPEATED HERE.
 * They are the .promise-walk__figure--* modifiers in globals.css, one rule each, and
 * that is the only place to read them. THIS PARAGRAPH USED TO LIST THEM AND WENT STALE
 * TWICE, both times in the commit that moved them, which is why it now points instead.
 * The reasoning does stay: a frame earns its slot by rendering nearest its own life
 * size, so the widths are a consequence of measurement rather than a layout preference.
 * $stageDoc has the rule, $retinaDoc has the measured source region behind each frame.
 *
 * THE LABEL IS BODY TYPE, NOT AN EYEBROW. It shipped as 14px tracked uppercase, which
 * is chart chrome; nothing in the body of any of the four studies is set that way.
 * ITS SETTINGS AND THE CHANNEL THAT SEPARATES IT FROM THE CAPTION LEAD ARE RECORDED ON
 * .promise-walk__label IN globals.css, NOT HERE. This paragraph carried those numbers
 * and was wrong about them for two commits, which is the same failure as the widths
 * above and the reason both now reference rather than restate. Read the rule before
 * changing either the label or .bento-theme__lead: they are closer than they look.
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
 *  Stepped 340 to 1260: standard 584, tall 400 - both inside the 660 prose measure at
 *  100vw - 3rem, which is why each comes out at its cap + 48. THE BAND CROSSING IS NOT
 *  HERE ANY MORE: the three page frames are <BentoBand>s and take the engine's own
 *  BREAKOUT_SIZES. */
const SIZES_STANDARD = '(min-width: 584px) 536px, calc(100vw - 3rem)';
const SIZES_TALL = '(min-width: 400px) 352px, calc(100vw - 3rem)';

/** Slot → the CSS modifier and the `sizes` that matches its cap. One place, so a width
 *  and the sizes declaring it cannot drift apart. THE NAMES ARE bento-slots.json'S, not
 *  mine: `standard` is 536, `tall` is 352. They were band / wide / phone until 31 Aug,
 *  and `phone` was the one that did damage - it named a device inside a system chosen
 *  to be width-driven, so the social ad went in it for being portrait and rendered at
 *  72% of life size. `band` left on 1 Sep when its frames became real <BentoBand>s. */
const VARIANT = {
  standard: { cls: 'promise-walk__figure promise-walk__figure--standard', sizes: SIZES_STANDARD },
  tall: { cls: 'promise-walk__figure promise-walk__figure--tall', sizes: SIZES_TALL },
} as const;

/** NO DEFAULT, DELIBERATELY. This used to fall back to the 660 cell for any variant it
 *  did not recognise, which is how three frames ended up at a width nobody had chosen.
 *  Every frame states its slot in the manifest and an unknown one is a build failure,
 *  because this renders at build time. A silent fallback is the thing being fixed. */
const pick = (v: unknown) => {
  if (typeof v !== 'string' || !(v in VARIANT)) {
    throw new Error(`PromiseWalk: media needs a slot from ${Object.keys(VARIANT).join(' / ')}, got ${JSON.stringify(v)}`);
  }
  return VARIANT[v as keyof typeof VARIANT];
};

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

          {stage.media.map((m) =>
            m.variant === 'band' ? (
              /* ASPECT IS COMPUTED FROM THE FILE, NEVER AUTHORED. An `aspect={2.25}`
                 prop is a number describing a file, stored apart from it and free to
                 drift the moment the file is re-cut - the defect class this study has
                 been logging all week. width/height already have to move with the file
                 because next/image needs them, so deriving from them makes the
                 disagreement impossible rather than something to remember.

                 NO scrollFloor, AND ITS ABSENCE IS A DECISION. Passing one wraps the
                 media in .bento-band__track, which below 768 floors it at
                 --band-scroll-floor and turns the frame into a horizontal scroller.
                 Paul ruled that pattern does not work; it is being counted for a later
                 global pass, not spread to three more frames. It would also add three
                 tab stops, since the track carries tabIndex={0} and role="group".
                 Verified at 390: no .bento-band__track exists for any of these. */
              <BentoBand
                key={m.src}
                src={m.src}
                alt={m.alt}
                aspect={m.width / m.height}
                caption={m.caption.lead}
                gloss={m.caption.gloss}
              />
            ) : (
            <figure className={pick(m.variant).cls} key={m.src}>
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
                sizes={pick(m.variant).sizes}
                className="promise-walk__img"
              />
            </figure>
            ),
          )}
        </section>
      ))}
    </div>
  );
}
