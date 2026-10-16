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

  // The band is inclusive. Both edges are proved green on purpose, not left to
  // whichever tokens happen to sit on them today.
  it('passes with the dark sunken at hue 50', () => {
    const dark = CSS.slice(CSS.indexOf('\n.dark {'));
    const ground = Number(/--hue-ground:\s+(\d+);/.exec(dark)[1]);
    const decl = /--bg-sunken:\s+oklch\(([\d.]+) (calc\(var\(--chroma-unit\) \* \d+\)) [^;]+\);/.exec(dark);
    const css = inDark(CSS, decl[0], `--bg-sunken: oklch(${decl[1]} ${decl[2]} calc(var(--hue-ground) - ${ground - 50}));`);
    expect(lint(css, 9, 'sunken-50')).toMatch(/^✓ 9\./);
  });

  it('passes with the dark focus glow at hue 80', () => {
    const decl = /--focus-glow:\s+oklch\(([\d.]+) ([\d.]+) ([\d.]+) \/ ([\d.]+)\);/.exec(CSS.slice(CSS.indexOf('\n.dark {')));
    const css = inDark(CSS, decl[0], `--focus-glow: oklch(${decl[1]} ${decl[2]} 80 / ${decl[4]});`);
    expect(lint(css, 9, 'glow-80')).toMatch(/^✓ 9\./);
  });
});

describe('lint:color path mode', () => {
  // Every red case above lints a copy through the path argument. Check 7 must
  // still pass on an unmodified copy, or path mode is red for a reason that has
  // nothing to do with the check under test.
  it('check 7 passes on an unmodified copy given as a path', () => {
    expect(lint(CSS, 7, 'copy-7')).toMatch(/^✓ 7\./);
  });
});

describe('lint:color check 10, the card step', () => {
  it('passes on the real palette and reports both steps', () => {
    const block = lint(CSS, 10, 'real-step');
    expect(block).toMatch(/^✓ 10\./);
    expect(block).toMatch(/light 1\.\d{3}, dark 1\.\d{3}/);
  });

  it('fails with the dark --card-hover 0.012 lighter', () => {
    const decl = /--card-hover\s*:\s+oklch\(([\d.]+) /.exec(CSS.slice(CSS.indexOf('\n.dark {')));
    expect(decl, 'dark --card-hover has no colour value of its own').toBeTruthy();
    const lighter = (Number(decl[1]) + 0.012).toFixed(3);
    const css = inDark(CSS, decl[0], decl[0].replace(decl[1], lighter));
    const block = lint(css, 10, 'step-lighter');
    expect(block).toMatch(/^✗ 10\./);
    expect(block).toMatch(/dark: --card-hover on --bg-surface = 1\.1[2-9]\d, ruled 1\.10 within 0\.01/);
    expect(block).not.toMatch(/light:/);
  });
});

describe('lint:color check 8, underlines and the focus ring', () => {
  it('passes on the real palette and reports its lowest margins', () => {
    const block = lint(CSS, 8, 'real-ring');
    expect(block).toMatch(/^✓ 8\./);
    expect(block).toMatch(/lowest underline \d\.\d\d, lowest ring \d\.\d\d/);
  });

  it('fails with the dark focus glow at alpha 0.40', () => {
    const decl = /--focus-glow:\s+oklch\(([\d.]+ [\d.]+ [\d.]+) \/ ([\d.]+)\);/.exec(CSS.slice(CSS.indexOf('\n.dark {')));
    expect(decl, 'dark --focus-glow is not a literal with alpha').toBeTruthy();
    const css = inDark(CSS, decl[0], decl[0].replace(`/ ${decl[2]})`, '/ 0.40)'));
    const block = lint(css, 8, 'glow-040');
    expect(block).toMatch(/^✗ 8\./);
    expect(block).toMatch(/dark: --focus-ring over --focus-glow on --bg-[\w-]+ = [0-2]\.\d\d, floor 3\.0/);
    expect(block).not.toMatch(/light:/);
  });

  it('reads --card-hover as an underline ground of its own', () => {
    // Lift the dark --card-hover to L 0.56, near the resting underline, so
    // only the hover panel fails. Before 15 Oct 2026 check 8 read three
    // grounds and would have passed this.
    const decl = /--card-hover\s*:\s+oklch\(([\d.]+) /.exec(CSS.slice(CSS.indexOf('\n.dark {')));
    const css = inDark(CSS, decl[0], decl[0].replace(decl[1], '0.560'));
    const block = lint(css, 8, 'underline-card');
    expect(block).toMatch(/^✗ 8\./);
    expect(block).toMatch(/dark: .* underline --[\w-]+ on --card-hover = /);
    expect(block).not.toMatch(/on --bg-(canvas|surface|surface-elevated|sunken) = /);
  });
});

describe('lint:color check 11, the selection distance floor', () => {
  it('passes on the real palette and reports the lowest distance', () => {
    const block = lint(CSS, 11, 'real-selection');
    expect(block).toMatch(/^✓ 11\./);
    expect(block).toMatch(/lowest dE \d+\.\d\d/);
  });

  it('fails with the light selection lifted to L 0.91, toward the elevated surface', () => {
    const root = CSS.slice(0, CSS.indexOf('\n.dark {'));
    const decl = /--selection-bg\s*:\s+oklch\(([\d.]+) /.exec(root);
    expect(decl, 'light --selection-bg has no colour value of its own').toBeTruthy();
    const at = CSS.indexOf(decl[0]);
    const css = CSS.slice(0, at) + decl[0].replace(decl[1], '0.910') + CSS.slice(at + decl[0].length);
    const block = lint(css, 11, 'selection-091');
    expect(block).toMatch(/^✗ 11\./);
    expect(block).toMatch(/light: --selection-bg is dE \d\.\d\d from --bg-surface-elevated, floor 7/);
    expect(block).not.toMatch(/dark:/);
  });
});

// The brass hover in light (L 0.52) sits near the resting underline's lightness
// (--border-interactive, L 0.50), so colour alone barely moves on hover and the
// thickness carries it (ruling 13a). That only holds while hover is thicker than
// rest, so it is asserted from the rules themselves.
describe('the link hover is thicker than its rest', () => {
  const thickness = (selector) => {
    const m = new RegExp(`(?:^|\\n)\\s*${selector.replace(/[.:]/g, (c) => `\\${c}`)}\\s*\\{([^}]*)\\}`).exec(CSS);
    expect(m, `${selector} not found`).toBeTruthy();
    const t = /text-decoration-thickness:\s*([\d.]+)px/.exec(m[1]);
    expect(t, `${selector} sets no px thickness`).toBeTruthy();
    return Number(t[1]);
  };
  it('base link: a:hover over a', () => {
    expect(thickness('a:hover')).toBeGreaterThan(thickness('a'));
  });
  it('the unruled band label', () => {
    expect(thickness('.about-work-band--unruled:hover .about-work-band__label'))
      .toBeGreaterThan(thickness('.about-work-band--unruled .about-work-band__label'));
  });
});
