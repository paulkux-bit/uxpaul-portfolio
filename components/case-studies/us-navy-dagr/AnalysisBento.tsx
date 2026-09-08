import ResolutionsBento, { type ResolutionsManifest } from '../uscg-bard/ResolutionsBento';
import manifest from './analysis-manifest.json';

/**
 * Analysis flow, section 04. One radar, one altitude, one shape: the Line of Sight
 * panel, the band dialog, five altitudes as five polygons, and the primary layer.
 *
 * Binds analysis-manifest.json to the generic ResolutionsBento adapter, the same one
 * Nuuly's AppsBento and FDT-E's GateWalkBento use. Named for what it shows, matching
 * that convention rather than BARD's numbered Resolutions themes.
 *
 * SCAFFOLD, NOT A REDESIGN. This moved four <BentoItem>s out of the MDX and changed
 * nothing a reader can see. The four images are the ones already shipped, uncropped,
 * and every alt, caption and gloss string was copied byte for byte by script rather
 * than retyped. The value of the pass is that later steps become data changes.
 *
 * WHY THE GENERIC ADAPTER AND NOT Resolutions01Bento, since the brief pointed at the
 * BARD file: the legacy path reads a single caption string and splits it at the first
 * ". ", and the generic path reads { lead, tail } and passes both through untouched.
 * Dagr's MDX carried caption and gloss as two props, so the generic path is the only
 * one that preserves the shipped strings without a round trip through a split. See
 * the manifest's $adapterDoc.
 *
 * Three things in the manifest that look wrong and are not, each with its own $doc
 * key there: every composition entry says mode "light" on a dark-only product, because
 * "light" is the adapter's word for the base stem with no --dark twin; width and
 * height are recorded for crop planning and the adapter ignores them, so a later pass
 * must re-read them from disk rather than trust them; and the composition's three rows
 * were verified against the live DOM before the file was written.
 *
 * The cast: resolveJsonModule widens the JSON's string literals to `string`, so a
 * structurally correct manifest cannot assign to the interface's literal unions. Known
 * TS JSON-import limitation, not a data problem. Keep the single assert.
 */
export default function AnalysisBento() {
  return <ResolutionsBento manifest={manifest as ResolutionsManifest} />;
}
