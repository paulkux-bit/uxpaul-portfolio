import ResolutionsBento, { type ResolutionsManifest } from './ResolutionsBento';
import manifest from './theme2-grid-manifest.json';

/**
 * Resolutions 02 — "How you see". Binds the Theme-2 manifest to the generic
 * ResolutionsBento adapter. All-light (the locked 01-dark / 02-light / 03-dark rhythm);
 * the `--dark` twins in the manifest's `working_library_dark` are review-only and never
 * rendered.
 *
 * The cast: `resolveJsonModule` widens the JSON's string literals (`breakout`, `mode`) to
 * `string`, so the structurally-correct manifest can't assign to the interface's literal
 * unions ('band' | 'ribbon', etc.). This is a known TS JSON-import limitation, not a data
 * problem — do NOT "fix" it back into an `as unknown as` double cast. Keep the single assert.
 */
export default function Resolutions02Bento() {
  return <ResolutionsBento manifest={manifest as ResolutionsManifest} />;
}
