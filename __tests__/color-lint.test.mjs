// @vitest-environment node
//
// Both directions for the lint:color checks that read token VALUES rather than
// the shape of the file (check 9 onward). Each red case is the real
// app/globals.css with one value moved, linted through the script's optional
// path argument, so the fixture can never drift from the palette it guards.
//
// A red case asserts the failure NAMES the token it moved. "Check 9 failed" on
// its own would also be what an unresolvable file produces, which is the
// wrong-reason pass the locked doc (section 7) warns about.
import { describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..');
const CSS = readFileSync(join(REPO, 'app/globals.css'), 'utf8');
const TMP = mkdtempSync(join(tmpdir(), 'color-lint-'));

/** Run lint:color on `css` and return the block of output under check `id`. */
function lint(css, id, name) {
  const file = join(TMP, `${name}.css`);
  writeFileSync(file, css);
  let out;
  try {
    out = execFileSync(process.execPath, ['scripts/lint-color.mjs', file], { cwd: REPO, encoding: 'utf8' });
  } catch (e) {
    out = e.stdout;
  }
  const start = out.search(new RegExp(`^[✓✗] ${id}\\. `, 'm'));
  expect(start, `check ${id} did not run on ${name}`).toBeGreaterThanOrEqual(0);
  const rest = out.slice(start);
  const end = rest.search(/\n\n/);
  return end < 0 ? rest : rest.slice(0, end);
}

/** Replace exactly one occurrence, inside the .dark block, or throw. */
function inDark(css, from, to) {
  const at = css.indexOf('\n.dark {');
  expect(at, 'no .dark block').toBeGreaterThan(0);
  const head = css.slice(0, at);
  const tail = css.slice(at);
  expect(tail.split(from).length - 1, `"${from}" is not unique in .dark`).toBe(1);
  return head + tail.replace(from, to);
}

describe('lint:color check 9, the hue band', () => {
  it('passes on the real palette and counts what it read', () => {
    const block = lint(CSS, 9, 'real');
    expect(block).toMatch(/^✓ 9\./);
    // A positive, not only the absence of a negative: the count proves the
    // values were read. 13 roles and 5 interaction tokens a mode, plus the
    // shadows' three oklch() each, plus --card-hover and any later token.
    const n = Number(block.match(/\((\d+) values\)/)?.[1]);
    expect(n).toBeGreaterThanOrEqual(41);
  });

  it('fails with the dark ground at 85', () => {
    const css = inDark(CSS, /--hue-ground:\s+\d+;/.exec(CSS.slice(CSS.indexOf('\n.dark {')))[0], '--hue-ground:   85;');
    const block = lint(css, 9, 'ground-85');
    expect(block).toMatch(/^✗ 9\./);
    expect(block).toMatch(/dark: --bg-canvas hue 85 is outside 50 to 80/);
  });

  it('fails with the dark focus glow at hue 81', () => {
    const decl = /--focus-glow:\s+oklch\(([\d.]+) ([\d.]+) ([\d.]+) \/ ([\d.]+)\);/.exec(CSS.slice(CSS.indexOf('\n.dark {')));
    expect(decl, 'dark --focus-glow is not a literal oklch with alpha').toBeTruthy();
    const css = inDark(CSS, decl[0], `--focus-glow: oklch(${decl[1]} ${decl[2]} 81 / ${decl[4]});`);
    const block = lint(css, 9, 'glow-81');
    expect(block).toMatch(/^✗ 9\./);
    expect(block).toMatch(/dark: --focus-glow hue 81 is outside 50 to 80/);
  });

  it('fails with the dark sunken at hue 49', () => {
    const dark = CSS.slice(CSS.indexOf('\n.dark {'));
    const ground = Number(/--hue-ground:\s+(\d+);/.exec(dark)[1]);
    const decl = /--bg-sunken:\s+oklch\(([\d.]+) (calc\(var\(--chroma-unit\) \* \d+\)) [^;]+\);/.exec(dark);
    expect(decl, 'dark --bg-sunken is not composed from the chroma unit').toBeTruthy();
    const css = inDark(CSS, decl[0], `--bg-sunken: oklch(${decl[1]} ${decl[2]} calc(var(--hue-ground) - ${ground - 49}));`);
    const block = lint(css, 9, 'sunken-49');
    expect(block).toMatch(/^✗ 9\./);
    expect(block).toMatch(/dark: --bg-sunken hue 49 is outside 50 to 80/);
  });
});
