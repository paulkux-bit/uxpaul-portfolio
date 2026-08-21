# Commissioner: the staging plan

Written 21 Aug 2026, after the line-break measurement, the council review, and a deep research pass on the typeface and on shipping custom axes.

Two things in this document correct earlier work of mine. Both are flagged where they appear.

---

## 1. What the research changed

### 1a. The font Google serves is not the best available Commissioner

The designer's repo ships **three** variable fonts, not one. The one everybody uses is the worst of them.

| File | Version | Axes | `tnum` | Arrows | `ss01` |
|---|---|---|---|---|---|
| What Google Fonts serves (and `next/font/google` fetches) | **1.001** | wght, slnt, FLAR, VOLM | no | no | no |
| `Commissioner[FLAR,VOLM,wght].ttf` in the designer's repo | **1.012** | wght, FLAR, VOLM | **yes** | **yes** | **yes** |
| `Commissioner-Italic[FLAR,VOLM,wght].ttf` | 1.012 | wght, FLAR, VOLM | yes | yes | yes |

Google's copy has not been updated since **20 July 2020**, and its `METADATA.pb` still points at a 2020 fork branch (`m4rc1e/Commissioner @ flair-rename`) rather than the designer's current master. The designer himself filed [issue #41](https://github.com/kosbarts/Commissioner/issues/41) about Google's build in Feb 2021; it is still open.

The 1.012 roman file is the exact configuration this system wants: **the three axes we use, without the slant we already decided to drop**, plus three capabilities the study assumed were unavailable.

**So the recommendation flips: self-host, do not use `next/font/google`.** This is not a preference. It is a strictly better font, and the only way to get it.

### 1b. Payload, rebuilt and measured

Latin subset, identical `pyftsubset` settings, woff2:

| Build | Size | vs today | Notes |
|---|---|---|---|
| **Bricolage, 3-axis (shipping today)** | **126.1 KB** | — | |
| Commissioner v1.001 via Google, 4 axes | 94.0 KB | −25% | what `next/font/google` would serve |
| Commissioner v1.001, slnt dropped | 56.2 KB | −55% | not achievable through `next/font/google` |
| **Commissioner v1.012, default at 400, full range** | **77.2 KB** | **−39%** | tnum, arrows, ss01 |
| Commissioner v1.012, default 400, wght 300–800 | 74.3 KB | −41% | |
| **Commissioner v1.012, default 400, wght 340–720** | **65.9 KB** | **−48%** | exactly the system's declared weights |

Repositioning the default from Thin to Regular costs about 19 KB, because `avar` segments and `gvar` deltas get rebased. It is worth every byte (§1c).

Note the ordering constraint this creates, which is a pleasing one: **the final subset cannot be built until the type system is locked**, because the weight range is derived from the ruling. Ship Phase 1 and 2 on the full-range 77.2 KB build; restrict to the locked range in the last commit.

### 1c. The font's default weight is Thin, and it has consequences

`fvar` default `wght` = **100**. `OS/2.usWeightClass` = **100**. nameID 1 = "Commissioner Thin". Verified in the binary.

This does **not** break CSS `font-weight`, because `@font-face { font-weight: 100 900 }` plus the cascade resolves `normal` to 400. It does break three other things:

1. **Desktop apps list the variable font as "Commissioner Thin"** and a fresh text box sets hairline until a weight is picked. Noted in the install README.
2. **`next/font/local` derives its fallback metrics from the default instance**, which is Thin. Measured: `size-adjust` comes out **99.79%** where the wght-400 instance gives **101.44%**. A systematic 1.65% error in the fallback face.
3. Anything instancing the font outside CSS (Figma exports, static renders, PDF) gets Thin unless told otherwise.

> **Correction to my earlier report.** In the line-break measurement I reported Commissioner's `size-adjust` of 99.79% as evidence that its fallback is a *closer* metric match to Arial than Bricolage's 101.66%, and that §6's CLS prediction pointed the wrong way. That comparison was not like for like: Bricolage's default instance is its own wght 800 / opsz 96, Commissioner's is Thin, and neither is the weight the page actually sets. The honest statement is that **the two are within about 1.5% of each other at the weights that render**, and neither is a CLS risk worth naming. §6's prediction is not confirmed and not refuted; it is smaller than the measurement error I introduced. Repositioning the default to 400 removes the ambiguity.

### 1d. `@property` closes the tokenization trap the study could not

§3.4 of the feasibility study frames a real tension: voice can only travel through `font-variation-settings`, and a tokenised FVS string is unresolvable by a CSS-parser linter. It offers three ways out and the spike concluded "tokens for weight, literals for voice, by construction."

There is a fourth way, and it is better than all three:

```css
@property --flar { syntax: "<number>"; inherits: true; initial-value: 0; }
@property --volm { syntax: "<number>"; inherits: true; initial-value: 0; }

:root { font-variation-settings: "FLAR" var(--flar), "VOLM" var(--volm); }
/* wght deliberately absent. font-weight owns it, per R8'. */

.case-study-prose h2   { --flar: 40; }
.case-study-prose > h1 { --flar: 100; --volm: 40; }
```

Why this is the answer:

- **Each axis cascades independently.** The all-or-nothing FVS reset problem disappears. Setting `--flar` on a heading does not clobber `--volm` inherited from an ancestor.
- **The linter can see it.** `--flar: 40` is a plain number in `globals.css`. Assertions 11 through 15 become simple value checks instead of FVS string parsing, and the `varWidths` blind spot never gets recreated for voice.
- **One FVS declaration exists on the whole site**, at `:root`. R8' becomes trivially enforceable: fail on any `font-variation-settings` outside that single rule.
- Baseline support: Chrome 85, Firefox 128, Safari 16.4.

The rejected alternative, for the record: the `@font-face { font-variation-settings }` descriptor would set a reading-voice default at the face level, which sounds ideal. **Safari does not support it** (Chrome 140, Firefox 62, Safari not supported as of Aug 2026, and it is absent from the Safari 26.4 release notes). A portfolio for design hiring managers cannot ship a mechanism Safari ignores.

### 1e. One claim in the research I checked and rejected

One research pass concluded that "any rule that sets FLAR/VOLM must restate `'wght'`, because FVS resets omitted axes to the fvar default of 100." **That is wrong**, and it matters because acting on it would put `wght` into every FVS string and break R8'.

CSS Fonts 4's [feature and variation precedence](https://drafts.csswg.org/css-fonts-4/#feature-variation-precedence) is a 13-step ordered list. Step 2 applies `font-weight`. Step 12 applies the `font-variation-settings` property, and only for the axes the computed list actually names. A list of `"FLAR" 40` contains no `wght`, so nothing overwrites step 2. The reset problem is real but it is *between FVS declarations* (a child's list replaces the parent's whole list), not between FVS and the high-level properties.

Confirmed empirically: every one of my Commissioner measurement runs applied voice through FVS without naming `wght`, and the recorded computed `font-weight` on 1,209 elements was correct throughout.

### 1f. `ch` is a live CLS source, today, in Bricolage

`ch` is defined as the used advance of the "0" glyph **in the font used to render**. Under `font-display: swap` it resolves against the fallback first and re-resolves when the real font arrives.

| Font state | advance of `0` |
|---|---|
| next/font's adjusted Arial fallback | 0.555 em |
| Bricolage, wght 400 | 0.648 em |
| Commissioner, wght 400 | 0.6525 em |

So every `ch`-based measure on the site **jumps roughly 17% at swap time, today**. `64ch` on the reading column, `22ch` on `h2`, `24ch` on the about titles, `42ch`, `52ch`, `56ch`, `30ch`: all of them.

This is the second pre-existing defect the Commissioner work has exposed, and it sits on top of the first (the hero-sentence reflow). Together they mean the case-study hero and the prose column both move on every cold load.

Converting the measures to `rem` fixes it, and it also dissolves the Content Strategist's finding: a `ch` budget silently means a different number of characters in a different face, whereas a `rem` measure with a stated character count is explicit and survives the swap by being re-derived deliberately rather than drifting.

One good property of the axes here: **`ch` is completely invariant under FLAR and VOLM.** Measured, both are zero-width-delta. Voice costs nothing in layout.

### 1g. Three capabilities the v1.012 file adds

**`case`.** 37 substitutions raising punctuation to cap height for all-caps settings. This is not theoretical. Every case-study eyebrow on the site is all-caps and contains punctuation the feature fixes:

```
BARD · U.S. COAST GUARD
FDT-E · U.S. NAVY
NUULY · URBN
```

The middot sits at lowercase centre in a run of capitals, and `FDT-E`'s hyphen sits low. `font-feature-settings: 'case' 1` fixes both. It is one declaration on the eyebrow rule and it is the kind of thing Jordan notices.

**`tnum`.** Tabular figures, absent from the shipping 1.001 file. The two column surfaces I measured go from improved to perfect:

| Surface | Bricolage | Commissioner 1.001 proportional | Commissioner 1.012 `tnum` |
|---|---|---|---|
| `.about-row__year` column ragged edge | 11.86px | 7.78px | **0px** |
| `.thread-index` 01/02/03 spread | 27.2% | 12.1% | **0%** |

§8.4 of the study asks whether anything needs tabular figures and warns it would be a hard constraint if so. The answer is now: not needed, and available anyway. R6 ("one mark, one rendering") gets a mechanism instead of a workaround.

**`ss01`.** An alternate `G` with a bar. Worth one look at the signature and the eyebrows; probably not adopted, but it exists.

Also present in 1.012 and absent in 1.001: arrow glyphs U+2190 to U+2193. Audited the repo, nothing currently uses them, so this is headroom rather than a fix.

### 1h. Windows, and the oldest open question in the system

Chromium and Firefox on Windows rasterize through DirectWrite, which applies no stem darkening. Light weights render measurably thinner and washier than the same CSS on macOS CoreText, and the effect is worst light-on-dark and below 16px. The standard mitigation is editorial: floor body weight around 300 to 350, and never run below 300 reversed.

The signature's light half is **340**. In dark mode. On the home hero. That is precisely the risk cell, and it lands on the one gesture the type system calls its signature.

`type-system-v3-locked.md` §3.5 records this as unresolved: *"light text on a dark ground gains optical weight, so a given weight is not the same gesture in both modes. This matters most to the 340/720 signature."* It has been open since the type migration and is recorded in two specs pointing at each other.

The swap forces the moment to answer it, and there is a known pattern: a grade-style compensation, bumping the weight token in dark mode by roughly 20 to 25 units. Commissioner has no `GRAD` axis, but with `@property`-registered weight this is one token redefined inside a `prefers-color-scheme` block. **Closing this is worth more than the font change**, because it is the oldest unresolved item in the system and it applies in both faces.

---

## 2. The staging plan

### Branch or page at a time

**Branch, and not page at a time.** A typeface is a single global declaration; there is no coherent half-swapped state to review. Page-at-a-time would mean two faces co-visible in the nav, which is worse than either face.

But the *verification* is per-page, and the instrument for that already exists: `scripts/measure-linebreaks.mjs` produces a per-page, per-element, per-viewport diff. So the shape is one branch, many commits, and a per-page verification gate at the end.

The commit shape is v3's own, and it worked: **each commit turns one lint assertion green.** The gate becomes the migration checklist.

### Phase 0, on `main`. Owed regardless of the font.

Four commits. Every one is independently valuable, fully reversible, and commits to nothing. If Commissioner is abandoned tomorrow, all four stay.

| # | Commit | Why it stands alone |
|---|---|---|
| **0a** | Rewrite the three hero clauses to hold one line at `wdth` 100 | Closes a live R9 violation. Measured: at 1440px all six hero sentences reflow between the fallback and the loaded font on every cold load, on the LCP element of the three most important pages |
| **0b** | Remove `wght` from the `.milestone__date` and `.text-qh-title` FVS strings | R8 already makes this correct; it pins the weight of every descendant today |
| **0c** | Convert `ch` measures to `rem`, with the character counts documented | Fixes a ~17% layout jump at swap on every text column, in Bricolage, today |
| **0d** | Correct the date in `CLAUDE.md` to match the working target | Two documents disagree by three weeks; it prices every decision below |

0a and 0c are both verifiable with the harness. Run `measure-linebreaks` before and after each and confirm the fallback and loaded renders agree.

### Phase 1, branch `type-system-v4`. Judgment only.

One session at the bench. **No changes to `globals.css`.** Output is a rulings document, not code.

Five things to settle by eye, in this order:

1. **The large rung at the Flare stop (FLAR 100, VOLM 0) at 88px, both modes.** This is the go/no-go inside the go. If 100/0 reads wrong, the swap does not pay for itself and Phase 2 does not start.
2. **VOLM at rung 6 only.** The designer's Loud stop is 100/100. Rung 6 is the arrival crescendo and the only place large enough for it.
3. **The signature at 88px, both modes, and on Windows.** 340/720 against 360/720. Ink measurement says 340/720 is already 13% louder than Bricolage's and that 360 matches Bricolage's light end within 0.1%. The eye and the Windows render decide.
4. **Body 18 against 19, and the rung-0 split.** Three independent arguments already point at 19 (x-height, measure preservation, widow count). The split goes caption up to 15 or eyebrow down to 13; the cap-height gain of 8% says down.
5. **Tracking at rungs 4 to 6.** The largest judgment item in the migration and the one with no measurement to lean on.

**Kill criterion, written now:** if 1, 3 and 5 are not settled in one sitting, revert and close the branch. The spike deletes in one commit, which is what makes that a real gate rather than a hope.

### Phase 2, the migration. One commit per assertion.

| # | Commit | Assertion it turns green |
|---|---|---|
| 2a | Self-host: build script, instanced v1.012 woff2, `fonts.ts` to `next/font/local` | 8a rewritten with the new axis list |
| 2b | The 8b probe, rewritten to name its own blind spot | 8b |
| 2c | `@property --flar` / `--volm`, one `:root` FVS rule, voice by rung | 11 through 15, and 7 rewritten |
| 2d | Delete the width tokens and every `font-stretch` | 1 replaced by 10 |
| 2e | Body size, the floor as a lowercase rule, the rung-0 split | 2 rewritten |
| 2f | Tracking retune at rungs 4 to 6 | none; judgment, gated by 3 staying green |
| 2g | `case` on all-caps surfaces, `tnum` on the year columns and thread marks | new check: no all-caps rule without `case` |
| 2h | Also Shipped: per-brand voice replacing per-brand width and optical size | the exception-surface allowlist |
| 2i | `.milestone__date`: rebuilt without the `opsz` pin and the width band | R8' compliance |
| 2j | Dark-mode weight compensation | closes §3.5's open question |
| 2k | Docs: the v4 locked doc, the house rules character counts, the systems backlog, `unspecified-surfaces.md` | none; this is the commit that stops the drift |
| 2l | Restrict the subset to the locked weight range and rebuild | none; last, because the range is a ruling |

### Phase 3, verification. The instrument already exists.

1. `measure-linebreaks` against the v4 build, diffed against the Bricolage baseline captured in Phase 0. **The prediction is on record: about 11% of line-sets re-break, no headline gains a line, five widows.** If the actual diff is materially different, something in the migration is wrong and the diff will name it.
2. `measure-fallback-shift` to confirm the hero sentences no longer reflow, in either face.
3. `sweep-breakpoints` to confirm the single-line bands land where Phase 0's copy rewrite intended.
4. Windows Chrome and Firefox, at 100% and 125% scaling, at the signature weight, in dark mode.
5. All six gates, plus the production build, plus the Vercel preview.

Merge once, after 3 passes. Not before.

### Merge-time items

Things that are correct on the branch as written and need one touch when it lands, by
someone who can see both sides. Not defects, and not to be fixed early — this list exists
because fixing them early is what causes the collision.

- **The `.gitignore` previews block.** On `commissioner-preview` it reads *"Neither the
  capture script nor `docs/previews/README.md` is on main yet; both arrive with
  commissioner-preview."* That is true on both sides today and reads as past tense once the
  branch lands. Reword it at merge, in the merge commit.

  It is on this list rather than fixed because re-wording that exact block unilaterally, on
  main during Phase 0 step 0, is what produced the `eab107a` rebase conflict — main's
  reworded version colliding with its own ancestor. Doing it again from the branch side
  would be the same mistake with a smaller blast radius. One edit, once, at merge.

---

## 3. The A+ moves, consolidated

The seven the council named, plus five the research added. Ordered by what each buys.

| # | Move | Buys | Phase |
|---|---|---|---|
| 1 | **Rewrite the hero clauses at `wdth` 100** | Fixes the most visible craft failure on the site, on the LCP element, today. Dana sees this in the first three seconds | 0a |
| 2 | **`ch` to `rem`** | Kills a ~17% layout jump on every text column at swap. Also dissolves the silent-budget-drift hazard | 0c |
| 3 | **Self-host the v1.012 roman VF** | A newer, better font than Google serves, minus the axis we were paying 37 KB not to use. 48% lighter than today at the locked range | 2a |
| 4 | **`@property --flar` / `--volm`** | Closes the study's §3.4 tokenization trap outright. Voice becomes lint-checkable as plain numbers, and exactly one FVS declaration exists site-wide | 2c |
| 5 | **The Flare stop at the large rung, VOLM at rung 6 alone** | The arrival crescendo becomes the one place on the site doing something no other portfolio does, at a location the type designer named | 1, 2c |
| 6 | **Dark-mode weight compensation** | Closes the oldest open question in the type system, protects the 340 signature half on Windows, and applies in either face | 2j |
| 7 | **`case` on the all-caps surfaces** | Three case-study eyebrows currently set `·` at lowercase centre inside a run of capitals. One declaration | 2g |
| 8 | **`tnum` on the year column and thread marks** | Ragged edge to zero on both. R6 gets a mechanism instead of a workaround | 2g |
| 9 | **8b rewritten to name its blind spot** | A gate Jordan respects rather than catches. VOLM cannot be probed by advance width and the failure text should say so | 2b |
| 10 | **Floor as a lowercase rule, eyebrow down to 13px** | Turns the rung-0 split from a tax into a restraint move. The loudest small element gets quieter | 1, 2e |
| 11 | **`ch` budgets re-derived into the house rules with the face named** | Stops two unwritten case studies being authored against a stale number | 2k |
| 12 | **Timebox with a written kill criterion** | The thing that stops a two-day migration becoming a three-week v4 while two case studies stay unwritten | 1 |

Three of these (1, 2, 6) are worth doing **even if Commissioner is abandoned**. That is the strongest argument for starting at Phase 0: the first day of work is unconditionally valuable.

---

## 4. Fonts, installed

Installed to `~/Library/Fonts/Commissioner/`, 56 files:

- `Variable/` — the v1.012 roman and italic variable fonts
- `Statics-Default/`, `Statics-Flare/`, `Statics-Loud/` — 18 weights each

The statics matter more than they look. **All 18 named instances inside the variable font sit at FLAR 0 / VOLM 0**, and the Flare and Loud voices exist in it only as STAT records. No font menu will ever show them. Installing the statics is what puts those two voices in Figma's font list as their own families.

These are the designer's own files, not Google's. [google/fonts#2923](https://github.com/google/fonts/issues/2923) reports Google's generated statics rendering badly in macOS Preview and in PDFs; the designer's do not.

---

## 5. What is still not known

- **Whether the Flare stop looks right at 88px.** Phase 1, item 1. Everything else is downstream of it.
- **Tracking at rungs 4 to 6.** No measurement helps. `opsz` tightened fit as size grew and there is no replacement.
- **Windows rendering at 340.** Needs real hardware or BrowserStack, not reasoning.
- **Whether the reading voice should be non-zero.** Rendered at 18px, FLAR 0 against FLAR 20 barely registers, and it moves 3 of 1,209 line-sets. It is a smaller decision than the study implies, in both directions.
- **Where the uxpaul-portfolio repo lives on this machine.** `~/portfolio` is a different project (`paulkux-bit/portfolio`). The measurement patches need the right folder.

---

## Sources

Font and designer: [kosbarts/Commissioner](https://github.com/kosbarts/Commissioner) · [README](https://raw.githubusercontent.com/kosbarts/Commissioner/master/README.md) · [sources/config.yml](https://raw.githubusercontent.com/kosbarts/Commissioner/master/sources/config.yml) · [issue #41](https://github.com/kosbarts/Commissioner/issues/41) · [google/fonts#2923](https://github.com/google/fonts/issues/2923) · [METADATA.pb](https://raw.githubusercontent.com/google/fonts/main/ofl/commissioner/METADATA.pb)

Review: [Pimp my Type, Font Friday #158](https://pimpmytype.com/font/commissioner/) · [FontsArena](https://fontsarena.com/commissioner-by-kostas-bartsokas/) · [Fonts In Use](https://fontsinuse.com/typefaces/151557/commissioner)

Precedent: [metehan.design](https://metehan.design/) and [his performance writeup](https://metehan.design/blog/sveltekit-website-lighthouse-mobile-70-to-95-performance-optimization) · [ON AIR](https://fontsinuse.com/uses/38542/on-air-website)

Spec and platform: [CSS Fonts 4, variation precedence](https://drafts.csswg.org/css-fonts-4/#feature-variation-precedence) · [CSS Fonts 4, font-variation-settings](https://drafts.csswg.org/css-fonts-4/#font-variation-settings-def) · [CSS Values 4, ch](https://drafts.csswg.org/css-values-4/#ch) · [MDN @font-face/font-variation-settings](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@font-face/font-variation-settings) · [Cloud Four on ch and layout shift](https://cloudfour.com/thinks/watch-out-for-layout-shifts-with-ch-units/) · [Pixelambacht on variable font inheritance](https://pixelambacht.nl/2019/fixing-variable-font-inheritance/) · [Marussy, variable CSS font features in practice](https://marussy.com/variable-css-font-features/) · [FreeType on stem darkening](https://freetype.org/freetype2/docs/hinting/text-rendering-general.html) · [fontTools varLib.instancer](https://fonttools.readthedocs.io/en/latest/varLib/instancer.html) · [Material Symbols, on GRAD](https://developers.google.com/fonts/docs/material_symbols)
