# Unspecified surfaces

Both design systems — `type-system-v3-locked.md` and `spacing-system-v1-locked.md`
— end with a §9 listing what they deliberately do not govern. Four entries
appeared on **both** lists, which means they are one piece of work rather than
two. This file is that list, and both §9s point here.

Created 8 Aug 2026.

---

## The four

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
`prefers-contrast`) are type-system-only and larger than these four. They stay
in the type §9.

**Bento and small-multiples grid gaps** are spacing-only and may want their own
module rules, the way the takes wall does in the type system. They stay in the
spacing §9.
