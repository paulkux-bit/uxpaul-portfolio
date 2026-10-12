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
exposed three shipped components answering the same question three ways.
**Client work dialog** joined on 11 Oct 2026, the site's first modal surface,
and the first entry logged before its component existed. **Earlier work shelf**
joined on 12 Oct 2026, the first entry to carry dead code with a deletion
recipe. **Header identity mark** joined the same day, the first entry on the
site's chrome rather than its content.*

**The client work dialog (Template B).** Joined 11 Oct 2026 from the Template B
build brief (`docs/cc-prompt-template-b-build.md`), and logged before the
component existed rather than after. The four client pieces on the home page
open in a native `<dialog>` over the page, the site's first modal surface. No
locked spec governs a dialog, so each of the following borrows the nearest
token, and each is an input to the design system pass rather than a settled
answer:

1. **The title has no rung.** The project name borrows `text-h1` (36 to 56px;
   CLAUDE.md scopes it to case-study and section page titles) at weight 600, and
   is flared. It measures 51.2px at 1440, under the 52px cut by the same margin
   as `.about-hero__pov`, which is flared by ruling, and that is the precedent
   that admits it. It sits in RUNGS off the ladder, as the turn (T6) does. What
   a spec would need to say: whether a dialog title is a section page title, or
   a rung of its own.

2. **The byline and the statement nearly collide.** The byline ("for Lionsgate")
   is `--type-standfirst` and the statement below it is `text-h3`. Measured from
   the clamps: 21 against 22px at 390, 23.5 against 24.4 at 1280, 24 against
   25.2 at 1440, a ratio of 1.04 to 1.05 where the ladder steps at 1.15. Colour
   (secondary against primary) and the role line between them do the separating.
   What a spec would need to say: whether a near-miss is allowed when colour
   carries the step, or which of the two moves.

3. **The surface, the scrim and the width.** The panel is `--bg-surface` at
   `--radius-s`, with no shadow. `--radius-s` is the compact-control radius;
   `.milestone` and the hero callout are the precedent for using it on a panel.
   The width is `--page-max-width`, the page's own measure, so the dialog reads
   as a page laid over a page. The scrim had no token: `--scrim` is authored per
   mode in the theme layer. The prototype mixed `--text-primary` at 46% in both
   modes, which darkened the page in light mode and lifted it to grey in dark
   mode (measured `oklch(0.945 0.012 78 / 0.46)`). Paul ruled that it dims in
   both modes (11 Oct 2026), so dark mixes `--bg-sunken` instead. Even dimmed,
   the dark panel separated from the page at only 1.10:1, so from the build
   review (11 Oct 2026) the panel carries a 1px outline edge, `--border-subtle`
   in dark and transparent in light, which forced colours also paint. What a
   spec would need to say: a scrim role in colour v2 with a stated effect in
   each mode, whether a modal surface owes an edge in dark, and whether a modal
   panel takes the card's radius or a control's.

4. **Entrance motion.** Interaction v1 leaves entrance unspecified. The panel's
   fade and rise takes `--duration-card` (written for lift, shadow and media
   scale; Paul ruled it over `--duration-reveal`, 11 Oct 2026) and the content
   cross-fade waits `--duration-control`. What a spec would need to say: an
   entrance category, which the reveal containers also lack.

5. **Sheet chrome and two firsts.** The prototype gave the close button a
   `--bg-sunken` hover and, below 768px, a resting `--shadow-hover`. Paul ruled
   that it follows `.theme-toggle` instead, on mobile too (11 Oct 2026): colour
   plus `--border-strong` on hover, no resting shadow. On mobile it floats over
   the scrolling sheet on the sheet's own `--bg-surface` ground. The
   short-viewport padding drop is the site's first height query (848px).
   `text-box: trim-start cap alphabetic` sets the title's cap top on the image
   top; no spec mentions it, and Firefox ignores it. What a spec would need to
   say: whether a floating control needs a ground, and whether height queries
   are part of the breakpoint set.

**The Earlier work shelf (home page).** Joined 12 Oct 2026 from the Earlier
work build (`docs/cc-prompt-earlier-work-build.md`, direction A of
`docs/shelf-review-cc.md`). The shelf left the brand exception, so it has no
`data-brand`, no `--qh-*` and no `text-qh-title`. It is built from existing
roles only, because the design system pass will revisit colour, the type scale
and weight. Each item below borrows the nearest role, and each is an input to
that pass rather than a settled answer:

1. **The row title has no rung.** The project name and its client borrow
   `text-h3` (22 to 28px, which CLAUDE.md scopes to subsections and callouts)
   at `--wght-body` (400) instead of the role's 500. The client takes
   `--text-secondary`, after the hero signature. It measures 25.2px at 1440, a
   size and a weight step under the Selected work card titles (`text-cover`,
   32/600). At 390 the two are the same size, 22px, and only weight (400
   against 600) and the card's border separate them.
2. **A resting underline on touch only.** Under `@media (hover: none)` the
   project name carries the base `a` rule's resting underline (1px
   `--border-interactive`). A quiet link otherwise has no signifier at rest
   where hover cannot stand in. Interaction v1 §5 gives a text link hover and
   no pressed state, and names no input-dependent rest state. Pointer devices
   keep `.quiet-link`.
3. **One focus halo for a whole row.** The global pair (2px `--focus-ring` at a
   3px offset, 6px `--focus-glow`) is drawn on the row's `::before`, set out
   `--spacing-2xs` to the sides, while the row's link has `:focus-visible`. The
   link's own halo is suppressed inside `@supports selector(:has(a))`, so a
   browser without `:has()` keeps it. Interaction v1 §5 has every control
   inherit the global halo, and this redraws it around the target rather than
   the text.
4. **The brand shelf's code is dead, and scheduled for deletion.** The `--qh-*`
   tokens (light and dark), the four `[data-brand]` blocks, `.quick-hit` and its
   area rules, `@utility text-qh-title`, and the `brand` field and
   `QuickHitBrand` type in `app/data/template-b.ts` have been consumed by
   nothing since this build. They stayed so the build changed no token and no
   test input (Paul, option i, 12 Oct 2026). Delete them in the design system
   pass, in one commit, in this order:
   1. the `[data-brand]` blocks, `.quick-hit` and `@utility text-qh-title`,
      together
   2. the tokens
   3. `ALLOWLIST.weights` `.text-qh-title` in `scripts/lint-type.mjs` and
      `ALLOWLIST.media` `.quick-hit` in `scripts/lint-space.mjs`
   4. the `['.quick-hit', '--radius-m']` row in
      `__tests__/interaction-lint.test.mjs`
   5. the data field and type
   6. the CLAUDE.md scale row and every backticked `--qh-` token
   7. the sanction text in type v3 §6, colour v2 §9 and `docs/color-system.md`.

   Deleting the tokens before the blocks, or the blocks before the utility,
   fails `lint:color` check 6.

Needs: rulings from the design system pass on a list-title rung, on whether
touch gets a rest signifier site-wide, and on the row halo. Then item 4 is
deleted and leaves this file.

**The header identity mark (wordmark to face).** Joined 12 Oct 2026 from the
header handoff build (`docs/cc-prompt-header-handoff-build.md`, Paul's
rulings of 12 Oct after `docs/header-review-cc.md` and
`docs/header-preview-panel.md`). Once a page's opening scrolls under the
header, the wordmark hands off to Paul's profile in a coin, and back on the way
up (`components/wordmark-link.tsx`). No locked spec governs an identity mark, a
sequenced swap, or a focus ring that moves to a child, so each item below is an
input to the design system pass:

1. **The mark: size, picture, coin and ring.**
   - **Size.** The circle is 2.25rem below 768 and 2.5rem from 768, inside a
     2.75rem target (ruling 2a). No spacing or size token governs a header
     mark.
   - **Picture.** `public/header-face.webp`, 120px, 3,736 bytes, made by
     `scripts/build-header-face.mjs` from the md5-pinned cutout. It crops an
     840px square at x 80, y 50, stretches Rec. 709 luma between two fixed
     levels measured on that crop (0.076 and 0.847, its 1st and 99th
     percentiles, ruled 12 Oct after the sign-off sheet), then maps it from
     light `--text-primary` to light `--bg-canvas` at gamma 0.88, resizes to
     120px and encodes WebP at q82. Its ink and paper are the two tokens' sRGB,
     written into the script, so a palette change needs a re-run.
   - **Coin.** Two component tokens, authored by mixing in the theme layer on
     `--scrim`'s precedent and kept out of the twelve palette roles (Paul, 12
     Oct: logged here, no change to the locked colour spec). `--face-disc` is
     `--bg-surface` in light and `--text-primary` mixed 92% toward
     `--bg-canvas` in dark. `--face-ring` is `--text-primary` at 28% in both.
   - **Contrast.** The ring measures 1.83:1 on the disc and 2.00:1 on the
     header in light. In dark it is 1.06:1 on the disc, where the disc's own
     edge (13.49:1) draws the circle. Neither has to reach 3:1: the circle
     frames an image inside a link named "uxpaul".
   - What a spec would need: a role for an identity mark in colour v2, and
     whether component tokens like `--scrim` and `--face-*` belong in the
     locked palette.
2. **The sequenced swap and its beat.** The leaving element fades at
   `--duration-control`, and the arriving one at `--duration-card` after a beat
   of `calc(var(--duration-control) / 2)` (90ms), so no frame holds the word and
   the face together. The face also scales from 0.94. Interaction v1 §3 names
   two speeds and no delay, so this derives the beat rather than adding a third
   speed. Under reduced motion the transitions do not apply and the blanket
   rule makes the swap instant, still in order (Paul, 12 Oct, replacing his
   earlier fade ruling). What a spec would need: whether a sequence beat is a
   motion token.
3. **Focus that follows the circle.** While the face shows, the link's own
   halo is turned off and the house pair (2px `--focus-ring` at a 3px offset,
   6px `--focus-glow`) is drawn on the face, round through `--radius-full`.
   Interaction v1 §5 has every control inherit the global halo on itself, and
   this is the first halo drawn on a child. The link box stays 2.75rem in both
   states, so the target never moves. What a spec would need: when a halo may
   describe a child rather than the control.

Needs: rulings from the design system pass on all three. Until then
`--face-disc` and `--face-ring` are the only component colour tokens besides
`--scrim`.

**Hand-authored data visualisation.** Joined 23 Aug 2026, from the Delivery
Promise build, and the first to arrive from a coordinate-space question rather
than a token one. No locked spec governs a drawn chart: not its type sizes, not
its mark weight, not whether it carries a legend, and above all not the
**viewBox-unit versus screen-pixel** distinction that produced the defect. Type
inside an SVG is sized in the drawing's own units, so the 14px floor every other
surface is held to does not apply to it by construction — 14 units rendered at
4.79px in a 342px container and no gate saw it, because `lint:type` parses
`app/globals.css` and these were SVG presentation attributes. What the systems
would need to say: which type belongs in a drawing at all (the answer adopted here
is *only geometry and numerals*), how a stroke keeps its weight across scales
(`vector-effect: non-scaling-stroke`), and what a chart owes a reader in legend and
table form. Until then the rule lives in
`docs/urbn-delivery-promise-build-brief.md` §3.1 and in the two components.

**The turn (T6), the "How do you...?" section.** Joined 5 Oct 2026 from the
narrative layout, and ruled the same day, so it is recorded here as found and
already resolved rather than open. No spec governed a section whose heading is
smaller than its first paragraph: the question is a heading at standfirst size,
and the answer is a paragraph at the hero title's size, so neither the h2 rung
nor the standfirst rung describes what the pair is, and the section break alone
gave the page's one typographic event the same air as every other section (122
above and 106 below at 390 on the test page, raised before the build). Paul
ruled G1 (48 more above, 32 more below, as padding inside the section), S3b (48
from the answer to the next paragraph) and K1 (the key phrase at 600). The type
rules live in `type-system-v3-locked.md` §3.4 and the gaps in
`spacing-system-v1-locked.md` §12; this entry stays as the record of how the
surface arrived.

**The fine art moment (image height and the hairline).** Joined 8 Oct 2026 from
the fine art build, which replaced the animated friction moment (and with it the
ambient-motion entry that stood here: the loop no longer exists). Each study's
section 2 now carries one still painting, `components/friction-moment.tsx`. Two
things in it no locked spec governs:

1. **An image's height.** Spacing v1 governs the gaps around the figure (S2a, 48
   both sides) and type v3 governs its caption and credit (the bento caption and
   rung 0), but nothing governs how tall a picture may be. A portrait painting at
   the reading measure ran to 724px at 1440 on the test pages. Ruled C2: a new
   token, `--art-max-height: 40rem` (640px at the default root), and a tall work
   narrows rather than growing. What a spec would need to say: whether one cap
   serves every in-column image or this surface alone, and whether it should be
   `rem` (grows with text zoom, as here) or `px`.
2. **The image hairline does not paint over an opaque image.** The house rule,
   `box-shadow: inset 0 0 0 1px var(--border-subtle)` on `.figure__image` and now on
   `.friction-moment__image`, draws under an `<img>`'s content, so over an opaque
   picture there is no visible line: a 3x capture of the Degas corner on the test
   page showed none. That is one instrument; it wants a person's eye as the second.
   Ruled D1: the moment replicates the house rule as written, which is what was
   approved on the test pages. If a visible edge is wanted, the working pattern is
   `.bento-theme__media`'s `::after` overlay, and the question is site-wide rather
   than this surface's.

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

**Illustration line weight.** *Dissolved 8 Oct 2026: the traced beat figures it
was written for (`.fdte-figure`, `.nuuly-beat-figure`, `.oku-figure`) were retired
with the friction beats, so no shipped surface carries the question today. Kept as
the record for the next traced figure.* What minimum rendered stroke a case-study figure
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

**Closed for evidence blocks 5 Oct 2026** (ruling S2a, `spacing-system-v1-locked.md`
§12). The statement asked for is: the evidence block owns its vertical boundary,
48 on both sides, through one `margin-block` rule covering every evidence block
that sits directly in a section, ordered above the first- and last-child rules
so a section's outer blocks still yield to the section break. That covers the
framed pair, the bento theme and band, `<Figure>`, the friction moment and the
four Delivery Promise modules; the audit of `margin-top`-only rules found six,
and §12 says where each one landed. The milestone is not evidence and keeps its
`:not(:last-child)` bottom; its token stays the open choice its CSS comment
names. The entry stays as a record until this file is next consolidated, so the
entry numbers other files cite do not shift.

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

**Closed 1 Oct 2026.** Paul ruled from the C5 render that weight and colour
carry four-ness (recorded in v3 §6), and the closing-review cleanup deleted the
two dead properties, `--qh-wdth` and `--qh-opsz`. Nothing here is open; the
entry stays as a record until this file is next consolidated, so the entry
numbers other files cite do not shift.

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
