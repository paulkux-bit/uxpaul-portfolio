import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..');

// The canon table in CLAUDE.md names which specs govern this repo and which
// gate enforces each. It is the first thing anyone authoring here reads, and it
// was wrong for the whole interaction migration: it said "The three locked
// specs are canonical" while a fourth was being written, locked and gated.
//
// Nothing caught that, because nothing was looking. A table maintained by hand
// drifts from the filesystem silently, and this one drifts in the direction
// that matters — it under-reports what an author is required to read.
//
// So the filesystem is the source and the table is checked against it, in BOTH
// directions: a locked spec with no row, and a row naming a spec or a script
// that does not exist, are both failures. When a fifth system is locked this
// goes red until its row is added. That is the point, and the fix is the row,
// never the deletion.
describe('CLAUDE.md canon table matches the filesystem', () => {
  const claude = readFileSync(join(REPO, 'CLAUDE.md'), 'utf8');
  const pkg = JSON.parse(readFileSync(join(REPO, 'package.json'), 'utf8'));

  const lockedOnDisk = readdirSync(join(REPO, 'docs'))
    .filter((f) => f.endsWith('-locked.md'))
    .map((f) => `docs/${f}`)
    .sort();

  // rows look like: | Type | `docs/x-locked.md` | `npm run lint:type` — 9 checks |
  const rows = [...claude.matchAll(/^\|\s*[^|]+\|\s*`(docs\/[^`]+)`\s*\|\s*`npm run ([^`]+?)`[^|]*\|/gm)]
    .map((m) => ({ spec: m[1], script: m[2].trim() }));

  it('every docs/*-locked.md has a row', () => {
    expect(rows.map((r) => r.spec).sort()).toEqual(lockedOnDisk);
  });

  it('every row names a spec that exists', () => {
    for (const r of rows) {
      expect(existsSync(join(REPO, r.spec)), `${r.spec} is named in CLAUDE.md but not on disk`).toBe(true);
    }
  });

  it('every row names a script that exists in package.json', () => {
    for (const r of rows) {
      expect(pkg.scripts, `CLAUDE.md names \`npm run ${r.script}\` for ${r.spec}`).toHaveProperty(r.script);
    }
  });

  // The claim the table makes is that these gates RUN. A row naming a real
  // script that no build invokes is the same kind of false comfort as a row
  // naming a spec that does not exist.
  it('every named gate is wired into npm run build', () => {
    for (const r of rows) {
      expect(pkg.scripts.build, `${r.script} is in the canon table but not in the build`)
        .toContain(`npm run ${r.script}`);
    }
  });

  it('there are four locked systems and four gates', () => {
    expect(lockedOnDisk).toHaveLength(4);
    expect(rows).toHaveLength(4);
  });
});
