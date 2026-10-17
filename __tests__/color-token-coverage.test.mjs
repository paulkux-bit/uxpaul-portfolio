import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..');

// Coverage by value, not by name (step 6 part 4, ruling 4.1a, 16 Oct 2026).
// Every custom property in globals.css whose value holds an oklch() or a
// color-mix() is a colour token, whatever it is called, and the colour spec
// owes it a table row. A list of names would miss the next token someone adds;
// reading the values cannot. Found 25 on the day it was written, nine of them
// without a row (the component, interaction and effect tokens).
describe('every colour token has a row in the colour spec', () => {
  const css = readFileSync(join(REPO, 'app/globals.css'), 'utf8');
  const spec = readFileSync(join(REPO, 'docs/color-system-v2-locked.md'), 'utf8');

  const tokens = [...new Set(
    [...css.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/g)]
      .filter((m) => /oklch\(|color-mix\(/i.test(m[2]))
      .map((m) => m[1]),
  )].sort();
  const rows = new Set([...spec.matchAll(/^\|\s*`(--[a-z0-9-]+)`/gm)].map((m) => m[1]));

  it('finds the colour tokens', () => {
    expect(tokens.length).toBeGreaterThan(20);
  });

  it('gives each one a row', () => {
    expect(tokens.filter((t) => !rows.has(t))).toEqual([]);
  });
});
