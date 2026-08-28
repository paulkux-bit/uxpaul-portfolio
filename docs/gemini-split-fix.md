# Fixing `split` — four parcels against a headline that says three

The beat's headline is **"One order arrived as three."** The drawing has three
parcels on the ground plus a fourth in her hands. The picture contradicts the
sentence beside it.

**Edit the existing image. Do not regenerate.** A regenerate re-rolls the line
weight and the figure scale, and this drawing currently matches `blind` and
`phantom` closely enough to read as one set. An edit preserves that; a new
generation gambles it.

---

## The prompt

Attach the current `split` image and paste exactly this:

> Remove the parcel the woman is holding. Draw her hands empty, resting on her
> knees. Change nothing else.

That is the whole prompt. Do not add to it.

**Why it is this short.** The previous version of this file ran three paragraphs
— one change instruction plus an enumeration of everything that had to stay
identical, plus a list of things not to add. It drifted. The enumeration is the
cause: naming the parcels, the label panels, the line weight and the background
as things to preserve puts each of them back in play as something to re-render.
A model told to keep the line weight the same has to decide what the line weight
is. A model not told anything about the line weight has no reason to touch it.
**"Change nothing else" asserts the same constraint in three words and names
nothing.**

**Why her hands and not her position.** Removing the parcel is the only change
the headline requires. Moving her, or having her reach toward a remaining
parcel, is composition preference — and a deletion is not local: hands frozen in
a holding pose around nothing read as an error, so the hands need somewhere to
go. Resting on her knees is the smallest place to put them. She stays crouched
exactly where she is.

**Accept only if the count is three** and nothing else moved. If it drifts,
retry the same prompt rather than adding clauses to correct it — a longer prompt
is what caused the drift.

**If two or three attempts all drift**, the model will not do a clean edit on
this image. Stop there and raise it; the next move is a decision about the
figure, not a better prompt.

---

## What I am deliberately not asking for

**No doorstep.** The scene brief called for one and the art has no ground line at
all. `blind` has none either; `phantom` has a table edge. Adding one now means
new detail in the densest of the three figures, and the alt text has already been
written to the art rather than to the brief.

**No line-weight correction.** `split`'s pen spreads 5–14 units where `blind` and
`phantom` peak sharply at 10–11. Real, and not worth chasing here: asking for
uniform weight invites a redraw of every contour. If it still reads uneven beside
the other two once the count is fixed, that is a separate decision.

**No repositioning.** See above. It is the clause most likely to trigger a
redraw of the figure, and it buys composition rather than correctness.

---

## Swapping it in

Re-run **all three** sources through the normalizer, not just `split` — the
script was corrected after these assets were traced, so the committed SVGs and
the script no longer agree:

```bash
python3 scripts/normalize-beat-figure.py blind.jpg phantom.jpg split.jpg
```

Then check three things before committing:

1. **Count the parcels in the output.** Three. This is the whole point of the
   exercise and it is the one thing an automated step cannot verify.
2. **Pen width.** Expect ~10–13 units, which is 1.09–1.42px at the 300px cap.
   Under 1.0 and the no-stroke-floor call would need revisiting; `oku-02` sits at
   11 units and carries no floor.
3. **Margins and height fill.** The script asserts a 75-unit minimum margin and a
   74.5–83.5% height-fill band, and it now dilates **before** it asserts, so the
   numbers it prints are the numbers that ship. The previous run's `split` at 74
   units was the old order of operations; it should clear 75 this time.

Then `components/promise-beats/split.svg` is a drop-in replacement. **No wiring
changes** — the component, the regen script, the allowlist entry and the MDX call
site all stay exactly as they are. Re-run `npm run regen:promise-beats` to
regenerate the `.tsx`, then the gates.

**Alt text.** It currently reads *"A shopper crouches beside the smallest,
opening it."* If she ends up with empty hands on her knees rather than opening a
parcel, that clause is now wrong. Re-read it against the new image and fix it —
the alt text follows the art, not the plan.
