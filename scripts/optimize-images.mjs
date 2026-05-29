// Usage: node scripts/optimize-images.mjs public/case-studies/uscg-bard/_raw public/case-studies/uscg-bard
// Requires: npm i -D sharp
import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';

const [, , inDir, outDir] = process.argv;
if (!inDir || !outDir) {
  console.error('Usage: node scripts/optimize-images.mjs <input-dir> <output-dir>');
  process.exit(1);
}

const MAX_WIDTH = 2400;
const PNG_QUALITY = 90;
const isImage = (f) => /\.(png|jpe?g)$/i.test(f);

await mkdir(outDir, { recursive: true });
const files = (await readdir(inDir)).filter(isImage);

for (const file of files) {
  const src = join(inDir, file);
  const out = join(outDir, `${basename(file, extname(file))}.png`);
  const img = sharp(src).rotate();
  const { width } = await img.metadata();
  if (width && width > MAX_WIDTH) img.resize({ width: MAX_WIDTH });
  await img.png({ quality: PNG_QUALITY, compressionLevel: 9, effort: 8 }).toFile(out);
  console.log(`✓ ${file} → ${out}`);
}

console.log(`\nDone. ${files.length} files optimized.`);
