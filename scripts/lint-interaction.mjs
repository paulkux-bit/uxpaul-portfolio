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
// Not wired into `npm run build` until I6, mirroring lint:color, which entered
// the build script in df70f8f — the FINAL commit of the colour migration — and
// carried this same note until then. A checklist that gates the build blocks
// preview deploys for the whole migration.
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
    // The same §5 exemption, for the two named links I1 moved out of .tsx. This
    // is the spec applying itself, not a rule parked until later: §5 states that
    // a text link HAS no pressed state by design. Contrast .case-card--linked,
    // which is genuinely awaiting :active in I4 and stays a failure.
    { match: '.quiet-link:hover', reason: 'text link — no surface to move (spec §5)' },
    { match: '.case-card__title-link:hover', reason: 'text link inside a card — no surface to move (spec §5)' },
    { match: '.take-card:hover', reason: 'non-interactive tint; the takes wall is a typographic wall, not a control' },
    { match: '.about-row__summary:hover', reason: 'disclosure row — the chevron rotation is the feedback (spec §5)' },
  ],
  // check 9: classes that deliberately have no rule.
  //
  // Check 9 catches a dangling class by its CONSEQUENCE, and a wrapper nobody
  // styled on purpose has the same consequence as a rule Tailwind silently
  // dropped. Finding #11 was exactly that shape and WAS a bug. Nothing
  // mechanical separates the two: the difference is intent, and intent has to
  // be declared. That is what this list is for — not a weakness in the check.
  //
  // Each entry is coupled to the structural premise its reason rests on, and
  // __tests__/interaction-lint.test.mjs asserts that premise against the real
  // globals.css. An exception whose reason can quietly stop being true is how
  // the pinned specimen tones ended up describing a palette that no longer
  // existed.
  //
  // PROVEN BEFORE BEING WRITTEN, not asserted. Playwright over both published
  // case studies and the sandbox route, at 1440 and 900, light and dark: 12
  // passes, zero CSSOM rules matching either class out of 849 walked per pass,
  // and the geometry exact — text column 756 = 1088 − 300 − 32 at 1440, full
  // width and figure stacked at 900.
  danglingClasses: [
    {
      class: 'friction-beat__text',
      reason: 'structural wrapper / grid child, deliberately unstyled — .friction-beat is the grid and minmax(0, 1fr) carries both the column sizing and the min-width: 0; its three children each style themselves',
    },
    {
      class: 'resolution-block__framing',
      reason: 'structural wrapper / grid child, deliberately unstyled — a semantic wrapper around prose sitting in plain block flow, inheriting its measure. Its only render site today is app/sandbox/show-the-work; the component itself is product code, which is why it gates',
    },
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

// ── Pending, not excused ───────────────────────────────────────────────────
//
// A forward reference: a class authored ahead of the rules that will target it.
// NOT an allowlist — it is not excused, it is scheduled, and the difference
// matters because a forward reference that outlives the step meant to resolve it
// is a typo with a comment on it.
//
// Printed every run, and each entry is coupled to a test asserting the class has
// NO rule today. When the named step gives it one, that test reddens and forces
// the entry's deletion, so this list cannot quietly outlive its own contents.
export const PENDING_RULES = [
  {
    class: 'case-card',
    expectedAt: 'I3',
    reason:
      'base-class hook added by I1 ("I2, I3 and I4 all target this element"). I2 is not it — I2 edits @utility lift, a sibling class on the same <article>, never .case-card. §4 puts the card box on --radius-m, which is what should give it declarations. CONDITIONAL: the card\'s radius is rounded-2xl in JSX, which check 3 cannot see, so an I3 scoped to "check 3 → 0" would never touch it and this would still be dangling.',
  },
];

const SKIP_DIRS = new Set(['node_modules', '.next', '.git', '_to_delete', 'dist', 'out', 'coverage', '.vercel']);

// Sandbox is scratch space under a standing do-not-touch instruction, so it
// cannot gate. It is counted and PRINTED EVERY RUN rather than skipped: a
// surface excluded silently is a surface nobody remembers is excluded.
const SANDBOX = ['app/sandbox/', 'components/sandbox/'];
export const isSandboxPath = (rel) => SANDBOX.some((d) => rel.startsWith(d));
const TSX_EXTS = new Set(['.tsx', '.mdx']);

// ── Patterns ───────────────────────────────────────────────────────────────
const TSX_STATE_VARIANTS = /\b(?:group-)?(?:hover|focus|active|focus-within|focus-visible|group-focus-within):/g;
const SVG_OPEN = /<svg[\s>]/g;
const TIME = /(?<![\w-])(\d*\.?\d+)(ms|s)\b/g;
// check 9. The three className forms that are readable as a literal class list.
// Anything else is an expression, reported as such rather than passed over.
//
// The `{[ … ]}` array form used to be a fourth. It is NOT a class list — its body
// is JavaScript, so whitespace-splitting it yields `'a',` and `cond` and `?`.
// Those used to vanish into the shape test; with the shape test widened below to
// admit quotes they would have read as dangling classes instead, turning one
// silent drop into a false positive. It also risked running away: `[\s\S]*?`
// hunting a `]}` can swallow the rest of a file. Measured first — all three array
// classNames in the repo end `.filter(Boolean).join(' ')}` and never matched it
// anyway — so dropping the branch costs no coverage and they are now reported as
// the expressions they are.
const CLASSNAME_LITERAL = /className\s*=\s*(?:"([^"]*)"|'([^']*)'|\{`([^`]*)`\})/g;
// What a class token may contain. `!` is Tailwind's important modifier (`mt-24!`)
// and an arbitrary value can carry quotes (`after:content-['']`) — both are real
// utilities that resolve, and both were being dropped SILENTLY by a narrower
// shape test: no failure, no exclusion, no count. Seven of them, in files
// including a published case study whose own comment calls the `!` load-bearing.
// That is the one thing §8 forbids, and it hid the very case the tokenizer had
// just been fixed to keep whole.
const CLASS_TOKEN = /^[A-Za-z0-9_:[\]().,%#/\\!'"-]+$/;
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
  // Sandbox findings are split out of `failures` into `sandbox` so they neither
  // gate nor vanish.
  const add = (id, title, failures, excluded = []) => {
    const sandbox = failures.filter((x) => isSandboxPath(x.where.split(':')[0]));
    const gated = failures.filter((x) => !isSandboxPath(x.where.split(':')[0]));
    checks.push({ id, title, failures: gated, sandbox, excluded, pass: gated.length === 0 });
  };

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
  //
  // BOTH HALVES. The first version of these tested only the negative: check 5
  // flagged an explicit `size={n}` and treated an icon with no size prop as
  // clean, and check 6 declared §2.3's containment half UNCHECKED.
  //
  // "No size prop" is not clean. lucide-react 1.28.0 defaults `width: 24,
  // height: 24` and writes them as px ATTRIBUTES, so an ungoverned icon renders
  // at 24px and stops scaling with the reader's root size — the precise bug R2
  // exists to kill. A check that goes green with half its rule unimplemented is
  // worse than one that stays red, and both of these would have gone green
  // falsely at I5.
  //
  // SCOPE: check 5 governs Lucide nodes only. `.theme-toggle svg` sizes a
  // hand-authored SVG, which is check 4's finding today and stops existing when
  // I5 replaces it with Lucide. Flagging it here too would report one defect
  // twice under two rules.
  {
    const f5 = [], ex5 = [], f6 = [], ex6 = [];

    // CSS side, gathered once: which classes size something to exactly 1em in
    // BOTH axes, which size in some other unit, and which set --icon-stroke.
    const sizedOneEm = new Map(); // class -> {w, h}
    const sizedOther = new Map(); // class -> "width: 1.125rem"
    const strokeClasses = new Set();
    const classesOf = (sel) => [...sel.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map((x) => x[1]);
    for (const s of sheets) {
      s.root.walkRules((r) => {
        const cls = classesOf(r.selector);
        if (!cls.length) return;
        for (const d of r.nodes ?? []) {
          if (d.type !== 'decl') continue;
          if (d.prop === '--icon-stroke') for (const c of cls) strokeClasses.add(c);
          if (d.prop !== 'width' && d.prop !== 'height') continue;
          const v = d.value.trim();
          for (const c of cls) {
            if (v === '1em') {
              const e = sizedOneEm.get(c) ?? { w: false, h: false };
              e[d.prop === 'width' ? 'w' : 'h'] = true;
              sizedOneEm.set(c, e);
            } else if (/^[\d.]+(px|rem|em|%)$/.test(v) && v !== '1em') {
              // rem fails as surely as px: 1.125rem is not 1em and does not
              // track adjacent type, which is the whole point of R2.
              sizedOther.set(c, `${d.prop}: ${v}`);
            }
          }
        }
      });
    }
    const isOneEm = (c) => sizedOneEm.get(c)?.w && sizedOneEm.get(c)?.h;

    for (const file of tsxFiles) {
      const raw = await readFile(join(root, file), 'utf8');
      const src = blankComments(raw);
      const icons = new Set();
      for (const im of src.matchAll(/import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"]/g))
        for (const n of im[1].split(',')) { const t = n.trim().split(/\s+as\s+/).pop(); if (t) icons.add(t); }
      if (!icons.size) continue;

      // Every className in the file, in source order, so an icon's ANCESTORS can
      // be resolved: --icon-stroke is set on the container, not on the icon.
      const classAt = [...src.matchAll(/className\s*=\s*(?:"([^"]*)"|'([^']*)'|\{`([^`]*)`\}|\{\[([^\]]*)\])/gs)]
        .map((c) => ({ index: c.index, classes: (c[1] ?? c[2] ?? c[3] ?? c[4] ?? '').split(/[\s'"`,]+/).filter(Boolean) }));

      const tagRe = new RegExp(`<(${[...icons].join('|')})\\b([^>]*)>`, 'gs');
      let m;
      while ((m = tagRe.exec(src)) !== null) {
        const line = src.slice(0, m.index).split('\n').length;
        const [, name, attrs] = m;
        const own = (/className\s*=\s*["'`]([^"'`]*)/.exec(attrs)?.[1] ?? '').split(/\s+/).filter(Boolean);
        // ancestors: every className appearing BEFORE this node in the file
        const ancestors = classAt.filter((c) => c.index < m.index).flatMap((c) => c.classes);
        const scope = [...new Set([...own, ...ancestors])];

        // ── check 5 ──
        const px = /\b(size|width|height)\s*=\s*\{?\s*(\d+(?:\.\d+)?)\s*\}?/g;
        let a, sizedInline = false;
        while ((a = px.exec(attrs)) !== null) {
          sizedInline = true;
          f5.push({ where: `${file}:${line}`, detail: `<${name} ${a[1]}={${a[2]}}> — R2 says icons are sized in em, never px` });
        }
        const badUnit = own.find((c) => sizedOther.has(c));
        const oneEm = own.find((c) => isOneEm(c));
        if (badUnit) {
          f5.push({ where: `${file}:${line}`, detail: `<${name} className="${badUnit}"> is sized ${sizedOther.get(badUnit)} — not 1em` });
        } else if (oneEm) {
          ex5.push({ where: `${file}:${line}`, detail: `.${oneEm} sizes it 1em in both axes`, reason: 'sized-1em' });
        } else if (!sizedInline) {
          // THE HALF THAT WAS MISSING. No inline px and no governing class means
          // lucide's own 24px attributes win.
          f5.push({ where: `${file}:${line}`, detail: `<${name}> has no class sizing it to 1em — lucide defaults to 24px width/height attributes (§2.3 wants .icon { width: 1em; height: 1em })` });
        }

        // ── check 6 ──
        const sw = /\bstrokeWidth\s*=\s*\{?\s*(\d+(?:\.\d+)?)\s*\}?/.exec(attrs);
        if (sw) {
          const v = parseFloat(sw[1]).toFixed(2);
          if (STROKE_TABLE.includes(v)) ex6.push({ where: `${file}:${line}`, detail: `strokeWidth ${sw[1]} is in the §2.1 table`, reason: 'in-table' });
          else f6.push({ where: `${file}:${line}`, detail: `<${name} strokeWidth={${sw[1]}}> — not in the §2.1 table (${STROKE_TABLE.join(', ')})` });
        } else {
          // THE CONTAINMENT HALF. Governed when the icon, or any ancestor in the
          // same file, carries a class whose CSS sets --icon-stroke.
          const gov = scope.find((c) => strokeClasses.has(c));
          if (gov) ex6.push({ where: `${file}:${line}`, detail: `.${gov} sets --icon-stroke`, reason: 'governed-by-container' });
          else f6.push({ where: `${file}:${line}`, detail: `<${name}> has no governed stroke — no strokeWidth, and no class on it or an ancestor sets --icon-stroke (§2.3)` });
        }
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
    add(5, 'Every icon is 1em square — sized by a class, not by px/rem or lucide defaults', f5, ex5);
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

  // ── check 9 — no dangling className ─────────────────────────────────────
  //
  // Finding #11 was invisible to every gate: Tailwind silently dropped rules
  // authored inside the @utility cluster, so a class existed in .tsx with no
  // rule anywhere. Check 8 went green TRUTHFULLY — the utilities really had
  // left the .tsx — while the replacement CSS did not exist. This catches that
  // by its CONSEQUENCE rather than its cause, which matters because I2-I5 all
  // add authored rules to the same file and the next occurrence need not look
  // the same.
  //
  // WHAT IT CANNOT DO, AND WHY THAT IS THE DESIGN. Catching by consequence
  // means it cannot distinguish a deliberately unstyled structural wrapper from
  // a rule Tailwind silently dropped — both are a class with no rule. Finding
  // #11 was the second of those and was a bug; the two wrappers in
  // ALLOWLIST.danglingClasses are the first and are not. Nothing mechanical
  // separates them. The difference is intent, so intent gets declared, and each
  // declaration is coupled by a test to the structural premise its reason rests
  // on. That is what the check is for, not a weakness in it.
  //
  // FOURTH IN A ROW, RECORDED. Checks 5, 6 and 8 each shipped testing HALF
  // their stated rule. Check 9 shipped testing slightly MORE than its rule in
  // one place (it read a JS array body as a class list) and less in two others
  // (silent token drops, unread expression attributes). Same root — the stated
  // rule and the implemented rule were never diffed — in the opposite
  // direction. Four for four in this system, and not one of them was caught by
  // the check itself.
  {
    const f = [], ex = [];
    const { readdirSync, readFileSync } = await import('node:fs');
    let builtCss = '';
    const dirs = ['.next/static/chunks', '.next/static/css'];
    for (const d of dirs) {
      try {
        for (const n of readdirSync(join(root, d))) if (n.endsWith('.css')) builtCss += readFileSync(join(root, d, n), 'utf8');
      } catch { /* absent */ }
    }
    if (!builtCss) {
      // NEVER green when it cannot see. A check that passes because its input
      // was missing is the exact shape this migration keeps finding.
      f.push({ where: '.next', detail: 'no built CSS found — run `npm run build` first. Check 9 cannot verify and will not pass silently.' });
      add(9, 'Every className token resolves to a utility or an authored rule', f, ex);
    } else {
      const unescape = (x) => x.replace(/\\/g, '');
      const known = new Set();
      for (const m of builtCss.matchAll(/\.((?:\\.|[A-Za-z0-9_-])+)/g)) known.add(unescape(m[1]));
      for (const s2 of sheets) s2.root.walkRules((r) => {
        for (const m of r.selector.matchAll(/\.((?:\\.|[A-Za-z0-9_-])+)/g)) known.add(unescape(m[1]));
      });
      // Tailwind marker classes emit no CSS by design; verified .group has zero
      // rules in the built output.
      const MARKERS = { group: 'Tailwind marker class — emits no CSS by design', peer: 'Tailwind marker class — emits no CSS by design' };
      let interpolated = 0;
      for (const file of tsxFiles) {
        const raw = await readFile(join(root, file), 'utf8');
        const src = blankComments(raw);
        // Spans the literal forms below actually read, so the expression forms
        // they cannot read can be found and REPORTED rather than passed over.
        const covered = [];
        for (const m of src.matchAll(CLASSNAME_LITERAL)) {
          covered.push([m.index, m.index + m[0].length]);
          const body = m[1] ?? m[2] ?? m[3] ?? '';
          const line = src.slice(0, m.index).split('\n').length;
          if (/\$\{/.test(body)) interpolated++;
          // split on whitespace only: an arbitrary value can contain quotes
          // and commas (after:content-['']), and splitting on those shreds it
          // into tokens that resolve to nothing.
          for (const tok of body.replace(/\$\{[^}]*\}/g, ' ').split(/\s+/)) {
            const t = tok.trim();
            if (!t) continue;
            if (!CLASS_TOKEN.test(t)) {
              // WAS A SILENT DROP. See CLASS_TOKEN above: whatever still fails
              // the shape test is reported, because a token that leaves this
              // loop unrecorded is indistinguishable from one that resolved.
              ex.push({ where: `${file}:${line}`, detail: `"${t}" is not a shape this check can resolve to a selector`, reason: 'unrecognized-token-shape' });
              continue;
            }
            if (MARKERS[t]) { ex.push({ where: `${file}:${line}`, detail: `${t} — ${MARKERS[t]}`, reason: 'marker-class' }); continue; }
            if (known.has(t)) { ex.push({ where: `${file}:${line}`, detail: `${t} resolves`, reason: 'resolves' }); continue; }
            const unstyled = ALLOWLIST.danglingClasses.find((a) => a.class === t);
            if (unstyled) { ex.push({ where: `${file}:${line}`, detail: `${t} — ${unstyled.reason}`, reason: 'allowlisted-unstyled-wrapper' }); continue; }
            f.push({ where: `${file}:${line}`, detail: `"${t}" resolves to no utility and no authored rule — dangling` });
          }
        }
        // `className={…}` expressions none of the literal forms match — a bare
        // identifier (`{cls}`), a concatenation, an array with a trailing
        // `.filter().join()`. These were read by NOTHING: not tokenised, not
        // counted, not printed. Reported here so the blind spot is visible; see
        // the UNCHECKED block for what it costs.
        for (const m of src.matchAll(/className\s*=\s*\{/g)) {
          if (covered.some(([a, b]) => m.index >= a && m.index < b)) continue;
          const line = src.slice(0, m.index).split('\n').length;
          ex.push({ where: `${file}:${line}`, detail: 'className={…} expression — not readable as a literal class list', reason: 'unparsed-className-expression' });
        }
      }
      if (interpolated) ex.push({ where: '(various)', detail: `${interpolated} interpolated className(s) skipped — counted, not dropped silently`, reason: 'interpolated' });
      add(9, 'Every className token resolves to a utility or an authored rule', f, ex);
    }
  }

  // ── Blind spot, measured rather than described ──────────────────────────
  //
  // Check 3 reads stylesheets. A radius authored as a Tailwind utility in JSX is
  // invisible to it, so check 3 can reach 0 while a radius off the §4 scale is
  // still shipping. lint:type prints its equivalent (arbitrary width/weight
  // utilities in JSX); this one was not printed at all.
  //
  // It matters for I3 specifically: the case card's radius lives here, so an I3
  // scoped to check 3's count would never touch .case-card — which is also the
  // PENDING_RULES entry above.
  // Scanned from every quoted string, NOT from className attributes. The first
  // version read className the way check 9 does and therefore inherited check
  // 9's blind spot — it missed components/case-study-card.tsx's `rounded-2xl`,
  // which sits in an array-expression className and is the single site this
  // whole report exists for. A blind-spot report that shares the blind spot is
  // worse than none. This is a report and not a gate, so a false positive costs
  // a printed line while a miss costs the finding.
  const radiusInJsx = [];
  for (const file of tsxFiles) {
    const src = blankComments(await readFile(join(root, file), 'utf8'));
    for (const s of src.matchAll(/"([^"]*)"|'([^']*)'|`([^`]*)`/g)) {
      const line = src.slice(0, s.index).split('\n').length;
      for (const tok of (s[1] ?? s[2] ?? s[3] ?? '').split(/\s+/)) {
        const t = tok.trim();
        if (/^(?:[a-z-]+:)*rounded(?:-|$)/.test(t)) {
          radiusInJsx.push({ where: `${file}:${line}`, token: t, sandbox: isSandboxPath(file) });
        }
      }
    }
  }

  return { checks, scanned: { css: cssFiles, tsx: tsxFiles }, blindSpots: { radiusInJsx }, pending: PENDING_RULES };
}

// ── CLI ────────────────────────────────────────────────────────────────────
if (import.meta.url === `file://${process.argv[1]}`) {
  const { checks, scanned, blindSpots, pending } = await run();
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
    if (c.sandbox.length) {
      const files = [...new Set(c.sandbox.map((x) => x.where.split(':')[0]))];
      console.log(`    SANDBOX  ${c.sandbox.length} in ${files.length} file${files.length === 1 ? '' : 's'} — informational, does not gate`);
      for (const file of files.sort()) console.log(`      ${file}  (${c.sandbox.filter((x) => x.where.startsWith(`${file}:`)).length})`);
    }
    console.log('');
  }
  const sandboxTotal = checks.reduce((a, c) => a + c.sandbox.length, 0);
  console.log(`SANDBOX — ${sandboxTotal} finding${sandboxTotal === 1 ? '' : 's'} under a standing do-not-touch`);
  console.log('  instruction. Counted and printed, never silently skipped, so the');
  console.log('  exclusion stays visible. Excluded from pass/fail by ruling 2.\n');
  console.log('PENDING — forward references, scheduled rather than excused. Each is');
  console.log('  coupled to a test asserting it has NO rule today, so the entry cannot');
  console.log('  outlive what it describes.');
  for (const p of pending) {
    console.log(`  - .${p.class} — expected to resolve at ${p.expectedAt}`);
    console.log(`    ${p.reason}`);
  }
  console.log('');
  console.log('UNCHECKED — stated rather than implied:');
  console.log('  - §2.3 "every container that sets font-weight and holds an icon sets');
  console.log('    --icon-stroke" is only half mechanical. Check 6 validates every value');
  console.log('    it finds and flags every ungoverned icon, but cannot resolve which CSS');
  console.log('    selector wraps a given JSX node. The containment half is manual.');
  console.log('  - Cross-file class composition: check 6 resolves an icon\'s ancestors');
  console.log('    within one file, not a class applied by a parent component elsewhere.');
  console.log('  - Runtime stroke is not measured. Check 6 reads authored values only.');
  console.log('  - Check 9 reads the four literal className forms. A `className={…}`');
  console.log('    EXPRESSION — a bare identifier, a concatenation, an array with a');
  console.log('    trailing .filter().join() — is counted and printed as');
  console.log('    unparsed-className-expression, never tokenised. Harvesting every');
  console.log('    string literal inside an expression was measured and rejected: it');
  console.log('    reads comparison operands as classes (`top-left`) and template');
  console.log('    fragments as classes (`framed-image--`), 2 false positives in 3.');
  console.log('  - Check 9 cannot tell a deliberately unstyled wrapper from a rule');
  console.log('    Tailwind silently dropped — both are a class with no rule, and');
  console.log('    finding #11 was the second kind. The difference is intent, declared');
  console.log('    in ALLOWLIST.danglingClasses and coupled by a test to the structural');
  console.log('    premise each reason rests on.');
  console.log('  - Check 3 reads stylesheets, so a radius authored as a Tailwind utility');
  console.log('    in JSX is invisible to it — check 3 can reach 0 with a radius off the');
  console.log(`    §4 scale still shipping. ${blindSpots.radiusInJsx.length} in the tree:`);
  for (const r of blindSpots.radiusInJsx) {
    console.log(`      ${r.where}  ${r.token}${r.sandbox ? '  (sandbox)' : ''}`);
  }
  console.log('');
  const passing = checks.filter((c) => c.pass).length;
  console.log(
    `Result: ${passing} of ${checks.length} passing, ${checks.length - passing} failing` +
      (passing === checks.length ? '' : '  — each failure is a migration step, not a regression.'),
  );
  process.exit(passing === checks.length ? 0 : 1);
}
