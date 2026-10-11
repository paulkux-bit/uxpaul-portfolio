// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { templateB } from '../app/data/template-b.ts';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..');
const { images } = JSON.parse(readFileSync(join(REPO, 'app/data/client-work-images.json'), 'utf8'));
const FORMATS = ['avif', 'webp'];

// The client work dialog's delivery files are generated offline by
// scripts/build-client-work.mjs and committed. That script also writes the
// manifest the dialog reads. This is what notices when the three disagree: a
// piece added to template-b.ts with no encode run, a file deleted, or a
// re-encode whose sizes no longer match the manifest. The dialog would then ask
// for a file that is not there, and no build gate looks at a closed dialog.
//
// A TEST, NOT A GATE, on purpose. The brief asked for no new build gate, so
// this is the same assertion lint-works makes for the fine art, run by vitest.
describe('client work images', () => {
  const srcs = templateB.flatMap((p) => p.images.map((i) => i.src));

  it('every image in template-b.ts has a manifest record, and nothing else does', () => {
    expect(Object.keys(images).sort()).toEqual([...srcs].sort());
  });

  it('every image src sits in its own piece folder', () => {
    for (const piece of templateB) {
      for (const image of piece.images) {
        expect(dirname(image.src)).toBe(`/client-work/${piece.slug}`);
      }
    }
  });

  it('every rung exists in both formats at its recorded pixel size, and never upscales', async () => {
    for (const [src, record] of Object.entries(images)) {
      expect(record.files.length).toBeGreaterThan(0);
      for (const { width, height } of record.files) {
        expect(width).toBeLessThanOrEqual(record.master.width);
        for (const format of FORMATS) {
          const path = join(REPO, 'public', `${src}-${width}.${format}`);
          expect(existsSync(path), path).toBe(true);
          const meta = await sharp(path).metadata();
          expect([meta.width, meta.height], path).toEqual([width, height]);
        }
      }
    }
  });

  it('no stray file sits in a piece folder', () => {
    for (const piece of templateB) {
      const dir = join(REPO, 'public/client-work', piece.slug);
      const expected = new Set(
        Object.entries(images)
          .filter(([src]) => dirname(src) === `/client-work/${piece.slug}`)
          .flatMap(([src, r]) => r.files.flatMap(({ width }) => FORMATS.map((f) => `${basename(src)}-${width}.${f}`))),
      );
      expect(readdirSync(dir).sort()).toEqual([...expected].sort());
    }
  });

  // The dialog's copy is locked, and lint:prose only sees what a closed dialog
  // renders. Hold the data itself to the UI-text rules: no em dash, no middle
  // dot, no semicolon.
  it('no em dash, middle dot or semicolon in any piece', () => {
    for (const piece of templateB) {
      expect(JSON.stringify(piece), piece.slug).not.toMatch(/[—·;]/);
    }
  });
});
