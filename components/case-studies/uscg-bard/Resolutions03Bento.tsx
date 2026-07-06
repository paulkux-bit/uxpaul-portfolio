import ResolutionsBento, { type ResolutionsManifest } from './ResolutionsBento';
import manifest from './theme3-grid-manifest.json';

/**
 * Resolutions 03 — "How you count". Binds the Theme-3 manifest to the generic
 * ResolutionsBento adapter. The closer: band opener → matched 2-up (verdicts ‖ cadence)
 * → ribbon climax. Composition defaults dark (the 01-dark / 02-light / 03-dark rhythm);
 * both light + dark crops exist per tile so mode is a one-field flip in the manifest.
 * The cast bridges the JSON import to the adapter's type.
 */
export default function Resolutions03Bento() {
  return <ResolutionsBento manifest={manifest as unknown as ResolutionsManifest} />;
}
