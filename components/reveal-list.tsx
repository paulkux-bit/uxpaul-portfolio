'use client';

import { useEffect, useRef } from 'react';

/**
 * One-shot reveal for the "Also shipped" shelf. Progressive enhancement,
 * mirroring RevealGrid (copied, not generalized — second consumer; generalize
 * on the third):
 *
 * - SSR / no-JS renders every item visible (the hide is driven by JS-set data
 *   attributes the server never emits), so a failed/absent JS load is safe.
 * - Under `prefers-reduced-motion: reduce` the effect no-ops — items stay visible.
 * - Items already in the viewport at mount are marked shown immediately (no
 *   hide → no flash); items below the fold are hidden, then revealed by an
 *   IntersectionObserver as they scroll in. No stagger (short list).
 *
 * Renders the `<ol>` itself so QuickHit stays a Server Component, passed in as
 * `<li>` children.
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

    const items = Array.from(el.children) as HTMLElement[];
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

    for (const item of items) {
      const rect = item.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView) {
        item.dataset.revealShown = 'true';
      } else {
        item.dataset.revealHidden = 'true';
        observer.observe(item);
      }
    }

    return () => observer.disconnect();
  }, []);

  return (
    <ol ref={ref} role="list" className={`reveal-list ${className ?? ''}`}>
      {children}
    </ol>
  );
}
