'use client';

import { useEffect, useRef } from 'react';

/**
 * One-shot scroll reveal for an About page section. Progressive enhancement,
 * mirroring RevealGrid / RevealList's contract exactly:
 *
 * - SSR / no-JS renders visible (the hide is driven by JS-set data attributes
 *   the server never emits), so a failed or absent JS load is safe.
 * - Under `prefers-reduced-motion: reduce` the effect no-ops, and the CSS that
 *   would hide it is itself inside a no-preference block, so content stays put.
 * - A section already in the viewport at mount is marked shown immediately (no
 *   hide, so no flash); one below the fold is hidden, then revealed by an
 *   IntersectionObserver and unobserved once it fires.
 *
 * The arc's tick draw-in rides the same `data-reveal-shown` in CSS rather than
 * running a second observer of its own.
 *
 * TODO: generalize the three reveals separately. This is the third copy of the
 * observer (see the same note in reveal-grid.tsx and reveal-list.tsx). It is
 * copied again rather than extracted because the other two are rendered by the
 * home page, which this module must not touch; the refactor wants its own pass.
 *
 * Renders the <section> itself so the page stays a Server Component and its
 * content is passed through as children.
 */
export function RevealSection({
  className,
  children,
  ...rest
}: React.ComponentPropsWithoutRef<'section'>) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (inView) {
      el.dataset.revealShown = 'true';
      return;
    }

    el.dataset.revealHidden = 'true';
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const target = entry.target as HTMLElement;
          delete target.dataset.revealHidden;
          target.dataset.revealShown = 'true';
          observer.unobserve(target);
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className={['about-reveal', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </section>
  );
}
