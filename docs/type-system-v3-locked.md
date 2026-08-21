# The uxpaul.com type system — v3, locked

Decided 5 Aug 2026 from rendered options. This document supersedes v1 and v2. Where a value here disagrees with `docs/typography-system.md` or the Typography section of `CLAUDE.md`, this document wins, and those two must be updated in the same commit that adopts it.

---

## The rulings

| # | Decision | Ruling |
|---|---|---|
| 1 | What carries meaning | **Width follows size. Weight carries mood.** |
| 2 | Width vocabulary | **Three bands, assigned by rung.** 100 reading, 94 display, 88 large display |
| 3 | The signature | **The 340/720 weight contrast, three reserved uses sitewide** |
| 4 | Step ratio floor | **1.15**, numbered-headline floor raised to 26px |
| 5 | Milestone date | **600 at width 88**, on the standard properties. One axis, exactly one place |
| 6 | Case-study close | **`## Role` stays a heading** |
| 7 | Also Shipped and takes wall | **Named exception surfaces** with their own written rules |
| 8 | Enforcement | **`npm run lint:type`** |

---

## 1. The system in one paragraph

One typeface, three axes, three jobs, and only one of them is a design decision. **Optical size runs itself** — never pinned outside the two sanctioned exceptions. **Width is a function of the rung** — three values, assigned automatically, never chosen. **Weight carries hierarchy and expression** — and the 340-against-720 contrast is the site's signature, spent deliberately in three places. Size is a fluid ladder of seven rungs above a fixed 18px body, and adjacent rungs never come closer than 1.15× at any viewport from 320 to 2560.

---

## 2. Foundations

Bricolage Grotesque, variable, all three axes loaded (`opsz` 12–96, `wdth` 75–100, `wght` 200–800). No second typeface. No italics; `em` maps to weight 600 in the base layer.

Hard constraints: **14px floor** everywhere. **18px body** at every viewport. **`font-optical-sizing: auto`** globally. **Text colour from `--text-*` tokens only** — no `color-mix` on `currentColor`, no legacy `--color-text-*` aliases.

---

## 3. Tokens

### 3.1 Width — three bands, assigned by rung

Bands are keyed to the rung's **desktop ceiling**, not to live rendered size, so an element never changes width as the viewport resizes.

| Token | Value | Band | Rungs |
|---|---|---|---|
| `--wdth-read` | `100` | Reading | Rungs 0, 0.5, 1, 2 (14–26px) |
| `--wdth-display` | `94` | Display | Rungs 3, 4 (32–52px ceiling) |
| `--wdth-large` | `88` | Large display | Rungs 5, 6 (72–88px ceiling) |

There is no fourth value and no per-module choice. If you are picking a width by eye, you are outside the system.

**Authoring.** Bare numbers, converted at the property site. A percentage cannot appear inside a `font-variation-settings` string, and Tailwind v4 tree-shakes `@theme` variables nothing references — which fails silently, because `font-stretch` inherits, so an undefined token resolves to `inherit` and renders as if nothing were wrong.

```css
@theme static {          /* `static` is required or these are tree-shaken */
  --wdth-read:    100;
  --wdth-display:  94;
  --wdth-large:    88;
}
.case-study-prose h2 { font-stretch: calc(var(--wdth-display) * 1%); }
```

### 3.2 Weight

| Token | Value | Used by |
|---|---|---|
| `--wght-thin` | `340` | Signature only, ceiling ≥40px |
| `--wght-body` | `400` | Body, standfirsts, captions |
| `--wght-credit` | `500` | Credit lines, quiet emphasis, h3 |
| `--wght-display` | `600` | Headings, headlines, eyebrows, prose emphasis |
| `--wght-loud` | `720` | Signature only, ceiling ≥40px |

**The signature (ruling 3).** The 340/720 pair is reserved for exactly three placements: the home hero, the about page opener, and one moment per case study chosen by the author. It is illegal on any role whose **desktop ceiling** is under 40px, and illegal anywhere else without an entry in the lint allowlist. It exists because it is the one typographic idea on the site that reads in under a second, at any size, and survives the fallback font.

**"≥40px" means the role's ceiling, not its rendered size (settled 7 Aug 2026).** The earlier wording said only "illegal below 40px," which read as a statement about rendered size and put the home hero in breach of the spec on every phone: `text-lede` is `clamp(2rem, 4.5vw, 3.75rem)`, so it sits at 32px until an 889px viewport. Assertion 4 had always tested the ceiling, so spec and test disagreed. Resolved in favour of the test, on evidence: the hero was checked on device in both modes at the 32px floor, and the contrast registers in well under a second with the light weight reading as recessive rather than fragile. The signature is a *relationship* between two weights, and that relationship survives the scale change; a rendered-size rule would also have made the same role legal on desktop and illegal on mobile, which is not a property a role can have.

**Inventory, so the count is not misread.** The home hero is **one** placement, not four: `text-lede` carries the 340, and the three `font-[720]` spans in `app/page.tsx` are load-bearing noun phrases *inside that same `h1`*. One allowlist entry covers all four declarations. Two of the three permitted placements are still unspent — the about opener and one case-study moment. The signature is currently **under**-used.

### 3.3 The ladder

| Rung | Role | Clamp | 320px | 1568px | Width |
|---|---|---|---|---|---|
| 6 | Arrival crescendo | `clamp(3.25rem, 4.8vw + 1.96rem, 5.5rem)` | 52 | 88 | 88 |
| 5 | Case-study hero | `clamp(2.5rem, 4.267vw + 1.353rem, 4.5rem)` | 40 | 72 | 88 |
| 4 | Section heading | `clamp(1.875rem, 3vw + 1rem, 3.25rem)` | 30 | 52 | 94 |
| 3 | Numbered headline | `clamp(1.625rem, 1.4vw + 1rem, 2rem)` | 26 | 32 | 94 |
| 2 | Standfirst | `clamp(1.375rem, 0.932vw + 0.959rem, 1.625rem)` | 22 | 26 | 100 |
| 1 | Body | `1.125rem` | 18 | 18 | 100 |
| 0.5 | Support | `1rem` | 16 | 16 | 100 |
| 0 | Caption / eyebrow | `0.875rem` | 14 | 14 | 100 |

Rungs 3 and 2 are the fix for the 1.03 convergence at 560px. Rung 5's clamp is retuned so its crossovers align with rung 4 at 430 and 1180; endpoints are unchanged at 40 and 72.

**Rung 6 is retuned for the same reason (corrected 6 Aug 2026).** An earlier draft of this table left rung 6 at `clamp(3.25rem, 5vw + 1.5rem, 5.5rem)`, which leaves its floor at 560 and reaches its ceiling at 1280 — crossovers rung 5 does not share. That mismatch pinches the 6/5 pair to **1.1418 at 560px**, under the R5 floor, and no change to rung 5 fixes it, because the pinch is rung 6 sitting on its floor while rung 5 climbs. Giving rung 6 rung 5's crossovers (430 and 1180) with its endpoints unchanged yields slope `(88−52)/(1180−430) = 0.048` → `4.8vw + 1.96rem`. Worst 6/5 ratio becomes **1.222**, and the 320/1568 column values in this table are unchanged.

Measured worst adjacent ratio across 320–2560 with the corrected ladder is **1.15**, set by the 3/2 pair.

### 3.4 Line-height, tracking, measure, wrap

| Rung | line-height | letter-spacing | max-width | text-wrap |
|---|---|---|---|---|
| 6 | 1.02 | −0.02em | — | — |
| 5 | 1.00 | −0.025em | — | balance |
| 4 | 1.08 | −0.02em | 30ch banded, 22ch flat | balance |
| 3 | 1.15 | 0 | 42ch | balance |
| 2 | 1.45 | 0 | 52ch | balance |
| 1 | 1.65 | 0 | 64ch | pretty |
| 0.5 | 1.5 | 0 | — | — |
| 0 | 1.5 | 0, eyebrows 0.08em | 56ch | pretty |

`balance` for anything under four lines that reads as a unit. `pretty` for multi-line body. Never both.

### 3.5 Colour

Four roles, four full-opacity values per mode. The literal oklch lives in `globals.css`; `docs/color-system.md` owns the palette and is not superseded by this document. What follows is the type system's use of it.

**Assignment by rung.** Every rung has a stated colour; none is left to judgement.

| Rung | Role | Colour |
|---|---|---|
| 6 | Arrival crescendo | `--text-primary` |
| 5 | Case-study hero | `--text-primary` |
| 4 | Section heading | `--text-primary` |
| 3 | Numbered headline | `--text-primary` |
| 2 | Standfirst | `--text-secondary` |
| 1 | Body | `--text-primary` |
| 0.5 | Support | `--text-secondary`, or `--text-muted` when the content is metadata |
| 0 | Caption / eyebrow | `--text-muted` |

All display rungs take `--text-primary`. An earlier draft left that implicit by saying "body and display," which invited per-module invention at exactly the sizes where a designer is most tempted to reach for something softer.

**Measured, not asserted.** Resolved lightness and WCAG ratio against canvas, light / dark, verified June 2026:

| Role | L | Contrast | Safe for |
|---|---|---|---|
| `--text-primary` | 0.215 / 0.945 | 15.10 / 15.72 | Body, display — AAA |
| `--text-secondary` | 0.355 / 0.825 | 9.72 / 11.21 | Standfirsts, support — **AAA** |
| `--text-muted` | 0.485 / 0.705 | 5.65 / 7.30 | Captions, eyebrows, markers — AA-normal |
| `--text-subtle` | 0.625 / 0.565 | ≈ 3:1 | **AA-large only** — never normal-size text |

`--text-secondary` was labelled AA-normal in `02-design-system.md` and in the first draft of this section. That under-claimed it: AAA for normal text is 7:1 and both modes clear it comfortably. Corrected 7 Aug 2026.

**Large text means 24px, or 18.66px bold.** WCAG's threshold is 18pt and 14pt bold; converted to CSS pixels that is 24px and 18.66px. `docs/color-system.md` stated the floor as "18px (or 14px+ bold)" in two places, which is a pt-for-px substitution and authorised `--text-subtle` six pixels below the real limit. This is the same class of error that once put `--text-subtle` on the 16px friction markers. Both occurrences were corrected in `e7892bb`; the rule stands regardless — where any two documents disagree on this figure, **24px / 18.66px is correct.**

The ramp is deliberately **not** mirrored between modes: the gaps compress differently in light and dark because each mode was tuned rather than inverted. Do not "correct" it toward symmetry.

`--text-subtle` is the one trap. It clears only 3:1, so it is valid solely for genuinely large-bold text — 24px and above, or 18.66px bold. It was once mapped to the 01/02/03 friction markers at 16px/600; that undershot AA-normal at the mobile end and was corrected to `--text-muted`. Any normal-size text that carries meaning takes `--text-muted` or stronger.

**The authoring rule: mix to author a token, never to apply one.**

A `color-mix` that produces a named token in the theme layer is legitimate. A `color-mix` appearing at the point of use on a `color:` property is a weight-fake — it approximates a lighter role by thinning an existing one, reads dimmer than the doc-validated token, and undershoots the contrast floor it appears to satisfy. Reach for the semantic role that already exists rather than nudging opacity until it looks right.

Four reasons this is a rule and not a preference:

1. **Contrast stops being computable.** An alpha value's effective ratio depends on its backdrop, so the same declaration passes on the canvas and fails on `--surface-elevated`. A full value has one ratio, verified once.
2. **Alpha compounds.** `currentColor`-based alpha inherits, so a muted caption inside a muted block double-mutes.
3. **It breaks the two-mode principle.** 60% black on white and 60% white on black are not perceptually equivalent; one ramp forces one mode to be wrong. Light and dark are first-class designs here, which is structurally incompatible with a single alpha ramp.
4. **It undershoots.** Every time.

This repo proved the point before the rule was written. From `globals.css`: *"A token step, not opacity. opacity:0.88 made the whole button translucent."*

**Where alpha remains correct**, and is not covered by this rule: state layers (hover, press), scrims, shadows, and focus rings. Those are surfaces and effects, not type colour. Ten oklch alpha values ship today across focus rings and shadows; all are legitimate.

**Sitewide status, verified 7 Aug 2026:** zero alpha on text colour, zero `rgba`/`hsla` anywhere, zero Tailwind alpha utilities (`text-*/50`) in JSX. Sixteen `currentColor` mixes remain on borders and backgrounds — out of scope for this section, since they are not type colour, but they bypass `--border-*` tokens in roughly a third of cases and are queued for their own pass.

**Dark mode is unresolved on one point** and §9 records it: light text on a dark ground gains optical weight, so a given weight is not the same gesture in both modes. This matters most to the 340/720 signature. Nothing depends on the answer; the pair was checked on device at 32px in both modes and reads in under a second either way.

---

## 4. The rules

**R1** Never pin optical size. Two sanctioned exceptions, §6.

**R2** Width is determined by the rung. Three values, no per-module choice. There is no mood register; if you want contrast, use weight.

**R3** Weight carries expression. The 340/720 signature is limited to three placements and to type at 40px and above.

**R4** Emphasis is authored: `strong, b { font-weight: 600 }` in the base layer. Never inherit Tailwind preflight's `bolder`, which resolves to 700 and makes 18px body the heaviest thing on the page.

**R5** Adjacent rungs stay ≥1.15× apart at every viewport from 320 to 2560, **and adjacent rungs share crossover viewports**. The shared crossovers are the mechanism; the ratio is the test. The 1.15 figure is fitted to the current ladder rather than derived from perception, and the document says so on purpose.

**R6** One mark, one rendering. `.thread-index` declares its own width so it cannot inherit from whatever heading it sits inside.

**R7** Colour comes from tokens.

**R8** `font-variation-settings` overrides the high-level properties **per axis, regardless of source order**. An axis not named in the string still obeys its standard property. FVS inherits as a string, so any descendant of an FVS rule is pinned and cannot be re-weighted — prefer standard properties for anything with children. Delete the "FVS LAST, do not reorder" comments; they encode a superstition.

**R8 states the invariant: one axis, exactly one place.** Naming an axis in the string *and* setting its standard property is not belt-and-braces, it is a dead token — the string wins, so the property reaches no pixel and any variable feeding it can be changed without effect. The string carries only what no standard property can express, which today means `opsz` and nothing else: `font-optical-sizing` is `auto | none` and cannot pin a value, which is the whole reason §6 sanctions the `.milestone__date` pin. `wght` belongs on `font-weight` and `wdth` on `font-stretch`. The one place a width legitimately stays inside a string is a §6 exception surface that already needs the string for `opsz` and whose widths are deliberately outside the three bands — `.text-qh-title`, where moving them to `font-stretch` would misreport them to check 1 as ordinary type. Amended 21 Aug 2026, when ruling 5's own selector was found carrying both `wght` and `wdth` twice over.

**R9** The system must degrade when the axes are absent. The `next/font` fallback is Arial-based with no `wdth` and no `opsz`, so during the swap period and permanently on a blocked CDN every width distinction collapses. Anything that matters must also be carried by size, weight, or colour. This is a second reason the signature is a weight contrast.

**R10** No compression at reading size. The 12pt master exists to open counters; compression closes them.

**R11** No axis animation. Already banned in `CLAUDE.md`; restated because "axes" invites it.

---

## 5. What changes on the shipped pages

| Selector | Now | v3 | Why |
|---|---|---|---|
| `.hero-block__sentence--open` / `--anxious` | 100 / 88 | **88 / 88** | Rung 5 is the large-display band. The clause split retires with ruling 1 |
| `.case-study-prose h2` | 96 | **94** | Rung 4 display band |
| `.friction-beat__headline` | 94 | 94 | No change |
| `.resolution-block__headline` | 94 | 94 | No change |
| `.milestone__date` | 520 / 100 | **600 / 88** | Ruling 5, on `font-weight` and `font-stretch` |
| `.bento-theme__lead` | 92 | **100** | 18px is a reading rung |
| `.text-cover` | 90 | **94** | Rung 3/4 display band. Card covers loosen by 4% |
| `.text-statement` (home) | 96 | **88** | Large display band |
| `@utility text-hero` | 97 | **88** | Large display band |
| `.wordmark` (16px) | 88 | **100** | Reading rung. Site chrome, every page |
| `.hero-block__callout-label` (14px) | 90 + opsz pin | **100**, pin deleted | R10, and the pin reproduces `auto` |
| `.hero-block__callout-body` (18px) | opsz pin | pin deleted | Reproduces `auto`, and pins descendants per R8 |
| prose `strong` | 700 unowned | **600 authored** | R4 |
| `.thread-index` | inherits | **pinned 100** | R6 |
| Rungs 3 and 2 clamps | converge at 1.03 | **hold at 1.15** | R5 |
| `## Role` | rung 4 heading | unchanged, now at 94 | Ruling 6 |

Five rules currently ship below the 14px floor and must be raised or deleted: `.mode-pair__label`, `.asymmetric-pair__label`, `.bento__label`, `.small-multiples__label` (11.2px) and `.compare__label` (12px).

---

## 6. Exceptions

**Optical-size pins (R1).** Two survive. `.milestone__date` pins `opsz` 96 because at 52–88px that is a real 44-unit push and it is the one place the drawn display cut appears. `.text-qh-title` pins per-module because it belongs to an exception surface, below. Every other pin is deleted.

**Exception surfaces (ruling 7).** Two surfaces are governed by their own rules rather than by §3:

- **Also Shipped.** Per-brand three-axis variation, `wdth` 84–100, `wght` 500–650, `opsz` 14–48. The four blocks are a curated set; their variation is the content. Bounded by: the 14px floor still applies, `wdth` may not go below 84, and each block's values are declared once in `data-brand` rather than authored ad hoc.
- **The takes wall.** Slot-driven marks at `wdth` 78–82 with per-take FVS compositions. Currently unmounted — verified 6 Aug 2026: nothing under `app/` imports it. Bounded by: the 14px floor applies, and any new composition must be added to the lint allowlist with a one-line reason.

  Two discrepancies to reconcile **before it is ever mounted**, not now. As built it reaches wider than this section states: `.take-thought` sits at 96 and `.comp-statement .take-thought` at 98, and the watermark and word-swap compositions use `wdth` 90 and 92. The 78–82 range describes the marks only. And `.take-thought` is running prose, which collides with the rule below that neither exception surface may set type read in sentences. Allowlisting the surface in C1 records these as known, not as resolved.

Both surfaces are display-only. Neither may set type that is read in sentences.

---

## 7. Enforcement (ruling 8)

`npm run lint:type`, beside the existing `lint:prose`. Parses `app/globals.css` and fails the build on:

1. Any `font-stretch` or FVS `wdth` outside {100, 94, 88} — excluding allowlisted exception surfaces.
2. Any `font-size` below 14px.
3. Any adjacent rung pair dropping below 1.15× anywhere in 320–2560, computed from the clamps.
4. Any `font-weight` of 340 or 720 on a role whose ceiling is under 40px, or outside the three allowlisted signature placements.
5. `strong` with no authored weight.
6. Any `color: color-mix(… currentColor …)`.
7. Any `font-variation-settings` outside the allowlist.
8. **8a, static.** `app/fonts.ts` declares `axes: ['opsz','wdth']`. This repo shipped the bug once: with those axes absent, every `font-stretch` and optical-sizing rule was silently inert in production. Lint-time and deterministic.
9. **8b, runtime.** A client-side probe that the variable font actually loaded, because every width decision in this document is invisible in the Arial fallback. Not checkable by a CSS parser; it is app code.

Assertion 4 has two halves and both are enforced: a weight of 340 or 720 fails if the role's ceiling is under 40px, **and** fails if the placement is not one of the three allowlisted signature uses.

**Two things this lint cannot see, and both must be reported rather than passed silently.** First, a `globals.css`-only parser cannot see arbitrary weight utilities authored in JSX (`font-[720]` in `app/page.tsx`); until the scan is extended in C4, the script prints the count of unchecked JSX weight utilities. Second, a width driven through a CSS variable is unresolvable at parse time — `.text-qh-title` sets `wdth` via `var(--qh-wdth, 100)`, so check 1 skips it and the Also Shipped surface is effectively invisible to the width rule. Neither gap is a failure; both are blind spots, and a blind spot that prints is a known limit while a blind spot that doesn't is a false pass.

Every allowlist entry carries a one-line reason. Run against `main` today, **eight of the nine fail** — only 8a passes, and it passes because the axes bug was already found and fixed. That makes the test the migration checklist: each rule lands in its own commit that turns one assertion green.

---

## 8. Anti-patterns

A fourth width value for one module. Compressing type at 14–18px. Forcing `opsz` 96 on a 26–32px headline. Weight below 400 under 40px. The signature pair used more than three times. Trusting a width difference that is never co-visible to carry meaning. Animating any axis.

---

## 9. Still open

These were not on the decision list and remain unspecified: the about page (`.about-phase h2` at 36.4px sits between rungs 3 and 4; `.about-row__company` at 25.2px/500 is off-ladder), and all type states — hover, focus, visited, disabled, `forced-colors`, `prefers-contrast`, and print. Dark mode has no stated position on optical weight gain against a dark ground.

**Nav, footer, buttons and card meta moved to `unspecified-surfaces.md`** (8 Aug 2026). They appeared in this §9 *and* in the spacing system's, which makes them one piece of work rather than two.

**200% zoom is no longer open — the spacing system measured it** (8 Aug 2026). At a 32px root, vertical spacing scales +61% and the horizontal gutter holds flat at 0.0%, verified in that migration's QA. This document previously listed 200% zoom as unspecified while the neighbouring system had a tested position on the same behaviour, which is two specs disagreeing about one thing. Type has no further position to state: the ladder is `rem`-anchored throughout, so it scales with the root by construction.

**Six shipped selectors have size ceilings that sit on no rung** (found by the C0 harness, 6 Aug 2026). §3.1 assigns width by rung, so for these it returns nothing:

| Selector | Ceiling | Width in C1 | Basis |
|---|---|---|---|
| `.text-statement` | 96px | 88 | §5 states it |
| `.text-hero` | 80px | 88 | §5 states it |
| `.transformation` | 76px | 88 | Inside the 72–88 large-display span |
| `.case-study-prose > h1` | 76px | 88 | Inside the 72–88 large-display span |
| `.text-lede` | 60px | unchanged at 100 | Already in-band; band undecided |
| `.pull-quote p` | 56px | unchanged at 94 | Already in-band; band undecided |

The first four take 88, so C1 is unblocked on those. The last two are different: 60px and 56px sit in the **53–71px gap** between the display and large-display bands, so §3.1 genuinely returns nothing — but both already hold a legal value, so check 1 is satisfied and no edit is forced. They stay as literal percentages rather than being tokenised, because tokenising them would encode a banding answer being deliberately deferred. `.text-lede` is the home `h1`, the most visible type on the site; it deserves to be decided against real content rather than by rounding to the nearer band.

Their **sizes** are the open question in every case. `.text-statement` at 96px is larger than rung 6's 88px ceiling, meaning the home statement currently outranks the top of the ladder. Whether these six join the ladder, or the ladder grows to hold them, is unresolved. Nothing in the migration depends on the answer.

None of these block the migration. All of them block calling the system complete.
