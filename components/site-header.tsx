import { HeaderElevation } from './header-elevation';
import { ClientNav } from './client-nav';
import { WordmarkLink } from './wordmark-link';

/**
 * Global site header. Server-rendered shell; only the genuinely interactive
 * bits are client islands (elevation, wordmark active state, nav active state).
 * Persists across route changes because the App Router keeps the layout mounted.
 *
 * Inner container matches the page content column (max-w-3xl px-6) so the
 * wordmark aligns with page content and never reaches the viewport edge.
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
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6 md:h-16">
        <WordmarkLink />
        <ClientNav />
      </div>
    </HeaderElevation>
  );
}
