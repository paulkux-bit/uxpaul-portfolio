# The uxpaul.com colour system — v2, locked

Decided 8 Aug 2026. Supersedes the palette values in `docs/color-system.md`,
which remains the owner of the palette's *rationale* and its accessibility
floors. Where the two disagree on a value, this document wins.

Nothing here changes `type-system-v3-locked.md` or `spacing-system-v1-locked.md`.
That is a constraint, not a coincidence — see §2.

---

## The rulings

| # | Decision | Ruling |
|---|---|---|
| 1 | Dark ground | **Quiet.** Near-neutral at the base, warmth rising with elevation |
| 2 | Light surfaces | **Deepened.** Canvas held; the three below it dropped for separation |
| 3 | Where warmth lives | **On the objects, not in the air** |
| 4 | Opacity | **None, anywhere in the palette.** Solid tokens only |
| 5 | Accent | **None at rest.** The warmth is the colour |
| 6 | Architecture | **Two layers.** Tuning primitives, then semantic roles |
| 7 | Enforcement | **`npm run lint:color`**, beside `lint:type` and `lint:space` |

---

## 1. Why this changed

The dark mode read muddy. That was not taste; it was measurable.

**Dark surfaces ran the red channel at 2–4× the blue. Light surfaces ran it at
1.09–1.14×.** Identical oklch chroma values in both modes, opposite perceptual
results — because at L 0.975 a chroma of 0.018 spreads the channels by 9%, and
at L 0.165 a chroma of 0.020 spreads them by 300%. `bg-sunken` was
`rgb(12, 6, 3)`: red four times blue, at near-black. There is no luminance at
that lightness to read a hue with, so the bias registers as contamination.

The palette was also **inverted in chroma discipline**: backgrounds carried
42–50% of the chroma their lightness could physically hold, while the text
ramp — where chroma is safe and expressive — sat at 9–15%.

**And the ground was never espresso.** Real espresso, coffee and dark wood
measure **L 0.25–0.39** with chroma 0.031–0.050. The entire dark stack topped
out at L 0.255; the lightest surface barely reached the darkest reference. The
references are *more* chromatic, at lightness where chroma can be seen.

Two directions followed from that. **Espresso** — lift the ground into the
reference range. **Quiet ground** — hold the lightness, drop the chroma at the
base, and let warmth rise with elevation. Quiet ground was chosen: it is the
"slightly warm near-black" that reads cozy and editorial, and it is subtraction
rather than addition, which the project's governing principle asks for.

---

## 2. The constraint that shaped every value

**No change may weaken the type system's contrast guarantees.** Type §3.5
assigns a colour role to every rung and records a measured ratio for each.

Two properties keep that safe. In dark, the correction is **chroma-only** —
lightness is untouched, so contrast moves by at most 0.04. In light, the
surfaces get **darker**, which can only increase contrast against dark text.

Every text-on-surface pair was measured, not assumed. See §5.

---

## 3. Architecture — two layers

The old palette baked lightness, chroma and hue into each semantic token,
twenty-four times over. Warming the whole thing meant editing twenty-four
values by hand and hoping they stayed coherent — which is how it drifted into
muddiness in the first place.

Type and spacing are already two-layer: `--wdth-display: 94` is a primitive and
selectors consume it, which is why width migrated in one commit. Colour was the
only system where the semantic token *was* the raw value.

**Chroma is a unit and integer multipliers — no offsets needed.** Measured
8 Aug 2026: all 24 chroma values in both modes are **exact multiples of
0.002**, with multipliers 2, 3, 6, 7, 8, 9, 10, 11, 13, 14, 15, 17 and 20. No
remainders. So the whole palette's chroma expresses against a single unit with
no arithmetic beyond multiplication, and **without changing a single shipped
value.**

**Hue is a band primitive plus a signed degree offset.** Chroma does not need
offsets; hue does, because the bands carry real internal variance — light
grounds span 66–76, dark grounds 55–60.

**Primitives use the same names in both modes, redefined in `.dark`.** Not
separate `-light` and `-dark` names. The decisive evidence is that **the bands
swap between modes**: light text sits at hue 55 while light grounds run 66–76,
and dark text is 68–78 while dark grounds run 55–60. One vocabulary makes that
inversion legible as a per-mode setting of the same role. Two vocabularies
would hide it and let the modes drift apart silently.

```css
:root {
  --chroma-unit:  0.002;   /* one knob for warmth intensity, both modes */
  --hue-ground:   70;      /* grounds and their borders */
  --hue-surface:  68;      /* raised surfaces */
  --hue-text:     55;      /* the text ramp */
}
.dark {
  --hue-ground:   55;
  --hue-surface:  60;
  --hue-text:     74;
}
```

```css
/* Layer 2 — roles. Composed, never independent. */
--bg-canvas:     oklch(0.165 calc(var(--chroma-unit) *  3) var(--hue-ground));
--border-default: oklch(0.310 calc(var(--chroma-unit) * 10) calc(var(--hue-ground) + 3));
```

**R4 is about dependence, not about literals.** A literal *value* makes a token
independent — it stops moving when the primitive moves, which is how the last
palette drifted. A literal *offset* preserves dependence: the token still
follows its band. Multipliers and degree offsets are therefore legal; a bare
`oklch(0.310 0.020 58)` is not.

**The test of this architecture is one question: if the dark still reads too
cool in six months, how many values change?** Warmth intensity is
`--chroma-unit` — one. Warmth direction is one hue per band. Under the old
structure it was twenty-four hand-tuned triples.

---

## 4. The tokens

Hex is given for reference only; `oklch` is the source of truth.

### Light — deepened

| Token | oklch | hex | |
|---|---|---|---|
| `--bg-canvas` | `0.978 0.016 76` | `#fef7ec` | changed |
| `--bg-surface` | `0.948 0.022 72` | `#f7ecde` | changed |
| `--bg-surface-elevated` | `0.918 0.026 68` | `#f0e1d2` | changed |
| `--bg-sunken` | `0.900 0.028 66` | `#ebdbcb` | changed |
| `--text-primary` | `0.215 0.018 55` | `#201712` | |
| `--text-secondary` | `0.355 0.020 55` | `#443932` | |
| `--text-muted` | `0.485 0.022 55` | `#695c53` | |
| `--text-subtle` | `0.590 0.020 60` | `#877b72` | **changed — see §5** |
| `--border-subtle` | `0.905 0.030 66` | `#eedccb` | changed |
| `--border-default` | `0.855 0.034 60` | `#e1cbba` | changed |
| `--border-strong` | `0.760 0.040 55` | `#c6ab99` | |
| `--border-interactive` | `0.500 0.018 50` | `#6c605a` | |

Canvas is held at the top and the three surfaces below it drop. Separation goes
from `0.023 / 0.022 / 0.015` to `0.030 / 0.030 / 0.018`, so a card reads as an
object rather than as a slightly different patch of page — without the canvas
itself getting heavier.

### Dark — quiet ground

| Token | oklch | hex | |
|---|---|---|---|
| `--bg-canvas` | `0.165 0.006 55` | `#100e0c` | changed |
| `--bg-surface` | `0.205 0.014 57` | `#1c1611` | changed |
| `--bg-surface-elevated` | `0.255 0.026 60` | `#2c2016` | changed |
| `--bg-sunken` | `0.130 0.004 55` | `#080706` | changed |
| `--text-primary` | `0.945 0.012 78` | `#f1ece4` | |
| `--text-secondary` | `0.825 0.014 76` | `#cbc5bc` | |
| `--text-muted` | `0.705 0.016 72` | `#a69f95` | |
| `--text-subtle` | `0.565 0.018 68` | `#7d746b` | |
| `--border-subtle` | `0.245 0.014 57` | `#261f1a` | changed |
| `--border-default` | `0.310 0.020 58` | `#382e26` | changed |
| `--border-strong` | `0.430 0.026 55` | `#5b4c42` | changed |
| `--border-interactive` | `0.620 0.020 60` | `#90847a` | |

**Lightness is untouched.** Every dark change is chroma and hue only. Channel
bias falls from 3.0× to 1.33× at the canvas, while chroma climbs **6.5×** from
ground to elevated — so the page steps back toward neutral and the card, the
elevated surface and the warm cream text carry the warmth. That is ruling 3.

---

## 5. Verified, not asserted

Every text role against every surface, both modes. Floors: AA-normal 4.5,
AA-large 3.0.

**Dark — zero failures.** Worst case is `--text-subtle` on `elevated` at 3.46.
`--text-primary` ranges 13.48–17.12.

**Light — one failure, and it is pre-existing. Corrected 8 Aug 2026.**

An earlier draft of this section claimed deepening the surfaces *caused*
`--text-subtle` to fail. It does not. Measured against the **current** light
surfaces on `main`, `--text-subtle` at `L 0.625` already returns **2.91 on
elevated and 2.78 on sunken** — both below the 3.0 AA-large floor, live in
production today. Deepening makes it worse (2.80 / 2.65); it does not create
it.

`docs/color-system.md` describes that role as "AA-large only (~3.5–4:1)",
which overstates it by roughly a full point. That is the second accessibility
floor in this repository written down once and never measured — the first was
the 18px-for-18pt substitution corrected during the type migration, in the
same file.

The fix is unchanged: `--text-subtle` moves to **L 0.590**, clearing 3.0 on
every surface at 3.04 worst case. But the reason is now correctly stated —
this migration **repairs a shipped WCAG failure** rather than avoiding one it
would have introduced.

`--text-subtle` moves to **L 0.590**, which clears 3.0 on every surface — 3.04
at the worst case, sunken. The cost is that its gap to `--text-muted` narrows
from 0.140 to 0.105. That is accepted: separation was the point of deepening,
and `--text-subtle` is already restricted to large text only.

---

## 6. Rules

**R1** No opacity in the palette. Every colour token is solid. State layers,
scrims and shadows may use alpha; nothing that names a surface, a text role or
a border may.

**R2** No accent at rest. The warmth is the colour. The retired persimmon
stays retired.

**R3** Warmth rises with elevation. Chroma at a ground is a liability; chroma
on a raised surface is the design. Any new surface token continues the climb.

**R4** No semantic token may be **independent of the primitives.** Compose every
one from layer 1: chroma as `calc(var(--chroma-unit) * n)`, hue as the band
primitive with an optional signed degree offset. Lightness is authored directly
— it is the one component that carries no temperature and has no band.

The rule is about dependence, not about the presence of a number. A literal
value stops following its primitive, which is how the last palette drifted into
muddiness one hand-tuned token at a time. A multiplier or an offset keeps
following it.

**R5** Contrast is measured, not estimated, and the measurement is written
down. Any new pairing states its ratio.

**R6** Light and dark are separate designs, not inversions. They already differ
in hue, chroma and separation, and should.

---

## 7. Enforcement

`npm run lint:color`, beside `lint:type` and `lint:space`, gating the build.
Fails on:

1. Any colour in `#hex`, `rgb()`, `hsl()` or a named CSS colour. Everything is
   `oklch`.
2. Any alpha on a token naming a surface, text role or border — `oklch(… / …)`
   or `color-mix` with `transparent`. R1.
3. Any semantic colour token authored as a literal `oklch()` rather than
   composed from a layer-1 primitive. R4.
4. Any text-on-surface pair whose measured contrast falls below its floor —
   4.5 normal, 3.0 large. Computed from the tokens, not trusted.
5. Any `color-mix(… currentColor …)` on a text colour. Carried over from the
   spacing migration's §3.5 rule: mix to author a token, never to apply one.
6. Any referenced colour token without a definition. Carried from
   `lint:space` assertion 7 — checking that a name is legal is not checking
   that it exists.

**Prove every assertion in both directions before any value moves.** Four
checks in the spacing migration passed for a reason other than the one
intended. Write one deliberately failing case per rule first.

That discipline paid for itself inside one commit here. Assertion 2 went
**silent** on a real alpha because it keyed a map by property name, so `:root`
and `.dark` collided and only the last definition survived. Fifth
wrong-reason pass across three migrations, and the first caught before any
value moved.

**Compare pixels, not strings.** Proving K1's zero-change property by string
comparison failed twice for reasons that had nothing to do with colour:
Chrome preserves an authored `oklch()` for a directly-set value but resolves
anything containing `calc()` through to `lab()`, and routing a literal through
an unregistered custom property does not help, because that substitutes
textually while a `calc()` forces computation. Both reported differences that
did not exist on screen.

The proof that held rasterises each colour to a 1×1 canvas and compares RGBA
integers — format-independent, and it is what actually reaches the eye. **A
check reporting a difference real in the string and absent in the pixels is as
wrong as one that passes for the wrong reason.**

---

## 8. Anti-patterns

Chroma at a ground. Opacity as a colour. An accent chosen because the palette
felt plain. Inverting light to make dark. Hand-authoring a semantic token.
Matching light and dark chroma values and expecting matching results — that is
the exact error this version corrects.

---

## 9. Still open

The `--qh-*` brand shelf colours, which are the one place chromatic colour is
sanctioned and have not been re-derived against the new grounds. Selection and
link-hover colours. Focus ring and glow, which currently use alpha and are the
one legitimate exception to R1 — this should be stated explicitly rather than
tolerated. Charts and status colours, which do not exist yet and should be
added deliberately rather than pre-emptively.

Nav, footer, buttons and card meta are tracked in `unspecified-surfaces.md`
alongside their type and spacing gaps, because they are one piece of work.
