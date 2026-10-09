// Usage: node scripts/build-fine-art.mjs [masters-dir]   (run from the repo root)
//
// Encodes the fine art moments' delivery files from the masters. Run by hand when
// a work is added or a master changes; the outputs in public/fine-art/ are
// committed, and the build never encodes. scripts/lint-works.mjs is what checks
// the committed files against app/data/works.json.
//
// THE MASTERS ARE NOT IN THE REPO, on purpose (ruling K1, 8 Oct 2026). They are
// museum downloads of 750 KB to 1 MB each, read from docs/previews/narrative/art/
// fine-art/ by default, the same way build-commissioner-font.sh reads its source
// from $HOME. Each record carries its master's md5 and pixel size, and this script
// refuses a file that does not match, so a rerun proves it has the right painting
// rather than assuming it.
//
// WHY NOT next/image. The served bytes would be decided at request time, so they
// could not be measured or checked before a deploy, and the masters would have to
// be committed into public/ to be optimised at all. Same call, same reason, as the
// card covers (components/case-study-card.tsx).
//
// Quality was ruled from a measured pair of tiers (G1, 8 Oct 2026): AVIF q68 and
// WebP q88 put every 1x file at 55 KB or less against a 150 KB budget. These are
// paintings, and the budget allowed the higher tier.
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const MASTERS = process.argv[2] ?? 'docs/previews/narrative/art/fine-art';
const ENCODE = {
  avif: { quality: 68, effort: 6 },
  webp: { quality: 88, effort: 6 },
};

const { works } = JSON.parse(readFileSync('app/data/works.json', 'utf8'));
mkdirSync('public/fine-art', { recursive: true });

let failed = false;
const rows = [];
for (const work of works) {
  const src = join(MASTERS, work.master.file);
  const buf = readFileSync(src);
  const md5 = createHash('md5').update(buf).digest('hex');
  const meta = await sharp(buf).metadata();
  if (md5 !== work.master.md5 || meta.width !== work.master.width || meta.height !== work.master.height) {
    console.error(`✗ ${src}: md5 ${md5}, ${meta.width}x${meta.height}; the record expects ${work.master.md5}, ${work.master.width}x${work.master.height}`);
    failed = true;
    continue;
  }
  for (const [format, opts] of Object.entries(ENCODE)) {
    work.files[format].forEach((file, i) => {
      rows.push({ work, format, opts, file, scale: i + 1 });
    });
  }
}
if (failed) process.exit(1);

for (const { work, format, opts, file, scale } of rows) {
  const width = work.display.width * scale;
  const height = work.display.height * scale;
  const out = join('public', file);
  await sharp(join(MASTERS, work.master.file))
    .resize(width, height, { fit: 'fill', kernel: 'lanczos3' })
    .toColourspace('srgb')
    [format](opts)
    .toFile(out);
  console.log(`${out}  ${width}x${height}  ${(statSync(out).size / 1024).toFixed(1)} KB`);
}
