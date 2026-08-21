'use client';

import { useEffect } from 'react';

/**
 * Runtime assertion that the variable font actually loaded, and that its axes
 * actually render. This is v3 §7 check 8b, and it is app code rather than lint
 * code: it is the only check in the system that can fail in production while
 * passing in CI, because it depends on what the browser fetched.
 *
 * Why it exists (R9). The next/font fallback is Arial-based and has no FLAR axis,
 * so every voice decision in the system is invisible during the swap window and
 * permanently on a blocked CDN or a locked-down network. The page still looks
 * plausible in that state, which is exactly what makes it dangerous.
 *
 * Two things are checked, because "a font loaded" is not the same claim as
 * "the axes work":
 *
 *   1. LOADED  -- document.fonts.check against the family next/font generated.
 *   2. AXES    -- the same string measured at FLAR 0 and FLAR 100. Commissioner
 *                 differs; any static fallback answers identically, because it
 *                 has no axis to vary.
 *
 * IT PROBED wdth UNTIL 21 AUG 2026, and that is the lesson this comment exists to
 * carry. Under Bricolage it measured font-stretch 100% against 75%. Commissioner
 * has no wdth axis, so that probe was structurally guaranteed to report false on
 * every load forever -- a permanent false alarm on the one check that can fail in
 * production while passing CI. lint:type 8b stayed green throughout, because it
 * asserts a probe EXISTS by grepping for document.fonts and cannot assert the
 * probe measures a live axis.
 *
 * TWO MEASURED CORRECTIONS came with the rewrite, and both change the design:
 *
 *   THE STRING MATTERS BY ~7x. Flare deforms terminals, so the probe string has
 *   to be full of them. Measured in Chromium at FLAR 0 against 100:
 *   'HAMBURGEFONTSIV' moves 0.20% because caps carry few terminals; a run of
 *   lowercase n moves 1.48%. The pangram is the intuitive choice and the wrong one.
 *
 *   THE THRESHOLD FOLLOWS FROM IT. At 200px a run of n gives a 27.39px delta
 *   (measured live), so 2px is a real test rather than a coin-flip against
 *   measurement noise. The old 0.5px-at-64px threshold was luck.
 *
 * Result lands on <html> as data-font-loaded / data-font-axes so it is
 * inspectable in DevTools, plus one console warning when either fails. It
 * renders nothing and changes no pixel.
 */

/** Terminal-rich on purpose: flare deforms terminals, and caps barely have any. */
const PROBE_TEXT = 'nnnnnnnnnnnnnnnn';
/** Measured at 200px: Commissioner gives 27.39px, a static fallback gives 0. */
const PROBE_SIZE_PX = 200;
/** Width delta below this (px) means the FLAR axis is not rendering. */
const AXIS_EPSILON = 2;

function measureAtFlare(fontFamily: string, flar: number): number {
  const el = document.createElement('span');
  el.textContent = PROBE_TEXT;
  el.setAttribute('aria-hidden', 'true');
  el.style.cssText = [
    'position:absolute',
    'left:-9999px',
    'top:0',
    'white-space:nowrap',
    `font-size:${PROBE_SIZE_PX}px`,
    'font-weight:400',
    `font-family:${fontFamily}`,
    `font-variation-settings:'FLAR' ${flar}`,
  ].join(';');
  document.body.appendChild(el);
  const width = el.getBoundingClientRect().width;
  el.remove();
  return width;
}

export function FontLoadProbe() {
  useEffect(() => {
    let cancelled = false;

    const run = () => {
      if (cancelled) return;

      const root = document.documentElement;
      const fontFamily = getComputedStyle(root).getPropertyValue('--font-sans').trim();
      if (!fontFamily) return;

      // 1. Did a real webfont load, or are we on the metric-matched fallback?
      //    Check the PRIMARY family only. --font-sans is a full stack ending in
      //    system-ui and sans-serif, and document.fonts.check reports false if
      //    any listed family is not a registered FontFace, which generic
      //    keywords never are. Passing the whole stack reports false even when
      //    Bricolage is loaded and rendering.
      const primaryFamily = fontFamily.split(',')[0].trim();
      let loaded = false;
      try {
        loaded = document.fonts.check(`400 1em ${primaryFamily}`);
      } catch {
        // A malformed family string throws rather than returning false; treat
        // that as unknown and let the axis test carry the verdict.
        loaded = false;
      }

      // 2. Does the FLAR axis actually render? A static fallback answers the
      //    same width at both ends, because it has no axis to vary.
      const plain = measureAtFlare(fontFamily, 0);
      const flared = measureAtFlare(fontFamily, 100);
      const axes = Math.abs(plain - flared) > AXIS_EPSILON;

      root.dataset.fontLoaded = String(loaded);
      root.dataset.fontAxes = String(axes);

      if (!loaded || !axes) {
        console.warn(
          `[type-system] ${primaryFamily} did not fully load: loaded=${loaded}, FLAR axis=${axes} ` +
            `(${plain.toFixed(1)}px vs ${flared.toFixed(1)}px at FLAR 0/100, ${PROBE_SIZE_PX}px type). ` +
            `Every voice decision in the system is inert in this state. See v3 R9.`,
        );
      }
    };

    // document.fonts.ready settles after the swap, so this measures the font
    // the user is actually reading rather than the one mid-flight.
    document.fonts.ready.then(run).catch(() => {
      /* No Font Loading API: leave the attributes unset rather than guess. */
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
