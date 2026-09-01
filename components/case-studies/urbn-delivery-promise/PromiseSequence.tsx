import { BentoTheme, BentoItem } from '@/components/bento';
import type { Slot } from '@/lib/bento-slots';
import manifest from './sequence-manifest.json';

/**
 * One delivery date surviving from ad to arrival. Three stages: the ad, the product
 * page, the cart. The fourth — the text message — is deliberately not here; its screen
 * is 375x667 and fails every retina floor, and rebuilding it as markup would present a
 * portfolio graphic as product UI. It is a line of prose in the MDX instead.
 *
 * Layout is <BentoTheme>, not new geometry. All three items are slotted, so the theme
 * runs in override mode and chunks them [wide] then [standard, standard] — the ad full
 * width, the two shopping screens paired beneath it. Reusing the bento also means the
 * slot aspects, the `sizes` attributes and the retina floors come from
 * lib/bento-slots.json rather than being restated here.
 *
 * PENDING STAGES render as labelled placeholder boxes at the correct aspect, which is
 * BentoItem's own behaviour when src is omitted. That is why a missing crop shows a
 * sized box rather than a broken image. Flip `pending` in the manifest once the crop
 * lands; nothing in this file changes.
 */
export default function PromiseSequence() {
  return (
    <BentoTheme>
      {manifest.stages.map((s) =>
        s.pending ? (
          <BentoItem
            key={s.stage}
            /* `slot` is a literal union and resolveJsonModule widens the JSON's strings
               to `string`, so the structurally-correct manifest can't assign without an
               assert. Known TS JSON-import limitation, not a data problem — keep the
               single assert, do NOT widen it to an `as unknown as` double cast. */
            slot={s.slot as Slot}
            label={`${s.stage} · ${s.slot} · crop pending`}
            caption={s.caption}
            gloss={s.gloss}
          />
        ) : (
          <BentoItem
            key={s.stage}
            slot={s.slot as Slot}
            src={s.src}
            alt={s.alt}
            caption={s.caption}
            gloss={s.gloss}
          />
        ),
      )}
    </BentoTheme>
  );
}
