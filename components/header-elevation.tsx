'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Sticky header wrapper that owns the scroll-elevation state.
 *
 * An ~8px sentinel is pinned to the top of the page (absolute, anchored to the
 * relatively-positioned <body>). An IntersectionObserver flips `data-scrolled`
 * once the sentinel leaves the viewport top. The 8px height gives hysteresis so
 * the boundary doesn't flicker on momentum / jittery scroll. Appearance-only —
 * the elevation styling (border + bg) lives in globals.css and transitions in
 * 160ms; the global prefers-reduced-motion block collapses that to instant.
 *
 * Server-rendered header content is passed through as `children`, so the
 * wordmark and static markup stay out of the client bundle.
 */
export function HeaderElevation({ children }: { children: React.ReactNode }) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Hysteresis sentinel — anchors to <body> (position: relative). */}
      <div ref={sentinelRef} aria-hidden className="absolute left-0 top-0 h-2 w-full" />
      <header data-scrolled={scrolled || undefined} className="site-header sticky top-0 z-50">
        {children}
      </header>
    </>
  );
}
