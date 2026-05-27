import Link from 'next/link';
import Image from 'next/image';
import { coverTier, type CaseStudy, type CoverTier } from '@/app/data/case-studies';

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

  const title = (
    <Link
      href={`/case-studies/${study.slug}`}
      className="text-primary no-underline hover:underline after:absolute after:inset-0 after:content-['']"
    >
      {study.problemFraming}
      <span className="sr-only">
        . {study.projectName}, {study.client} case study
      </span>
    </Link>
  );

  const meta = (
    // Weight the client, not the project codename: to a skimming hiring
    // manager the institution (U.S. Navy, URBN) is the recognizable equity;
    // the internal codename (Bard, Dagr, FDT-E) is opaque. Reading order stays
    // project · client; emphasis lands on the client.
    <p className="text-caption">
      <span className="text-secondary">{study.projectName} · </span>
      <span className="font-semibold text-primary">{study.client}</span>
    </p>
  );

  return (
    <article className="group relative overflow-hidden rounded-sm border border-subtle bg-surface lift hover:lift-hover focus-within:lift-hover hover:border-strong focus-within:border-strong">
      {tier === 'typographic' ? (
        <>
          {/* Typographic cover — its own un-clipped, un-transformed well, so
              the stretched link still covers the whole article. */}
          <div className="flex aspect-video items-end border-b border-subtle bg-sunken p-6 md:p-8">
            <h2 className="text-cover">{title}</h2>
          </div>
          <div className="px-6 pb-6 pt-3 md:px-8 md:pb-8">{meta}</div>
        </>
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
