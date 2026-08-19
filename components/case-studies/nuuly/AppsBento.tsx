import ResolutionsBento, { type ResolutionsManifest } from '../uscg-bard/ResolutionsBento';
import manifest from './apps-manifest.json';

/**
 * Apps gallery — "Seven apps, one screen, one free hand". Binds the Nuuly apps manifest
 * to the generic ResolutionsBento adapter (the same one Bard's Resolutions themes and
 * FDT-E's gate walk use).
 *
 * Composed as ONE GARMENT'S JOURNEY, not as an org chart: the launcher, then arrive
 * (Receiving), get a name (Fingerprint), get a recipe (Test Wash), get measured
 * (Measure), come back (Returning), get judged (Inspection), go back out (Packing).
 * That ordering is the module's argument — these are not seven tools, they are seven
 * views of one object's life. See claude/nuuly-arc-locked.md.
 *
 * The nested array in `composition` is DOCUMENTATION, not mechanism. ResolutionsBento
 * flattens it; bento.tsx's overrideRows re-derives rows by chunking consecutive
 * same-slot items at SLOT_COLS capacity, so three adjacent `compact` entries make one
 * 3-up row whether or not they are bracketed. Author the bracket anyway — it states the
 * intent, and it is how FDT-E's gate walk reads — but do not expect it to enforce.
 *
 * SHAPE NOTE, do not "tidy" this into a uniform grid. It is a claim about FULL-FRAME
 * crops only: every source is a full-bleed 16:9 operator screen with content running
 * edge to edge (measured: content spans x 96..3743 of 3840 on most frames), so a 16:10
 * crop of a WHOLE frame clips real content on all but the launcher. The four app screens
 * are therefore full-frame BANDS at their true 1.778, which loses nothing and still
 * clears the mobile legibility floor (326px container / 1.778 = 183px rendered, above
 * the ~110px texture threshold). Only apps-01-menu crops cleanly to a feature.
 *
 * REGION crops are the counter-example, and they clear the slot floors comfortably: the
 * three `compact` tiles are cut from .sku-photo-wrap, the wash-cycle field and the
 * Measure keypad at 1440, 1296 and 960 square, against a 704 floor (2 x 352). Below
 * 1024px a square row is repeat(2, 1fr), so the third tile takes a half-width orphan
 * row — the documented 2+1 wrap, not a defect.
 *
 * The cast: `resolveJsonModule` widens the JSON's string literals (`breakout`, `mode`) to
 * `string`, so the structurally-correct manifest can't assign to the interface's literal
 * unions. Known TS JSON-import limitation, not a data problem. Keep the single assert.
 */
export default function AppsBento() {
  return <ResolutionsBento manifest={manifest as ResolutionsManifest} />;
}
