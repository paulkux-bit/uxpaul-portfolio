# The spacing system — assessment

Written 7 Aug 2026, after the type system v3 migration closed. Audit of what
`uxpaul-portfolio` does today, what the reference systems do, and what should
change. **Not a spec.** The spec follows once the direction is agreed.

---

## 1. What you have, measured

**Nineteen distinct spacing values** across margin and padding (**corrected: the
audit found three more — `0.125rem`, `0.55rem`, `0.6rem` — and higher counts on
four of the seven off-grid values; see the locked doc §6**): 0.25, 0.35,
0.4, 0.5, 0.625, 0.75, 0.875, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 3.5, 4, 5, 6,
8rem. Twelve more in `gap`, overlapping but not identical.

~~**Roughly 200 media-query blocks touch spacing**, across six breakpoints: 640,
767, 768, 899, 1024 and 1920.~~ **CORRECTED 8 Aug 2026: 25 blocks, 36
declarations, eight params.** 200 counted every declaration inside `@media` of
any property (179) or every rule block inside one (94). See the locked doc §6.

**Exactly one `clamp()` appears in spacing** — `padding: clamp(2rem, 4vw,
3.5rem) clamp(1.5rem, 3vw, 3rem)` at `globals.css:1429`.

Compare the system that just shipped: **three width values, five weights,
eight type rungs, every rung fluid, crossovers aligned, ratios verified by
computation across 320–2560, nine assertions gating the build.**

Type and spacing are opposite architectures living in the same stylesheet.

### On a grid?

On a 4px grid, four values are off: 0.35rem (5.6px), 0.4rem (6.4px), 0.625rem
(10px), 0.875rem (14px). On the 8px grid the docs imply — `02-design-system.md`
calls 1.75rem "an accidental off-grid" value, which only makes sense at 8px —
seven of nineteen are off.

The grid is not actually decided. It is asserted in one doc and contradicted
by the CSS.

---

## 2. The core problem, quantified

Because type is fluid and spacing is fixed, **every space-to-type relationship
involving a fluid rung drifts continuously across the viewport range.**

Section break (`6rem`, stepping to `8rem` at 1920) against rung 4, the section
heading (`clamp(1.875rem, 3vw + 1rem, 3.25rem)`):

| Viewport | Heading | Section break | Ratio |
|---|---|---|---|
| 390 | 30.0px | 96px | **3.20** |
| 768 | 39.0px | 96px | 2.46 |
| 1024 | 46.7px | 96px | 2.05 |
| 1200 | 52.0px | 96px | **1.85** |
| 1919 | 52.0px | 96px | 1.85 |
| 1920 | 52.0px | 128px | 2.46 |

**The ratio drifts 73% across 390–1919, then snaps 33% in a single pixel.**

Meanwhile the evidence step against body text holds flat at 1.78 the whole
way, because both are fixed. So the system is *half* stable: relationships
anchored to the 18px body never move, and relationships anchored to any fluid
rung swing wildly.

That asymmetry is why a page can feel correct at 768 and 1440 — the viewports
someone eyeballed — and subtly tight around 900 or loose around 1600. It is
not a taste failure. It is arithmetic, and it is the same class of defect as
the 1.03 rung convergence: only visible between the widths anyone checks.

---

## 3. What is already good and must survive

**The three-tier spine is a real semantic system**, not a pile of values:
1.5rem intimate (within a tight unit), 2rem the evidence step (prose →
screenshots), 6rem section break. Most portfolios have no such vocabulary.
Whatever replaces the values must keep these three meanings.

**The single-owned-gap rule is genuinely sophisticated.** Where a paragraph
meets a component, one side owns the gap — paragraph `margin-bottom: 0`, the
component carries `margin-top` — so it is collapse-agnostic. Keep verbatim.

**`.friction-beats` at 3.5rem is a named, owned exception**, documented as
deliberate mid-tier. That is the same discipline as §6 exception surfaces in
the type system, and it is the right pattern.

**`:where(.case-study-prose) p`** keeps prose defaults at specificity (0,0,1)
so component margins win at the root. This solved a real phantom-margin bug.
Keep.

---

## 4. What the reference systems do

**Utopia — space derives from type.** Take step 0 of the fluid type scale as
the base unit and multiply it into T-shirt steps. Because the base is fluid,
every space unit "subtly shrinks and grows according to screen size" without a
single breakpoint. It also introduces **pairs**: one-up pairs interpolate from
one step to the next (S → M) across the viewport range, and custom pairs allow
steep slopes (XS → 3XL) for hero sections or reverse slopes that *decrease* as
viewports grow. This is the mechanism your section breaks currently fake with
a 1920px media query.

**Wise — vertical and horizontal are not the same axis.** From their spacing
refresh: "All vertical spacing tokens scale to support clearer visual
separation as text sizes increase. Horizontal spacing only scales in specific
cases, such as when elements scroll off the screen." Their scale ties to *text
size*, including user accessibility settings, not only to viewport. Their old
system failed on four counts worth checking yourself against: unclear naming,
T-shirt sizes without meaning, no accessibility scaling, and components with
hardcoded spacing.

**REI Cedar** ships a documented fluid foundation on the same principle.

The common thread across all three: **space is derived, not chosen.** Yours is
currently chosen — nineteen times.

---

## 5. Recommendation

**Derive a fluid space scale from the type ladder**, exactly as width was
derived from the rung. The type system already proved this pattern works and
already provides the base: rung 1 body at a fixed 18px, or rung 0.5 support at
16px, is step 0.

Then:

- **Keep the three semantic tiers.** Intimate, evidence step, section break
  stay as names. Only their values become fluid.
- **Make section break a pair, not a step.** It should interpolate from its
  mobile value to its desktop value across the range, which removes the
  1920px snap and the 73% drift in one move.
- **Adopt Wise's asymmetry.** Vertical spacing scales; horizontal padding
  mostly holds. They are different jobs and conflating them is why gutters go
  cavernous on wide screens.
- **Decide the grid, once.** 4px or 8px, stated in the spec, and kill the four
  or seven off-grid values accordingly.
- **Enforce it.** `lint:type` proved the gate is what makes a system real. A
  spacing assertion set belongs in the same script: no raw spacing value
  outside the scale, no new breakpoint override without an allowlist entry.

**This is not a rewrite.** The semantic vocabulary survives intact, the
structural rules survive verbatim, and the migration shape is the same one
that just worked: land tokens, migrate values, retune, enforce, adopt.

---

## 6. Open questions — these are Paul's calls

1. **4px or 8px grid?** The docs imply 8; the CSS uses 4-and-finer in seven
   places. One has to give.
2. **Does spacing scale with user text-size settings, as Wise's does?** That
   is an accessibility position, not a visual one, and it changes the token
   architecture — `rem`-based and type-derived rather than viewport-derived.
3. **How many steps?** Nineteen values want to become somewhere between six
   and nine. The type system took eight rungs and that has held.
4. **Is the 1920 breakpoint real?** It is the only place spacing steps up at
   the top end, and 30 media-query blocks depend on it. Fluid pairs would
   remove the need for it entirely.
