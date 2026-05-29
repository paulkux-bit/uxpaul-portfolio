'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useAnnotations } from './popup-context';

interface PopUpProps {
  /**
   * Identifier for this annotation. Used as a data attribute and the
   * accessible name. The component anchors to its own document position
   * via IntersectionObserver — the prop exists so a future refactor can
   * point at an external element id without breaking authoring.
   */
  anchor: string;
  children: ReactNode;
}

export function PopUp({ anchor, children }: PopUpProps) {
  const { enabled } = useAnnotations();
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!enabled || !ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setInView(entry.isIntersecting);
      },
      { rootMargin: '0px 0px -15% 0px', threshold: 0 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [enabled]);

  if (!enabled) return null;

  const motionInitial = prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 14 };
  const motionAnimate = { opacity: 1, x: 0 };
  const motionExit = prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 14 };
  const motionTransition = prefersReducedMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 230, damping: 26 };

  return (
    <div ref={ref} className="popup" data-anchor={anchor}>
      {/* Tablet / mobile: footnote-style inline expandable */}
      <details className="popup-inline">
        <summary>
          <span className="popup-marker" aria-hidden>※</span>
          <span className="popup-inline__label">Annotation</span>
        </summary>
        <div className="popup-inline__body">{children}</div>
      </details>

      {/* Desktop ≥1024px: gutter bubble, IntersectionObserver-triggered */}
      <AnimatePresence>
        {inView && (
          <motion.aside
            key={anchor}
            className="popup-bubble"
            role="note"
            aria-label={`Annotation: ${anchor}`}
            initial={motionInitial}
            animate={motionAnimate}
            exit={motionExit}
            transition={motionTransition}
          >
            <span className="popup-bubble__marker" aria-hidden>※</span>
            <div className="popup-bubble__body">{children}</div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
