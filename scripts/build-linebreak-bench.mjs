/**
 * Builds docs/previews/commissioner-judgment-bench.html — the eye-call companion
 * to docs/commissioner-linebreak-measurement.md.
 *
 * Same shape as scripts/commissioner-bench-source.html -> docs/previews/: the
 * page is authored as HTML and this script only inlines the two woff2 binaries
 * as base64, so the output is self-contained and opens on any device with no
 * server and no network. It lives in docs/ rather than public/ for the reason
 * docs/previews/README.md gives — public/ has no route guard.
 *
 * The binaries are NOT committed; the generated page is, because it is stable
 * and self-contained. To regenerate:
 *
 *   npm i -D @fontsource-variable/bricolage-grotesque @fontsource-variable/commissioner
 *   node scripts/build-linebreak-bench.mjs
 *
 * Override either path with BRICOLAGE_WOFF2 / COMMISSIONER_WOFF2.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const FS_DIR = 'node_modules/@fontsource-variable';
const SOURCE = 'scripts/commissioner-judgment-bench-source.html';
const OUT = 'docs/previews/commissioner-judgment-bench.html';

const paths = {
  __BRICOLAGE_WOFF2_BASE64__:
    process.env.BRICOLAGE_WOFF2 ??
    `${FS_DIR}/bricolage-grotesque/files/bricolage-grotesque-latin-standard-normal.woff2`,
  __COMMISSIONER_WOFF2_BASE64__:
    process.env.COMMISSIONER_WOFF2 ??
    `${FS_DIR}/commissioner/files/commissioner-latin-full-normal.woff2`,
};

let html = readFileSync(SOURCE, 'utf8');

for (const [token, path] of Object.entries(paths)) {
  let b64;
  try {
    b64 = readFileSync(path).toString('base64');
  } catch {
    console.error(
      `Missing font file: ${path}\n` +
        '  npm i -D @fontsource-variable/bricolage-grotesque @fontsource-variable/commissioner'
    );
    process.exit(1);
  }
  if (!html.includes(token)) {
    console.error(`Source is missing the ${token} placeholder — did the template change?`);
    process.exit(1);
  }
  html = html.split(token).join(b64);
}

mkdirSync('docs/previews', { recursive: true });
writeFileSync(OUT, html);
console.log(`wrote ${OUT}  ${(html.length / 1024).toFixed(0)} KB`);
