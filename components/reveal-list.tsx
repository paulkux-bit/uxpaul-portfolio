'use client';

import { useEffect, useRef } from 'react';

/**
 * One-shot reveal for the "Earlier work" shelf, AS ONE UNIT (ruled 11 Oct
 * 2026): the whole list fades in at the home entrance's timing, not row by row,
 * because a per-row reveal slid each hairline in on its own. Progressive
 * enhancement, mirroring RevealGrid (copied, not generalized; second consumer,
 * generalize on the third):
 *
 * - SSR / no-JS renders the list visible (the hide is driven by JS-set data
 *   attributes the server never emits), so a failed/absent JS load is safe.
 * - Under `prefers-reduced-motion: reduce` the effect no-ops and the list stays
 *   visible.
 * - A list already in the viewport at mount is marked shown immediately (no
 *   hide, no flash); one below the fold is hidden, then revealed by an
 *   IntersectionObserver as it scrolls in.
 *
 * The <ol> is the wrapper's only child, so the `.reveal-list > [data-reveal-*]`
 * contract in globals.css (and the entrance-motion entry in lint:interaction)
 * applies to the whole list unchanged. Rows stay Server Components, passed in
 * as `<li>` children.
 */
export function RevealList({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.revealShown = 'true';
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.3 },
    );

    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (inView) {
      el.dataset.revealShown = 'true';
    } else {
      el.dataset.revealHidden = 'true';
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="reveal-list">
      <ol ref={ref} role="list" className={className}>
        {children}
      </ol>
    </div>
  );
}
