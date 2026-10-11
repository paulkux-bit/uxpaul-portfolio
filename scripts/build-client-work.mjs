// Usage: npm run build:client-work [-- masters-dir]   (run from the repo root)
//
// Encodes the client work dialog's delivery files from the masters, and writes
// app/data/client-work-images.json, the manifest the dialog reads for srcSet,
// width and height. Run by hand when a master changes. The outputs in
// public/client-work/ and the manifest are committed; the build never encodes.
// __tests__/client-work-images.test.mjs checks the committed files against the
// manifest and the manifest against app/data/template-b.ts.
//
// THE MASTERS ARE NOT IN THE REPO, the same call as the fine art masters
// (scripts/build-fine-art.mjs). They are read from
// docs/previews/template-b/_scratch/crops-v5/ by default: <id>.png, or <id>.webp
// where no PNG exists, unless MASTER_FILES below names another file. sharp reads
// the format from the data, so a master may be JPEG. A swap is a MASTER_FILES
// entry and one re-run. The manifest records each master's md5 and size, so the
// swap shows up in the diff and nothing else needs editing.
//
// NO MD5 PINNING, unlike build-fine-art.mjs. Pinning there proves the right
// painting was read. Here the masters are expected to change, and pinning would
// turn every swap into a hand edit. The manifest is the record instead.
//
// NEVER UPSCALES. Each rung is capped at the master's own width, so a rung wider
// than the master is not emitted, and the srcSet descriptor states the real
// width. The 144 rung serves the thumbnails, 588 is the frame at 1x (588x490 at
// 1440 and 1280), and 1176 is 2x.
//
// WHY NOT next/image: the same reason as the fine art and the card covers. The
// served bytes would be decided at request time, so they could not be measured
// before a deploy.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import sharp from 'sharp';
import { templateB } from '../app/data/template-b.ts';

const MASTERS = process.argv[2] ?? 'docs/previews/template-b/_scratch/crops-v5';
// Masters whose file is not <id>.png. Every earlier master stays on disk,
// untouched, under its own name; a plain re-run must not fall back to one,
// which is why this is a map in the script and not a renamed file. An upscale
// folder passed as the argument follows the same names.
//
// 11 Oct 2026: Paul's 2x upscales replaced the masters below 2x for Red Cross,
// the BBC slides and khov-1. The two BBC slides moved from whole-slide cuts to
// zoomed crops of the word cloud and the pyramid, and the pillars alt text
// changed with them. khov-1 is 639 wide, so its largest file is 639 wide.
// khov-2-up.png and bbc-3-up.jpg were held back: the upscaler rewrote their
// small text (Quick Move-In read Ouick Move-In, West Sussex read West Dotone).
// khov-2 stays on v3 (1130x942, which replaced v2 for a strip of the page
// below the Done/Clear bar), and bbc-3 on its original.
const MASTER_FILES = {
  'arc-1': 'arc-1-up.jpg',
  'arc-2': 'arc-2-up.jpg',
  'arc-3': 'arc-3-up.jpg',
  'bbc-confusing': 'bbc-confusing-zoom-up.jpg',
  'bbc-pillars': 'bbc-pillars-zoom-up.jpg',
  'khov-1': 'khov-1-up.jpg',
  'khov-2': 'khov-2-v3.png',
};
const RUNGS = [144, 588, 1176];
const TARGET_2X = { width: 1176, height: 980 }; // the 588x490 frame at 2x
// The fine art tiers to start. These are UI captures with small type, not
// paintings, so the bytes and the small type at 2x are checked before a tier is
// kept; raise these if text smears.
const ENCODE = {
  avif: { quality: 68, effort: 6 },
  webp: { quality: 88, effort: 6 },
};
const MANIFEST = 'app/data/client-work-images.json';

const images = {};
const written = new Set();
const rows = [];
let failed = false;

for (const piece of templateB) {
  for (const image of piece.images) {
    const id = basename(image.src);
    const candidates = MASTER_FILES[id] ? [MASTER_FILES[id]] : ['png', 'webp'].map((ext) => `${id}.${ext}`);
    const file = candidates.find((f) => existsSync(join(MASTERS, f)));
    if (!file) {
      console.error(`✗ ${id}: none of ${candidates.join(', ')} in ${MASTERS}`);
      failed = true;
      continue;
    }
    const buf = readFileSync(join(MASTERS, file));
    const meta = await sharp(buf).metadata();
    const widths = [...new Set(RUNGS.map((r) => Math.min(r, meta.width)))];
    const files = [];
    mkdirSync(join('public', dirname(image.src)), { recursive: true });
    for (const width of widths) {
      let height;
      for (const [format, opts] of Object.entries(ENCODE)) {
        const out = join('public', `${image.src}-${width}.${format}`);
        const info = await sharp(buf)
          .resize({ width, withoutEnlargement: true, kernel: 'lanczos3' })
          .toColourspace('srgb')
          [format](opts)
          .toFile(out);
        height = info.height;
        written.add(out);
        rows.push({ out, width: info.width, height: info.height, kb: info.size / 1024 });
      }
      files.push({ width, height });
    }
    // Density against the 2x frame. A whole image is contained, so its height
    // binds; a covering image fills the frame, so the narrower axis binds.
    const density = image.fit === 'whole'
      ? meta.height / (TARGET_2X.height / 2)
      : Math.min(meta.width / (TARGET_2X.width / 2), meta.height / (TARGET_2X.height / 2));
    images[image.src] = {
      master: { file, md5: createHash('md5').update(buf).digest('hex'), width: meta.width, height: meta.height },
      density: Math.round(density * 100) / 100,
      files,
    };
  }
}
if (failed) process.exit(1);

// A swap can change the rungs (an 840 master becoming 1176), so anything left
// in a piece's folder that this run did not write is stale and goes.
for (const piece of templateB) {
  const dir = join('public', 'client-work', piece.slug);
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (!written.has(path)) {
      rmSync(path);
      console.log(`removed stale ${path}`);
    }
  }
}

writeFileSync(
  MANIFEST,
  `${JSON.stringify({ note: 'Generated by scripts/build-client-work.mjs. Do not edit by hand.', images }, null, 2)}\n`,
);

for (const { out, width, height, kb } of rows) {
  console.log(`${out}  ${width}x${height}  ${kb.toFixed(1)} KB`);
}
const below = Object.entries(images).filter(([, v]) => v.density < 2);
console.log(`\n${MANIFEST} written: ${Object.keys(images).length} images, ${rows.length} files.`);
console.log(`Below 2x (${below.length}), candidates for the upscale pass:`);
for (const [src, v] of below) {
  console.log(`  ${basename(src)}  ${v.master.width}x${v.master.height}  ${v.density}x`);
}
