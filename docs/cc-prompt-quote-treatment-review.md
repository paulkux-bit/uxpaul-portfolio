# Review pass — colour and font for the research quotes in `TestimonyPair`

**This is a review, not a build. Change nothing. Bring findings back.**

You are reviewing as the person who owns craft standards on this repo, not as the
person who built the module. Paul asked specifically about **colour and typeface
treatment for the quoted matter** in section 01 of the Delivery Promise study.

A recommendation already exists and is argued below. **Your job is to try to
refute it**, then say what you actually think. A review that agrees with the brief
it was given is not evidence of anything.

---

## 0. Read these first

1. `docs/previews/s01-source-line.html` — three source-line settings, quotes held constant
2. `docs/previews/s01-quote-colour.html` — three ink options for the quotes themselves
3. `docs/case-study-house-rules.md` — §5 is now scoped to drawn figures, corrected 26 Aug
4. `app/globals.css` — `.testimony-pair*` at ~4614, `.pull-quote` and `.pull-quote cite` at ~2248
5. The locked specs: `type-system-v3-locked.md` and `color-system-v2-locked.md` (project knowledge — if you cannot open them, say so rather than reconstructing what they say)

---

## 1. What is shipped

```
.testimony-pair__lead    18px / 600 / -0.01em / --text-primary
.testimony-pair__quote   17px / 400 / 1.5     / --text-primary
.testimony-pair__source  14px / 600 / 0.09em  / uppercase / --text-muted
.testimony-pair__elision                                    --text-muted
```

Surrounding context, from `globals.css`: the section lede is rung 2 (~26px at
1100) at `--text-secondary`; body prose is 18px/1.65; the `h2` is rung 4.

Both quotes are verbatim transcriptions. **They may not be reworded, re-cased or
re-punctuated for any typographic reason.** If a treatment requires changing the
text, the treatment is wrong.

---

## 2. The recommendation you are testing

**Quotes stay at `--text-primary`. Only the source line changes, to weight 500.**

The argument, in full, so you can attack it:

- **Quoted content is not a pull quote.** Editorial convention distinguishes a
  *pull quote* (a fragment repeated from the body for emphasis, which may take a
  different colour because it is redundant furniture) from a *block quote*
  (source material the reader must read, which is set in the same font, size and
  colour as running body text). These quotes appear once and are the section's
  only first-hand evidence.
- **Greying signals demotion.** Lightness hierarchy reads dark-as-primary,
  light-as-secondary. Greying is for captions, labels and supplementary matter.
  These quotes are primary content.
- **The section already runs three ink levels, correctly assigned.** Primary for
  the heading, leads and quotes. Secondary for the lede. Muted for sources and
  elision marks. A fourth distinction inside primary would spend a level on
  something the quote marks and the source line already do.
- **Contrast does not decide it.** Measured against `--bg-canvas`:
  `--text-primary` 16.47:1 light / 16.38:1 dark; `--text-secondary` 10.45 /
  11.19; `--text-muted` 6.04 / 7.32. All pass AA-normal at 17px. **Verify these
  numbers rather than trusting them.**
- **The source line is the actual defect.** At 600/uppercase it is louder than
  `.pull-quote cite`, the site's own citation register, which is 500 and not
  uppercase. But copying `cite` exactly (sentence case) rendered worse, because
  `cite` sits under 28-56px display type where the size drop alone separates it,
  while here the drop is 17 to 14 and the **case change is carrying the
  differentiation**. Hence 500 with the uppercase kept.

---

## 3. What you are actually being asked

### Colour

Is `--text-primary` right for the quoted matter, or is there a defensible case for
`--text-secondary`? **Argue the strongest version of the case against the
recommendation before agreeing with it.** In particular:

- Does the "block quote stays at body colour" convention survive the fact that
  the surrounding body prose on this page is **not** at `--text-primary`? The
  lede is `--text-secondary` and the closing paragraph inherits from
  `.case-study-prose`. **Measure what the neighbouring prose actually computes
  to** — if the running text near this module is already secondary, then a quote
  at primary is *darker* than body, not equal to it, and the convention has been
  applied backwards. This is the single most likely way the recommendation is
  wrong. Check it first.
- Nuuly, BARD and FDT-E each carry a `.pull-quote--quiet`. What ink does quoted
  matter get on those pages today, measured rather than read from CSS? If the
  site already has a convention for "someone else's words," this module should
  either match it or have a stated reason not to.

### Font

The constraints, so you do not propose something the repo cannot ship:

- **Commissioner is a roman variable font, weight 340-720. There is no `wdth`
  and no `opsz` axis** — both were removed in C3.
- **There is no italic.** The italic lives in a separate binary that is not
  shipped, and `globals.css:487` remaps `em, i` to `font-style: normal;
  font-weight: 600` for exactly that reason.
- **`FLAR` is capped at 52px** by the C5 ruling — flare below that size arrives
  as weight and fuzz rather than as flare. Quotes are 17px, so flare is not
  available.
- `lint:type` has a 14px hard floor.

So the live levers are **weight, size, tracking and leading**, and the questions
worth answering are:

- **Is 400 right, or is 340 the better instrument?** The site's signature pair is
  340/720 and 340 is currently used at display sizes only. A quote at 340/17px
  would recede by weight rather than by colour — which sidesteps the "never grey
  primary content" objection entirely, because lightness is untouched. **Measure
  whether 340 holds up at 17px**; Commissioner carries 13% more ink than
  Bricolage at the signature pair, and the migration found the cost lands at
  small sizes, not display. If 340 is mushy at 17px, say so with the measurement.
- **Is 17px right?** It sits 1px under the lead and 1px under body prose. Is that
  a hierarchy or a near-miss? Does it land on a rung, and if not, does that
  matter here?
- **Would shipping the italic binary be worth it?** True italic is the oldest
  answer to "these are somebody else's words." Cost: a second font file against a
  55.5 KB roman that sits on the LCP element of the three most important pages.
  **Give a number, not an impression**, and then rule.

---

## 4. Method

**Measure, do not reason from the CSS.** Every number in this brief was taken
from a render, and two of them have already been wrong this session.

**Two prototype defects are on record and both are the same species — a
prototype that was correct in the wrong context.** Watch for the third:

- A duplicate `gap` inside a media query that only failed against a gate the
  prototype had no way to run.
- A scaffolding rule at specificity (0,2,1) outranking the module's own (0,1,0)
  colour rules, so **three "different" colour options rendered identically** and
  the error was invisible until computed styles were read.

The rule that came out of it: **a prototype's scaffolding must not be able to
outrank the thing being prototyped.** If you build any comparison to answer the
questions above, read `getComputedStyle` on the thing you are varying and prove
the variants actually differ before drawing a conclusion from the picture.

**Check the checks.** For every green result, say how you would know if it were
lying. Fifteen of twenty findings across this repo's four design-system
migrations were faults in the measuring instrument rather than the thing measured.

---

## 5. Deliverable

Findings, ranked by severity. For each: the measurement, the conclusion, and the
recommendation. **Change no code.**

Answer these three explicitly, in one sentence each, before the detail:

1. Should the quote ink change? Yes or no.
2. Should the quote weight or size change? Yes or no.
3. Is the source line at 500-with-uppercase right, or is there better?

**If you agree with the recommendation, say which specific attack you tried and
why it failed.** If you disagree, say so plainly — a recommendation argued out of
existence by evidence is a better outcome than one that ships because it was
written down first.

## Do NOT

- Change any file
- Propose anything requiring a second typeface, an axis Commissioner does not
  have, or flare below 52px
- Propose rewording, re-casing or re-punctuating either quote
- Touch section 02, which has not been read yet
