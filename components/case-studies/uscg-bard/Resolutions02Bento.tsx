import ResolutionsBento, { type ResolutionsManifest } from './ResolutionsBento';
import manifest from './theme2-grid-manifest.json';

/**
 * Resolutions 02 — "How you see". Binds the Theme-2 manifest to the generic
 * ResolutionsBento adapter. All-light (the locked 01-dark / 02-light / 03-dark rhythm);
 * the `--dark` twins in the manifest's `working_library_dark` are review-only and never
 * rendered. The cast bridges the JSON import to the adapter's type (extra manifest fields
 * like `working_library_dark` / `mode_policy` are ignored).
 */
export default function Resolutions02Bento() {
  return <ResolutionsBento manifest={manifest as unknown as ResolutionsManifest} />;
}
