# HeroBlock — animation spec (deferred implementation)

**Status:** specification only. Not implemented. Awaits a Riley motion-review pass before any code lands.

The static `<HeroBlock />` is the locked deliverable (Phase 1 design + Phase 2 implementation). This document specifies the motion layer that COULD ride on top of it. Every move below earns its place by extending the typographic spec rather than decorating it — the H1's wdth-axis divergence (`wdth 100` ↔ `wdth 88`) is the keystone, and the most distinctive motion candidate is letting the axis itself animate.

## Principles

1. **CSS-only where possible.** The static component is server-rendered. Motion should stay CSS keyframes + transitions where the move allows it, so the component remains a server component and renders visible with JS off.
2. **`prefers-reduced-motion` respected unconditionally.** Reduced motion is opt-out, never opt-in. The motion-safe gate wraps every animated property.
3. **Each motion is justified.** No "everything fades up because it can." Each move below names *what the motion communicates*.
4. **No motion below 60fps.** Variable-font axis interpolation is GPU-cheap on modern engines, but worth flagging — see §5.

---

## 1. Entrance choreography

The brief specifies five staggered moves on initial paint:

| Order | Element | Move | Delay | Duration | Easing |
|---|---|---|---|---|---|
| 1 | `.hero-block__eyebrow` | fade in + translateY(0.5rem → 0) | 80ms | 380ms | `var(--ease-out-soft)` |
| 2 | `.hero-block__sentence--open` | fade in + translateY(1rem → 0) | 180ms | 480ms | `var(--ease-out-soft)` |
| 3 | `.hero-block__sentence--anxious` | fade in + translateY(1rem → 0) | 320ms | 480ms | `var(--ease-out-soft)` |
| 4 | `.hero-block__role` | fade in + translateY(0.75rem → 0) | 480ms | 420ms | `var(--ease-out-soft)` |
| 5 | `.hero-block__image-frame` | fade in + scale(0.98 → 1) | 600ms | 560ms | `var(--ease-out-soft)` |
| 6 | `.hero-block__callout` | fade in + translateY(0.625rem → 0) | 800ms | 460ms | `var(--ease-out-soft)` |

Implementation pattern (CSS-only, mirrors the existing `.hero-beat` stagger in `app/globals.css`):

```css
@media (prefers-reduced-motion: no-preference) {
  .hero-block__eyebrow,
  .hero-block__sentence,
  .hero-block__role,
  .hero-block__image-frame,
  .hero-block__callout {
    animation: hero-block-rise var(--dur, 420ms) var(--ease-out-soft) backwards;
    animation-delay: var(--delay, 0ms);
  }

  .hero-block__eyebrow            { --delay:  80ms; --dur: 380ms; }
  .hero-block__sentence--open     { --delay: 180ms; --dur: 480ms; }
  .hero-block__sentence--anxious  { --delay: 320ms; --dur: 480ms; }
  .hero-block__role               { --delay: 480ms; --dur: 420ms; }
  .hero-block__image-frame        { --delay: 600ms; --dur: 560ms; }
  .hero-block__callout            { --delay: 800ms; --dur: 460ms; }

  @keyframes hero-block-rise {
    from { opacity: 0; transform: translateY(1rem); }
    to   { opacity: 1; transform: translateY(0); }
  }
}
```

Per-element translateY values can stay uniform at 1rem for v1 and tighten to the differentiated values above if the visual feels uneven.

---

## 2. Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  .hero-block__eyebrow,
  .hero-block__sentence,
  .hero-block__role,
  .hero-block__image-frame,
  .hero-block__callout {
    animation: none;
  }
}
```

End state is the static composition. No "soft fade with no motion" compromise — that's worse than nothing for SR users who flagged reduced motion deliberately.

---

## 3. The wdth-axis traverse — signature move

This is the typographic motion that exists *because* Bricolage is a variable font. Without it, the entrance is conventional. With it, the H1's second sentence physically *travels* the axis from `wdth 100` (relaxed/French) to `wdth 88` (anxious/British) on load, settling into the spec value. The motion enacts the semantic shift the static spec already encodes.

**Two implementation options:**

### Option A — CSS-only via `font-variation-settings` interpolation

```css
@media (prefers-reduced-motion: no-preference) {
  .hero-block__sentence--anxious {
    /* Start at the relaxed register and travel to the anxious spec value. */
    animation: hero-anxious-compress 900ms var(--ease-out-soft) 320ms backwards;
  }

  @keyframes hero-anxious-compress {
    from { font-variation-settings: 'wght' 600, 'wdth' 100, 'opsz' 96; }
    to   { font-variation-settings: 'wght' 600, 'wdth' 88,  'opsz' 96; }
  }
}
```

The CSSWG spec says `font-variation-settings` is animatable per-axis as long as both endpoints declare the same axis tags. Modern engines (Chromium 113+, Safari 16.4+, Firefox 119+) honor this. The motion runs concurrently with the entrance fade — sentence 2 fades in while it traverses the axis, so the user sees it ARRIVE compressed, not flash and then squeeze.

**Pros:** server-component-safe; no JS; works with reduced-motion gate.
**Cons:** requires the axis tags to round-trip cleanly through the cascade (the cascade-order rule documented in globals.css applies — FVS must be the last declaration in the rule). The keyframes already declare both axis values explicitly, so this is satisfied.

### Option B — Framer Motion driving the axis

Useful if Option A's timing curve doesn't feel right after live render (e.g., the easing curve flattens the axis traverse and the move reads mechanical). Would force the component to opt into `'use client'`.

**Defer Option B unless A doesn't work.** Server-component status is more valuable than tuning headroom for one motion.

### Pairing with the entrance

The wdth traverse should land on the same delay tier as sentence 2's fade-up (320ms), so the two moves arrive together: sentence 2 fades into view AND compresses from wdth 100 to wdth 88 in one combined gesture. Reading order: sentence 1 has settled (visually present at wdth 100), then sentence 2 enters the eye AS it shifts to anxious. The static contrast becomes a kinetic event.

This is the strongest possible typographic moment in the portfolio. Riley reviews it before it ships.

---

## 4. Scroll-out

**None.** The hero is read-once on entry. Animating the hero on scroll-out would distract from the reading the section is meant to anchor.

If a future case study wants a parallax or pin pattern, that's a separate component, not a HeroBlock prop.

---

## 5. Performance budget

- All entrance properties (`opacity`, `transform`) are GPU-composited. No layout thrash.
- `font-variation-settings` interpolation: text re-rasterizes each frame across the animated range. At 80px display sizes, ~12 characters of sentence 2 = ~960 glyph rasters per frame. Modern engines cache per-axis-value, so the practical cost is 60 unique rasters over the 900ms duration. Below the perceptible-jank threshold on M1+ / Snapdragon 8 Gen 2+. Older mobile may stutter; verify on a baseline device.
- LCP: the hero `<Image>` has `priority` set. The entrance fade on `.hero-block__image-frame` should NOT delay LCP — verify with Lighthouse that the LCP timestamp lands at the image's first paint (when the fade STARTS at 600ms delay), not the fade END (~1160ms). If it does delay, drop the image's entrance animation and keep it visible from t=0.

---

## 6. Implementation hand-off (when go is given)

1. Add the keyframes + per-element delays from §1 to `app/globals.css` in the existing HeroBlock CSS block.
2. Add the `hero-anxious-compress` keyframe from §3 Option A.
3. Add the reduced-motion override from §2.
4. Verify LCP via Lighthouse on `/case-studies/uscg-bard`.
5. Verify the axis traverse renders smoothly on a baseline mobile (iPhone 12 / Pixel 6 class).
6. If Option A's easing feels mechanical, escalate to Option B (Framer Motion, `'use client'`).

No component code change required for Option A — the entire motion layer is CSS additions to `globals.css`. Server-component status preserved.

## 7. Open questions for Riley

1. **Stagger curve.** Should the cumulative entrance feel like one cascading gesture (small per-element delays, big overall arc) or like discrete arrivals (larger gaps, more punctuated)? The current spec is in between; the live render will tell.
2. **Sentence 2 settling.** Does the wdth traverse want to OVERSHOOT slightly (e.g., wdth 86 then settle to 88) for an editorial settling feel? Easy to add with a 3-stop keyframe.
3. **Callout entrance.** A subtle scale-from-95% might give the callout a "popping into the conversation" feel better than pure translateY. Defer to the live eyeball.
