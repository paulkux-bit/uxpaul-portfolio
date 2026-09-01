'use client';

import { useEffect, useRef } from 'react';

/**
 * One-shot staggered reveal for the case-study index. Progressive enhancement:
 *
 * - SSR / no-JS renders every card visible (the hide is driven by JS-set data
 *   attributes the server never emits), so a failed/absent JS load is safe.
 * - Under `prefers-reduced-motion: reduce` the effect no-ops — cards stay visible.
 * - On mount, each item already in the viewport is marked shown immediately
 *   (no hide → no flash for above-the-fold cards). Items below the fold are
 *   hidden, then revealed by an IntersectionObserver as they scroll in, with a
 *   per-item stagger (CSS nth-child transition-delay).
 *
 * Renders the `<ul>` itself so `CaseStudyCard` stays a Server Component, passed
 * in as `<li>` children.
 */
export function RevealGrid({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLUListElement>(null);

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
      { threshold: 0.2 },
    );

    for (const item of items) {
      const rect = item.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView) {
        // Already on screen at load: show with no prior hide (no flash, no anim).
        item.dataset.revealShown = 'true';
      } else {
        item.dataset.revealHidden = 'true';
        observer.observe(item);
      }
    }

    return () => observer.disconnect();
  }, []);

  return (
    /* role="list": preflight's `list-style: none` strips list semantics in WebKit.
       reveal-list.tsx, this component's sibling, has carried the role since it was
       written; this one was the outlier of the pair. */
    <ul ref={ref} role="list" className={`reveal-grid ${className ?? ''}`}>
      {children}
    </ul>
  );
}
