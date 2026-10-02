'use client';

import { useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';

// Returns false during SSR and the hydration commit, true thereafter — without
// an effect (no cascading render).
function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/**
 * Light/dark theme toggle. Sits in the header next to the primary nav.
 *
 * THE LAMP (interaction spec §2.5). One drawing, two states: on Paper the bulb
 * is lit (blank glass, shading, rays); in Low light it is dimmed (no rays, the
 * glow drawn as line tone). It shows the state you are in, not the action, and
 * the button's label carries the action. Paul ruled l16 on 1 Oct 2026 from
 * docs/previews/human-made-options/lamp/theme-switch-choice.html.
 *
 * It is the one hand-drawn icon in the interface, and R3's only exception:
 * lint:interaction check 4 excuses this file by name in ALLOWLIST.drawnIcons.
 * It is drawn in the cover art's method (heavy outline, fine lines, the screw
 * base seen slightly from above), so it changes when the covers are redrawn.
 *
 * THE MECHANISM IS UNCHANGED FROM THE LUCIDE PAIR IT REPLACES. Nothing here
 * reads the theme to decide what to draw: the whole drawing renders on every
 * request, and the `.dark` class (set pre-paint by next-themes) moves it between
 * states in CSS. So the server and client markup are identical and there is no
 * flash. Only the accessible label depends on the resolved theme, so it is gated
 * behind `hydrated` and reads a neutral action until the client knows the state.
 * Do not turn any part of the drawing into a `resolvedTheme` conditional: it
 * passes tsc, eslint and every lint check, and brings back both the flash and a
 * hydration mismatch.
 *
 * Strokes: the outline takes --icon-stroke from `.icon` (1.95, judged against
 * the wordmark); everything else is the one hairline, `.theme-lamp__fine`.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const hydrated = useHydrated();

  const label = hydrated
    ? `Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} theme`
    : 'Toggle light and dark theme';

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      aria-label={label}
      className="theme-toggle"
    >
      <svg
        className="icon theme-lamp"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <clipPath id="theme-lamp-glass">
            <path d="M9.9 8.7C9.9 10.2 6.8 11.2 6.8 14.6A5.2 5.2 0 0 0 17.2 14.6C17.2 11.2 14.1 10.2 14.1 8.7Z" />
          </clipPath>
        </defs>
        <g className="theme-lamp__fine">
          {/* Low light: the glow, drawn as line tone across the glass. */}
          <g className="theme-lamp__tone" clipPath="url(#theme-lamp-glass)">
            <path d="M-0.4 21 12.6 8M2.2 21 15.2 8M4.8 21 17.8 8M7.4 21 20.4 8M10 21 23 8M12.6 21 25.6 8" />
          </g>
          {/* Paper: form shading on the lower right, light from the upper left. */}
          <g className="theme-lamp__shade" clipPath="url(#theme-lamp-glass)">
            <path d="M16.15 13.49A4.3 4.3 0 0 1 13.11 18.75M15.3 14.6A3.3 3.3 0 0 1 13.13 17.7M14.22 15.2A2.3 2.3 0 0 1 13.15 16.59" />
          </g>
          {/* Filament and its two supports. */}
          <path d="M10.4 14.4 11.1 9.7M13.6 14.4 12.9 9.7M10.4 14.4l.8-1.2.8 1.2.8-1.2.8 1.2" />
          {/* Screw base: the far rim and two threads, as ellipse arcs. */}
          <path d="M9.6 4.8A2.4 .7 0 0 1 14.4 4.8M9.6 6.1A2.4 .7 0 0 0 14.4 6.1M9.6 7.2A2.4 .7 0 0 0 14.4 7.2" />
          {/* Paper: seven rays. Low light: they draw all the way back. */}
          <path className="theme-lamp__ray" pathLength={1} d="M17.98 11.81 20.16 10.8" />
          <path className="theme-lamp__ray" pathLength={1} d="M18.38 16.31 20.69 16.93" />
          <path className="theme-lamp__ray" pathLength={1} d="M15.79 20.01 17.16 21.97" />
          <path className="theme-lamp__ray" pathLength={1} d="M12 21.2 12 23.6" />
          <path className="theme-lamp__ray" pathLength={1} d="M8.21 20.01 6.84 21.97" />
          <path className="theme-lamp__ray" pathLength={1} d="M5.62 16.31 3.31 16.93" />
          <path className="theme-lamp__ray" pathLength={1} d="M6.02 11.81 3.84 10.8" />
        </g>
        {/* The outline: cord, socket, glass. Stroke from .icon. */}
        <path d="M12 .6V4.1M9.6 4.8V8.2A2.4 .7 0 0 0 14.4 8.2V4.8A2.4 .7 0 0 0 9.6 4.8M9.9 8.7C9.9 10.2 6.8 11.2 6.8 14.6A5.2 5.2 0 0 0 17.2 14.6C17.2 11.2 14.1 10.2 14.1 8.7" />
      </svg>
    </button>
  );
}
