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

Every container that sets `font-weight` and holds an icon sets `--icon-stroke`
from the table beside it. Size needs no declaration at all — `1em` inherits.

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
--radius-m:   12px;   /* buttons, cards */
--radius-full: 999px;
```

`--radius-image` and `--radius-portrait` stay as media tokens.

Mapping from what ships: 2px and 3px → `xs`; 4px → `xs`; 6px → `s`; 8px → `s`;
10px → `m`; 999px → `full`.

**This is the one section that changes shipped appearance.** 6px surfaces
become 8px and the button goes 10px → 12px. Everything else in this document is
either invisible or additive. Look at it before adopting.

---

## 5. States

The global two-layer `:focus-visible` halo (2px ring, 3px offset, 6px glow) is
unchanged and every control continues to inherit it.

| Surface | Hover | Pressed |
|---|---|---|
| Text link | colour + underline (two channels, unchanged) | none — text has no surface to move |
| Nav link | colour + bottom border | sink 1px |
| Button | background `--text-primary` → `--text-secondary` | sink 1px + drop to `--shadow-rest` |
| Theme toggle | colour + border `--border-strong` | sink 1px |
| Card | `translateY(-3px)` + `--shadow-hover` + `--border-strong` + media `scale(1.03)` | sink 1px + drop to `--shadow-rest` |
| Work band | arrow `translateX(4px)` + label underline | sink 1px |
| Disclosure row | colour | none — the rotation is the feedback |

**Pressed is `translateY(1px)` and a drop to the resting shadow.** Chosen over
scale because scaling a large card reads as the layout breaking, and over tint
because tint nearly vanishes on the dark ground.

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
gap          0.5em                (scales with the label)
```

A second size gets added when a second real use appears, not before.

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

**Card meta** is half closed. Its hover, motion and elevation are specified
here; its type rung and internal density are not.

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

None of these block the migration. All of them block calling the system
complete.
