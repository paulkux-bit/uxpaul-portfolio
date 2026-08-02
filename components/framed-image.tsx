import Image, { type StaticImageData } from 'next/image';

/**
 * Which radius token the frame uses. `image` is the shared containment radius
 * every UI capture on the site uses; `portrait` is the tighter editorial corner
 * reserved for the About portrait.
 */
type FrameVariant = 'image' | 'portrait';

interface FramedImageProps {
  src: string | StaticImageData;
  alt: string;
  /** CSS aspect-ratio for the frame, e.g. "4 / 5". Reserves the box, so no CLS. */
  ratio?: string;
  variant?: FrameVariant;
  /** Responsive `sizes`. Required: a wrong one silently ships the wrong bytes. */
  sizes: string;
  /**
   * LCP images only. Adds the preload and drops lazy loading, and pairs with
   * quality 90 (the rung next.config.mjs reserves for exactly this case).
   */
  priority?: boolean;
  /** `object-position`, for crops that should not centre. */
  position?: string;
  className?: string;
}

/**
 * The site's framed image: a ratio box that reserves its own space, clipped to a
 * radius token, with the inset hairline that defines an image edge in both modes.
 *
 * Extracted because the treatment previously existed only as CSS repeated at
 * three sites (.hero-block__image-frame, the framed-pair cell, and the About
 * portrait), which is how the portrait drifted into a bespoke one-off.
 *
 * Note it does NOT reuse `.figure__image`: that base rule paints its edge with
 * `border: 1px solid color-mix(in oklch, currentColor 12%, transparent)`, the
 * opacity weight-fake CLAUDE.md bans. This uses the sanctioned inset hairline on
 * `--border-subtle` instead.
 *
 * Quality is fixed at the two documented rungs rather than exposed: 90 for a
 * priority LCP, 85 otherwise. Callers picking their own would drift off the
 * ladder declared in next.config.mjs, and an undeclared value throws at render.
 *
 * A static import for `src` gets a build-time blurDataURL for free, which is why
 * the portrait passes one. Server Component.
 *
 * TODO: HeroBlock is the natural second consumer and this is shaped to take it,
 * but migrating it changes what both case-study routes render, so it wants its
 * own pass with those routes re-verified.
 */
export function FramedImage({
  src,
  alt,
  ratio = '4 / 5',
  variant = 'image',
  sizes,
  priority = false,
  position,
  className,
}: FramedImageProps) {
  const isStatic = typeof src !== 'string';

  return (
    <div
      className={['framed-image', `framed-image--${variant}`, className].filter(Boolean).join(' ')}
      style={{ aspectRatio: ratio }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        quality={priority ? 90 : 85}
        priority={priority}
        // Only a static import carries the generated blur data; a string src has
        // none, and passing placeholder="blur" without it is a render error.
        placeholder={isStatic ? 'blur' : undefined}
        className="framed-image__img"
        style={position ? { objectPosition: position } : undefined}
      />
    </div>
  );
}
