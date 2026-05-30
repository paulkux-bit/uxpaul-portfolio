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
 * Inner container uses the shared `.page-container` axis (--page-max-width +
 * --page-padding-inline, defined in globals.css) so the wordmark aligns with
 * the home page, About page, and case-study article on a single source of
 * truth. The shared axis preserves the prior 1152 / 24-32 convention exactly.
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
      <div className="page-container flex h-14 md:h-16 items-center justify-between">
        <WordmarkLink />
        <div className="flex items-center gap-4 md:gap-6">
          <ClientNav />
          <ThemeToggle />
        </div>
      </div>
    </HeaderElevation>
  );
}
