// Regenerate components/dagr-beats/*.tsx from the crisp *.svg path data.
// Copy-adapted from scripts/regen-promise-beats-tsx.mjs (repo rule: copy before generalizing;
// see the oku-svgr-single-source note for the deferred unification). Delivery Promise's was
// the copy to take: it is the most recent set through this pipeline, and Dagr's art comes
// off the same tracing pipeline (scripts/normalize-beat-figure.py) that needed the fill
// guard below.
// The .svg is the single source of truth; the .tsx is a generated server-renderable
// wrapper (path data stays in the HTML, off the JS bundle) that inlines the SVG via
// dangerouslySetInnerHTML. Rerun whenever a crisp .svg changes:
//
//   node scripts/regen-dagr-beats-tsx.mjs      (or: npm run regen:dagr-beats)
//
// The wrapper <svg> keeps only viewBox (no width/height) so `.oku-figure svg { width:100% }`
// scales it to the wrapper cap; currentColor INSIDE the inner markup (on the <g>, as
// components/oku/*.svg do) drives the theme flip. It cannot live on the source <svg>
// root: that tag is stripped here and not re-emitted. Guarded below.

import { readFileSync, writeFileSync } from 'node:fs';

const FIGURES = [
  ['typed', 'DagrTyped'],
  ['fixed', 'DagrFixed'],
  ['stale', 'DagrStale'],
];

const dir = new URL('../components/dagr-beats/', import.meta.url);

for (const [base, comp] of FIGURES) {
  const svg = readFileSync(new URL(`${base}.svg`, dir), 'utf8');

  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1];
  if (!viewBox) throw new Error(`${base}.svg: no viewBox attribute found`);

  const inner = svg
    .replace(/^[\s\S]*?<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '')
    .trim();
  if (!inner) throw new Error(`${base}.svg: empty inner markup`);

  // The emitted root below carries viewBox and NOTHING else, so any presentation
  // attribute left on the SOURCE root is silently dropped. That shipped once, on Nuuly:
  // the traced beat art arrived with fill and fill-rule on <svg>, and the .svg rendered
  // correctly standalone while the generated .tsx rendered pure black with its
  // compound-path holes filled solid. Nothing else catches it — no linter reads
  // fill, and no CSS in this repo declares one, so the figure inherits SVG's
  // initial black/nonzero. Assert both are inside the markup that survives.
  // Presence, not value: fill="none" is legitimate for stroke-based art.
  const missing = [
    ['fill', /\sfill="/],
    ['fill-rule', /\sfill-rule="/],
  ].filter(([, re]) => !re.test(inner)).map(([name]) => name);
  if (missing.length) {
    throw new Error(
      `${base}.svg: no ${missing.join(' or ')} in the inner markup. The generated ` +
        `.tsx root emits viewBox only, so anything on the <svg> root is dropped: a ` +
        `missing fill renders the figure black, a missing fill-rule fills its ` +
        `interior counters solid. Put both on the inner <g>, as components/oku/*.svg do.`,
    );
  }

  const tsx = `/* eslint-disable */
// Generated from ${base}.svg by scripts/regen-dagr-beats-tsx.mjs — do not edit by hand; rerun the script if the SVG changes.
import type { SVGProps } from 'react';

const INNER = ${JSON.stringify(inner)};

export default function ${comp}(props: SVGProps<SVGSVGElement>) {
  return <svg viewBox="${viewBox}" {...props} dangerouslySetInnerHTML={{ __html: INNER }} />;
}
`;

  writeFileSync(new URL(`${base}.tsx`, dir), tsx);
  console.log(`regenerated ${base}.tsx (viewBox "${viewBox}", ${inner.length} chars inner)`);
}
