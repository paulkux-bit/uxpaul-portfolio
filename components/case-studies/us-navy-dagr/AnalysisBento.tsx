import ResolutionsBento, { type ResolutionsManifest } from '../uscg-bard/ResolutionsBento';
import manifest from './analysis-manifest.json';

/**
 * Analysis flow, section 04. One radar, one altitude, one shape: the antenna height
 * that arrives with the tap, the altitude formula, five altitudes as five polygons,
 * and the layer menu that sets one of them as the mission altitude.
 *
 * Binds analysis-manifest.json to the generic ResolutionsBento adapter, the same one
 * Nuuly's AppsBento and FDT-E's GateWalkBento use. Named for what it shows, matching
 * that convention rather than BARD's numbered Resolutions themes.
 *
 * THE SCAFFOLD PASS IS OVER. This started as four <BentoItem>s lifted out of the MDX
 * with their strings copied byte for byte, deliberately changing nothing a reader could
 * see, so that the real work would be a data change. It was: the crop pass then swapped
 * all four uncropped 2880x1800 screenshots for six approved crops and rewrote every
 * caption, and this file did not change. That is the scaffold paying for itself.
 *
 * WHY THE GENERIC ADAPTER AND NOT Resolutions01Bento, since the original brief pointed
 * at the BARD file: the legacy path reads a single caption string and splits it at the
 * first ". ", and the generic path reads { lead, tail } and passes both through
 * untouched. Dagr's captions carry full stops inside the tail, so the generic path is
 * the only one that preserves them without a round trip through a split that would
 * re-punctuate them. See the manifest's $adapterDoc.
 *
 * Four things in the manifest that look wrong and are not, each with its own $doc key
 * there: every composition entry says mode "light" on a dark-only product, because
 * "light" is the adapter's word for the base stem with no --dark twin; width, height
 * and ratio are recorded for crop planning and the adapter ignores them, so a later
 * pass must re-read them from disk rather than trust them; the six files are numbered
 * 02, 04, 03, 05, 06, 07 and that IS the document order, because the pairs have to
 * share an aspect per row; and the band entry states its breakout and aspect only in
 * `images`, where the adapter actually reads them, rather than mirroring them into the
 * composition the way FDT-E does.
 *
 * The cast: resolveJsonModule widens the JSON's string literals to `string`, so a
 * structurally correct manifest cannot assign to the interface's literal unions. Known
 * TS JSON-import limitation, not a data problem. Keep the single assert.
 */
export default function AnalysisBento() {
  return <ResolutionsBento manifest={manifest as ResolutionsManifest} />;
}
