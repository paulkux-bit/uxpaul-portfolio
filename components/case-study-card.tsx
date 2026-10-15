import Link from 'next/link';
import { type CaseStudy } from '@/app/data/case-studies';
import { isPublished } from '@/app/data/case-study-routes';

// Per-card cover illustration, keyed by slug -> asset basename in
// public/case-studies/covers/ (webp + png). Decorative line art; the question
// and client carry the meaning, so it renders aria-hidden. Theme-flip via the
// .cover-art blend rule in globals.css.
//
// ASSERTED BY __tests__/cover-art.test.mjs, WHICH IS WHY THIS IS EXPORTED.
// A key that does not match a published slug used to degrade quietly to no
// illustration: 0ee2dcc renamed a slug, this map kept the old one, the lookup
// missed, and the card rendered a large empty well with every gate green. Now
// four things fail CI instead - a key that is not a published slug, a value
// missing either half of its webp/png pair, a published study with no key, and
// two studies pointing at the same art.
export const COVER_ART: Record<string, string> = {
  'uscg-bard': 'bard',
  'us-navy-fdt-e': 'fdte',
  'us-navy-dagr': 'dagr',
  'urbn-delivery-promise': 'urbn',
  nuuly: 'nuuly',
};

// Covers that also ship a 1200 px pair, `${art}-1200.webp` / `.png`, beside the
// 600 px `${art}.webp` / `.png` that COVER_ART and the test resolve (9 Oct 2026,
// rulings size-b, sharp-s, B2, C1). Nuuly is a single 600 file. The <img>
// width/height state the largest file each card has. Exported for the test.
export const COVER_1200 = new Set(['bard', 'fdte', 'dagr', 'urbn']);

// The art's rendered width, measured 14 Oct 2026: min(44% of the card's content
// box, 210px) (home cards H1b; was 55% and 280). One column below 1024: content
// = 100vw - 98px below 768, where the gutter holds at 24, so the cap is reached
// at a 576 px viewport and holds through 1023. Two columns from 1024, where the
// cap is never reached: 176.6 px at 1024, 203.7 at its peak near 1160, 203.3
// from 1216 up. 204 is that maximum rounded up. Read back from currentSrc: 1x
// and 2x always take the 600 file (the widest at 2x is 420 device px); 3x takes
// the 1200 wherever the declared size passes 200 px, which is every width from
// about 553 up, including 1024 to 1140 where the art itself is under 200. A 390
// phone at 3x (386 px) takes the 600.
const COVER_SIZES =
  '(min-width: 1024px) 204px, (min-width: 768px) 210px, min(calc((100vw - 98px) * 0.44), 210px)';

/**
 * One entry in the case-study index. There is one cover: **typographic**. The
 * framing IS the cover, at the card's foot, under two meta lines. A deliberate
 * cover, never an empty state — no "placeholder" text anywhere.
 *
 * The motion and image tiers were removed by decision, not by accident: video
 * cards are not happening. What went with them is recorded in the commit.
 *
 * The whole card is one click target via a stretched link: a single `<a>` on
 * the title with an `::after` overlay covering the `<article>`. Accessible name
 * is the framing plus a visually-hidden client and project destination, so a
 * screen-reader user scanning links knows where each goes (the visible label
 * stays a subset of the accessible name — SC 2.5.3). Exactly one `<h2>` + one
 * link per card in every tier.
 *
 * Structural note: the typographic cover gets its OWN well — not the media
 * frame — because the media frame is `overflow-hidden` and scales on hover.
 * Putting the stretched link inside it would clip the `::after` to the cover
 * and the client line would stop being clickable.
 *
 * Hover deepens the panel to --card-hover (the elevated surface in light, a
 * gentler step in dark, 3a ruling 1b) and underlines the question at 1px (H-b
 * and K3a, 14 Oct 2026); keyboard focus draws one halo
 * round the whole card instead. No lift and no shadow since H1b (1 Oct 2026),
 * and no visible border since T4. The states live in globals.css. Server
 * Component.
 */
export function CaseStudyCard({ study }: { study: CaseStudy }) {
  const art = COVER_ART[study.slug];
  const published = isPublished(study.slug);

  // Unpublished: plain text, so the stretched-link ::after goes with it. The
  // visually-hidden destination goes too — there is no destination to announce.
  const title = published ? (
    <Link
      href={`/case-studies/${study.slug}`}
      className="case-card__title-link text-primary after:absolute after:inset-0 after:content-['']"
    >
      {study.problemFraming}
      {/* No leading full stop: every framing ends in its own question mark,
          which is the pause, and ". " after it was spoken as "?." Client
          first (O1, 3 Oct 2026), the order the card shows and the
          next-case-study link speaks. */}
      <span className="sr-only">
        {' '}{study.client}, {study.projectName} case study
      </span>
    </Link>
  ) : (
    study.problemFraming
  );

  const meta = (
    // The client leads: to a skimming hiring manager the institution (U.S.
    // Navy, URBN) is the recognizable equity (B2, 3 Oct 2026), at weight 500
    // since T4. Under it, in text-muted, the product and its years (home cards
    // Rb and H4b, 14 Oct 2026). The range sits in its own whitespace-nowrap
    // span so it never wraps (H8b).
    //
    // ON SCREEN THIS IS THE CARD'S TOP LINE; IN THE DOM IT FOLLOWS THE h2
    // (home cards T4, 14 Oct 2026). order-first lifts it in the flex column,
    // so a screen reader still meets the question first and the link's
    // accessible name is unchanged. The sr-only comma after the client is the
    // pause a screen reader would otherwise lose between client and product.
    <p className="order-first text-caption">
      <span className="block font-medium text-primary">
        {study.client}
        <span className="sr-only">,</span>
      </span>
      <span className="block text-muted">{study.projectName}, <span className="whitespace-nowrap">{study.years}</span></span>
      {published ? null : <span className="block text-secondary">Coming soon</span>}
    </p>
  );

  return (
    <article
      className={[
        // The border is transparent, not removed (T4): the card is a panel of
        // --bg-surface on --bg-canvas, and the 1px edge stays so forced-colors
        // mode still draws it. @container makes the card the inline-size
        // container the question's cqi size resolves against (text-cover).
        'case-card @container relative isolate flex h-full flex-col overflow-hidden border border-transparent bg-surface',
        // Hover/focus response is a promise of a click target. An unpublished
        // card has none, so it rests: same border, no response.
        // The states themselves live in globals.css (R4); this modifier is the
        // hook that scopes them to a card that actually links somewhere.
        published ? 'case-card--linked' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* One cream panel, top to bottom: the meta, the drawing, the question
          (home cards T4, 14 Oct 2026). Equal heights again: the grid sets every
          row to the tallest card (grid-auto-rows: 1fr in app/page.tsx), which
          reverses round 1's text-follows-the-drawing (H3c). The column's gap-l
          spaces the three, and the drawing's my-auto takes the spare height
          above and below it, so the meta holds the top and the question the
          foot. */}
      <div className="flex flex-1 flex-col gap-l px-m py-l md:px-l md:py-xl">
        {art ? (
          /* Decorative, pre-sized, mix-blended asset served directly via
               <picture> (webp + png). next/image would re-encode and strip the
               fixed dimensions the blend relies on. The <picture> is the block
               sizing box (percentage width on an inline picture's <img> misresolves);
               44% of the card's content width, capped at 210px (home cards H1b,
               14 Oct 2026), centred between the meta and the question. */
            <picture className="mx-auto my-auto block w-[44%] max-w-[210px]">
              {/* One <source> and one <img>, direct children: a fragment between
                  them and <picture> loses @next/next/no-img-element's picture
                  exemption. Only the four 1200 covers get srcset and sizes. */}
              <source
                srcSet={
                  COVER_1200.has(art)
                    ? `/case-studies/covers/${art}.webp 600w, /case-studies/covers/${art}-1200.webp 1200w`
                    : `/case-studies/covers/${art}.webp`
                }
                sizes={COVER_1200.has(art) ? COVER_SIZES : undefined}
                type="image/webp"
              />
              <img
                src={`/case-studies/covers/${art}.png`}
                srcSet={
                  COVER_1200.has(art)
                    ? `/case-studies/covers/${art}.png 600w, /case-studies/covers/${art}-1200.png 1200w`
                    : undefined
                }
                sizes={COVER_1200.has(art) ? COVER_SIZES : undefined}
                alt=""
                aria-hidden="true"
                width={COVER_1200.has(art) ? 1200 : 600}
                height={COVER_1200.has(art) ? 1200 : 600}
                className="cover-art w-full"
              />
            </picture>
        ) : null}
        <h2 className="case-card__question text-cover">{title}</h2>
        {meta}
      </div>
    </article>
  );
}
