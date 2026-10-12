// Usage: npm run build:header-face [-- master.png]   (run from the repo root)
//
// Encodes the header identity mark, the face the wordmark hands off to once a
// page's opening scrolls under the header (components/wordmark-link.tsx). Run
// by hand when the master or the palette changes. The output,
// public/header-face.webp, is committed; the build never encodes.
//
// THE MASTER IS NOT IN THE REPO, the same call as build-client-work.mjs and
// build-fine-art.mjs. It is read from docs/previews/header/medal/ by default:
// Paul's sunglasses profile, cut out and mirrored to face right (ruled 12 Oct
// 2026). It IS md5-pinned, as build-fine-art.mjs pins its paintings, because
// Paul ruled this exact photo: a different file fails loudly rather than
// shipping a different face.
//
// THE RECIPE (ruling 1b, 12 Oct 2026; Cowork's reference, matched within a mean
// of 2.06 levels per channel before this script was written):
//   1. Crop an 840px square at x 80, y 50, padding the right edge with
//      transparency (80 + 840 runs past the 896px master). That moves the head
//      about 6% left, so there is room in front of the face.
//   2. Tone: Rec. 709 luma on the sRGB values, raised to gamma 0.88 to lift the
//      shadows so hair, sunglasses and shirt do not merge, mapped from INK to
//      PAPER. Alpha is untouched. No other colour or skin adjustment.
//   3. Lanczos3 to 120px (3x DPR for the 40px circle), WebP q82, alpha q90.
//
// INK AND PAPER ARE THE SITE'S OWN BLACK AND WHITE, written here as sRGB because
// sharp cannot read a custom property. If the light --text-primary or
// --bg-canvas moves, update the pair and re-run; the diff shows the new face.
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

const MASTER = process.argv[2] ?? 'docs/previews/header/medal/paul-profile-cutout-right.png';
const MASTER_MD5 = '51ed2d54cddbfd45b607ba643c45727c';
const OUT = 'public/header-face.webp';

const INK = [32, 23, 18];      // light --text-primary, oklch(0.215 0.018 55)
const PAPER = [254, 247, 236]; // light --bg-canvas,    oklch(0.978 0.016 76)
const GAMMA = 0.88;
const CROP = { left: 80, top: 50, size: 840 };
const SIZE = 120;

const master = await readFile(MASTER);
const md5 = createHash('md5').update(master).digest('hex');
if (md5 !== MASTER_MD5) {
  console.error(`${MASTER}: md5 ${md5}, expected ${MASTER_MD5}. Not the ruled photo; nothing written.`);
  process.exit(1);
}

const { width } = await sharp(master).metadata();
const padRight = Math.max(0, CROP.left + CROP.size - width);
// extend and extract in two passes: sharp runs extract before extend in one.
const padded = await sharp(master)
  .ensureAlpha()
  .extend({ right: padRight, background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();
const { data } = await sharp(padded)
  .extract({ left: CROP.left, top: CROP.top, width: CROP.size, height: CROP.size })
  .raw()
  .toBuffer({ resolveWithObject: true });

for (let i = 0; i < data.length; i += 4) {
  const t = ((0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255) ** GAMMA;
  for (let k = 0; k < 3; k++) data[i + k] = Math.round(INK[k] + (PAPER[k] - INK[k]) * t);
}

const webp = await sharp(data, { raw: { width: CROP.size, height: CROP.size, channels: 4 } })
  .resize(SIZE, SIZE, { kernel: 'lanczos3' })
  .webp({ quality: 82, alphaQuality: 90, effort: 6 })
  .toBuffer();
await writeFile(OUT, webp);
console.log(`${OUT}: ${SIZE}x${SIZE}, ${webp.length} bytes, from ${MASTER} (md5 ${md5})`);
