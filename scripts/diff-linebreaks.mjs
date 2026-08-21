/**
 * Compare two measurement runs and report what actually re-breaks.
 *
 *   node scripts/diff-linebreaks.mjs bricolage commissioner-naive
 *
 * Elements align by ordinal within a route@viewport; a text-digest mismatch is
 * reported as a structural misalignment rather than silently diffed.
 */

import { readFileSync } from 'node:fs';

const [A, B] = process.argv.slice(2);
const a = JSON.parse(readFileSync(`measurements/${A}.json`, 'utf8'));
const b = JSON.parse(readFileSync(`measurements/${B}.json`, 'utf8'));

const lastWordCount = (el) => {
  const last = el.lines.at(-1);
  return last ? last.text.trim().split(/\s+/).length : 0;
};

const name = (el) => {
  const c = el.cls
    .split(/\s+/)
    .filter((x) => x && !/^__/.test(x) && !/module__/.test(x))
    .slice(0, 2)
    .join('.');
  return c ? `${el.tag}.${c}` : el.tag;
};

let total = 0;
let changed = 0;
let misaligned = 0;
const rows = [];
const newWidows = [];
const gainedLine = [];
const lostLine = [];
const oneToTwo = [];
const perRoute = {};

for (const key of Object.keys(a.routes)) {
  const ea = a.routes[key];
  const eb = b.routes[key] ?? [];
  const [route, vp] = key.split('@');
  perRoute[key] ??= { total: 0, changed: 0 };

  for (let i = 0; i < ea.length; i++) {
    const x = ea[i];
    const y = eb[i];
    if (!y) continue;
    if (x.head !== y.head) {
      misaligned++;
      continue;
    }
    total++;
    perRoute[key].total++;

    if (x.lineCount !== y.lineCount) {
      changed++;
      perRoute[key].changed++;
      const row = {
        route,
        vp,
        sel: name(x),
        size: x.fontSize,
        from: x.lineCount,
        to: y.lineCount,
        head: x.head,
        aLines: x.lines.map((l) => l.text),
        bLines: y.lines.map((l) => l.text),
      };
      rows.push(row);
      if (y.lineCount > x.lineCount) gainedLine.push(row);
      else lostLine.push(row);
      if (x.lineCount === 1 && y.lineCount === 2) oneToTwo.push(row);
    } else if (x.lines.map((l) => l.text).join('|') !== y.lines.map((l) => l.text).join('|')) {
      // same count, different break points
      changed++;
      perRoute[key].changed++;
      rows.push({
        route,
        vp,
        sel: name(x),
        size: x.fontSize,
        from: x.lineCount,
        to: y.lineCount,
        rebreak: true,
        head: x.head,
        aLines: x.lines.map((l) => l.text),
        bLines: y.lines.map((l) => l.text),
      });
    }

    // widow created: last line drops to a single word where it was not
    if (lastWordCount(y) === 1 && lastWordCount(x) > 1 && y.lineCount > 1) {
      newWidows.push({ route, vp, sel: name(x), size: x.fontSize, head: x.head, word: y.lines.at(-1).text });
    }
  }
}

const pct = (n, d) => (d ? ((n / d) * 100).toFixed(1) : '0.0');

console.log(`\n=== ${A}  →  ${B} ===`);
console.log(`elements compared: ${total}   changed: ${changed} (${pct(changed, total)}%)   misaligned: ${misaligned}`);
console.log(`  gained a line: ${gainedLine.length}   lost a line: ${lostLine.length}   re-broke at same count: ${rows.filter((r) => r.rebreak).length}`);
console.log(`  1 line → 2 lines (headline break risk): ${oneToTwo.length}`);
console.log(`  new single-word widows: ${newWidows.length}`);

console.log(`\n--- by surface ---`);
for (const [k, v] of Object.entries(perRoute)) {
  console.log(`  ${k.padEnd(42)} ${String(v.changed).padStart(3)} / ${String(v.total).padStart(3)}  (${pct(v.changed, v.total)}%)`);
}

const bySel = {};
for (const r of rows) {
  bySel[r.sel] ??= { n: 0, sizes: new Set(), gained: 0, lost: 0, rebreak: 0 };
  bySel[r.sel].n++;
  bySel[r.sel].sizes.add(r.size);
  if (r.rebreak) bySel[r.sel].rebreak++;
  else if (r.to > r.from) bySel[r.sel].gained++;
  else bySel[r.sel].lost++;
}
console.log(`\n--- selectors that move, ranked ---`);
Object.entries(bySel)
  .sort((x, y) => y[1].n - x[1].n)
  .slice(0, 30)
  .forEach(([sel, v]) => {
    const sizes = [...v.sizes].sort((p, q) => q - p).slice(0, 4).join('/');
    console.log(`  ${String(v.n).padStart(3)}  ${sel.padEnd(44)} ${sizes.padStart(16)}px  +${v.gained} -${v.lost} ~${v.rebreak}`);
  });

console.log(`\n--- headlines that gain a line (worst class) ---`);
gainedLine
  .filter((r) => r.size >= 24)
  .sort((x, y) => y.size - x.size)
  .slice(0, 25)
  .forEach((r) => {
    console.log(`  ${r.route}@${r.vp}  ${r.sel}  ${r.size}px  ${r.from}→${r.to}`);
    console.log(`      A: ${r.aLines.map((l) => `[${l}]`).join(' ')}`);
    console.log(`      B: ${r.bLines.map((l) => `[${l}]`).join(' ')}`);
  });

console.log(`\n--- new widows (single-word last line) ---`);
newWidows.slice(0, 25).forEach((w) => {
  console.log(`  ${w.route}@${w.vp}  ${w.sel}  ${w.size}px  → "${w.word}"`);
});
console.log();
