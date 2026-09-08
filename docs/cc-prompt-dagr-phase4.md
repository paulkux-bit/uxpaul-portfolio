# CC prompt: rebuild Dagr section 4 on the six new crops

Phase 4. Section 4 only. **Do not touch section 5**, which is phase 5's, and do not add a section.

The six crops are cut and approved. This pass moves them into `public/`, rewrites
`analysis-manifest.json` from four images to six, and replaces section 4's three prose paragraphs.
Copy below is final and comes from Paul. Set it as given.

## Read first

1. `components/case-studies/us-navy-dagr/analysis-manifest.json` and `AnalysisBento.tsx`.
2. `components/case-studies/uscg-bard/ResolutionsBento.tsx`, the generic adapter Dagr uses. Confirm
   from source how it handles a `breakout` entry, since tile 07 is a band inside the composition
   and no Dagr module has used a breakout before.
3. `~/Desktop/Dagr Case Study/_crops/manifest.json`, the source of every geometry value below.
4. `components/bento.tsx` and `lib/bento-slots.json`.

## 1. Move the six into `public/`

Copy, do not move, from `~/Desktop/Dagr Case Study/_crops/` to
`public/case-studies/us-navy-dagr/`. The staging folder stays intact; phase 5 needs the other seven.

```
04-02-one-number.png
04-04-two-headers.png
04-03-formula.png
04-05-undo.png
04-06-five-shapes.png
04-07-menu.png
```

Then report whether `works-panel.png`, `works-formula.png`, `works-band.png` and
`works-primary.png` are referenced anywhere else in the repo after this pass. **Report only.** Do
not delete them in this commit.

## 2. Rewrite `analysis-manifest.json`

Six images. Take `width`, `height`, `ratio` and `focalPoint` from the crops manifest, and re-derive
`ratio` from the file on disk rather than copying the string, per that manifest's own `$ratioDoc`.

**Captions** use the generic adapter's `{lead, tail}` shape. Both fields pass through untouched, no
`". "` split. Set exactly this, including the full stops:

| file | slot | lead | tail |
| --- | --- | --- | --- |
| `04-02-one-number.png` | standard | `Antenna Height.` | `Carried in from the equipment record. The analyst types the altitude and nothing else.` |
| `04-04-two-headers.png` | standard | `Grouped by antenna height.` | `A changed height starts its own group, and the default set stays intact.` |
| `04-03-formula.png` | wide | `Altitude formula.` | `A maximum, a minimum and a threshold generate the whole band in one submit.` |
| `04-05-undo.png` | wide | `Reversible edits.` | `Removing an altitude can be undone from the toast that reports it.` |
| `04-06-five-shapes.png` | feature | `Five altitudes, five shapes.` | `Each polygon is the ground the radar can see from that height, cut by the terrain between.` |
| `04-07-menu.png` | band | `Set as Mission Altitude.` | `The analyst marks the altitude he plans against. The rest stay on the map to check it against.` |

**`mode`.** Every composition entry needs one. Dagr is dark-only with one file per image, so write
`"light"` on all six, which is FDT-E's precedent for a dark-only manifest, not an invention.

**Alt text is yours to write**, from the images rather than from the captions. Alt is description,
not voice. Match the length and specificity of the four alt strings currently in this manifest and
of `expires-quickview` in the MDX: name the readable values, not the mood. Every value you name must
be legible in the crop. Report each string in your report so Paul reads them before they ship.

**Composition.** Four rows.

```
[ 04-02, 04-04 ]      standard pair, both 0.750
[ 04-03, 04-05 ]      wide pair, both 1.600
  04-06               feature solo, 1.600
  04-07               band, breakout, aspect 1.714
```

Carry over the crops manifest's `$orderDoc`, `$slotDoc` and `$ratioDoc` notes, reworded for this
file's context. `$orderDoc` matters most: file numbers are not document order, section 4 runs 02,
04, 03, 05 so the two 3:4 panel tiles pair and the two 16:10 tiles pair, and the files are
deliberately not renamed because the composition names tiles explicitly.

**Verify before you build** that every row is aspect-consistent, and that the band entry is
reachable through this adapter. `BentoItem` renders `<Image fill>` with cover, so a slot whose
aspect differs from the crop silently takes the sides off. That failure hit two of fifteen crops in
phase 3 and nothing in the lint suite catches it.

## 3. Replace section 4's prose

Heading and lede unchanged. Replace the three paragraphs between the lede and `<AnalysisBento />`
with exactly this, no re-punctuation:

```mdx
The panel needs two things: how high the radar's antenna sits, and which altitudes to check. The first arrives with the radar he tapped. He types the second. Submit, and the answer comes back as a polygon, the ground that radar can see from that height, cut by every ridge in between.

Analysts rarely want one altitude. A maximum, a minimum and a threshold generate the whole band in a single submit.

Each answer is a layer. He can hide it, recolor it to match his unit's legend, or set one as the mission altitude, the one he plans against and weighs the others by. Every answer stays on the map, so comparing two of them is a click rather than a rebuild. That is the part of the job that is actually analysis.
```

Three deliberate changes from what is there now, so you can confirm they landed rather than
reverting them as typos:

1. The panel's second input now arrives with the tap instead of being typed. The frames show antenna
   height prefilled at 59.64 from the equipment record, which contradicted the old sentence.
2. `step` becomes **threshold**, matching the shipped field name `Altitude Threshold`.
3. `Primary is the recommendation` is gone. The shipped control is `Set as Mission Altitude`, and it
   is the analyst's own pick of the altitude he plans against.

## 4. Gates and evidence

`rm -rf .next` first, because `lint:prose` exits 1 only on zero html files and a stale build prints
PASS. Then in order: `lint:type`, `lint:space`, `lint:color`, `next build`, `lint:interaction`,
`lint:prose`, `npx vitest run`. Report the `lint:prose` page count.

Then, and this is the part that decides whether the pass holds:

- **Rendered width and rendered type size for all six tiles** at 1440, at 900, and at a true 390px
  viewport. Name the method that produced the 390 number. The formula is
  `rendered_text = source_text x (rendered_width / crop_width)`; aspect is irrelevant, only crop
  width matters.
- For each tile, **the smallest text a reader is meant to read**, and whether it clears legibility
  at the narrowest of the three. `wide` renders at **660 in the 768 to 1023 band**, wider than its
  536 desktop render, so the 900 measurement is the one no desktop review has ever seen.
- The `sizes` and `srcset` actually emitted per tile, and whether the served width matches the
  rendered width times the device pixel ratio.

**If any tile fails legibility, stop and report rather than re-cropping.** A re-cut is a crop pass,
not this pass.

## 5. Commit

One commit on `case-study/dagr-section-4`, merged to main and pushed: six images, the manifest, the
MDX edit. Nothing else. Verify with `git diff --cached --name-only`. Do not commit
`docs/case-study-house-rules.md`, `docs/_to_delete/`, `artifacts/`, `Claude outputs/`, any
`docs/cc-prompt-*.md` beyond saving this one, or the Nuuly plate.

Save this prompt to `docs/cc-prompt-dagr-phase4.md`.

Report the deployed URL, its unauthenticated HTTP status and its `x-robots-tag`, reading deploy
state from the Vercel API rather than polling the URL.

## What not to do

- Do not touch section 5, the two `BentoBand`s in it, or any other section or study.
- Do not re-crop, resize, replace or upscale any image.
- Do not change the heading or the lede.
- Do not reword, re-punctuate or improve any caption or prose string above. They are Paul's.
- Do not delete the four superseded images in this commit.
- Do not add a CSS rule or a class.
- No em dashes in anything you write, commit message included.

## Flag, do not fix

Anything you would change in the copy above if asked, one line each, at the end of the report. Paul
runs a full copy pass across all eight sections after phase 5 and your flags feed it.
