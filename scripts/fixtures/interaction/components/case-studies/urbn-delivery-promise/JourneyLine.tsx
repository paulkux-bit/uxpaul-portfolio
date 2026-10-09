/* FIXTURE: the artwork control for check 4.
 *
 * Its PATH is what matters: `components/case-studies/urbn-delivery-promise/
 * JourneyLine.tsx` relative to the fixture root, so it is matched by the real
 * ARTWORK_FILES entry in scripts/artwork-allowlist.mjs rather than by a second
 * list written for the tests. If that shared list ever loses the JourneyLine
 * entry, this fixture goes red, which is the point.
 *
 * It sat at `components/oku/artwork.tsx` and leaned on an ARTWORK_DIRS entry until
 * the fine art build (8 Oct 2026) retired every illustration directory and left
 * that list empty (ruling J1). Drawn data is artwork, not an icon (R3, spec §2.4). */
export const Artwork = () => (
  <svg viewBox="0 0 480 320" aria-hidden>
    <g fill="currentColor">
      <path d="M12 300c40-80 90-140 160-170s150-20 200 40" />
    </g>
  </svg>
);
