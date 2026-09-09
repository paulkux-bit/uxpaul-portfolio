import ResolutionsBento, { type ResolutionsManifest } from '../uscg-bard/ResolutionsBento';
import manifest from './filters-manifest.json';

/**
 * Section 05, second module: narrowing what arrived down to the mission. The equipment
 * tree with counts at every level, the analysis layers holding four chosen radars rather
 * than every emitter in the area, and the tailored-to-the-airframe screen.
 *
 * Binds filters-manifest.json to the generic ResolutionsBento adapter, the same one
 * IngestBento and AnalysisBento use.
 *
 * TWO THINGS HERE ARE LOAD-BEARING AND EASY TO UNDO, each with its own $doc key in the
 * manifest. 05-11 and 05-12 MUST STAY PAIRED: a lone standard does not orphan at half
 * width, it stretches to the full 1088 container while SLOT_SIZES.standard still declares
 * 536, so the browser fetches a 536-sized file and paints it at 1088, and at 3:4 it would
 * stand about 1451px tall. And 05-14 is a DESIGN, not a shipped build; "Designed, not
 * built." is the last sentence of its caption tail and belongs there rather than in alt
 * text, following took-3d.jpg's precedent.
 *
 * 05-13-two-shapes is deliberately absent and deliberately not deleted. It is 16:10 where
 * this module is a 3:4 pair plus a feature, so it has no row to join, and its picture
 * argues a claim this section does not make. See $stagedDoc before re-adding it.
 *
 * The cast: resolveJsonModule widens the JSON's string literals to `string`, so a
 * structurally correct manifest cannot assign to the interface's literal unions. Known
 * TS JSON-import limitation, not a data problem. Keep the single assert.
 */
export default function FiltersBento() {
  return <ResolutionsBento manifest={manifest as ResolutionsManifest} />;
}
