# Delivery Promise §02 — Paul's prose revision

Four string replacements in `app/content/case-studies/urbn-delivery-promise.mdx`.
No components, no CSS, no new modules, no structural change. §01 is not touched.

**Stop at the diff. Paul commits, then push.**

---

## What this is

Paul rewrote §02's prose after reading it cold. The section's shape does not
change: heading, lede, three beats, closer. Every edit is a swap inside an
existing element.

**These are his words. Do not improve them.** Two small changes were agreed in
review and are already folded into the strings below — do not re-open either:

- Beat 02 keeps **`landed`**, not `appeared`. His draft had `appeared` in both
  beat 01 and beat 02, same verb in the same slot in adjacent beats. Beat 01
  keeps `appeared`; beat 02 goes back to the shipped `landed`, which is the more
  concrete of the two.
- The lede reads **`against`**, not `comparing`. His draft's *"comparing order
  data and customer service tickets"* reads as comparing those two sources to
  each other. The interview record has it as running the researcher's findings
  *against* the operational data — the interviews are one side of that
  comparison, and `comparing` dropped them out. That record's attribution rule is
  strict, so the preposition is load-bearing.

---

## The four replacements

Exact strings. Do not reflow, re-wrap or re-indent any line you are not editing.

**1 · Lede, line 158**

```mdx
<p className="section-lede">A researcher ran the interviews. I worked through the analysis with her, against order data and customer service tickets.</p>
```

**2 · Beat 01 scene, line 171**

```mdx
      <p className="friction-beat__scene">Cost and timing appeared at checkout after she had already chosen everything. Until then, she was guessing.</p>
```

**3 · Beat 02 scene, line 179**

```mdx
      <p className="friction-beat__scene">Inventory updated slowly. The out-of-stock message landed on order submission, or as a cancellation days after she had been charged.</p>
```

**4 · Closer, line 210**

```mdx
<p className="mt-14!">**Marketing made the promise, the warehouse tried to keep it, and customer service cleaned up the mess.**</p>
```

**Beat 03's scene at line 204 does not change.**

Word counts, per block: 20→19, 18→17, 21→20, 21→17. §02 prose 80 → 73; with
headlines and the pull quote, the section reads about 140 against 142 shipped.
Verify rather than trust.

---

## No bold is added anywhere, and that is the answer to a question Paul asked

He asked where bolds belong in §02. **Nowhere new.** Measured across all four
studies: **zero bold inside any `section-lede` and zero inside any
`friction-beat__scene`** — twelve beats, none. §02's skim layer is the section
heading, the three `<h3 className="friction-beat__headline">` elements, and the
closer, which is already fully bold inside `mt-14!`.

Adding bold to scene text would be the first instance in twelve beats and would
compete with the headlines rather than reinforce them. If you think a bold is
needed somewhere, report it — do not add it.

---

## What the closer change does, so you do not "restore" it later

Was: *"The promise was made in marketing, kept in a warehouse, and broken in a
customer service queue. Nobody owned all three."*

Two sentences to one, passive to active. The org argument now lives in the
verbs — **marketing made a promise the warehouse then had to try to keep** — which
names the broken handoff instead of asserting an ownership gap. `tried` is
deliberate and says the warehouse was set up to fail rather than negligent.

It also removes the *"customer service queue"* echo between §02's lede and its
closer, which is why the lede now says `tickets` and the closer says `customer
service`.

---

## Verification

```
rm -rf .next && npm test && npm run build && npm run lint:prose
```

- `lint:prose` scans rendered HTML — the real check on em-dash and banned words.
- No new apostrophes in any string; the census should hold at 48 straight / 1
  curly. Assert it.

**Rendered lines**, same instrument as the last three passes
(`Range.selectNodeContents` + `getClientRects()`, distinct rounded tops, after
`fonts.ready` twice with a settle), at **1440 / 1024 / 390**, before and after:

- §02's lede. It was 2 / 2 / 4 and is one word shorter, so it should hold —
  measure it, `text-wrap: balance` is not monotonic in word count.
- All three beat scenes. **Beats 01 and 02 share a grid row with a 300px figure
  column at ≥1024**, so a scene gaining a line changes the row height and can
  break the alignment across the three beats. Report the rendered height of all
  three `.friction-beat` rows, before and after, and say whether they still agree.
- Beat 02 also carries the pull quote in the same column. Confirm no collision.
- The closer. It was 2 lines at 1440; it is four words shorter.

Both modes, and one look at 390 where the beats stack.

---

## Report

1. Line counts for the lede, three scenes and the closer, three widths, before
   and after.
2. **`.friction-beat` row heights, all three, before and after**, and whether
   the set still aligns.
3. Per-block word counts, instrument named.
4. Apostrophe census.
5. Every gate green.

## Do NOT

Add bold anywhere · change beat 03's scene · change any headline or the section
heading · touch the pull quote or its provenance comment · touch `TestimonyPair`,
§01, or anything in §03 · touch `PromiseBeatFigure` or the figures · touch
`.friction-beat` CSS · reword Paul's text · reflow or re-indent lines you are not
editing.

## Done means

Four strings replaced, the five reports delivered, gates green, diff unstaged.
