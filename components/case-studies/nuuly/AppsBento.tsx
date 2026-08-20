import ResolutionsBento, { type ResolutionsManifest } from '../uscg-bard/ResolutionsBento';
import manifest from './apps-manifest.json';

/**
 * Apps gallery — "Seven apps, one screen, one free hand". Binds the Nuuly apps manifest
 * to the generic ResolutionsBento adapter (the same one Bard's Resolutions themes and
 * FDT-E's gate walk use).
 *
 * Composed as ONE GARMENT'S JOURNEY, not as an org chart: the launcher, then arrive
 * (Receiving), get a recipe (Test Wash), get measured (Measure), come back (Returning),
 * get judged (Inspection), go back out (Packing). That ordering is the module's argument
 * — these are not tools, they are views of one object's life. See claude/nuuly-arc-locked.md.
 *
 * SIX BEATS, NOT SEVEN. Fingerprint left the gallery 19 Aug: a pure scan loop, ~70%
 * empty ground, the least load-bearing beat. It is not cut from the STUDY — a later pass
 * moves it to §7 as the dim/bright pair, where it is the stronger frame because the
 * confirmation disc visibly changes colour with mode. Its padded frame is preserved in
 * the asset commit that precedes this one, not regenerated.
 *
 * The nested array in `composition` is DOCUMENTATION, not mechanism. ResolutionsBento
 * flattens it; bento.tsx's overrideRows re-derives rows by chunking consecutive
 * same-slot items at SLOT_COLS capacity, so `wide, wide` makes one 2-up row whether or
 * not it is bracketed. Author the bracket anyway — it states the intent, and it is how
 * FDT-E's gate walk reads — but do not expect it to enforce.
 *
 * SHAPE NOTE. Every source is a full-bleed 16:9 operator screen. Measured from the DOM,
 * content runs x 34..1872 of 1920 on every app frame and 0..1920 on the launcher, so
 * CROPPING to a slot aspect clips real content. Tiles are therefore whole frames PADDED
 * to 16:10, which costs 10% of height and hides the seam by stretching the frame's own
 * edge row, so object-fit crops nothing. Shipped at 2176x1360: over `wide`'s 1320 floor,
 * exactly on `feature`'s 2176, so slots can change without regenerating.
 *
 * Also measured: half the text in these screens is 16px or 13px at source, which renders
 * at 4.5px or less in a `wide` tile. The tiles are corroboration at thumbnail scale and
 * the captions carry the argument. The launcher takes `feature` because it is the
 * interface to the other apps, not a peer of them. The evidence that proves craft lives
 * in §5 and §6 at band width.
 *
 * The cast: `resolveJsonModule` widens the JSON's string literals (`breakout`, `mode`) to
 * `string`, so the structurally-correct manifest can't assign to the interface's literal
 * unions. Known TS JSON-import limitation, not a data problem. Keep the single assert.
 */
export default function AppsBento() {
  return <ResolutionsBento manifest={manifest as ResolutionsManifest} />;
}
