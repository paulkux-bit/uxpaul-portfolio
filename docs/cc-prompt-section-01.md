# Delivery Promise — section 01 rebuild, plus the two edits it forced in section 03

**Scope note.** This covers the **second stop in Paul's section-by-section cold
read**: section 01, the problem section. (The hero was the first stop and shipped
as `a7327e1`.) **Section 02, the friction beats, has not been read yet** and
nothing in this brief touches it.

Written 26 Aug 2026. Every layout number below was measured off a render at 1100
and a real 390, both modes. Do not re-derive them.

**Stop at the diff. Paul commits.**

---

## 0. Read these first, in this order

1. `docs/case-study-house-rules.md` — the measured rules. §1 budgets, §5 no type
   inside a figure, §8 modules must not repeat
2. `docs/previews/quote-pair-locked.html` — **the target render.** This is what
   section 01 must look like. The `.tpair` block is the spec
3. `docs/previews/quote-pair-prototype.html` and `quote-pair-A.html` — the four
   rejected forms and the two rejected variants, kept so nobody rebuilds them
4. `components/case-studies/urbn-delivery-promise/inversion-manifest.json` — the
   manifest pattern to follow, including the `$doc` convention

**Two project-knowledge docs govern the facts here and you cannot open them.**
Everything from them that you need is inlined below, verbatim. If something seems
to be missing, stop and ask rather than reconstructing it:

- `claude/delivery-promise-app-store-reviews.md`
- `claude/delivery-promise-interview-record.md`

---

## 1. Build `TestimonyPair`

`components/case-studies/urbn-delivery-promise/TestimonyPair.tsx` plus
`testimony-manifest.json`. Port the `.tpair` block from
`docs/previews/quote-pair-locked.html`.

**What it is and why it exists.** It occupies the slot `FramedPair` fills in BARD,
FDT-E and Nuuly. Those three open with two before-screens; this study has none,
because the deck's only screens are ideation and solution work. The prose had been
compensating, which is why section 01 ran 3-5x longer than the others. The honest
substitute is two voices, because this study's problem evidence is what people
said rather than what a screen looked like.

**No geometry.** No SVG, no viewBox, no computed positions. Two cells, a rule
above each, three text nodes per cell.

**Caption contract is `FramedPair`'s, with the ORDER inverted, deliberately.**
`FramedPair` puts its caption below the image (`uscg-bard.mdx:50-76`). Here the
lead sits *above* the quote. An image is legible at a glance; a 45-word quote is
not, so the takeaway has to be catchable before the reader commits. It also keeps
the two leads level at the top, where they read as a pair. A1 in
`quote-pair-A.html` is the version with the lead underneath, and it fails for
exactly this reason: the quotes are different lengths, so the takeaways land at
different heights and never read as a pair.

**No outer `figcaption`.** `FramedPair` has none either. Do not add one.

**Every string in the manifest.** Editing a quote or swapping a source must change
the render without opening the `.tsx`.

```json
{
  "$doc": "Content for <TestimonyPair>, section 01. Two voices in the slot FramedPair fills in the other three studies. No geometry: two cells, a rule above each, three text nodes per cell.",

  "$quoteDoc": "BOTH QUOTES ARE VERBATIM TRANSCRIPTIONS AND NEITHER MAY BE REWORDED. Ellipses mark real elisions and are legitimate; substituting or smoothing a word turns a quotation into a fabrication. An earlier draft of the right-hand quote was reconstructed from Paul's spoken description and rendered 'They're still running me in circles about it.' as the fragment 'still running me in circles' — close, and wrong. If either quote ever needs re-checking, the source is claude/delivery-promise-app-store-reviews.md, not this file and not anyone's memory.",

  "$leadDoc": "Both leads report what the SHOPPER SAID, never what URBN confirmed. 'She thinks we hit her date', never 'we hit her date' — URBN never confirmed that specific order and she is not certain either. Paul ruled on this 26 Aug: 'go with the truth.' The uncertainty is the finding, not a weakness in it. The parallel is load-bearing: could not / could, on the same measure.",

  "$sourceDoc": "The left source is a moderated research session; the right was written in public, unprompted. That difference is what section 01 is about, which is why the source line is present at all rather than the quotes running anonymous. Do not merge the two into one generic 'customer' label.",

  "$pronounDoc": "'She' for an unnamed URBN shopper is cleared: Paul ruled 26 Aug that most of URBN's customers are women. This licenses the generic. It is NOT a claim about the identity of amosinky, whose gender is not stated in the review.",

  "cells": [
    {
      "lead": "She thinks we hit her date. She could not tell you how long it took.",
      "quote": "I think it got around here right on time […] I don't remember complaining about it to my friends […] if it said it was gonna get here on say like the 5th and it got here later I would have told my friends, 'my damn package isn't here.'",
      "source": "Research session"
    },
    {
      "lead": "She says we missed hers by a day. She could tell you what it cost.",
      "quote": "I relied on this and bought $190 in vacation clothes only to have the shipment arrive a day late, after my departure. I could've spent that money locally […] and actually had the clothes to take with me. […] They're still running me in circles about it.",
      "source": "App Store review, July 2019"
    }
  ]
}
```

**Typographic quotes.** The manifest holds the words; the component supplies the
opening and closing curly quotes. Curly apostrophes inside the quoted text
(`don't`, `could've`, `isn't`, `They're`) are part of the string. The currently
shipped `blockquote` mixes straight and curly apostrophes in the same sentence;
do not carry that forward.

**The `[…]` elision markers render at `--text-muted`** so they read as editorial
marks rather than as part of the speech.

---

## 2. Section 01's MDX

Replace the whole of `<section className="cs-section cs-section--problem">`
(currently lines 114-131) with:

```mdx
<section className="cs-section cs-section--problem">

## Speed was the wrong thing to measure.

<p className="section-lede">Leadership asked us to surface inventory and location data earlier in the shopping journey, because shipping was going wrong. I asked our researcher to start in the customer feedback and the help tickets, then ran what she found against the order data.</p>

<TestimonyPair />

**Most shoppers could not tell you how long an order took. They could tell you whether it came when we said it would.** That was the part they remembered, and the part they repeated.

</section>
```

Add the `TestimonyPair` import beside the other four.

**Three things are being deleted on purpose. Record them in an MDX comment so a
later pass does not restore them:**

- **The `pull-quote--quiet` blockquote.** The same quote is now the left cell of
  `TestimonyPair`. It is not lost, it moved.
- **"Three sources, and none of them could see the whole thing."** Section 03
  already says "Three sources had already ruled out speed" and the new lede names
  the three inputs in Paul's own working order. Saying it twice was the reason the
  section read as setup rather than as evidence.
- **"One shopper bought a wardrobe for a vacation, weeks ahead…"** The App Store
  quote now carries a vacation failure directly, in the shopper's own words,
  including the aftermath ("still running me in circles"). Note that these are
  **two different people** — the deleted paragraph was a customer-service case, the
  quote is a public review. Paul confirmed 26 Aug they are not the same customer.

**Measured length after the change: 106 words of Paul's prose, 74 quoted, 180
total.** Against roughly 230 before. Report your own count; if it disagrees with
mine, mine is wrong and I want to know.

---

## 3. Section 03, two edits

Section 03 is `<section className="cs-section">` beginning at line 196,
`## We failed hardest where we charged the most.`

### 3a. One word

Line 206 currently ends: *"The shoppers who needed the date most were the ones we
failed most."*

Change **"failed most"** to **"failed most often."**

This is not a style edit. "Failed most" can be read as absolute count, and the
absolute count is the opposite of true: expedited is about 4% of orders, so
standard shipping still produced the majority of raw missed dates. What is true is
the *rate*. "Most often" says rate unambiguously.

### 3b. One new paragraph

Insert after the `"I have to be extremely desperate to pay for expedited."`
blockquote and before the "Three sources had already ruled out speed" paragraph:

```mdx
**People had already written this down in public.** URBN's App Store shipping complaints clustered in the tiers a shopper pays for or unlocks: a free express benefit, a paid next-day, a rush order. The tier we charged for was the tier people wrote about.
```

**Provenance, since you cannot read the source doc.** The deck's App Store slide
carries three reviews: a 1-star titled "Free express shipping" (Jul 25 2019), a
2-star "Next day shipping problems" about paying extra for next-day (May 22 2019),
and a 1-star "delayed rush order?" (Jun 5 2019). All three are premium or expedited
promises; none is a complaint that standard shipping was slow. Paul confirmed on 26
Aug that this reflects where complaints genuinely clustered, not a curated pick of
worst cases.

**The line this paragraph must not cross.** It says *complaints* clustered. It must
never say or imply that *missed dates* clustered in expedited, because they did
not. Do not "tighten" it into a claim about failure volume.

### 3c. Leave one thing alone

The close still reads **"Three sources had already ruled out speed."** Keep it at
three. The reviews are a fourth evidence layer but they do not rule out speed, they
confirm where the failure concentrated. Different job, different sentence.

---

## 4. Spacing and type, already resolved by measurement

**Use these, do not re-derive them.**

| Slot | Token / value |
| --- | --- |
| Between the two cells | `--spacing-l` (2rem) |
| Inside a cell | `--spacing-xs` (0.75rem) |
| Cell rule to content | `padding-top: --spacing-s` |
| Figure top margin | `--spacing-xl` |
| Lead | 1.125rem / 600 / `-0.01em` / `--text-primary` |
| Quote | 1.0625rem / 400 / `--text-primary` |
| Source | 0.875rem / 600 / uppercase / `0.09em` / `--text-muted` |

**The quote must stay a step below the lead.** An earlier variant had both at
1.125rem at desktop and the hierarchy flattened. It also pushed the right lead to
three lines against the left's two, which breaks the levelness the whole layout is
for.

**The source line is `--text-muted`, never `--text-subtle`.** 14px is below the
AA-large floor `--text-subtle` is scoped to. `.pull-quote cite` already does this
correctly at the same size; match it.

**Cells use `align-content: start`** so unequal quote lengths do not stretch the
rows.

---

## 5. Gates

`npm test`, then `npm run build`, then `lint:prose`. Report every number.

Known traps, all live:

- **`lint:space` check 4 forbids spacing inside a media query.** The prototype
  declares `gap` on `.tpair__grid` outside the breakpoint *and again inside it*
  with the same value. **That second declaration is a lint failure and must not be
  ported.** The media query sets `grid-template-columns` only.
- `lint:type` hard floor is 14px. Nothing here goes below `0.875rem`
- `lint:prose` hard-fails on em-dash U+2014 and scans rendered `.next` HTML, so all
  new prose is in scope. The word "vacation" and the `$190` figure are fine; watch
  the dashes
- `lint:color`'s `EXTS` excludes `.html` and `.md`, so the previews and this brief
  are structurally exempt. It does scan untracked `.tsx`
- Commissioner has no `wdth` and no `opsz`
- Verify at a real 390px viewport. A browser resize is invalid

Run `__tests__/cover-art.test.mjs` too. Nothing here should touch it and a green
run is the cheap confirmation.

---

## 6. Report these, fix none of them

**Rank by severity. Bring findings back before touching anything.** A build and a
review of that build in one commit means neither can be judged.

**Run the skim extraction cold.** Pull eyebrows, headings and bolded phrases in
page order across the whole study, paste the flat list, and confirm all four hiring
questions still answer from it alone. Section 01 just lost two bolded leads and
gained two; say what that did. **Then prove it in both directions** — delete the
line you think carries "what failed" and confirm the answer actually disappears.

**Check one specific callback.** Section 04 line 225 reads *"The vacation that left
without its clothes."* Before this change, section 01 described that customer in
prose. After it, the only vacation in the study is the App Store reviewer, who is a
**different person**. Does the callback still land, does it now read as pointing at
the quote, and is that a problem? Report and recommend; do not fix.

**Does `TestimonyPair` pass the invention test?** House rule: does this module
carry an argument the prose cannot? Make the case for or against in one paragraph.
A module you argue yourself out of is a better outcome than one that ships because
it was specced.

**Do the five modules read as five different hands?** The study now carries
`JourneyLine`, `InversionChart`, `PromiseSequence`, `RoadmapTable` and
`TestimonyPair`. House rules §8. A source-ledger form for the quotes was rejected
during design specifically because `RoadmapTable` already ships that shape — check
whether the form that replaced it actually escaped the collision.

**Then check the checks.** Fifteen of twenty findings across this repo's four
design-system migrations were faults in the measuring instrument, not the thing
measured. For every green result, say how you would know if it were lying. The
cover-art defect shipped through six green gates and was caught by eye in four
seconds.

---

## Do NOT

- Reword either quote, for length, tone, grammar or anything else
- Add an outer `figcaption` to `TestimonyPair`
- Restore the deleted blockquote, the "three sources" line, or the vacation
  paragraph
- Build anything from the rejected forms in the two preview files
- Change "Three sources had already ruled out speed" to four
- Write or imply that most missed dates were expedited
- Change `problemFraming` or `projectName` in `app/data/case-studies.ts` — the card
  is written after this lands, and Paul writes it
- Touch `heroImage` or any crop. The crop pass is a propose-and-judge session with
  Paul
- Force-add anything from `public/case-studies/**/_raw/`. **The repository is
  public** and those extracts hold per-brand failure rates and absolute order counts
  that Paul cleared for exclusion

## Done means

1. Section 01 renders as `docs/previews/quote-pair-locked.html` does
2. `TestimonyPair` takes every string from its manifest
3. Zero hardcoded colours, spacings or type values
4. Both modes, and a real 390px viewport
5. Every gate green, every number reported
6. Findings delivered as findings, nothing fixed
7. A Vercel preview URL, committed and pushed to the branch
8. **The diff is unstaged and Paul commits it**
