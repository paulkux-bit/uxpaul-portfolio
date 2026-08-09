// Usage: node scripts/lint-interaction.mjs   (no build required — parses source)
//
// Interaction gate for `docs/interaction-system-v1-locked.md` §8. Eight
// assertions, referred to everywhere as **lint:interaction check 1..8**.
// The qualifier is not decoration: `lint:color` already has a "check 7" that
// means something entirely different, and this repo has already lost reading
// time to one name collision in docs/color-system.md.
//
// Fourth in the family, after lint-type, lint-space and lint-color. Same house
// style, same postcss dependency, same allowlist-with-a-reason discipline.
//
// THIS SCRIPT IS THE MIGRATION CHECKLIST. It is red on purpose at I0. Each
// later commit turns assertions green by changing the CODE. The rules are
// written once, at full strength, here, and are not softened afterwards: a rule
// that has to bend to make a commit look clean means the commit is wrong.
//
// Every candidate is REPORTED — as a failure, or as excluded with a named
// reason. Nothing is silently dropped (§8). A negative control that stops
// appearing in the output is indistinguishable from a file that was never
// opened, which is how the .mdx gap hid during the colour migration.
import { readFile, readdir } from 'node:fs/promises';
import { join, relative, extname } from 'node:path';
import { createRequire } from 'node:module';
import { isArtworkPath, isFixturePath, isArtworkSnippet, ARTWORK_DIRS } from './artwork-allowlist.mjs';
// Shared with lint:color rather than reimplemented. A `hover:` or an `<svg` in a
// comment is documentation, not authored markup, and offsets are preserved so
// reported line numbers stay true.
import { blankComments } from './color-literals.mjs';

const postcss = createRequire(join(process.cwd(), 'package.json'))('postcss');

// ── Allowlists — every entry carries a reason ──────────────────────────────
export const ALLOWLIST = {
  // check 1: literal durations that are not interaction durations
  durations: [
    { value: '450ms', selector: 'body::before', reason: 'paper-grain fade is an entrance, not an interaction (spec §3)' },
    { value: '0.01ms', selector: null, reason: 'prefers-reduced-motion kill switch — the point is that it is not a token' },
  ],
  // check 3: radii that are deliberately off the scale
  radii: [],
  // check 7: :hover with no :active, by design
  hoverWithoutActive: [
    { match: 'a:hover', reason: 'text link — no surface to move (spec §5)' },
    { match: '.take-card:hover', reason: 'non-interactive tint; the takes wall is a typographic wall, not a control' },
    { match: '.about-row__summary:hover', reason: 'disclosure row — the chevron rotation is the feedback (spec §5)' },
  ],
  // checks 4 and 8: pattern-definition constructs. A linter that detects a
  // string necessarily CONTAINS that string. Scoped to the construct, never by
  // skipping scripts/ wholesale — a blanket directory exclusion is the one
  // allowlist entry nobody re-examines, and it would silently absolve a real
  // violation written anywhere in these files.
  patterns: [
    { file: 'scripts/lint-interaction.mjs', construct: /^const TSX_STATE_VARIANTS|^const SVG_OPEN/, reason: 'the detection patterns themselves — a linter that finds a string contains that string' },
    { file: 'scripts/lint-interaction.mjs', construct: /^\s*add\(\d, '/, reason: "each check's own title enumerates what it bans" },
    { file: 'scripts/lint-interaction.mjs', construct: /^\s*\/\/ /, reason: 'commentary describing the rules' },
    { file: 'scripts/artwork-allowlist.mjs', construct: /^\s*\/\/ |^\s*(reason|snippet|path):/, reason: 'the shared artwork list names what it excludes' },
    // Scoped to assertion lines, not to the file: a variant written outside an
    // expect() here is still caught.
    { file: '__tests__/interaction-lint.test.mjs', construct: /expect\(|toContain|toEqual/, reason: 'assertion data naming the variants under test' },
  ],
};
const inList = (l, p) => l.some(p);

const SKIP_DIRS = new Set(['node_modules', '.next', '.git', '_to_delete', 'dist', 'out', 'coverage', '.vercel']);
const TSX_EXTS = new Set(['.tsx', '.mdx']);

// ── Patterns ───────────────────────────────────────────────────────────────
const TSX_STATE_VARIANTS = /\b(?:group-)?(?:hover|focus|active|focus-within|focus-visible|group-focus-within):/g;
const SVG_OPEN = /<svg[\s>]/g;
const TIME = /(?<![\w-])(\d*\.?\d+)(ms|s)\b/g;
const RADIUS_SCALE = ['--radius-xs', '--radius-s', '--radius-m', '--radius-full', '--radius-image', '--radius-portrait'];
const STROKE_TABLE = ['1.43', '1.70', '1.95', '2.25'];
const EASE_TOKENS = ['--ease-out-soft', '--ease-out-quint'];

async function walk(dir, out = []) {
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    if (e.name.startsWith('.')) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) { if (!SKIP_DIRS.has(e.name)) await walk(p, out); }
    else out.push(p);
  }
  return out;
}

const patternExempt = (rel, line) =>
  inList(ALLOWLIST.patterns, (a) => a.file === rel && a.construct.test(line));

/**
 * Run all eight checks against a tree.
 * @returns {Promise<{checks: Array, scanned: {css: string[], tsx: string[]}}>}
 */
export async function run(root = process.cwd(), { includeFixtures = false } = {}) {
  const all = (await walk(root)).map((p) => relative(root, p).split('\\').join('/'));
  const tsxFiles = all.filter((f) => TSX_EXTS.has(extname(f)) && (includeFixtures || !isFixturePath(f)));
  const cssFiles = all.filter((f) => extname(f) === '.css' && (includeFixtures || !isFixturePath(f)));

  const checks = [];
  const add = (id, title, failures, excluded = []) =>
    checks.push({ id, title, failures, excluded, pass: failures.length === 0 });

  // Parse every stylesheet once.
  const sheets = [];
  for (const f of cssFiles) {
    const src = await readFile(join(root, f), 'utf8');
    let root_;
    try { root_ = postcss.parse(src, { from: f }); } catch { continue; }
    sheets.push({ file: f, src, root: root_ });
  }

  // ── check 1 — no literal duration in a transition ───────────────────────
  {
    const f = [], ex = [];
    for (const s of sheets) {
      s.root.walkDecls((d) => {
        if (!/^transition(-duration)?$/.test(d.prop)) return; // delays are a sequence, not a duration (§3)
        const line = d.source?.start?.line ?? 0;
        const sel = (d.parent?.selector ?? d.parent?.name ?? '?').replace(/\s+/g, ' ').trim();
        TIME.lastIndex = 0;
        // One shorthand can repeat the same literal per sub-transition
        // (`transform 320ms, box-shadow 320ms, border-color 320ms`). That is one
        // decision to make, not three, so report the declaration once per
        // distinct value.
        const seen = new Set();
        let m;
        while ((m = TIME.exec(d.value)) !== null) {
          const value = m[0];
          if (seen.has(value)) continue;
          seen.add(value);
          const hit = ALLOWLIST.durations.find(
            (a) => a.value === value && (a.selector === null || sel.includes(a.selector)),
          );
          if (hit) { ex.push({ where: `${s.file}:${line}`, detail: `${value} in ${sel} — ${hit.reason}`, reason: 'allowlisted-duration' }); continue; }
          const n = (d.value.match(new RegExp(value.replace('.', '\\.'), 'g')) ?? []).length;
          f.push({ where: `${s.file}:${line}`, detail: `literal ${value}${n > 1 ? ` (×${n})` : ''} in ${d.prop} — ${sel}` });
        }
      });
    }
    add(1, 'No literal duration in a transition — every one resolves to a token', f, ex);
  }

  // ── check 2 — easing is a token, never bare or inline ───────────────────
  {
    const f = [], ex = [];
    for (const s of sheets) {
      s.root.walkDecls((d) => {
        if (!/^transition(-timing-function)?$/.test(d.prop)) return;
        const line = d.source?.start?.line ?? 0;
        const sel = d.parent?.selector ?? '';
        const v = d.value;
        const usesToken = EASE_TOKENS.some((t) => v.includes(t));
        const bare = /(?<![\w-])(ease-in-out|ease-in|ease-out|ease|linear|step-(start|end))(?![\w-])/.exec(v);
        const inlineBezier = /cubic-bezier\s*\(/.test(v);
        if (inlineBezier) f.push({ where: `${s.file}:${line}`, detail: `inline cubic-bezier — ${sel} { ${d.prop}: ${v} }` });
        else if (bare) f.push({ where: `${s.file}:${line}`, detail: `bare '${bare[1]}' easing — ${sel} { ${d.prop}: ${v} }` });
        else if (!usesToken && /\d/.test(v)) f.push({ where: `${s.file}:${line}`, detail: `no easing token — ${sel} { ${d.prop}: ${v} }` });
        else if (usesToken) ex.push({ where: `${s.file}:${line}`, detail: `${sel} uses a token`, reason: 'uses-ease-token' });
      });
    }
    add(2, 'Every transition eases with --ease-out-soft or --ease-out-quint', f, ex);
  }

  // ── check 3 — radius is a scale ─────────────────────────────────────────
  {
    const f = [], ex = [];
    for (const s of sheets) {
      s.root.walkDecls((d) => {
        if (!/^border(-[a-z]+)?-radius$/.test(d.prop)) return;
        const line = d.source?.start?.line ?? 0;
        const sel = d.parent?.selector ?? '';
        if (RADIUS_SCALE.some((t) => d.value.includes(t))) {
          ex.push({ where: `${s.file}:${line}`, detail: `${sel} uses a scale token`, reason: 'uses-radius-token' });
          return;
        }
        const hit = ALLOWLIST.radii.find((a) => a.value === d.value.trim() && sel.includes(a.selector));
        if (hit) { ex.push({ where: `${s.file}:${line}`, detail: `${d.value} — ${hit.reason}`, reason: 'allowlisted-radius' }); return; }
        if (/^(0|0px|inherit|initial|unset)$/.test(d.value.trim())) {
          ex.push({ where: `${s.file}:${line}`, detail: `${d.value} is a reset`, reason: 'zero-or-keyword' });
          return;
        }
        f.push({ where: `${s.file}:${line}`, detail: `literal radius ${d.value} — ${sel} { ${d.prop} }` });
      });
      // token DEFINITIONS are the scale itself, not consumers of it
      s.root.walkDecls((d) => {
        if (d.prop.startsWith('--radius')) ex.push({ where: `${s.file}:${d.source?.start?.line ?? 0}`, detail: `${d.prop} defines the scale`, reason: 'token-definition' });
      });
    }
    add(3, 'No literal border-radius outside the radius tokens', f, ex);
  }

  // ── check 4 — no hand-authored <svg> icons ──────────────────────────────
  {
    const f = [], ex = [];
    for (const file of tsxFiles) {
      const raw = await readFile(join(root, file), 'utf8');
      const src = blankComments(raw);
      SVG_OPEN.lastIndex = 0;
      let m;
      while ((m = SVG_OPEN.exec(raw)) !== null) {
        const line = raw.slice(0, m.index).split('\n').length;
        const lineText = raw.split('\n')[line - 1] ?? '';
        if (src.slice(m.index, m.index + m[0].length) !== m[0]) {
          ex.push({ where: `${file}:${line}`, detail: '<svg mentioned in a comment', reason: 'comment' });
          continue;
        }
        if (isArtworkPath(file)) { ex.push({ where: `${file}:${line}`, detail: ARTWORK_DIRS.find((d) => file.startsWith(`${d.path}/`)).reason, reason: 'artwork' }); continue; }
        if (isArtworkSnippet(raw)) { ex.push({ where: `${file}:${line}`, detail: 'generated texture', reason: 'artwork' }); continue; }
        if (patternExempt(file, lineText)) { ex.push({ where: `${file}:${line}`, detail: 'pattern definition', reason: 'pattern-construct' }); continue; }
        f.push({ where: `${file}:${line}`, detail: `hand-authored <svg> — R3 says Lucide is the only icon source` });
      }
    }
    // the paper-grain data URI lives in CSS, not tsx
    for (const s of sheets) {
      s.root.walkDecls((d) => {
        if (!/<svg|%3Csvg/i.test(d.value)) return;
        const line = d.source?.start?.line ?? 0;
        if (isArtworkSnippet(d.value)) ex.push({ where: `${s.file}:${line}`, detail: 'paper grain — generated texture, not a drawn icon', reason: 'artwork' });
        else f.push({ where: `${s.file}:${line}`, detail: `inline <svg> payload in CSS — ${d.prop}` });
      });
    }
    add(4, 'No hand-authored <svg> icon outside the artwork allowlist', f, ex);
  }

  // ── checks 5 & 6 — icon sizing and stroke ───────────────────────────────
  {
    const f5 = [], ex5 = [], f6 = [], ex6 = [];
    for (const file of tsxFiles) {
      const src = await readFile(join(root, file), 'utf8');
      const lines = src.split('\n');
      // Which components come from lucide? Only those are icons — next/image
      // also carries width/height and must not be flagged.
      const icons = new Set();
      for (const im of src.matchAll(/import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"]/g))
        for (const n of im[1].split(',')) { const t = n.trim().split(/\s+as\s+/).pop(); if (t) icons.add(t); }
      if (!icons.size) continue;
      const tagRe = new RegExp(`<(${[...icons].join('|')})\\b([^>]*)>`, 'gs');
      let m;
      while ((m = tagRe.exec(src)) !== null) {
        const line = src.slice(0, m.index).split('\n').length;
        const [, name, attrs] = m;
        const px = /\b(size|width|height)\s*=\s*\{?\s*(\d+(?:\.\d+)?)\s*\}?/g;
        let a, sized = false;
        while ((a = px.exec(attrs)) !== null) {
          sized = true;
          f5.push({ where: `${file}:${line}`, detail: `<${name} ${a[1]}={${a[2]}}> — R2 says icons are sized in em, never px` });
        }
        if (!sized) ex5.push({ where: `${file}:${line}`, detail: `<${name}> carries no px size`, reason: 'no-px-size' });

        const sw = /\bstrokeWidth\s*=\s*\{?\s*(\d+(?:\.\d+)?)\s*\}?/.exec(attrs);
        if (sw) {
          const v = parseFloat(sw[1]).toFixed(2);
          if (STROKE_TABLE.includes(v)) ex6.push({ where: `${file}:${line}`, detail: `strokeWidth ${sw[1]} is in the §2.1 table`, reason: 'in-table' });
          else f6.push({ where: `${file}:${line}`, detail: `<${name} strokeWidth={${sw[1]}}> — not in the §2.1 table (${STROKE_TABLE.join(', ')})` });
        } else {
          f6.push({ where: `${file}:${line}`, detail: `<${name}> has no governed stroke — no strokeWidth and no --icon-stroke container (§2.3)` });
        }
        void lines;
      }
    }
    // every authored --icon-stroke value must be in the table
    for (const s of sheets) {
      s.root.walkDecls((d) => {
        if (d.prop !== '--icon-stroke') return;
        const line = d.source?.start?.line ?? 0;
        const v = parseFloat(d.value).toFixed(2);
        if (STROKE_TABLE.includes(v)) ex6.push({ where: `${s.file}:${line}`, detail: `${d.value} is in the §2.1 table`, reason: 'in-table' });
        else f6.push({ where: `${s.file}:${line}`, detail: `--icon-stroke: ${d.value} is not in the §2.1 table` });
      });
    }
    add(5, 'Every icon is 1em square — no px width or height on an icon node', f5, ex5);
    add(6, 'Every --icon-stroke is in the §2.1 table, and every icon has one', f6, ex6);
  }

  // ── check 7 — :hover implies :active ────────────────────────────────────
  {
    const f = [], ex = [];
    for (const s of sheets) {
      const hovers = new Map();
      const actives = new Set();
      s.root.walkRules((r) => {
        const sels = r.selector.split(',').map((x) => x.trim());
        for (const sel of sels) {
          if (sel.includes(':active')) actives.add(sel.replace(/:active/g, '').trim());
          if (sel.includes(':hover')) {
            const base = sel.replace(/:hover/g, '').trim();
            if (!hovers.has(base)) hovers.set(base, { sel, line: r.source?.start?.line ?? 0 });
          }
        }
      });
      for (const [base, info] of hovers) {
        const hit = ALLOWLIST.hoverWithoutActive.find((a) => info.sel.includes(a.match) || base === a.match.replace(':hover', ''));
        if (hit) { ex.push({ where: `${s.file}:${info.line}`, detail: `${info.sel} — ${hit.reason}`, reason: 'allowlisted-no-active' }); continue; }
        if (actives.has(base)) { ex.push({ where: `${s.file}:${info.line}`, detail: `${info.sel} has a matching :active`, reason: 'has-active' }); continue; }
        f.push({ where: `${s.file}:${info.line}`, detail: `${info.sel} has no :active — R5 says three states, not one` });
      }
    }
    add(7, 'Every :hover has a matching :active, or an allowlisted reason', f, ex);
  }

  // ── check 8 — no state variants in .tsx ─────────────────────────────────
  {
    const f = [], ex = [];
    for (const file of [...tsxFiles, ...all.filter((x) => extname(x) === '.mjs' && !isFixturePath(x))]) {
      const raw = await readFile(join(root, file), 'utf8');
      const src = blankComments(raw);
      const lines = raw.split('\n');
      TSX_STATE_VARIANTS.lastIndex = 0;
      let m;
      while ((m = TSX_STATE_VARIANTS.exec(raw)) !== null) {
        const line = raw.slice(0, m.index).split('\n').length;
        const lineText = lines[line - 1] ?? '';
        if (src.slice(m.index, m.index + m[0].length) !== m[0]) {
          ex.push({ where: `${file}:${line}`, detail: `${m[0]} inside a comment`, reason: 'comment' });
          continue;
        }
        if (patternExempt(file, lineText)) { ex.push({ where: `${file}:${line}`, detail: `${m[0]} in a pattern definition`, reason: 'pattern-construct' }); continue; }
        f.push({ where: `${file}:${line}`, detail: `${m[0]} utility — R4 says interaction lives in globals.css` });
      }
    }
    add(8, 'No hover:/focus:/active:/group-hover: utilities in .tsx', f, ex);
  }

  return { checks, scanned: { css: cssFiles, tsx: tsxFiles } };
}

// ── CLI ────────────────────────────────────────────────────────────────────
if (import.meta.url === `file://${process.argv[1]}`) {
  const { checks, scanned } = await run();
  console.log(`interaction-lint: ${scanned.css.length} stylesheets, ${scanned.tsx.length} .tsx/.mdx files\n`);
  for (const c of checks) {
    console.log(`${c.pass ? '✓' : '✗'} check ${c.id}. ${c.title}`);
    if (c.pass) console.log(`    PASS  (${c.excluded.length} excluded)`);
    else {
      const byFile = new Map();
      for (const x of c.failures) {
        const file = x.where.split(':')[0];
        if (!byFile.has(file)) byFile.set(file, []);
        byFile.get(file).push(x);
      }
      console.log(`    FAIL  ${c.failures.length} in ${byFile.size} file${byFile.size === 1 ? '' : 's'}, ${c.excluded.length} excluded`);
      for (const [file, list] of [...byFile].sort()) {
        console.log(`      ${file}  (${list.length})`);
        for (const x of list.slice(0, 8)) console.log(`        ${x.where.split(':')[1] ?? ''}  ${x.detail}`);
        if (list.length > 8) console.log(`        … and ${list.length - 8} more in this file`);
      }
    }
    console.log('');
  }
  console.log('UNCHECKED — stated rather than implied:');
  console.log('  - §2.3 "every container that sets font-weight and holds an icon sets');
  console.log('    --icon-stroke" is only half mechanical. Check 6 validates every value');
  console.log('    it finds and flags every ungoverned icon, but cannot resolve which CSS');
  console.log('    selector wraps a given JSX node. The containment half is manual.');
  console.log('  - Runtime stroke is not measured. Check 6 reads authored values only.\n');
  const passing = checks.filter((c) => c.pass).length;
  console.log(
    `Result: ${passing} of ${checks.length} passing, ${checks.length - passing} failing` +
      (passing === checks.length ? '' : '  — each failure is a migration step, not a regression.'),
  );
  process.exit(passing === checks.length ? 0 : 1);
}
