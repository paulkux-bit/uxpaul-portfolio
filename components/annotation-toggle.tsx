'use client';

import { useSyncExternalStore } from 'react';
import { useAnnotations } from './popup-context';

// Returns false during SSR and the hydration commit, true thereafter —
// without an effect (so no cascading-render). Lets us avoid painting a
// definite on/off state until the client has hydrated.
function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/**
 * Header control for the PopUp annotation layer.
 *
 * Not mounted in v1 — no page registers PopUps yet. The PopUp-system build
 * derives `hasAnnotations` from a registration count and renders
 * <AnnotationToggle hasAnnotations={count > 0} /> in the header then. This
 * component stays complete and type-honest until that wiring lands.
 *
 * Hydration: `enabled` is `false` on the server and the first client commit
 * (the pre-paint script owns <body> until then). The visible on-state and
 * `aria-pressed` are gated behind `hydrated` so a returning user never sees a
 * misleading off→on flash or a lying pressed state.
 */
export function AnnotationToggle({ hasAnnotations }: { hasAnnotations: boolean }) {
  const { enabled, toggle } = useAnnotations();
  const hydrated = useHydrated();

  if (!hasAnnotations) return null;

  const on = hydrated && enabled;

  return (
    <button
      type="button"
      onClick={toggle}
      data-on={on || undefined}
      aria-pressed={hydrated ? enabled : undefined}
      className="annotation-toggle"
    >
      Annotations
    </button>
  );
}
