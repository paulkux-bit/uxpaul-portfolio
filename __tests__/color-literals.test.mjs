import { describe, expect, it } from 'vitest';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { scanTree } from '../scripts/color-literals.mjs';

// NOT `new URL('…', import.meta.url)`: Vite statically rewrites that pattern as
// an asset reference, and it resolved to a root-relative '/scripts/fixtures/…'
// that does not exist. Every fixture then reported zero findings — which is
// what a passing negative control also looks like. fileURLToPath is not rewritten.
const FIXTURES = join(dirname(fileURLToPath(import.meta.url)), '..', 'scripts', 'fixtures', 'color-literals');

const results = await scanTree(FIXTURES);
const byFile = Object.fromEntries(results.map((r) => [r.file, r]));
const file = (n) => {
  const r = byFile[n];
  // The load-bearing assertion. A fixture that is never opened produces no
  // findings, which is what a correctly-excluded negative also produces. If
  // this throws, every count below is meaningless rather than passing.
  expect(r, `${n} was never scanned — an absent file cannot pass`).toBeDefined();
  expect(r.scanned).toBe(true);
  return r;
};
const reasons = (r) => r.excluded.map((e) => e.reason);
const matches = (r) => r.accepted.map((a) => a.match);

describe('every fixture file is reached', () => {
  it('scans all five', () => {
    expect(results.map((r) => r.file).sort()).toEqual([
      'negatives.mdx', 'negatives.tsx', 'positives.mdx', 'positives.tsx', 'styles.css',
    ]);
  });
});

describe('positives — .tsx authoring channels', () => {
  const r = () => file('positives.tsx');
  it('finds prefab Tailwind palette utilities in a className', () => {
    expect(matches(r())).toEqual(expect.arrayContaining(['text-slate-700', 'bg-zinc-900', 'border-gray-200']));
  });
  it('finds a named colour in an inline style object', () => {
    expect(matches(r())).toContain('white');
  });
  it('finds a hex in an inline style object', () => {
    expect(matches(r())).toContain('#ff0000');
  });
  it('finds hex and oklch inside Tailwind ARBITRARY values', () => {
    // matched on the bracket syntax rather than on the value, so this line
    // carries no colour literal of its own (check 7 scopes its allowlist to
    // assertion lines, and a helper line would sit outside that scope)
    const arb = r().accepted.filter((a) => a.source.includes('text-['));
    expect(arb.map((s) => s.match)).toEqual(expect.arrayContaining(['#ff0000', 'oklch(']));
  });
  it('finds three-, six- and eight-digit hex', () => {
    expect(matches(r())).toEqual(expect.arrayContaining(['#abc', '#123456', '#ff000080']));
  });
  it('finds rgb, rgba, hsl and hsla calls', () => {
    const fn = r().accepted.filter((a) => a.form === 'func').map((a) => a.match.replace(/\s*\($/, '('));
    expect(fn).toEqual(expect.arrayContaining(['rgb(', 'rgba(', 'hsl(', 'hsla(']));
  });
});

describe('positives — .mdx, the channel the K4 census never proved', () => {
  const r = () => file('positives.mdx');
  it('finds all four MDX literals', () => {
    expect(matches(r())).toEqual(expect.arrayContaining(['bg-emerald-500', '#ff8800', 'rebeccapurple', '#abc']));
  });
  it('accepts nothing from the surrounding prose', () => {
    expect(r().accepted.filter((a) => a.form === 'named' && a.match !== 'rebeccapurple')).toEqual([]);
  });
});

describe('positives — stylesheet channel', () => {
  const r = () => file('styles.css');
  it('finds all eight, including a hex authored as a token value', () => {
    expect(matches(r())).toEqual(expect.arrayContaining(['#ff0000', '#f00', '#ff000080', 'rgb(', 'rgba(', 'hsl(', 'oklch(', 'rebeccapurple']));
  });
});

// The four classes that cost 46 of 67 hits on the K4 census's first run. Each
// asserts the exclusion is PRESENT AND NAMED — not merely that nothing was
// accepted, which a skipped file also satisfies.
describe('negatives — excluded WITH A REASON, never silently dropped', () => {
  it('.tsx: every class is represented, and nothing is accepted', () => {
    const r = file('negatives.tsx');
    expect(r.excluded.length).toBeGreaterThan(0);
    expect(reasons(r)).toEqual(expect.arrayContaining([
      'comment', 'fragment-ref', 'not-a-call', 'prose', 'not-a-hex-length',
    ]));
    expect(matches(r)).toEqual([]);
  });

  it('.mdx: prose and fragment links are excluded, not accepted', () => {
    const r = file('negatives.mdx');
    expect(r.excluded.length).toBeGreaterThan(0);
    expect(reasons(r)).toEqual(expect.arrayContaining(['prose', 'fragment-ref']));
    expect(matches(r)).toEqual([]);
  });

  it('css: white-space is excluded as a property name, not the colour white', () => {
    const r = file('styles.css');
    const ws = r.excluded.filter((e) => e.source.startsWith('white-space'));
    expect(ws.length).toBeGreaterThan(0);
    expect(ws.every((e) => e.reason === 'property-name')).toBe(true);
  });

  it('css: the bare word oklch in color-mix is excluded as not-a-call', () => {
    const r = file('styles.css');
    const km = r.excluded.filter((e) => e.source.includes('color-mix'));
    expect(km.length).toBeGreaterThan(0);
    expect(km.map((e) => e.reason)).toContain('not-a-call');
  });

  it('css: url(#…) fragment references are excluded', () => {
    const r = file('styles.css');
    expect(r.excluded.filter((e) => e.reason === 'fragment-ref').length).toBeGreaterThan(0);
  });

  it('transparent and currentColor are never candidates at all', () => {
    for (const n of ['negatives.tsx', 'styles.css']) {
      const r = file(n);
      const all = [...r.accepted, ...r.excluded].map((h) => h.match.toLowerCase());
      expect(all).not.toContain('transparent');
      expect(all).not.toContain('currentcolor');
    }
  });
});
