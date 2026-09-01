# Delivery Promise (URBN) — build brief for Claude Code

Fourth Template A case study. Content is drafted and measured. This brief covers
the build only.

**Stop at the diff. Paul commits.**

Written 23 Aug 2026 from a Cowork session that ran the `case-study` skill
interview, a seven-seat council review, and two render cycles on the journey
module. Every number below was measured, not assumed.

---

## 0. Read these first, in this order

1. `docs/type-system-v3-locked.md` — amended 22 Aug for Commissioner
2. `claude/case-study-house-rules-learned.md` (project knowledge)
3. `claude/delivery-promise-interview-record.md` (project knowledge) — the facts
4. `claude/delivery-promise-build-sheet.md` (project knowledge) — the plan
5. `app/content/case-studies/nuuly.mdx` — the closest structural precedent

**CLAUDE.md is stale on typography.** It has eight Bricolage references and zero
Commissioner, and was last touched the day before the migration merged. It
describes `next/font/google`, `font-optical-sizing`, and three `--wdth-*` tokens
that commit `25011cc` deleted. Do not build from its type section.

---

## 1. Files

| File | What it is |
| --- | --- |
| `docs/urbn-delivery-promise-build-brief.md` | This file. |
| `docs/urbn-delivery-promise-content-draft.md` | The case study content, in MDX, named `.md` so the content loader does not pick it up. Measured and passing. Paul will rewrite prose in his own voice; treat the text as fixed for this build. Copy it to `app/content/case-studies/urbn-delivery-promise.mdx` when you build. |
| `docs/previews/journey-line-prototype.html` | Working prototype of the JourneyLine module, both tracks. **Track A is the approved one.** Track B is kept for comparison and is rejected. Committed for the same reason the Commissioner judgment bench is: hand-authored, depends on nothing. |

Raw deck extracts live at `public/case-studies/urbn-delivery-promise/_raw/`,
which `.gitignore` keeps local by design ("originals stay local; only optimized
copies ship"). **They are not in git and must not be force-added — see §7.**

---

## 2. Architecture decision — data goes in manifests

**Ruled 23 Aug. This is the point of the build.**

Every module's content lives in a JSON manifest beside the component, following
`components/case-studies/us-navy-fdt-e/gate-walk-manifest.json` and the three
BARD `theme*-grid-manifest.json` files.

Paul must be able to move a point on the journey line, change a value in the
chart, reorder the promise sequence, or reword any label **by editing a number
or a string**, without touching component code.

If a value is hardcoded in a `.tsx` file, this build has failed its main goal.

---

## 3. Build these three components

All under `components/case-studies/urbn-delivery-promise/`.

### 3.1 JourneyLine

Port Track A from `journey-line-prototype.html`. Track A is the approved SHAPE and
stays the approved shape; do not redesign it.

**The architecture rule, corrected 23 Aug:**

> **Only geometry and numerals stay in the SVG. Every word goes in HTML.**

So the SVG holds the path, the dots, the reference rule and the 01/02/03 numerals.
The reference label, the five stage labels, the tail note and the three break
descriptions are all HTML beneath it. **Apply the same rule to InversionChart.**

*What this replaced, and why it is recorded rather than quietly swapped.* The rule
here used to read "shape and orientation stay in the SVG, the argument goes in
HTML", and this section used to claim Track A "renders correctly at 1100px and
390px in both modes". **That claim was never verified — the fix was made and the
render was not re-read.** Measured: the prose container is 342px, so the scale is
342/1000 = 0.342, and the stage labels rendered at **4.79px** with the tail note at
**5.47px**. The weak rule classified those as "orientation" and let them stay.

Scaling SVG type is not the escape hatch. "POST PURCHASE" at a legible 32 units is
~250 units wide, and five of them need ~1,250 units in a 1,000-unit box. **Words
structurally do not fit a shared coordinate space.** Numerals stay because two
characters do fit; they are bumped at mobile, and so is the dot radius, from the
manifest.

One more thing the same 0.342 scale broke, and it is not type: a `stroke-width` of
2 user units renders at **0.68px**. Both modules pin stroke to screen px with
`vector-effect: non-scaling-stroke`, the idiom `.fdte-figure` already uses.

Manifest: `journey-manifest.json`

```
geometry: viewBox, the two rules, dot radii (desktop + mobile),
          numeral sizes (desktop + mobile)
points:   [{x, y, stage}]                      8 points
marks:    [{pointIndex, index, dx, dy,         3 marks -> 01, 02, 03
            dxMobile, dyMobile}]
stages:   [{label, x}]                         5 labels, HTML; x drives
                                               the grid columns
breaks:   [{index, lead, tail}]                3 HTML entries
refLabel  + refLabelPlacement ("above" | "below")
tailNote  "and then cancelled, four days later"  (HTML)
caption   {lead, gloss}                        moved off the deleted BentoBand
```

**The mobile pairs are not optional.** Below md the numeral goes 17 -> 44 units and
the dot 4.5 -> 13, so an offset tuned for the desktop pair sits the numeral on top
of its own dot. `refLabelPlacement` exists because JourneyLine's reference rule is
at the top of its plot and InversionChart's is at the bottom, so the label goes
above one drawing and below the other.

The final point is a filled dot and sits below the reference line. That is the
whole argument. Do not normalise it away.

### 3.2 InversionChart

New. Same line vocabulary as JourneyLine so the two read as one hand.

**Two series, monochrome, no hue.** One solid, one dashed.

**An HTML legend is mandatory and is always present** — the dataviz skill requires
one at two or more series, with direct labels *supplementing* it rather than
replacing it. This section used to say "no legend box needed beyond the direct
labels"; that was wrong twice over, because the direct labels are also the thing
that cannot survive mobile. They stay in the SVG at >=768 where 16 units renders at
17.4px, and are hidden below it. The legend carries identity at every width, on a
line-key that repeats the dash pattern; the name itself stays in a text token.

| Tier | All nodes | Store network |
| --- | --- | --- |
| Standard, 4 to 7 days | 3% | 3% |
| Express, 2 to 3 days | 16% | 29% |
| Overnight / rush, 1 to 2 days | 22% | 45% |

Cleared by Paul for publication. **Do not add a third series.** The Reno
fulfillment center (3 / 6 / 11) is the proof it was solvable and belongs in the
caption as a sentence, not as a line.

**Never render per-brand columns or absolute miss counts.** They exist in the
source table and are deliberately excluded.

The x axis is ordered by price. The line must visibly rise where a reader
expects it to fall. That inversion is the entire module.

Manifest: `inversion-manifest.json` — geometry, `scale`, tiers (with the `x` that
drives both the plotted points and the axis row's grid columns), series, refLabel +
refLabelPlacement, caption, gloss. **y is computed from the percentages via `scale`
and never stored**, so a value and its plotted position cannot drift apart.

### 3.3 PromiseSequence

Four stages showing one delivery date surviving from ad to arrival. **Built from
Paul's real 2019 screens**, not reconstructions.

| Stage | Source | Slot |
| --- | --- | --- |
| The ad | `_raw/p15-fb-ad.jpeg` 1900x1414 | `wide` (floor 1320) |
| Product page | `_raw/p18-pdp.jpeg` 1441x1889 | `standard` (floor 1072) |
| Cart | `_raw/p19-cart.jpeg` 1441x2046 | `standard` (floor 1072) |
| Text message | **none** | — |

**The SMS screen is 375x667 and fails every floor.** Do not rebuild it as
markup: the physics rule is explicit that rebuilding product UI as markup
presents a portfolio graphic as product UI. It becomes a closing line of prose
instead, which is already in the MDX.

Manifest: `sequence-manifest.json` — stage label, src, slot, alt, caption, gloss.

**Crops are not done.** Run `bento-crop` with Paul; it reads the same
`lib/bento-slots.json` these floors came from.

---

## 4. Do NOT build

- **`FanOut`** — imported in the MDX and deliberately unspecified. Its contents
  (which teams, which touchpoints) were never pinned down. Comment the import,
  leave section 05 without a module, and flag it. Do not invent an org chart.
- **`PromiseBeatFigure`** — three illustrations Paul may draw himself.
  **Make the figure slot optional** so a `.friction-beat` degrades to full-width
  text when no figure is passed. The beats must render without art.
- **A hero crop.** Use `_raw/p18-pdp.jpeg` whole as a placeholder so the
  page renders. Mark it TODO.

---

## 5. Gates

Run locally: `lint:type`, `lint:space`, `lint:color`.
Then `next build`, then `lint:prose` and `lint:interaction`.

Traps already known:

- `lint:color` walks the repo, but its `EXTS` set is
  `.css .ts .tsx .mdx .mjs .js .jsx .svg`. **`.html` and `.md` are not in it**,
  so the prototype and this brief are structurally exempt. An earlier draft of
  this brief warned otherwise; that was wrong, and checked.
- It does still scan **untracked** files with those extensions. Keep scratch CSS
  and scratch TSX outside the tree.
- `lint:space` check 4 forbids spacing inside a media query. Declare gaps once,
  outside the breakpoint.
- `lint:prose` hard-fails on em-dash U+2014.
- Commissioner has no `wdth` and no `opsz`. Do not use `font-stretch` or
  `font-optical-sizing`.

Verify at a **real 390px viewport**. A browser resize is invalid; Chrome floors
around 500px.

---

## 6. Two stale things worth fixing while you are in there

Neither is urgent and both are one-liners:

- `components/hero-block.tsx` has a comment claiming both hero spans set
  `font-stretch 88` from `--wdth-large`. False since C3.
- `components/takes/take-mark.tsx:28` builds an FVS string with a `wdth` axis
  Commissioner does not have, in a component that renders on no route.

---

## 7. Branch and preview

```
git checkout -b case-study/urbn-delivery-promise
```

Matches the existing per-study convention (`case-study/uscg-bard`,
`case-study/us-navy-fdt-e`). Push the branch for a Vercel preview per commit.

### Do not force-add the raw assets. This repository is public.

`.gitignore` says so in its own words, and the remote is a public GitHub URL.
The raw extracts include the missed-delivery-date table with **per-brand failure
rates and absolute order counts** — precisely the figures Paul cleared for
exclusion. `git add -f` would publish URBN's confidential operational data into a
public git history, permanently, even if a later commit removed the files.

The build does not need them. Cropping is a local `bento-crop` propose-and-judge
session with Paul, and `public/case-studies/**/_raw/` is already the established
local-only home for exactly this class of file.

If you are running in a cloud container and the assets are absent: **build
everything else.** Stub the asset paths to the filenames this brief names, and
Paul drops the cropped files in before commit.

**Nuuly work may be in flight.** Do not touch `app/globals.css` shared rules,
the `.friction-beat` figure cap, or the bento component without checking with
Paul first. Three cross-cutting Nuuly items are queued that would collide: a
`surface` prop on the bento, a case-nav module, and milestone semantics.

---

## 8. Done means

1. `/case-studies/urbn-delivery-promise` renders on the branch
2. All three built modules take their content from manifests
3. Zero hardcoded colours, spacings, or type values
4. Both modes, and a real 390px viewport
5. Every gate green
6. A Vercel preview URL for Paul
7. **The diff is unstaged and Paul commits it**
