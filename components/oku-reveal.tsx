'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

interface OkuRevealProps {
  className?: string;
  ariaLabel: string;
  children: ReactNode;
}

/**
 * Thin client wrapper for an OKU figure: a gentle, scroll-triggered fade/rise,
 * once. `prefers-reduced-motion` → static (no opacity/transform animation). The
 * heavy inline SVG is passed as server-rendered children, so its path data stays
 * in the HTML and off the client JS bundle. role="img" + aria-label live here so
 * the (aria-hidden) SVG doesn't double-announce.
 */
export function OkuReveal({ className, ariaLabel, children }: OkuRevealProps) {
  const reduceMotion = useReducedMotion();

  const motionProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.3 },
        // --ease-out-soft
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
      };

  return (
    <motion.figure className={className} role="img" aria-label={ariaLabel} {...motionProps}>
      {children}
    </motion.figure>
  );
}
