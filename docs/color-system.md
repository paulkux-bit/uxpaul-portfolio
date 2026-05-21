# Color system — Paper & Low Light

**Status:** locked (v2)
**Last revised:** May 2026
**Implementation:** `app/globals.css`
**Toggle:** `next-themes` with class-based switching (`.dark` on `<html>`)

---

## Concept

Light mode is **paper** — warm cream canvas with visible chroma, deep warm charcoal text, layered surface stocks, and a whisper of grain. Dark mode is **low light** — warm espresso canvas, warm cream text, ambient and lampt rather than printed. Both modes share the same hue axis (50–80, warm amber/sepia) so the swap reads as one world under different lighting.

The base palette has **no accent color at rest**. Nothing chromatic sits on the page demanding attention. But interaction is a different state — when the user *does* something (hovers a link, selects text, focuses an input, picks up a card) the system responds with a warm chromatic moment. That's not an accent system. It's an interaction system.

The **PopUp annotation layer** carries the only chromatic identity that persists at rest. When the toggle is engaged, the page picks up a subtle warm wash and annotation cards appear on a more saturated tint — signaling *different voice, same world.*

---

## Principles

1. **No accent at rest.** A page sitting still should have no chromatic noise demanding attention. Brand color is not the differentiator; typography, scale, and craft are.
2. **Interaction earns color.** Hover, focus, selection, and active states are *moments*, not roles. They get warm chromatic treatment because they're functional signals — not decoration.
3. **Paper has character.** The canvas isn't white. It's cream with real chroma (0.018), layered surfaces with visible lightness steps, and a subtle SVG grain in light mode only.
4. **Same world, different lighting.** Light and dark share the hue axis but are tuned independently. Dark mode is not inverted light mode.
5. **Chromatic restraint scales up at the moment of attention.** Selection is a real highlighter. Focus has a halo. Hover does two things at once. The system whispers until it needs to speak.

---

## Tokens

All values are oklch. Hue stays in the 50–80 warm band. Base palette chroma stays ≤ 0.040. Interaction states push to 0.10–0.15. PopUp tokens reach 0.07.

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

### PopUp annotation layer

| Token                       | Light                          | Dark                           |
|-----------------------------|--------------------------------|--------------------------------|
| `--popup-canvas`            | `oklch(0.955 0.044 62)`        | `oklch(0.215 0.040 52)`        |
| `--popup-surface`           | `oklch(0.930 0.054 58)`        | `oklch(0.255 0.046 52)`        |
| `--popup-surface-elevated`  | `oklch(0.905 0.060 55)`        | `oklch(0.295 0.052 52)`        |
| `--popup-border`            | `oklch(0.840 0.070 52)`        | `oklch(0.385 0.060 52)`        |
| `--popup-text-primary`      | `oklch(0.245 0.030 52)`        | `oklch(0.935 0.020 75)`        |
| `--popup-text-muted`        | `oklch(0.495 0.030 52)`        | `oklch(0.730 0.024 68)`        |

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
- **`text-subtle`** — timestamps, tertiary info, footnote-rank text. **AA-large only** — never below 18px (or 14px+ bold).

### Borders

- **`border-subtle`** — hairlines, section dividers, default card borders at rest.
- **`border-default`** — form fields, inputs, default UI chrome.
- **`border-strong`** — emphasis. Pull-quote left rules. Default link underlines (at rest).

### Interaction states

- **`focus-ring`** — applied as `outline`, never `border`. Layered with `focus-glow` via `box-shadow` to form the halo.
- **`focus-glow`** — warm outer halo around the focus ring. The two-layer treatment makes focus *present* without introducing a brand accent.
- **`selection-bg` / `selection-text`** — warm peach highlighter band. This is the most-felt moment in the system; never tune it down to a whisper.
- **`link-hover`** — warm-tinted underline on hover. Paired with a thickness change (1px → 2px) for a two-channel signal.

### Shadows

- **`shadow-rest`** — default state on lifting elements (cards, toggles).
- **`shadow-hover`** — hovered/active state. Bigger, warmer. Pairs with `translateY(-3px)`.

### PopUp annotation layer

- **`popup-canvas`** — the wash applied to the page background when annotations are toggled on.
- **`popup-surface`** — annotation card background.
- **`popup-surface-elevated`** — hover/focused annotation card.
- **`popup-border`** — annotation card border, marker outlines.
- **`popup-text-primary`** — annotation body copy.
- **`popup-text-muted`** — annotation meta (kicker labels, source attributions).

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

### PopUp (annotation contexts only)

`bg-popup-canvas`, `bg-popup-surface`, `bg-popup-surface-elevated`
`border-popup`
`text-popup-primary`, `text-popup-muted`

---

## Paper grain

Light mode includes a subtle SVG noise overlay on `<body>::before`, blended with `mix-blend-mode: multiply` at opacity 0.55. The grain is fixed-position so it doesn't scroll, pointer-events-none, and sits at `z-index: 1` (content above at `z-index: 2`).

Dark mode transitions the overlay to opacity 0 — dark mode is ambient warm light, not paper. Do not add grain to dark mode.

Knobs (set in `globals.css`):
- Opacity 0.35 → almost subliminal
- Opacity 0.55 → current, "you can feel it"
- Opacity 0.75 → printerly

---

## Accessibility decisions

- **Body text hits AAA** in both modes. `text-primary` on `bg-canvas` measures ~14–15:1.
- **`text-muted` hits AA normal** (~5.5–6:1) at all body sizes.
- **`text-subtle` is AA-large only** (~3.5–4:1). Never use below 18px or 14px bold. Lint this.
- **Focus uses `outline` + `box-shadow`**, never `border-color`. Layout never shifts on focus. The halo extends the ring's visual presence without expanding hit areas.
- **Selection contrast verified** in both modes: `selection-text` on `selection-bg` hits AAA in light (~10:1) and ~7:1 in dark.
- **Link affordance is multi-channel.** Underline at rest, thicker + warmer on hover. Color alone is never the only signal.
- **`color-scheme`** is set per mode so native form controls and scrollbars adopt the right palette.
- **`prefers-reduced-motion`** is respected globally — transitions reduce to near-instant.
- **PopUp layer**: `popup-text-primary` on `popup-surface` hits AAA in both modes; `popup-text-muted` hits AA normal.

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

`body` has a 450ms transition on `background-color` and `color` for the soft fade. The paper-grain overlay (`body::before`) has its own opacity transition so it fades cleanly when toggling to dark. Other elements inherit values without transition — preventing dozens of staggered fades from feeling chaotic.

### First paint

`next-themes` injects an inline script that sets the class before paint, preventing flash-of-incorrect-theme. Keep `disableTransitionOnChange` off (default) so the user-initiated swap still gets the soft fade.

### Edge cases

- **Form controls and scrollbars** pick up native theming via `color-scheme`. Do not override.
- **Embedded media** (case study screenshots, video) will not theme. Plan compositions so they hold up against both canvases.
- **System preference changes mid-session** are handled by `next-themes` when `enableSystem` is true. Test once after wiring.

---

## Rationale

The decisions, in order of forking:

1. **Build on Paper & Low Light** — Bricolage Grotesque was designed for editorial typesetting and lives most naturally in warm neutrals.
2. **Warm-leaning hue axis** (50–80) — amber/sepia reads as studio, not corporate.
3. **No accent at rest** — chromatic restraint is the senior move. Forces typography, scale, and craft to do the work.
4. **Mirrored world, two designs** — same hue axis across modes, but tuned independently for distinct moods.
5. **PopUp takes a tint** — annotation layer carries the only chromatic identity that persists at rest.
6. **(v2) Interaction earns color** — hover, focus, selection get warm chromatic treatment as *moments*, not roles. Defensible because nothing chromatic sits at rest.
7. **(v2) Paper has real character** — visible chroma, layered surfaces, SVG grain. The canvas is cream stock, not generated white.

---

## Anti-patterns (no-fly list)

- ❌ **No accent color at rest.** Nothing in the base palette sits on the page chromatic and idle. If a future feature seems to need a resting accent, the answer is weight, scale, position, or motion.
- ❌ **No purple gradients.** Anywhere.
- ❌ **No raw color tokens** (e.g., `--color-blue-500`). All tokens are role-based.
- ❌ **No cool grays** (hue ≥ 200). The system is warm only.
- ❌ **No pure black or pure white.** Warmth lives in the neutrals.
- ❌ **Dark mode is not inverted light mode.** Tune chroma and contrast independently.
- ❌ **Don't use `--popup-*` tokens outside the annotation system.**
- ❌ **Don't extend interaction-state tokens (`--focus-glow`, `--selection-bg`, `--link-hover`) to resting roles.** They're moments, not paint.
- ❌ **No paper grain in dark mode.** Dark mode is ambient light, not paper.
- ❌ **Don't add tokens inline.** Extend this doc first, then add to `globals.css`.

---

## Open questions / future work

- **Imagery treatment.** Case study screenshots will sit on both canvases. A subtle outer ring at `border-subtle` is the current plan — verify when content lands.
- **Charts / data viz.** If case studies need charts, the chart palette is a separate (future) extension. Sequential warm-axis hues only; no categorical color.
- **Per-case-study tinting.** Each case study could pick up a faint hero-only tint drawn from its imagery. Out of scope for v1.
- **Active link state.** Currently links share the hover treatment when active. Worth revisiting if we add a "current page" indicator in nav.
