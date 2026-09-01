# Delivery Promise §01 and §02 — the two-premise arc revision

Three string replacements in one MDX file, plus one comment block that goes stale
if you don't touch it. No components, no CSS, no new modules.

**Stop at the diff. Paul commits, then push.**

Source: `docs/s01-s02-arc-revision.md`. **That document's word counts are wrong —
see §4 below. Use the counts here.**

---

## Why this change exists

The shipped §01 states **two** wrong premises and commits to neither. The
**heading** answers Paul's premise (speed); the **lede** states leadership's
(inventory). They also die to different evidence: the quotes kill Paul's — neither
voice mentions duration — while the data kills leadership's, and that argument
lives in §02 and §03.

Separately, the research method is currently described **twice**, once in each
section's lede.

The revision gives §01 the confession and the handoff, and gives §02 the method
sentence §01 surrenders.

---

## 1. §01 lede — line 123

Replace:

```
<p className="section-lede">Leadership thought this was an inventory problem. I put our researcher into the customer feedback and the help tickets, then ran what she found against the order data.</p>
```

with:

```
<p className="section-lede">Leadership thought this was an inventory problem. I thought it was a speed problem, and that we had to go win a two-day race against Prime.</p>
```

The heading has already said one premise is wrong. Naming Paul's own belief
directly under it makes the section a confession rather than a setup — which puts
the *what failed* hiring question in the first section instead of §06, and makes
it the designer's own failure rather than a business one.

## 2. §01 closer — line 127

Replace:

```
**Shoppers could tell you whether it came when we said it would.** That was the part they remembered, and the part they repeated.
```

with:

```
**Shoppers could tell you whether it came when we said it would.** Not how long it took. My premise was gone. Leadership's was still standing.
```

*"Not how long it took"* says what the right measure was without repeating the
heading's words. *"My premise was gone. Leadership's was still standing"* is what
makes §02 and §03 necessary rather than merely next, and it is precise about an
asymmetry the interview record establishes: **Paul was wrong; leadership was
incomplete.** The record's line is *"Leadership had half the diagnosis."* Half
right is not the same as wrong — do not flatten them.

**Apostrophe in "Leadership's" is U+0027, not U+2019.** Verified against the
file: it carries 46 U+0027 and exactly one U+2019, and that one is the `can't` in
the hero callout string. Rendered body prose in this study uses straight
apostrophes — `shopper's` in the §07 lede is the nearest precedent.

## 3. §02 lede — line 154

Replace:

```
<p className="section-lede">A researcher ran the interviews and I worked the analysis with her, against the order data and the customer service queue.</p>
```

with:

```
<p className="section-lede">A researcher ran the interviews. I worked the analysis with her, against the order data and the customer service queue. The same three breaks kept coming back.</p>
```

Two changes. **Splitting the first clause into its own sentence** makes the
attribution unmissable — the interview record's rule is strict (*a sole researcher
owned the primary research; never write "I interviewed customers"*), and one
clause lets a fast reader run past it. **The third sentence is new** and tells the
reader that three things are about to appear and why there are three; the shipped
lede describes a method and then drops the reader into an unannounced list.

---

## 4. The comment block that goes stale — lines 129–145

**This is the part that is easy to miss and is the actual risk in this job.**

The §01 comment block justifies a 26 Aug deletion with this clause:

> "Three sources, and none of them could see the whole thing." Section 03
> already says "Three sources had already ruled out speed", and **the lede above
> now names the three inputs in the order Paul actually worked them.**

After edit 1, **§01's lede no longer names three inputs** — §02's does. The
deletion is still correct (§03 still says it), but the stated reason becomes
false, and a comment that lies is worse than no comment.

Amend that clause to point at §02 instead. Keep the rest of the block verbatim,
including the two-different-people note, which is unaffected. Say in your report
exactly what you changed it to.

**Check the rest of that block and the §02 figure-slot comment for any other
sentence that assumes the old ledes.** Report what you find even if nothing
needs changing.

---

## 5. Counts, corrected

`docs/s01-s02-arc-revision.md` states 26/23/29. Three of its five figures are
wrong. Recounted:

| | before | after |
| --- | --- | --- |
| §01 lede | 28 | **26** |
| §01 closer | 23 | **25** |
| §02 lede | 21 | **27** |

§01 prose total goes 51 → 51. §02's lede grows by six words.

**Word count is a proxy and not the check.** The house rules state the anchor
budget in **rendered lines**. Measure at the real `section-lede` size (~26px) and
at the real column width, both sections:

- Does either lede gain a rendered line at 1440, 1024 and 390?
- Does §01's closer gain one?

Report the line counts before and after. If §02's lede gains a line at 390, say
so and stop — that is a judgment call for Paul, not something to absorb.

---

## 6. Gates

`rm -rf .next` first, then `npm test` → `npm run build` → `npm run lint:prose`.

- `lint:prose` hard-fails on U+2014. None of the three new strings contains one —
  confirm rather than assume.
- Nothing here touches type, spacing, colour or interaction, but run the full
  build anyway; the MDX compiles through it.

---

## 7. Do NOT

- Change either heading. Both are settled
- Touch `TestimonyPair` or either of its quotes
- Touch the three friction beats, their headlines or their scene text
- Touch beat 02's `pull-quote--quiet` — provenance still unresolved
- Touch `JourneyLine` / `InversionChart` in §03, or anything else in §03
- Touch the `mt-14!` closer
- Restore anything the 26 Aug comment block records as deleted
- Reflow, re-wrap or re-indent any line you are not editing

## Done means

Three strings replaced, the comment block amended and the amendment quoted in the
report, rendered line counts reported for both ledes and §01's closer at three
widths, every gate green, diff unstaged.
