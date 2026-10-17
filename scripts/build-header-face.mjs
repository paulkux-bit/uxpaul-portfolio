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
//   2. Tone: Rec. 709 luma on the sRGB values, stretched between LO and HI
//      (raised contrast, ruling 1b after the sign-off sheet, 12 Oct 2026),
//      then raised to gamma 0.88 to lift the shadows so hair, sunglasses and
//      shirt do not merge, mapped from INK to PAPER. Alpha is untouched. No
//      other colour or skin adjustment.
//   3. Lanczos3 to 120px (3x DPR for the 40px circle), WebP q82, alpha q90.
//
// INK AND PAPER ARE THE SITE'S OWN BLACK AND WHITE, the light --text-primary and
// --bg-canvas, READ FROM app/globals.css since step 6 part 5 (ruling K1, 17 Oct
// 2026). They were sRGB literals written into this file until then, and the
// face kept the v2.1 ink and paper after the palette moved. Each is resolved
// the way the browser does: its oklch() formula is evaluated through the
// --chroma-unit and --hue-* primitives (var() substituted, calc() computed),
// then converted OKLab to linear sRGB to 8-bit sRGB. A token that cannot be
// resolved stops the script; nothing is written. Re-run when either moves:
// the diff of public/header-face.webp shows the new face.
import postcss from 'postcss';
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

const MASTER = process.argv[2] ?? 'docs/previews/header/medal/paul-profile-cutout-right.png';
const MASTER_MD5 = '51ed2d54cddbfd45b607ba643c45727c';
const OUT = 'public/header-face.webp';

const CSS_FILE = 'app/globals.css';

/** The light value of every custom property: the @theme primitives and the
 *  :root roles, read before any .dark rule. The first definition wins. */
async function lightTokens() {
  const root = postcss.parse(await readFile(CSS_FILE, 'utf8'));
  const tokens = new Map();
  root.walkDecls(/^--/, (d) => {
    const parent = d.parent;
    const light = (parent.type === 'rule' && parent.selector.trim() === ':root')
      || (parent.type === 'atrule' && parent.name === 'theme');
    if (light && !tokens.has(d.prop)) tokens.set(d.prop, d.value.trim());
  });
  return tokens;
}

/** Substitute var() through the token map, then evaluate calc(): numbers
 *  joined by + - * / only, which is all the palette uses (R4). */
function evaluate(expr, tokens, depth = 0) {
  if (depth > 8) throw new Error(`too deep resolving ${expr}`);
  let s = expr.replace(/var\(\s*(--[\w-]+)\s*\)/g, (_, name) => {
    if (!tokens.has(name)) throw new Error(`${name} is not defined in ${CSS_FILE}`);
    return `(${evaluate(tokens.get(name), tokens, depth + 1)})`;
  });
  s = s.replace(/calc\(/g, '(');
  if (!/^[\d.\s+\-*/()]+$/.test(s)) throw new Error(`cannot evaluate "${expr}"`);
  return Function(`"use strict"; return (${s});`)();
}

/** A light token's oklch() as 8-bit sRGB [r, g, b]. */
function srgbOf(name, tokens) {
  const value = tokens.get(name);
  const m = /^oklch\((.*)\)$/s.exec(value ?? '');
  if (!m) throw new Error(`${name} is not a single OKLCH value in ${CSS_FILE}: ${value}`);
  const parts = [];
  let depth = 0;
  let cur = '';
  for (const ch of m[1]) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (/\s/.test(ch) && depth === 0) { if (cur) parts.push(cur); cur = ''; } else cur += ch;
  }
  if (cur) parts.push(cur);
  if (parts.length !== 3) throw new Error(`${name}: expected L C H, got "${m[1]}"`);
  const [L, C, H] = parts.map((p) => evaluate(p, tokens));
  const a = C * Math.cos((H * Math.PI) / 180);
  const b = C * Math.sin((H * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const mm = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const lin = [
    4.0767416621 * l - 3.3077115913 * mm + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * mm - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * mm + 1.707614701 * s,
  ];
  return lin.map((x) => {
    const c = Math.min(1, Math.max(0, x));
    return Math.round(255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055));
  });
}

let INK;
let PAPER;
try {
  const tokens = await lightTokens();
  INK = srgbOf('--text-primary', tokens);
  PAPER = srgbOf('--bg-canvas', tokens);
} catch (e) {
  console.error(`Could not read the ink and paper from ${CSS_FILE}: ${e.message}. Nothing written.`);
  process.exit(1);
}
// The contrast stretch's two fixed levels, measured once on the pinned master:
// the 840px crop below, opaque pixels only (alpha > 200), Rec. 709 luma, the
// 1st and 99th percentiles (0.0761 and 0.8469 over 364,356 pixels). Fixed
// rather than recomputed per run, so the face only changes when this file
// does. Ruled 12 Oct 2026 (1b), after the sign-off sheet.
const LO = 0.076;
const HI = 0.847;
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
  const luma = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
  const t = Math.min(1, Math.max(0, (luma - LO) / (HI - LO))) ** GAMMA;
  for (let k = 0; k < 3; k++) data[i + k] = Math.round(INK[k] + (PAPER[k] - INK[k]) * t);
}

const webp = await sharp(data, { raw: { width: CROP.size, height: CROP.size, channels: 4 } })
  .resize(SIZE, SIZE, { kernel: 'lanczos3' })
  .webp({ quality: 82, alphaQuality: 90, effort: 6 })
  .toBuffer();
await writeFile(OUT, webp);
console.log(`${OUT}: ${SIZE}x${SIZE}, ${webp.length} bytes, from ${MASTER} (md5 ${md5}); ink ${INK.join(',')}, paper ${PAPER.join(',')}`);
