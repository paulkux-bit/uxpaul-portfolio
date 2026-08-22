# The uxpaul.com type system — v3, locked

Decided 5 Aug 2026 from rendered options. This document supersedes v1 and v2. Where a value here disagrees with `docs/typography-system.md` or the Typography section of `CLAUDE.md`, this document wins, and those two must be updated in the same commit that adopts it.

> **Amended 22 Aug 2026 for the Commissioner migration. This is still v3.**
>
> **No ruling was overturned. Four changed mechanism.** The typeface changed from
> Bricolage Grotesque to Commissioner, which has a `wght` axis and a `FLAR`
> (flare) axis and **no `wdth` and no `opsz`**. Every rule that rode width or
> optical size therefore describes an axis that no longer exists, and each is
> marked below rather than deleted — the reasoning is still the record of why the
> system is shaped as it is.
>
> Amendments are marked **AMENDED 22 Aug 2026** inline. §10 is new and holds the
> material that had no home in the v3 structure: the Phase 1 judgment rulings
> verbatim, the band/voice split, and the 52px flare cut.
>
> Sequenced as C1–C6 on `type-system-v4` (a branch name, not a document version).
> `docs/type-system-v3-migration-plan.md` records the earlier C0–C8 adoption.

---

## The rulings

| # | Decision | Ruling |
|---|---|---|
| 1 | What carries meaning | **Width follows size. Weight carries mood.** — *mechanism changed: **voice** follows size; there is no width* |
| 2 | Width vocabulary | **Three bands, assigned by rung.** 100 reading, 94 display, 88 large display — *retired with the axis; §10's flared/plain replaces it* |
| 3 | The signature | **The 340/720 weight contrast, three reserved uses sitewide** — *confirmed unchanged, and measured* |
| 4 | Step ratio floor | **1.15**, numbered-headline floor raised to 26px — *unchanged; the ladder is pure `font-size` arithmetic and is font-independent* |
| 5 | Milestone date | **600 at width 88**, on the standard properties. One axis, exactly one place — *mechanism changed **twice in one migration*** |
| 6 | Case-study close | **`## Role` stays a heading** |
| 7 | Also Shipped and takes wall | **Named exception surfaces** with their own written rules |
| 8 | Enforcement | **`npm run lint:type`** — *unchanged in principle, 10 checks not 9* |

**AMENDED 22 Aug 2026 — what each mechanism change means.**

**Rulings 1 and 2: voice follows size, not width.** Ruling 1's shape survives — one property is assigned by the rung and another carries expression — but the assigned property is now the FLAR axis rather than width, and it takes two values rather than three. Ruling 2's three bands describe an axis Commissioner does not have. §3.1 is kept as the record of how the bands were derived and is no longer implementable.

**Ruling 3: confirmed unchanged, with numbers.** The 340/720 pair survives verbatim, and the ink measurement says it survives *louder*: rendered dark-pixel ratio at the pair is **1.634 in Bricolage and 1.851 in Commissioner** — the contrast is 13% stronger, not weaker. No renumbering, no 360. Paul judged 340 at 88px on the bench as *"thin by design"* and the `g` at 720 as *"holds fine"*, which retires the feasibility study's clumsy-counter objection at the weights actually used.

**Ruling 5's mechanism changed twice in one migration, which is itself the finding.** Phase 0b moved the milestone date's axes off the `font-variation-settings` string and onto the standard properties, exactly as the ruling requires. C3 then deleted two of the three properties it had just been moved onto, because `font-stretch` and `font-optical-sizing` no longer address anything. **The ruling — one axis, exactly one place — is what survived both moves.** The place it names is the thing that kept changing. A ruling written about a mechanism would have died here; this one was written about an invariant.

---

## 1. The system in one paragraph

One typeface, three axes, three jobs, and only one of them is a design decision. **Optical size runs itself** — never pinned outside the two sanctioned exceptions. **Width is a function of the rung** — three values, assigned automatically, never chosen. **Weight carries hierarchy and expression** — and the 340-against-720 contrast is the site's signature, spent deliberately in three places. Size is a fluid ladder of seven rungs above a fixed 18px body, and adjacent rungs never come closer than 1.15× at any viewport from 320 to 2560.

**AMENDED 22 Aug 2026.** One typeface, **two** axes, and the shape of the paragraph above survives the swap because only its nouns changed. **Optical size is gone** — Commissioner has no `opsz`, so it cannot be pinned and both sanctioned exceptions retire. **Voice is a function of the rung** — the FLAR axis, **two** values rather than three, assigned by the size ceiling and never chosen per module. **Weight still carries hierarchy and expression**, and the 340/720 signature is unchanged. **The ladder is untouched**: it is pure `font-size` arithmetic, so it is font-independent by construction — an assertion that was the largest untested thing in the feasibility study and that Paul confirmed by eye on the bench (*"hierarchy seems good"*).

---

## 2. Foundations

Bricolage Grotesque, variable, all three axes loaded (`opsz` 12–96, `wdth` 75–100, `wght` 200–800). No second typeface. No italics; `em` maps to weight 600 in the base layer.

Hard constraints: **14px floor** everywhere. **18px body** at every viewport. **`font-optical-sizing: auto`** globally. **Text colour from `--text-*` tokens only** — no `color-mix` on `currentColor`, no legacy `--color-text-*` aliases.

**AMENDED 22 Aug 2026 — Commissioner, self-hosted, subset and instanced in the repo.**

`app/_fonts/commissioner-latin.woff2`, built by `scripts/build-commissioner-font.sh` from Kosta Bartsokas's v1.012 variable roman. **Two axes: `wght` 340–720 and `FLAR` 0–100.** `VOLM` is **absent from the binary, not pinned**, on ruling 4c — Paul could not see its difference at the crescendo, and an axis that is not shipped cannot fail silently, which is the one blind spot check 8b could never cover. `wdth` and `opsz` do not exist in this typeface at all.

Instanced with `usWeightClass` 400 as the default, because the source font defaults to 100 and would set hairline in anything that did not name a weight explicitly. **55.5 KB against Bricolage's 126.1 KB — 56% lighter.**

Self-hosted rather than taken from Google Fonts for a specific reason: **Google's v1.001 does not carry the `case` feature**, and v1.012's 37 `case` substitutions are what fix the middot and hyphen in the case-study eyebrows.

**Still no italics, and now it matters more.** The designer ships italic as a *separate binary* which is not in `app/_fonts/`, so a synthesized oblique would be a mechanical shear of roman outlines with wrong stem weights on the diagonals. `html { font-synthesis: none }` makes that impossible rather than merely discouraged; `em` maps to weight 600 as before.

The hard constraints all stand, except that **`font-optical-sizing: auto` is deleted** — it addressed nothing and 49 inert `font-stretch` declarations beside it were deleted in the same commit.

---

## 3. Tokens

### 3.1 Width — three bands, assigned by rung

> **RETIRED 22 Aug 2026. Commissioner has no `wdth` axis.** Kept in full because
> the *shape* of the answer is what §10's flared/plain inherits: a property
> assigned by the rung's ceiling, never picked per module, with a lint check
> failing the build on a fourth value. The three tokens, all 49 `font-stretch`
> declarations and check 1 were deleted in C3; **check 10 replaces check 1 and
> fails the build on `font-stretch` or `font-optical-sizing` at any value**,
> because 49 declarations that looked correct while addressing nothing for a day
> is exactly the class that needs a gate rather than a convention.

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

**AMENDED 22 Aug 2026 — rung 5 corrects to −0.020, and the spec yields to the CSS.**

The table says rung 5 tracks at −0.025em. The shipped CSS had `.hero-block__sentence--open` at −0.025 and `.hero-block__sentence--anxious` at **−0.020**, which read as the CSS having drifted from the spec. It is the other way round: **`--anxious` was accidentally right.**

The two clauses are a **natural experiment** and that is why this reverses the usual direction. They are the two halves of one headline — same rung, same rendered size, same weight, adjacent on screen and co-visible in a single glance. The only variable is the tracking. Rendered side by side in Commissioner, **only the −0.025 half read as crowded**. Nothing else about the comparison could have produced that, which is a stronger warrant than a spec value carried over from a typeface with different sidebearings.

So the value moves to **−0.020 for rung 5**, `--open` was corrected to match `--anxious`, and the record says `--anxious` was never a drift.

**The convention inversion persists and is not fixed here.** Rung 6 tracks at −0.015 and rung 5 at −0.020, so the *larger* type is the *looser* — the opposite of the usual rule that tracking tightens as size grows. Rung 6's value was set on eye alone and holds on eye. Naming it rather than quietly correcting one of them: both were judged against rendered type and neither is wrong on its own terms. The inconsistency is between them, and resolving it needs a bench, not an edit.

**AMENDED 22 Aug 2026 — the measure column now names the typeface, because `ch` is font-relative.**

`ch` is the advance of the "0" glyph **in the font that renders**. Every `ch` value in the table above silently changed meaning on 21 August while this document read identically. Measured at 1440 on the governed elements:

| authored | governs | `1ch`, Bricolage | `1ch`, Commissioner | measure | Commissioner ≈ chars |
|---|---|---|---|---|---|
| 30ch | `.cs-section h2` @52px/600 | 0.5820em | **0.6605em** | 908.1 → 1030.5px, **+13.5%** | **≈ 44.9** |
| 22ch | `.case-study-prose h2` @52px/600 | 0.5820em | **0.6605em** | *never wins* | ≈ 33.0 |
| 64ch | prose `p` @18px/400 | 0.6484em | **0.6519em** | 747.0 → 751.7px, +0.6% | **≈ 93.9** |
| 52ch | `.section-lede` @26px/400 | 0.6424em | **0.6520em** | 869.2 → 882.2px, +1.5% | ≈ 76.3 |
| 56ch | `.figure__caption` @14px/400 | 0.6507em | **0.6518em** | 510.6 → 511.6px, +0.2% | ≈ 83.9 |

**The display measure grew 13.5% while body moved 0.6%**, and the asymmetry is the whole story: Bricolage's h2 rendered at `wdth` 94 and Commissioner's renders at its only width. Anything budgeted in characters against the old display measure is now budgeting against a **45% larger** allowance.

**The character column is derived and its basis is stated, because "≈ N characters" is sample-dependent.** Mean glyph advance measured across **every governed element on all five routes** — the site's own alphabet mix, not a synthetic pangram — giving a ratio of 0.6605 / 0.4408 = 1.498 at 600 and 0.6519 / 0.4445 = 1.467 at 400. Derived independently by Paul as 44.9 / 32.9 / 94.0; the two agree to within rounding, which is the only reason either is written down.

**22ch never wins.** `.case-study-prose h2` is beaten on all 8 `h2`s by `.cs-section h2`'s 30ch. The "30ch banded, 22ch flat" split in the table above describes an intent, not a rendering. Found by `scripts/measure-ch.mjs`'s never-wins pass, which exists precisely to keep a live-but-overridden rule from reading as absent.

**This is the second typeface and there will be a third.** The table is written per-face so the third does not have to rediscover that `ch` is not a unit of characters.

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

**AMENDED 22 Aug 2026.**

**R2 — mechanism changed, invariant intact.** "Width is determined by the rung" becomes **voice is determined by the rung**, on the same terms: assigned by the size ceiling, never a per-module choice, gated by a check. Two values instead of three. The clause that mattered — *if you want contrast, use weight* — is unchanged and is now the only option rather than the preferred one.

**R8 → R8', and it is finally checkable in one line.** R8 stands as written and its reasoning is unchanged; what changed is that it can now be enforced rather than remembered:

> **R8'** — **Exactly one `font-variation-settings` declaration exists in shipped CSS, and it is on the universal selector.** `* { font-variation-settings: 'FLAR' var(--flar, 0) }`. Any second declaration fails the build.

Check 7 used to police an allowlist of FVS strings, which is an inventory and therefore something to maintain. One declaration in one place is an invariant, and an invariant is cheaper to keep true than a list. R8's original point — that a string pins every descendant per axis regardless of source order — is what makes this the only safe shape once every element must resolve the axis.

**The declaration is on `*` and not on `:root`, and that is not a style choice.** Custom properties substitute at computed-value time **on the element whose declaration matched**, so `:root { … var(--flar) }` resolves to the literal `"FLAR" 0` *before* inheritance and descendants inherit a finished string with no `var()` left to re-resolve. Measured on the C3 build, setting `--flar: 100` on a descendant:

```
declaration on :root    delta  0.00px    computed "FLAR" 0
declaration on *        delta 27.20px    computed "FLAR" 100
```

**R8b, new — `font-feature-settings` behaves exactly like `font-variation-settings`, and for the same reason.** It inherits **as a string** and overrides **per feature regardless of source order**. R8's logic was never specific to the variations property; it was about how a settings string composes.

> Prefer `font-variant-*` wherever a standard property exists — `font-variant-numeric: tabular-nums` over `'tnum' 1`, and the site uses it in six places. Reach for the settings string only when no property expresses the feature, and **only on a leaf**, because a container pins its whole subtree's feature set.

**One instance, unguarded, and stated rather than left to be found.** `.hero-block__eyebrow { font-feature-settings: 'case' 1 }` is the only settings string on the site. No lint and no runtime assertion covers it. C4 accepted that on the grounds that one declaration on one leaf does not earn its own instrument, **on the stated condition that a second surface would change the calculus**. C6a proposed a second surface — the Also Shipped wordmarks — and rejected it on measurement (§6), so there is no second surface and the guard is not owed. If one ever arrives, the guard is owed then.

**R9 — the degradation is now written into the CSS rather than promised by the prose.** The `, 0` fallback in `var(--flar, 0)` is R9 made mechanical: on an engine without `@property` support an unregistered `--flar` is a guaranteed-invalid value and `var(--flar)` would be invalid at computed-value time on an inherited property. The fallback degrades to the plain voice instead of to an undefined one.

R9's original argument is also **stronger** now, not weaker. It said anything that matters must be carried by size, weight or colour, because the Arial-based `next/font` fallback has no `wdth`. It has no `FLAR` either. **This is why the signature is a weight contrast and why the flare is a texture rather than a hierarchy signal** — the flare vanishes during the swap window and on a blocked CDN, and nothing on the site depends on it being there.

**R10 RETIRES.** "No compression at reading size" governs an axis that does not exist. There is nothing left to compress, and no way to compress it.

**R1 retires with it** — see §6. Optical size cannot be pinned because there is no `opsz`.

**R11 stands and covers the new axis.** FLAR is an axis; animating it is banned exactly as `wght` and `wdth` were.

---

## 5. What changes on the shipped pages

> **HISTORICAL as of 22 Aug 2026.** This table was the v3 adoption checklist and
> every row of it landed. Fourteen of its sixteen rows are `wdth` or `opsz`
> values that no longer address anything and were deleted in C3 — the table is
> the record of the migration *into* the width system, kept because the reasons
> in its "Why" column are why the rungs are shaped as they are. Do not implement
> from it. The rows that still describe live CSS are prose `strong` at 600 (R4)
> and the rungs 3/2 clamp separation (R5).


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

**AMENDED 22 Aug 2026.**

**Both sanctioned optical-size pins retire (R1 with them).** `.milestone__date` pinned `opsz` 96 and `.text-qh-title` pinned per-module. Commissioner has no `opsz` axis, so neither pin addressed anything from the moment the binary shipped, and both were deleted in C3. **This is the second time in one migration that ruling 5's mechanism moved** — see the rulings table.

**Also Shipped — "the variation IS the content" re-derived, not deleted.**

The claim stands. What carried it does not. The four blocks were separated on **three** per-brand axes through `data-brand`:

| | `--qh-wdth` | `--qh-wght` | `--qh-opsz` |
|---|---|---|---|
| lionsgate | 90 | 600 | 40 |
| red-cross | 96 | 500 | 14 |
| bbc | 84 | 650 | 48 |
| k-hovnanian | 100 | 540 | 24 |

**Two of the three axes do not exist in Commissioner**, and C3 deleted the FVS string that drove them. `--qh-wght` (500–650) and the per-brand colour are what remain.

**FLAR was considered as the replacement and ruled out on size, not on taste.** `text-qh-title` is `clamp(1.75rem, 1.5vw + 1.25rem, 2.25rem)` — 28px at 390, 31.5px at 768, **36px at 1440 and at its ceiling**. That is below the 40px which §10's cut leaves plain and 16px under the cut itself. Adding per-brand FLAR here would have been inert-but-plausible CSS, the class C3 deleted 49 declarations of, invisible in the file and obvious on the page.

**So the surface was put in front of Paul as it stands, and he ruled that the four still read as four.** This is therefore a **language correction, not a defect**: the sentence "their variation is the content" is true, and the content is now weight and colour. The bound stays — the four values are declared once in `data-brand`, never ad hoc.

`--qh-wdth` and `--qh-opsz` are still declared in the four blocks and consumed by nothing. Removing them is a question about the Also Shipped shelf; it is filed in `docs/unspecified-surfaces.md` rather than answered here.

**The takes wall's discrepancies resolve by deletion rather than reconciliation.** Its `wdth` 78–82 marks, the 96/98 outliers and the 90/92 compositions all went with the axis; 16 `font-stretch` declarations on the unmounted wall were deleted in C3. The remaining bound — 14px floor, allowlist entry with a reason for any new composition — stands, and the collision between `.take-thought` as running prose and "neither surface may set type read in sentences" is **unresolved and still owed before it is ever mounted**.

**REJECTED 22 Aug 2026 — `case` on the Also Shipped wordmarks.** Recorded with its measurement so it is not proposed a third time.

The proposal was that the period in "K. HOVNANIAN" sits low against caps, the same defect the eyebrows had. **It is not the same defect.** Commissioner's `case` feature substitutes 18 glyphs in the shipped subset — `periodcentered bullet hyphen endash emdash ( ) { } [ ] « » ‹ › @` and two combining marks — and **`period` is not among them, deliberately**: a full stop is baseline-anchored in both cases, so there is nothing to raise. What C4 fixed on the eyebrows was the *middot* in "BARD · U.S. COAST GUARD" and the *hyphen* in "FDT-E". Neither appears in any wordmark.

Rendered rather than read out of the table, toggling the declaration on the element at 1440 and 1920:

```
[data-brand="k-hovnanian"] .qh-brand   14px
   ink 1624 -> 1624   +0.00%      diff 0.000% of pixels   noise floor 0.000%
   set 116.422 -> 116.422px       +0.0000%
```

**REJECTED 22 Aug 2026 — taking the arrows from the typeface.** Commissioner ships U+2190–2193 and they are in the subset, unused. Both site arrows are `lucide-react` SVG nodes (`ArrowRight` on `/about`'s work band, `ArrowDown` on `.about-btn`); `case-study-card.tsx` renders none at all, because the whole card is the affordance.

They are governed by the **interaction** system, not this one: `--icon-stroke` is tuned per surface against the adjacent label's weight and `lint:interaction` check 6 validates every value. **A text glyph has no stroke.** Moving them into the typeface would take them out of a governed system and into one where their weight is a side effect of the ancestor's `font-weight` and `--flar`. That is a governance regression independent of how they look, so no optical measurement was run — measuring a ruled-out option is work the answer cannot change. `globals.css` also records that they *were* glyphs and were deliberately migrated out.

**With those two, the "what else can Commissioner do" list closes at nothing**, with a reason for each: `tnum` unnecessary (`font-variant-numeric` already covers the six places that need it), `ss01` inconsistent, italic deliberately absent, `case` inert on the only proposed second surface, arrows already migrated out on purpose.

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

**AMENDED 22 Aug 2026 — ten checks, and the numbering is a record rather than a sequence.**

| # | Asserts |
|---|---|
| 2 | No `font-size` below 14px |
| 3 | Adjacent rungs ≥ 1.15× across 320–2560 |
| 4 | The 340/720 signature: ceiling ≥ 40px **and** an allowlisted placement |
| 5 | `strong` has an authored weight |
| 6 | No `color-mix(… currentColor …)` on text colour |
| 7 | **R8'** — exactly one FVS, on `*`, reading `--flar` |
| 8a | `app/fonts.ts` is wired to a local font file that exists |
| 8b | A runtime assertion that the variable font loaded |
| **10** | **No `font-stretch` and no `font-optical-sizing`, at any value** |
| **11** | **The flared set in CSS matches `RUNGS`' `voice: 'flared'`, both directions** |

**Check 1 became check 10 rather than being edited, and 11 is new.** Numbers are not reused: each one is a claim with a history, and a reader who finds "check 1" in a commit message from 7 August should not be sent to a rule about something else.

**Check 10 is stronger than the rule it replaces.** Check 1 policed *which* width values were legal. Check 10 says there is no legal one. Inert-but-plausible CSS is the class 8a was created for and the class C3 deleted 49 instances of — declarations that looked correct while addressing nothing, for a full day, with every gate green.

**Check 8a no longer asserts the `axes` array**, because `next/font/local` has no such option and there are no optional axes left to omit. It asserts the file exists at the path `app/fonts.ts` names — the same failure it always guarded, moved to where the failure now lives.

**Check 8b's blind spot is gone, because the axis is gone.** 8b probes that a real webfont loaded rather than the metric-matched fallback. It could never have caught `VOLM` at 100 with `FLAR` at 0, which renders identically to nothing and throws nothing. **`VOLM` is absent from the binary** on ruling 4c — not shipped, not pinned. **An axis you do not ship cannot fail silently.** The gap closed by subtraction rather than by a new assertion, which is the cheaper of the two fixes and the one worth noticing.

**A check that has never failed has never been tested.** Checks 10 and 11 were both driven red on purpose before being trusted — 11 in both directions, and its DOM counterpart separately.

**And check 11 is only half the question, by construction.** It compares two lists; it cannot know whether either names a real element. That is a DOM question and this is a CSS parser. **`scripts/assert-bands.mjs`** answers it — every flared selector matches ≥ 1 element and computes 100, every plain one matches ≥ 1 and computes 0, and seven reading surfaces compute 0 as a leak detector. It needs a running server, so it gates the commit by being run rather than by `npm run build`. It exists because the Commissioner bench kept a hand-written band list beside `RUNGS` that named a class which does not exist and omitted the only live rung-5 element, so **rung 5 rendered no flare for an entire judgment session while every gate stayed green.**

**Two things this lint cannot see, and both must be reported rather than passed silently.** First, a `globals.css`-only parser cannot see arbitrary weight utilities authored in JSX (`font-[720]` in `app/page.tsx`); until the scan is extended in C4, the script prints the count of unchecked JSX weight utilities. Second, a width driven through a CSS variable is unresolvable at parse time — `.text-qh-title` sets `wdth` via `var(--qh-wdth, 100)`, so check 1 skips it and the Also Shipped surface is effectively invisible to the width rule. Neither gap is a failure; both are blind spots, and a blind spot that prints is a known limit while a blind spot that doesn't is a false pass.

Every allowlist entry carries a one-line reason. Run against `main` today, **eight of the nine fail** — only 8a passes, and it passes because the axes bug was already found and fixed. That makes the test the migration checklist: each rule lands in its own commit that turns one assertion green.

**AMENDED 22 Aug 2026 — the JSX blind spot is now measured rather than merely declared.** The script strips comments before scanning, because `app/page.tsx`'s own doc-comment mentioning `font-[720]` was being counted as a fourth utility. It reports **6 arbitrary weight utilities, 3 live and 3 in sandbox routes**. The width blind spot retires with the width rule: there are no `wdth` values left to be invisible.

---

## 8. Anti-patterns

A fourth width value for one module. Compressing type at 14–18px. Forcing `opsz` 96 on a 26–32px headline. Weight below 400 under 40px. The signature pair used more than three times. Trusting a width difference that is never co-visible to carry meaning. Animating any axis.

**AMENDED 22 Aug 2026.** The first three describe axes that no longer exist and are unreachable rather than forbidden. **The rest survive, and one generalises.** "Trusting a width difference that is never co-visible to carry meaning" is really *trusting any difference that is never co-visible*, and it is why the 52px flare cut was possible to make at all: flare at 32px is measurably present (§10) and carries nothing, because nothing sits beside it to be compared against.

**Three new ones, each paid for.**

- **A third value on the voice axis.** 0 and 100 are the only stops anyone has judged. An intermediate FLAR is a number nobody has seen, and reaching for one to rescue a surface is picking by eye inside a system built to stop that.
- **A declaration that addresses no axis, feature or property the shipped font has.** C3 deleted 49. Check 10 now fails the build on the width case; the general case is a habit, which is why the `case` and arrow proposals were measured before being applied rather than after.
- **Two keys where one is authoritative, or one key answering two questions.** Both produced real defects here: the bench's hand-written band list beside `RUNGS`, and `band` deciding both what type *is* and what it *gets*. See §10.

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

**AMENDED 22 Aug 2026 — the six are now half-answered, and the halves are different questions.**

Their **width** column is void: four of the six took 88 and none of them can. Their **rung** is still open, and still waits on real content — two of the five case studies are unwritten.

But **voice is a separable and narrower question** — display type or reading type — and it is answerable now without constraining the rung answer later. So every one of the six has a voice, recorded in `RUNGS` with `rung: null` written explicitly rather than by omission, because an explicit null is visibly open and an absence is invisible:

| Selector | Ceiling | Voice | |
|---|---|---|---|
| `.text-statement` | 96px | flared | renders nowhere — conditional |
| `.text-hero` | 80px | — | used by no component; still unruled |
| `.transformation` | 76px | plain | **has no `font-size` of its own** |
| `.case-study-prose > h1` | 76px | — | matches nothing; still unruled |
| `.text-lede` | 60px | flared | live, the home `h1` |
| `.pull-quote p` | 56px | — | not in the map |

**`.transformation` produced a small finding of its own.** It is a grid *container* with no `font-size`, so it has no ceiling for the cut to be applied to. Having no size is an independent reason it was never display type, and `plain` is a safe value rather than a derived one.

**And `.about-phase__title` / `.about-hero__pov` joined the list and left it.** §9 never mentioned either — not in §3.3's ladder, not in §5's table, not in the six above. Both were banded on function on 21 Aug and voiced on 22 Aug, and **the two rulings diverge**: the POV line at 51.2px is flared, the phase titles at 36.4px are plain. Their rung stays open. See `docs/unspecified-surfaces.md`.

**Still open and untouched by this migration:** all type states (hover, focus, visited, disabled, `forced-colors`, `prefers-contrast`, print), and dark mode's position on optical weight gain against a dark ground. The last of those is *more* pressing now, not less — the ink measurement found Commissioner's 340 carries **4.3% less ink** than Bricolage's at the same token, which is what broke the mobile signature and needed a separate fix.

---

## 10. The voice — added 22 Aug 2026

New material. It had no home in the v3 structure because v3 had no axis to put it on.

### 10.1 The Phase 1 rulings, verbatim

Judged from a rendered bench on 21 Aug 2026: real strings, both modes, at the sizes the site actually sets. Recorded as given and **not interpreted further**.

```
Q1.1  "Can't tell — notice it but couldn't say if intentional."   (1b)
Q1.2  "Better. Does something Bricolage can't."                    (2a)
Q1.3  Dark mode: "Survives — same or stronger."                    (3a)
Q1.4  VOLM at crescendo: "Can't see a difference from Flare."      (4c)
Q2.1  340 at 88px: "Thin by design."                               (5a)
Q2.2  g at 720: "Holds fine."                                      (6a)
Call  GO
Free  "hierarchy seems good"
```

**1b is a hesitation and stays recorded as one.** "Notice it but couldn't say if intentional" is not a yes. It was the softest answer given, and it was given on the *gate* question — whether the voice reads as deliberate. It is written here unupgraded because it turned out to be diagnostic: the 52px cut (§10.3) is the explanation for it. The flare was being spent at 32px, where it adds ink and no character, and a reader seeing it there would register a texture without being able to name it.

**The honest reading of 1b + 2a**, stated so nobody has to reconstruct it: the voice differentiates the page **without announcing itself**. That is arguably better than announcing itself, but it is quieter than the differentiation argument that motivated the swap, and the record should say so.

**4c is the biggest result in the set and it is a subtraction.** `VOLM` does not ship. That removed three planned rules, one planned assertion, and the only failure class check 8b is structurally blind to.

### 10.2 Band and voice are two keys

`scripts/lint-type.mjs`'s `RUNGS` map is the single source, with `band` and `voice` as separate keys and check 11 reading **`voice`**.

They were one key until 22 Aug, and that was a latent bug rather than a simplification. `band: 'display'` was made to mean both *what the type is* and *what it gets*, which held only while every display selector wanted flare. The 52px cut ended it: `.text-cover` and `.friction-beat__headline` are 32px display type by size, weight and rung, and the only way to take the flare off them through one key was to **relabel them as reading type** — a lie in the map.

> **When one key answers two questions, the second question eventually gets the wrong answer.**

The same shape as check 3 conflating rung with selector, and worth stating as a system property rather than an anecdote: `band` is a fact about the type, `voice` is a ruling about it, and facts and rulings change on different schedules.

`band` is no longer read by any check. **It is not dead.** It is the record of what each selector is, and it is what a width system would key off if a future typeface ever restores the axis.

### 10.3 The 52px cut, and its provenance

**Flared at and above 52px. Plain below.** Assigned by the rung's ceiling, never per module, gated by check 11 in CSS and `assert-bands.mjs` in the DOM.

| ceiling | selector | band | voice | |
|---|---|---|---|---|
| 88px | `.milestone__date` | display | flared | tested at 88 |
| 72px | `.hero-block__title` | display | flared | tested at 72 |
| 60px | `.text-lede` | display | flared | above the line |
| 56px | `.about-hero__pov` | display | flared | **judgment** — 51.2px at 1440 |
| 52px | `.case-study-prose h2` | display | flared | tested at 52, the boundary |
| 40px | `.about-phase__title` | display | **plain** | **judgment** — 36.4px at 1440 |
| 32px | `.text-cover` | display | **plain** | tested at 32 |
| 32px | `.friction-beat__headline` | display | **plain** | tested at 32 |

**Every selector in that table is `band: 'display'`. Not one moved band.**

> **52px IS NOT A MEASURED CONSTANT. It is a legibility judgment taken on a render
> at five sizes — 88, 72, 52, 32 and 18px — after a UI review found the flare
> illegible at 32. Nothing was ever tested at 51 or at 40. Its resolution is
> ±10px at best, so a selector within a few pixels of the line is ruled on, not
> looked up.**

Read as a number it would send `.about-hero__pov` plain over **one pixel** and leave the entire about page flat. The value ships with its derivation beside it, in `RUNGS` and in `globals.css`, because a derived value that does not carry its derivation is a defect this migration produced three times.

**The plain selectors take no declaration.** `@property --flar { initial-value: 0 }` already says it; authoring `--flar: 0` beside them would be a second statement of the same fact and a place for the two to disagree. They are asserted at 0 by `assert-bands.mjs`, which is what turns nineteen elements from *unasserted* into *asserted-at-zero*.

### 10.4 What the ink measurement found, including where it argues against the cut

`scripts/measure-flare-ink.mjs`, toggling `--flar` 100 → 0 on the element, light mode, 2×, reduced motion, self-diff noise floor 0.000% throughout:

| selector | size | Δ ink | Δ set width |
|---|---|---|---|
| `.text-cover` | 32.0px | +1.71% | +0.5423% |
| `.friction-beat__headline` | 32.0px | +2.41% | +0.4037% |
| `.about-phase__title` | 36.4px | +2.59% | +0.6188% |
| `.case-study-prose h2` | 52.0px | +2.18% | +0.5737% |
| `.about-hero__pov` | 51.2px | +1.58% | +0.5645% |
| `.hero-block__title` | 72.0px | +2.11% | +0.3014% |
| `.milestone__date` | 88.0px | +1.68% | +0.5559% |

**1. FLAR moves metrics, which narrows an earlier finding.** C3 recorded that the "0" advance is identical at FLAR 0 and 100 and concluded that flare could not move a `ch` budget. **The `ch` conclusion stands** — `ch` is defined by that glyph specifically and it genuinely does not move. The general reading built on it, that FLAR changes outlines and not metrics, is **wrong**: set width moves 0.30–0.62% everywhere measured. One glyph is not the font.

**2. The flare renders at 32px, and it is a larger share of the ink there than at 88px.** Ink delta is *largest* at the small sizes and *smallest* at 88px. Stated because it points against the ruling it was run to support.

It does not overturn it, and the reason is interpretation rather than measurement: at 32px a stem is 2–3px, so the flare is a bigger **fraction** of a smaller glyph while being too small to resolve as a *shape*. It arrives as weight and fuzz rather than as character — more ink, no more voice. That is consistent with what the review saw and is an argument **for** the cut. But **"measurably present" and "legible as intentional" are two claims, and only the second was ever ruled on.**

### 10.5 What the voice does not do

It is not hierarchy. Hierarchy is size, weight and colour, and the flare rides on top of a ladder that already works without it — R9 requires exactly that, since the axis vanishes during font swap and on a blocked CDN. Nothing on the site depends on the flare being there.

It is not per-module character. There is one flared value and one plain one; a surface does not get its own.

And it is not the differentiation argument the swap was sold on. Per 1b, it does its work quietly.
