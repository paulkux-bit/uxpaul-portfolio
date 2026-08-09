# Unspecified surfaces

Both design systems — `type-system-v3-locked.md` and `spacing-system-v1-locked.md`
— end with a §9 listing what they deliberately do not govern. Four entries
appeared on **both** lists, which means they are one piece of work rather than
two. This file is that list, and both §9s point here. A fifth entry has since
arrived from the colour system.

Created 8 Aug 2026.

---

## The five

*Four entries at creation; **pinned specimen tones** joined them on 8 Aug 2026,
found by the K4 colour-literal census. It is the only one that comes from the
colour system rather than from type and spacing, and the only one already
shipping wrong values.*

**Nav.** Type sizes, weights and the spacing between items. Neither system
assigns it a rung or a step.

**Footer.** Same, plus the relationship between the footer's top boundary and
the last section above it — which is a section-break question the spacing
system has an answer for and does not currently apply here.

**Buttons.** Internal padding, label type, and the relationship between the two.
This is the surface most likely to want its own module rules, since a button's
padding is a function of its label size rather than of the page rhythm.

**Card meta.** Density, the type rung for the `project · client` strip, and the
gap between the strip and the headline above it.

**Pinned specimen tones.** A colour whose job is to **not** follow the theme:
the light and dark cells of a `ModePair` comparison, and the fixed placeholder
tones standing in for fixed-pixel screenshots. A light cell must stay light
while the page is in dark mode, so no semantic token can serve it — every one
of them swaps by mode. Eight literals in `app/globals.css`.

Two constraints on any resolution:

1. **The specimen must track the palette, not freeze a colour.** A pinned value
   is the palette written down a second time, and it goes stale the moment
   layer 1 moves. A `--specimen-*` pair would only relocate the problem. The
   correct answer is a specimen that references **the other mode's actual
   value**, which requires the token layer to expose light and dark **by name**
   rather than only through the cascade. That is a layer-1 restructure, and it
   is why this is deferred rather than patched.
2. **`.mode-pair__cell--dark .mode-pair__label`'s
   `color-mix(…, 10%, transparent)` must come back as a token plus alpha, not
   as a literal mix carried forward.** R1 permits the alpha — a label plate is
   a state layer, not a named surface — but the mix's *base* is one of the
   stale literals below, so it must not survive the cleanup by looking like it
   was already considered.

**They are already wrong.** Measured against v2, these fossilise the pre-v2
palette:

| | literal | v2 equivalent | drift |
|---|---|---|---|
| light cell | `0.985 0.004 75` | canvas `0.978 0.016 76` | ¼ the chroma |
| dark cell | `0.170 0.012 55` | canvas `0.165 0.006 55` | 2× the chroma |
| light placeholder | `0.970 0.008 80` | canvas `0.978 0.016 76` | ½ the chroma |
| dark placeholder | `0.220 0.012 60` | surface `0.205 0.014 57` | drifting |

Lightness is nearly right in every case and chroma is wrong in both directions,
so together they depict a light mode that is almost neutral and a dark mode
warmer than its own ground. That is precisely the palette v2 was built to
replace, inverted.

**Whoever resolves this is enabling something, not fixing something.** Both are
live-capable dead CSS today:

- `ModePair` is registered in `mdx-components.tsx` and used in **zero** `.mdx`
  files.
- The bento tones render **only** when a manifest sets `tone`, and no manifest
  currently does. The class is emitted by `components/bento.tsx`, which the
  BARD and FDT-E case studies both use — it is not sandbox-scoped, whatever the
  old comment claimed.

**This is now a property of the repo, not a run of bad luck: five kinds.**
`ModePair`, the bento tones, `CardMediaSlot` (resolved by deletion in
`099a172`), the takes wall (`components/takes/*`, rendered on no route), and —
found while migrating radius in I3 — five styled surfaces that return zero
instances on every route: `.mode-pair__cell`, `.mode-pair__label`,
`.figure-placeholder`, `.hero-block__image-frame .figure-placeholder` and
`.figure--constrained-bleed .figure__image`.

Every migration so far has paid to move CSS that reaches no reader, and twice a
spec has claimed a visible change that could not be seen. Recorded so the next
person weighs deletion against migration; **not** an invitation to go hunting for
a sixth.

Setting `tone` on a manifest, or dropping a `ModePair` into a case study, ships
a widget that misrepresents the site's own colour — on a portfolio whose thesis
is colour judgement. All eight are allowlisted in `scripts/lint-color.mjs`
under `ALLOWLIST.specimens`, with the reason attached to each, so the lint
keeps surfacing them rather than absolving them.

---

## Why they are together

A button has type inside it and spacing around that type; specifying one
without the other produces a button that is correct in two documents and wrong
on screen. The same is true of nav items, footer rows and card meta.

Doing these once, against both specs, is the only way they agree. Doing them
separately guarantees that in six weeks the two documents describe the same
button differently — which is the precise failure both migrations spent a week
eliminating.

---

## What "done" would mean

Each surface gets: a type rung (or a written exception with a reason), a
spacing step for its internal padding, and a stated position on its boundary
with whatever sits above and below it. Then both §9s lose these entries and
this file is deleted rather than becoming a third place where the answer lives.

---

## Not on this list

**Print** is genuinely open in both systems and genuinely low value — nobody
prints a portfolio. It stays in both §9s as an acknowledged gap, not a task.

**Type states** (hover, focus, visited, disabled, `forced-colors`,
`prefers-contrast`) are type-system-only and larger than these five. They stay
in the type §9.

**Bento and small-multiples grid gaps** are spacing-only and may want their own
module rules, the way the takes wall does in the type system. They stay in the
spacing §9.
