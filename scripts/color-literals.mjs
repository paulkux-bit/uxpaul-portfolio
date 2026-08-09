// Colour-literal scanner. Basis of lint:color check 7, and reusable standalone:
//   node scripts/color-literals.mjs [root]
//
// Grew out of the K4 census. Its value is the NEGATIVE cases, not the positive
// ones: the first run of the K4 census reported 67 literals when the true figure
// was 21, and all 46 phantoms came from four classes that look like colours and
// are not. Each is now a named exclusion with a fixture, because each is a
// predictable regression for anyone rewriting this.
//
// DESIGN RULE, learned the expensive way (§7). Every candidate is REPORTED,
// either as accepted or as excluded-with-a-reason. Nothing is silently dropped.
// A `continue` would make "correctly excluded" and "file never opened"
// indistinguishable in the output, and that is exactly what hid the .mdx gap in
// the K4 census: an .mdx fixture holding only negative controls vanished from
// the report, and a vanished file reads as a passing one.
import { readdir, readFile } from 'node:fs/promises';
import { join, extname, relative } from 'node:path';

const SKIP_DIRS = new Set([
  'node_modules', '.next', '.git', '_to_delete', 'dist', 'out', 'coverage', '.vercel',
]);
const EXTS = new Set(['.css', '.ts', '.tsx', '.mdx', '.mjs', '.js', '.jsx', '.svg']);
const STYLE_EXTS = new Set(['.css', '.svg']);

// The CSS named colours. `transparent` and `currentColor` are deliberately
// absent: they are keywords, never palette values, and are always legitimate.
export const NAMED = `aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond
blue blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson
cyan darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen
darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey
darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite
forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray green greenyellow grey honeydew hotpink
indianred indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral
lightcyan lightgoldenrodyellow lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen
lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime limegreen linen magenta
maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue
mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin
navajowhite navy oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise
palevioletred papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red rosybrown
royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue slategray
slategrey snow springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke
yellow yellowgreen`.trim().split(/\s+/);

const TW_HUES = 'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose';
const TW_PROPS = 'text|bg|border|from|via|to|ring|outline|decoration|shadow|fill|stroke|divide|accent|caret|placeholder';

// Loose CANDIDATE patterns. Deliberately over-match; the classifier below
// decides. Filtering in the regex is what made exclusions invisible before.
const CANDIDATES = [
  ['hex', /#[0-9a-fA-F]{1,8}\b/g],
  ['func', /\b(?:rgba?|hsla?|oklch|oklab)\b\s*\(?/gi],
  ['tailwind-palette', new RegExp(`\\b(?:${TW_PROPS})-(?:${TW_HUES})-(?:50|[1-9]00|950)\\b`, 'g')],
  ['named', new RegExp(`\\b(?:${NAMED.join('|')})\\b`, 'gi')],
];

/** Blank comments, preserving every byte offset so positions stay true. */
function blankComments(src) {
  const blank = (s) => s.replace(/[^\n]/g, ' ');
  return src
    .replace(/\/\*[\s\S]*?\*\//g, blank)
    .replace(/(^|[^:/\w])\/\/[^\n]*/g, (m, p) => p + blank(m.slice(p.length)));
}

// `](` is the markdown-link case, found by the fixture: [top](#abc) was being
// accepted as the colour #abc. The .mdx channel keeps producing the misses.
const FRAGMENT_CTX = /(?:href\s*=\s*["']?|url\(\s*|xlink:href\s*=\s*["']?|\]\(\s*)$/i;

/**
 * Classify one candidate. Returns null when it is a real literal, or a string
 * naming the exclusion class. Every class here corresponds to a fixture.
 */
function classify({ form, text, index, src, raw, isStyle }) {
  // 1. inside a comment — documentation, not a value
  if (raw.slice(index, index + text.length) !== src.slice(index, index + text.length)) return 'comment';

  const before = src.slice(Math.max(0, index - 24), index);
  const after = src.slice(index + text.length, index + text.length + 2);

  if (form === 'hex') {
    // 2. a fragment reference is not a colour: href="#abc", url(#grad)
    if (FRAGMENT_CTX.test(before)) return 'fragment-ref';
    // 3. only 3/4/6/8 digits are valid hex colours
    const digits = text.length - 1;
    if (![3, 4, 6, 8].includes(digits)) return 'not-a-hex-length';
    return null;
  }

  if (form === 'func') {
    // 4. must be a CALL. The bare word appears in comments and as a colour-space
    //    keyword: color-mix(in oklch, …). Neither is a literal.
    if (!text.trimEnd().endsWith('(')) return 'not-a-call';
    return null;
  }

  if (form === 'named') {
    // 5. a property name, not a colour: `white-space`, `red-herring`
    if (/[-\w]/.test(after[0] ?? '')) return 'property-name';
    if (isStyle) {
      // in CSS/SVG a bare `solid red` is real; require a value position
      if (!/[:\s,(]\s*$/.test(before)) return 'not-a-value-position';
      return null;
    }
    // 6. in JS/MDX a colour value is a quoted string. Bare words are prose:
    //    "the red boat", "Colour theory: red and green".
    const q = src[index - 1];
    const qe = after[0];
    if (!((q === '"' || q === "'") && (qe === '"' || qe === "'"))) return 'prose';
    return null;
  }

  return null; // tailwind-palette has no known false-positive class
}

async function walk(dir, out = []) {
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    if (e.name.startsWith('.')) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) { if (!SKIP_DIRS.has(e.name)) await walk(p, out); }
    else if (EXTS.has(extname(e.name))) out.push(p);
  }
  return out;
}

/**
 * Scan a tree. Returns one record per file INCLUDING files with no findings, so
 * "scanned and clean" is distinguishable from "never opened".
 * @returns {Promise<Array<{file, scanned, accepted, excluded}>>}
 */
export async function scanTree(root, { skip = [] } = {}) {
  const files = await walk(root);
  const out = [];
  for (const file of files) {
    const rel = relative(root, file).split('\\').join('/');
    if (skip.some((s) => rel.startsWith(s))) continue;
    const raw = await readFile(file, 'utf8');
    const src = blankComments(raw);
    const isStyle = STYLE_EXTS.has(extname(file));
    const lines = raw.split('\n');
    const accepted = [];
    const excluded = [];
    for (const [form, re] of CANDIDATES) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(raw)) !== null) {
        const text = m[0];
        const index = m.index;
        // count to the END of the match: a leading class can swallow the
        // previous newline and report the line above (K4: 1776 vs 1777).
        const line = raw.slice(0, index + text.length).split('\n').length;
        const rec = { form, match: text.trim(), line, source: lines[line - 1]?.trim() ?? '' };
        const why = classify({ form, text, index, src, raw, isStyle });
        if (why) excluded.push({ ...rec, reason: why });
        else accepted.push(rec);
      }
    }
    out.push({ file: rel, scanned: true, accepted, excluded });
  }
  return out;
}

// standalone report
if (import.meta.url === `file://${process.argv[1]}`) {
  const root = process.argv[2] ?? '.';
  const results = await scanTree(root, { skip: ['scripts/fixtures'] });
  let total = 0;
  for (const r of results.sort((a, b) => a.file.localeCompare(b.file))) {
    if (!r.accepted.length) continue;
    total += r.accepted.length;
    console.log(`\n${r.file}  (${r.accepted.length} literal${r.accepted.length === 1 ? '' : 's'}, ${r.excluded.length} excluded)`);
    for (const h of r.accepted) console.log(`  ${String(h.line).padStart(5)}  ${h.form.padEnd(18)} ${h.match.padEnd(16)} ${h.source.slice(0, 80)}`);
  }
  const exc = results.reduce((a, r) => a + r.excluded.length, 0);
  console.log(`\n${total} literals accepted, ${exc} candidates excluded, ${results.length} files scanned`);
}
