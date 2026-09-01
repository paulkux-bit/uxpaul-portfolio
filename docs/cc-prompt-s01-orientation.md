# Delivery Promise §01 — give the section its orientation

One MDX file. The lede is replaced, two paragraphs are inserted, the closer is
replaced. No components, no CSS, no new modules. §02 is not touched.

**Stop at the diff. Paul commits, then push.**

---

## Why

Paul read the built page and called §01 disjointed. He was right, and the cause
is measurable. §01 body prose, captions excluded: **Nuuly 66, Delivery Promise
46, BARD 45, FDT-E 40.** So the section is not short — it is misallocated. BARD
spends its 45 words on three blocks that establish the world before arguing.
Delivery Promise spends its 46 on a lede and a closer that both take positions,
and **no sentence anywhere in the section says what a delivery promise is.**

The other three studies all orient first: *"Boating accident cases are rising,
and each one becomes a federal record, filed against a statutory deadline"*;
*"There are minutes to decide, and the analyst is the one accountable"*; *"Nuuly
rents clothes by subscription: six garments a month, then six more."* This change
buys Delivery Promise the same thing.

**These are Paul's words, edited by him.** Do not improve them.

---

## The change

Replace §01's body — lede through closer, `<TestimonyPair />` staying where it
is — so it reads exactly:

```mdx
## Speed was the wrong thing to measure.

<p className="section-lede">URBN sells clothes online across Urban Outfitters, Anthropologie and Free People. In 2019, that business was growing and missing its targets.</p>

**A delivery promise is the date a shopper sees at checkout.**

**Leadership thought this was an inventory problem.** I thought it was speed, and that we had to win a two-day race against Prime.

<TestimonyPair />

**But shoppers didn't care about how fast we were.** If we hit the date, they barely noticed. If we missed it, they knew exactly what it cost them.
```

The heading does not change. `<TestimonyPair />` does not move.

Per block: lede 21, para 2 11, para 3 23, closer 28. **Total 83**, against
Nuuly's 66 and BARD's 45. Verify these rather than trusting them.

### Typography, already resolved — confirm, do not re-decide

- **`didn't` takes U+0027, not U+2019.** The file carries 46 straight
  apostrophes and exactly one curly, and that one is the `can't` in the hero
  callout string. Paul's draft had a curly one; it is straight above.
- **The brand list is non-serial** — *"Anthropologie and Free People"* — matching
  the two brand lists already in the file. The file's prose is majority serial
  and its brand lists are not; that inconsistency predates this change and is not
  yours to fix. Do not add a third pattern.
- No U+2014 in any new string.

---

## The thing to actually look at

**Paragraph 2 is a single fully-bold sentence.** This study uses that form
exactly once — §02's `mt-14!` closer — and only as a section ender. Mid-section
it has never rendered.

Render it and say whether it reads as **emphasis inside the argument** or as a
**stray pull-quote / section break**. If the latter, report it; do not fix it.
Paul chose this shape when he cut the paragraph's second sentence to reach 83
words, and if it does not work the fix is a content decision, not a CSS one.

---

## Stale-comment sweep

The §01 comment block at ~136 was amended last pass to say *"section 02's lede
now names the three inputs."* That clause is unaffected.

But **§01's lede changes function entirely** — it stated leadership's premise and
now carries orientation. Sweep the file for any comment or note that describes
§01's lede as stating a premise, naming inputs, or otherwise doing what it no
longer does. Report what you find even if nothing needs changing.

---

## Verification

```
rm -rf .next && npm test && npm run build && npm run lint:prose
```

`lint:prose` scans rendered HTML — it is the real check on the em-dash and
banned-word claims, not a grep over source strings.

**Rendered lines, measured, at 1440 / 1024 / 390**, same instrument as last pass
(`Range.selectNodeContents` + `getClientRects`, distinct rounded tops, after
`fonts.ready` twice with a settle), at the real `section-lede` size:

- **The lede is the load-bearing one.** `docs/cc-prompt-s01-spacing-skim.md`
  records §01's lede being cut from 5 rendered lines to a target of **3 at rung
  2**. Current shipped measures 2 / 2 / 5. The new lede is 21 words against 26,
  so it should hold or improve — measure it, do not infer it. `.section-lede`
  sets `text-wrap: balance`, which is not monotonic in word count.
- Report line counts for all four blocks, before and after.
- If the lede exceeds 3 lines at 1440 or 1024, stop and report.

Both modes, and one look at 390 for the two new paragraphs.

---

## Report

1. Rendered line counts, all four blocks, three widths, before and after.
2. **Whether the fully-bold paragraph 2 reads as emphasis or as a break.** Your
   judgment, from looking at it.
3. Per-block word counts, instrument named.
4. The stale-comment sweep result, stated explicitly even if empty.
5. Every gate green.

## Do NOT

Change the heading · move or touch `TestimonyPair` or either quote · touch §02 at
all · touch §03 · touch the `mt-14!` closer · edit Paul's wording, punctuation or
sentence order · add the serial comma · restore anything the 26 Aug comment block
records as deleted · reflow or re-indent any line you are not editing.

## Done means

Diff unstaged, the five reports above delivered, gates green.
