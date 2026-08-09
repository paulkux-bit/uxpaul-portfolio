/* FIXTURE — the artwork control for check 4.
 *
 * Its PATH is what matters: `components/oku/…` relative to the fixture root, so
 * it is matched by the real ARTWORK_DIRS entry in scripts/artwork-allowlist.mjs
 * rather than by a second list written for the tests. If that shared list ever
 * loses the oku entry, this fixture goes red — which is the point.
 *
 * A case-study illustration is artwork, not an icon (R3, spec §2.4). */
export const Artwork = () => (
  <svg viewBox="0 0 480 320" aria-hidden>
    <g fill="currentColor">
      <path d="M12 300c40-80 90-140 160-170s150-20 200 40" />
    </g>
  </svg>
);
