# Structural tells — the visual skeleton

Structure is the tell that survives every font swap, palette change, and icon set. A page can pass every copy check and still read as AI from its shape. Audit this first.

Each category lists what to look for and, where possible, the countable threshold. The countable ones come out of `grep-pass.sh`; the shape ones need a read of the source or the render.

---

## The marketing-page skeleton

The shape you can name before it finishes rendering. Fire a finding for each element present, and a **High** finding if most of them are present together:

- Centered hero, everything stacked and centered.
- A pill badge above the headline ("New", "Introducing").
- Headline + one-line subhead + two buttons side by side.
- A soft radial gradient behind the hero.
- A three-column feature grid, icons in rounded squares.
- A "Trusted by" logo strip.
- Alternating image-left / image-right sections, all roughly the same height.
- Three testimonials.
- An FAQ accordion.
- A dark, full-width CTA band.
- A four-column footer.
- Everything in one max width, every section the same vertical padding, the same spacing rhythm from first section to last.

Paul's `05-anti-patterns.md` already bans most of these by name (three-column feature grids, gradient hero blobs, stock testimonials, carousels). This audit confirms none crept back into the build.

## The product-app skeleton

Less relevant to a portfolio, but check any dashboard-like case study screen:

- 240–260px sidebar, avatar bottom-left.
- Top bar: search, bell, avatar.
- Four stat cards in a row: big number, small label, green/red percentage with an arrow.
- One large chart card, then a table with avatar-plus-name cell, a status pill, a three-dot menu.
- Empty state: centered icon in a pale circle, two lines of copy.

## Surface treatment (countable — from the grep pass)

- **Distinct border-radius values.** One intended value on this site (zero is valid). Flag more than two distinct radii in a screen; alarm at four or more. Nine radii means no system.
- **One accent, everything else neutral.** Paul's rule: persimmon reserved for the PopUp layer, everything else derived from text-primary. Flag any second chromatic accent, any raw Tailwind palette name, any hex or rgb (the whole site is oklch role tokens).
- **Border-and-shadow on every card.** The AI default puts both on every card. Paul's system picks one elevation per surface and bans nested cards. Flag both-on-everything and any nested card.
- **Gradient on one word of the headline.** Banned outright (`05`). Grep for gradient text utilities near an h1.
- **Backdrop-blur nav on scroll.** Common tell. Not banned outright, but flag it as a middle-of-the-distribution choice to confirm it was decided.
- **Lucide icons at 20px, 1.5 stroke.** The default icon look. Paul's nav is words, not icons (`05`); flag icon-heavy nav.
- **Fade-up 20px over 400ms on every section, 2px card lift on hover.** The default motion. Paul's motion is a brand element and respects reduced-motion; flag uniform fade-up-everything as undecided motion.

## Type behavior (partly countable)

- **Distinct font-size values.** Too few (largest text barely larger than body) means no hierarchy. Too many means no scale. Read the render for whether the hero actually dominates.
- **Timid scale.** The largest text is not much larger than the body. On this site the name at display size is meant to carry the page; if it does not visually dominate at 1440, flag it.
- **Uniform line height across sizes.** Display and body on the same line height is a tell. Display should tighten.
- **No letter-spacing adjustment on display.** Read for it.
- **Measure running the full container width** instead of stopping near 65 characters. Flag long-line body copy.

## The divergence-ledger read

For each surface, write the two lines and judge them:

```
<surface>
  Default: <the middle-of-the-distribution move for this surface>
  Instead: <what the built surface actually does>
```

If "Instead" is the default with more spacing, it did not diverge. Paul's locked docs supply the intended "Instead" for the hero, type, color, and components; this audit checks the build still matches. A drifted surface is a **Medium** finding; a surface that matches the default outright is **High**.

## Countable thresholds (quick reference)

| Check | Pass | Flag | Alarm |
|---|---|---|---|
| Distinct border-radius values in a screen | 1 | 3 | 4+ |
| Distinct chromatic accents | 1 (persimmon, reserved) | 2 | 3+ |
| Hex / rgb colors anywhere downstream | 0 | any | — |
| Distinct font sizes with real hierarchy | 4–6 stepped | 2–3 flat, or 9+ | — |
| Marketing-skeleton elements present together | 0–1 | 3 | 6+ |
| Em dashes per paragraph | ≤1 | 2 | 3+ |
