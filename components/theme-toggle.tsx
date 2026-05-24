'use client';

import { useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';

// Returns false during SSR and the hydration commit, true thereafter — without
// an effect (no cascading render). Mirrors the helper in annotation-toggle.tsx;
// copied rather than shared (copy before generalizing).
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
 * Icon switching is CSS-driven off the `.dark` class (set pre-paint by
 * next-themes), so the correct glyph paints with no flash and the server/client
 * markup is identical (both glyphs always rendered) — no hydration mismatch.
 * Only the accessible label depends on the resolved theme, so it's gated behind
 * `hydrated` and reads a neutral action until the client knows the real state.
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
      {/* Moon — shown in light mode (the action is "go dark"). */}
      <svg
        className="icon-moon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>
      {/* Sun — shown in dark mode (the action is "go light"). */}
      <svg
        className="icon-sun"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}
