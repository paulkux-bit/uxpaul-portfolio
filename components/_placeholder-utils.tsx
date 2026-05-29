import type { ReactNode } from 'react';

interface PlaceholderProps {
  src: string;
  caption?: ReactNode;
  ratio?: string; // e.g. "16 / 9" — defaults to wide UI screen
  label?: string;
}

/**
 * Rendered when a figure is in placeholder mode — i.e. the image hasn't been
 * captured yet. Shows the intended filename and the caption so the slot is
 * legible during writing. Replace `placeholder` prop with the real <Image>
 * once the file lands in /public.
 */
export function PlaceholderFrame({
  src,
  caption,
  ratio = '16 / 9',
  label = 'Image pending',
}: PlaceholderProps) {
  return (
    <div className="figure-placeholder" style={{ aspectRatio: ratio }}>
      <div className="figure-placeholder__inner">
        <span className="figure-placeholder__label">{label}</span>
        <code className="figure-placeholder__src">{src}</code>
        {caption ? <p className="figure-placeholder__caption">{caption}</p> : null}
      </div>
    </div>
  );
}
