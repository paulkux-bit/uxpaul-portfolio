# Council review: the Commissioner swap

> **STATUS: closed 22 Aug 2026. This is a record of a decision being made, not a
> plan. Do not implement from it.**
>
> **What it was:** a seven-seat review of whether to swap Bricolage Grotesque for
> Commissioner, written 21 Aug 2026 against the line-break measurement.
> **How it closed:** GO, with conditions. The migration ran as C1–C6 on
> `type-system-v4` and merged to `main` at `c2c8500`.
> **Where the outcome lives:** `docs/type-system-v3-locked.md`, amended in place
> (there is no v4). §10 holds the voice, the rulings verbatim and the 52px cut.
>
> **SIX RECOMMENDATIONS HERE WERE SUBSEQUENTLY OVERTURNED.** Bodies below are
> unedited; each is flagged here rather than corrected in place, because the
> reasoning that produced them is the point of keeping the file.
>
> | § | claim | outcome |
> |---|---|---|
> | Item 1, and the closing list | "The date is still unruled" | Ruled 21 Aug: **no hard gate**, 30 Sept target. `CLAUDE.md` corrected in Phase 0d. |
> | Item 2's 10× move; Conditions 3 | **give VOLM to rung 6 alone** — argued here as the single most distinctive move available | **VOLM DOES NOT SHIP.** Ruling 4c: Paul could not see its difference at the crescendo. It is absent from the binary, not pinned. |
> | Front-end §2 | "`next/font/google` accepts `axes: ['FLAR','VOLM','slnt']` … no self-host" | The migration **self-hosts**. Google serves v1.001, which lacks the `case` feature that fixes the eyebrow middot and FDT-E's hyphen. |
> | QA §1 and its proposed fix | 8b cannot see VOLM; rewrite it as a two-part check naming its own blind spot | **Moot, and closed by subtraction.** An axis you do not ship cannot fail silently. The two-part rewrite was not needed. |
> | Content §, the `h2` budget | `.case-study-prose h2` 22ch ≈ 30 → **32** characters | **Wrong twice over.** Measured ≈ **33.0** — and `22ch` **never wins**: `.cs-section h2`'s 30ch beats it on all 8 `h2`s, so the live budget is ≈ **44.9**. The "column 13.5% wider" figure in that same row is correct. |
> | Systems §, R8 | "R8 tightens to R8'. FVS may name only FLAR, VOLM, slnt" | R8' shipped **stronger than proposed**: exactly ONE `font-variation-settings` declaration in shipped CSS, on the universal selector. An invariant rather than an allowlist. |
>
> One recommendation it got exactly right, worth naming beside the six:
> **Condition 1, rewrite the hero clauses before any font decision.** It closed a
> live R9 violation and was owed regardless of the typeface.

Seven seats. Back-End Dev sits this one out; there is no data model in scope.

The council skill is written against the BARD product's design system. This review runs the same framework against uxpaul.com's four locked systems and the three portfolio personas (Dana, Marcus, Jordan), because that is what is actually under review.

Everything cited below is measured. Sources: `docs/commissioner-linebreak-measurement.md`, the five measurement runs, the font binaries, and the shipped `globals.css`.

---

## Principal Product Designer

**Grade: B+**

### What's working

The cost stopped being an estimate. "Re-verification will be expensive" is now three hero clauses, one card title, and five named widows across three studies. That is a scoping win, and it arrived before any commitment was made rather than after.

The fixed-not-compounding thesis held. Between 1 June and 18 August `globals.css` grew 64%, two full case studies shipped, and the font-coupled declaration count barely moved. Nuuly added zero. Delay is genuinely cheap on the code axis.

The sequencing call is right for a reason that is not about fonts. Copy on this site is fitted to a measure. Writing DAGR and URBN-Shipping in Bricolage and then swapping means fitting them twice.

### What needs work

**1. The date is still unruled, and it prices everything else.** `CLAUDE.md` says a role by 31 August. The feasibility study and Paul's own working target say end of September. That is ten days against six weeks. Item 5 on the handoff's open list, and it is the decision the rest hangs on. Rule it in the same commit that touches anything else.

**2. Opportunity cost, stated plainly.** DAGR and URBN-Shipping are unwritten. Two studies at roughly 1,200 words each, plus figures, plus crops, plus captions (which `case-study-house-rules-learned.md` §6 calls the largest hidden writing job on the site). That work is what Marcus reads. A type-system v4 does not appear on a hiring manager's screen as a type-system v4. It appears as "the site looks good," which the site already does.

**3. The systems backlog warns about exactly this shape.** Its own words: "If this file starts getting worked, something has gone wrong with priority." A v4 type system is a larger version of that risk wearing better clothes.

### The 10x move

Timebox it as a two-day migration with a written kill criterion, not an open v4 document. The criterion: if the tracking retune at rungs 4 through 6 and the signature at 88px do not settle by eye in one sitting, revert. The spike already deletes in one commit, which is the property that makes a timebox real rather than aspirational.

---

## Principal UI Designer

**Grade: A- for the direction. C for what is currently specified.**

### What's working

FLAR and VOLM are a genuinely rare vocabulary. That is the actual problem being solved, and it is the only part of this that no other choice solves. The reason for leaving Bricolage was that Bricolage is now everywhere; a replacement expressive axis almost nobody uses is a direct answer.

The extremes are the designer's own. The STAT table names exactly two non-default locations, Flare at 100/0 and Loud at 100/100. Building three bands onto designer-named stops beats inventing three values.

Both custom axes are linear in `avar`, so an intermediate is an honest visual midpoint rather than a guess. Weight is the axis that is not linear, and it is the one with a standard property, which is the split that makes tokens-for-weight and literals-for-voice fall out by construction rather than by compromise.

### What needs work

**1. The reading voice is very nearly invisible, and that undercuts the premise.** Rendered side by side at 18px in the bench, FLAR 0 against FLAR 20 barely registers. Measured, it moves 3 of 1,209 line-sets. The re-fit conclusion is that it is free. The design conclusion is less comfortable: if flare only shows at rungs 4 through 6, the site's distinctive vocabulary appears on roughly eight elements per page and nowhere in the 90% of the page that is prose.

**2. The `soft` preset is too quiet to justify the swap.** Display at FLAR 40, large at 70/40. Forty is a midpoint nobody named. Set at those values, Commissioner reads as a competent plain grotesque with a faint flourish on headings. That is trading a recognisable face for an unrecognisable one and banking 73 KB. The bytes are real; the differentiation is not.

**3. Tracking at rungs 4 through 6 was tuned against Bricolage's display cut and nobody has looked at 88px in Commissioner.** Bricolage's `opsz` adds contrast and tightens fit as size grows. Commissioner has one drawing at every size, so it will sit more open. §3.4's minus 0.02em and minus 0.025em are now doing a job they were not tuned for, alongside flare. The tracking column stops being a fine-tune and becomes a second token set, and it is the largest piece of judgment work in the whole migration.

### The 10x move

Ship the large rung at the designer's own Flare stop, 100/0, and give VOLM to rung 6 alone. That makes the arrival crescendo the single place on the site where the typeface does something no other portfolio does, at a location the type designer named rather than one invented in a sandbox. If 100/0 looks wrong at 88px, that is the answer to the whole question and it is worth knowing in an hour rather than after nine commits.

---

## Principal UX Designer

**Grade: B**

### What's working

The ladder does not move. Seven clamps, the 1.15 floor, the shared-crossover mechanism, the rung 6 retune that the C0 harness found: all pure `font-size` arithmetic, none of it references the typeface. Assertion 3 passes on day one. That is the hardest and most-computed part of v3 surviving intact.

The rung-0 split is an improvement wearing a cost's clothing. Cap-height goes from 0.660 to 0.713 of em, 8% larger. That means an all-caps eyebrow at 13px in Commissioner reads with the presence 14px has today. The split is not "one rung fails to serve two jobs." It is "the typeface finally lets the eyebrow get quieter and the caption get more legible at the same time."

### What needs work

**1. Measure gets longer, and it was already long.** Measured across all wrapped prose on the shipped desktop pages: 71.1 average characters per line in Bricolage, 74.2 in Commissioner at 18px, longest line 103 going to 110. The comfortable band tops out around 75. The 19px body brings it back to 72.1. That is a third independent argument for 19px, alongside x-height matching and measure preservation, and it says `64ch` probably wants to become roughly `60ch` rather than being carried across unchanged.

**2. The 14px floor is a legibility question, not a rounding question.** x-height 0.496 against 0.517 means 14px Commissioner sets a visibly smaller lowercase than 14px Bricolage. §2 of the locked doc states the floor as a hard constraint. Captions carry the bento glosses, and per the house rules those 24 tiles on BARD alone are more words than several prose sections combined. This is where Dana actually reads.

**3. Type states are still unspecified.** Hover, focus, visited, disabled, `forced-colors`, `prefers-contrast`, 200% zoom, print. A v4 that reopens §2's hard constraints and does not close §9's oldest gap ships the same hole with a new typeface in it.

### The 10x move

Re-derive the floor as a lowercase rule with a stated caps exception, then spend the exception on eyebrows going down to 13px rather than captions going up to 15px. One rung becomes two rules, the loudest small element on the page gets quieter, and the change reads as restraint rather than as inflation.

---

## Principal Front-End Dev

**Grade: A-**

### What's working

`next/font/google` accepts `axes: ['FLAR','VOLM','slnt']`, verified against `next@16.2.6`'s own `font-data.json`. No self-host, no Fontsource runtime dependency, no different preload story. Assertion 8a survives as the same guard with a new list, which was the cheapest of the outcomes §5 costed.

Payload: 128.5 KB down to 55.2 KB with `slnt` dropped, subset independently and landing within 0.5% of the study's own number. That is a 57% cut on a render-blocking asset that sits in front of the LCP element. It is the largest performance win available on the site and it costs nothing to take.

The fallback metric is better, not worse. `next/font` emits `size-adjust: 99.79%` for Commissioner against `101.66%` for Bricolage, both computed by the same code path. §6 predicted the opposite.

Gates hold. The patch applies clean onto `main` at `38182fc`, and `lint:type` 9/9, `lint:space` 7/7, `lint:color` 7/7, `lint:prose`, vitest 139/139 and eslint are all green with the measurement commits on top.

### What needs work

**1. Assertion 8b cannot see VOLM, at all.** The advance-width delta between VOLM 0 and VOLM 100 is exactly 0.00px at every size and string tried. A served file carrying FLAR and no VOLM passes the probe and reports success. Jordan opens DevTools. This repo's own standard is that a blind spot that prints is a known limit and one that does not is a false pass; right now the probe would be the second kind.

**2. R8' is violated by two shipping selectors today.** `.milestone__date` carries `600` and `88` inside its FVS string, and `.text-qh-title` carries `wght` through `var(--qh-wght)`. Under Commissioner an FVS string naming `wght` pins the weight of every descendant, and weight stops composing with voice. Both need rewriting before the swap, as their own commit, not inside it.

**3. `.milestone__date` grows 27% at 88px.** Measured: "Spring 2027" goes from 386px to 487px, "July 2019" from 286px to 367px. It is one of only two surfaces holding a sanctioned `opsz` pin, and it loses the pin and the width band together. Nothing in the line-break measurement caught this because it measures line counts, not set widths, and the milestone is one line.

### The 10x move

Rewrite 8b as a two-part check whose failure text names its own blind spot: FLAR proven by a lowercase-`n` run at 200px against a 2px threshold, where the delta is 27px and a static control reads 0.00; VOLM asserted structurally, with the string saying it is inferred from FLAR arriving in the same `axes` list rather than measured. That is four lines of honest text and it is the difference between a gate Jordan respects and one he catches.

---

## Principal Content Strategist

**Grade: B-**

### What's working

The arc, the section word budgets, the six-plus-Role section count, the module-repetition rule, the bold-lead rule: all font-independent. `case-study-house-rules-learned.md` survives the swap almost entirely, which matters because it is the doc DAGR and URBN-Shipping get written against.

### What needs work

**1. Every `ch` budget changes silently, and nothing in any gate catches it.** This is the finding the council would most like written down.

`ch` is the width of the digit zero, and the ratio of average character width to zero width differs by face. Measured:

| Surface | Budget | Bricolage | Commissioner | Change |
|---|---|---|---|---|
| `.case-study-prose h2` | 22ch | 12.80em wide, ~30 chars | 14.53em wide, ~32 chars | column **13.5% wider** |
| `.about-phase__title` | 24ch | 13.97em, ~32 chars | 15.85em, ~35 chars | column **13.5% wider** |
| body prose | 64ch | 41.47em, ~88 chars | 41.76em, ~94 chars | column 0.7% wider |

The h2 column getting 13.5% wider in em is a **layout change**, not a copy-fit change. At a 52px rung that is roughly 90px of extra column, and no lint asserts it because `ch` is legal at every value.

**2. The house rules doc states a number that stops being true.** §3: "`.case-study-prose h2` budgets 22ch ≈ 31 characters per line. Check every heading against two lines." Under Commissioner it is ≈32. Small in isolation, and it is the number two unwritten case studies will be authored against.

**3. One open copy-pass item closes itself, which is worth banking.** The systems backlog records that "Cleared, credentialed, and current." is 35 characters against `.about-phase__title`'s 24ch, resolving to about 33, so it wraps by roughly two pixels at every viewport. Under Commissioner 24ch holds about 35.1 characters. It stops wrapping. One backlog item retires as a side effect.

### The 10x move

Re-derive every `ch` budget from the new face and write the resulting character counts into `case-study-house-rules-learned.md` with the typeface named beside them, before DAGR is written. The budgets currently live in three places (globals.css, the house rules doc, and the author's head) and agree by convention rather than by gate. A face change is the moment that convention breaks.

---

## Principal Copywriter

**Grade: B+**

### What's working

The re-fit list is finite, named, and short. Three hero clauses, one card title, five widows. That is a morning of work, not a re-write.

### What needs work

**1. The three hero clauses need roughly 12% off their set width to hold one line.** These are the loudest sentences in each study, the first thing a reader meets, and the one place a case study makes a claim in the author's own voice.

**2. The break lands mid-clause, which reads as an accident.** "The data was there. The system couldn't speak it." breaks after "The system" at `wdth` 88 and after "The" at 100. The clause split is the module's entire idea. A break after a bare article is not a beat, it is a bug the reader attributes to the designer.

**3. Five widows, named:** "visualizations." and "trip." on /about mobile, "directly." on BARD mobile, "matches." on Nuuly mobile, "next." on FDT-E desktop. Each is one word on a final line.

### The 10x move

Rewrite the three hero clauses to fit at `wdth` 100 **now, in Bricolage, before any font decision.** They pass today at 88 and they would pass at 100. It costs one commit, it is reversible, it removes the single largest item from the swap's cost column, and per the researcher's finding below it is owed regardless of what happens to the typeface.

---

## Principal User Researcher

**Grade: B+**

### What's working

Dana gets a font that is 57% lighter in front of the LCP element on the three pages that matter. Dana does not read code and experiences the site through perceived performance and polish. This is the finding with her name on it.

### What needs work

**1. The hero reflow is the most visible craft failure on the site, and it ships today.** Measured by aborting the woff2 and reading what the size-adjusted fallback renders, on the current Bricolage build:

| Viewport | Hero sentences measured | Reflow between fallback and loaded font |
|---|---|---|
| 768px | 6 | 4 |
| 1440px | 6 | **6** |

At 1440px every hero sentence on every case study changes line count during the swap window. `display: swap` makes that window real on every cold load. R9 says anything that matters must also be carried by size, weight or colour, because the fallback is Arial-based with no `wdth`. The one-line fit is carried by width alone, so R9 is being violated by the module the reader sees first.

This reframes the width finding entirely. The dependency is not a Commissioner cost. It is a live defect the Commissioner measurement exposed, and under Commissioner the fallback and the loaded font agree, because neither has a width axis. On this surface the swap is a fix.

**2. Marcus does not see the typeface.** Marcus reads case study hooks and outcomes in five to seven minutes. Two of the five Template A studies do not exist. Nothing in this review changes his experience of the site; the two unwritten studies change all of it.

**3. Jordan is the only persona who notices, and Jordan notices the system, not the face.** FLAR assigned by rung, gated by lint, with the probe's blind spot named in its own failure text: that is Jordan material. Commissioner set at `soft` with no visible voice is not, and Jordan is the persona who extrapolates from small imprecisions.

### The 10x move

Ship the fallback-reflow fix regardless of the font decision. It is the only finding in this review that a hiring manager can see with their own eyes, on a cold load, without opening anything.

---

## Council Consensus

**Overall grade: B+ for the case as currently specified.**

**One-line verdict:** Go, conditionally, because the measured cost is small and the performance and differentiation arguments are real, but the swap as specified would ship a quiet Commissioner that buys bytes and not distinctiveness, and three of the four conditions below are owed whether or not the typeface ever changes.

### The verdict, stated properly

**GO**, subject to four conditions. Two of them are prerequisites, and both are work you owe anyway.

**Condition 1 (prerequisite, owed regardless).** Rewrite the three hero clauses to fit at `wdth` 100, in Bricolage, as their own commit. This closes the live R9 violation, removes the largest item from the swap's cost column, and is fully reversible. Nothing about it commits you to Commissioner.

**Condition 2 (prerequisite, owed regardless).** Get `wght` out of the `.milestone__date` and `.text-qh-title` FVS strings. R8 already makes this correct under Bricolage; R8' makes it mandatory under Commissioner.

**Condition 3 (the real gate).** The voice must ship at a value that is visible. Put the large rung at the designer's Flare stop and judge it at 88px, in both modes, on a real screen, in one sitting. If the honest answer from render is "FLAR 40 everywhere," stop: at that setting the swap costs a v4 document and buys 73 KB, and 73 KB is available more cheaply by instancing Bricolage's `opsz`.

**Condition 4 (before DAGR).** Re-derive the `ch` budgets and write the character counts into the house rules with the face named.

**NO-GO trigger, written now so it is not negotiated later.** If the tracking retune at rungs 4 through 6 and the signature at 88px are not settled by eye in one sitting, revert. The spike deletes in one commit and that property is what makes this a timebox rather than a hope.

**The honest alternative, for the record.** Instancing Bricolage's `opsz` saves 59 KB for one commit and preserves every ruling. It is not free either, because it kills the Also Shipped `opsz` variation and the milestone pin. It buys most of the performance and nothing at all on the differentiation problem that started this.

### Path to A

1. **Hero clauses rewritten at `wdth` 100** (Copywriter, Researcher). Fixes the live reflow. Dana benefits most, and she benefits today.
2. **Voice judged at the Flare stop, at 88px, both modes, one sitting** (UI). This is the go/no-go inside the go. Jordan benefits.
3. **`ch` budgets re-derived and written down before DAGR** (Content Strategist). Prevents two case studies being authored against a stale number.
4. **8b rewritten to name its own blind spot** (Front-End Dev). Jordan.
5. **The date ruled, and `CLAUDE.md` corrected in the same commit** (Product). Everything above is priced differently under 31 August than under 30 September.

### Persona impact summary

**Dana:** the render-blocking font halves, and the hero stops reflowing on cold load. Both are things she feels in the first three seconds without knowing why.

**Marcus:** unaffected by any of this. The two unwritten case studies are his entire experience of the site, and every hour spent here is an hour not spent there.

**Jordan:** the only persona for whom the swap is a positive signal, and only if the voice is visible and the lint is honest about what it cannot see. A quiet Commissioner behind a probe that overclaims is a worse Jordan signal than Bricolage with a clean system.

### Open questions

- **The date.** Unruled, and it changes the answer.
- **The signature by eye.** The ink numbers say ruling 3 survives at 340/720, with 13% more contrast than today, and that 360 matches Bricolage's light end within 0.1%. Whether 340 at 88px looks deliberate or thin is not a number.
- **Dark mode optical weight gain.** Recorded as unresolved in two specs pointing at each other, and it lands hardest on the signature. Unmeasured in either face.
- **Windows at the light weight.** The Commissioner repository flags a `usWeightClass` blur debate for Thin and ExtraLight on some Windows versions and ships a fix script. One check on Windows Chrome at the signature weight.
- **R = 2.46.** The section-break ratio is scheduled for revisit now that three studies can be read in sequence. It is a perceptual ratio judged against rendered type, and cap-height moves 8%. Revisit it after the font decision, not before, or it gets judged twice.

---

## Appendix: design system impact, document by document

### `type-system-v3-locked.md`: rewritten as v4

| Section | Verdict |
|---|---|
| §3.1 width tokens | **Deleted.** Three tokens, ~24 declarations, 13 of them the unmounted takes wall |
| §3.2 weight tokens | **Survive unchanged.** 340 and 720 both sit comfortably inside 100–900 |
| §3.3 the ladder | **Survives untouched.** Pure `font-size` arithmetic. Assertion 3 passes day one |
| §3.4 tracking | **Becomes a second token set.** The largest judgment item in the migration |
| §3.5 colour | **Untouched.** Font-independent throughout |
| §2 hard constraints | **Rewritten.** 18px body to 19px, 14px floor to a lowercase rule with a caps exception |
| R1 / R2 | **Inverted and re-slotted.** Voice is authored, never inherited; voice follows size |
| R3 the signature | **Survives as written.** Measured ink says 340/720 is 13% louder in Commissioner, not quieter |
| R8 | **Tightens to R8'.** FVS may name only FLAR, VOLM, slnt. Two shipping selectors violate it today |
| R9 | **Sharpens.** Three of four axes vanish in fallback rather than two. And R9 is being violated today |
| R10 no compression at reading size | **Retires.** There is nothing to compress |
| §5 the 88/88 clause split | **The reason it retired was wrong.** Width was doing fitting work |
| §6 exception surfaces | **Also Shipped loses two of three axes.** See below |
| §7 lint | Assertions 1, 7, 8a rewritten; 8b extended; 10 through 15 added |
| §9 still open | The about page is now measured for line breaks. Everything else stays open |

### `spacing-system-v1-locked.md`: survives, with one revisit

Ruling 1 derives spacing from `rem`, which is root size, not from the typeface's metrics. The eight-step scale, the fluid-pair construction, `--spacing-gutter` in px, and the zero-drift proof are all font-independent. **No token changes.**

Measured: total rendered text-block height per page moves between minus 5.5% and plus 3.7% depending on route and viewport, with no systematic direction. There is no vertical rhythm drift to correct.

Two things to carry forward. The three `em` optical spacings in §3.2 (the crop on `.comp-mark-cropped .mark`, `margin-right: 0.4em` on `.case-study-meta strong`, the 0.1em on `.pull-quote p::before`) are tuned to Bricolage's glyph proportions; `em` tracks font-size but not glyph width. Three declarations, one eye pass. And R = 2.46 is a perceptual ratio judged against rendered type, so it should be revisited after the swap rather than before.

### `color-system-v2-locked.md`: untouched

Nothing in the colour system references the typeface. The one adjacent item is the `--qh-*` brand shelf, which is a colour-architecture question already in the backlog and is entangled with the Also Shipped decision below rather than with the font.

### `interaction-system-v1-locked.md`: untouched

Durations, easings, transforms, focus rings and the pressed-state ruling are all font-independent. The one open item that touches type is "the button has no type rung," which a v4 should close as part of `unspecified-surfaces.md` rather than as a font consequence.

### `unspecified-surfaces.md`: unchanged in scope, more urgent

Nav, footer, buttons, card meta and pinned specimen tones all still need a type rung. A v4 that reopens §2's hard constraints and leaves these five open is spending the migration's political capital without buying the thing it was saved for.

### `case-study-house-rules-learned.md`: one number goes stale

§3's "22ch ≈ 31 characters" becomes ≈32. §1's word budgets, §2's bold-lead rule, §4's figure conventions, §5's module-repetition rule and §7's build gates are unaffected. §7's note that `lint:prose` hard-fails on em-dash is unaffected and still correct.

### `05-anti-patterns.md` and `07-content-strategy.md`: unaffected

Banned words, voice rules and the retired positioning sentence have nothing to do with the typeface.

---

## Appendix: three things the study did not cost, now measured

### 1. Also Shipped loses two of three axes, not one

The findings doc says "a third of that premise does not survive a font with no width axis." Measured from `globals.css`, the four brands vary on three axes:

| Brand | `wdth` | `wght` | `opsz` | Stated intent |
|---|---|---|---|---|
| lionsgate | 90 | 600 | 40 | cinematic: compressed, bold, display |
| red-cross | 96 | 500 | 14 | classic, humane: open, light, readable cut |
| bbc | 84 | 650 | 48 | newspaper: narrowest, heaviest, display |
| k-hovnanian | 100 | 540 | 24 | architectural: full width, grounded |

Commissioner has neither `wdth` nor `opsz`. **Two of the three axes go inert and only weight survives**, across a 150-unit span at a uniform 36px. Four brands would differentiate on weight alone.

The replacement is better than what it replaces, and it is the one surface where per-module axis choice is already sanctioned under ruling 7. Voice by brand, on the designer's own stops: bbc at Loud (100/100) with 650, lionsgate at Flare (100/0) with 600, k-hovnanian plain with 540, red-cross at a low flare with 500. That is a wider expressive range than width-plus-optical-size ever gave, on the surface whose variation §6 calls "the content."

### 2. Tabular figures: §8.4 is answered, and the answer is no

The study's §8.4 asks whether anything on the site needs `tnum`, and flags it as a hard constraint if the answer is yes. It was never audited. Every element containing digits, on the shipped desktop pages:

`.thread-index` (01/02/03), the footer year, `.about-row__year` and `.about-roles__dates` (year ranges), `.about-row__meta`, `.milestone__date`, one card title, "JPME Phase 1", and one caption reading "1,000+ styles, sizes 00 to 26."

The two that stack in a column are the thread marks and the /about year ranges. Both get **better**:

| Surface | Bricolage | Commissioner |
|---|---|---|
| `.thread-index` 01/02/03 width spread | **27.2%** | **12.1%** |
| `.about-row__year` column ragged edge (16px) | **11.86px** | **7.78px** |

Neither face has tabular figures. Commissioner's proportional digits are simply far more even: its narrowest digit is 0.4275em against Bricolage's 0.3030em, so the spread across the ten digits is 35% tighter. Bricolage's `1` is the outlier that makes "01" 27% narrower than "02" in a numbered sequence, which is part of why R6 exists at all.

Losing `tnum` costs nothing here. The surface that actually breaks is `.milestone__date`, and it breaks on width, not on figures.

### 3. The reading-rung question is now answerable

The systems backlog records the reading rung as untested because "18px / 64ch / 1.65 was built for sustained prose that does not yet exist," and notes that the one substantive external criticism of Bricolage is that it is heavy for running text. Nuuly's roughly 1,500 words changed that on 20 August.

Measured on that prose: 71.1 characters per line in Bricolage, 74.2 in Commissioner at 18px, 72.1 at 19px. And Schöndorfer's review rates Commissioner for long reading text, which is a rating Bricolage's display cut would not get on the same scale.

So the reading rung can now be judged, in both faces, against real copy. That is a half-hour with the bench and it settles a backlog item that has been open since the type migration.
