import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..');
const css = readFileSync(join(REPO, 'app/globals.css'), 'utf8');
const fonts = readFileSync(join(REPO, 'app/fonts.ts'), 'utf8');

// Ruling 9a (16 Oct 2026). next/font's generated fallback was one local(Arial)
// face with no weight descriptor, and html { font-synthesis: none } forbids a
// synthetic bold, so on a Mac or Windows machine every 600 rendered regular
// while Commissioner loaded. These assert the fix from source; the behaviour
// itself needs a machine with Arial and the web font masked.
describe('fallback font keeps its bold', () => {
  const faces = [];
  postcss.parse(css).walkAtRules('font-face', (r) => {
    const d = {};
    r.walkDecls((x) => (d[x.prop] = x.value));
    faces.push(d);
  });
  const fallback = faces.filter((f) => /Commissioner Fallback/.test(f['font-family'] ?? ''));

  it('declares a regular and a bold Commissioner Fallback face', () => {
    expect(fallback.length).toBe(2);
    const bold = fallback.find((f) => /Arial Bold/.test(f.src));
    expect(bold, 'a face sourced from local("Arial Bold")').toBeTruthy();
    expect(bold['font-weight']).toBe('600 720');
    const regular = fallback.find((f) => f !== bold);
    expect(regular['font-weight']).toBe('340 599');
  });

  it('puts the fallback family in --font-sans, after Commissioner', () => {
    expect(css).toMatch(/--font-sans:\s*var\(--font-commissioner\),\s*"Commissioner Fallback",/);
  });

  it('turns off the generated fallback that has no bold', () => {
    expect(fonts).toMatch(/adjustFontFallback:\s*false/);
  });
});
