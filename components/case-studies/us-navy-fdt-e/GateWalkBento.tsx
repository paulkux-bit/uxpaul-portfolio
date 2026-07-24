import ResolutionsBento, { type ResolutionsManifest } from '../uscg-bard/ResolutionsBento';
import manifest from './gate-walk-manifest.json';

/**
 * Gate walk — "How the gate works". Binds the FDT-E gate-walk manifest to the generic
 * ResolutionsBento adapter (the same one Bard's Resolutions themes use). One anomaly's
 * path through the verification gate: establish band -> anomaly feature -> verification
 * band -> three discipline compacts -> chat/elevate standards. All-light (fixed-design
 * screens; no dark twins).
 *
 * The cast: `resolveJsonModule` widens the JSON's string literals (`breakout`, `mode`) to
 * `string`, so the structurally-correct manifest can't assign to the interface's literal
 * unions ('band' | 'ribbon', etc.). Known TS JSON-import limitation, not a data problem —
 * do NOT "fix" it back into an `as unknown as` double cast. Keep the single assert.
 */
export default function GateWalkBento() {
  return <ResolutionsBento manifest={manifest as ResolutionsManifest} />;
}
