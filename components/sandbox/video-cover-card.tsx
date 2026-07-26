'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { CaseStudy } from '@/app/data/case-studies';

/**
 * THROWAWAY sandbox experiment (see app/sandbox/home-video). Renders the BARD
 * index card's TYPOGRAPHIC cover with an optimized line-art video behind the
 * question, blended into the canvas. Not wired into the real home page. The A/B
 * toggle above the card is sandbox chrome so the two encodes can be judged at
 * real card size.
 *
 * Blend treatment (one asset, both modes):
 *   light -> mix-blend-mode: multiply  (near-white bg drops toward the cream, black lines stay)
 *   dark  -> filter: invert(1); mix-blend-mode: screen  (white lines on the dark canvas)
 * prefers-reduced-motion: reduce -> never autoplay; the poster frame stands in.
 */
const VARIANTS = {
  a: { label: 'A · 3 beats · 6.1s', base: '/sandbox/home-video/home-video-a' },
  b: { label: 'B · forms · 3.0s', base: '/sandbox/home-video/home-video-b' },
} as const;
type VKey = keyof typeof VARIANTS;

export function VideoCoverCard({ study }: { study: CaseStudy }) {
  const [variant, setVariant] = useState<VKey>('a');
  const v = VARIANTS[variant];
  const videoRef = useRef<HTMLVideoElement>(null);

  // Honor reduced-motion: play only when motion is allowed; otherwise the poster
  // stands in (no autoPlay attribute, so nothing plays until we call play()).
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) el.pause();
    else void el.play().catch(() => {});
  }, [variant]);

  return (
    <div>
      {/* Sandbox-only variant switch (not part of the card design). */}
      <div className="mb-3 flex items-center gap-2 text-caption text-muted">
        <span>Video variant:</span>
        {(Object.keys(VARIANTS) as VKey[]).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setVariant(k)}
            aria-pressed={variant === k}
            className={`rounded-sm border px-2 py-1 transition-colors ${
              variant === k ? 'border-strong text-primary' : 'border-subtle hover:border-default'
            }`}
          >
            {VARIANTS[k].label}
          </button>
        ))}
      </div>

      <article className="group relative overflow-hidden rounded-sm border border-subtle bg-surface lift hover:lift-hover focus-within:lift-hover hover:border-strong focus-within:border-strong">
        {/* Typographic cover, now with a video layer behind the question. */}
        <div className="relative flex aspect-video items-end overflow-hidden border-b border-subtle bg-sunken p-6 md:p-8">
          <video
            key={variant}
            ref={videoRef}
            className="hv-cover-video"
            muted
            loop
            playsInline
            preload="auto"
            poster={`${v.base}-poster.webp`}
          >
            <source src={`${v.base}.webm`} type="video/webm" />
            <source src={`${v.base}.mp4`} type="video/mp4" />
          </video>
          <h2 className="text-cover relative z-10">
            <Link
              href={`/case-studies/${study.slug}`}
              className="text-primary no-underline hover:underline after:absolute after:inset-0 after:content-['']"
            >
              {study.problemFraming}
              <span className="sr-only">
                . {study.projectName}, {study.client} case study
              </span>
            </Link>
          </h2>
        </div>
        <div className="px-6 pb-6 pt-3 md:px-8 md:pb-8">
          <p className="text-caption">
            <span className="text-secondary">{study.projectName} · </span>
            <span className="font-semibold text-primary">{study.client}</span>
          </p>
        </div>
      </article>

      {/* Scoped to this sandbox class name, so globals.css / the real site are untouched. */}
      <style>{`
        .hv-cover-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
          mix-blend-mode: multiply;
        }
        html.dark .hv-cover-video {
          filter: invert(1);
          mix-blend-mode: screen;
        }
      `}</style>
    </div>
  );
}
