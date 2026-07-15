import ResolutionsBento, { type ResolutionsManifest } from './ResolutionsBento';
import manifest from './theme3-grid-manifest.json';

/**
 * Resolutions 03 — "How you count". Binds the Theme-3 manifest to the generic
 * ResolutionsBento adapter. The closer: band opener → matched 2-up (verdicts ‖ cadence)
 * → ribbon climax. Composition defaults dark (the 01-dark / 02-light / 03-dark rhythm);
 * both light + dark crops exist per tile so mode is a one-field flip in the manifest.
 *
 * The cast: `resolveJsonModule` widens the JSON's string literals (`breakout`, `mode`) to
 * `string`, so the structurally-correct manifest can't assign to the interface's literal
 * unions ('band' | 'ribbon', etc.). This is a known TS JSON-import limitation, not a data
 * problem — do NOT "fix" it back into an `as unknown as` double cast. Keep the single assert.
 */
export default function Resolutions03Bento() {
  return <ResolutionsBento manifest={manifest as ResolutionsManifest} />;
}
