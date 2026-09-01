# Delivery Promise — the three friction-beat figures

Drawing sheet for `PromiseBeatFigure`. Three figures, Oku style, matching the
BARD and FDT-E set.

**Written 26 Aug 2026.** The geometry below is measured off the nine shipped
figures, not invented.

---

## 1. The box is what puts every figure in the same place

```
viewBox = "0 0 2750 1536"
```

Six of the nine shipped figures are exactly this. The other three are the
inconsistency, and they are already backlog items:

| file | viewBox | aspect | |
| --- | --- | --- | --- |
| `fdte/fdte-01-tempo` | 2750 × 1536 | 1.790 | canonical |
| `fdte/fdte-02-paralysis` | 2750 × 1536 | 1.790 | canonical |
| `fdte/fdte-03-blackbox` | 2750 × 1536 | 1.790 | canonical |
| `oku/oku-02-once-a-year` | 2750 × 1536 | 1.790 | canonical |
| `oku/oku-03-reconciliation` | 2750 × 1536 | 1.790 | canonical |
| `nuuly-beats/beat-01-station` | 2752 × 1536 | 1.792 | 2 units off, harmless |
| `nuuly-beats/beat-03-hands` | 2752 × 1536 | 1.792 | 2 units off, harmless |
| `nuuly-beats/beat-02-handoff` | 2250 × 1265 | 1.779 | off-spec |
| **`oku/oku-01-forks`** | **2446 × 1728** | **1.416** | **the outlier** |

`.oku-figure svg` is `width: 100%; height: auto`, and `.friction-beat` gives every
study the same `minmax(0, 300px)` figure column at ≥1024px. **So rendered height
is purely the viewBox aspect.** At 1.790 that is 168px. `oku-01-forks` at 1.416
renders 212px — **44px taller than every other figure on the site**, and it is the
first figure a reader meets on the first study in the index.

**Draw at 2750 × 1536 and the new three match six shipped figures on day one.**

---

## 2. Pad inward, never outward

This corrects `claude/systems-backlog.md` entry 2, which proposed padding Nuuly's
`beat-02` and `beat-03` viewBoxes vertically to give them the top air `beat-01`
has. **Growing the box grows the rendered block** — from ~168px to ~192px — and
`globals.css:2104-2106` records that the 300px column cap was chosen so the figure
lands "≈ text-block height: a supporting illustration, not a peer block." Padding
outward reinstates the problem the cap exists to solve.

**Hold the box, inset the ink.**

```
box        2750 × 1536
safe area  80 units on all four sides
live area  2590 × 1376
```

80 viewBox units renders as **8.7px** horizontally and **8.8px** vertically at the
300px cap, so the margin reads as uniform rather than as a percentage of two
different dimensions. Nothing decorative, nothing structural, no stray anchor
point outside the live area.

**This is a minimum, not a target.** What guarantees every figure lands in the
same place is the *box*, which is fixed. The safe area only stops ink touching
the edge.

### The "fuller" problem, which is a different measurement

Measured ink bounding boxes at the real 300px column (from rendered geometry, not
`getBBox()`, which ignores group transforms):

| figure | box h | ink h | top | bottom | left | right |
| --- | --- | --- | --- | --- | --- | --- |
| `beat-01-station` | 167px | 139px | **23.4** | 5.5 | 6.2 | 9.7 |
| `beat-02-handoff` | 169px | 169px | **0.0** | **0.0** | 0.0 | 0.0 |
| `beat-03-hands` | 167px | 167px | **0.0** | 0.0 | 7.7 | 0.0 |

Two run edge to edge on all four sides; one carries 23px of top air and nothing
matching at the bottom. **There is no shared safe area in the existing set** — the
three were composed independently, so the vertical rhythm between beats is set by
whatever each drawing happens to do at its own edges. That is the "some are
fuller" effect.

**So the third rule is optical, and it is the one that makes the set look like a
set:**

> **The ink should span roughly 85–90% of the live area on its dominant axis.**

At 2590 × 1376 that is about **2200–2330 units wide** or **1170–1240 tall**,
whichever axis the composition leads on. Measure it; do not eyeball it. A figure
at 60% reads thin beside one at 100% even when both are inside the safe area and
both sit in an identical box.

---

## 3. Style, from the shipped set

| | |
| --- | --- |
| paths | 1–4 per figure |
| fill | `currentColor`, `fill-rule="evenodd"` |
| stroke attribute | **none** — all linework converted to filled outlines |
| `<text>` | **zero** |
| minimum feature | ~40 viewBox units, which renders at ~4.4px. Below that it disappears |

**Lift the line weight from `components/oku/oku-02-once-a-year.svg`** rather than
choosing one. It is canonical geometry and it is in the same study family the new
three have to sit beside.

**One oversized object per frame.** The 300px cap is unforgiving: a composition
with four competing elements resolves as texture.

---

## 4. The three briefs

The standing rule, from the MDX comment already in the file:

> **The subject is the SHOPPER at the moment the order breaks — never an
> abstraction and never a system diagram.** That is what keeps this set distinct
> from BARD's (defects in a system) and Nuuly's (a specialist at work).

### 01 · `blind` — She could not see the date

> A shopper holding a garment at arm's length, a calendar behind her with no day
> marked on it.

The beat: *cost and timing showed up at checkout, after she had already chosen
everything. Until then she was guessing.* The calendar is the oversized object;
the emptiness of it is the whole point. Resist marking a day and crossing it out —
nothing has gone wrong yet, she simply cannot see.

### 02 · `phantom` — She paid for something we did not have

> A shopper reaching into an open box that is empty, the receipt still in her
> other hand.

The beat: *inventory updated slowly, so the out-of-stock message landed on order
submit, or as a cancellation days after she had been charged.* The receipt is what
makes it a payment rather than a delivery failure. The box is the oversized
object.

### 03 · `split` — One order arrived as three

> Three separate parcels on a doorstep at three different times, one shopper
> opening the last of them.

The beat: *about half of multi-item orders split across shipments, most of them
out of stores, and no rules engine decided which.* Three parcels is the only
figure in the set with a repeated element, and the repetition is the argument, so
the three should read as clearly separate arrivals rather than a stack. Careful
here: three objects plus a figure risks the four-competing-elements problem. The
shopper can be small and the parcels can be the oversized object.

---

## 5. Wiring

The MDX already carries the three call sites, commented out with their alt text
written:

```jsx
<PromiseBeatFigure variant="blind" alt="..." />
<PromiseBeatFigure variant="phantom" alt="..." />
<PromiseBeatFigure variant="split" alt="..." />
```

Follow the existing family pattern — `components/oku/` + `oku-figure.tsx`,
`components/fdte/` + `fdte-figure.tsx`, `components/nuuly-beats/` +
`nuuly-beat-figure.tsx`. So: `components/promise-beats/*.svg` plus
`components/promise-beat-figure.tsx`. `scripts/regen-oku-tsx.mjs` is the existing
SVG-to-TSX converter; check whether it generalises before writing a second one.

**Once figures exist, `.friction-beat:not(:has(figure))` stops applying to this
section** and the beats go back to the two-column layout. Verify the text column
still reads at 390 and 1024, since it has only ever been seen full-width here.

---

## 6. What is NOT in scope here

Recorded so the retrofit is a decision rather than a drift:

- **`oku-01-forks` re-traced to 2750 × 1536.** Backlog entry 1. The 44px outlier.
- **`nuuly-beats/beat-02-handoff` re-traced** from 2250 × 1265.
- **The ±2-unit correction** on Nuuly `beat-01` and `beat-03`. Cosmetic; batch it
  with the above rather than alone.
- **Insetting the existing nine to the 80-unit safe area.** Two of Nuuly's three
  run edge to edge.

**Do the new three first, to this spec.** The retrofit is nine files of tracing
work with no story riding on it; the new three are blocking a section. Doing them
in the other order means drawing to a spec that has not been proven on anything.
