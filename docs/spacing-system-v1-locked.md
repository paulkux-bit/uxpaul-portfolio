# The uxpaul.com spacing system — v1, locked

Decided 8 Aug 2026, after the type system v3 migration closed. Where this
document disagrees with `02-design-system.md` or `CLAUDE.md`, this document
wins, and those must be updated in the same commit that adopts it.

---

## The rulings

| # | Decision | Ruling |
|---|---|---|
| 1 | What spacing is derived from | **Type, not viewport.** Layout spacing in `rem`; `em` for optical only, §3.2 |
| 2 | The grid | **4px below 1rem, 8px at and above** |
| 3 | Scale size | **Eight static steps**, plus fluid pairs where the relationship to type matters |
| 4 | Vertical vs horizontal | **Vertical scales. Horizontal mostly holds.** Different jobs |
| 5 | The semantic tiers | **Intimate, evidence step, section break survive as names** |
| 6 | The 1920 breakpoint | **Retired.** A fluid pair replaces it |
| 7 | Enforcement | **`npm run lint:space`**, beside `lint:type` |
| 8 | Section break ratio | **R = 2.46**, revisited once three case studies exist |

---

## 1. The system in one paragraph

Spacing is a multiple of body text, expressed in `rem`, so it grows when a
reader scales their text and the grouping cues survive the setting that most
needs them. Eight static steps cover everything that does not care about
viewport width. Anything whose relationship to a **fluid type rung** matters —
section breaks above all — is a fluid pair built with the same clamp
construction the type ladder uses, so the two systems move together instead of
drifting apart between the widths anyone checks.

---

## 2. Why `rem` alone is not enough

`rem` solves accessibility: at a 24px root, every space grows by half again
and the three tiers stay distinguishable. It does **not** solve the drift.

Measured on the shipped site: the section break (`6rem`, stepping to `8rem` at
1920) against rung 4, the section heading (`clamp(1.875rem, 3vw + 1rem,
3.25rem)`), gives a break-to-heading ratio of **3.20 at 390px, 1.85 at 1200px
— a 73% drift — then a 33% snap in a single pixel at 1920.** A pure `rem`
value would hold that same 73% drift, because `rem` does not know the viewport
moved.

**The fix is construction parity.** Where a space is paired to a fluid rung, it
is authored as `clamp(min_rem, Xvw + Y rem, max_rem)` — the identical shape as
every rung in §3.3 of the type system. Both sides then rise on the same slope
and the ratio holds by arithmetic.

The `+ Y rem` term in the preferred value is not decoration. A clamp whose
preferred term is `vw` alone stops responding to the user's root size, which
would give back the accessibility win in the act of fixing the drift.

---

## 3. The scale

Values are `rem`. Pixel columns are **nominal at a 16px root** — they grow with
the reader's setting, which is the point.

**One namespace, one definition.** Tokens live in Tailwind's `--spacing-*`
namespace and nowhere else, because that is the only namespace Tailwind
generates utilities from. A separate source namespace — `--sp-*` or similar —
aliased into `--spacing-*` would mean two places to edit, no lint that catches
the day they disagree, and a silent split of exactly the kind this project has
spent a week eliminating. The framework-flavoured name is the price and it is
cheap.

| Token | Utility | rem | px @16 | Grid | Typical use |
|---|---|---|---|---|---|
| `--spacing-3xs` | `p-3xs` | 0.25 | 4 | 4px | Hairline offsets, icon nudges |
| `--spacing-2xs` | `p-2xs` | 0.5 | 8 | 4px | Inline label to value |
| `--spacing-xs` | `p-xs` | 0.75 | 12 | 4px | Eyebrow to title |
| `--spacing-s` | `p-s` | 1 | 16 | 8px | Within a control, tight list rows |
| `--spacing-m` | `gap-m` | 1.5 | 24 | 8px | **Intimate** — title to lede |
| `--spacing-l` | `gap-l` | 2 | 32 | 8px | **Evidence step** — prose to screenshots |
| `--spacing-xl` | `p-xl` | 3 | 48 | 8px | Sub-section separation |
| `--spacing-2xl` | `p-2xl` | 4 | 64 | 8px | Major block separation |

CSS references them as `var(--spacing-m)`. JSX uses the generated utility.
Same token, both surfaces, no aliasing layer.

**The grid rule.** Below `1rem`, values step by `0.25rem` (4px) — small gaps
are where a designer legitimately tunes by eye, and 12px against 16px is the
whole adjustment. At and above `1rem`, values step by `0.5rem` (8px) — at that
size the difference between 96 and 104 is noise, and the coarseness is what
stops the scale sprawling back to nineteen values.

There is no ninth static step and no per-module value. Picking a spacing by
eye means working outside the system.

### 3.1 Fluid pairs

Some relationships care about viewport because their type counterpart is
fluid. A pair holds its ratio to that rung **only if it shares the rung's
crossover viewports** — the same rule R5 states for adjacent type rungs, and
the same trap that pinched rung 6 against rung 5 during the type migration.

**The construction.** For a rung `clamp(a, m·v + c, b)` and a target ratio R,
the paired space is:

```
clamp(a·R, (m·R)·v + (c·R), b·R)
```

Every term scales by R, so the ratio is constant across the entire viewport
range by arithmetic. Verified: **0.000% drift from 320 to 2560 at any R.**

A first draft of this section used a pair that reached its maximum at a wider
viewport than its rung did. It measured 52.8% drift — better than the 73% it
replaced, and nowhere near the "zero by construction" it claimed. Sharing
crossovers is the whole mechanism; a pair that merely *looks* fluid is not a
pair.

**`--spacing-section`**, paired to rung 4 (`clamp(1.875rem, 3vw + 1rem, 3.25rem)`,
crossovers at 467 and 1200) at **R = 2.46**:

```css
--spacing-section: clamp(4.6125rem, 7.38vw + 2.46rem, 7.995rem);
```

**Use the exact terms, not rounded ones.** A first draft of this block printed
`4.61rem` and `8rem`. The construction was exact; the published constants were
not, and that alone measured **0.117% drift** — small, but in a document whose
whole claim is zero. The `8rem` in particular was rounded because "it lands on
8rem, a value already in the system" was a satisfying sentence to write. An
aesthetic preference for a tidy number is exactly how a derived system stops
being derived.

| Viewport | Rung 4 heading | `--spacing-section` | Ratio |
|---|---|---|---|
| 390 | 30.0px | 73.8px | 2.46 |
| 768 | 39.0px | 96.0px | 2.46 |
| 1200 | 52.0px | 128.0px | 2.46 |
| 2560 | 52.0px | 128.0px | 2.46 |

This replaces the fixed `6rem` and the 1920px step-up together. **The 73%
drift and the 33% snap both go to zero.** Note the direction of the change:
less space than today on mobile, where a fixed 96px was a lot of air on a
390px screen, and more on desktop.

**Why 2.46, and when to revisit it.** R is the one number in this document
that is taste rather than arithmetic. 1.85 preserves today's desktop exactly
and reads denser. 2.20 looked best in isolation and is the weakest choice by
the project's own standard, because the only argument for it is that someone
liked it. **2.46 is the ratio the current design already produces at 390px and
at 1920px** — the build has been implicitly choosing it at both ends of the
range while landing on 1.85 in the middle. Taking it makes explicit what the
design was already doing.

It was chosen against a three-word heading and one line of body, which is not
a fair test. **Revisit once URBN-Shipping is written and three finished case
studies can be read in sequence.** If the break then reads as a gallery wall
rather than a beat, drop to 2.20 — one number, one token, and every section on
the site follows. That reversibility is the point of deriving it.

**Do not add more pairs speculatively.** The section break earned its pair
because the drift was *measured* — 73% plus a 33% snap. Hero padding and the
arrival crescendo may want the same treatment against rungs 5 and 6, but
nobody has measured them, and inventing a ratio for a relationship whose
behaviour is unknown is how nineteen values happened. Measure first, in the
migration; pair only what drifts.

`--spacing-gutter` is **not** a pair and never will be. It is horizontal, so per
ruling 4 it responds to viewport but not to type, and it has no rung to hold a
ratio against.

**It is also the one token authored in `px`, and that is correct rather than a
concession — corrected 8 Aug 2026.** A first draft specified it in `rem`
throughout, which made it grow 46% at a 32px root and quietly falsified ruling
4. Ruling 1 exists so *layout rhythm* scales with reading size, because
separation between blocks is a reading cue. A gutter is not rhythm; it is a
container edge whose job is protecting measure, and growing it actively harms
that job — at a 32px root the text has already doubled, characters-per-line has
already halved, and a wider gutter takes more from a column that is already too
narrow.

`px` gives exactly the required behaviour: **holds under text-only scaling,
scales under browser zoom**, because zoom scales `px` and text-size settings do
not.

```css
--spacing-gutter: clamp(24px, 1.786vw + 10.29px, 32px);
```

**The maximum is set by `--page-max-width`, not by taste — corrected 8 Aug
2026.** A first draft capped the gutter at 48px and let it grow across the
whole viewport range. That was wrong for a reason the same §4 argument should
have caught: **once the container's `max-width` binds, the container has
stopped touching the viewport edge, so a wider gutter protects nothing and
subtracts from the content column for free.**

With `--page-max-width: 72rem` the cap engages near 1216px. Measured cost of
the first draft:

| Viewport | Content, before | Content, 48px cap | Per card in the 2-up grid |
|---|---|---|---|
| 1440 | 1088px | 1085px | 464 → 463 |
| 1920 | 1088px | 1074px | 464 → 457 |
| 2560 | 1088px | 1059px | **464 → 449** |

At 2560 each card lost 3.2% of its measure, which is enough to add a line to a
card headline. The corrected token reaches 32px exactly where the cap engages
and holds there, returning the content column to 1088px at every width above
it.

**The rule this generalises to:** a fluid horizontal token must stop growing
at the viewport where its container's `max-width` binds. Beyond that point it
is no longer protecting content from an edge — it is taking measure away from
content that has no edge to fear. Vertical rhythm has no equivalent ceiling,
which is why only horizontal tokens need this.

---

### 3.2 `rem` for layout, `em` for optics

Ruling 1 is about **layout** spacing. A second unit has a narrow, legitimate
place and banning it would be a mistake.

- **`rem`** is the layout system. It scales with the reader's root setting,
  which is the entire reason spacing is type-derived. Every step in §3 and
  both fluid tokens are `rem`.
- **`em`** is optical. It tracks the size of the specific text it sits beside,
  which is what you want for anything kerning-adjacent. `margin-right: 0.4em`
  after a `<strong>` in meta text should be four tenths of *that* text
  whatever rung the meta occupies; expressed in `rem` it breaks the moment the
  meta resizes. The file already carries `letter-spacing: 0.1em` in three
  places on exactly this logic.

**The rule is about the property, not the unit.** `em` is permitted on inline
and pseudo-element spacing — inline margins, `::before` and `::after` offsets,
optical crops on display glyphs. It is banned on block-level layout spacing:
`margin-block`, `padding-block`, `gap`, and anything participating in the
section rhythm.

Three declarations qualify today: the optical crop on `.comp-mark-cropped
.mark`, `margin-right: 0.4em` on `.case-study-meta strong`, and the 0.1em
offset on `.pull-quote p::before`. All three stay.

**The two `px` exceptions.** Ruling 1 bans `px` for layout spacing. Two
departures are permanent and named, not allowlist entries awaiting cleanup:

- **`.sr-only { margin: -1px }`** — the standard visually-hidden clip idiom.
  Universal, not project debt.
- **`--spacing-gutter`** — see §3.1. A container edge that must hold under
  text-only scaling while still responding to browser zoom, which is precisely
  what `px` does and `rem` does not.

Anything else in `px` is a defect.

### 3.3 Both authoring surfaces, one definition

Spacing is authored in two places: `app/globals.css` and Tailwind utilities in
JSX and MDX. **A scale that governs only one of them is not a system.**

Measured 8 Aug 2026: 117 spacing utilities live in JSX/MDX, and they include
the primary page rhythm. `app/page.tsx` carries
`pt-16 md:pt-20 xl:pt-16 2xl:pt-28 pb-32 space-y-24 xl:space-y-20
2xl:space-y-32`, which — against this project's custom breakpoints, where
**`2xl` is 1920** — resolves to:

| | base | md 768 | xl 1440 | 2xl 1920 |
|---|---|---|---|---|
| `pt` | 64px | 80px | **64px** | 112px |
| `space-y` | 96px | — | **80px** | 128px |

Both are **non-monotonic**: the page's vertical rhythm tightens between 1440
and 1919 before jumping at 1920. That is not a design decision; it is the
signature of tuning at three discrete widths without seeing the curve between
them, and it is the exact failure this system exists to remove.

It also means **the 1920 step-up lives in JSX, not CSS.** Deleting the CSS
media queries while leaving `2xl:space-y-32` in place would let `lint:space`
report green on a migration that did not happen.

Therefore the scale lives in `--spacing-*` inside `@theme static` — see §3 —
and `pt-section`, `space-y-section` and `gap-m` generate as real utilities from
it. `lint:space` scans `app/globals.css` **and** all `.tsx` and `.mdx`.

**Verify generation, do not assume it.** Tailwind's numeric utilities (`p-4`,
`space-y-24`) come from the base `--spacing` multiplier; named values come from
`--spacing-<name>`. They coexist, but confirm in a **production** build that
every utility this migration needs actually emits — at minimum `pt-`, `pb-`,
`py-`, `px-`, `gap-` and `space-y-` against both a static step and
`--spacing-section`. The type migration's `@theme static` lesson applies
exactly: a token that fails to emit fails silently and the page still renders
plausibly.

Numeric utilities are what the migration removes. `space-y-24` fails assertion
1; `space-y-section` passes.

---

## 4. Vertical and horizontal are different jobs

From Wise's spacing refresh: *"All vertical spacing tokens scale to support
clearer visual separation as text sizes increase. Horizontal spacing only
scales in specific cases, such as when elements scroll off the screen."*

Adopted:

- **Vertical spacing scales with type.** Separation between blocks is a
  reading cue, and reading cues must track reading size.
- **Horizontal padding mostly holds.** Gutters exist to keep measure under
  control and to stop content touching the viewport edge. Neither job gets
  better by growing with text size, and a gutter that scales with a 24px root
  eats the measure it was protecting.
- **The exception is `--spacing-gutter`**, which is fluid on viewport but not on
  type — it grows on wide screens because the container should not run edge to
  edge on a 2560px display.

Conflating the two axes is why gutters go cavernous on wide screens.

---

## 5. What survives from the current system, unchanged

**The three semantic tiers.** Intimate, evidence step, section break stay as
names. They now resolve to `--spacing-m`, `--spacing-l` and `--spacing-section`. The
vocabulary was always the good part; only the values were chosen by hand.

**The single-owned-gap rule.** Where a paragraph meets a component, one side
owns the gap — paragraph `margin-bottom: 0`, the component carries
`margin-top`. Collapse-agnostic. Keep verbatim.

**`:where(.case-study-prose) p`** at specificity (0,0,1) so component margins
win at the root. This solved a real phantom-margin bug. Keep.

**`.friction-beats` at 3.5rem** is a named, owned exception between the
intimate and section tiers. It becomes `--spacing-xl` (3rem) or keeps its value as
an allowlisted exception with a one-line reason — author's call, but it must
be one or the other, not an unmarked literal.

---

## 6. What dies

Seven values are off the grid and have no home:

| Value | px | Usages | Goes to |
|---|---|---|---|
| `0.35rem` | 5.6 | 1 | `--spacing-3xs` |
| `0.4rem` | 6.4 | 1 | `--spacing-3xs` |
| `0.625rem` | 10 | 3 | `--spacing-2xs` or `--spacing-xs` |
| `0.875rem` | 14 | 2 | `--spacing-xs` |
| `1.25rem` | 20 | 8 | `--spacing-s` or `--spacing-m` |
| `1.75rem` | 28 | 2 | `--spacing-m` |
| `2.5rem` | 40 | 4 | `--spacing-xl` |

Roughly **21 declarations** move. `1.25rem` is the significant one at eight
usages, and each needs a judgement — 16 or 24 — rather than a mechanical swap.

`5rem` (80px) and `3.5rem` (56px) are both legal 8px multiples but sit off the
eight-step scale. They either join it as a ninth and tenth step, or they move.
Adding steps to accommodate existing values is how a scale becomes nineteen
values again; the default is that they move.

**Roughly 200 media-query blocks touching spacing** come out, across the 640,
767, 768, 899, 1024 and 1920 breakpoints. Fluid pairs make most of them inert.
This is the bulk of the migration and it should be its own commit.

---

## 7. Enforcement

`npm run lint:space`, beside `lint:type` and `lint:prose`, gating the build.
Parses **`app/globals.css` and every `.tsx` and `.mdx` file** — per §3.3, a
scale governing only one authoring surface is not a system. Fails on:

1. Any `margin`, `padding` or `gap` value not resolving to a scale token or an
   allowlisted fluid pair.
2. Any spacing value in `px`. Any spacing value in `em` on a **block-level**
   property — `margin-block`, `padding-block`, `gap`. Inline and
   pseudo-element `em` passes, per §3.2.
3. Any value below `1rem` not on the 4px grid, or at/above `1rem` not on the
   8px grid.
4. Any new spacing declaration inside a media query without an allowlist entry
   and a one-line reason.
5. Any fluid pair whose preferred term lacks a `rem` component — see §2.
6. Any **responsive spacing utility in JSX or MDX** — `md:pt-20`,
   `2xl:space-y-32` and the like. A fluid token makes the breakpoint variant
   unnecessary; if one is genuinely needed it takes an allowlist entry. This
   assertion is what stops the 1920 step-up surviving the migration.
7. Any token **referenced but never defined.** Added 8 Aug 2026 after a
   near-miss: `.milestone` briefly consumed `--spacing-crescendo` before its
   definition was written. An undefined custom property resolves to nothing,
   collapsing the padding to zero — and assertion 1 stayed green because the
   *name* was in the known set. Checking that a name is legal is not the same
   as checking that it exists. Resolve every referenced token to a definition
   in `@theme`, or fail.
   **Extended 30 Sep 2026:** a numeric spacing utility in JSX or MDX
   (`mt-14`, `py-5`) also fails. Its key is Tailwind's base-unit multiplier,
   so it names no step on this scale and no assertion checked its value; four
   off-scale gaps (56, 40, 20, 20) reached rendered routes that way. Write the
   named step (`mt-2xl`, `py-m`). Sandbox routes stay out of scope, as for 6.

**Prove every assertion in both directions, in S0, before any value moves.**
Recorded 8 Aug 2026, after three separate checks in this migration passed for
a reason other than the one intended: a `space-y` grep, a `gap-x` alternation,
and assertion 2 exempting `--spacing-gutter` only because the check never
reached it rather than because it was named.

A green check that is green by accident is indistinguishable from a green
check that is green by design — until the incidental reason evaporates and the
rule silently stops testing anything. Writing one deliberately failing case
per assertion costs minutes and is the only way to know a rule tests what its
name says.

The evidence is in the type system next door. Of `lint:type`'s nine
assertions, exactly one was ever proved in both directions — 8b, the font-load
probe, verified against Bricolage giving a 197.3px axis delta and Arial giving
0.0. That is also the only one whose implementation bug was caught before it
shipped. The other eight were only ever observed passing or failing in situ,
which is observation, not proof.

**A second discipline, for a failure fixtures cannot catch.** Four things in
this migration passed review for a reason other than the one intended. Three
were checks — a grep expecting `{` after a class name, an alternation putting
`gap` before `gap-x`, an exemption that worked only because a `@theme`
definition never reaches a declaration walker. Fixtures catch all three.

The fourth was different in kind. §4's argument — that a growing horizontal
space eats the measure it exists to protect — was correct, and it was applied
to text-size scaling only. It generalises to viewport scaling the moment a
container's `max-width` binds, and nothing in the ruleset noticed, because the
rule was internally consistent. It cost 3.2% of card measure at 2560px and an
extra line on a card headline.

So: **when a rule's justification generalises, check whether the rule does
too.** Write the reason next to the rule, then ask what else that reason
implies. Where it implies more than the rule covers, either widen the rule or
record why it stops.

This failure class is specific to derived systems. A hand-tuned system has no
reason to over-generalise from — values are simply right or wrong. The moment
a system says *spacing derives from type because X*, it creates a claim whose
scope can quietly mismatch its application. Deriving buys correctness and
introduces this in exchange.

**A latent per-mode collision in `lint:space` — found 8 Aug 2026, not yet
fixed.** Line 243 builds `customProps` as a Map keyed by property name, so a
custom property defined in both `:root` and `.dark` silently keeps only the
last definition. Forty-two properties in `globals.css` are defined twice this
way; **none of them is a property `lint:space` consumes**, because no spacing
token is currently per-mode. The bug is therefore latent, not live, and the
gate is sound today.

It becomes real the moment anyone defines a spacing token per mode — a
different gutter in dark, say — at which point `resolveVars` would take the
wrong value without reporting anything. The identical shape went silent on a
real alpha in `lint:color` during the colour migration. `lint:type` is clear:
it uses arrays throughout, so the shape cannot occur. Fix wants its own small
commit; do not fold it into unrelated work.

**On what an allowlist entry means.** Media queries and responsive variants
divide into two kinds, and only one is the migration's business. A rule doing
**rhythm** — a section break stepping up at 1920 — is what a fluid token
replaces and must be removed. A rule doing **layout** — `margin-inline: 0`
cancelling a breakout, `gap: 0`, a column-gap appearing when a grid goes
multi-column — is not spacing rhythm at all and stays, with an entry naming
which kind it is. Measured 8 Aug 2026: of 36 spacing declarations inside
`@media`, only 2 were rhythm.

Every allowlist entry carries a reason. The type migration established that
the gate is what makes a system real: nine assertions caught five errors that
neither careful reading nor visual review found.

---

## 8. Anti-patterns

A ninth static step for one module. Spacing in `px`. A fluid pair whose
preferred term is `vw` alone. Growing horizontal gutters with text size.
Adding a breakpoint to fix a rhythm a pair would fix. Tuning a large gap by
eye — above `1rem`, the scale decides.

---

## 9. Still open

**Nav, footer, buttons and card meta live in `unspecified-surfaces.md`.** Those
four appear in this §9 *and* in the type system's, which means they are one
piece of work rather than two — a button has type inside it and spacing around
that type, and specifying either alone produces something correct in two
documents and wrong on screen. That file is the single list; when it is done,
this entry goes and the file is deleted rather than becoming a third place the
answer lives.

Spacing-only, and still open here: the bento and small-multiples grid gaps,
which may want their own module rules the way the takes wall does in the type
system. Print.

**Closed 8 Aug 2026:** whether `--spacing-gutter` needs a maximum below the
container width. It does, and the maximum is not a matter of taste — it is set
by the viewport at which `--page-max-width` binds. See §3.1.

**Closed 30 Sep 2026:** R = 2.46 was revisited with five case studies in
sequence. Measured on the render at 2.4600, 2.4590 and 2.4596 (390, 768,
1440), and the section break is the largest interval on every study at every
width. It stays. One number, one token; see §3.1.

None of these block the migration. All of them block calling the system
complete.

---

## 10. Spacing pass, 30 Sep 2026

Run in four parts: a council census of every neighbouring gap on the five
studies (2,581 pairs, labelled by relationship), the Plot Panel and a
Falsifier against it, renders of each option on the real page, and Paul's
rulings. The values below are all existing steps; no step was added.

| # | Relationship | Ruling | Where |
|---|---|---|---|
| 1c | Heading to standfirst, standfirst to body | 16 and 24 (was 32 and 16) | `.section-lede` owns both gaps; `h2:has(+ .section-lede)` gives up its bottom margin |
| 2b | Standfirst into the friction beats | 16 and 32 | falls out of 1c: the beats keep their own 32 top margin and win the collapse |
| 3b | A run of bento bands in prose | 48 around the run, 32 between its bands (was 32 throughout) | `.cs-section > .bento-band` |
| 4b | Friction-beat figure, stacked (below 1024) | 16 (was 12) | `.oku-figure` |
| 6c | Bold closing line after the beats (Nuuly, Delivery Promise) | 64, `mt-2xl!` (was 56, `mt-14!`, off scale) | MDX |
| 7b | BARD resolution headline to its bento | 32, `mb-l` (was 40, `mb-10`, off scale) | MDX |
| 8d | Home hero, within each pair | 24, `space-y-m` (was 20, `space-y-5`, off scale) | `app/page.tsx` |
| 9c | Quick-hit card, vertical inset | 24, `py-m` (was 20, `py-5`, off scale) | `quick-hit.tsx` |

**Relationship tokens: not added.** The census was checked for the condition
that would justify site-wide relationship names (the same relationship taking
different steps in different places). It did not hold once the off-scale
values, which came in through the numeric-utility gap now closed in assertion
7, were set aside. Carbon, Atlassian, Polaris and Primer all name the global
scale by value; where role names exist they are component-scoped.

**Component-scoped aliases are allowed.** A component may name a relationship
inside itself by aliasing a scale step, as `--bento-caption-gap` and
`--bento-row-gap` do. That is not a second namespace in the sense §3 rules out:
the value still lives in one place, the scale. (Precedent: Polaris
`space-card-padding`, Primer component tokens.)

**§5's open item is closed:** `.friction-beats` uses `--spacing-xl`.
**§9's bento item is partly closed:** 3b sets the rhythm of bands in prose; the
gaps inside a bento theme are unchanged and measured consistent (one value
each across every study).

## 11. Closing review and top of page, 1 Oct 2026

Ruled on rendered options (`docs/previews/system-close-a/`,
`docs/previews/top-of-page/options/`). All values are existing steps.

| # | Relationship | Ruling | Where |
|---|---|---|---|
| A1c | Heading straight into a body paragraph | 16 (was 32; the heading sat 40 from its paragraph in ink against 37 between paragraphs) | `.case-study-prose h2:has(+ p:not(.section-lede):not(.section-note))`; notes and milestones keep 32 |
| A5a | Home card grid | 32 across, 48 down, kept and now commented | `app/page.tsx` |
| T1c | Header to first content, every page | 64, `--spacing-2xl` (was `--spacing-section`, 74 / 96 / 128) | home and About `pt-2xl`; `.hero-block` top margin |
| T2b | Home intro to "Selected work" | 64 (was 128); work to Also Shipped stays 128 | `mb-2xl!` on the intro, because `space-y-section` owns every non-last child's bottom margin |
| T3b | Study title block beside the hero image | top-aligned (was centred; the eyebrow moved 203 to 311 with title length) | `.hero-block` at 1024 and up |

**Why the page top is not `--spacing-section`.** The header has no fill, no
border and no shadow, so header to content is a page margin, not a break
between two bounded sections. A new `--spacing-page-top` relationship token was
proposed (64 / 72 / 88) and not added, per ruling 3a.

**What spacing cannot do here.** A card headline starts 266 px into the card
(padding, the cover drawing, then 32), so no spacing value puts a full headline
above the fold at 1280 x 800, 1440 x 900 or 1512 x 860. The levers are the card
itself and the intro's length; both are recorded outside this spec.

## 12. The narrative layout, 5 Oct 2026

Ruled by Paul from the Line of Sight test page after the 2i-T review (Cowork's
Plot Panel, CC's reviewers, the Falsifier). All values are existing steps; no
step was added.

| # | Relationship | Ruling | Where |
|---|---|---|---|
| S2a | Text to evidence, and evidence to text (image, bento, figure, the friction moment) | 48 on both sides at every width (was 32; bento bands were already 48) | One rule, `.cs-section > :is(.framed-pair, .figure, .figure--bento-theme, .bento-band, .friction-moment, .testimony-pair, .chart-pair, .journey-line, .promise-walk, .roadmap-list)`, `margin-block: var(--spacing-xl)` |
| 7b | Heading to standfirst | 16, unchanged (1c, 30 Sep) | `.section-lede` owns it; `h2:has(+ .section-lede)` gives up its bottom margin |
| 7b | Heading to any other first block | 24 (was 16 to a body paragraph, A1c, and 32 to a note or milestone) | the h2's own bottom margin, `--spacing-m`; `.cs-section > h2 + .milestone` drops the milestone's 32 top |
| S3b | The turn (T6): answer to the paragraph after it | 48 | `.turn-answer`'s bottom margin, `--spacing-xl`; question to answer is the standfirst's 16 |
| G1 | The turn's own section gaps | the section break plus 48 above and 32 below | `.cs-section--turn { padding-block: var(--spacing-xl) var(--spacing-l) }`; `--spacing-section` itself is unchanged |

**The evidence step moves from `--spacing-l` to `--spacing-xl` in the studies.**
§3's table and §5's three tiers name `--spacing-l` as the evidence step, "prose
to screenshots". Between prose and evidence in a case-study section it is now
48. `--spacing-l` stays 32 everywhere else it is used (between bands in a run,
3b; milestone to prose; a resolution headline to its bento, 7b of 30 Sep).

**Each evidence block owns its own margin-block.** §5's single-owned-gap rule
zeroed the paragraph and gave the component its `margin-top`, through
adjacency rules (`p:has(+ .framed-pair)`, `p:has(+ .testimony-pair)`). Those two
rules are removed. The block owns 48 on both sides, a paragraph keeps its 24
bottom margin, and in block flow the two collapse to 48, so the gap is the same
whatever sibling precedes the block, including a hidden one. The rule sits
above `.cs-section > :first-child` and `:last-child` at the same specificity,
so a block that opens or closes its section still yields its outer margin to
the section break. It also absorbs `.cs-section > .bento-band` and
`.cs-section > .figure--bento-theme:not(:last-child)`. Six blocks had a top
margin and no bottom one (journey line, tier chart, promise walk, roadmap list,
friction beats, Oku figure). The journey line, promise walk and roadmap list now
have both through this rule; the tier chart sits inside `.chart-pair`, which is
listed; the beats and the Oku figure are covered below.

**What S2a does not reach, on purpose.** The friction beats keep 32 from their
standfirst (2b, 30 Sep): they carry text as well as figures, and S2a's set is
image, bento, figure, moment. The Oku figure inside a beat keeps 16 (4b). A run
of bento bands keeps 32 between its bands (3b). Bard's resolution headline keeps
32 to the bento it names (`.cs-section > .text-resolution-headline +
.figure--bento-theme`). The milestone is a status block, not evidence. Blocks
nested inside a theme, a resolution block or the chart pair keep their own
internal gaps.

**The turn's gaps are ruled values, not a new step.** G1 adds space inside the
section, as padding, so the break between any two sections stays
`--spacing-section` and the turn simply sits in more air: 176 above its
question and 160 below its last paragraph at 1440 (127.9 + 48, 127.9 + 32), 122
and 106 at 390. It was raised as an unspecified surface (122 above and 106
below on the test page) and is recorded in `docs/unspecified-surfaces.md` with
this section as its resolution.

**Measured on the five studies at 390 and 1440** (light and dark identical):
every prose-to-evidence and evidence-to-prose gap is 48, heading to standfirst
16, heading to body, note and milestone 24, and the section gaps are unchanged
(73.8 at 390, 96 at 768, 114.9 at 1024, 127.9 at 1440).
