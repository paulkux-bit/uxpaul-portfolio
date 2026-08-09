## Before you author anything new

This applies to a new case study, a new component, a new page, or any surface
that does not exist yet. Read it before writing, not after. Strategic
direction — audience, brand personality, references, design principles,
accessibility floor — lives in `PRODUCT.md`; read that too and defer to it on
judgment calls.

### 1. Every locked spec is canonical

The canonical set is **every file matching `docs/*-locked.md`**, not the list
below. The list is a convenience that the gate keeps honest. Read all of them
before authoring. Where anything else disagrees — this file, an older doc, a
code comment — the locked spec wins, and the disagreement is a bug to fix in
the other place.

| System | Spec | Gate |
|---|---|---|
| Type | `docs/type-system-v3-locked.md` | `npm run lint:type` |
| Spacing | `docs/spacing-system-v1-locked.md` | `npm run lint:space` |
| Colour | `docs/color-system-v2-locked.md` | `npm run lint:color` |
| Interaction | `docs/interaction-system-v1-locked.md` | `npm run lint:interaction` |

This table is checked against the filesystem rather than maintained by hand. A
`docs/*-locked.md` with no row here fails the gate, and so does a row naming a
spec or a script that does not exist. When a new system is locked, the check
fails until the row is added — that is the point. Do not resolve a failure by
deleting the row or the spec.

Superseded, kept for their history and their non-value material, and **never**
to be implemented from: `docs/typography-system.md` (superseded in full) and
`docs/color-system.md` (palette superseded; still owns the `--qh-*` brand
shelf, paper grain, the swap protocol and the role map).

### 2. Every value comes from a token

Colour, spacing, radius, duration, icon size, icon stroke, type size and
width. No literals, no prefab Tailwind scales. Every linter scans `.mdx` and
`.tsx`, not only CSS, so a hardcoded value inside a case study fails the build
exactly as one in `globals.css` would.

### 3. A token is not the same as the right token

The gates check membership, not correctness. A heading on rung 4 where rung 3
belongs passes every check. `--duration-card` applied to a nav link passed the
duration check and was caught only by a purpose-built mapping guard. Read each
spec's intent, not just its token list. When the correct token for a surface
is not obvious, say so and ask rather than picking the nearest one — a wrong
token that lints clean is harder to find later than a literal.

### 4. A surface no spec governs is a finding, not a licence

New case studies arrive with bespoke components, and each one is a surface the
systems have never seen. If a new surface needs a rule no locked spec
provides, add it to `docs/unspecified-surfaces.md` with what it needs and why.
Do not invent a local answer. That file is the single list; when an entry is
resolved it moves into the owning spec and leaves, rather than becoming a
third place the answer lives.

### 5. Run every gate before calling anything done, and report the result

`npm run build` runs the gates that are wired in; run any others by name.
State the result, pass or fail, every time. A commit has already landed in this
repo with a red test and a report that did not mention it — the only thing
that catches that is saying the number out loud.
