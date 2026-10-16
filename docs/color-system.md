# Color system — Paper & Walnut

> **`docs/color-system-v2-locked.md` owns the palette.** Every token value,
> the two-layer architecture, the rules and every measured ratio live there and
> only there. **This file no longer specifies colour values**, and where the two
> disagree, v2 wins without argument.
>
> Its "v2" status line below refers to the May 2026 palette revision, not to the
> August 2026 colour-system v2 — the names collide and the documents do not.
>
> **Why this is scoped rather than deleted.** Two documents describing one
> palette is R4 at the documentation layer: the second copy drifts, and this one
> already produced two wrong accessibility floors — the pt-for-px substitution
> caught during the type migration, and `--text-subtle` at "~3.5–4:1" when the
> real value was 2.78 and failing. But a bare pointer would delete live material
> v2 does not cover: the theme-swap protocol, the role map, and the non-text accessibility decisions. Those
> sections are the reason this file survives.
>
> **The token tables below are superseded and were not updated.** Read §4 of the
> v2 document instead.

**Status:** implementation and usage notes (palette superseded)
**Last revised:** May 2026; scoped 8 Aug 2026
**Palette spec:** `docs/color-system-v2-locked.md`
**Implementation:** `app/globals.css`
**Toggle:** `next-themes` with class-based switching (`.dark` on `<html>`)

---

## Concept

Light mode is **paper** — warm cream canvas with visible chroma, deep warm charcoal text, layered surface stocks. (It carried a whisper of grain until 15 Oct 2026; see Paper grain.) Dark mode is **walnut** (low light until 15 Oct 2026) — a warm wood-dark canvas, warm cream text, ambient and lamplit rather than printed. Both modes share the same hue axis (50–80, walnut to brass; warm amber/sepia until 15 Oct 2026) so the swap reads as one world under different lighting.

The base palette has **no accent color at rest**. Nothing chromatic sits on the page demanding attention. But interaction is a different state — when the user *does* something (hovers a link, selects text, focuses an input, picks up a card) the system responds with a warm chromatic moment. That's not an accent system. It's an interaction system.

The **PopUp annotation layer** once carried a chromatic identity at rest. It is retired, and its tokens were deleted on 1 Oct 2026. The one resting exception now is the "Client work" brand shelf (see Brand identity below).

---

## Principles

1. **No accent at rest.** A page sitting still should have no chromatic noise demanding attention. Brand color is not the differentiator; typography, scale, and craft are.
2. **Interaction earns color.** Hover, focus, selection, and active states are *moments*, not roles. They get warm chromatic treatment because they're functional signals — not decoration.
3. **Paper has character.** The canvas isn't white. It's cream with real chroma (0.018), layered surfaces with visible lightness steps, with no texture overlay (the light-mode grain was removed on 15 Oct 2026).
4. **Same world, different lighting.** Light and dark share the hue axis but are tuned independently. Dark mode is not inverted light mode.
5. **Chromatic restraint scales up at the moment of attention.** Selection is a real highlighter. Focus has a halo. Hover does two things at once. The system whispers until it needs to speak.

---

## Tokens

All values are oklch. Hue stays in the 50–80 warm band. Base palette chroma stays ≤ 0.040. Interaction states push to 0.10–0.15. (The retired PopUp tokens reached 0.07; they were deleted on 1 Oct 2026.)

### Surface

| Token                       | Light                          | Dark                           |
|-----------------------------|--------------------------------|--------------------------------|
| `--bg-canvas`               | `oklch(0.975 0.018 78)`        | `oklch(0.165 0.020 50)`        |
| `--bg-surface`              | `oklch(0.952 0.022 73)`        | `oklch(0.205 0.024 50)`        |
| `--bg-surface-elevated`     | `oklch(0.930 0.024 70)`        | `oklch(0.255 0.028 50)`        |
| `--bg-sunken`               | `oklch(0.915 0.026 68)`        | `oklch(0.130 0.016 48)`        |

### Text

| Token                       | Light                          | Dark                           |
|-----------------------------|--------------------------------|--------------------------------|
| `--text-primary`            | `oklch(0.215 0.018 55)`        | `oklch(0.945 0.012 78)`        |
| `--text-secondary`          | `oklch(0.355 0.020 55)`        | `oklch(0.825 0.014 76)`        |
| `--text-muted`              | `oklch(0.485 0.022 55)`        | `oklch(0.705 0.016 72)`        |
| `--text-subtle`             | `oklch(0.625 0.020 60)`        | `oklch(0.565 0.018 68)`        |

### Borders

| Token                       | Light                          | Dark                           |
|-----------------------------|--------------------------------|--------------------------------|
| `--border-subtle`           | `oklch(0.915 0.028 68)`        | `oklch(0.245 0.024 52)`        |
| `--border-default`          | `oklch(0.870 0.032 62)`        | `oklch(0.310 0.028 50)`        |
| `--border-strong`           | `oklch(0.760 0.040 55)`        | `oklch(0.430 0.034 50)`        |

### Interaction states (chromatic moments, not resting roles)

| Token                       | Light                                  | Dark                                   |
|-----------------------------|----------------------------------------|----------------------------------------|
| `--focus-ring`              | `oklch(0.220 0.018 55 / 0.55)`         | `oklch(0.945 0.012 78 / 0.55)`         |
| `--focus-glow`              | `oklch(0.700 0.140 60 / 0.22)`         | `oklch(0.720 0.150 60 / 0.30)`         |
| `--selection-bg`            | `oklch(0.860 0.100 65)`                | `oklch(0.380 0.090 55)`                |
| `--selection-text`          | `oklch(0.180 0.020 50)`                | `oklch(0.970 0.012 78)`                |
| `--link-hover`              | `oklch(0.580 0.150 55)`                | `oklch(0.780 0.140 60)`                |

### Shadows (warm-toned, not black)

| Token                       | Light                                                                                  | Dark                                                                            |
|-----------------------------|----------------------------------------------------------------------------------------|---------------------------------------------------------------------------------|
| `--shadow-rest`             | `0 1px 2px oklch(0.30 0.04 50 / 0.05)`                                                 | `0 1px 2px oklch(0 0 0 / 0.30)`                                                 |
| `--shadow-hover`            | `0 2px 4px oklch(0.30 0.04 50 / 0.06), 0 12px 28px oklch(0.30 0.04 50 / 0.10)`         | `0 2px 4px oklch(0 0 0 / 0.35), 0 16px 36px oklch(0 0 0 / 0.40)`                |

### PopUp annotation layer (retired)

Deleted from `globals.css` on 1 Oct 2026, consumed by nothing since the layer was retired. The six tokens and their values are in git history at `29ae8ab`.

### Brand shelf (deleted)

The "Client work" shelf's per-brand border and fill tokens, its `data-brand`
blocks and its per-brand title weight were consumed by nothing from 12 Oct 2026,
when the shelf became "Earlier work" and dropped its brand colour. They were
deleted on 15 Oct 2026 in the design system pass. The values and the rationale
are in git history at `a11e8b7`.

---

## Role map

### Surface

- **`bg-canvas`** — the page itself. Body background. Use exactly once per view.
- **`bg-surface`** — default panel. Case study cards, content modules, footer.
- **`bg-surface-elevated`** — raised against `bg-surface`. Cards on cards. Hover-raised states. Use sparingly.
- **`bg-sunken`** — inset against `bg-canvas`. Code blocks, blockquote backgrounds, inline pre.

### Text

- **`text-primary`** — body copy, headings, anything you need to read fluently. AAA on `bg-canvas`.
- **`text-secondary`** — leads, deck text, supporting prose. AAA on `bg-canvas`.
- **`text-muted`** — metadata, captions, labels, eyebrows. AA normal on `bg-canvas`.
- **`text-subtle`** — timestamps, tertiary info, footnote-rank text. **AA-large only** — never below 24px (or 18.66px bold).

**Sanctioned exception — bento caption lead.** The two-part bento caption (`components/bento.tsx`)
uses **`--text-primary` for the bold lead** (not `--text-secondary`, which the "leads" guidance above
would suggest) + `--text-muted` for the gloss. At the 18px / weight-600 display register a
`--text-secondary` lead reads timid against the muted gloss; the lead carries the hierarchy and wants
full primary weight, the gloss preserves the two-tier read. This is the intended value, not a TODO —
contrast only increases over the spec.

### Borders

- **`border-subtle`** — hairlines, section dividers, default card borders at rest.
- **`border-default`** — form fields, inputs, default UI chrome.
- **`border-strong`** — emphasis. Pull-quote left rules. (Link underlines moved to `border-interactive` on 1 Oct 2026, ruling A2b: at 2.04 / 2.35 this token is below the 3:1 an affordance owes.)

### Interaction states

- **`focus-ring`** — applied as `outline`, never `border`. Layered with `focus-glow` via `box-shadow` to form the halo.
- **`focus-glow`** — warm outer halo around the focus ring. The two-layer treatment makes focus *present* without introducing a brand accent.
- **`selection-bg` / `selection-text`** — a brass straw highlighter band (warm peach until 15 Oct 2026). This is the most-felt moment in the system; never tune it down to a whisper.
- **`link-hover`** — brass underline on hover (amber until 15 Oct 2026). Paired with a thickness change (1px → 2px) for a two-channel signal; in light the thickness carries it.

### Shadows

- **`shadow-rest`** — default state on lifting elements (cards, toggles).
- **`shadow-hover`** — hovered/active state. Bigger, warmer. Pairs with `translateY(-3px)`.

### PopUp annotation layer (retired)

The six roles (page wash, card surface, elevated card, border, body text, meta text) were deleted with their tokens on 1 Oct 2026.

---

## Utility classes

Defined in `app/globals.css` via `@utility`. Mirrors the typography utility pattern.

### Surface, text, borders

`bg-canvas`, `bg-surface`, `bg-surface-elevated`, `bg-sunken`
`text-primary`, `text-secondary`, `text-muted`, `text-subtle`
`border-subtle`, `border-default`, `border-strong`

### Shadows and lift

`shadow-rest`, `shadow-hover`
`lift` — applies `shadow-rest` with the transition profile preset
`lift-hover` — `translateY(-3px)` + `shadow-hover`

Compose: `<article className="lift hover:lift-hover">…</article>`

Since H1b (1 Oct 2026) the case-study card does not use these: it rests flat and
its hover is the border alone. The sandbox video card is the only consumer.

### PopUp (retired)

The six PopUp utilities were deleted with their tokens on 1 Oct 2026.

---

## Paper grain (removed 15 Oct 2026)

Light mode carried an SVG noise overlay on `body::before` (multiply, opacity 0.55) until the design system pass. It was removed by ruling 2d: measured on the canvas it darkened the page by 2 of 255 levels with a spread of 4, so no reader could see it, and its fixed, blended layer was composited on every frame in both modes (the layer stayed active in dark at opacity 0). Record: `docs/colour-texture-review-cc.md`. Do not reintroduce a texture overlay.

---

## Accessibility decisions

- **Body text hits AAA** in both modes. `text-primary` on `bg-canvas` measures ~14–15:1.
- **`text-muted` hits AA normal** (~5.5–6:1) at all body sizes.
- **`text-subtle` is AA-large only** (**3.04–3.86:1**, measured in K3 across the four
  light surfaces; 3.77–4.97 in dark, walnut, by lint arithmetic). Never use below 24px or 18.66px bold. `lint:color`
  check 4 enforces it. The earlier "~3.5–4:1" here was an estimate, and it was wrong at
  the bottom: the real floor-adjacent value was 2.78, a live WCAG failure that shipped
  until K3 moved the token to `L 0.590`.
  WCAG states large text as 18pt / 14pt bold; in CSS pixels that is 24px / 18.66px. Both
  figures here previously read "18px (or 14px+ bold)", a pt-for-px substitution that
  authorised a 3:1 colour six pixels under the real floor. That is the error that once put
  `text-subtle` on the 16px friction markers.
- **Focus uses `outline` + `box-shadow`**, never `border-color`. Layout never shifts on focus. The halo extends the ring's visual presence without expanding hit areas.
- **Selection contrast verified** in both modes: `selection-text` on the brass straw `selection-bg` measures 13.48 in light and 7.86 in dark (15 Oct 2026, lint arithmetic). Its floor against the grounds is a distance, not a contrast; see the locked doc §9.
- **Link affordance is multi-channel.** Underline at rest, thicker + brass on hover. Color alone is never the only signal.
- **`color-scheme`** is set per mode so native form controls and scrollbars adopt the right palette, and the layout's `viewport` export emits `<meta name="color-scheme" content="light dark">` (15 Oct 2026) so the browser knows both are supported before the stylesheet loads. There is no `theme-color`: its media-query form follows the system setting, not the in-page toggle.
- **`prefers-reduced-motion`** is respected globally — transitions reduce to near-instant.

---

## Swap protocol

### Mechanism

```tsx
// app/layout.tsx
import { ThemeProvider } from 'next-themes';

<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {children}
</ThemeProvider>
```

`attribute="class"` is required — the CSS expects `.dark` on `<html>`, not `data-theme="dark"`.

When the user toggles, `next-themes` adds/removes `.dark` on `<html>`. All tokens are CSS custom properties at `:root` (light values) overridden under `.dark` (dark values). Every `var()` consumer updates automatically.

### Transition

`body` has a 450ms transition on `background-color` and `color` for the soft fade. Other elements inherit values without transition — preventing dozens of staggered fades from feeling chaotic.

### First paint

An inline script at the top of `<head>` (`themeInitScript`, `lib/theme.ts`, 15 Oct 2026) sets the class before the body is parsed, preventing flash-of-incorrect-theme. `next-themes` renders its own copy as the first child of `<body>` and owns every change after first paint; both read the same settings from `lib/theme.ts`, and `__tests__/theme-script.test.mjs` runs the script in jsdom. Keep `disableTransitionOnChange` off (default) so the user-initiated swap still gets the soft fade.

### Edge cases

- **Form controls and scrollbars** pick up native theming via `color-scheme`. Do not override.
- **Embedded media** (case study screenshots, video) will not theme. Plan compositions so they hold up against both canvases.
- **System preference changes mid-session** are handled by `next-themes` when `enableSystem` is true. Test once after wiring.

---

## Rationale

The decisions, in order of forking:

1. **Build on Paper & Walnut** (Paper & Low Light when written) — Bricolage Grotesque was designed for editorial typesetting and lives most naturally in warm neutrals.
2. **Warm-leaning hue axis** (50–80) — walnut to brass reads as studio, not corporate (amber/sepia until 15 Oct 2026).
3. **No accent at rest** — chromatic restraint is the senior move. Forces typography, scale, and craft to do the work.
4. **Mirrored world, two designs** — same hue axis across modes, but tuned independently for distinct moods.
5. **PopUp takes a tint.** The annotation layer carried the only chromatic identity that persisted at rest. (Retired: the layer was decommissioned and its tokens deleted on 1 Oct 2026. The "Client work" shelf is the one resting exception now.)
6. **(v2) Interaction earns color** — hover, focus, selection get warm chromatic treatment as *moments*, not roles. Defensible because nothing chromatic sits at rest.
7. **(v2) Paper has real character** — visible chroma, layered surfaces. The canvas is cream stock, not generated white.

---

## Anti-patterns (no-fly list)

- ❌ **No accent color at rest.** Nothing in the base palette sits on the page chromatic and idle. If a future feature seems to need a resting accent, the answer is weight, scale, position, or motion. No exception is in use: the "Client work" shelf's brand border and fill, the one sanctioned exception, were deleted on 15 Oct 2026.
- ❌ **No purple gradients.** Anywhere.
- ❌ **No raw color tokens** (e.g., `--color-blue-500`). All tokens are role-based.
- ❌ **No cool grays** (hue ≥ 200). The system is warm only. The one exception, a hue 250 brand border on the "Client work" shelf, was deleted on 15 Oct 2026.
- ❌ **No pure black or pure white.** Warmth lives in the neutrals.
- ❌ **Dark mode is not inverted light mode.** Tune chroma and contrast independently.
- ❌ **Don't reintroduce PopUp tokens.** The annotation layer is retired; its tokens were deleted on 1 Oct 2026.
- ❌ **Don't extend interaction-state tokens (`--focus-glow`, `--selection-bg`, `--link-hover`) to resting roles.** They're moments, not paint.
- ❌ **No texture or noise overlay, in either mode.** The paper grain was removed on 15 Oct 2026.
- ❌ **Don't add tokens inline.** Extend this doc first, then add to `globals.css`.

---

## Open questions / future work

- **Imagery treatment.** Case study screenshots will sit on both canvases. A subtle outer ring at `border-subtle` is the current plan — verify when content lands.
- **Charts / data viz.** If case studies need charts, the chart palette is a separate (future) extension. Sequential warm-axis hues only; no categorical color.
- **Per-case-study tinting.** Faint hero-only tints drawn from each study's imagery — still open for the Selected Work case studies. (The *brief-work* shelf has its own realized treatment below.)
- **Active link state.** Currently links share the hover treatment when active. Worth revisiting if we add a "current page" indicator in nav.
