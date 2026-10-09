import { getWork, type Work } from '@/app/data/works';

/** The credit line, generated from the record so the two cannot disagree. The
 *  title takes quotation marks, not a type style (CLAUDE.md, emphasis strategy;
 *  ruling A1, 8 Oct 2026): the face has no italic and synthesis is off, so an
 *  "italic" title renders upright and indistinguishable from the rest. <cite>
 *  carries the semantics; the comma sits inside the closing mark. */
function Credit({ work }: { work: Work }) {
  return (
    <p className="friction-moment__credit">
      {work.artist}, <cite>“{work.title},”</cite> {work.date}. {work.institution}, public domain.
    </p>
  );
}

/**
 * The friction moment: one still painting in section 2 of every Template A study,
 * between the lede and the first paragraph. It replaced the animated convoy on
 * Line of Sight and the three friction beats on the other four studies (fine art
 * build, 8 Oct 2026). The name stays because the spacing spec (S2a) and the
 * evidence rule beside .cs-section already list "the friction moment" as an
 * evidence block, and this is still that block.
 *
 * Everything about a work lives in app/data/works.json: the MDX passes a slug and
 * nothing else, so a study cannot drift from its record, and scripts/lint-works.mjs
 * checks the rendered page against the record in the build.
 *
 * SERVER COMPONENT, NO next/image. The delivery files are encoded offline by
 * scripts/build-fine-art.mjs at the 1x box and twice it, so the bytes are measured
 * before they ship rather than decided at request time. `sizes` is the narrower of
 * the mobile column and the 1x width; the measure and --art-max-height can only
 * make the rendered box smaller, so it never under-asks.
 *
 * The artwork is never altered: no filter, blend, transform, mat or motion, in
 * either theme (globals.css, .friction-moment).
 */
export function FrictionMoment({ work: slug }: { work: string }) {
  const work = getWork(slug);
  const { width, height } = work.display;
  const [avif1, avif2] = work.files.avif;
  const [webp1, webp2] = work.files.webp;
  const sizes = `min(calc(100vw - 48px), ${width}px)`;

  return (
    <figure className="friction-moment">
      <picture>
        <source type="image/avif" srcSet={`${avif1} ${width}w, ${avif2} ${width * 2}w`} sizes={sizes} />
        <source type="image/webp" srcSet={`${webp1} ${width}w, ${webp2} ${width * 2}w`} sizes={sizes} />
        <img
          className="friction-moment__image"
          src={webp1}
          width={width}
          height={height}
          alt={work.alt}
          loading="lazy"
          decoding="async"
        />
      </picture>
      <figcaption>
        <p className="bento-theme__caption friction-moment__caption">
          <strong className="bento-theme__lead">{work.caption.lead}</strong>
          <span className="bento-theme__gloss">{' '}{work.caption.gloss}</span>
        </p>
        <Credit work={work} />
      </figcaption>
    </figure>
  );
}
