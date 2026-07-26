// Palette quantization (8-bit colormap PNG) applies to flat UI captures and flat
// vector basemaps only. Any capture containing continuous tone (satellite or
// hillshaded basemaps, photography, gradients, blur) stays 24-bit truecolor.
// Check with `file -b` before and after: "8-bit colormap" on a continuous-tone
// source is the failure signature.
//
// So quantization is opt-in, via --palette. sharp's .png({ quality }) implies
// palette: true, which is why omitting quality is what keeps output truecolor.
//
// Usage: node scripts/optimize-images.mjs <input-dir> <output-dir> [--palette]
//   node scripts/optimize-images.mjs public/case-studies/uscg-bard/_raw public/case-studies/uscg-bard --palette
// Requires: npm i -D sharp
import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';

const argv = process.argv.slice(2);
const PALETTE = argv.includes('--palette');
const [inDir, outDir] = argv.filter((a) => !a.startsWith('--'));
if (!inDir || !outDir) {
  console.error('Usage: node scripts/optimize-images.mjs <input-dir> <output-dir> [--palette]');
  process.exit(1);
}

const MAX_WIDTH = 2400;
const isImage = (f) => /\.(png|jpe?g)$/i.test(f);

await mkdir(outDir, { recursive: true });
const files = (await readdir(inDir)).filter(isImage);
console.log(PALETTE ? 'Mode: 8-bit palette' : 'Mode: 24-bit truecolor (pass --palette to quantize)');

for (const file of files) {
  const src = join(inDir, file);
  const out = join(outDir, `${basename(file, extname(file))}.png`);
  const img = sharp(src).rotate();
  const { width } = await img.metadata();
  if (width && width > MAX_WIDTH) img.resize({ width: MAX_WIDTH });
  await img
    .png(PALETTE ? { quality: 90, compressionLevel: 9, effort: 8 } : { compressionLevel: 9 })
    .toFile(out);
  console.log(`✓ ${file} → ${out}`);
}

console.log(`\nDone. ${files.length} files optimized.`);
