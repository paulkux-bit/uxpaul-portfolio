import type { ReactNode } from 'react';

interface PlaceholderProps {
  /** Kept for API stability — quiet placeholder no longer renders the source path. */
  src: string;
  /** Kept for API stability — captions render via the parent <figcaption>, not here. */
  caption?: ReactNode;
  /** Aspect ratio of the placeholder box (e.g. "16 / 9"). */
  ratio?: string;
  /** Kept for API stability — quiet placeholder no longer renders a label. */
  label?: string;
}

/**
 * Quiet placeholder. A single warm-tinted block at the requested aspect ratio
 * — no border, no label, no path. The dashed-and-labeled previous version
 * dominated typography-led layouts where most slots were still placeholders;
 * this version recedes so the designed composition can read. When the real
 * image lands (placeholder prop drops on the parent figure), the box becomes
 * the image at the same dimensions — no other visual shift.
 *
 * Tint values + dark-mode override live in globals.css under .figure-placeholder.
 */
export function PlaceholderFrame({ ratio = '16 / 9' }: PlaceholderProps) {
  return <div className="figure-placeholder" style={{ aspectRatio: ratio }} />;
}
