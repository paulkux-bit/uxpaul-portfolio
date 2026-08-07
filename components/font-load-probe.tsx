'use client';

import { useEffect } from 'react';

/**
 * Runtime assertion that the variable font actually loaded, and that its axes
 * actually render. This is v3 §7 check 8b, and it is app code rather than lint
 * code: it is the only check in the system that can fail in production while
 * passing in CI, because it depends on what the browser fetched.
 *
 * Why it exists (R9). The next/font fallback is Arial-based, with no `wdth`
 * and no `opsz`. Every width decision in the system is therefore invisible
 * during the swap period, and permanently on a blocked CDN or a locked-down
 * network. The 88/94/100 bands, the compression on the hero, the reading-rung
 * ban on compression: all of it silently collapses to one width, and the page
 * still looks plausible, which is exactly what makes it dangerous.
 *
 * Two things are checked, because "a font loaded" is not the same claim as
 * "the axes work":
 *
 *   1. LOADED  -- document.fonts.check against the family next/font generated.
 *   2. AXES    -- the same string measured at font-stretch 100% and 75%. In
 *                 Bricolage those differ; in any static fallback they are
 *                 identical, so a zero delta means the wdth axis is absent
 *                 even if some font did load.
 *
 * Result lands on <html> as data-font-loaded / data-font-axes so it is
 * inspectable in DevTools, plus one console warning when either fails. It
 * renders nothing and changes no pixel.
 */

const PROBE_TEXT = 'HAMBURGEFONTSIV';
/** Width delta below this (px) means the wdth axis is not rendering. */
const AXIS_EPSILON = 0.5;

function measureAtStretch(fontFamily: string, stretch: string): number {
  const el = document.createElement('span');
  el.textContent = PROBE_TEXT;
  el.setAttribute('aria-hidden', 'true');
  el.style.cssText = [
    'position:absolute',
    'left:-9999px',
    'top:0',
    'white-space:nowrap',
    'font-size:64px',
    'font-weight:400',
    `font-family:${fontFamily}`,
    `font-stretch:${stretch}`,
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

      // 2. Does the wdth axis actually render? A static fallback answers the
      //    same width at both ends, because it has no axis to vary.
      const wide = measureAtStretch(fontFamily, '100%');
      const narrow = measureAtStretch(fontFamily, '75%');
      const axes = Math.abs(wide - narrow) > AXIS_EPSILON;

      root.dataset.fontLoaded = String(loaded);
      root.dataset.fontAxes = String(axes);

      if (!loaded || !axes) {
        console.warn(
          `[type-system] ${primaryFamily} did not fully load: loaded=${loaded}, wdth axis=${axes} ` +
            `(${wide.toFixed(1)}px vs ${narrow.toFixed(1)}px at stretch 100/75). ` +
            `Every width decision in the system is inert in this state. See v3 R9.`,
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
