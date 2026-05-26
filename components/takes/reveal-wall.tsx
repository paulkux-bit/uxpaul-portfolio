'use client';

import { useEffect, useRef } from 'react';

/**
 * One-shot entrance trigger for the "Off the clock" wall. Progressive
 * enhancement, mirroring reveal-list/reveal-grid:
 *
 * - SSR / no-JS renders the wall with `.in-view` already applied (the CSS
 *   pre-entrance/hidden states only bite when JS removes it), so a failed/
 *   absent JS load shows the finished wall.
 * - Under `prefers-reduced-motion: reduce` the effect no-ops — the CSS reduce
 *   block holds everything at rest anyway.
 * - Otherwise: strip `.in-view` on mount, then an IntersectionObserver re-adds
 *   it once when the wall scrolls in (after a short beat, so the entrance is
 *   perceived, not flashed). All choreography is CSS off the `.in-view` class.
 *
 * Renders the grid element itself so the takes stay Server Components, passed
 * in as children.
 */
export function RevealWall({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    el.classList.remove('in-view');
    const inView = () => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight * 0.75 && r.bottom > 0;
    };
    if (inView()) {
      // Already on screen at mount: small beat so the entrance is seen, not flashed.
      const t = setTimeout(() => el.classList.add('in-view'), 80);
      return () => clearTimeout(t);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setTimeout(() => el.classList.add('in-view'), 80);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.25, rootMargin: '0px 0px -50px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`in-view ${className ?? ''}`}>
      {children}
    </div>
  );
}
