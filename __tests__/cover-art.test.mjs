import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { COVER_ART } from '../components/case-study-card.tsx';
import { caseStudies } from '../app/data/case-studies.ts';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..');
const COVERS = 'public/case-studies/covers';

// The Delivery Promise card shipped with no cover illustration and a large void
// where the picture should be. COVER_ART is keyed by slug and still held
// 'urbn-shipping'; 0ee2dcc had renamed the slug to 'urbn-delivery-promise'. The
// lookup missed, `art` came back undefined, and the card took its `art ? … : null`
// branch. The assets were correct and present the whole time. grid-auto-rows: 1fr
// equalising card heights is what turned a missing 40%-width <picture> into a hole.
//
// Six gates were green on it. None of them looks at the index.
//
// TOLERANT AT RUNTIME, LOUD IN CI. This looks like a contradiction and is not.
// The component keeps `art ? … : null`, because a card should never crash over a
// missing illustration and a reader mid-session is better served by a card with
// no picture than by a stack trace. The test is strict, because a missing
// illustration should never be SILENT. The runtime handles it; CI refuses to let
// it reach the runtime unnoticed. Do not "fix" the component to throw, and do not
// relax the test to match the component.
//
// WHY THIS IMPORTS RATHER THAN PARSES. canon.test.mjs and
// claude-md-typography.test.mjs read their subjects as text, but only because
// Markdown has no importable form. COVER_ART is TypeScript, so parsing it would
// be choosing the weaker instrument: a regex over an object literal is a grep,
// and a grep that returns nothing is a claim about the pattern, not about the
// repo. Restructure the map later - a computed key, a spread, a comment holding a
// quoted slug - and a parse silently returns the wrong set and goes green. That
// is the same silent-wrong-answer failure this file exists to catch, so the guard
// is not built out of the material that failed.
describe('cover art is keyed to real slugs and real files', () => {
  const slugs = new Set(caseStudies.map((s) => s.slug));
  const entries = Object.entries(COVER_ART);

  // 1. The defect itself. This is the assertion that would have gone red the
  // moment 0ee2dcc landed, naming the slug that no longer exists.
  it('every COVER_ART key is a published slug', () => {
    const orphans = entries.map(([slug]) => slug).filter((slug) => !slugs.has(slug));
    expect(
      orphans,
      `COVER_ART keys match no study in app/data/case-studies.ts: ${orphans.join(', ')}`,
    ).toEqual([]);
  });

  // 2. The <picture> declares a webp <source> and a png <img>, so half a pair is
  // a defect in whichever browser gets the missing half - and the png half is the
  // one every browser falls back to.
  it('every COVER_ART value resolves to both a webp and a png', () => {
    for (const [slug, art] of entries) {
      for (const ext of ['webp', 'png']) {
        const rel = `${COVERS}/${art}.${ext}`;
        expect(existsSync(join(REPO, rel)), `${slug} -> ${art}, but ${rel} is missing`).toBe(true);
      }
    }
  });

  // 3. STRICT ON PURPOSE, AND THERE IS NO OPT-OUT. All five studies have art. If
  // a sixth genuinely should not, this failing is the prompt to argue that case,
  // not a bug to route around. Adding a `string | null` opt-out now would
  // pre-authorise shipping a study with no illustration before anyone has made
  // that argument, and it is one type widening away at the moment it is needed.
  it('every published study has a COVER_ART entry', () => {
    const bare = caseStudies.map((s) => s.slug).filter((slug) => !(slug in COVER_ART));
    expect(
      bare,
      `studies with no cover art declared: ${bare.join(', ')}. If one deliberately has none, that is a conversation, not a missing key.`,
    ).toEqual([]);
  });

  // 4. This one protects assertion 3's strictness rather than guarding a bug that
  // has happened. With 3 strict, the path of least resistance for someone facing
  // a red test is to point the new study at a neighbour's picture and move on -
  // which converts "declare this study has no art" into "quietly duplicate
  // someone else's", and that is worse than the original defect because the card
  // then looks fine.
  it('no two studies share the same art', () => {
    const seen = new Map();
    const dupes = [];
    for (const [slug, art] of entries) {
      if (seen.has(art)) dupes.push(`${art}: ${seen.get(art)} and ${slug}`);
      else seen.set(art, slug);
    }
    expect(dupes, `two studies point at one illustration: ${dupes.join('; ')}`).toEqual([]);
  });
});
