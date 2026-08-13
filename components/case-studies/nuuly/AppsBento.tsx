import ResolutionsBento, { type ResolutionsManifest } from '../uscg-bard/ResolutionsBento';
import manifest from './apps-manifest.json';

/**
 * Apps gallery — "Seven apps, one screen, one free hand". Binds the Nuuly apps manifest
 * to the generic ResolutionsBento adapter (the same one Bard's Resolutions themes and
 * FDT-E's gate walk use).
 *
 * Composed as ONE GARMENT'S JOURNEY, not as an org chart: the launcher, then arrive
 * (Receiving), come back (Returning), get judged (Inspection), go back out (Packing).
 * That ordering is the module's argument — these are not seven tools, they are seven
 * views of one object's life. See claude/nuuly-arc-locked.md.
 *
 * SHAPE NOTE, do not "tidy" this into a uniform grid: every source is a full-bleed 16:9
 * operator screen with content running edge to edge, so a 16:10 region crop clips real
 * content on all but the launcher. Measured: content spans x 96..3743 of 3840 on most
 * frames. The four app screens are therefore full-frame BANDS at their true 1.778, which
 * loses nothing and still clears the mobile legibility floor (326px container / 1.778 =
 * 183px rendered, above the ~110px texture threshold). Only apps-01-menu crops cleanly to
 * a feature.
 *
 * The cast: `resolveJsonModule` widens the JSON's string literals (`breakout`, `mode`) to
 * `string`, so the structurally-correct manifest can't assign to the interface's literal
 * unions. Known TS JSON-import limitation, not a data problem. Keep the single assert.
 */
export default function AppsBento() {
  return <ResolutionsBento manifest={manifest as ResolutionsManifest} />;
}
