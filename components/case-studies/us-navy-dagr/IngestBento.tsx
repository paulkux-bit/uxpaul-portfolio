import ResolutionsBento, { type ResolutionsManifest } from '../uscg-bard/ResolutionsBento';
import manifest from './ingest-manifest.json';

/**
 * Section 05, first module: where the threat data comes from. A centre point and a
 * radius drawn on the map, the Order of Battle search that summarises the query before
 * it runs, and the sources tab that names and time-stamps what came back.
 *
 * Binds ingest-manifest.json to the generic ResolutionsBento adapter, the same one
 * AnalysisBento, Nuuly's AppsBento and FDT-E's GateWalkBento use. Named for what it
 * shows, matching that convention rather than BARD's numbered Resolutions themes.
 *
 * WHY THIS SECTION HAS TWO MODULES AND NOT ONE: ingest is a band over a 3:4 pair,
 * filters is a 3:4 pair over a feature, and a single module holding all six tiles would
 * have had to reconcile those two shapes in one composition array. Splitting keeps each
 * row's aspect decision local, and it lets the section's own prose sit between the two
 * evidence beats, which is the shape BARD's "The form bends" section and Dagr's own
 * expiry section already use. See the manifest's $twoModulesDoc.
 *
 * The cast: resolveJsonModule widens the JSON's string literals to `string`, so a
 * structurally correct manifest cannot assign to the interface's literal unions. Known
 * TS JSON-import limitation, not a data problem. Keep the single assert.
 */
export default function IngestBento() {
  return <ResolutionsBento manifest={manifest as ResolutionsManifest} />;
}
