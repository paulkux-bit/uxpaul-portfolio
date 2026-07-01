# Resolutions bento — settled architecture (read before Themes 2 & 3)

Status: **decided.** Applies to all three Resolutions bento themes (01 how you file,
02 how you see, 03 how you count). Don't re-litigate the render path per theme.

## The decision

**Resolutions bentos render through the bento engine** (`components/bento.tsx`
`BentoTheme` + `lib/bento-slots`), not as standalone per-theme components.

A thin **manifest → BentoTheme adapter** maps each theme's crop manifest to engine
children. One adapter, reused for all three themes. Different manifest per theme, same
renderer.

## Why (so it isn't reopened)

- The crops were **cut for the engine.** `crop.py` reads `lib/bento-slots.json`, so
  native crop aspects match the engine slots exactly (0.75 standard, 1.60 feature,
  14.19 ribbon, the bands). Cover-to-slot is effectively a no-op — no cropping cost.
- **Fixed-mix is the engine's native behavior** ("images never swap with theme"). The
  manifest `mode` field is just the src you hand each tile.
- **One renderer = no drift** across three themes. Standalone would be three components
  and three chances to diverge on responsive sizes, retina floors, ribbon mobile-scroll,
  and caption baseline-lock — all of which the engine already owns via the slot SSOT.
- The chip-strip 1.7x narrowing is handled by the ribbon breakout in the engine; it does
  not need hand-building.

The standalone `Resolutions01Bento.tsx` (from the pre-engine reference) is **throwaway.**
It was written before the engine was known.

## The adapter contract

Map manifest → `BentoTheme` children:
- `breakout: "ribbon"` → `BentoRibbon`
- `breakout: "band"` → `BentoBand`
- otherwise → `BentoItem` with `slot` = the tile's slot, and `mode` → pick the light/dark src
- `focalPoint` → object-position (engine already does cover + focal)
- caption = bold lead + muted tail via the `text-primary` / `text-secondary` role
  utilities (NOT `text-[--...]` arbitrary syntax, NOT raw `text-lg`)

**The one place bugs hide:** breakout ordering leans on the engine's anchor logic.
Re-verify the composition order against the manifest `layout`/`composition` array per
theme — this is the per-theme verification step, not a reason to fork the renderer.

## Guardrails (all three themes)

- **Fixed-mix, not a theme toggle.** Each tile is pinned to its manifest `mode`.
- **Manifest is the single source of truth for the mix.** Changing any `mode` needs
  Paul's sign-off; the council proposes options, Paul decides.
- **Sandbox first.** Build on `/sandbox/show-the-work`; the real `uscg-bard.mdx` route
  stays untouched until all three themes exist and Paul merges them.
- **Manual commits.** Claude Code stops at "show diff"; Paul commits. Engine work lands
  as its own commit before the theme commit rides on top.
- Engine-internal cleanup (e.g. the dead `SLOT_MAX_WIDTH` / `CONTAINER` / `RETINA_DPR`
  exports) is engine-work, kept out of theme diffs.

## Per-theme checklist (Themes 2 & 3)

1. Cut crops in the theme's crop session (crops read `bento-slots.json`, so they fit).
2. Produce the theme manifest (`images` + `layout`/`composition` with per-slot `mode`).
3. Run through the same adapter; re-verify breakout/anchor ordering vs. the manifest.
4. Council A/B on the light/dark mix; Paul approves before any `mode` change.
5. Gates: tsc → eslint → build → detector/typeset (Impeccable) → show diff → Paul commits.
