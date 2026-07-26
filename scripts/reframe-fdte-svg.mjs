#!/usr/bin/env node
/**
 * reframe-fdte-svg.mjs
 *
 * Re-frames the three FDT-E finding illustrations onto a common canvas so they
 * render at a consistent size under the plain `.oku-figure svg { width: 100% }`
 * rule, with no per-figure height override in CSS.
 *
 * WHY THIS EXISTS
 * ---------------
 * Bard's Oku illustrations were exported with internal padding: the ink fills
 * roughly 65-83% of the viewBox height and 69-87% of its width, at near-uniform
 * landscape aspects, and two of the three share an identical 2750x1536 frame.
 * Because every drawing carries its own margin, they can all be sized by width
 * alone and they land at the same optical weight.
 *
 * The FDT-E art was exported tight-cropped to content: ink fills 100% x 100% of
 * the viewBox, at three unrelated aspects (0.81 portrait, 1.21, 1.09). Sized by
 * width, the portrait one towers over its siblings. That is what the old
 * `height: 200px / 148px` override in globals.css was patching, at render time,
 * in CSS, for a problem that lives in the source art.
 *
 * THE FRAME MATH
 * --------------
 * FW x FH = 2750 x 1536, adopted from Bard's dominant Oku viewBox so the two
 * case studies share one canvas.
 *
 * INK_H = 1235 units, which is 80.4% of frame height. Derivation: the figures
 * render into a 300px column on desktop, so 1235/1536 of that column is 135px
 * of ink. Bard's three figures measure 127-139px of ink height in the same
 * column; 135px is the midpoint. Each drawing is scaled by INK_H / its source
 * height (valid only because the source is tight-cropped, so source height IS
 * ink height), then centered horizontally and vertically in the new frame.
 *
 * KNOWN LIMIT: even normalized, these drawings run narrower than Bard's, about
 * 146px of average ink width against Bard's 231px, because they are compact
 * compositions rather than wide ones. Matching ink AREA is geometrically
 * impossible here (fdte-01 would need to render 1720 units tall inside a
 * 1536-tall frame). If they ever read too small, the lever is a squarer common
 * frame: change FW/FH below and re-run. The two case studies never appear on
 * the same page, so internal consistency across the three matters more than
 * parity with Bard.
 *
 * ALSO HANDLED: Paul's exports come out with `fill="black"`, which renders
 * invisible against the dark canvas. The repo copies use `fill="currentColor"`
 * so they flip with the theme. That swap used to be a manual step nobody had
 * written down; this script does it.
 *
 * USAGE
 * -----
 *   node scripts/reframe-fdte-svg.mjs <src-dir> [out-dir]
 *
 * src-dir  directory holding the RAW tight-cropped exports, named either
 *          `Problem 01.svg` / `Problem 02.svg` / `Problem 03.svg` or
 *          `fdte-01-tempo.svg` etc. Required, so you never re-run this
 *          against already-framed files by accident.
 * out-dir  defaults to components/fdte in this repo.
 *
 * After running, run `npm run regen:fdte` to rebuild the .tsx wrappers.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const FW = 2750;
const FH = 1536;
const INK_H = 1235;

const FIGS = [
  { out: 'fdte-01-tempo', srcNames: ['fdte-01-tempo.svg', 'Problem 01.svg'] },
  { out: 'fdte-02-paralysis', srcNames: ['fdte-02-paralysis.svg', 'Problem 02.svg'] },
  { out: 'fdte-03-blackbox', srcNames: ['fdte-03-blackbox.svg', 'Problem 03.svg'] },
];

const srcDir = process.argv[2];
const outDir = process.argv[3] ?? join(REPO, 'components/fdte');

if (!srcDir) {
  console.error('Usage: node scripts/reframe-fdte-svg.mjs <src-dir> [out-dir]');
  console.error('src-dir must hold the RAW tight-cropped exports, not the framed repo copies.');
  process.exit(1);
}
if (!existsSync(srcDir)) {
  console.error(`Source directory not found: ${srcDir}`);
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });

const rows = [];

for (const fig of FIGS) {
  const found = fig.srcNames.map((n) => join(srcDir, n)).find(existsSync);
  if (!found) {
    console.error(`Missing source for ${fig.out}. Looked for: ${fig.srcNames.join(', ')} in ${srcDir}`);
    process.exit(1);
  }

  const svg = readFileSync(found, 'utf8');
  const vbMatch = svg.match(/viewBox="([^"]+)"/);
  if (!vbMatch) {
    console.error(`No viewBox in ${found}`);
    process.exit(1);
  }
  const [, , w, h] = vbMatch[1].trim().split(/\s+/).map(Number);

  // Guard: refuse to double-frame. Already-framed art has no margin left to add.
  if (w === FW && h === FH) {
    console.error(
      `${found} is already on the ${FW}x${FH} frame. Re-running would scale it a second time.\n` +
        `Point src-dir at the raw tight-cropped exports instead.`
    );
    process.exit(1);
  }

  const s = INK_H / h;
  const tx = +((FW - w * s) / 2).toFixed(2);
  const ty = +((FH - INK_H) / 2).toFixed(2);

  const inner = svg
    .replace(/^[\s\S]*?<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '')
    .trim()
    .replace(/fill="(black|#000|#000000)"/gi, 'fill="currentColor"');

  const wrapped =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${FW} ${FH}">` +
    `<g transform="translate(${tx} ${ty}) scale(${s.toFixed(6)})">${inner}</g>` +
    `</svg>`;

  writeFileSync(join(outDir, `${fig.out}.svg`), wrapped);

  rows.push(
    `${fig.out}: ${w}x${h} (a=${(w / h).toFixed(3)}) -> scale ${s.toFixed(4)}, ` +
      `ink ${Math.round(w * s)}x${INK_H}, tx=${tx} ty=${ty}`
  );
}

console.log(rows.join('\n'));
console.log(`\nWrote ${FIGS.length} files to ${outDir}. Now run: npm run regen:fdte`);
