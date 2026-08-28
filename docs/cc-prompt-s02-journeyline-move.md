# Delivery Promise §02 — move the journey map out, prepare the figure slots

Fourth stop in the cold read. **Two jobs, and the second is smaller than it
looks.**

**Stop at the diff. Paul commits, then push.**

---

## 1. `JourneyLine` moves out of section 02

Paul's call, and the reason is register rather than quality. Section 02's job is
*her order broke in three places* — three people-shaped moments. `JourneyLine` is
an analytical trajectory. Once the three beats carry figures, section 02 would
hold four pictures, three of which make the same claim.

**Move `<JourneyLine />` to the top of section 03**, immediately after that
section's `section-lede`, and move the MDX comment block above it with the
component. That comment records why the module exists and what it replaced; it
must not be orphaned in section 02.

**Section 03 has not been read yet, so this placement is provisional and the
brief says so out loud.** Add an MDX comment at the new site:

```
PROVISIONAL PLACEMENT, 26 Aug. JourneyLine moved out of section 02 because
that section is about three human moments and this is an analytical
trajectory. Section 03's own read has not happened yet. THE OPEN RISK IS
ADJACENCY: InversionChart currently follows the lede too, so these are two
line drawings with no prose between them, which is a house-rules section 8
problem. Settle the order when section 03 is read. Do not treat this
position as decided.
```

**Report, do not fix:** with `JourneyLine` and `InversionChart` adjacent, measure
whether they read as two different hands or one repeated one. House rules §8:
the beats may repeat, the modules must not, and a repeat is justified on **axis**.
`JourneyLine` is a trajectory over time; `InversionChart` is a comparison across
service tiers. Different axes on paper. Say whether that survives contact.

Section 02 now ends on its closing paragraph. Check what that does to the
section's bottom edge — `.cs-section > :last-child` zeroes the last child's
margin, and the last child just changed.

---

## 2. Prepare the three figure slots — wiring only, no art

**The art does not exist and is not being generated here.** Paul is drawing it,
to `docs/promise-beats-drawing-sheet.md`. This job is the scaffolding so that
dropping three SVGs in is the only remaining step.

Follow the existing family pattern exactly — there are three precedents:

```
components/oku/*.svg          + components/oku-figure.tsx
components/fdte/*.svg         + components/fdte-figure.tsx
components/nuuly-beats/*.svg  + components/nuuly-beat-figure.tsx
```

So: `components/promise-beats/` plus `components/promise-beat-figure.tsx`,
matching whichever of the three existing wrappers is cleanest. **Read all three
before writing** — they were built at different times and are unlikely to agree.
Say which one you copied and why.

**Check `scripts/regen-oku-tsx.mjs` before writing a second converter.** If it
generalises, extend it; if it is hard-wired to `components/oku/`, say so and
propose the smallest change rather than duplicating it.

The three variants and their call sites are already written into the MDX as
comments — `blind`, `phantom`, `split`, each with alt text. **Use that alt text
verbatim.** It was written against the beats and it is what the drawing sheet
briefs from.

**Do not uncomment the call sites.** A component rendering a missing SVG is worse
than a commented-out call site. Leave them commented, and update the comment to
say the wiring now exists and only the art is missing.

---

## 3. The layout consequence, which is the thing most likely to bite

`globals.css` carries `.friction-beat:not(:has(figure)) { grid-template-columns: minmax(0,1fr) }`.
Section 02's beats currently match that rule and render full width. **The moment
figures land, they stop matching it** and the beats snap to the two-column layout
they have never been seen in on this study.

**Verify the two-column layout now, before the art exists**, using a temporary
placeholder you do not commit — a plain `<svg viewBox="0 0 2750 1536" />` with a
single rect is enough to make `:has(figure)` true. Check at 1024, 1440 and a real
390px, both modes:

- The text column reads at every width and nothing overflows
- Beat headlines do not wrap into something ugly at the narrow column
- The `thread-index` numerals still sit where they should
- The figure column resolves to 300px at ≥1024 and the aspect gives 168px

**Then remove the placeholder and report the measurements.** Do not commit it.

---

## 4. Gates

`npm test` → `npm run build` → `lint:prose`, plus `cover-art` and
`testimony-leads`. Report every number. **`rm -rf .next` first.**

`lint:color` scans untracked `.tsx`, so the new wrapper is in scope from the
moment it exists even before it is staged.

---

## 5. Do NOT

- Generate, trace or place any figure art. Paul is drawing it
- Uncomment the three `PromiseBeatFigure` call sites
- Commit the layout placeholder
- Change any beat's headline, scene text, or the pull quote inside beat 02 —
  that quote has its own unresolved provenance question and is not part of this
  job
- Change section 03's prose. `JourneyLine` moves into it; nothing else about it
  is settled
- Touch the `mt-14!` closer. It is a known systems item across three studies and
  fixing it here would hide the pattern

## Done means

1. `JourneyLine` renders at the top of section 03, its comment block with it, and
   the provisional-placement comment written
2. `components/promise-beats/` and the wrapper exist, following a named precedent
3. The two-column beat layout is verified at three widths in both modes, with the
   placeholder removed
4. The adjacency finding reported, not fixed
5. Every gate green, every number reported
6. Diff unstaged, Paul commits, then push and report the hash and preview URL
