# Commissioner — the line-break measurement

> **STATUS: closed 22 Aug 2026.** **What it was:** the cost measurement that
> turned "re-verification will be expensive" into a number, written 21 Aug 2026.
> **How it closed:** the swap shipped; C2 measured 181 / 1209 against this
> document's ~11% prediction. **Where the outcome lives:**
> `docs/type-system-v3-locked.md`, amended in place.
>
> Its instruments survive and are maintained — `measure-linebreaks.mjs` and
> `diff-linebreaks.mjs` are the site's standing regression detector. Two it names
> do not: `measure-fallback-shift.mjs` was **deleted** 22 Aug 2026 (subsumed by
> `FALLBACK=1`), and `sig-ink.mjs` is kept but **unmaintained**, with a header
> saying so.
>
> **CORRECTION, 22 Aug 2026 — every element count in this document is impure.
> The body below is unedited on purpose; it is a measurement record.**
>
> `scripts/measure-linebreaks.mjs` filters out `visibility: hidden` and
> `display: none`. It does **not** catch the clip idiom — `position: absolute`,
> a 1px box, `clip: rect(0,0,0,0)` — which is how `.sr-only` hides text. Those
> spans own text, have a non-zero rect, and were counted.
>
> **Measured, not inferred: 9 of the 1,209 measurements are visually hidden**
> (three `.sr-only` spans on `/`, one per card in `case-study-card.tsx`, at three
> viewports each). **The pure population is 1,200.** Every changed-count in this
> document and every one this migration produced carries that impurity —
> including the headline `181 / 1209` — so they should be read as *impure*
> rather than reused as clean. Nothing concluded here appears to flip: the band
> decomposition still matches Finding 1 to the element.
>
> **One claim in the body is wrong rather than merely impure.** §"the noisiest
> element in the whole sweep in both faces" describes `.case-card__title-link`
> oscillating 3/4/5 lines. That was the artifact: the sr-only span inside each
> card link added two phantom lines to every reading. **The real range is 1–3.**
>
> Not fixed silently, and not fixed by default. Ordinals are how runs align, so
> dropping the spans renumbers the walk — measured, a clean run diffed against a
> counted one reports **96 phantom misalignments from 9 removed elements**. The
> harness now prints its hidden count on every run and offers `--exclude-hidden`
> as an opt-in, valid only when both sides were captured under it.
>
> **The tally this belongs to:** an instrument fault, not a code fault — the
> sixteenth against fifteen code faults, in a project whose most-cited lesson is
> that ratio.

Open item 1 from `commissioner-handoff.md`: *"Build the site twice, Bricolage and
Commissioner, and diff rendered line counts across every heading, caption and
card title on all three studies plus home and about. Turns 're-verification will
be expensive' from an estimate into a number."*

This is that number. Written 21 Aug 2026, against `commissioner-preview` at
`7926687` (which applies cleanly to `main` at `38182fc`).

Nothing here is a decision. Two of the findings contradict
`commissioner-feasibility.md`, and both contradictions are load-bearing.

---

## Method

`scripts/measure-linebreaks.mjs` renders every element that directly owns
visible text on `/`, `/about`, and the three shipped case studies, at 390 / 768
/ 1440, and records for each element its line count **and the text of every
line** — word by word, via one `Range` per word grouped by rect top. That is
403 elements × 3 viewports = **1,209 measurements per run**.
`scripts/diff-linebreaks.mjs` aligns two runs by ordinal and verifies alignment
with a text digest; zero misalignments in every pair below.

`scripts/sweep-breakpoints.mjs` then takes the display strings the diff flagged
and sweeps the viewport 320 → 1600 in 16px steps to find the exact band in which
each one holds a single line.

**Both faces are loaded through `next/font/local` from the Fontsource woff2** —
the same Google build, Commissioner v1.001 — because this container cannot reach
`fonts.googleapis.com` either. That keeps `next/font`'s size-adjusted fallback
derivation intact for both, which is what makes the A/B honest. The only file
that differs between the two builds is `app/fonts.ts`.

### Re-running it

The harness measures whatever the server is serving, so switching faces is a
two-line edit to `app/fonts.ts` and a rebuild. Where Google Fonts is reachable
that is just swapping the loader:

```ts
// export const bricolage = Bricolage_Grotesque({ …, axes: ['opsz','wdth'] });
export const bricolage = Commissioner({
  subsets: ['latin'], variable: '--font-bricolage', display: 'swap',
  axes: ['FLAR', 'VOLM'],
});
```

Then, per face:

```
npx next build && npx next start -p 3000
node scripts/measure-linebreaks.mjs <label> [variant]
node scripts/diff-linebreaks.mjs bricolage <label>
node scripts/sweep-breakpoints.mjs <label>
```

`measurements/` is gitignored — the JSON is ~500 KB a run and regenerates in
about ninety seconds.

### The five runs

| Run | What |
|---|---|
| `bricolage` | Production, unmodified. The baseline |
| `bricolage-nowdth` | **The control.** Bricolage with every width declaration neutralised, so it sets at `wdth` 100 everywhere — the state Commissioner is permanently in |
| `commissioner-naive` | Commissioner, every size and rule left exactly as shipped |
| `commissioner-body19` | Commissioner + the 19px body §6 of the study derives from x-height |
| `commissioner-target` | Commissioner + 19px body + voice by rung (`soft`) + the rung-0 split |

The control is the run that matters, and it did not exist in the plan. It
separates *"the width axis is gone"* from *"the typeface is different"* — two
costs the study treats as one, which behave nothing alike.

---

## The headline number

| Comparison | Elements that re-break | Gained a line | Lost a line | New widows |
|---|---|---|---|---|
| → `commissioner-naive` | **182 / 1209 (15.1%)** | 8 | 41 | 21 |
| → `commissioner-body19` | **142 / 1209 (11.7%)** | 11 | 34 | 5 |
| → `commissioner-target` | **138 / 1209 (11.4%)** | 11 | 31 | 5 |
| → `bricolage-nowdth` (control) | **11 / 1209 (0.9%)** | 10 | 1 | 0 |

So the swap re-breaks **roughly one line-set in nine**, and — the part that
matters — **the target configuration is less disruptive than the naive one.**
The 19px body is not a tax on top of the swap. It is most of the mitigation.

---

## Finding 1 — the width axis was doing fitting work, and the study says it was not

`commissioner-feasibility.md` §2, under *"The finding that makes this cheaper
than it looks"*:

> every remaining width value on the site is assigned automatically by rung and
> is never co-visible with a different value… the width axis, as shipped on
> `main` today, carries no perceptual payload anywhere. Deleting it costs
> nothing the current system values. **That is the single largest de-risking
> fact in this document.**

The first half is right and the conclusion does not follow. Width carries no
*perceptual* payload — nobody reads 88 against 100 as meaning. It carries a
**fitting** payload, because 88% width is 12% more characters per line, and the
case-study hero sentences are authored to fit one line.

The control proves it cleanly. Neutralising width on **Bricolage** — same
typeface, same everything — reproduces **every single one** of the display-type
line breaks the Commissioner swap causes:

| | `bricolage` → `bricolage-nowdth` | `bricolage-nowdth` → `commissioner-naive` |
|---|---|---|
| Elements changed | 11 (0.9%) | 178 (14.7%) |
| Display headlines going 1 line → 2 | **6** | **0** |
| Body/reading elements re-broken | 0 | 134 |
| New widows | 0 | 21 |

**All of the display breakage is the missing width axis. None of it is
Commissioner.** All of the body re-flow is Commissioner, and none of it touches
a headline.

### What it costs, exactly

The sweep, per hero sentence — the viewport band in which it holds one line:

| Sentence | Bricolage (`wdth` 88) | Bricolage @ `wdth` 100 | Commissioner |
|---|---|---|---|
| BARD — "The system couldn't speak it." | **560–928px** | 704–704px | 688–720px |
| FDT‑E — "An anomaly isn't intelligence" | **528–976px** | 672–752px | 656–752px |
| Nuuly — "A building, a business model," | **544–960px** | 688–736px | 656–752px |
| FDT‑E — "until someone works it." | 416–1008px | 496–1008px | 480–1008px |
| BARD — "The data was there." | 352–1008px | 400–1008px | 384–1008px |
| Nuuly — "and no process." | 320–1600px | 336–1600px | 320–1600px |

Commissioner is very slightly *better* than un-widthed Bricolage on every row.
The typeface is not the variable.

**Three of the six sentences lose their single-line band** — a ~400px-wide
window collapses to 30–100px, which in practice means it is gone. The other
three are short enough not to care.

**And this is smaller than it sounds, which is worth saying plainly.** Above
~1000px all six sentences are already two lines in Bricolage today. Two lines is
the shipped desktop rendering, not a failure state. What disappears is a
mid-viewport moment where the sentence pulls onto one line. Nothing overflows,
nothing clips, and the module arguably reads more consistently across viewports
afterwards.

If the moment is worth keeping, the fix is copy, not code: each of those three
sentences needs to lose about **12% of its set width** — two or three characters
— to hold one line at `wdth` 100. That is three strings, authored by hand, on
three case studies.

The home page `.case-card__title-link` is the one place the control looks worse
than Commissioner, and it is the noisiest element in the whole sweep in both
faces — it oscillates between 3, 4 and 5 lines as the viewport moves. That is a
pre-existing wrapping problem the swap surfaces rather than causes, and it
deserves its own look regardless of the font decision.

---

## Finding 2 — the 19px body is the mitigation, not the cost

Measured advance width of real body copy at 18px, BARD desktop:

| String | Bricolage | Commissioner | Δ |
|---|---|---|---|
| "Investigators enter local details; the Coast Guard's view is one toggle away." | 699.5px | 670.1px | **−4.2%** |
| "Inputs like tidal data appear only when relevant." | 404.6px | 387.2px | **−4.3%** |
| "Standardized picklists keep local terms aligned." | 401.9px | 383.4px | **−4.6%** |

Commissioner sets about **4.3% narrower** at reading size. That is why 41
elements *lose* a line under the naive swap and only 8 gain one — the body copy
gets shorter, not longer.

Raising the body from 18px to 19px is +5.6%, which very nearly cancels it:

| Run | Re-broken | New widows |
|---|---|---|
| `commissioner-naive` (18px) | 182 | **21** |
| `commissioner-body19` (19px) | 142 | **5** |

§6 of the study derives 18.76px ≈ 19px from **x-height matching**, and treats
the resulting ruling change as a cost. It is independently the **measure-
preserving** body size, and it removes three-quarters of the new widows. Two
separate arguments land on the same number, which is about as good as this kind
of decision gets.

The remaining five widows, named:

```
/about@mobile          p.about-row__body        → "visualizations."
/about@mobile          p.about-contact__body    → "trip."
/uscg-bard@mobile      span.bento-theme__gloss  → "directly."
/nuuly@mobile          p                        → "matches."
/us-navy-fdt-e@desktop p                        → "next."
```

Five strings. That is the whole widow tail.

---

## Finding 3 — the reading voice is free

`FLAR` 15 applied to the whole document against `FLAR` 0:

**3 elements out of 1,209 change. 0.2%.**

§3.3 of the study raises a nonzero reading flare as "a real option" and defers
it to the spike, and the spike route carries it as a toggle. On the
re-verification axis the question is settled: keeping family character in prose
costs essentially nothing to re-fit. Whether it *looks* right is still an eye
call, but it is now an eye call with no cost attached to saying yes.

Worth adding from looking at the bench rather than the numbers: at 18px the
difference between `FLAR` 0 and `FLAR` 20 is very nearly invisible. §3.3 frames
this as a real choice about whether rungs 0–2 look like the same family as rungs
5–6; rendered, it barely registers either way. That is an argument for 0 on
grounds of not paying for a declaration that does nothing, and an argument for
15 on grounds that it costs nothing and the family character is there if the
reader leans in. It is not the consequential decision the study implies.

Voice by rung and the rung-0 split are similarly close to free —
`commissioner-body19` (142 changed) to `commissioner-target` (138 changed) is
noise. **The entire voice system costs nothing in line breaks.** All of the
re-fitting is the face and the body size.

---

## Finding 4 — ruling 3 survives, and §7 has the signature backwards

§7 argues the 340/720 pair covers less of Commissioner's design space than
Bricolage's (0.443 against 0.633 after `avar`), concluding *"ruling 3 does not
survive as written… the signature is re-numbered, roughly 340/820, or it is
accepted as a quieter gesture."*

**First, a scoping fact the measurement turned up.** Scanning every element on
all five surfaces for a computed weight of 340 or 720: the pair renders in
**exactly one place on the shipped site** — the home hero at 60px, `.text-lede`
at 340 with `consumer` / `enterprise` / `defense` at 720. Not on the about page,
not in any case study. Ruling 3 reserves three placements and one is spent. §7
also says to *"check the actual signature strings, not a specimen: whether this
matters depends on whether a `g` appears in them."* It does not — there is no
`g` in the heavy half. The clumsy heavy-weight counter is not currently exposed.

That is a design-space-position argument, and the study says of it, correctly:
*"Design-space position is a proxy for perceived weight, not a proof."* Measured
against rendered ink instead — `scripts/sig-ink.mjs` sets "designing gauges" at
88px, screenshots it at 2× and counts dark pixels — the proxy points the wrong
way.

| Pair | Ink ratio (heavy ÷ light) |
|---|---|
| **Bricolage 340/720** (shipping today) | **1.634** |
| Commissioner 340/700 | 1.784 |
| **Commissioner 340/720** | **1.851** |
| Commissioner 340/800 | 2.104 |
| Commissioner 340/820 | 2.160 |

Commissioner's 340/720 is **13% more weight contrast than the pair shipping
today**, not less. Moving to 820 would make it 32% louder — a different design,
not a restoration.

Two things explain the inversion. **Bricolage's weight axis saturates**: its
maximum is 800, and ink is identical at 800, 820, 860 and 900 because the axis
clamps. And Bricolage flares its stems at light weights to hold up against the
ink traps, so its 340 is the *heavier* light end:

| | ink at 340 | ink at 720 |
|---|---|---|
| Bricolage | 46,844 | 76,562 |
| Commissioner | 44,825 | 82,972 |

Commissioner's light end is 4.3% thinner and its heavy end 8.4% fatter. The pair
is compressed at both ends in Bricolage and stretched at both in Commissioner.

**So "340 may read anaemic" is real but small** — 4.3% less ink, about the
difference between Bricolage 340 and Bricolage 330. If you want the light end
matched exactly, **Commissioner 360 is the number**: 46,902 ink against
Bricolage 340's 46,844, a 0.1% error. That gives a 360/720 pair at ratio 1.769 —
still louder than today.

Caveats, stated rather than buried: ink coverage at one size, one string, one
threshold is a better proxy than design-space position and still a proxy. It
says nothing about stroke modulation, and nothing about the clumsy heavy-weight
`g` counter §7 flags from Schöndorfer — that objection stands on its own and
needs an eye, not a pixel count.

---

## Finding 5 — the fallback metric is better, not worse

§6 predicts CLS gets *"slightly worse"*, reasoning that Commissioner's x-height
(0.496) sits further from Arial's (0.519) than Bricolage's (0.517) does.

What `next/font` actually emits, both computed by the same code path from the
font's own metrics:

```
bricolageLocal Fallback:    ascent 91.48%  descent 26.56%  size-adjust 101.66%
commissionerLocal Fallback: ascent 101.91% descent 20.64%  size-adjust  99.79%
```

Commissioner needs a **−0.21%** size adjustment against Bricolage's **+1.66%**.
By the metric `next/font` uses to build the fallback, Commissioner is the closer
match to Arial, not the further. The ascent/descent redistribution §6 describes
is real and is in those numbers — it just does not land where the prediction
said. Still worth measuring live against the <0.05 budget rather than asserting
either way.

---

## Corroborated without change

**Payload**, subset independently from the Fontsource Latin builds with
`fontTools`, `slnt` and `VOLM` instanced out where noted:

| Configuration | Size | vs shipping |
|---|---|---|
| Bricolage, 3-axis (shipping today) | 128.5 KB | — |
| Commissioner, 4-axis | 92.9 KB | −28% |
| **Commissioner, 3-axis (`slnt` dropped)** | **55.2 KB** | **−57%** |
| Commissioner, `wght` + `FLAR` | 46.2 KB | −64% |

The study's own subsetting put the same configuration at 55.5 KB. Two
independent pipelines, 0.5% apart. The `slnt` axis costs 37.7 KB for a shear
with no italic outlines.

**Axis order.** Next 16.2.6 emits, verbatim, from its own table:

```
https://fonts.googleapis.com/css2?family=Commissioner:slnt,wght,FLAR,VOLM@-12..0,100..900,0..100,0..100&display=swap
```

Lowercase before uppercase — the findings doc's correction to §8.2 is right, and
the URL is never hand-built anyway.

**The patch is current.** `git am commissioner-in-repo.patch` applies clean onto
`main` at `38182fc`, all four commits, no conflicts.

---

## What this changes about the decision

**The re-verification estimate was the wrong shape.** It is not a broad expensive
sweep. It decomposes into two piles that need completely different work:

1. **Three hero sentences and one card title** — display type that lost its
   width band. Copy edits, roughly 12% shorter, or a decision that two lines is
   fine (it already is, above 1000px). This pile is caused by **removing
   `wdth`**, not by Commissioner, and it would be identical under any
   width-less face.
2. **~140 body-copy elements that re-flow, five of which widow.** No headline is
   affected. Nothing gets longer. The 19px body cancels most of it. Five named
   strings need an eye.

**And one item on the still-open list moves up.** The hero-block sentence module
turns out to be structurally dependent on the 88% width band, and no document
knew that. §8 of the locked doc bans *"trusting a width difference that is never
co-visible to carry meaning"* — the module is not doing that, it is trusting a
width difference to **fit**, which is a different dependency and an undocumented
one. That is worth writing down whether or not the font changes.

---

## Still open after this

- **The about page and home hero at display size.** Measured here for line
  breaks; not judged for how they look. `.text-lede`, `.text-statement` and the
  about `h1` all sit in the 53–71px band §9 leaves unbanded, and voice-by-rung
  has nothing to say about them either.
- **The signature by eye.** The ink numbers say ruling 3 survives. Whether
  Commissioner 340 at 88px looks deliberate or thin, in both modes, on a real
  screen, is not a number.
- **Also Shipped.** Still uncosted, still losing a third of its premise.
- **The tracking retune at rungs 4–6.** Not touched here. `opsz` tightened fit
  as size grew and there is no replacement; line breaks were measured at the
  current tracking, so every display number above shifts if tracking changes.

---

## Addendum, same day — the hero sentences already reflow, in Bricolage

Finding 1 above says the hero sentences depend on the 88% width band for their
one-line fit. R9 of the locked type system says the system must degrade when
the axes are absent, because the `next/font` fallback is Arial-based with no
`wdth` and no `opsz`, and that *"anything that matters must also be carried by
size, weight, or colour."*

`scripts/measure-fallback-shift.mjs` aborts the woff2 request and reads what
the size-adjusted fallback renders, against the loaded font, on the shipped
Bricolage build:

| Viewport | Sentences measured | Reflow between fallback and loaded |
|---|---|---|
| 768px | 6 | **4** |
| 1440px | 6 | **6** |

At 1440px **every hero sentence on every case study changes line count** during
the swap, today. `display: swap` means that window is real on any cold load,
and the hero block is the LCP element on the three most important pages.

So the width-band dependency is not a Commissioner cost. It is a **live R9
violation that the Commissioner measurement exposed**, and the fix is owed
whether or not the typeface changes. Under Commissioner the fallback and the
loaded font agree, because neither has a width axis — which makes the swap a
*fix* for this surface rather than a regression.

---

## Addendum, 21 Aug 2026 — the three clauses were rewritten

Phase 0a ("Rewrite the three hero clauses to hold one line at width 100") shortened the
three sentences Finding 1's table names as losing their band. **The strings quoted
throughout this document are the ones that were measured, and they are left as they
were** — editing them to match the new copy would destroy the evidence the change rests
on. Read them as a record of August 2026, not as current copy.

The clauses now shipping, and the single-line band each holds at width 100:

| Study | Was | Now | Band at wdth 100 |
|---|---|---|---|
| BARD | "The system couldn't speak it." | "The system never spoke." | 544–928px |
| FDT-E | "An anomaly isn't intelligence" | "An anomaly isn't intel" | 432–1008px |
| Nuuly | "A building, a business model," | "A building, a promise," | 432–1008px |

All three now hold a band at least as wide as the one they held at 88, so the mid-viewport
single-line moment Finding 1 describes as disappearing is preserved rather than lost.
