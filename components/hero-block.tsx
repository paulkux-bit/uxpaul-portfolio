import Image from 'next/image';
import type { ReactNode } from 'react';
import { PlaceholderFrame } from './_placeholder-utils';

type HeroBlockProps = {
  eyebrow: string;
  title: string | [string, string];
  role: string;
  image: {
    src: string;
    alt: string;
    placeholder?: boolean;
  };
  callout?: {
    label: string;
    /** ReactNode (not just string) so authors can include <cite> / <a> / spans
     *  inside the callout body without restructuring the API. Matches the
     *  family precedent (AsymmetricPair text-cell, Figure caption). */
    body: ReactNode;
  };
};

/**
 * Asymmetric case-study hero. Type left (~45%), framed image right (~55%) at
 * lg+; stacked single column at <lg with the callout below the image (not
 * overlapping). Server-rendered.
 *
 * Typography uses explicit font-variation-settings per the Phase 1 Tomás spec —
 * see .hero-block__sentence--open (wdth 100) and --anxious (wdth 88) in
 * globals.css for the H1's signature divergence. Bricolage's wdth axis carries
 * the voice the two sentences set up semantically: data was there (relaxed/
 * French) ↔ system couldn't speak it (anxious/British). That's the editorial
 * move; the static spec stands on its own, animation is gravy on top.
 *
 * Image-pipeline reuse: we share next/image + PlaceholderFrame directly rather
 * than wrapping in <Figure>, because Figure's vertical margins (3rem top /
 * 3.5rem bottom) would push the image off-axis from the type column. Same
 * primitives, no margin drift.
 */
export function HeroBlock({ eyebrow, title, role, image, callout }: HeroBlockProps) {
  const sentences = typeof title === 'string' ? [title] : title;

  return (
    <header className="hero-block">
      <div className="hero-block__type">
        <p className="hero-block__eyebrow">{eyebrow}</p>
        <h1 className="hero-block__title">
          {sentences.map((s, i) => (
            <span
              key={i}
              className={
                'hero-block__sentence ' +
                (i === 0 ? 'hero-block__sentence--open' : 'hero-block__sentence--anxious')
              }
            >
              {s}
            </span>
          ))}
        </h1>
        <p className="hero-block__role">{role}</p>
      </div>

      <div className="hero-block__image">
        <div className="hero-block__image-frame">
          {image.placeholder ? (
            <PlaceholderFrame src={image.src} ratio="16 / 10" />
          ) : (
            /* Hardcoded `priority` — this <Image> is the LCP for every page that
               mounts <HeroBlock />. Not exposed as a prop; sharing the LCP slot
               isn't a sane authoring decision and would just give callers a
               chance to mis-assign it. Mount <HeroBlock /> at most once per page.
               Don't "fix" this. */
            <Image
              src={image.src}
              alt={image.alt}
              width={2400}
              height={1500}
              priority
              /* sizes math accounts for both the page-container inline padding
                 (1.5rem mobile / 2rem md+, each side) AND the .hero-block__image-frame
                 padding (1.25rem at <=640 / 2rem above, each side) at <lg, plus the
                 3rem grid gap + 4rem frame padding at lg+. */
              sizes="(max-width: 640px) calc(100vw - 5.5rem), (max-width: 1023px) calc(100vw - 7rem), calc((min(100vw - 4rem, 1088px) - 3rem) * 0.55 - 4rem)"
              quality={90}
              className="hero-block__image-img"
            />
          )}
        </div>
        {callout ? (
          /* aria-label derives from the authored label so other case studies
             can use this component with non-BARD callouts (pull quotes, status
             chips, credits) without lying to screen readers. */
          <aside className="hero-block__callout" role="note" aria-label={callout.label}>
            <p className="hero-block__callout-label">{callout.label}</p>
            <p className="hero-block__callout-body">{callout.body}</p>
          </aside>
        ) : null}
      </div>
    </header>
  );
}
