# Unspecified surfaces

Both design systems — `type-system-v3-locked.md` and `spacing-system-v1-locked.md`
— end with a §9 listing what they deliberately do not govern. Four entries
appeared on **both** lists, which means they are one piece of work rather than
two. This file is that list, and both §9s point here. Entries have since arrived
from the colour system and from the case-study figures, and the set is open: a
surface joins whenever one is found that no locked spec governs.

Created 8 Aug 2026.

---

## The open set

*Nav, footer, buttons and card meta were here at creation, from the two §9s.
**Pinned specimen tones** joined on 8 Aug 2026, found by the K4 colour-literal
census: the only entry that comes from the colour system rather than from type
and spacing, and the only one already shipping wrong values. **Illustration line
weight** joined on 18 Aug 2026, the first to arrive from neither a system's §9
nor a census, but from a rendering defect found in review. **Composite evidence
grid** joined on 19 Aug 2026, the first to come from a surface the crop pipeline
cannot produce at all. **Bento theme block, outer boundary** joined on 19 Aug
2026, the first found by swapping one component for another, which is what
exposed three shipped components answering the same question three ways.*

**Nav.** Type sizes, weights and the spacing between items. Neither system
assigns it a rung or a step.

**Footer.** Same, plus the relationship between the footer's top boundary and
the last section above it — which is a section-break question the spacing
system has an answer for and does not currently apply here.

**Buttons.** Internal padding, label type, and the relationship between the two.
This is the surface most likely to want its own module rules, since a button's
padding is a function of its label size rather than of the page rhythm.

**Card meta.** Density, the type rung for the `project · client` strip, and the
gap between the strip and the headline above it.

**Pinned specimen tones.** A colour whose job is to **not** follow the theme:
the light and dark cells of a `ModePair` comparison, and the fixed placeholder
tones standing in for fixed-pixel screenshots. A light cell must stay light
while the page is in dark mode, so no semantic token can serve it — every one
of them swaps by mode. Eight literals in `app/globals.css`.

Two constraints on any resolution:

1. **The specimen must track the palette, not freeze a colour.** A pinned value
   is the palette written down a second time, and it goes stale the moment
   layer 1 moves. A `--specimen-*` pair would only relocate the problem. The
   correct answer is a specimen that references **the other mode's actual
   value**, which requires the token layer to expose light and dark **by name**
   rather than only through the cascade. That is a layer-1 restructure, and it
   is why this is deferred rather than patched.
2. **`.mode-pair__cell--dark .mode-pair__label`'s
   `color-mix(…, 10%, transparent)` must come back as a token plus alpha, not
   as a literal mix carried forward.** R1 permits the alpha — a label plate is
   a state layer, not a named surface — but the mix's *base* is one of the
   stale literals below, so it must not survive the cleanup by looking like it
   was already considered.

**They are already wrong.** Measured against v2, these fossilise the pre-v2
palette:

| | literal | v2 equivalent | drift |
|---|---|---|---|
| light cell | `0.985 0.004 75` | canvas `0.978 0.016 76` | ¼ the chroma |
| dark cell | `0.170 0.012 55` | canvas `0.165 0.006 55` | 2× the chroma |
| light placeholder | `0.970 0.008 80` | canvas `0.978 0.016 76` | ½ the chroma |
| dark placeholder | `0.220 0.012 60` | surface `0.205 0.014 57` | drifting |

Lightness is nearly right in every case and chroma is wrong in both directions,
so together they depict a light mode that is almost neutral and a dark mode
warmer than its own ground. That is precisely the palette v2 was built to
replace, inverted.

**Whoever resolves this is enabling something, not fixing something.** Both are
live-capable dead CSS today:

- `ModePair` is registered in `mdx-components.tsx` and used in **zero** `.mdx`
  files.
- The bento tones render **only** when a manifest sets `tone`, and no manifest
  currently does. The class is emitted by `components/bento.tsx`, which the
  BARD and FDT-E case studies both use — it is not sandbox-scoped, whatever the
  old comment claimed.

**This is now a property of the repo, not a run of bad luck: five kinds.**
`ModePair`, the bento tones, `CardMediaSlot` (resolved by deletion in
`099a172`), the takes wall (`components/takes/*`, rendered on no route), and —
found while migrating radius in I3 — five styled surfaces that return zero
instances on every route: `.mode-pair__cell`, `.mode-pair__label`,
`.figure-placeholder`, `.hero-block__image-frame .figure-placeholder` and
`.figure--constrained-bleed .figure__image`.

Every migration so far has paid to move CSS that reaches no reader, and twice a
spec has claimed a visible change that could not be seen. Recorded so the next
person weighs deletion against migration; **not** an invitation to go hunting for
a sixth.

Setting `tone` on a manifest, or dropping a `ModePair` into a case study, ships
a widget that misrepresents the site's own colour — on a portfolio whose thesis
is colour judgement. All eight are allowlisted in `scripts/lint-color.mjs`
under `ALLOWLIST.specimens`, with the reason attached to each, so the lint
keeps surfacing them rather than absolving them.

**Illustration line weight.** What minimum rendered stroke a case-study figure
needs, and where the rule lives. No locked spec governs it. Type v3 covers text.
Interaction v1 §2 covers *icon* stroke through `--icon-stroke`, which is a
different surface answering a different question.

**The trigger is a property of the ART, not of the study.** A figure whose source
linework is hairline collapses at the 300px friction-beat column (set by
`.friction-beat`'s `grid-template-columns`): the lines go sub-pixel and antialias
to grey. Chunky art does not. That is why Bard's Oku figures need no floor while
FDT-E's and Nuuly's both do, and it is the condition any rule has to be written
against. Stating it as "Nuuly needed what FDT-E needed" would encode the wrong
variable and guarantee a third ad hoc fix.

Solved twice, independently, at the same value: `.fdte-figure svg path` (July
2026) and `.nuuly-beat-figure svg path` (18 Aug 2026), each carrying
`stroke: currentColor; stroke-width: 0.75px; vector-effect: non-scaling-stroke`.
Two classes with identical declarations is the shape of a missing rule.

Three things to settle:

1. **Where the floor lives.** Probably on `.oku-figure` with an opt-out for
   chunky art, rather than a per-study class per study. `.oku-figure` is the
   shared wrapper, so as it stands a third hairline study means a third
   identical rule.
2. **Whether 0.75px is a token.** It is authored as a literal in two places. It
   is also near its ceiling rather than mid-range, which any token would have to
   carry with it: these are merged compound paths of *outlined* linework, so
   every drawn line is a closed contour, the stroke lands on both sides of it,
   and effective weight is roughly double a single-edge stroke. 1px fattens the
   sketch quality away and starts closing dense passages; 0.5px still reads thin.
3. **Whether the trigger can be stated mechanically.** "Hairline" is a judgement
   made by looking. Source stroke geometry is measurable, so a check could in
   principle flag art that needs the floor and has not got it, rather than
   waiting for someone to notice mud.

**Composite evidence grid.** `corner-consistency.png` is not a crop of one
frame: it is six strips from six frames, at identical geometry, assembled into
one 16:10 image and shown through `BentoBand`. No locked spec says how a
composite is built — what the inter-strip gutter should be, whether the strips
may come from different apps, whether the seams need to be declared to the
reader, or whether the caption carries that job. It also cannot be produced by
the bento-crop executor, which crops one source per output. Needs: a rule for
when a composite is legitimate rather than a montage, and a decision on whether
the compose step belongs in the crop pipeline. Raised 19 Aug 2026 by the Nuuly
§6 consistency evidence.

**Bento theme block, outer boundary.** `.figure--bento-theme` ships
`margin: var(--spacing-l) 0 0` — 2rem top, zero bottom. The asymmetry was never
a decision: every consumer until 19 Aug 2026 was the last child of its section
(Bard's three Resolutions themes, FDT-E's gate walk), where
`.cs-section > :last-child` zeros the bottom anyway, so the value was never
exercised. Nuuly §5 and §6 are the first to place prose after one, and
`:where(.case-study-prose) p` carries bottom margin only, so the pair resolved
to a zero gap.

The **value** is governed: `--spacing-l` is the evidence step, "prose to
screenshots" (`spacing-system-v1-locked.md` §3). What is not governed is the
**boundary rule** — which block-level media components own a gap on which side,
and whether the owner is the media or the prose. Three different answers ship
today: `.cs-section > .bento-band` takes `margin-block`, `.framed-pair` takes
`margin: var(--spacing-l) 0` **plus** a `p:has(+ .framed-pair)` rule that zeros
the preceding paragraph so the top gap is single-owned, and
`.figure--bento-theme` takes a `:not(:last-child)` bottom, and `.milestone` now
takes the same. Same token, **four** mechanisms.

**The prediction below came true the next day, and not the way it was written.**
This entry closed by asking for one rule "so the next one added does not invent
a fourth mechanism." The fourth was not added. `.milestone` was already in the
codebase with `margin-top` and no bottom, unexercised, because BARD's milestone
and FDT-E's are both the last child of their section. Nuuly §8 became the first
page anywhere to put prose after a milestone and the gap resolved to zero, found
on the preview on 20 Aug 2026 — one day after this entry was written.

That sharpens what the entry is for. The risk is not new components inventing new
mechanisms; it is **existing components whose boundary was never exercised**,
each of which fails the first time a page puts content after it. There is no way
to tell from the CSS which ones are still waiting, because a `margin-top`-only
rule looks identical whether the bottom was decided or never tested.

The spacing system's own §9 lists "the bento and small-multiples grid gaps" as
open, but that is about the bento's **internal** gaps. This is the outer edge,
and it is adjacent to that entry rather than covered by it. Needs: one statement
of who owns a block's vertical boundary, applied to all four components — and an
audit of every remaining `margin-top`-only block-level rule, since the failure
mode is silent until a page happens to exercise it. Raised 19 Aug 2026 by the
Nuuly §5/§6 conversion from `FramedPair` to `BentoTheme`; extended 20 Aug 2026
by `.milestone` in Nuuly §8.

**Which rung the six unbanded display roles sit on.** v3 §9 already names six
shipped selectors whose size ceilings sit on no rung and leaves the question
open on purpose: the ladder is about size relative to neighbours and about
tracking, and it needs real content in front of it. Two of the five case studies
are unwritten, so that content does not exist yet. Nothing here overturns that.

What C4 added is a **narrower question answered separately**: flare asks only
*display type or reading type*, which is answerable now and does not constrain
the rung answer later. So `.text-lede` (60px, the home hero) takes the display
band and `--flar: 100` while its rung stays open, recorded in `RUNGS` as
`rung: null` rather than by omission.

**C5 split that one question into two, and everything below reads against the
split.** `band` says what the type is; `voice` says whether it is flared. They
were one key while every display selector wanted flare, and the 52px cut ended
that: `.text-cover` and `.friction-beat__headline` are 32px display type that
takes the plain voice. **Being display band no longer implies `--flar: 100`.**

The 52px cut is a legibility judgment taken on a render at 88, 72, 52, 32 and
18px. Nothing was tested at 51 or at 40, so a selector within a few pixels of it
is ruled on rather than looked up.

**Two rulings recorded as conditionals, because the surfaces do not render:**

- **`.text-statement`** (96px) — *if it ever renders, it is display band and
  flared.* It was banded on 21 Aug 2026 and the application
  withdrawn the same day: `scripts/assert-bands.mjs` found it matches zero
  elements on all five routes, so the ruling had been made about an element that
  does not exist. The reasoning survives — a 96px statement is display type
  whatever rung it lands on — and is kept here so whoever builds that section
  gets the answer instead of re-deriving it.
- **`.resolution-block__headline`** (32px) and **`.transformation`** — same
  condition, different conditional as of C5. Both are display band and both
  render nowhere, but neither is flared: the headline ceilings at 32px, below
  the cut, and `.transformation` is a grid container with **no `font-size` of
  its own**, so it has no ceiling the cut can even be applied to. That second
  fact is a small finding in itself — having no size is an independent reason it
  was never display type.

**`.about-phase__title`** (36px, five on `/about`) and **`.about-hero__pov`**
(51px, one on `/about`) are the two live display surfaces **v3 does not mention
anywhere** — not in §3.3's ladder, not in §5's width table, not in §9's list of
six unbanded selectors. There was no rung to inherit and no band to read.

**Banded 21 Aug 2026 on function, ruled from the C4 preview:** both take
`band: 'display'`. The five phase titles do structural work at 36px against 16px
prose; the POV line at 51px is the largest type on its page. **Their rung stays
open** — the band answers a narrower question than the ladder does, and
answering it does not constrain the ladder answer later.

**Voiced 22 Aug 2026, and the two rulings diverge — which is the split earning
itself on its first real case.** `.about-hero__pov` sets at 51.2px at 1440 and
is **flared**, on the judgment that it is functionally the 52px the cut was
taken at, not on the number. `.about-phase__title` sets at 36.4px (40px ceiling)
and is **plain**, sitting inside the 32-40 range the review measured as
indistinct. Both keep the band C4a gave them. Nothing was overturned: C4a ruled
on what the type is, C5 ruled on what it can carry, and those were one key when
C4a landed.

`/about` therefore ships with a flared `<h1>` above five plain `<h2>`s. That
reads as hierarchy rather than inconsistency, and it is a render question rather
than a table one.

Needs: a rung for each of the six, which waits on real content. The band and the
voice for the two about-page roles are both settled. Raised 21 Aug 2026 by the
Commissioner migration, which forced the band question without forcing the rung
question.

**Whether Also Shipped still differentiates its four brands.** Not a surface no
spec governs — v3 §6 governs it explicitly, and says of `.text-qh-title` that
*"the variation IS the content."* The entry is here because **the mechanism that
carried that variation no longer exists** and the spec has not caught up. The
four titles were separated on three per-brand axes via `[data-brand]`:

| | `--qh-wdth` | `--qh-wght` | `--qh-opsz` |
|---|---|---|---|
| lionsgate | 90 | 600 | 40 |
| red-cross | 96 | 500 | 14 |
| bbc | 84 | 650 | 48 |
| k-hovnanian | 100 | 540 | 24 |

Commissioner has **neither `wdth` nor `opsz`**. C3 deleted the FVS string that
drove them, so two of the three axes are gone and `--qh-wdth` / `--qh-opsz` are
still declared in all four blocks while being consumed by nothing. What is left
is `--qh-wght` 500-650 and the per-brand colour.

**FLAR was considered as the replacement and ruled out on measurement, not
taste.** `text-qh-title` is `clamp(1.75rem, 1.5vw + 1.25rem, 2.25rem)` — 28px at
390, 31.5px at 768, **36px at 1440 and its ceiling**. That is below the 40px
that was just ruled plain and 16px under the 52px cut. Shipping per-brand FLAR
onto a 36px surface in the same commit that removed it from a 40px one would be
inert-but-plausible CSS, the class C3 deleted 49 declarations of.

Needs: a ruling on whether weight and colour alone carry four-ness, **from a
render**. If they do not, the answer is a question about the Also Shipped shelf
and not about a typeface — v3 §6's rules and the two dead custom properties
follow from that ruling rather than preceding it. Do not reach for an
intermediate FLAR value: 0 and 100 are the only two anyone has judged.

Raised 22 Aug 2026 by C5, which asked what flare could do here and found the
surface is too small for the question.

---

## What interaction v1 closed — reconciled 9 Aug 2026

A fourth system locked and shipped between this file's creation and now, so
every entry was re-checked against it. **Checked against this file's own
criterion below** — a type rung or a written exception, a spacing step for
internal padding, and a stated position on the boundary above and below.

**No entry is fully closed, so nothing leaves and the file stays.** Interaction
v1 governs states, motion, radius and icons; this list is almost entirely type
rungs and spacing steps, which is the half it does not touch.

| entry | what interaction v1 closed | what remains |
|---|---|---|
| **Nav** | hover, pressed (§5) | type sizes, weights, spacing between items — all of it |
| **Footer** | its links get the text-link states (§5), by inheritance rather than by a footer rule | type, spacing, and the top-boundary relationship |
| **Buttons** | internal padding (`--spacing-2xs / --spacing-m`), radius, gap, min-height, pressed, icon stroke (§6) | **the label's type rung** |
| **Card meta** | the **card's** hover, pressed, elevation and radius — the container, not the strip | density, the strip's type rung, the gap to the headline |
| **Pinned specimen tones** | nothing | all of it |

**Buttons came closest and did not get there.** §6 specifies the button
properly, but it assigns the label a *weight* (500) and never a *rung*.
`.about-btn` sets no `font-size` at all: it inherits, and computes **16px**,
while `.about-link` sitting immediately beside it is `text-body` at **18px**.
Two adjacent controls at different sizes, neither assigned by a locked rule.
That is exactly the "label type" this entry was opened for, so the entry
narrows to one line rather than closing.

**And §6 answered this entry's prediction in the negative, which is a decision
worth recording.** The entry anticipated that "a button's padding is a function
of its label size rather than of the page rhythm". §6 put the padding on the
spacing scale — `--spacing-2xs / --spacing-m` — so padding follows page rhythm
after all. Not a gap; a resolved question with the opposite answer, and it
should not be reopened by someone reading only the original entry.

**Card meta's half is the container.** What is specified belongs to the card:
hover, pressed, elevation, `--radius-l`. The `project · client` strip has no
interaction of its own to specify. It renders at `text-caption`, which
`CLAUDE.md`'s scale table names for this exact use, but no locked §-rule assigns
it — so the rung is conventional rather than governed, which is the distinction
this file exists to make.

---

## Why they are together

A button has type inside it and spacing around that type; specifying one
without the other produces a button that is correct in two documents and wrong
on screen. The same is true of nav items, footer rows and card meta.

Doing these once, against both specs, is the only way they agree. Doing them
separately guarantees that in six weeks the two documents describe the same
button differently — which is the precise failure both migrations spent a week
eliminating.

---

## What "done" would mean

Each surface gets: a type rung (or a written exception with a reason), a
spacing step for its internal padding, and a stated position on its boundary
with whatever sits above and below it. Then both §9s lose these entries and
this file is deleted rather than becoming a third place where the answer lives.

**An entry leaves when it is fully closed, and its content moves into the owning
spec.** The file is deleted when it is empty — not before, and not because it
has grown short. As of the interaction reconciliation above, every entry still
has something open, and one (buttons) is down to a single line.

---

## Not on this list

**Print** is genuinely open in both systems and genuinely low value — nobody
prints a portfolio. It stays in both §9s as an acknowledged gap, not a task.

**Type states** (hover, focus, visited, disabled, `forced-colors`,
`prefers-contrast`) are type-system-only and larger than anything on this list.
They stay in the type §9.

**Bento and small-multiples grid gaps** are spacing-only and may want their own
module rules, the way the takes wall does in the type system. They stay in the
spacing §9.
