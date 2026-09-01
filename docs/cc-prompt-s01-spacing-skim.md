# Delivery Promise §01 — the spacing defect and two skim fixes

Third stop in the cold read, and all three items come from Paul looking at the
built page. **Target render: `docs/previews/s01-spacing-skim.html`, the
`Proposed` block.** Measured at 1100.

**Stop at the diff. Paul commits, then push.**

---

## 1. `.testimony-pair` has no bottom margin. This is the defect.

`app/globals.css:4614` reads `margin: var(--spacing-xl) 0 0`. Top only.
Measured on the built page: **48px above the figure, 0px below it.** The closing
paragraph sits directly against the source line and reads as part of the left
cell.

**My spec caused this.** The prototype put the closer in its own block with its
own top margin, so the figure's bottom edge was never specified, and the brief's
spacing table said "figure top margin" and stopped.

Fix it the way `.framed-pair` already does it, twenty lines up in the same file:

```css
.testimony-pair {
  /* Symmetric evidence step, matching .framed-pair's `margin: var(--spacing-l) 0`
     at globals.css:1938. Top is single-owned by zeroing the preceding lede's
     bottom, so the gap is 2rem whether margins collapse or add. The bottom
     separates the pair from the closing paragraph, which otherwise reads as an
     addendum to the right-hand source line. */
  margin: var(--spacing-l) 0;
  max-width: 47rem;
}

.cs-section .section-lede:has(+ .testimony-pair) {
  margin-bottom: 0;
}
```

**Do not invent a number.** `.framed-pair` uses `--spacing-l` both sides and the
comment there explains why. Match it, then **measure the rendered gap after a
`FramedPair` in `uscg-bard` and the gap after `TestimonyPair` here, and report
both.** They should agree. If they do not, say so rather than adjusting until
they look right.

Check `.cs-section > :last-child` still zeros the bottom where a module ends a
section, the way the `.framed-pair` comment says it does for BARD.

---

## 2. The lede is five rendered lines and opens on the wrong sentence

Measured: 42 words, **5 lines at 25.6px** (rung 2). BARD's equivalent lede is 26
words. The first thing under the heading is a wall, which is most of why the
section does not skim.

It also buries the claim. "Leadership asked us to surface inventory and location
data earlier in the shopping journey, because shipping was going wrong" is the
brief Paul was given, described procedurally. The interview record states the
actual position: *leadership believed the inventory side of the business was
responsible for missing revenue expectations.* That is a sharper sentence and a
shorter one.

Replace the `section-lede` with:

```mdx
<p className="section-lede">Leadership thought this was an inventory problem. I put our researcher into the customer feedback and the help tickets, then ran what she found against the order data.</p>
```

28 words, **3 lines measured.** It also sets up the heading's disagreement:
leadership thought inventory, the section concludes speed was the wrong measure,
and the reframe is the study.

---

## 3. The closing bold does not lead its paragraph, so a skim never finds it

Current:

> Most shoppers could not tell you how long an order took. **They could tell you
> whether it came when we said it would.** That was the part they remembered, and
> the part they repeated.

**This is my fault from the previous round.** Moving the bold to the second
sentence fixed the repetition with `TestimonyPair`'s left lead and broke
something more important: every other bolded line in all four studies **starts**
its paragraph. The skim layer works because the eye runs down the left edge. A
bold beginning 60 characters in is invisible to that scan.

Both problems have one fix. Cut the first sentence — it is the one that repeated
the left lead — and let the bold open the paragraph:

```mdx
**Shoppers could tell you whether it came when we said it would.** That was the part they remembered, and the part they repeated.
```

22 words, bold at the left edge, no repeat, and "Shoppers" rather than "They"
because the preceding element is a figure and the pronoun had nothing to bind to.

**After this, §01's skim is four anchors down the left edge**: the heading, two
`TestimonyPair` leads, one closing bold. Report the extraction and confirm.

---

## Also worth knowing, not part of this job

**My prototype set the surrounding lede at 16px when the real one is ~26px.** The
module was judged in type the page does not have, which is why the skim problem
only appeared once it was built. `docs/previews/s01-spacing-skim.html` copies the
real `h2`, `.section-lede` and body rules out of `globals.css` for exactly this
reason. **Any future module prototype should do the same** — a module looks
correct in the wrong context more easily than in the right one.

---

## Gates

`npm test` → `npm run build` → `lint:prose`, plus `cover-art` and
`testimony-leads`. Report every number. `rm -rf .next` before the dev server.

`lint:space` note: the new `:has()` rule is a spacing declaration outside any
media query, which is what check 4 wants. Confirm it does not trip check 2's
allowlist.

Verify at a real 390px and 1440, both modes. **Re-measure the two lead tops and
line counts** — item 2 changes what sits above them.

## Do NOT

- Pick a spacing value by eye. Match `.framed-pair` and report the comparison
- Change either quote, either lead, or the heading
- Touch section 02, 03 or 04
- Add a bottom margin to the closing paragraph as a way of fixing item 1. The
  figure owns its own bottom edge, the same way `.framed-pair` does

## Done means

1. Gaps above and below `TestimonyPair` are equal, and equal to what a
   `FramedPair` produces in BARD, with both numbers reported
2. Lede measures 3 rendered lines
3. §01's skim extraction is four anchors, all at the left edge
4. Every gate green, both modes, a real 390px viewport
5. Diff unstaged, Paul commits, then push and report the preview URL
