'use client';

import { useAnnotations } from './popup-context';

interface PopUpToggleProps {
  className?: string;
}

export function PopUpToggle({ className }: PopUpToggleProps) {
  const { enabled, toggle } = useAnnotations();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? 'Turn annotations off' : 'Turn annotations on'}
      className={['popup-toggle', enabled ? 'is-on' : 'is-off', className]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="popup-toggle__dot" aria-hidden />
      <span className="popup-toggle__label">
        Annotations <span className="popup-toggle__state">{enabled ? 'on' : 'off'}</span>
      </span>
    </button>
  );
}
