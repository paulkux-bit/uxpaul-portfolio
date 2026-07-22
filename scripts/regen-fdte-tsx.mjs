// Regenerate components/fdte/*.tsx from the crisp *.svg path data.
// Copy-adapted from scripts/regen-oku-tsx.mjs (repo rule: copy before generalizing;
// see the oku-svgr-single-source note for the deferred unification).
// The .svg is the single source of truth; the .tsx is a generated server-renderable
// wrapper (path data stays in the HTML, off the JS bundle) that inlines the SVG via
// dangerouslySetInnerHTML. Rerun whenever a crisp .svg changes:
//
//   node scripts/regen-fdte-tsx.mjs      (or: npm run regen:fdte)
//
// The wrapper <svg> keeps only viewBox (no width/height) so `.oku-figure svg { width:100% }`
// scales it to the wrapper cap; fill="currentColor" in the path data drives the theme flip.

import { readFileSync, writeFileSync } from 'node:fs';

const FIGURES = [
  ['fdte-01-tempo', 'FdteTempo'],
  ['fdte-02-paralysis', 'FdteParalysis'],
  ['fdte-03-blackbox', 'FdteBlackbox'],
];

const dir = new URL('../components/fdte/', import.meta.url);

for (const [base, comp] of FIGURES) {
  const svg = readFileSync(new URL(`${base}.svg`, dir), 'utf8');

  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1];
  if (!viewBox) throw new Error(`${base}.svg: no viewBox attribute found`);

  // Inner markup = everything between the outer <svg …> and </svg>.
  const inner = svg
    .replace(/^[\s\S]*?<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '')
    .trim();
  if (!inner) throw new Error(`${base}.svg: empty inner markup`);

  const tsx = `/* eslint-disable */
// Generated from ${base}.svg by scripts/regen-fdte-tsx.mjs — do not edit by hand; rerun the script if the SVG changes.
import type { SVGProps } from 'react';

const INNER = ${JSON.stringify(inner)};

export default function ${comp}(props: SVGProps<SVGSVGElement>) {
  return <svg viewBox="${viewBox}" {...props} dangerouslySetInnerHTML={{ __html: INNER }} />;
}
`;

  writeFileSync(new URL(`${base}.tsx`, dir), tsx);
  console.log(`regenerated ${base}.tsx (viewBox "${viewBox}", ${inner.length} chars inner)`);
}
