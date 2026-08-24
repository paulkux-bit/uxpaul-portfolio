# UX Paul Portfolio — Claude Code Context

## Before you author anything new

This applies to a new case study, a new component, a new page, or any surface
that does not exist yet. Read it before writing, not after. Strategic
direction — audience, brand personality, references, design principles,
accessibility floor — lives in `PRODUCT.md`; read that too and defer to it on
judgment calls.

### 1. Every locked spec is canonical

The canonical set is **every file matching `docs/*-locked.md`**, not the list
below. The list is a convenience that a check keeps honest. Read all of them
before authoring. Where anything else disagrees — this file, an older doc, a
code comment — the locked spec wins, and the disagreement is a bug to fix in
the other place.

| System | Spec | Gate |
|---|---|---|
| Type | `docs/type-system-v3-locked.md` | `npm run lint:type` — 10 checks |
| Spacing | `docs/spacing-system-v1-locked.md` | `npm run lint:space` — 7 checks |
| Colour | `docs/color-system-v2-locked.md` | `npm run lint:color` — 7 checks |
| Interaction | `docs/interaction-system-v1-locked.md` | `npm run lint:interaction` — 9 checks |

This table is checked against the filesystem rather than maintained by hand, by
`__tests__/canon.test.mjs`. A `docs/*-locked.md` with no row here fails, and so
does a row naming a spec or a script that does not exist. When a new system is
locked, the check fails until the row is added — that is the point. Do not
resolve a failure by deleting the row or the spec.

Superseded or scoped, kept for their history and their non-value material, and
**never** to be implemented from: `docs/typography-system.md` (superseded in
full) and `docs/color-system.md` (palette superseded; still owns the `--qh-*`
brand shelf, paper grain, the swap protocol and the role map).

### 2. Every value comes from a token

Colour, spacing, radius, duration, icon size, icon stroke, type size and width.
No literals, no prefab Tailwind scales. Every linter scans `.mdx` and `.tsx`,
not only CSS, so a hardcoded value inside a case study fails the build exactly
as one in `globals.css` would.

### 3. A token is not the same as the right token

The gates check membership, not correctness. A heading on rung 4 where rung 3
belongs passes every check. `--duration-card` applied to a nav link passed the
duration check and was caught only by a purpose-built mapping guard. Read each
spec's intent, not just its token list. When the correct token for a surface is
not obvious, say so and ask rather than picking the nearest one — a wrong token
that lints clean is harder to find later than a literal.

### 4. A surface no spec governs is a finding, not a licence

New case studies arrive with bespoke components, and each one is a surface the
systems have never seen. If a new surface needs a rule no locked spec provides,
add it to `docs/unspecified-surfaces.md` with what it needs and why. Do not
invent a local answer. That file is the single list; when an entry is resolved
it moves into the owning spec and leaves, rather than becoming a third place the
answer lives.

### 5. Run every gate before calling anything done, and report the result

`npm run build` runs all four. State the result, pass or fail, every time. A
commit has already landed in this repo with a red test and a report that did not
mention it — the only thing that catches that is saying the number out loud.

Cross-cutting gaps neither type nor spacing nor colour claims live in
`docs/unspecified-surfaces.md` — eight entries as of 19 Aug 2026.

## Strategic direction
Strategic direction (audience, brand personality, references, anti-references, 
design principles, accessibility floor) lives in `PRODUCT.md` at the repo root. 
Read it before making design decisions. Defer to it on every judgment call.

## Project
Personal portfolio site for Paul Kali (Senior Product Designer with 8 years 
of leadership experience). Goal: land a senior IC, design lead, or director 
role.

### Schedule — there is no hard deadline

Revised 21 Aug 2026, and the ruling is the absence of a gate, not a new date.

- **Applications are open now**, against the site as it stands.
- **Target for a complete site: 30 September 2026.**

That target is Paul's own, not a gate. Nothing is measured against it, and a
slip costs a later completion rather than a missed window. The single date of
31 August 2026 was retired on 7 Aug; do not let the successor inherit its
enforcement framing, and do not reintroduce "out of scope for v1 because of the
deadline" as an argument. Scope arguments have to stand on their own merits.

**What the absence of a gate does NOT mean is that sequence is free.** It
reorders work rather than relaxing it: **anything a recruiter sees this week
outranks anything that improves the finished artifact.** That is why the live
hero-reflow defect outranks a type-system migration, and it is the tie-breaker
whenever two pieces of work look equally worthy.

## Stack (don't suggest changing)
- Next.js 16 (App Router) with Turbopack dev
- TypeScript strict mode
- Tailwind CSS v4 (CSS-based config in `app/globals.css`)
- next-themes for class-based dark mode
- Framer Motion for animation
- MDX for case study authoring (`@next/mdx`)
- Deployed on Vercel via GitHub (main branch = production)
- Impeccable skill installed; Retune to be added later

## File structure
- `app/` — App Router pages, layouts, globals.css
- `components/` — reusable components (no src/ folder)
- `mdx-components.tsx` — registers custom MDX components
- `PRODUCT.md` — strategic foundation (Impeccable-maintained)
- `CLAUDE.md` — this file (technical conventions)
- `AGENTS.md` — auto-generated, leave alone

### Page composition
- Home (`app/page.tsx`): hero → Selected Work → Also Shipped → footer.
- Home hero is a **weighted-sentence statement** (Direction D1): the h1 leads
  with a concrete proof line (`text-lede`) where **weight carries the emphasis**
  — thin connective words (`--text-muted`), bold key noun phrases (`font-[720]`
  + `--text-primary`); the name is a quiet signature (`text-h3`) below; then the
  proof paragraph. A concrete fact, not a positioning tagline. No tenure number,
  no geographic qualifier.
- "Off the clock" (the personal-takes typographic wall, `components/takes/*`)
  is currently rendered on **no route**. It was pulled from `/about` when that
  page was rebuilt around the career arc; the components stay on disk, intact
  and unrendered, pending a decision on where (or whether) it returns.
- About (`app/about/page.tsx`), v4: hero → three phase sections with résumé
  drawers → a selected-work band → credentials → contact. **The career timeline
  was deleted**; no `about-timeline` or `ERAS` references remain, and its CSS
  went with it. Dates live only on the rows. Each phase is a declarative
  sentence title at `text-h2`; phase three carries a single note line
  (`.about-phase__note`, "First retail, then defense, on purpose."). The role
  reads in the closed drawer row, because that is what a skimming reader is
  looking for.
- About's hero is the page's one two-tone moment: a single `<h1>` split into a
  muted lead span and a primary remainder, so the accessible name stays one
  sentence. The name above it is a label, not the heading.
- Résumé rows are one DOM at both breakpoints. Company, role and year are flat
  siblings and only the grid definition changes: company on its own line with a
  muted "Role · Year" beneath it on mobile, all four inline from md up. The
  interpunct is a `::after` on the role, never a text node, so desktop can drop
  it without a second markup branch. Do not reintroduce a wrapper around company
  and role: that is what forced the two layouts to disagree about what the grid
  items were.

## Breakpoints (match exactly)
Defined as CSS custom properties in `app/globals.css` under `@theme`:
- xs: 360px (small Android fallback)
- sm: 390px (mobile — primary mobile design target)
- md: 768px (tablet portrait)
- lg: 1024px (small laptop / tablet landscape)
- xl: 1440px (standard laptop — primary desktop design target)
- 2xl: 1920px (large desktop)

## Component conventions
- Server Components by default; add `'use client'` only when truly needed 
  (state, effects, browser APIs, Framer Motion components)
- Components live in `components/` at the repo root
- Co-locate styles via Tailwind utility classes
- No shadcn/ui — roll custom; my components are part of my craft signal
- Avoid premature abstraction; copy before generalizing

## PopUp annotation system — RETIRED
**The PopUp system is decommissioned. Do not build against it, and do not treat
persimmon as a live accent.** `--color-popup` and the `--popup-*` tokens are dead
legacy: the site is monochrome-warm and **accent-free at rest**, with no
exception. `components/popup-context.tsx` is gone, no route renders an
annotation layer, and the `<PopUp>` authoring syntax is not available.

This section previously described the layer as "the portfolio's signature
interaction" and reserved persimmon for it, which contradicted the director
frame further down this same file. The director frame was right.

Kept as a record of what was tried: a toggleable VH1-style commentary layer over
case studies, anchored per section via IntersectionObserver, intended to solve
process visibility without forcing a linear walkthrough. The problem it targeted
is real and still unsolved; the mechanism is not coming back in this form.

Two consequences that are easy to miss:
- The `--popup-*` tokens still defined in `globals.css` are dead. They are not
  in the type system's scope, so `lint:type` does not flag them.
- Anything that claims family resemblance to the annotation layer as a design
  rationale is resting on a retired system, including the Template B card
  description in the external knowledge docs.

## Accessibility (non-negotiable)
See `PRODUCT.md` for the full accessibility floor. Quick summary:
- WCAG AAA contrast on body text where feasible; AA elsewhere
- Honor `prefers-reduced-motion` for all motion
- Visible focus states on every interactive element
- Full keyboard navigation on every interactive control (the theme toggle, the
  header nav, every link and card)
- Meaningful alt text on every image (not "screenshot of design")
- Semantic HTML before ARIA

## Eyebrows are functional only (site-wide)

Decorative category eyebrows are banned. Every section leads with a declarative
sentence header that carries the point; a label reading "Credentials" above a
list of credentials tells the reader nothing the heading did not.

An eyebrow is permitted only when it is **functional**: when it carries
information the headline cannot. The annotation label on a case-study callout
("What changed") is the shape that qualifies, because it names what kind of
thing follows. A section-category name never does.

This governs the case studies too, not just About.

## Don't do this
- No purple gradients (anywhere)
- No generic Tailwind landing-page tropes (centered hero + 3-col feature 
  grid + testimonial + CTA pattern)
- No stock testimonials or placeholder marketing copy
- No fonts from the overused list: Inter, Geist, Mona Sans, Plus Jakarta 
  Sans, Space Grotesk, Recoleta, Instrument Sans, Fraunces — unless 
  we've documented a deliberate exception
- No oversized italic-serif hero h1 (current AI-marketing fingerprint)
- No uppercase letter-spaced eyebrow chips above hero h1
- No nested cards or glassmorphism
- No body text running to absolute viewport edge — always horizontal padding
- No emojis as decoration
- No "consumer-grade" or "craft" in positioning/hero copy (the old
  "Consumer-grade craft…" positioning was retired May 2026). These remain fine
  as internal design-principle language (e.g. "craft signal"), just not in
  user-facing positioning.

## Case-study voice (Template A)

The prose should sound like one person wrote it, in plain, considered English. Distilled from the lines that work — Hero, THE PROBLEM, THREE FRICTIONS. Full doctrine in `07-content-strategy.md`; this is the operational checklist for building a section.

1. **Plain words over domain-formal — except terms that thread the spine or carry teeth.** "I talked to twenty people who do the work," not "conducted twenty stakeholder interviews." But keep "jurisdiction" (it threads the 56) and "shadow IT" (the one technical term the Jordan reader values). Plain by default; reach for the technical word only when it earns its place.

2. **POV follows the section's job.** Declarative for the system ("The data was there. The system never spoke."). Third-person for the user ("Florida's data coordinator moves cases, not forms… she runs…"). First-person for my own work ("I talked to…", "I argued for the live score instead"). Never marketing third-person about myself ("Paul designed…").

3. **Short and declarative.** Let two short sentences do what one long one would. Cut the throat-clearing — no "In order to," "It's worth noting that," "This allowed us to."

4. **Concrete over constructed.** Name the specific thing: "cases look complete and bounce," "a sixty-day federal clock," "an Access dump," "a dozen tabs." Specifics are the senior signal; abstraction ("workflow inefficiencies") is the AI tell.

5. **One turn per passage.** The rare device lands *because* it's rare — the personification ("never spoke," "spoke two languages"), the define-by-negation ("moves cases, not forms"; "not resistance, but rational adaptations"). One per passage, not one per sentence. If everything's clever, nothing is.

6. **Earn the conclusion; don't restate it.** Prose is the evidence; the headline is the claim. The opener describes what I found and stops — the H2 carries "the verdict is already in." Don't write the punchline twice.

Banned words (case-study prose): no *craft, leverage, robust, delve, seamless, spearheaded*; no "improved efficiency" without a number; em-dash restraint and no adverbial fluff. See the **Don't do this** list above for the broader anti-patterns.

**Sounds like me / doesn't:**

- "I talked to twenty people who do the work" — not "Conducted stakeholder interviews across volume tiers"

- "cases look complete and bounce" — not "users experienced submission friction"

- "The data was there. The system never spoke." — not "The data existed but was not effectively surfaced"

## Typography

Locked May 2026 as a system, **retypeset to Commissioner on 22 Aug 2026** (merge
`c2c8500`). Implemented in `app/fonts.ts` and `app/globals.css`, enforced by
`npm run lint:type`, which gates `npm run build`.

**Commissioner has two axes: `wght` 340–720 and `FLAR` 0–100. It has no `wdth`
and no `opsz`.** That is the fact this section used to get wrong in eight places,
and it is the fact everything below rests on. `VOLM` exists in the family but is
**not in the shipped binary** — absent rather than pinned, so it cannot fail
silently.

Everything mechanical here is asserted by `scripts/lint-type.mjs` and by
`__tests__/claude-md-typography.test.mjs`, which reads this section against the
code. If you change one, the other reddens. That is deliberate: see
"Why this section is checkable" at the end.

### Typefaces
- **Primary (everything): Commissioner, self-hosted.**
  - Loaded with `next/font/local` in `app/fonts.ts`, from
    `app/_fonts/commissioner-latin.woff2`. The font is served from this repo,
    not fetched from a CDN at build time.
  - The binary is built by `scripts/build-commissioner-font.sh` from the
    designer's v1.012, not the v1.001 Google serves — that one is five years
    stale and carries `slnt` but not `tnum`, `case` or `ss01`.
  - next/font exposes it as `--font-commissioner`; everything consumes it
    through `--font-sans`, which globals.css defines in terms of that.
  - Instanced to `weight: '340 720'` in two independent places, the CSS and the
    binary, so a request outside the range clamps twice and the lint gets the
    same answer from the stylesheet and from the file.
  - The binary's **default instance is repositioned to 400**. next/font derives
    its Arial-fallback metrics from the default instance, and Commissioner's
    source defaults to Thin; shipping that would have computed every fallback
    measurement against a hairline.
- **Mono:** None. Add only if a real need appears (code blocks in case studies).

### Hard constraints
- **No italics.** Commissioner's italic is a separate binary and is not in
  `app/_fonts/`. `<em>` and `<i>` are remapped in globals.css to
  `font-style: normal` plus weight 600, and synthesis is closed off on both axes
  in the rule beside it. Never use synthetic browser italic.
- **14px floor.** Nothing below 14px. Check 2 fails the build on it. If
  something wants to be smaller, redesign the layout instead.
- **Never author font-stretch or font-optical-sizing.** The axes they drive do
  not exist, so those declarations are inert rather than subtle — nothing throws
  and the page looks plausible. **Check 10 fails the build on either.** Commit
  `25011cc` deleted every one of them along with the three width tokens; any
  note you find describing width bands predates it and is wrong.
- **Exactly one `font-variation-settings` declaration exists site-wide**, on `*`,
  reading `--flar`. **Check 7 fails the build on a second one.** There is no FVS
  allowlist any more. Do not add per-selector axis pins.

### The scale (role-based @utility classes)
Defined in `app/globals.css`. Use semantic role utilities — never raw Tailwind
text-size classes like `text-4xl`. Every row is checked against the utility's
real clamp, and every type-role utility must have a row.

| Utility | Size (mobile → desktop) | Use |
|---|---|---|
| `text-statement` | 40 → 96px | Home positioning statement. Largest single type role. Once per page. |
| `text-lede` | 32 → 60px | Home hero weighted sentence (h1). Thin base (wght 340); key noun phrases jump to `font-[720]` so weight carries emphasis. |
| `text-hero` | 48 → 80px | Case study hero. (About moved off it in v4: its h1 is `text-h1`.) |
| `text-h1` | 36 → 56px | Case study titles, section page titles |
| `text-h2` | 28 → 40px | Major section breaks; card title (media-tier cover) |
| `text-h3` | 22 → 28px (weight 500) | Subsections, callouts |
| `text-qh-title` | 28 → 36px (weight `--qh-wght`, 550 default) | Also Shipped titles |
| `text-cover` | 22 → 32px (weight 600) | Case-study card cover headline (typographic tier). Card-only. |
| `text-resolution-headline` | 26 → 32px (weight 600) | Resolution block headline |
| `text-lead` | 22px | Intro paragraph, project tagline |
| `text-body` | 18px | All body copy, default |
| `text-small` | 16px | Dense lists, captions, footnotes |
| `text-caption` | 14px | Date, role, year, byline; card project·client meta |
| `text-eyebrow` | 14px caps | Reserved for all-caps tags (home section labels are sentence-case) |

`text-display` was cut (homeless once the home h1 became `text-statement`; the deferred wordmark gets its own `text-wordmark`).

H3 uses weight 500 (not 600) to differentiate from H2 by weight as well as size.
There is intentionally no H4 — if a fourth heading level is needed, the case
study structure is too deep; flatten it or use `text-eyebrow` as a sub-block
label instead.

### Voice — the FLAR axis, by rung
**This replaced the three width bands.** Width was the expressive axis under
Bricolage; Commissioner does not have one, and FLAR is what it has instead.

Two values only, ruled from the bench on 21 Aug 2026: **FLAR 100 on the display
band, 0 everywhere else.** 40 and 60 were never judged by anyone and are not
decisions that have been made.

The flared set is five selectors: `.milestone__date`, `.hero-block__title`,
`.case-study-prose h2`, `.text-lede` and `.about-hero__pov`. **Plain selectors
take no declaration at all** — `@property --flar` sets `initial-value: 0`, so
writing `--flar: 0` beside them would be a second statement of the same fact and
a place for the two to disagree.

Three things about this that are easy to get wrong:

- **The declaration is on `*`, and that is not a style choice.** Custom
  properties substitute at computed-value time on the element whose declaration
  matched, so `:root { … var(--flar) }` resolves to a literal string before
  inheritance and descendants inherit it with no `var()` left to re-resolve.
  Measured on the C3 build: declaration on `:root` gave a 0.00px delta,
  declaration on `*` gave 27.20px.
- **The cut is at 52px and it is a judgment, not a constant.** It was taken on a
  render at 88, 72, 52, 32 and 18px. Nothing was tested at 51 or 40, so a
  selector within a few pixels of the line is a judgment call, not a lookup.
  `.about-hero__pov` is 51.2px at 1440 and is flared; `.about-phase__title` is
  36.4px and is plain.
- **`band` and `voice` are different columns.** `band` says what the type IS;
  `voice` says what it GETS. `.text-cover` and `.friction-beat__headline` are
  display type and stay display type in `RUNGS` — they are simply below the size
  at which flare carries anything.

The CSS list is derived from `RUNGS` in `scripts/lint-type.mjs`, and **check 11
fails the build if the two stop matching**, in both directions. One list, two
consumers. The bench once kept its own hand-written copy, which named a class
that did not exist and omitted `.hero-block__title`, so rung 5 rendered no flare
for an entire judgment session while every gate stayed green.

### Page typographic arc + spacing (Phase 2)
Registers separate on **size, weight and colour**. No register owns an axis, and
there is no width column here any more: width is gone with the axis.
1. **Display** (hero catch line, `text-lede`) — owns **weight** (340 → 720 shift).
2. **Major** (work titles: Selected Work cards + Also Shipped) — size and weight.
3. **Editorial** (hero proof, prose, `text-body`) — neutral, for reading.
4. **Eyebrow/Caption** (sentence-case section labels, project·client meta) — tracking.
5. **Subordinate** (availability `text-small`, footer `text-caption`) — quietest.

**Spacing is its own locked system now** — `docs/spacing-system-v1-locked.md`,
enforced by `npm run lint:space`, which gates `npm run build` beside
`lint:type`. Eight static steps, two measured fluid pairs and one fluid gutter,
registered in Tailwind's `--spacing-*` namespace so one definition serves
`var(--spacing-m)` in CSS and `gap-m` in JSX.

- **Intimate** → `--spacing-m`. **Evidence step** → `--spacing-l`.
  **Section break** → `--spacing-section`.
- **The 1920 step-up is retired.** Sectional spacing was 96 / 80 / 128px across
  base / xl / 2xl, which was *non-monotonic* — the home page's rhythm tightened
  between 1440 and 1919 before snapping at 1920. `--spacing-section` is one
  continuous curve holding 2.46 against rung 4 with 0.0000% drift.
  Section breaks are space, not rules (the footer hairline is the one structural line).
- **Vertical scales, horizontal holds.** Layout spacing is `rem` so rhythm
  tracks reading size. `--spacing-gutter` is `px` on purpose: a gutter is a
  container edge protecting measure, not rhythm, and growing it at a 32px root
  takes from a column whose characters-per-line has already halved. `px` holds
  under text-only scaling and still scales under browser zoom, which is exactly
  the behaviour wanted. Measured: vertical +75.5% at a 32px root, gutter flat.
- **Never author a raw spacing value.** No ninth step, no `em` on block-level
  spacing, no responsive spacing utility in JSX, and no `px` outside the two
  permanent exceptions §3.2 names — `--spacing-gutter` and `.sr-only`'s `-1px`
  clip idiom. Both are exempted in the lint by name, not allowlisted, so
  neither reads as debt awaiting cleanup. Each rule is an assertion, and each
  allowlist entry carries a one-line reason.

`docs/typography-system.md` §11's spacing notes are superseded along with the
rest of that file.

### Emphasis strategy
- Inline emphasis: `<em>` → weight 600 (set in globals.css base layer)
- Longer emphasized passages: the `emphasis-quiet` utility (weight 500 + 
  `--text-secondary`), defined in globals.css
- Editorial flourishes (book titles, foreign words): quotation marks, 
  not type style
- Product/ship/project names (Bard, Dagr, FDT-E): normal-weight proper 
  nouns, never emphasized

### Signature moves — deferred
The system as locked is a solid neutral foundation. Distinctive typographic
moments (custom wordmark treatment, lead paragraph character) are deferred until
real home page and case study content exists. Don't invent them in the abstract
— design them against real content.

### Reference doc — read this order
**`docs/type-system-v3-locked.md` is the source of truth for typography.**
Locked 5 Aug 2026, adopted 7 Aug 2026, **amended 22 Aug 2026 for Commissioner**,
enforced by `npm run lint:type`, which gates `npm run build`. Read it before
making any typography change.

`docs/typography-system.md` ("Locked May 2026") is **superseded** and carries a
banner saying so. It is still worth reading for the record of what was tried and
rejected, but it is not a spec, and it is now two typefaces out of date: it
describes Bricolage, and its width values, its tonal reading of the width axis,
its "FVS LAST" rule and its `text-wordmark` suggestion all disagree with v3.
Do not implement from it.

`docs/type-system-v3-migration-plan.md` records how the adoption was sequenced
(C0–C8) and what each lint check maps to. The Commissioner retypeset is C1–C6b
inside that plan.

### Swap protocol
If Commissioner is ever replaced, four surfaces change. This list is longer than
the two-step one it replaces, and the third entry is the one that bit us.

1. **`app/fonts.ts`** — the `src` path, the `variable` name and the `weight`
   range. If the binary changes, `scripts/build-commissioner-font.sh` too;
   it asserts the axes and ranges it emits.
2. **The FLAR wiring in `app/globals.css`** — `@property --flar`, the `*` rule,
   and the five-selector flared list. If the new face has no expressive axis,
   delete all three, and update the `voice` column in `RUNGS`
   (`scripts/lint-type.mjs`) in the same commit or check 11 reddens.
3. **`components/font-load-probe.tsx`** — it measures one live axis to prove the
   real font arrived. **It probed `wdth` until 21 Aug 2026, months after
   Commissioner had no such axis**, which made it a permanent false alarm on the
   one check that can fail in production while passing CI. Check 8b stayed green
   the whole time, because it asserts a probe *exists*, not that the probe
   measures a live axis. Repoint it or it lies.
4. **This section**, and the test that reads it.

The role utilities and component usage stay identical. No find-and-replace.

### Why this section is checkable
`__tests__/claude-md-typography.test.mjs` couples the claims above to the code,
the same way `__tests__/canon.test.mjs` couples the locked-spec table to the
filesystem. It asserts: the typeface and loader named here are the ones
`app/fonts.ts` actually uses; no retired-axis property is prescribed as a
declaration; every backticked custom property in this file resolves in
`app/globals.css` or in `app/fonts.ts`; the scale table and the `@utility` set match in both
directions, sizes included; and the check counts in the canonical-spec table
match what the linters actually run.

**What it cannot check is the reasoning** — why the cut is at 52px, why H3 is
weight 500, why the declaration is on `*`. Those are judgments, and a test that
tried to pin them would either be vacuous or would freeze a decision that is
supposed to stay arguable. The rule of thumb the test encodes: **a claim about
what the code IS gets asserted; a claim about why it is that way does not.**

## Colour by rung (type system v3 §3.5)
Every rung has a stated colour. None is left to judgement, and all display rungs
take `--text-primary` — the softer choice is most tempting exactly where it is
most wrong.

| Rung | Role | Colour |
|---|---|---|
| 6 | Arrival crescendo | `--text-primary` |
| 5 | Case-study hero | `--text-primary` |
| 4 | Section heading | `--text-primary` |
| 3 | Numbered headline | `--text-primary` |
| 2 | Standfirst | `--text-secondary` |
| 1 | Body | `--text-primary` |
| 0.5 | Support | `--text-secondary`, or `--text-muted` for metadata |
| 0 | Caption / eyebrow | `--text-muted` |

**The authoring rule: mix to author a token, never to apply one.** A `color-mix`
that produces a named token in the theme layer is legitimate. A `color-mix` at
the point of use on a `color:` property is a weight-fake, and `lint:type` check 6
fails the build on it. Four reasons it is a rule and not a preference: contrast
stops being computable, because an alpha's effective ratio depends on its
backdrop; alpha compounds, so a muted caption inside a muted block double-mutes;
it breaks the two-mode principle, since 60% black on white and 60% white on black
are not perceptually equivalent and one ramp forces one mode to be wrong; and it
undershoots, every time.

**Alpha is still correct** for state layers (hover, press), scrims, shadows and
focus rings. Those are surfaces and effects, not type colour.

The palette itself lives in `docs/color-system-v2-locked.md`, which owns every
token value. `docs/color-system.md` no longer specifies values: it was scoped on
8 Aug 2026 to implementation and usage notes.

## Color & illustration conventions

- Use semantic `--text-*` / `--border-*` tokens only. Never `color-mix(currentColor X%)`
  opacity weight-fakes, never the legacy `--color-text-*` aliases.
- Text-role contrast floors: `--text-primary` AAA; `--text-secondary` / `--text-muted`
  AA-normal (4.5:1); `--text-subtle` AA-large only (≥24px or ≥18.66px bold) — never
  normal-size meaningful text.
- **There is exactly one `font-variation-settings` declaration in the system**, on
  `*`, reading `--flar`, and check 7 fails the build on a second. There is no FVS
  allowlist: `ALLOWLIST` in `scripts/lint-type.mjs` has one key, `signature`. Never
  pin an axis per selector. This bullet used to say optical sizing was global, that
  width came from three band tokens, and that new FVS went in `ALLOWLIST.fvs`;
  Commissioner has neither axis, `25011cc` deleted both properties, and the
  allowlist key does not exist. See Typography above for what replaced all of it.
- Image-edge hairline lives on base rules (both modes) via `--border-subtle`:
  `box-shadow: inset 0 0 0 1px var(--border-subtle)`. If light reads faint, override
  light-only to `--border-default` — never change the base token.
- Figures are illustrations (3:1 graphics floor, not text). Per-mode, intentional:
  `.oku-figure { color: var(--text-secondary) }` and
  `html.dark .oku-figure { color: var(--text-muted) }`. Do not normalize this to parity.
- Illustrations are drawn bold/simple FOR display size (≥~1.5px lines), traced to
  currentColor fill-based SVG → .tsx with its own viewBox. Never fix shimmer with added
  strokes or layer promotion — fix it in the source art.
- `.case-study-prose p` is wrapped `:where(.case-study-prose) p` so component margins win.

## Workflow conventions
- Feature work happens on branches; PR before merge to main
- Run `/impeccable polish` before declaring any page "done"
- Run `/impeccable critique` on a page before showing it to anyone
- Use Retune for direct visual tweaks (when installed); Impeccable Live 
  Mode for variant exploration
- Commit messages in imperative mood ("Add header nav" not "Added header nav")
- Always test in both light and dark mode before committing

## Verification chain (don't re-derive this)

The named gates are three different tools; two are external and do NOT read prose:
- **detector** = Impeccable's **visual** anti-pattern scanner. External, lives in the
  installed impeccable plugin (`~/.claude/.../impeccable/scripts/detector/`), not a repo
  script. It inspects markup + CSS for AI-slop tells (side-tab borders, gradient text,
  overused fonts, nested cards, dark-glow, etc.). It does **not** read prose.
- **type** = `npm run lint:type` (`scripts/lint-type.mjs`), a real repo script and the
  only mechanical typography check that exists. Parses `app/globals.css` with postcss
  and enforces the nine v3 §7 assertions: the three width bands, the 14px floor, the
  1.15× rung ratio computed across 320–2560, the 340/720 signature, authored `strong`,
  no `color-mix(… currentColor …)` on text colour, the FVS allowlist, and both halves
  of the font-load check. **It gates `npm run build`** — the build runs it first and
  stops on failure. Allowlist entries live in the script, each with a one-line reason.
  It also prints three UNCHECKED blind spots it cannot see: widths driven through a
  CSS variable, and arbitrary width/weight utilities authored in JSX.
- **There is no `npm run typeset`.** Earlier notes here described `typeset` as an
  external typography check; it is a slash-command mode of the Impeccable skill, backed
  by prose guidance with no code, no config file and no exit status, so it cannot gate
  anything. It does not overlap `lint:type`.
- **prose** (em-dash + banned words) = `npm run lint:prose` (`scripts/lint-prose.mjs`), a
  real repo script. Scans rendered `.next` HTML: HARD-fails on em-dash U+2014, WARNs on the
  project banned words ("craft", "seamless") in `BANNED_WORDS`. Extend that list, not the code.

Full chain: **tsc -> eslint -> build (runs lint:type first, and fails on it) ->
lint:prose -> detector (visual, external)**.

**Every gate above is LOCAL, and a local gate is only ever a proxy for deployed
behaviour.** The two are different claims and the difference is easy to elide. Vercel runs
`npm run build`, which runs `lint:type`, `lint:space`, `lint:color`, `next build` and
`lint:interaction` — it does NOT run vitest, so no vitest assertion can be described as
"green in the deploy". `__tests__/noindex.test.mjs` is the case that matters: it asserts
`BLOCK_INDEXING`, `app/robots.ts` and the `next.config.mjs` header rule, all from source.
A green suite here with a missing header on the live site is the failure that would
actually cost something, and only a request to the deployed URL can see it:

```
curl -sI https://uxpaul-portfolio.vercel.app/ | grep -i x-robots-tag
curl -s  https://uxpaul-portfolio.vercel.app/robots.txt
```

Verify the behaviour where it ships. Recorded 21 Aug 2026, after a verification request
asked for a vitest result "in the deploy", which cannot exist.

## Color system — locked (v2)

**Name:** Paper & Low Light
**Spec:** `docs/color-system-v2-locked.md` — the palette, the two-layer
architecture, the rules and every measured ratio. Enforced by
`npm run lint:color` (7 checks), which gates `npm run build`.
**Implementation and usage notes:** `docs/color-system.md` — the `--qh-*` brand
shelf, paper grain, the theme-swap protocol, the role map. Its token tables are
superseded; do not read values from it.
**Implementation:** `app/globals.css`
**Toggle:** `next-themes`, class-based (`.dark` on `<html>`)

### Core principle

**No accent at rest. Interaction earns color.**

Nothing chromatic sits on the page idle. But when the user *does* something — hovers a link, selects text, focuses an input, picks up a card — the system responds with a warm chromatic moment. Interaction states are moments, not roles. This is compatible with chromatic restraint at the system level.

There is **no exception**. The PopUp annotation layer used to be one, on the
grounds that it was a distinct editorial voice carrying chromatic identity at
rest; that system is retired, so the rule is now absolute. Nothing chromatic
sits at rest anywhere on the site.

### Locked decisions

- **Color space:** oklch only. No hex. No rgb. Anywhere downstream.
- **Hue axis:** warm, 50–80 (amber/sepia). True neutral and cool grays are out of bounds.
- **Naming:** role-based, semantic. `--text-primary`, `--bg-surface-elevated`. Never raw color names.
- **Light and dark tuned independently.** Same hue axis, different chroma/contrast curves. Dark is not inverted light.
- **PopUp tokens (`--popup-*`) are dead legacy.** The annotation layer they were
  reserved for is retired. Do not use them anywhere, and do not reach for
  persimmon as an accent.
- **Interaction-state tokens (`--focus-glow`, `--selection-bg`, `--link-hover`) are moments, not paint.** Don't extend them to resting roles.

### Token inventory

- **Surface** — `--bg-canvas`, `--bg-surface`, `--bg-surface-elevated`, `--bg-sunken`
- **Text** — `--text-primary`, `--text-secondary`, `--text-muted`, `--text-subtle`
- **Borders** — `--border-subtle`, `--border-default`, `--border-strong`
- **Interaction states** — `--focus-ring`, `--focus-glow`, `--selection-bg`, `--selection-text`, `--link-hover`
- **Shadows** — `--shadow-rest`, `--shadow-hover` (warm-toned, not black)
- ~~**PopUp** — `--popup-canvas`, `--popup-surface`, `--popup-surface-elevated`, `--popup-border`, `--popup-text-primary`, `--popup-text-muted`~~ **DEAD LEGACY** (system retired; still defined in `globals.css`, consumed by nothing)

### Signature treatments

- **Two-layer focus halo** — `outline` (focus-ring) + `box-shadow` (focus-glow). Don't replace with a single ring.
- **Two-channel link hover** — underline thickness (1px → 2px) *and* color (border-strong → link-hover) shift together.
- **Warm peach selection** — chroma 0.10 in light, 0.09 in dark. This is the most-felt moment; never tune to a whisper.
- **Card lift** — `translateY(-3px)` + `shadow-hover` on interactive surfaces. Use the `lift` / `lift-hover` utility pair.
- **Paper grain** — SVG noise overlay on `body::before` in light mode only (opacity 0.55, mix-blend-multiply). Dark mode opacity 0.

### Utility classes (mirror typography pattern)

Defined in `app/globals.css` via `@utility`. Same naming convention as typography utilities.

- Surface: `bg-canvas`, `bg-surface`, `bg-surface-elevated`, `bg-sunken`
- Text: `text-primary`, `text-secondary`, `text-muted`, `text-subtle`
- Borders: `border-subtle`, `border-default`, `border-strong`
- Shadows + lift: `shadow-rest`, `shadow-hover`, `lift`, `lift-hover`
- ~~PopUp: `bg-popup-canvas`, `bg-popup-surface`, `bg-popup-surface-elevated`, `border-popup`, `text-popup-primary`, `text-popup-muted`~~ **DEAD LEGACY** (system retired)

For one-off needs, use the CSS variable directly: `style={{ color: 'var(--text-muted)' }}`.

### Accessibility floor

- Body text (`text-primary` on `bg-canvas`) hits **AAA** in both modes.
- `text-muted` hits **AA normal** — fine for any body-text size.
- `text-subtle` is **AA-large only** — never below **24px (or 18.66px bold)**, which is
  the actual WCAG large-text definition. It clears roughly 3:1 and nothing more, so any
  normal-size text that carries meaning takes `--text-muted` or stronger. (An earlier
  line here said "18px, or 14px bold"; that was too permissive and disagreed with this
  file's own contrast-floor bullet. Reconciled 8 Aug 2026: `docs/color-system.md`
  now records the measured range, 3.04-3.86 in light and 3.46-4.41 in dark.)
- Focus uses `outline` + `box-shadow` (never `border-color`). Layout never shifts.
- Link affordance is multi-channel — underline at rest, thicker + warmer on hover. Color alone is never the only signal.
- `color-scheme` set per mode so native controls theme correctly.

### Anti-patterns (extension of existing list)

- ❌ No accent color at rest. If something seems to need one, use weight, scale, position, or motion.
- ❌ No raw color tokens (e.g., `--color-blue-500`). All color is role-based.
- ❌ No cool grays (hue ≥ 200) anywhere.
- ❌ No pure black or pure white.
- ❌ Dark mode is not inverted light mode.
- ❌ Don't use `--popup-*` tokens at all. The annotation layer is retired and
  persimmon is not an accent.
- ❌ Don't extend `--focus-glow`, `--selection-bg`, or `--link-hover` to resting roles.
- ❌ No paper grain in dark mode.
- ❌ Don't add tokens inline. Extend `docs/color-system-v2-locked.md` first.

### Theming wiring

```tsx
// app/layout.tsx
import { ThemeProvider } from 'next-themes';

<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {children}
</ThemeProvider>
```

The `attribute="class"` is critical — the CSS expects `.dark` on `<html>`, not `data-theme="dark"`.
---

## Design intent & director frame (read before any design or content change)

Portfolio for Paul Kali, senior product designer, targeting **Senior IC, Staff IC, and Design Manager** roles at mission-driven orgs (consumer/FAANG, defense, civic tech). "Best offer wins." The site itself is a portfolio piece: its craft is evidence.

**Audience — design for these three, name them when a change affects behavior:**
- **Dana** (Director, ~3-min skim): experiences the site as perceived performance + polish. Never opens a drawer.
- **Marcus** (Senior hiring manager, ~5–7 min): reads outcomes + role clarity; cross-checks every claim against LinkedIn. Any mismatch is disqualifying.
- **Jordan** (Staff/Principal IC): reads the code and opens DevTools; extrapolates from small imprecisions.

**Governing principle:** signal and craft with restraint. Do NOT add things for the sake of adding. Elegance is subtraction. References: Titan, Karolis Kosas, Madeline Snow.

**Locked constraints:**
- Monochrome-warm ("Paper & Low Light"); the site is **accent-free at rest**. The PopUp system is retired; `--color-popup`/persimmon is dead legacy — do not use it as an accent.
- Commissioner, self-hosted; **never animate its axes** (gimmicky) — `wght` and `FLAR` are the two it has. Semantic oklch tokens only; no raw hex/rgb.
- **em-dashes (U+2014) are hard-banned** by lint:prose; en-dashes (U+2013) in date ranges are fine.
- **No company or client logos** anywhere (endorsement risk + palette break).
- Direct employers (U.S. Navy, URBN, SevOne, Comcast) stay **visibly separate** from agency-era CLIENT work (Abercrombie, Red Cross, DirecTV, Merck, PGA, etc., done via Empathy Lab/Tonic). Never imply a client was an employer.
- **No total-years/tenure number** on any page (ageism); dated entries are fine.
- All motion under `prefers-reduced-motion: no-preference`.

Before any design/content change, ask: does this serve Dana, Marcus, or Jordan, and does it honor restraint? If it's decoration, cut it.
