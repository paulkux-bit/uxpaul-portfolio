import { HeaderElevation } from './header-elevation';
import { ClientNav } from './client-nav';
import { WordmarkLink } from './wordmark-link';
import { ThemeToggle } from './theme-toggle';

/**
 * Global site header. Server-rendered shell; only the genuinely interactive
 * bits are client islands (elevation, wordmark active state, nav active state,
 * theme toggle). Persists across route changes because the App Router keeps the
 * layout mounted.
 *
 * Inner container matches the home content shell (max-w-6xl px-6 md:px-8) so the
 * wordmark aligns with page content and never reaches the viewport edge. (The
 * About page uses a narrower reading column by design; header chrome holds the
 * wider global max.)
 *
 * The annotation toggle is intentionally absent in v1 (no page has PopUps yet);
 * the PopUp-system build mounts <AnnotationToggle> here. See annotation-toggle.tsx.
 */
export function SiteHeader() {
  return (
    <HeaderElevation>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6 md:h-16 md:px-8">
        <WordmarkLink />
        <div className="flex items-center gap-4 md:gap-6">
          <ClientNav />
          <ThemeToggle />
        </div>
      </div>
    </HeaderElevation>
  );
}
