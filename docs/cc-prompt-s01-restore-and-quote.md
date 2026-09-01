# Delivery Promise — restore §01's ask sentence, and fix beat 02's quote

Two edits in `app/content/case-studies/urbn-delivery-promise.mdx`, plus one new
comment block. No components, no CSS, no new modules.

**Stop at the diff. Paul commits, then push.**

---

## 1 · §01 — restore the sentence that was cut

Paragraph 2 currently stands as a single fully-bold sentence at line ~125:

```mdx
**A delivery promise is the date a shopper sees at checkout.**
```

Replace with:

```mdx
**A delivery promise is the date a shopper sees at checkout.** We were asked to get inventory and location data in front of shoppers sooner.
```

### Why, since you measured the reason yourself

Your last pass found that at 390 the fully-bold paragraph wraps to two lines and
paragraph 3's bold lead wraps to two, so a reader hits four consecutive bold
lines with only a paragraph gap before any regular weight arrives. You called it
the closest thing to house-rules §2 firing.

The sentence being restored is the regular-weight tail that breaks that run.
Paul cut it for length and it turned out to be load-bearing for rhythm. This is
the fix he chose over a shorter tail.

§01 body prose goes **83 → 97**, against Nuuly 66, BARD 45, FDT-E 40. Long, and
deliberate. Do not propose trimming it elsewhere.

**Re-measure the bold run at 390** and report whether it resolved. That is the
whole point of this edit — if four bold lines still stack, say so.

---

## 2 · Beat 02 — the pull quote and its citation

**Lines ~180–183.** This is the beat-02 blockquote, inside
`<li data-thread="2">`. There is a **second** `pull-quote--quiet` at line ~233 in
§03 — do not touch that one.

Current:

```jsx
<blockquote className="pull-quote pull-quote--quiet">
  <p>“Ordering, paying, and then 3-4 days later getting the email that the item wasn't actually available anymore.”</p>
  <cite>Anthropologie customer, review</cite>
</blockquote>
```

Replace with:

```jsx
<blockquote className="pull-quote pull-quote--quiet">
  <p>“And, even worse, ordering, paying, and then 3-4 days later getting the email that the item wasn't actually available anymore.”</p>
  <cite>Anthropologie customer</cite>
</blockquote>
```

### What was wrong, and why the fix is what it is

The provenance was unresolved and is now settled. Full derivation in
`claude/delivery-promise-beat-02-quote-provenance.md`. Source is **deck p12**,
first speech bubble, attributed on the slide as `-AN Customer`, transcribed at
8x from the PDF:

> "I love Anthro. BUT I'm so tired of placing things in my cart and then finding
> out the item is no longer available. And then it's STILL on the website a day
> later! **And, even worse, ordering, paying, and then 3-4 days later getting the
> email that the item wasn't actually available anymore.**
>
> Every time it happens I swear I'll never shop here again...one day I'll follow
> through! "

**The words were verbatim. Three things around them were not.**

- **A silent elision.** *"And, even worse,"* was dropped from the front of the
  sentence with no marker. Restoring the three words makes it a complete verbatim
  sentence needing no ellipsis at all — which is why this is the fix rather than
  a bracketed elision.
- **A silent capitalisation.** `ordering` had been raised to `Ordering` to make
  the fragment stand as a sentence. Restoring the opening removes the need.
- **The citation claimed a channel the artifact does not support.** p12 carries
  two kinds of evidence and separates them consistently: **speech bubbles**
  labelled `-AN Customer`, with no username, date or star rating — and **boxed
  App Store reviews**, which carry all three. This quote is a bubble, so the
  channel is unknown. `AN` is the deck's own abbreviation for Anthropologie (it
  is a column header on p11's missed-dates table), so *"Anthropologie customer"*
  is supported and *"review"* is not.

### DO NOT normalise the apostrophe

`wasn't` uses a **straight** U+0027 and that is correct. The bubble's own
typography is straight — `I'm`, `it's`, `wasn't` — verified at 8x. The two App
Store reviews on the same slide use **curly** apostrophes. Same slide, two
typographies, because they are two separately captured artifacts. A quotation is
transcribed per artifact and never normalised to a house convention.

The surrounding curly double quotes are already correct and stay.

---

## 3 · Record the provenance in the file

The quote has no comment recording where it came from, and the last three briefs
each told you to leave it alone because its provenance was open. That is now
closed, and the file should say so — otherwise the next pass re-asks the question.

Add immediately above the blockquote, matching the file's existing comment style:

```
{/* QUOTE PROVENANCE, SETTLED 27 Aug. Deck p12, first speech bubble, attributed
    on the slide as "-AN Customer". Transcribed from the PDF at 8x, not from
    memory. The shipped version had cut "And, even worse," from the front of the
    sentence without a marker and raised "ordering" to "Ordering"; restoring the
    three words makes it verbatim and removes the need for an ellipsis.
    THE CITE IS NOT "review". p12 separates speech bubbles (labelled -AN
    Customer, no username, no date, no stars) from boxed App Store reviews
    (username, date, star rating). This is a bubble, so the channel is unknown.
    THE STRAIGHT APOSTROPHE IN "wasn't" IS THE ARTIFACT'S. Do not normalise it;
    the App Store reviews on the same slide use curly ones.
    Full derivation: claude/delivery-promise-beat-02-quote-provenance.md */}
```

---

## Verification

```
rm -rf .next && npm test && npm run build && npm run lint:prose
```

- `lint:prose` scans rendered HTML — the real check on em-dash and banned words.
- Confirm the apostrophe census after the edit. It was 48 straight / 1 curly;
  restoring three words adds no apostrophes, so it should be unchanged.

**Rendered lines**, same instrument as last pass, at 1440 / 1024 / 390:

- §01 paragraph 2, before and after. It was 1 / 1 / 2.
- **The bold-run check at 390.** Count consecutive bold lines before the first
  regular-weight line. Report the number and whether the §2 shape still reads.
- §01's lede must hold at 2 / 2 / 5 — it is untouched, so any change is a
  regression.
- Beat 02's blockquote, before and after. It shares a row with the `phantom`
  figure at ≥1024; three extra words must not collide or overflow. Check 390 too,
  where the beat stacks.

---

## Report

1. Rendered line counts for §01 paragraph 2 and beat 02's blockquote, three
   widths, before and after.
2. **Consecutive bold lines at 390** — the number, and your judgment on whether
   the run resolved.
3. The blockquote's rendered text, copied back, so the restored words and the
   straight apostrophe can be verified in the output rather than the source.
4. Apostrophe census.
5. Every gate green.

## Do NOT

Touch §03's `pull-quote--quiet` at ~233 · change any heading · touch
`TestimonyPair` or either of its quotes · touch the three friction beats'
headlines, scene text or figures · touch `JourneyLine` / `InversionChart` ·
touch the `mt-14!` closer · reword anything Paul wrote · normalise the
apostrophe · reflow or re-indent lines you are not editing.

## Done means

Both edits in, the provenance comment added, the five reports delivered, gates
green, diff unstaged.
