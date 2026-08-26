import { describe, expect, it } from 'vitest';
import manifest from '../components/case-studies/urbn-delivery-promise/testimony-manifest.json';

// TestimonyPair's invention is the LEVELNESS, not the quotes. The argument it
// carries is two sources, the same measure, opposite answers - "could not tell
// you how long" against "could tell you what it cost" - and that only reads as a
// parallel when both leads sit at the same height. Measured at 1440: both top at
// 1239, two lines each. If either grows to three lines the module degrades into
// two stacked blockquotes and the argument evaporates. That is exactly why the
// lead-underneath variant (A1 in docs/previews/quote-pair-A.html) was rejected:
// quotes of different lengths put the takeaways at different heights.
//
// Until now that was guarded by nothing but a conversation.
//
// THIS INSTRUMENT IS A PROXY AND A FUTURE READER MUST KNOW IT. Character count is
// not the thing that matters; rendered lines at desktop is. The precedent is the
// hero plain anchor, where a guideline of about 160 characters was contradicted by
// every shipped page once anyone measured - BARD 170, Nuuly 172, Delivery Promise
// 179, FDT-E 231 - and where the number that actually mattered was rendered lines,
// which held at four for three of the four. A character budget in this repo has
// already been wrong about every page it governed.
//
// So: assertion 3 is the one that tracks levelness, because two leads of similar
// length wrap alike. Assertion 2 is a coarse ceiling pinned to the last value
// anyone actually rendered. THE REAL CHECK IS THE RENDER. This test exists so that
// an edit which breaks levelness fails loudly in CI instead of silently in the
// layout.
describe('TestimonyPair leads stay level', () => {
  const cells = manifest.cells;
  const leads = cells.map((c) => c.lead);

  // 68 is the LAST KNOWN-GOOD value, not a round number, and the zero headroom is
  // deliberate. Measured: 68 chars wraps to two lines, 66 to two, 73 to THREE. The
  // break is somewhere in 69-72 and nobody has rendered it, so a ceiling above 68
  // could pass a lead that is already three lines - the exact failure this file
  // exists to catch. Any lengthening should fail here and force a re-render rather
  // than being absorbed by slack. Raise it only with a measurement attached.
  const MAX_LEAD = 68;

  // Two leads within 10 characters of each other wrap alike at the same column
  // width. This is the assertion that actually tracks the invention.
  const MAX_DELTA = 10;

  it('has exactly two cells, each fully populated', () => {
    expect(cells).toHaveLength(2);
    for (const cell of cells) {
      for (const field of ['lead', 'quote', 'source']) {
        expect(cell[field], `cell "${cell.source}" has an empty ${field}`).toBeTruthy();
        expect(typeof cell[field]).toBe('string');
      }
    }
  });

  it(`each lead is at most ${MAX_LEAD} characters`, () => {
    for (const lead of leads) {
      expect(
        lead.length,
        `"${lead}" is ${lead.length} chars, over the ${MAX_LEAD} ceiling. 73 was measured at three rendered lines, which breaks the pair. Re-render before raising this.`,
      ).toBeLessThanOrEqual(MAX_LEAD);
    }
  });

  it(`the two leads differ by at most ${MAX_DELTA} characters`, () => {
    const delta = Math.abs(leads[0].length - leads[1].length);
    expect(
      delta,
      `leads are ${leads[0].length} and ${leads[1].length} chars, ${delta} apart. Beyond ${MAX_DELTA} they stop wrapping alike and the two takeaways land at different heights, which is the one thing the layout exists to prevent.`,
    ).toBeLessThanOrEqual(MAX_DELTA);
  });

  // A doc that says why the numbers are what they are, coupled to the file that
  // carries them. Same reasoning as the $orderDoc/RoadmapTable pairing: a manifest
  // that records a constraint and a test that enforces it must not drift apart.
  it('the manifest records why levelness matters', () => {
    expect(manifest.$levelnessDoc).toMatch(/levelness is the invention/i);
    expect(manifest.$levelnessDoc).toMatch(/axis, not by ornament/i);
  });
});
