import Link from 'next/link';
import Image from 'next/image';
import { coverTier, type CaseStudy, type CoverTier } from '@/app/data/case-studies';
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
 * One entry in the case-study index. The cover resolves through three tiers
 * (motion > image > typographic; see `coverTier`):
 *
 * - **motion / image** — a 16:9 media well leads; the problem framing (the
 *   card's title) and project·client sit in a strip beneath it.
 * - **typographic** — the content-less fallback. The framing IS the cover,
 *   set large in a recessed well; only project·client sits beneath. This is a
 *   deliberate cover, never an empty state — no "placeholder" text anywhere.
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
  const tier = coverTier(study);
  const art = COVER_ART[study.slug];
  const published = isPublished(study.slug);

  // Unpublished: plain text, so the stretched-link ::after goes with it. The
  // visually-hidden destination goes too — there is no destination to announce.
  const title = published ? (
    <Link
      href={`/case-studies/${study.slug}`}
      className="text-primary no-underline hover:underline after:absolute after:inset-0 after:content-['']"
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
        'group relative isolate flex h-full flex-col overflow-hidden rounded-2xl border border-subtle bg-surface lift',
        // Hover/focus response is a promise of a click target. An unpublished
        // card has none, so it rests: same border, same elevation, no lift.
        published
          ? 'hover:lift-hover focus-within:lift-hover hover:border-strong focus-within:border-strong'
          : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {tier === 'typographic' ? (
        // One cream surface: a floating centered illustration over the question
        // (left) and the muted meta. flex-col + the mt-auto text block pin the
        // question/meta to the bottom so the cards equalize height (grid-auto-rows:1fr
        // on the grid) with the illustration floating above.
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
      ) : (
        <>
          <CardMediaSlot tier={tier} study={study} />
          <div className="p-6 md:p-8">
            {/* Major register: 90% width (card-scoped, not the global text-h2). */}
            <h2 className="text-h2 [font-stretch:90%]">{title}</h2>
            <div className="mt-2">{meta}</div>
          </div>
        </>
      )}
    </article>
  );
}

/**
 * Aspect-ratio media well for the motion + image tiers. The inner wrapper is
 * positioned (so `next/image` `fill` resolves to it) and scales on hover/focus
 * of the card within the clipped frame — a restrained ken-burns hint.
 * motion-safe only; the global reduced-motion block collapses it to instant.
 */
function CardMediaSlot({
  tier,
  study,
}: {
  tier: Exclude<CoverTier, 'typographic'>;
  study: CaseStudy;
}) {
  return (
    <div className="aspect-video overflow-hidden bg-sunken">
      <div className="relative grid h-full w-full place-items-center motion-safe:transition-transform motion-safe:duration-[320ms] motion-safe:ease-[var(--ease-out-soft)] motion-safe:group-hover:scale-[1.03] motion-safe:group-focus-within:scale-[1.03]">
        {tier === 'motion' ? (
          <video
            className="h-full w-full object-cover"
            src={study.motionVideo}
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : (
          <Image
            src={study.coverImage}
            alt={study.coverImageAlt}
            fill
            sizes="(min-width: 1024px) 48vw, 100vw"
            className="object-cover"
          />
        )}
      </div>
    </div>
  );
}
