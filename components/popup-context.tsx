'use client';

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from 'react';

const STORAGE_KEY = 'annotations';

type Annotations = {
  /** Whether the annotation layer is globally on. `false` during hydration. */
  enabled: boolean;
  /** Flip the annotation layer on/off. Persists and reflects to <body>. */
  toggle: () => void;
};

const PopUpContext = createContext<Annotations | undefined>(undefined);

// --- External store (localStorage), read via useSyncExternalStore ------------

function read(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'on';
  } catch {
    // Private mode / storage disabled — treat as off.
    return false;
  }
}

const listeners = new Set<() => void>();

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  // Sync across tabs as well as within this one.
  window.addEventListener('storage', onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onChange);
  };
}

function persist(next: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY, next ? 'on' : 'off');
  } catch {
    // Best-effort — persistence is non-critical.
  }
  listeners.forEach((l) => l());
}

// -----------------------------------------------------------------------------

export function PopUpProvider({ children }: { children: React.ReactNode }) {
  // Server (and the hydration commit) snapshot is `false`; the real value
  // resolves on the client after hydration. The pre-paint script in the layout
  // owns the <body> class until then, so there is no flash.
  const enabled = useSyncExternalStore(subscribe, read, () => false);

  // Reflect state to <body>, but skip the first commit (the hydration render,
  // where `enabled` is still the server snapshot) so we never strip the class
  // the pre-paint script already applied.
  const firstCommit = useRef(true);
  useEffect(() => {
    if (firstCommit.current) {
      firstCommit.current = false;
      return;
    }
    document.body.classList.toggle('popup-on', enabled);
  }, [enabled]);

  const toggle = useCallback(() => persist(!read()), []);

  const value = useMemo<Annotations>(() => ({ enabled, toggle }), [enabled, toggle]);

  return <PopUpContext.Provider value={value}>{children}</PopUpContext.Provider>;
}

export function useAnnotations(): Annotations {
  // React 19 `use()` instead of `useContext` — the consumer call is identical
  // in this case; `use` is the forward-looking pattern (also allows conditional
  // calls, which we don't need here but is worth defaulting to).
  const ctx = use(PopUpContext);
  if (ctx === undefined) {
    throw new Error('useAnnotations must be used within a PopUpProvider');
  }
  return ctx;
}
