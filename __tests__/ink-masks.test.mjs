import { describe, expect, it } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// A section 1 drawing's dark-mode ink is a CSS mask (FramedPair `darkMask`). A
// mask image that 404s does not show an error or a box: per the masking spec it
// counts as fully transparent, so the drawing silently disappears in dark mode
// and every light-mode check stays green. This is the check that sees it.
//
// It reads the MDX as text, which is a grep, and that is acceptable here because
// it only has to FIND the declared bases; a base it misses is a base nobody
// declared. The failure it exists for is a declared base with a missing file.

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..');
const MDX = join(REPO, 'app/content/case-studies');
const WIDTHS = [640, 1080]; // INK_MASK_WIDTHS in components/framed-pair.tsx

const bases = readdirSync(MDX)
  .filter((f) => f.endsWith('.mdx'))
  .flatMap((f) => [...readFileSync(join(MDX, f), 'utf8').matchAll(/darkMask:\s*'([^']+)'/g)].map((m) => m[1]));

describe('dark-mode ink masks', () => {
  it('finds the two declared masks', () => {
    expect(bases.length).toBe(2);
  });

  it('every declared mask has its 640 and 1080 file in AVIF and WebP', () => {
    const missing = bases.flatMap((base) =>
      WIDTHS.flatMap((w) => ['avif', 'webp'].map((ext) => `public${base}-${w}.${ext}`)),
    ).filter((rel) => !existsSync(join(REPO, rel)));
    expect(missing, `mask files missing: ${missing.join(', ')}`).toEqual([]);
  });
});
