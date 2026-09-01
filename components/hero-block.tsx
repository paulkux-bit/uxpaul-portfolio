import Image from 'next/image';
import type { CSSProperties, ReactNode } from 'react';
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
  /** Which corner of the image the callout floats over. Default bottom-left.
   *  Use `top-left` when the image's lower region carries content the card
   *  must not cover. Same card styling and inset either way, only the corner
   *  changes. */
  calloutPosition?: 'bottom-left' | 'top-left';
  /** Max width of the callout card, e.g. '24rem'. Omit for the 18rem CSS default.
   *  Widen it when the image's quiet zone is wider than it is tall: a wider card
   *  reflows the body to fewer lines, so it gets shorter as it gets wider. Feeds
   *  --hero-callout-w; the 78% mobile-inset term still governs on narrow slots. */
  calloutWidth?: string;
};

/**
 * Asymmetric case-study hero. Type left (~52%), image right (~48%) at lg+;
 * stacked single column at <lg. The image is a 4:5 cover screenshot filling its
 * wrapper (overflow-hidden, top-anchored); the callout is a compact info-card
 * contained ON the image (bottom-left, inset) at all breakpoints. Server-rendered.
 *
 * The H1 is two block-level spans, --open then --anxious: the first states the
 * situation, the second turns it. THE SPLIT IS CARRIED BY THE WORDS, and by
 * nothing else in the type. Both spans are rung 5, and the only properties either
 * one sets are letter-spacing and font-weight (globals.css .hero-block__sentence--*).
 *
 * This used to read "both set font-stretch 88 from --wdth-large". False since C3:
 * Commissioner has no wdth axis, the --wdth-* trio was deleted, and no font-stretch
 * survives anywhere in the system. There is no width story here at all any more.
 *
 * An earlier version of this comment claimed the wdth axis carried the voice —
 * one clause relaxed/French at 100, the other anxious/British at 88. Type system
 * v3 §5 retired that: width follows the RUNG, never mood (R2), and R9 is the
 * second reason — the next/font fallback is Arial-based with no wdth axis, so a
 * meaning riding on width vanishes during the swap window and permanently on a
 * blocked CDN. It also said "explicit font-variation-settings", which was never
 * true of these selectors; they use the font-stretch property.
 *
 * The FITTING CONSTRAINT outlived the axis, and it is the part still worth knowing:
 * the clauses were authored to hold one line. Phase 0a rewrote three of them to hold
 * at width 100 so the fallback and the loaded font agreed, which is why they still
 * fit now that width is gone for good. Before shortening one, read the commit — the
 * room is 660px at the binding viewport and the gate is set width in px, not a
 * character count.
 *
 * Image-pipeline reuse: we share next/image + PlaceholderFrame directly rather
 * than wrapping in <Figure>, because Figure's vertical margins (3rem top /
 * 3.5rem bottom) would push the image off-axis from the type column. Same
 * primitives, no margin drift.
 */
/** The callout label's id, referenced by the region's aria-labelledby. A module constant
 *  rather than useId() because HeroBlock is a Server Component and hooks are not available
 *  there. THE PREMISE THAT MAKES A CONSTANT SAFE: exactly one HeroBlock renders per route,
 *  as the page hero. If a second one ever mounts on the same page this becomes a duplicate
 *  id and the labelledby resolves to the first. */
const CALLOUT_LABEL_ID = 'hero-block-callout-label';

export function HeroBlock({
  eyebrow,
  title,
  role,
  image,
  callout,
  calloutPosition = 'bottom-left',
  calloutWidth,
}: HeroBlockProps) {
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
              {/* Trailing space on every sentence but the last. The spans are
                  display:block, so a block box strips it and the rendered line
                  break is unchanged - but textContent, the clipboard, and any
                  accessible-name computation that concatenates text nodes
                  rather than respecting layout all yielded "wait.Everybody"
                  without it. Chrome inserts the space itself for block-level
                  children; that is engine behaviour, not a guarantee. */}
              {i < sentences.length - 1 ? `${s} ` : s}
            </span>
          ))}
        </h1>
        <p className="hero-block__role">{role}</p>
      </div>

      <div className="hero-block__image">
        <div className="hero-block__image-frame">
          {image.placeholder ? (
            <PlaceholderFrame src={image.src} ratio="4 / 5" />
          ) : (
            /* Hardcoded `priority` — this <Image> is the LCP for every page that
               mounts <HeroBlock />. Not exposed as a prop; sharing the LCP slot
               isn't a sane authoring decision and would just give callers a
               chance to mis-assign it. Mount <HeroBlock /> at most once per page.
               Don't "fix" this. */
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority
              /* The wrapper is a sized 4:5 box; `fill` + object-cover (CSS) lets the
                 screenshot fill it edge-to-edge. sizes ≈ the image cell: ~48% of the
                 1088 band at lg+, full content width below. */
              sizes="(min-width: 1024px) 520px, (min-width: 768px) calc(100vw - 4rem), calc(100vw - 3rem)"
              quality={90}
              className="hero-block__image-img"
            />
          )}
        </div>
        {callout ? (
          /* aria-label derives from the authored label so other case studies
             can use this component with non-BARD callouts (pull quotes, status
             chips, credits) without lying to screen readers. */
          <aside
            className={
              'hero-block__callout' +
              (calloutPosition === 'top-left' ? ' hero-block__callout--top-left' : '')
            }
            /* Inline style only when the prop is passed, so consumers that omit it
               (uscg-bard) render byte-identically with no stray style attribute. */
            style={
              calloutWidth ? ({ '--hero-callout-w': calloutWidth } as CSSProperties) : undefined
            }
            role="note"
            /* aria-labelledby, NOT aria-label. The label was announced twice: once as the
               region's name and again as its first paragraph, because the two carried the
               same string. Pointing at the visible <p> keeps the region named and stops
               the repeat. Shared by all four case studies. */
            aria-labelledby={CALLOUT_LABEL_ID}
          >
            <p className="hero-block__callout-label" id={CALLOUT_LABEL_ID}>{callout.label}</p>
            <p className="hero-block__callout-body">{callout.body}</p>
          </aside>
        ) : null}
      </div>
    </header>
  );
}
