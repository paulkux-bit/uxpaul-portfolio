import Link from 'next/link';
import { type CaseStudy } from '@/app/data/case-studies';
import { isPublished } from '@/app/data/case-study-routes';

// Per-card cover illustration, keyed by slug -> asset basename in
// public/case-studies/covers/ (webp + png). Decorative line art; the question
// and client carry the meaning, so it renders aria-hidden. A card without an
// entry still renders (question + meta only). Theme-flip via the .cover-art
// blend rule in globals.css.
const COVER_ART: Record<string, string> = {
  'uscg-bard': 'bard',
  'us-navy-fdt-e': 'fdte',
  'us-navy-dagr': 'dagr',
  'urbn-shipping': 'urbn',
  nuuly: 'nuuly',
};

/**
 * One entry in the case-study index. There is one cover: **typographic**. The
 * framing IS the cover, set large, with project·client beneath it. A deliberate
 * cover, never an empty state — no "placeholder" text anywhere.
 *
 * The motion and image tiers were removed by decision, not by accident: video
 * cards are not happening. What went with them is recorded in the commit.
 *
 * The whole card is one click target via a stretched link: a single `<a>` on
 * the title with an `::after` overlay covering the `<article>`. Accessible name
 * is the framing plus a visually-hidden project·client destination, so a
 * screen-reader user scanning links knows where each goes (the visible label
 * stays a subset of the accessible name — SC 2.5.3). Exactly one `<h2>` + one
 * link per card in every tier.
 *
 * Structural note: the typographic cover gets its OWN well — not the media
 * frame — because the media frame is `overflow-hidden` and scales on hover.
 * Putting the stretched link inside it would clip the `::after` to the cover
 * and the project·client strip would stop being clickable.
 *
 * Hover/focus is structural, not a color wash: the card lifts, its border
 * tightens (subtle → strong), and in media tiers the media scales a hair
 * (motion-safe only). Server Component.
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
      <span className="sr-only">
        . {study.projectName}, {study.client} case study
      </span>
    </Link>
  ) : (
    study.problemFraming
  );

  const meta = (
    // Weight the client, not the project codename: to a skimming hiring
    // manager the institution (U.S. Navy, URBN) is the recognizable equity;
    // the internal codename (Bard, Dagr, FDT-E) is opaque. Reading order stays
    // project · client; emphasis lands on the client.
    <p className="text-caption">
      <span className="text-secondary">{study.projectName} · </span>
      <span className="font-semibold text-primary">{study.client}</span>
      {published ? null : <span className="text-secondary"> · Coming soon</span>}
    </p>
  );

  return (
    <article
      className={[
        'case-card relative isolate flex h-full flex-col overflow-hidden rounded-2xl border border-subtle bg-surface lift',
        // Hover/focus response is a promise of a click target. An unpublished
        // card has none, so it rests: same border, same elevation, no lift.
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
      <div className="flex flex-1 flex-col px-6 py-8 md:px-8 md:py-12">
        {art ? (
          /* Decorative, pre-sized, mix-blended asset served directly via
               <picture> (webp + png). next/image would re-encode and strip the
               fixed dimensions the blend relies on. The <picture> is the block
               sizing box (percentage width on an inline picture's <img> misresolves);
               ~40% card width, centered, floating over the question. */
            <picture className="mx-auto mb-6 block w-[40%] max-w-[200px] md:mb-8">
              <source srcSet={`/case-studies/covers/${art}.webp`} type="image/webp" />
              <img
                src={`/case-studies/covers/${art}.png`}
                alt=""
                aria-hidden="true"
                width={600}
                height={600}
                className="cover-art w-full"
              />
            </picture>
        ) : null}
        <div className="mt-auto">
          <h2 className="text-cover">{title}</h2>
          <div className="mt-3">{meta}</div>
        </div>
      </div>
    </article>
  );
}
