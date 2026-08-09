# Interaction system v1 — locked

Governs icons, motion, radius, and the states of every interactive surface.
Locked 9 Aug 2026. Sibling to `type-system-v3-locked.md`,
`spacing-system-v1-locked.md` and `color-system-v2-locked.md`.

This is one document rather than two because an icon inside a button is both an
icon and a control. Specifying them separately produces a button that is
correct in two documents and wrong on screen — the same argument that put nav,
footer, buttons and card meta on a single list in `unspecified-surfaces.md`.

---

## 1. Rulings

**R1 — Icon stroke derives from adjacent type.** Rendered stroke is
`0.65 × the stem width of the text the icon sits beside`. Not a constant, not a
proportion of the icon. This continues the sentence the other three systems
already say: type derives from a ladder, spacing derives from type, colour
derives from primitives.

**R2 — Icons are sized in `em`, never in px.** At `E = 1em` the icon box equals
the adjacent font size. This is what makes R1 free (see §2.2) and it is also the
fix for a bug already found once by hand: Lucide writes `width`/`height` as px
attributes, so a px-sized icon stops scaling when a reader raises their root
size. That fix currently exists as a comment in one selector; it is now the
rule.

**R3 — Lucide is the only icon source.** No hand-authored `<svg>` icons, no
Unicode glyphs used as icons, no icon fonts. Case-study illustrations are
artwork, not icons, and are out of scope — the same line drawn for SVG artwork
in the colour system's check 7.

**R4 — Interaction lives in `globals.css`.** Hover, focus, active and disabled
states are authored there against named tokens. No `hover:` / `focus:` /
`active:` utilities in `.tsx`. Interaction is currently split across both
surfaces with no rule; this is the rule.

**R5 — Every interactive surface has three states, not one.** Rest, hover and
pressed, plus the inherited focus halo. A surface with a `:hover` rule and no
`:active` rule is incomplete, because on touch the hover never fires and the
tap produces nothing.

**R6 — Motion has two speeds, not four.** Controls move at one duration, cards
at another. Four ad-hoc durations are in use today for one class of
interaction.

**R7 — Radius is a scale.** Seven literal values are in use. Any radius that is
not on the scale is an allowlisted exception with a written reason, the way
spacing and colour exceptions already work.

---

## 2. Icons

### 2.1 The constants

`E = 1em`. Stroke is a function of the **weight** of the adjacent text only:

| Adjacent weight | measured stem | `strokeWidth` | renders at 16px | at 25.2px |
|---|---|---|---|---|
| 400 | size × 0.0916 | **1.43** | 0.95px | 1.50px |
| 500 | size × 0.1090 | **1.70** | 1.13px | 1.78px |
| 600 | size × 0.1250 | **1.95** | 1.30px | 2.05px |
| 700 | size × 0.1444 | **2.25** | 1.50px | 2.37px |

### 2.2 Why this is four constants and not a per-placement calculation

Rendered stroke = `0.65 × fontsize × k(weight)`.
`strokeWidth` in viewBox units = `rendered × 24 ÷ icon size`.
With the icon sized in em, icon size = `E × fontsize`, so:

```
strokeWidth = 0.65 × fontsize × k × 24 ÷ (E × fontsize)
            = 15.6 × k ÷ E
```

**Font size cancels.** Stroke depends only on adjacent weight and E. Nothing
tracks metrics per placement.

### 2.3 Implementation

```css
.icon { width: 1em; height: 1em; flex: none; stroke-width: var(--icon-stroke, 1.70); }
```

**The container that holds an icon declares `--icon-stroke`** from the table
beside it. 1.70 is the default because weight 500 is the commonest adjacent
weight here.

**The icon must be put into its type context, because it is usually not already
in one.** An earlier version of this section said "size needs no declaration at
all — `1em` inherits", and paired it with "every container that sets
`font-weight` and holds an icon sets `--icon-stroke`". Both sentences assume the
icon is a **descendant** of the element carrying the adjacent type. Measured
against the four surfaces this system governs, that is true of exactly one:

| surface | relation to the adjacent type | so |
|---|---|---|
| `.about-btn` | descendant | inherits correctly; nothing to add |
| `.about-work-band` | **sibling** of `__label` (`text-h3`) | icon carries `text-h3` |
| `.about-row__summary` | **sibling** of three spans at two rungs | icon carries `text-h3` |
| `.theme-toggle` | **no adjacent text at all** | container declares the context |

**The rung goes on the icon node, not on the container.** Putting the type
utility on the container is the tidier-looking fix and it leaks: `text-h3` also
carries `letter-spacing` and `line-height`, and `text-small` — which the drawer
row's role and year use — declares neither, so the tracking would inherit into
both. On an `<svg>` those same declarations are **inert**, because it is a
replaced element. That is the whole reason this placement is safe, and it is the
reason to prefer it.

Not the alternative of setting `font-size` on the icon's own class: that copies a
rung's clamp into a component rule, which is drift. `.about-row__mark` already
carried such a copy and this migration removed it.

**Which sibling is "adjacent" is a judgment, and it is recorded.**
`.about-row__summary` holds a company (`text-h3`, weight 500), a role and a year
(`text-small`, weight 400). The company is the row's subject and the mark is
optically centred against its first line, so the mark takes `text-h3` and 1.70.
The choice moves the stroke between 1.70 and 1.43 and the box between 25.2px and
16px, so it is not a detail.

**An icon with no adjacent text takes the nearest type in its chrome, declared
explicitly.** `.theme-toggle` has no text inside it. Its adjacent type is the
wordmark — 1rem at weight 600, the only other type in the header — so it strokes
at **1.95** and declares `font-size: 1rem; font-weight: 600` itself. The weight
is inert there; it exists to state the context, which is what makes the
containment rule resolvable at all. A judgment, not a derivation.

**A descendant selector can silently outrank `.icon`.**
`.theme-toggle svg { width: 1.125rem }` at (0,1,1) beats `.icon` at (0,1,0), and
would have pinned the converted icons to 18px with every check green. Size an
icon through `.icon` or not at all.

### 2.4 Out of scope

Case-study illustrations (`components/fdte/*`, `components/oku/*`), the paper
grain texture, and the `·` interpunct, which is a typographic separator with
its own `@supports` alt-text handling and is not an icon.

---

## 3. Motion

```css
--duration-control: 180ms;   /* hover, focus, press, rotation, colour */
--duration-card:    300ms;   /* lift, shadow, media scale */
--duration-theme:   450ms;   /* mode transition */
--duration-reveal:  560ms;   /* entrance — unchanged */
```

Easing is unchanged: `--ease-out-soft` for state changes, `--ease-out-quint`
where it is already in use. The reveal stagger (70 / 140 / 210 / 280ms) is a
sequence of **delays**, not durations, and is unaffected.

`--duration-theme` is a **name for a speed that already ships**, not a new speed.
This section was written from an interaction audit and inherited its blind spot:
a mode transition is neither an interaction nor an entrance, so it had no
category and its two sites had no destination. Defined at the value `body` was
already using, so nothing renders differently.

**Replaces, corrected against the tree** — the original line here said "160ms
(×2), 200ms, 240ms, 320ms" and was wrong about its own subject on three counts:

| value | sites | where |
|---|---|---|
| 160ms | **4** | `.site-header`, `.skip-link`, `.nav-link`, `.theme-toggle` |
| 200ms | 2 | `.about-btn`, `.about-work-band__arrow` (via the retired `--duration-hover`) |
| 220ms | 1 | `a` — the link-hover underline, **unlisted originally** |
| 240ms | 2 | `.about-row__mark`, `.about-row::details-content` |
| 320ms | 1 | `@utility lift` → `--duration-card` |
| 450ms | 2 | `body`, `body::before` → `--duration-theme` |

The paper-grain fade at 450ms was described here as "an entrance, not an
interaction". **That was false.** The grain's opacity is 0.55 in light and 0 in
dark and nothing else changes it, so the transition fires only on a mode swap —
the same mode transition as `body`'s, at the same duration. It takes
`--duration-theme` and its allowlist entry is deleted.

---

## 4. Radius

```css
--radius-xs:   4px;   /* inline marks, small media, focus-ring rounding */
--radius-s:    8px;   /* compact controls — theme toggle, nav */
--radius-m:   12px;   /* buttons */
--radius-l:   16px;   /* cards */
--radius-full: 999px;
```

**Five steps, not four.** `--radius-l` exists so the card keeps 16px and gets its
own step above the button, rather than being pulled down to 12 to fit a scale
that had no room for it. Radius scales with surface size: a button is not a card,
and the ladder should say so.

`--radius-image` (12px) and `--radius-portrait` (4px) stay as media tokens. They
now coincide in value with `m` and `xs` while remaining distinct in meaning —
that is a coincidence, not a duplication to collapse, and the note above still
stands that portrait is not to be "corrected" to image.

### Mapping from what ships

| ships | → | sites |
|---|---|---|
| 2px | `xs` | `:focus-visible` |
| 3px | `xs` | `.mode-pair__label` |
| 4px | `xs` | `.skip-link`, four bento media surfaces, the two bento `__track:focus-visible` |
| 6px | `s` | `.figure__image`, `.mode-pair__cell`, `.figure--constrained-bleed .figure__image`, `.figure-placeholder`, `.hero-block__image-frame .figure-placeholder` |
| 8px | `s` | `.theme-toggle`, `.milestone`, `.figure--framed`, `.hero-block__callout` |
| 10px | `m` | `.about-btn` |
| **16px** | **`l`** | **the case-study card** — authored in JSX as `rounded-2xl`, which is why it was missing from the first version of this table |
| 999px | `full` | `.about-roles__step::before` |

### What actually changes on screen — nine sites

The earlier version of this section said "6px surfaces become 8px and the button
goes 10px → 12px. Everything else is either invisible or additive." That was
wrong, and the corrected list is:

1. **`:focus-visible` 2px → 4px.** Called out first because it has the widest
   blast radius in the whole document. It is a real `border-radius` sitting
   beside `outline: 2px solid` in the same rule, so it rounds the focus ring on
   **every focusable element that has no radius of its own**. A focus ring is not
   a place for a surprise.
2. `.mode-pair__label` 3px → 4px.
3–7. `.figure__image`, `.mode-pair__cell`,
   `.figure--constrained-bleed .figure__image`, `.figure-placeholder`,
   `.hero-block__image-frame .figure-placeholder` — all 6px → 8px.
8. `.about-btn` 10px → 12px.
9. Nothing else. The card is 16 → 16 and the quick-hit shelf is 12 → 12: both
   move authoring surface without moving a pixel, which is the point of adding
   `l`.

### Of those eight, exactly two are visible to a reader

Measured from the render, not reasoned from the stylesheet — which is the
mistake this section has now made twice.

| site | change | reaches a reader? |
|---|---|---|
| `:focus-visible` | 2 → 4 | **yes** — every focusable element with no radius of its own |
| `.about-btn` | 10 → 12 | **yes** |
| `.figure__image` | 6 → 8 | **no** — every rendered instance is overridden to `--radius-image` (12px) by the more specific `.cs-section--problem .framed-pair__cell .figure__image`, which was already tokenised |
| `.mode-pair__cell`, `.mode-pair__label` | 6 → 8, 3 → 4 | **no** — render on no route |
| `.figure--constrained-bleed .figure__image` | 6 → 8 | **no** — renders on no route |
| `.figure-placeholder`, `.hero-block__image-frame .figure-placeholder` | 6 → 8 | **no** — render on no route |

Probed on `/`, `/about` and both case studies: zero instances of
`.mode-pair__cell`, `.mode-pair__label`, `.figure-placeholder`,
`.figure--framed` and `.figure--constrained-bleed`. `ModePair` is already
recorded as live-capable dead code in `unspecified-surfaces.md`; the figure
surfaces are a new instance of the same thing.

`.figure__image` is the more interesting one, because it *does* render and still
changes nothing: a more specific selector wins on every instance. A rule can be
live, correct, migrated, and reach no pixel. Enumerating what a stylesheet says
is not the same as enumerating what a reader sees, and only the second one is
what "changes shipped appearance" means.

### Why the first map was wrong

The audit behind it grepped `border-radius:` in CSS and never read Tailwind
radius utilities in JSX. `lint:interaction` check 3 had **the identical gap from
the identical cause** — it also read stylesheets only.

A rule and the check that enforces it sharing a blind spot means neither can
catch the other. That is how this section could assert "the only visible changes
are 6→8 and the button" while a 16px card and a 2px focus ring sat outside its
view, and why the failure survived being written down, reviewed and gated.

It belongs in §8's tally: the sixth case in this system where a stated rule and
an implemented rule disagreed, and the first where the **spec** was the half that
was untested. Check 3 reads JSX as of I3-A, so the two can now contradict each
other loudly instead of agreeing by shared omission.

---

## 5. States

The global two-layer `:focus-visible` halo (2px ring, 3px offset, 6px glow) is
unchanged and every control continues to inherit it.

| Surface | Hover | Pressed |
|---|---|---|
| Text link | colour + underline (two channels, unchanged) | none — text has no surface to move |
| Nav link | colour + underline | sink 1px |
| Button | background `--text-primary` → `--text-secondary` | sink 1px |
| Theme toggle | colour + border `--border-strong` | sink 1px |
| Card | `translateY(-3px)` + `--shadow-hover` + `--border-strong` | sink 1px + drop to `--shadow-rest` |
| Work band | arrow `translateX(3px)` + label underline | sink 1px, **on the band** |
| Disclosure row | colour | none — the rotation is the feedback |

**Pressed is `translateY(1px)`, and a drop to the resting shadow wherever there
is one to drop.** Chosen over scale because scaling a large card reads as the
layout breaking, and over tint because tint nearly vanishes on the dark ground.

**Only the card has a resting shadow** (via `@utility lift`), so it is the only
row where the shadow half means anything. The button, nav link, theme toggle and
work band sink and do nothing else.

**The work band sinks as a band.** It is a single `<Link>` whose hover is
expressed on two descendants, so `lint:interaction` check 7 reports it twice; the
`:active` belongs on the surface being pressed, not on the arrow and the label
independently.

**A transitioned press cannot finish inside a tap, and only the card
transitions one.** Measured on an emulated device with a real tap: the four
controls have no `transform` transition, so they snap to the full 1px and hold it
for ~150ms. The card transitions `transform` at `--duration-card` (300ms) via
`@utility lift`, so a ~43ms tap reaches **0.53px** and eases back without ever
arriving at the specified offset. Held with a mouse it reaches 1px exactly.

This is §3 and §5 meeting where neither section looks: §3 assigns the card its
duration for lift and shadow, §5 specifies the pressed offset, and the tap is
shorter than the transition. Recorded rather than changed — altering it means
changing motion, which is a locked system, and the pressed value itself is
correct. **Open**: whether the press should run at `--duration-control` on every
surface.

**Source order is part of the specification, not an implementation detail.**
`:hover` and `:active` on the same element have equal specificity, so an
`:active` authored above its `:hover` never applies while the pointer is down.
Every rest and hover pixel stays identical and the press silently does nothing.
Check 7 fails that ordering; on the card it would hide a 4px move.

### Corrections, and why they survived a lock

Four rows above described behaviour the code did not have. Each was found by
reading the code during I4 rather than by any gate:

- **Card** listed `media scale(1.03)`. The card media tier was deleted in
  `099a172` — on this branch, *after* §5 was locked — and the row was never
  updated. A spec goes stale the moment its subject is removed.
- **Work band** said arrow `translateX(4px)`; the code is `3px`.
- **Nav link** said "colour + bottom border"; the code is colour +
  `text-decoration-line: underline`. An underline is not a bottom border.
- **Button** said "sink 1px + drop to `--shadow-rest`" for an element with no
  shadow at rest.

`.take-card:hover` is also worth naming: it is exempted from check 7 as "a
typographic wall, not a control", and that reason exists **only** in the lint
allowlist — there is no row for it here. It is also on a surface that renders on
no route.

**Deliberately unspecified.** `:disabled` — no disabled control exists on the
site, and specifying one would be structure built ahead of use. `:visited` —
not styled, because the index is a set of destinations rather than a reference
list and visited-colouring would make the grid read as partially consumed.
Both are recorded here as decisions, not omissions.

---

## 6. The button

One button exists (`.about-btn`). It is specified properly rather than turned
into a scale.

```
min-height   44px                 (touch target, unchanged)
padding      --spacing-2xs / --spacing-m
radius       --radius-m
label        weight 500 → --icon-stroke: 1.70
gap          --spacing-2xs
pressed      translateY(1px)      (§5; no resting shadow to drop)
```

A second size gets added when a second real use appears, not before.

**Two rows corrected.** `gap` was written here as `0.5em "(scales with the
label)"`; the code has always used `--spacing-2xs`, and an `em` gap would in any
case collide with spacing v1's ruling on `em` in block-level spacing. `pressed`
was added because §5's Button row specified "sink 1px + drop to
`--shadow-rest`" for an element that has no shadow at rest — only the card
does.

This is the surface where §2.3's "1em inherits" is true as written: the icon is a
descendant of the element carrying the label, so it needs no rung of its own.

---

## 7. Verified, not asserted

**Lucide geometry** is read from the published package at the installed version
(1.30.0), not reproduced from memory.

**Stem widths** are measured, not estimated: Bricolage rendered in the DOM at
8× device scale with `font-optical-sizing: auto`, sampled across every row of
the cap band, keeping only rows with exactly two dark runs (the two stems of an
`H`), median of those runs.

The first attempt returned nonsense — 7.25px stems at 14px type — because the
single sample row landed exactly on the H crossbar and measured letter width
instead of stem. Recorded because it is the same failure class as the five
instrument faults logged across the previous three migrations: the measurement
was wrong in a way that looked like a result.

The font was loaded from npm rather than the Google Fonts CDN. The CDN silently
fell back to serif and does not serve the `wdth` axis at all — the third time
that trap has fired in this project.

Result: stem = size ÷ 8 at weight 600, size ÷ 11 at weight 400, holding across
every size tested from 14px to 32px.

**What ships today**, for the record: four icons at 60%, 76%, 61% and 73% of
the stem of the text beside them. Under this spec all four become 65%.

### Enumerate what RENDERS, not what the stylesheet says

A rule can be live, correct, migrated, and reach no pixel. Before claiming a
change is visible — or that a surface is covered — query the routes for the
selector and read the computed value on the elements that come back.

Two kinds of miss, both found here:

- **The selector matches nothing.** Five radius sites (`.mode-pair__cell`,
  `.mode-pair__label`, `.figure-placeholder`,
  `.hero-block__image-frame .figure-placeholder`,
  `.figure--constrained-bleed .figure__image`) return zero instances on `/`,
  `/about` and both case studies.
- **The selector matches, and loses.** `.figure__image` renders twice per case
  study and computes 12px on every instance, because
  `.cs-section--problem .framed-pair__cell .figure__image` is more specific. Its
  6px rule is live, correct, and reaches nothing.

This has now produced **two wrong predictions from two different authors** —
§4's original map, written from a CSS grep, and §4's I3-B rewrite, written from
the stylesheet again. That is a standing rule, not an anecdote: enumerating what
a stylesheet *says* is not enumerating what a reader *sees*, and only the second
is what "changes shipped appearance" means.

---

## 8. Enforcement

`lint:interaction`, nine assertions:

1. No literal duration in any `transition` — every one resolves to a token.
2. Every interactive `transition` uses `--ease-out-soft` or `--ease-out-quint`;
   no bare `ease`, `linear` or inline `cubic-bezier`.
3. No literal `border-radius` outside the radius tokens, except allowlisted
   entries with reasons.
4. No hand-authored `<svg>` icon outside the artwork allowlist.
5. Every icon is `1em` square — no px width or height on an icon node.
6. Every `--icon-stroke` value appears in the §2.1 table, and every container
   that sets `font-weight` and contains an icon sets `--icon-stroke`.
7. Every selector with `:hover` has a corresponding `:active`, or an
   allowlisted reason why it does not (text links, disclosure rows).
8. No `hover:` / `focus:` / `active:` / `group-hover:` utilities in `.tsx` —
   R4, enforced.
9. Every class token in a `className` resolves to a Tailwind utility present in
   the built CSS or to an authored rule in `globals.css`. A class that
   deliberately has no rule is an allowlisted entry with a written reason.

Assertion 9 was added after R4's move, because nothing above it could see the
failure that move produced: Tailwind silently dropped rules authored inside the
`@utility` cluster, so a class existed in `.tsx` with no rule anywhere while
check 8 went green *truthfully* — the utilities really had left the `.tsx`. It
catches that by its **consequence**, which is also its limit: a deliberately
unstyled structural wrapper and a rule that vanished are both a class with no
rule, and nothing mechanical tells them apart. The difference is intent, so
intent is declared, and each declaration is coupled by a test to the structural
premise its reason rests on — an exception whose reason can quietly stop being
true is a stale exception that still reads as a live one.

Each assertion must be proven in both directions before it is trusted: plant a
violation and confirm it is caught, remove one and confirm the count drops.
Fixtures assert a positive result — "scanned, N found, M excluded" — never the
absence of output. A negative control that stops appearing is indistinguishable
from a file that was never opened, which is how the `.mdx` gap hid during the
colour migration.

**Every section of this document that enumerated shipped code got it wrong.** §4's
map omitted a 16px card and mistook two visible changes for six; §5's table
described a hover that had been deleted, an offset off by a pixel, an underline
called a border, and a shadow on an element that has none; §2.3's implementation
rule held for one of the four surfaces it governs; §6 named a gap the code has
never used. Each was found by reading the code during the migration that touched
it — never by a gate, because the gates were derived from the same reading.

The rate is the finding. A spec written from an audit inherits that audit's blind
spots, and a check written from the spec cannot see past them. Anything here that
claims what the code does is a claim to re-derive, not to trust.

**A rule can be the untested half too.** §4's radius map was written by an audit
that grepped CSS and never read JSX, and check 3 enforced it with the identical
gap. Neither could catch the other, so a 16px card and a 2px focus ring stayed
outside a section whose whole job was to enumerate them. When a check and the
rule it enforces are derived the same way, agreement between them is not
evidence. Sixth case, and the only one so far on the spec's side of the line.

**Four of the nine shipped testing something other than their stated rule**, and
not one was caught by the check itself. Checks 5, 6 and 8 each implemented half:
5 flagged an explicit px size but called an ungoverned icon clean, 6 declared
§2.3's containment half uncheckable, and 8 went green on a move whose destination
did not exist. Check 9 went the other way — it read a JavaScript array body as a
class list, and separately dropped tokens it could not shape-match and never read
`className={…}` expressions at all, so it tested slightly more than its rule in
one place and less in two others. Same root in every case: the stated rule and the
implemented rule were never diffed. Reading a new check against this section, line
by line, before trusting its first green is the cheapest defence, and it is now
part of writing one.

---

## 9. Still open

**Nav and footer** remain in `unspecified-surfaces.md`. This document gives them
states and motion but not their type rungs or internal spacing, which is the
part that needs both other systems.

**Card meta** is half closed, and the half is the container rather than the
strip. What this document specifies belongs to the **card**: its hover, pressed
state, elevation and radius (`--radius-l`). The `project · client` strip itself
has no interaction to specify, and its three open questions — internal density,
its type rung, and the gap between it and the headline above — are untouched
here. `text-caption` is what it renders at today, named in `CLAUDE.md`'s scale
table but not assigned to this surface by any locked §-rule.

**Entrance motion is unspecified in v1.** §3 governs interaction; entrance was
never in its scope, and the tree has **three groups and six live speeds**:

| group | speeds | surface |
|---|---|---|
| tokenised | 560ms | `--duration-reveal` — `.about-reveal` |
| reveal containers | 360ms | `.reveal-grid`, `.reveal-list` — **live on the home page** |
| takes wall | 250 / 600 / 700 / 900ms | `.take-card`, `.mark`, `.take-content` — rendered on no route |

`lint:interaction` check 1 excludes all three as **one category** with that
reason, not as eight item entries: eight would pretend each was weighed on its
merits, and nobody re-reads them.

Reconciling them is a design decision with visible consequences, which is why it
is here and not in the lint. Specifically, **360ms → 560ms is not the answer by
default**: it is a 55% slowdown of the home page's entrance stagger, and a
migration is the wrong place to make that call.

**Pinned specimen tones** are untouched and stay on that list.

**`--qh-*`** brand tokens are unaffected and remain the open colour question.

---

### Three findings this document owns, or half owns

Written down rather than resolved. I6 turned the gate on; deciding these inside
the commit that makes the gate mandatory would be scope creep at the exact
moment the gate stops being optional.

**#18 — a transitioned press cannot finish inside a tap.** §3 gives the card
`--duration-card` (300ms) for `transform`; §5 gives it a pressed offset of
`translateY(1px)`. Measured on an emulated device with a real tap: the press
reaches **0.53px** and eases back, because a ~43ms touch is shorter than a 300ms
transition. Held with a mouse it reaches 1px exactly, and the four controls —
which do not transition `transform` — snap to the full 1px and hold it for
~150ms.

**The value is correct. The unresolved thing is the interaction between §3 and
§5**, and both sections are in this document, so it is this document's to
settle. Neither section is wrong on its own terms; neither looks at the other.
The open question is whether the press should run at `--duration-control` on
every surface, which would make the card's press legible on touch at the cost of
decoupling its press from its lift. That is a motion decision with a visible
consequence, so it belongs in its own pass.

**#19 — the correct expression cannot ship, and neither spec is at fault.**
`.about-row__mark`'s optical centring is `(line-height − mark height) / 2`. Now
that §2 sizes the mark at `1em` of its rung, both terms are the same font-size
and it collapses to **`0.125em`** — one number, no borrowed clamp.

It is written as `calc(clamp(1.375rem, 0.5vw + 1.125rem, 1.75rem) * 0.125)`
instead, which is the same computed value and a copy of the type system's source
in a component rule.

**The diagnosis is a defect in `lint:space` check 2, not in either spec.** Check
1 already allowlists this exact declaration, by selector and property, with its
reason written. Check 2 — "no `em` on block-level spacing" — does not consult
that allowlist, so the `em` form fails a gate the `rem` form passes **for an
identical rendered result**. Spacing v1's ruling is about rhythm depending on
local font-size; this is optical centring of an icon against its own line box,
which is why check 1 exempted it in the first place.

**The `em` form is the correct expression and should ship once check 2 consults
the allowlist check 1 already uses.** Until then the `rem` form stands, and the
duplication it reintroduces is a known cost, not an oversight. This one is not
this document's to fix: it is `lint:space`'s.

**#20 — the gate could not enter where its siblings did.** Check 9 reads built
CSS from `.next`, so ordering `lint:interaction` ahead of `next build` — the way
`lint:color` entered at `df70f8f` — fails it on every fresh checkout, for the
one reason it exists to refuse: it cannot see. It runs after `next build`
instead. Recorded because the next system to be locked will face the same
question the moment any of its checks reads build output.

---

None of these block the migration. All of them block calling the system
complete.
