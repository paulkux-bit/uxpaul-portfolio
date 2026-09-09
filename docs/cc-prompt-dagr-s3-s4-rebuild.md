# CC prompt: rebuild Dagr sections 3 and 4

**Depends on `docs/cc-prompt-dagr-walk-crops.md` having run**, which produces the Quickview opening
tile. Do not start until that crop exists in `~/Desktop/Dagr Case Study/_crops/`.

Section 5 is a separate pass and is not touched here. No other section, no other study.

## What this pass does

Section 4 currently renders six panel states. Five of the six tiles are panel-dominant, which is why
the section reads as a form rather than as work. This pass **re-sequences it into the order Wilbur
actually moves through**, opening on the tap and alternating map and panel, and re-aims section 3 so
it hands into that.

**Section 4 keeps its prose.** That is deliberate and it is the point of difference from FDT-E's
gate walk, which is a heading, a lede and eight tiles with no prose at all. Dagr's section 4 is a
prose-led section with a sequenced bento. Do not delete the paragraphs.

## Read first

1. `components/case-studies/us-navy-dagr/analysis-manifest.json` and `AnalysisBento.tsx`.
2. `components/bento.tsx`, in particular `overrideRows` and `SLOT_SIZES`, and `lib/bento-slots.json`.
3. `~/Desktop/Dagr Case Study/_crops/manifest.json`.

## 1. Section 3, replaced

Heading, lede and all three paragraphs. Set exactly as written. The bold is deliberate and load
bearing: the heading is a question, and the house rule is that a question heading needs a bolded
answer in the body, or the skim layer gets the question and never the insight.

```mdx
## How do you give an analyst back the hours he spends typing?

<p className="section-lede">Start the analysis where the data already is.</p>

The smart people at Idaho National Laboratory built the line of sight model, and the math is classified. Our team was never going to see inside it, and did not need to. What we owed Wilbur was everything around it that made it easy to use.

I had already built the live data feeds and the filtering onto DoD approved map layers. The filtering lets him narrow to his mission and his airframe, save that setup, and re-run it on a setting he controls. He can still resubmit by hand any time.

**So the map is where a Line of Sight analysis starts.**
```

## 2. Section 4, heading, lede and prose replaced

Keep `<AnalysisBento />` where it is. Replace everything above it.

```mdx
## From a tap on the map to a shape he can brief.

<p className="section-lede">The radar he taps brings its own numbers. He supplies the altitude.</p>

Submit, and the answer comes back as a polygon, the ground that radar can see from that height, cut by every ridge in between.

Analysts rarely want one altitude. A maximum, a minimum and a threshold generate the whole band in a single submit.

Each answer is a layer. He can hide it, recolor it to his unit's legend, or mark one as the mission altitude. Comparing two of them is a click rather than a rebuild, and that is the part of the job that is actually analysis.
```

Three changes from what is live, so you can confirm they landed rather than reverting them as typos:

1. **The first paragraph now starts at "Submit".** Its old opening said the panel wants two things
   and the first arrives with the tap. The new lede says that, so keeping both repeated it four
   lines apart.
2. **"the analyst" becomes Wilbur or he.** Sections 1 and 2 already run Wilbur as the protagonist and
   section 4 was the only place falling back to a generic noun. `Analysts rarely want one altitude`
   stays plural, because that is a class fact rather than him.
3. **The last paragraph no longer says "the one he plans against" or "the rest stay".** The caption
   on the menu tile says both, and a caption that repeats the prose above it teaches nothing.

## 3. The manifest, six tiles in walk order

`04-05-undo.png` is **cut** from section 4. It stays on disk; it is a refinement state, not a step.

| # | file | what it is |
| --- | --- | --- |
| 1 | `04-01-quickview.png` | the tap. New, from the crop pass. |
| 2 | `04-02-one-number.png` | antenna height prefilled, one altitude typed |
| 3 | `04-04-two-headers.png` | a second antenna height, its own group |
| 4 | `04-03-formula.png` | the formula dialog |
| 5 | `04-06-five-shapes.png` | the answers on the map |
| 6 | `04-07-menu.png` | Set as Mission Altitude |

### The composition, settled. Five rows.

```
band      04-01-quickview       the tap
standard  04-02 + 04-04         one number, then a second antenna height
feature   04-03-formula         the band in one submit
feature   04-06-five-shapes     the answers
band      04-07-menu            Set as Mission Altitude
```

### `04-03-formula` must be re-cut wider, and this is not conditional

An earlier version of this brief made the re-cut conditional on a lone `wide` orphaning at half
width. **Your own trace showed it does not orphan: it stretches.** `overrideRows` at
`bento.tsx:123` emits a row of length 1, `BentoTheme` writes that to `data-cols`, and
`globals.css:2986` gives `data-cols='1'` a single `1fr` column, so an unpaired `wide` takes the full
container.

That removes the condition and replaces it with a worse problem. A lone `wide` **renders at 1088
while still declaring `min(calc(50vw - 2.5rem), 536px)`**, so the browser fetches an image sized for
a 536px slot and paints it at 1088. Under-declaring renders visibly soft, where the `standard`
over-declaration found in the last pass only wasted bytes. Same family, opposite sign, and this one
a reader can see.

So: **re-cut `04-03-formula` from its 4320x2700 source to clear 2176w, and slot it `feature`.** That
is a widen of an existing box, not an upscale, and the source has the room. Propose the box and
report it before executing.

**Do not point `crop.py` at `_crops/`.** It writes `manifest.json` into its `output_root` wholesale,
with no merge and no warning, so running it against that folder replaces fourteen records with one
and exits 0. Cut into a scratch directory, move the PNG in by hand, and update the single record in
place. This was found on the Quickview pass and it will keep being true until the tool is fixed.

The measurement behind the slot choice, so you can check it rather than take it: the dialog's own
field labels occupy a 19 to 26px text band in the current 2160-wide crop. At `feature`'s 1088 that
renders about 13px. At `wide`'s 536 it renders about 6.5px, which loses `Max Altitude`,
`Min Altitude` and `Altitude Threshold`, the tile's entire claim.

Report the final rows as a list, with each row's tiles and their shared aspect, and confirm no row
mixes aspects.

## 4. Captions

`{lead, tail}` on the generic adapter, both fields passed through untouched. Set exactly this.

| tile | lead | tail |
| --- | --- | --- |
| `04-01-quickview` | `Quickview.` | `Tapping a threat opens its record, and a Line of Sight analysis starts from here.` |
| `04-02-one-number` | `Antenna Height.` | `Carried in from the equipment record rather than typed. Wilbur supplies the altitude.` |
| `04-04-two-headers` | `Grouped by antenna height.` | `A changed height starts its own group, and the default set stays intact.` |
| `04-03-formula` | `Altitude formula.` | `A maximum, a minimum and a threshold generate the whole band in one submit.` |
| `04-06-five-shapes` | `Where the difference shows.` | `Each altitude draws its own fan. They overlap almost exactly, and the rim is what changes.` |
| `04-07-menu` | `Set as Mission Altitude.` | `The one he plans against. The rest stay for comparison.` |

**Two of these are corrections to live copy, not preferences.**

- `04-02` previously ended "The analyst types the altitude and nothing else." The tile beside it
  shows him editing the antenna height, so "nothing else" was contradicted by its own row.
- `04-06` previously read "Five altitudes, five shapes. Each polygon is the ground the radar can see
  from that height, cut by the terrain between." **The list carries six altitudes and the map shows
  one nested shape**, not five polygons. The caption was wrong twice and is live.

**Alt text is yours**, written from the images rather than from the captions, matched in length and
specificity to the strings already in the manifest. Every value you name must be legible in the
crop. Report each string in your report.

## 5. Gates and evidence

`rm -rf .next` first, because `lint:prose` exits 1 only on zero html files and a stale build prints
PASS. Then `lint:type`, `lint:space`, `lint:color`, `next build`, `lint:interaction`, `lint:prose`
with its page count, `npx vitest run`.

Then:

- **Rendered width per tile at 1440, 900 and a true 390**, by the same same-origin iframe method as
  the last pass, named as such. `standard` stays two-up in the 768 to 1023 band and renders 322;
  `wide` goes one-up and renders 660, wider than its 536 desktop render.
- **The smallest text a reader is meant to read in each tile**, via
  `rendered_text = source_text x (rendered_width / crop_width)`, with a verdict at the narrowest.
- **Section 4's rendered height** at all three widths, before and after.

If a tile fails legibility, stop and report. A re-cut is a crop pass.

## 6. Skim check, and this is the one that decides whether the pass worked

Extract **only** the headings and bolded phrases from the whole study, in page order, and paste the
flat list. Then answer, from that list alone:

- What problem was being solved?
- Who for?
- What failed?
- What changed, and why?

Section 3's heading is a question. **Confirm its bolded answer is in the extraction**, and say which
line carries it. If the four questions cannot all be answered from the flat list, report that rather
than explaining around it.

## 7. Commit

One commit on `case-study/dagr-s3-s4`, merged to main and pushed: the Quickview image, the manifest,
the MDX edits, and this brief saved to `docs/cc-prompt-dagr-s3-s4-rebuild.md`. Verify with
`git diff --cached --name-only`. Never staged: `docs/case-study-house-rules.md`, `docs/_to_delete/`,
`artifacts/`, `Claude outputs/`, any other `docs/cc-prompt-*.md`, the Nuuly plate.

Report the deployed URL, its unauthenticated HTTP status and its `x-robots-tag`, reading deploy
state from the Vercel API rather than polling.

## What not to do

- Do not touch section 5 or any other section, or any other study.
- Do not delete section 4's prose paragraphs.
- Do not re-cut any tile other than `04-03`.
- Do not delete `04-05-undo.png` from disk or from the crops manifest. It is cut from this section,
  not from the project.
- Do not delete the four superseded `works-*.png` images. Still their own cleanup commit.
- Do not reword, re-punctuate or improve any caption or paragraph above.
- No em dashes anywhere, commit message included.

## Flag, do not fix

Anything you would change in the copy, one line each, at the end. Two already known, so do not spend
lines on them: `04-07`'s crop is the moment before the other layers stay on the map, and `Remove`
carries the hover highlight on that tile.
