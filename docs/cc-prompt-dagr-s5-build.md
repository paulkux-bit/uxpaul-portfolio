# CC prompt: add Dagr section 5, and trim section 3 in the same commit

One commit. A new section is inserted between section 4 and the expiry section, and section 3 gives
up two clauses that section 5 and the expiry section now own.

**No renumbering is needed.** Sections in this MDX are `<section className="cs-section">` blocks with
`##` headings and carry no numbers, so inserting one changes nothing downstream. Confirm that before
you build and say so if you find otherwise.

## Read first

1. `components/case-studies/us-navy-dagr/AnalysisBento.tsx` and `analysis-manifest.json`, the pattern
   the two new modules copy.
2. `components/case-studies/uscg-bard/ResolutionsBento.tsx`, the generic adapter both use.
3. `app/content/case-studies/uscg-bard.mdx`, the section headed
   **"The form bends. The record underneath does not."** It runs five bento modules with prose
   between them. Section 5 is the same shape at smaller scale, so it is precedent rather than
   invention.
4. `~/Desktop/Dagr Case Study/_crops/manifest.json` for geometry.

## 1. Section 3, two clauses removed

`app/content/case-studies/us-navy-dagr.mdx`. The second paragraph currently reads:

```
I had already built the live data feeds and the filtering onto DoD approved map layers. The
filtering lets him narrow to his mission and his airframe, save that setup, and re-run it on a
setting he controls. He can still resubmit by hand any time.
```

It becomes one sentence, merged with the line that follows it:

```
I had already built the live data feeds and the filtering onto DoD approved map layers. So the map is where a Line of Sight analysis starts.
```

**Why, so you do not restore it.** That paragraph was pre-empting two later sections. The filtering
detail is section 5's second beat. The saving is section 5's sources tile. **The re-running is the
expiry section's entire point**, and that section already carries it in a bold, in prose and in a
caption. Section 3 drops from about 92 body words to about 62, which puts it between BARD's 44 and
FDT-E's 80 rather than above both.

Nothing else in section 3 changes. Heading, lede, first paragraph and its bold all stay.

## 2. Section 5, new

Insert a complete `<section className="cs-section">` after section 4's closing tag and before
`## The picture goes out of date before takeoff.` Copy is final. Set it as given.

```mdx
## He stopped going out to get the threat data.

<p className="section-lede">One search across the national records, filtered to his airframe.</p>

Line of Sight needed two things: where the threats are, and what the equipment at them can do. The live feed brought both, and every threat arrived carrying its own characteristics. That is why the panel already knew the antenna height was 59.64 feet. Wilbur never looked it up.

<IngestBento />

**Most of what arrives does not matter to the mission he is briefing.** He filters it down to what matters to this aircraft. What is left is small enough to work through, and working through it is the brief.

<FiltersBento />

The next step was to start from the route instead of the radar. A fighter and a helicopter fly into different risks, so the mission and the airframe should choose the threats, and choose them fast.
```

**Two deliberate things in that copy**, so you can confirm they landed rather than smoothing them.

**"He filters it down" is active on purpose.** Filtering is shipped and he does it by hand. The last
paragraph says the mission and the airframe *should* choose the threats, which is the automation and
is not built. The whole contrast is **who does the work**, and it is the section's senior claim.
Do not make either sentence passive and do not let the last paragraph read as shipped.

**The last paragraph is direction, not delivery.** It has no bold, deliberately, so the skim layer
does not present unbuilt work as done.

Two imports go at the top of the file beside the existing `BentoBand` import.

## 3. Two modules, not one

`components/case-studies/us-navy-dagr/`, both five-line wrappers over the generic adapter exactly
like `AnalysisBento.tsx`:

- `IngestBento.tsx` with `ingest-manifest.json`
- `FiltersBento.tsx` with `filters-manifest.json`

Two modules in one section is house rather than a stretch: BARD's "The form bends" section runs
five, Nuuly's "The hard part wasn't the screen" runs four, and Dagr's own expiry section runs two.

## 4. The five tiles, their slots and their rows

Copy from `_crops/` to `public/case-studies/us-navy-dagr/`. Re-read width, height and ratio from the
copied files with `sips`, never carried forward, per the crops manifest's own `$ratioDoc`.

**`IngestBento`**

| file | slot | rows |
| --- | --- | --- |
| `05-08-radius.png` | band, aspect 1.6 | row 1, solo |
| `05-09-summary.png` | standard | row 2, paired |
| `05-10-sources.png` | standard | row 2, paired |

**`FiltersBento`**

| file | slot | rows |
| --- | --- | --- |
| `05-11-equipment-tree.png` | standard | row 1, paired |
| `05-12-analysis-layers.png` | standard | row 1, paired |
| `05-14-tailored.png` | feature | row 2, solo |

**`05-11` and `05-12` must stay paired**, and this is not cosmetic. A lone `standard` does not
orphan, it stretches to the full 1088 container while still declaring
`min(calc(50vw - 2.5rem), 536px)`, so the browser fetches a 536-sized image and paints it at 1088,
which renders visibly soft. It would also be 3:4 at 1088, so about 1451px tall. That is the same
defect found on a lone `wide` during the section 4 rebuild, in the same family.

Verify every row is aspect-consistent and report the rows as a list.

## 5. Captions

`{lead, tail}` on the generic adapter, both fields passed through untouched.

| tile | lead | tail |
| --- | --- | --- |
| `05-08-radius` | Where to look. | A centre point and a radius. That is the whole query. |
| `05-09-summary` | Order of Battle Search. | It says what it found before he runs it. |
| `05-10-sources` | Sources. | Named and time-stamped, so he can say where the picture came from. |
| `05-11-equipment-tree` | Down to the type. | Counts at every level, down to eight of a single kind. |
| `05-12-analysis-layers` | Selected, not all. | Four radars chosen for this analysis rather than every emitter in the area. |
| `05-14-tailored` | Tailored to the airframe. | A route, the threats that bear on it, and the one he opened. Designed, not built. |

**`05-14`'s tail carries its own provenance flag.** That tile is a design, not a shipped build, and
the precedent for labelling it inside the caption is `took-3d.jpg`, which already says "An earlier
build of the same panel." **Do not soften "Designed, not built" and do not move it into alt text.**

**Alt text is yours**, written from the images rather than from the captions, matched in length and
specificity to the strings already in `analysis-manifest.json`. Every value you name must be legible
in the crop. Report each string.

## 6. `05-13-two-shapes` is staged and not mounted

It stays in `_crops/` and in the crops manifest, untouched. It is not deleted and it is not moved to
`public/`.

Reason, recorded so nobody re-adds it by accident: it is 16:10 where the filters module is a 3:4
pair plus a feature, so it has no row to join, and its picture shows two analyses over one radar,
which argues a claim this section does not make. It carries the `RCS 10.00 m2 / Antenna Height:
59.64 ft` header that would evidence the first paragraph, so it may come back after a re-cut toward
the panel. **That is a later decision and not this pass's.**

## 7. Gates and evidence

`rm -rf .next` first, because `lint:prose` exits 1 only on zero html files and a stale build prints
PASS. Then `lint:type`, `lint:space`, `lint:color`, `next build`, `lint:interaction`, `lint:prose`
with its page count, `npx vitest run`. State every result.

**Kill the right process before measuring.** The dev server is `next-server`, not `next dev`. A stale
server serving the old build produced a too-perfect null on the last pass.

Then:

- Rendered width per tile at 1440, 900 and a true 390, same-origin iframe, named as the method.
- Smallest read-me text per tile via `rendered_text = source_text x (rendered_width / crop_width)`,
  with a verdict at the narrowest.
- Section 5's rendered height at all three widths, and the page total before and after.

If a tile fails legibility, stop and report rather than re-cropping.

## 8. Skim check

Extract only headings and bolded phrases across the whole study, in page order, paste the flat list,
and answer from it alone: what problem, who for, what failed, what changed and why.

Then two specific checks:

1. **Section 5 contributes one heading and one bold.** Confirm the bold is the filtering line and
   that the direction paragraph contributes nothing, which is intended.
2. **Report the study's total bold count**, MDX spans and rendered `<strong>`s separately. It was
   seven and nine before this pass. BARD ships three in its body and FDT-E four, so if Dagr is
   drifting the copy pass needs the number.

## 9. Commit

One commit on `case-study/dagr-s5`, merged to main and pushed: five images, two components, two
manifests, the MDX edits, and this brief saved to `docs/cc-prompt-dagr-s5-build.md`. `git fetch`
first. Verify with `git diff --cached --name-only`.

Never staged: `docs/case-study-house-rules.md`, `docs/_to_delete/`, `artifacts/`, `Claude outputs/`,
any other `docs/cc-prompt-*.md`, the Nuuly plate.

Report the deployed URL, its unauthenticated HTTP status and its `x-robots-tag`, reading deploy state
from the Vercel API rather than polling.

## What not to do

- Do not delete or move `05-13-two-shapes.png`, `04-05-undo.png`, or the four `works-*.png`. The
  orphan cleanup is its own commit.
- Do not point `crop.py` at `_crops/`. It writes `manifest.json` into its `output_root` wholesale
  with no merge and no warning. Nothing in this pass should run it at all.
- Do not re-cut, resize or upscale any image.
- Do not touch section 4, the expiry section, or any other section beyond section 3's two clauses.
- Do not reword, re-punctuate or improve any caption or paragraph above.
- No em dashes anywhere, commit message included.

## Flag, do not fix

Anything you would change in the copy, one line each, at the end. Three are already known and should
not be spent lines on: section 3 no longer mentions the three-dimensional threat picture anywhere in
the study, `04-06`'s caption is true and unillustrated, and `04-01`'s claim cannot be checked against
its own image.
