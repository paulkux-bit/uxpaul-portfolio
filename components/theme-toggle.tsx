'use client';

import { useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';
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
 * Icon switching is CSS-driven off the `.dark` class (set pre-paint by
 * next-themes), so the correct glyph paints with no flash and the server/client
 * markup is identical (both glyphs always rendered) — no hydration mismatch.
 * Only the accessible label depends on the resolved theme, so it's gated behind
 * `hydrated` and reads a neutral action until the client knows the real state.
 *
 * I5 CONVERTED THE GEOMETRY, NOT THE MECHANISM. The glyphs are Lucide now (R3),
 * but BOTH are still rendered on every request and CSS still picks one. The
 * obvious Lucide conversion is `resolvedTheme === 'dark' ? <Sun/> : <Moon/>`:
 * shorter, passes checks 4, 5 and 6, passes tsc and eslint, and reintroduces
 * both the flash and a hydration mismatch, because the server has no resolved
 * theme to render from. Do not "simplify" this into a conditional.
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
      <Moon className="icon icon-moon" aria-hidden="true" focusable="false" />
      {/* Sun — shown in dark mode (the action is "go light"). BOTH render,
          always; `.dark` decides which one is displayed. */}
      <Sun className="icon icon-sun" aria-hidden="true" focusable="false" />
    </button>
  );
}
