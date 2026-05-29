'use client';

import { useEffect, useState } from 'react';
import { useAnnotations } from './popup-context';

/**
 * Floating annotation button. Replaces the header toggle on case study pages.
 *
 * - Bottom-left, editorial position (not bottom-right marketing-widget territory).
 * - Pill: neutral when off, persimmon dot when on.
 * - Fades in after the user scrolls past the hero (~250px).
 * - Renders present immediately under prefers-reduced-motion.
 * - Lives in the case-study layout only; not in the root layout.
 */
export function AnnotationFAB() {
  const { enabled, toggle } = useAnnotations();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Respect reduced motion: skip the entrance animation, show immediately.
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      setVisible(true);
      return;
    }

    const onScroll = () => {
      setVisible(window.scrollY > 250);
    };

    onScroll(); // initialize for the case where the page loads scrolled
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? 'Turn annotations off' : 'Turn annotations on'}
      className={[
        'annotation-fab',
        enabled ? 'is-on' : 'is-off',
        visible ? 'is-visible' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="annotation-fab__dot" aria-hidden />
      <span className="annotation-fab__label">
        Annotations <span className="annotation-fab__state">{enabled ? 'on' : 'off'}</span>
      </span>
    </button>
  );
}
