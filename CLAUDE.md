# UX Paul Portfolio — Claude Code Context

## Strategic direction
Strategic direction (audience, brand personality, references, anti-references, 
design principles, accessibility floor) lives in `PRODUCT.md` at the repo root. 
Read it before making design decisions. Defer to it on every judgment call.

## Project
Personal portfolio site for Paul Kali (Senior Product Designer with 8 years 
of leadership experience). Goal: land a senior IC, design lead, or director 
role by Aug 31, 2026.

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
  renders on `/about`, not home.

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

## PopUp annotation system (VH1 Pop-Up Video style)
Case studies live in `app/content/case-studies/*.mdx` (path TBD when 
implemented). Inline annotations authored as:

    <PopUp anchor="section-id">commentary text</PopUp>

Behavior:
- A global PopUpContext (in `components/popup-context.tsx`) toggles the 
  entire annotation layer on/off via a header button
- Each PopUp uses IntersectionObserver to trigger when its `anchor` 
  element enters viewport
- Framer Motion handles enter/exit (spring physics, gentle)
- Respect `prefers-reduced-motion`: skip animation, render as static 
  side annotation
- Mobile (below sm breakpoint): collapse pop-ups to footnote-style 
  inline links

This system is the portfolio's signature interaction — it solves the 
process-visibility gap without forcing linear case study walkthroughs.

## Accessibility (non-negotiable)
See `PRODUCT.md` for the full accessibility floor. Quick summary:
- WCAG AAA contrast on body text where feasible; AA elsewhere
- Honor `prefers-reduced-motion` for all motion
- Visible focus states on every interactive element
- Full keyboard navigation including PopUp toggle
- Meaningful alt text on every image (not "screenshot of design")
- Semantic HTML before ARIA

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

2. **POV follows the section's job.** Declarative for the system ("The data was there. The system couldn't speak it."). Third-person for the user ("Florida's data coordinator moves cases, not forms… she runs…"). First-person for my own work ("I talked to…", "I argued for the live score instead"). Never marketing third-person about myself ("Paul designed…").

3. **Short and declarative.** Let two short sentences do what one long one would. Cut the throat-clearing — no "In order to," "It's worth noting that," "This allowed us to."

4. **Concrete over constructed.** Name the specific thing: "cases look complete and bounce," "a sixty-day federal clock," "an Access dump," "a dozen tabs." Specifics are the senior signal; abstraction ("workflow inefficiencies") is the AI tell.

5. **One turn per passage.** The rare device lands *because* it's rare — the personification ("couldn't speak it," "spoke two languages"), the define-by-negation ("moves cases, not forms"; "not resistance, but rational adaptations"). One per passage, not one per sentence. If everything's clever, nothing is.

6. **Earn the conclusion; don't restate it.** Prose is the evidence; the headline is the claim. The opener describes what I found and stops — the H2 carries "the verdict is already in." Don't write the punchline twice.

Banned words (case-study prose): no *craft, leverage, robust, delve, seamless, spearheaded*; no "improved efficiency" without a number; em-dash restraint and no adverbial fluff. See the **Don't do this** list above for the broader anti-patterns.

**Sounds like me / doesn't:**

- "I talked to twenty people who do the work" — not "Conducted stakeholder interviews across volume tiers"

- "cases look complete and bounce" — not "users experienced submission friction"

- "The data was there. The system couldn't speak it." — not "The data existed but was not effectively surfaced"

## Typography

Locked May 2026. Implemented in `app/fonts.ts` and `app/globals.css`. 
System designed around Bricolage Grotesque's three variable axes (wght, 
wdth, opsz) — informed by Mathieu Triay's design notes at 
https://ateliertriay.github.io/bricolage/#design-notes.

### Typefaces
- **Primary (everything):** Bricolage Grotesque (Google Fonts, variable)
  - Loaded via `next/font/google` in `app/fonts.ts`
  - Exposed as `--font-sans` (no separate display family)
  - `font-optical-sizing: auto` enabled globally — small sizes render 
    Mathieu's 12pt cut (neutral, readable), large sizes render his 96pt 
    cut (expressive, ink-trapped)
- **Mono:** None currently. Add only if a real need appears (code blocks 
  in case studies). Recursive's `MONO` axis was considered and rejected 
  for unified family in v1.

### Hard constraints
- **No italics.** Bricolage ships without italics or obliques. `<em>` 
  and `<i>` are remapped in globals.css to `font-style: normal; 
  font-weight: 600`. Never use synthetic browser italic — it looks bad 
  on a font with no real italic.
- **14px floor.** Nothing below 14px in the system. If something wants 
  to be smaller, redesign the layout instead.
- **No `font-variation-settings` unless absolutely necessary.** Use the 
  standard CSS properties (`font-weight`, `font-stretch`, 
  `font-optical-sizing`) — they map directly to Bricolage's axes and 
  don't break the cascade.

### The scale (role-based @utility classes)
Defined in `app/globals.css`. Use semantic role utilities — never raw 
Tailwind text-size classes like `text-4xl`.

| Utility | Size (mobile → desktop) | Use |
|---|---|---|
| `text-statement` | 40 → 96px | Home positioning statement. Largest single type role. Once per page. |
| `text-lede` | 32 → 60px | Home hero weighted sentence (h1). Thin base (wght 340); key noun phrases jump to `font-[720]` so weight carries emphasis. |
| `text-hero` | 48 → 80px | Case study & About hero |
| `text-h1` | 36 → 56px | Case study titles, section page titles |
| `text-h2` | 28 → 40px | Major section breaks; card title (media-tier cover) |
| `text-h3` | 22 → 28px (weight 500) | Subsections, callouts |
| `text-cover` | 22 → 32px (weight 600) | Case-study card cover headline (typographic tier). Card-only. |
| `text-lead` | 22px | Intro paragraph, project tagline |
| `text-body` | 18px | All body copy, default |
| `text-small` | 16px | Dense lists, captions, footnotes |
| `text-caption` | 14px | Date, role, year, byline; card project·client meta |
| `text-eyebrow` | 14px caps | Reserved for all-caps tags (home section labels are sentence-case) |

`text-display` was cut (homeless once the home h1 became `text-statement`; the deferred wordmark gets its own `text-wordmark`).

H3 uses weight 500 (not 600) to differentiate from H2 by weight as well 
as size. There is intentionally no H4 — if a fourth heading level is 
needed, the case study structure is too deep; flatten it or use 
`text-eyebrow` as a sub-block label instead.

### Width axis usage
Bricolage's `wdth` axis is geographic: 100 = relaxed/French (Antique 
Olive influence), lower = anxious/British (Grotesque No. 9 influence). 
The scale uses:
- `text-statement`: 96% (slight editorial compression)
- `text-hero`: 97% (slight editorial compression)
- `text-cover` + media-tier card `<h2>`: 90% (the **Major** register, Phase 2)
- `.wordmark` (header chrome): 88%
- Everything else: 100% (default, warm)

### Page typographic arc + spacing (Phase 2)
Five registers, each owning a different Bricolage axis so the page reads as one
sequence:
1. **Display** (hero catch line, `text-lede`) — owns **weight** (340 → 720 shift).
2. **Major** (work titles: Selected Work cards + Also Shipped) — owns **width**
   (`font-stretch: 90%`); the two work modules read as one compressed family.
3. **Editorial** (hero proof, prose, `text-body`) — neutral, for reading.
4. **Eyebrow/Caption** (sentence-case section labels, project·client meta) — tracking.
5. **Subordinate** (availability `text-small`, footer `text-caption`) — quietest.

**Two-scale spacing** (drama through contrast, not uniform Tailwind rhythm):
- **Intimate** 12–24px within groups (hero beat-groups 20px; label→grid 24px;
  card title→meta 8–12px).
- **Sectional** 96 / 80 / 128px (base / xl / 2xl) between sections + above footer.
  Section breaks are space, not rules (the footer hairline is the one structural line).
Full rationale + reference citations in `docs/typography-system.md` §11.

The `wdth` (and `opsz`) axes only render because `app/fonts.ts` loads them via
`axes: ['opsz','wdth']`. Omitting that ships `wght`-only and silently disables
every `font-stretch` and `font-optical-sizing` rule.

### Emphasis strategy
- Inline emphasis: `<em>` → weight 600 (set in globals.css base layer)
- Longer emphasized passages: the `emphasis-quiet` utility (weight 500 + 
  `--text-secondary`), defined in globals.css
- Editorial flourishes (book titles, foreign words): quotation marks, 
  not type style
- Product/ship/project names (Bard, Dagr, FDT-E): normal-weight proper 
  nouns, never emphasized

### Signature moves — deferred
The system as locked is a solid neutral foundation. Distinctive 
typographic moments (custom wordmark treatment, lead paragraph 
character) are deferred until real home page and case study content 
exists. Don't invent them in the abstract — design them against real 
content. Likely candidates when revisited:
- Wordmark: push compression to 84–88%, possibly drop weight, possibly 
  open letter-spacing
- Lead paragraph: push weight to 500, possibly tighter tracking

### Reference doc
Full rationale, manual axis-control patterns, and decisions-with-reasoning 
live in `docs/typography-system.md`. Read that file before making any 
typography changes — it's the source of truth for *why* the scale is 
shaped this way.

### Swap protocol
If Bricolage is ever replaced (e.g. with a purchased Stornoway or 
Tofino license), only two surfaces change:
1. The `next/font` import in `app/fonts.ts` (including the `axes` array)
2. The `font-stretch` values in `text-statement`, `text-hero`, and 
   `.wordmark` (delete if the new font has no `wdth` axis)

The role utilities and component usage stay identical. No find-and-replace.

## Color tokens (to be filled in during design system phase)
- Light mode palette: TBD (current placeholder in globals.css)
- Dark mode palette: TBD (current placeholder in globals.css)
- Use `oklch()` for everything; CSS variables defined in globals.css

## Color & illustration conventions

- Use semantic `--text-*` / `--border-*` tokens only. Never `color-mix(currentColor X%)`
  opacity weight-fakes, never the legacy `--color-text-*` aliases.
- Text-role contrast floors: `--text-primary` AAA; `--text-secondary` / `--text-muted`
  AA-normal (4.5:1); `--text-subtle` AA-large only (≥24px or ≥18.66px bold) — never
  normal-size meaningful text.
- `font-optical-sizing: auto` is global; do NOT hardcode `opsz` via font-variation-settings.
  Width via the `font-stretch` property. FVS only on the hero callout.
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

# CLAUDE.md — color system section

Paste this into your existing `CLAUDE.md`, after the typography section.

---

## Color system — locked (v2)

**Name:** Paper & Low Light
**Spec:** `docs/color-system.md`
**Implementation:** `app/globals.css`
**Toggle:** `next-themes`, class-based (`.dark` on `<html>`)

### Core principle

**No accent at rest. Interaction earns color.**

Nothing chromatic sits on the page idle. But when the user *does* something — hovers a link, selects text, focuses an input, picks up a card — the system responds with a warm chromatic moment. Interaction states are moments, not roles. This is compatible with chromatic restraint at the system level.

The PopUp annotation layer is the one exception: it carries chromatic identity that persists at rest, because it's a distinct editorial voice.

### Locked decisions

- **Color space:** oklch only. No hex. No rgb. Anywhere downstream.
- **Hue axis:** warm, 50–80 (amber/sepia). True neutral and cool grays are out of bounds.
- **Naming:** role-based, semantic. `--text-primary`, `--bg-surface-elevated`. Never raw color names.
- **Light and dark tuned independently.** Same hue axis, different chroma/contrast curves. Dark is not inverted light.
- **PopUp tokens (`--popup-*`) are reserved for the annotation layer.** Do not use elsewhere.
- **Interaction-state tokens (`--focus-glow`, `--selection-bg`, `--link-hover`) are moments, not paint.** Don't extend them to resting roles.

### Token inventory

- **Surface** — `--bg-canvas`, `--bg-surface`, `--bg-surface-elevated`, `--bg-sunken`
- **Text** — `--text-primary`, `--text-secondary`, `--text-muted`, `--text-subtle`
- **Borders** — `--border-subtle`, `--border-default`, `--border-strong`
- **Interaction states** — `--focus-ring`, `--focus-glow`, `--selection-bg`, `--selection-text`, `--link-hover`
- **Shadows** — `--shadow-rest`, `--shadow-hover` (warm-toned, not black)
- **PopUp** — `--popup-canvas`, `--popup-surface`, `--popup-surface-elevated`, `--popup-border`, `--popup-text-primary`, `--popup-text-muted`

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
- PopUp: `bg-popup-canvas`, `bg-popup-surface`, `bg-popup-surface-elevated`, `border-popup`, `text-popup-primary`, `text-popup-muted`

For one-off needs, use the CSS variable directly: `style={{ color: 'var(--text-muted)' }}`.

### Accessibility floor

- Body text (`text-primary` on `bg-canvas`) hits **AAA** in both modes.
- `text-muted` hits **AA normal** — fine for any body-text size.
- `text-subtle` is **AA-large only** — never below 18px (or 14px bold). Lint this.
- Focus uses `outline` + `box-shadow` (never `border-color`). Layout never shifts.
- Link affordance is multi-channel — underline at rest, thicker + warmer on hover. Color alone is never the only signal.
- `color-scheme` set per mode so native controls theme correctly.

### Anti-patterns (extension of existing list)

- ❌ No accent color at rest. If something seems to need one, use weight, scale, position, or motion.
- ❌ No raw color tokens (e.g., `--color-blue-500`). All color is role-based.
- ❌ No cool grays (hue ≥ 200) anywhere.
- ❌ No pure black or pure white.
- ❌ Dark mode is not inverted light mode.
- ❌ Don't use `--popup-*` tokens outside the annotation context.
- ❌ Don't extend `--focus-glow`, `--selection-bg`, or `--link-hover` to resting roles.
- ❌ No paper grain in dark mode.
- ❌ Don't add tokens inline. Extend `docs/color-system.md` first.

### Theming wiring

```tsx
// app/layout.tsx
import { ThemeProvider } from 'next-themes';

<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {children}
</ThemeProvider>
```

The `attribute="class"` is critical — the CSS expects `.dark` on `<html>`, not `data-theme="dark"`.