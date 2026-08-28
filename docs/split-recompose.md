# `split` is too wide — the measurement, the cause, and the fix

Paul's read, confirmed. This is not a normalization setting. The composition
cannot produce the margins the other two have, at any scale.

---

## 1. What the numbers say

Side margin, at the 300px size the figure actually renders:

| | ink fill W | ink fill H | side margin @300px |
| --- | --- | --- | --- |
| `blind` | 53.9% | 79.9% | **69px** |
| `phantom` | 63.7% | 79.9% | **55px** |
| `split` | 94.5% | 77.0% | **8px** |

Vertical margins are consistent across all three (18–21 top, 15–18 bottom). The
break is entirely horizontal. Stacked down a column and read in sequence,
`split` bleeds to both edges while the other two float.

---

## 2. Why it cannot be normalized out

`split`'s ink aspect is **2.16**. The box is **1.79**. Anything wider than the
box fits to width and has no side margin by definition — that is why the
normalizer reports `bound: width` for this figure and `bound: height` for the
other two.

To reach `phantom`'s margins the ink would have to be 63.7% wide. At aspect 2.16
that puts height fill at **52.8%**, far outside the 74.5–83.5% band the shipped
figures occupy. The figure would become a thin strip. Trading one defect for a
worse one.

---

## 3. Why it cannot be re-arranged out either

The four objects, measured off the traced raster:

| | size | share of frame |
| --- | --- | --- |
| left mailer | 846 × 1021 | 31% W, 66% H |
| middle mailer | 821 × 668 | 30% W, 43% H |
| box | 974 × 612 | 35% W, 40% H |
| **woman** | **401 × 660** | **15% W**, 43% H |

Two facts kill every rearrangement:

- **The box and one mailer, touching, are already 1820 units — 66% of the frame
  width.** The whole drawing needs to be about 63%. Two of the four objects
  already exceed the entire budget.
- **The two tallest, stacked with no gap, are 1633 units — 106% of the frame
  height.** So they cannot go one above the other either.

There is no arrangement of these elements at these sizes that fits. I tried
moving the box, dropping the figure (that makes it *worse* — aspect 2.52,
because she was contributing height, not width), and stacking. **The elements
are drawn too large.** Which is the note Paul made two rounds ago about parcel
size, now with a number on it: the woman is **less than half the width of a
single parcel**.

---

## 4. The finding underneath all of it

Segmenting the three figures by connected component:

- `blind` — **one connected mass**, 54% W. She is touching the dress; the dress
  overlaps the calendar.
- `phantom` — **one connected mass**, 64% W. She is reaching into the box.
- `split` — **four separate islands** tiling 95% W. She touches nothing.

The set's grammar is *one person in contact with one dominant object*. `split`
is a person beside a row of objects. That single difference produces the width
problem, the scale problem, and the missing-verb problem — they are one defect
seen from three angles.

---

## 5. The fix

Regenerate `split`. Three reasons now converge on it: the width, the parcel
scale, and the 1024px source resolution that doubles the traced path data.

Attach **`blind` and `phantom`** as references alongside the style block.

> Three clothing parcels on the ground, close together in a loose group, and a
> woman crouched among them with both hands on the nearest one, opening it.
>
> **The parcels are small — apparel, not freight.** Each is something she could
> carry in one hand. Crouched, she is taller than any of them and about as wide
> as two of them together. Two are soft plastic mailers holding a single garment,
> so they slump and crease. The third is a shallow cardboard box about as long as
> her forearm.
>
> **They sit apart on the ground but at different distances from the viewer**, so
> they overlap in the picture without touching each other — one further back
> between the two nearer ones. Not stacked, not in a row. The mix of packaging
> should be obvious: the soft mailers and the box clearly came from different
> places.
>
> **She and the parcels form one compact group** occupying about two-thirds of
> the frame's width, with clear empty space on the left and the right.
>
> Leave one clean blank rectangular panel on each parcel. No lettering.

**Reject if:** the parcels run edge to edge, any parcel is wider than she is,
they read as freight or moving boxes, or she is not touching one.

The three constraints doing the work, in order of what went wrong last time:

1. **"about two-thirds of the frame's width, with clear empty space left and
   right"** — the aspect constraint. My earlier brief said "arranged across the
   width of the frame," which is what produced the frieze. That was my error.
2. **"crouched, she is taller than any of them"** — the scale constraint, stated
   as a relationship rather than an adjective, because "small" alone did not hold.
3. **"both hands on the nearest one"** — restores contact, and therefore the one
   connected mass the other two figures have.

Ask for the **full-resolution export**, not a 1024px one. The current file traces
to 72.7k against `blind`'s 25.0k for no gain.

---

## RESOLVED — 27 Aug 2026

Two generations after this was written. The regenerate fixed the geometry on the
first try; the count took one short follow-up edit.

Final, measured:

| | fill W | side margin @300px | height fill | pen | traced |
| --- | --- | --- | --- | --- | --- |
| `blind` | 53.9% | 69px | 79.9% | 10u / 1.09px | 24.4k |
| `phantom` | 63.7% | 55px | 79.9% | 11u / 1.20px | 22.2k |
| **`split`** | **55.2%** | **67px** | **80.0%** | **11u / 1.20px** | **26.4k** |

It now fits to **height** like the other two rather than to width, at a scale
factor of 1.053 — the composition natively fits the slot. It segments as **one
connected mass**, which is the set grammar `blind` and `phantom` have and the old
`split` did not. Source was full resolution (2752 × 1536), so the path bloat is
gone: 26.4k against the 72.7k the 1024px version produced.

The count edit changed 0.86% of pixels. Local, as intended.

### Correction to §5's swap instructions

That section said to re-run all three sources through the corrected normalizer so
script and assets agree. **Not necessary.** Re-traced with the fixed script,
`blind` and `phantom` come out at 24656 and 22538 bytes against the committed
24513 and 22766 — different files, same behaviour. The bug the script fix
addressed (asserting margins before dilating) could only bite a figure sitting at
the margin floor, and those two sit at **632 and 500 units** against a floor of
75. They were never at risk. Only `split` was, and `split` is replaced.

Churning two committed assets for a byte-level difference with no rendered change
is not worth it. Ship `split` alone.

---

## 6. If Paul would rather not regenerate

The count is correct and every gate passes, so the current file ships. The cost
is 8px of side margin against 55 and 69, and ~37k of surplus path data on the
LCP route. It is a visible break in the set, not a broken figure.

The cheap partial: one more short edit — *"Put both her hands on the nearest
parcel, as if opening it. Change nothing else."* — restores the contact and the
verb without touching the width. Worth doing regardless if the regenerate does
not happen.
