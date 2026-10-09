// Usage: node scripts/build-ink-masks.mjs [masters-dir]   (run from the repo root)
//
// Encodes the dark-mode ink masks for the section 1 drawings on Line of Sight and
// FDT-E. Run by hand when a master changes; the outputs in public/ are committed,
// and the build never encodes.
//
// WHAT A MASK IS FOR (ruling 2b, 9 Oct 2026). In dark mode those two drawings are
// not shown as images. Each tile shows a block filled with --text-secondary and
// masked by the simplified drawing's alpha, so the ink takes the token's colour and
// follows the theme instead of rendering as inverted pure white (FramedPair's
// `darkMask`, .framed-pair__ink-mask in globals.css). Only the alpha channel of
// these files matters; the colour channels are black and ignored.
//
// THE MASTERS ARE NOT IN THE REPO (ruling B2, 9 Oct 2026; the same call as K1 for
// the fine art). They are the simplified drawings Paul ruled on (draw-c), read from
// docs/previews/narrative/art/polish-final/s1/ by default. Each is listed below
// with its md5, and this script refuses a file that does not match.
//
// SIZES AND FORMATS (ruling A1). A CSS mask cannot go through next/image, so the
// sizes are chosen here: 640 px for 1x screens and 1080 px for 2x and 3x (a 532 px
// tile at 2x needs 1064; a 342 px phone tile at 3x needs 1026). AVIF first, with a
// WebP fallback, chosen by image-set() in the tile's style. The 640 and 1080 are
// also written into components/framed-pair.tsx (INK_MASK_WIDTHS); change both.
import { createHash } from 'node:crypto';
import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const MASTERS = process.argv[2] ?? 'docs/previews/narrative/art/polish-final/s1';
const WIDTHS = [640, 1080];
const ENCODE = {
  avif: { quality: 70, effort: 6 },
  webp: { lossless: true, effort: 6 },
};

const MASKS = [
  {
    master: 'los-s1-dark.png',
    md5: '8ad533369c3b57a9568c0aa1dca2e754',
    size: [2320, 1473],
    out: 'public/case-studies/us-navy-dagr/problem-bunker--mask',
  },
  {
    master: 'fdte-s1-dark.png',
    md5: 'eaa964765eb5ae9ce282c2adbd2f1d6a',
    size: [2320, 1450],
    out: 'public/case-studies/us-navy-fdt-e/problem-desk--mask',
  },
];

for (const m of MASKS) {
  const src = join(MASTERS, m.master);
  const buf = readFileSync(src);
  const md5 = createHash('md5').update(buf).digest('hex');
  const { width, height } = await sharp(buf).metadata();
  if (md5 !== m.md5 || width !== m.size[0] || height !== m.size[1]) {
    console.error(`✗ ${src}: md5 ${md5}, ${width}x${height}; expected ${m.md5}, ${m.size.join('x')}`);
    process.exit(1);
  }
  for (const w of WIDTHS) {
    for (const [format, opts] of Object.entries(ENCODE)) {
      const out = `${m.out}-${w}.${format}`;
      await sharp(buf).resize(w)[format](opts).toFile(out);
      const meta = await sharp(out).metadata();
      console.log(`${out}  ${meta.width}x${meta.height}  ${(statSync(out).size / 1024).toFixed(1)} KB`);
    }
  }
}
