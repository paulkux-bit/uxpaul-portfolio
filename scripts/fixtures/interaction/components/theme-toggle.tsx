/* FIXTURE: the drawn-icon control for check 4.
 *
 * Its PATH is what matters: `components/theme-toggle.tsx` relative to the
 * fixture root, so it is matched by the real ALLOWLIST.drawnIcons entry in
 * scripts/lint-interaction.mjs rather than by a list written for the tests. If
 * that entry is renamed, widened or dropped, this fixture goes red.
 *
 * The same drawing in any other file is still a check 4 failure: R3 has one
 * exception, not a category (spec §2.5). */
export const Lamp = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
    <path d="M12 .6V4.1M9.9 8.7C9.9 10.2 6.8 11.2 6.8 14.6A5.2 5.2 0 0 0 17.2 14.6C17.2 11.2 14.1 10.2 14.1 8.7" />
  </svg>
);
