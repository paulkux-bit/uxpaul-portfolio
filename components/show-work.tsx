import type { ReactNode } from 'react';

/**
 * <ResolutionBlock> — the "Show the Work" resolution wrapper: a spine-rhyme
 * marker + a resolution headline, then the evidence (a <BentoTheme>).
 *
 * Spine rhyme: each block carries its friction's 01/02/03 marker AND a
 * resolution headline that rhymes the friction beat's headline — so the
 * friction→resolution read is headline-to-headline, not marker-only.
 *
 * The evidence layout (count-driven bento, focal-decoupled placement, per-row
 * caption lock) now lives in the reusable <BentoTheme>/<BentoItem> in
 * components/bento.tsx — this file is just the marker + headline shell.
 */

interface ResolutionBlockProps {
  /** Spine rhyme — the same 01/02/03 marker the friction beat carried. */
  thread: '01' | '02' | '03';
  /** Resolution heading — rhymes the friction beat's headline. */
  headline: ReactNode;
  framing: ReactNode;
  children: ReactNode;
}

export function ResolutionBlock({ thread, headline, framing, children }: ResolutionBlockProps) {
  return (
    <div className="resolution-block">
      <span className="thread-index">{thread}</span>
      <h3 className="resolution-block__headline">{headline}</h3>
      <div className="resolution-block__framing">{framing}</div>
      {children}
    </div>
  );
}
