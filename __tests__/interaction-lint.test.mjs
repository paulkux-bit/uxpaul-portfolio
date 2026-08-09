import { describe, expect, it } from 'vitest';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { run } from '../scripts/lint-interaction.mjs';

// NOT `new URL('…', import.meta.url)`: Vite statically rewrites that pattern as
// an asset reference. It resolved to a root-relative path that did not exist,
// and every fixture then reported zero findings — which is what a passing
// negative control also looks like. Found during the colour migration; the same
// trap would be invisible here.
const FIXTURES = join(dirname(fileURLToPath(import.meta.url)), '..', 'scripts', 'fixtures', 'interaction');

const { checks, scanned } = await run(FIXTURES, { includeFixtures: true });
const check = (id) => {
  const c = checks.find((x) => x.id === id);
  expect(c, `check ${id} did not run`).toBeDefined();
  return c;
};
const where = (c) => [...c.failures, ...c.excluded].map((x) => x.where);
const failFiles = (c) => c.failures.map((x) => x.where.split(':')[0]);
const excReasons = (c) => c.excluded.map((x) => x.reason);

// ── The load-bearing assertion ─────────────────────────────────────────────
// Every count below is meaningless if the files were never opened. A fixture
// that is skipped produces no failures, which is exactly what a correct
// negative control produces (§8).
describe('the fixtures were actually scanned', () => {
  it('reaches every fixture file', () => {
    expect(scanned.css.sort()).toEqual(['clean.css', 'violations.css']);
    expect(scanned.tsx.sort()).toEqual([
      'clean.tsx', 'components/oku/artwork.tsx', 'violations.tsx',
    ]);
  });
  it('runs all nine checks', () => {
    expect(checks.map((c) => c.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
  // Check 9 reads `.next/static/css` relative to the tree it is given. The
  // fixture tree carries its own; if it ever goes missing this assertion is what
  // says so, instead of check 9 quietly finding nothing to complain about.
  it('check 9 read the fixture tree\'s built CSS', () => {
    expect(check(9).failures.map((x) => x.detail).join(' ')).not.toContain('no built CSS');
    expect(excReasons(check(9))).toContain('resolves');
  });
  it('every clean fixture is represented in the output, as exclusions', () => {
    // positive result, not absence of output
    const seen = checks.flatMap(where).map((w) => w.split(':')[0]);
    expect(seen).toContain('clean.css');
    expect(seen).toContain('clean.tsx');
    expect(seen).toContain('components/oku/artwork.tsx');
  });
});

describe('check 1 — literal durations', () => {
  const c = () => check(1);
  it('catches a literal duration', () => {
    expect(c().failures.some((f) => f.detail.includes('240ms'))).toBe(true);
  });
  it('counts a repeated shorthand literal once, not three times', () => {
    const hits = c().failures.filter((f) => f.detail.includes('320ms'));
    expect(hits).toHaveLength(1);
    expect(hits[0].detail).toContain('×3');
  });
  it('never flags a tokenised duration or a transition-delay', () => {
    expect(failFiles(c())).not.toContain('clean.css');
  });
  it('excludes the reduced-motion kill switch BY NAME', () => {
    expect(excReasons(c())).toContain('allowlisted-duration');
  });
});

describe('check 2 — easing tokens', () => {
  const c = () => check(2);
  it('catches a bare keyword easing', () => {
    expect(c().failures.some((f) => f.detail.includes("bare 'ease-in-out'"))).toBe(true);
  });
  it('catches an inline cubic-bezier', () => {
    expect(c().failures.some((f) => f.detail.includes('inline cubic-bezier'))).toBe(true);
  });
  it('excludes token-eased transitions with a reason', () => {
    expect(excReasons(c())).toContain('uses-ease-token');
  });
});

describe('check 3 — radius scale', () => {
  const c = () => check(3);
  it('catches a literal radius', () => {
    expect(c().failures.some((f) => f.detail.includes('6px'))).toBe(true);
  });
  it('excludes a scale token, a reset, and the token definitions by name', () => {
    expect(excReasons(c())).toEqual(expect.arrayContaining([
      'uses-radius-token', 'zero-or-keyword', 'token-definition',
    ]));
  });
});

describe('check 4 — hand-authored svg', () => {
  const c = () => check(4);
  it('catches a hand-drawn icon in .tsx', () => {
    expect(failFiles(c())).toContain('violations.tsx');
  });
  it('catches a non-grain svg payload in CSS', () => {
    expect(failFiles(c())).toContain('violations.css');
  });
  it('excludes case-study artwork via the SHARED allowlist, not a second list', () => {
    const art = c().excluded.filter((x) => x.where.startsWith('components/oku/'));
    expect(art.length).toBeGreaterThan(0);
    expect(art.every((x) => x.reason === 'artwork')).toBe(true);
  });
  it('excludes the paper grain as artwork', () => {
    expect(c().excluded.some((x) => x.where.startsWith('clean.css') && x.reason === 'artwork')).toBe(true);
  });
});

describe('check 5 — icons sized in em', () => {
  const c = () => check(5);
  it('catches size, width and height in px', () => {
    const d = c().failures.map((f) => f.detail).join(' ');
    expect(d).toContain('size={24}');
    expect(d).toContain('width={20}');
    expect(d).toContain('height={20}');
  });
  it('does NOT mistake next/image width for an icon', () => {
    expect(c().failures.some((f) => f.detail.includes('1600'))).toBe(false);
    expect(failFiles(c())).not.toContain('clean.tsx');
  });
  it('excludes an icon sized 1em in BOTH axes by its class', () => {
    expect(excReasons(c())).toContain('sized-1em');
  });
  // The half that was missing at I0. lucide-react 1.28.0 defaults width/height
  // to 24 and writes them as px ATTRIBUTES, so "no size prop" is 24px, not 1em.
  // The first version of check 5 called this clean.
  it('catches an icon with no px prop AND no governing class', () => {
    expect(c().failures.some((f) => f.detail.includes('lucide defaults to 24px'))).toBe(true);
  });
  it('rejects rem as firmly as px — 1.125rem is not 1em', () => {
    expect(c().failures.some((f) => f.detail.includes('1.125rem'))).toBe(true);
  });
});

describe('check 6 — stroke table', () => {
  const c = () => check(6);
  it('catches an --icon-stroke off the table', () => {
    expect(c().failures.some((f) => f.detail.includes('--icon-stroke: 2'))).toBe(true);
  });
  it('catches a strokeWidth off the table', () => {
    expect(c().failures.some((f) => f.detail.includes('strokeWidth={2}'))).toBe(true);
  });
  it('accepts a table value from either surface', () => {
    expect(excReasons(c()).filter((r) => r === 'in-table').length).toBeGreaterThanOrEqual(2);
  });
  // §2.3's containment half, unimplemented at I0 and printed as UNCHECKED:
  // --icon-stroke sits on the CONTAINER, not on the icon.
  it('accepts an icon whose stroke is governed by an ancestor class', () => {
    expect(excReasons(c())).toContain('governed-by-container');
  });
  it('catches an icon governed by neither a prop nor an ancestor', () => {
    expect(c().failures.some((f) => f.detail.includes('no class on it or an ancestor'))).toBe(true);
  });
});

describe('check 7 — hover implies active', () => {
  const c = () => check(7);
  it('catches :hover with no :active', () => {
    expect(c().failures.some((f) => f.detail.includes('.v-hover-only:hover'))).toBe(true);
  });
  it('excludes a complete hover/active pair', () => {
    expect(excReasons(c())).toContain('has-active');
  });
  it('excludes a text link by its written reason', () => {
    expect(excReasons(c())).toContain('allowlisted-no-active');
  });
});

describe('check 8 — no state variants in .tsx', () => {
  const c = () => check(8);
  it('catches all four variant forms', () => {
    const d = c().failures.map((f) => f.detail).join(' ');
    for (const v of ['hover:', 'focus:', 'active:', 'group-hover:']) expect(d).toContain(v);
  });
  it('does not flag the same words used as prose', () => {
    expect(failFiles(c())).not.toContain('clean.tsx');
  });
});

describe('check 9 — dangling classNames', () => {
  const c = () => check(9);
  it('catches a class with no utility and no authored rule', () => {
    expect(c().failures.some((f) => f.detail.includes('v-dangling-wrapper'))).toBe(true);
  });
  it('never fails a clean fixture — every token there resolves or is excluded', () => {
    expect(failFiles(c())).not.toContain('clean.tsx');
  });
  it('resolves against BOTH sources — the built CSS and an authored rule', () => {
    const d = c().excluded.filter((x) => x.reason === 'resolves').map((x) => x.detail).join(' ');
    expect(d).toContain('md:px-8');        // only in .next/static/css/built-stub.css
    expect(d).toContain('c-authored-only'); // only in clean.css
  });
  // The two halves of finding #12. Both used to leave the loop with no record,
  // which is indistinguishable from having resolved.
  it('resolves the important modifier rather than discarding it', () => {
    const d = c().excluded.filter((x) => x.reason === 'resolves').map((x) => x.detail).join(' ');
    expect(d).toContain('mt-24!');
  });
  it('treats an arbitrary value carrying quotes as ONE token, and resolves it', () => {
    const d = c().excluded.filter((x) => x.reason === 'resolves').map((x) => x.detail).join(' ');
    expect(d).toContain("after:content-['']");
    // the shredded fragments the whitespace-only split exists to prevent
    expect(c().failures.some((f) => f.detail.includes("content-['"))).toBe(false);
  });
  it('reports a token shape it cannot resolve, rather than dropping it', () => {
    expect(excReasons(c())).toContain('unrecognized-token-shape');
    expect(c().excluded.some((x) => x.reason === 'unrecognized-token-shape' && x.detail.includes('[&>*]:mt-4'))).toBe(true);
  });
  it('counts a className EXPRESSION it cannot read as a literal class list', () => {
    expect(excReasons(c())).toContain('unparsed-className-expression');
  });
  it('excludes marker classes and counts interpolation', () => {
    expect(excReasons(c())).toEqual(expect.arrayContaining(['marker-class', 'interpolated']));
  });
});

// A check that passes because its input was missing is the shape this migration
// keeps finding — the .mdx gap in the colour migration, and finding #11 here.
// Check 9 is the only check with an external input, so it is the only one that
// can fail this way, and until now nothing asserted that it does not.
describe('check 9 is never green when it cannot see', () => {
  it('fails loudly on a tree with no built CSS', async () => {
    const blind = await run(join(FIXTURES, 'components'), { includeFixtures: true });
    const c9 = blind.checks.find((x) => x.id === 9);
    expect(c9.pass).toBe(false);
    expect(c9.failures.map((x) => x.detail).join(' ')).toContain('no built CSS found');
  });
});
