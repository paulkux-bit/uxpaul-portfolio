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

// The art's rendered width, measured 9 Oct 2026: min(55% of the card's content
// box, 280px). One column below 1024 (content = 100vw - 98px below 768, where the
// gutter holds at 24; 280 is reached by 768), two from 1024 (220.6 px at 1024,
// 254.1 from about 1150 up). At 2x the widest is 560 device px, under 600, so 1x
// and 2x always take the 600 file; 3x takes the 1200 wherever the art is wider
// than 200 px, and a 390 phone at 3x (482 px) still takes the 600.
const COVER_SIZES =
  '(min-width: 1024px) 255px, (min-width: 768px) 280px, min(calc((100vw - 98px) * 0.55), 280px)';

/**
 * One entry in the case-study index. There is one cover: **typographic**. The
 * framing IS the cover, set large, with the client beneath it. A deliberate
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
 * Hover/focus is structural, not a color wash: the border tightens (subtle to
 * strong) and the title underlines. No lift and no shadow since H1b (1 Oct
 * 2026). Server Component.
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
    // The client only, not the project name: to a skimming hiring manager the
    // institution (U.S. Navy, URBN) is the recognizable equity; the project
    // name is opaque until the study explains it. B2, 3 Oct 2026, replacing
    // H3b's two lines. The project name stays in the link's accessible name.
    <p className="text-caption">
      <span className="block font-semibold text-primary">{study.client}</span>
      {published ? null : <span className="block text-secondary">Coming soon</span>}
    </p>
  );

  return (
    <article
      className={[
        'case-card relative isolate flex h-full flex-col overflow-hidden border border-subtle bg-surface',
        // Hover/focus response is a promise of a click target. An unpublished
        // card has none, so it rests: same border, no response.
        // The states themselves live in globals.css (R4); this modifier is the
        // hook that scopes them to a card that actually links somewhere.
        published ? 'case-card--linked' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* One cream surface: a floating centered illustration over the question
          (left) and the muted meta. flex-col + the mt-auto text block pin the
          question/meta to the bottom so the cards equalize height (grid-auto-rows:1fr
          on the grid) with the illustration floating above. */}
      <div className="flex flex-1 flex-col px-m py-l md:px-l md:py-xl">
        {art ? (
          /* Decorative, pre-sized, mix-blended asset served directly via
               <picture> (webp + png). next/image would re-encode and strip the
               fixed dimensions the blend relies on. The <picture> is the block
               sizing box (percentage width on an inline picture's <img> misresolves);
               55% of the card's content width, capped at 280px, centered, floating
               over the question. */
            <picture className="mx-auto mb-m block w-[55%] max-w-[280px] md:mb-l">
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
        <div className="mt-auto">
          <h2 className="text-cover">{title}</h2>
          <div className="mt-xs">{meta}</div>
        </div>
      </div>
    </article>
  );
}
