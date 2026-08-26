# Delivery Promise — three fixes from the section 01 review

**Run this AFTER Paul has committed the section 01 build.** Separate commit,
deliberately: a build and the fixes to that build in one commit means neither can
be judged.

Two of these come from your own findings. One is mine.

**Stop at the diff. Paul commits. Then push, so he gets a preview URL** — that is
an explicit override for this round.

---

## 1. Section 04's callback, and it is a content fix not a wording fix

**Your High finding was right and the diagnosis was better than the recommendation.**

Current, line ~225:

> **Leadership moved when I showed them the horror stories.** The vacation that
> left without its clothes. The order cancelled four days after it was paid for.
> After that the argument stopped being about inventory.

The problem is not that the callback is false. It is that the reader has just
finished section 01, so "the vacation" now reads as *the quote they read four
hundred words ago* rather than as a second piece of evidence. "Horror stories,"
plural, collapses toward one story told twice.

**Do not fix this by restoring section 01's deleted paragraph.** That paragraph
was the cut, and restoring it puts the section back where Paul objected to it.
Fix it where the damage is, by pointing the list at evidence the reader has *not*
just read:

```mdx
**Leadership moved when I showed them the horror stories.** The order cancelled four days after it was paid for. The refund a shopper was still chasing. The one-star review whose title was the name of the benefit. After that the argument stopped being about inventory.
```

Three items, none of them the section 01 quote, and the plurality is real again.

**Provenance for each, since you cannot read the source docs:**

- *The order cancelled four days after it was paid for* — unchanged, already in
  the study. URBN operational data: inventory update delays caused out-of-stock
  errors at checkout and cancellations days after payment.
- *The refund a shopper was still chasing* — the customer-service case. A shopper
  bought a large order for a vacation, URBN missed the date, she left without the
  clothes, went public, then waited a long time for a refund. **This is a
  different person from the App Store reviewer**, confirmed by Paul 26 Aug. This
  clause is how that second person stays in the study without a paragraph. **Do
  not name a duration** — the record says "a long time," not a number.
- *The one-star review whose title was the name of the benefit* — the deck's App
  Store slide, a 1-star review titled "Free express shipping," 25 July 2019. The
  title of a one-star review being the name of the benefit is real and verified.

---

## 2. Section 01's closing bold moves one sentence to the right

**Your Medium finding, taken further than you took it.**

Current:

> **Most shoppers could not tell you how long an order took. They could tell you
> whether it came when we said it would.** That was the part they remembered, and
> the part they repeated.

Two problems, and they have one fix.

You caught the first: this is the longest skim line in the study, and it is the
only merged two-sentence bold.

The second you did not flag. The bolded first sentence now **repeats the left
lead** in `TestimonyPair`, which says *"She could not tell you how long it took."*
Same claim, one screen apart, in the skim layer both times.

Move the bold:

```mdx
Most shoppers could not tell you how long an order took. **They could tell you whether it came when we said it would.** That was the part they remembered, and the part they repeated.
```

The skim line drops from 24 words to 11, stops repeating the module, and carries
the finding rather than the setup. The unbolded first sentence still generalises
the left quote for anyone reading rather than skimming.

---

## 3. Guard the levelness, since it is the invention

**Your Medium finding said the invention is the levelness, not the quotes** — if
either lead grows to three lines, the module degrades into two stacked
blockquotes and the argument evaporates. That is correct, and it is currently
guarded by nothing but this conversation.

Add `__tests__/testimony-leads.test.mjs`, importing the manifest rather than
parsing it, in the same style as `__tests__/cover-art.test.mjs`.

Assert:

1. Exactly two cells, each with a non-empty `lead`, `quote` and `source`
2. Each `lead` is at most **72 characters**
3. The two `lead` lengths differ by at most **10 characters**

**Write the honest caveat into the test's header, because this instrument is a
proxy and a future reader must know it.** Character count is not the thing that
matters; *rendered lines at desktop* is. This repo has already recorded one budget
stated in characters that every shipped page contradicted. Assertion 3 is the one
that actually tracks levelness, since two leads of similar length wrap alike;
assertion 2 is a coarse ceiling. **The real check is the render, and this test
exists to make an edit that breaks levelness fail loudly in CI instead of
silently in the layout.**

Also add to `testimony-manifest.json` a `$levelnessDoc` recording the same thing,
plus your five-hands finding: `TestimonyPair` is separated from `RoadmapTable` by
axis, not by ornament. `RoadmapTable` is ordered, read down, numbered, ends in a
coda. `TestimonyPair` is a comparison, read across, two peers, no numerals, no
coda. **Adding a third cell or a numeral collapses it into `RoadmapTable`'s
shape.**

---

## Gates

Same set, same order: `npm test` → `npm run build` → `lint:prose`, plus
`__tests__/cover-art.test.mjs` and the new `testimony-leads` test. Report every
number.

`rm -rf .next` before the dev server. Verify at a real 390px and 1440, both modes,
and re-measure the two lead heights — item 2 does not touch them but item 1's
neighbours shift and I would rather the measurement be current than assumed.

Re-run the skim extraction with the corrected extractor and report the new flat
list. Section 01 should now contribute one bold line instead of a merged two-
sentence one; confirm the four hiring questions still answer from the list alone.

## Do NOT

- Restore section 01's deleted vacation paragraph
- Name a duration for the refund
- Add a third cell, a numeral or a coda to `TestimonyPair`
- Change either quote
- Touch section 02. It still has not been read

## Done means

1. All three fixes in, gates green, numbers reported
2. The new test fails if a lead is lengthened past budget — **prove it by
   temporarily lengthening one and showing the failure**, then revert
3. Both modes, a real 390px viewport
4. Diff unstaged, Paul commits
5. **Then push, and give him the preview URL**
