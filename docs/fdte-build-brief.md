# FDT-E page build brief — for Claude Code / skill-director

## Goal
Build the FDT-E Template A case-study page so it renders, mirroring the Bard page. The point of this pass is to get copy and illustration onto the real page — real type, real bento, light and dark — so Paul and Claude (Cowork) can judge them in context and refine. Get it building and on screen first; polish second.

## Source of truth
- **Copy is frozen** at `app/content/case-studies/us-navy-fdt-e.mdx`. Use the prose **verbatim**. Convert the placeholder markup (the `hero-block__image-frame` div, the `hero-note` aside, and the `{/* IMG: ... */}` comments) into real components per the mapping below. **Do not change words.** If a line genuinely fights the layout, leave it and flag it in your report for Paul, don't rewrite it.
- **Reference implementation:** `app/content/case-studies/uscg-bard.mdx` and its components. Mirror its exact component vocabulary and section rhythm.

## Canonical-copy rule (important)
From now, `app/content/case-studies/us-navy-fdt-e.mdx` in the repo is the ONE canonical copy. Claude (Cowork) edits it through the device bridge; Claude Code edits it directly. Same file, both editors — no second copy, no drift. The old Cowork draft is retired.

## Section-by-section wiring (mirror Bard)

1. **Hero** → `<HeroBlock eyebrow title={[...]} role image callout />` (see Bard's usage).
   - eyebrow: `FDT-E · U.S. NAVY`
   - title: split the H1 across two lines: `['An anomaly isn't intelligence', 'until someone works it.']`
   - role: the lede line from the MDX ("I designed FDT-E, the system Naval Intelligence uses to track enemy air, ground, and maritime forces. Lead designer, start to fielded.")
   - image: `/case-studies/us-navy-fdt-e/hero.png` (this is the `anomaly--modal` crop). alt from frontmatter `heroImageAlt`.
   - callout: label `WHAT CHANGED`, body "The AI used to hand over an answer. Now it opens a case a person has to work."

2. **The problem** → `cs-section cs-section--problem`, eyebrow `The problem`, the H2 and three bold beats as written. No FramedPair here (the before/after is classified — there is no legacy screenshot to show, unlike Bard).

3. **What the data looked like** → this section carries the **data-richness** imagery and the new INT illustration.
   - `<FdteFigure variant="int-convergence" />` for the "five disciplines, one picture, none agreeing" beat (see FdteFigure below).
   - Data-richness crops as bento/bands (from the manifest): `order-of-battle--feature`, `provenance--band` (aspect 2.53), `lineage--popover`, `activity-feed--tall`. Use BentoBand for the bands and a feature/tall treatment for the rest, following Bard's BentoBand usage. `baseline-map--feature` may open "How the gate works" instead (see 6).
   - Keep the analyst pull-quotes blockquote as written.

4. **What I found** → `cs-section cs-section--frictions`, eyebrow `What I found`, then the friction-beats pattern EXACTLY like Bard: `<ol className="friction-beats">` with three `<li className="friction-beat" data-thread="N">`, each with a `.friction-beat__text` (thread-index, `friction-beat__headline`, `friction-beat__scene`) and a figure. The three beats are the operational modes:
     - 01 Sustained operations — `<FdteFigure variant="tempo-sustained" />`
     - 02 Training — `<FdteFigure variant="tempo-training" />`
     - 03 War — `<FdteFigure variant="tempo-war" />`
   - The reverence/personal hint currently lives in this section's intro paragraph ("Good intel analysts don't trust data blindly..."). Leave it there for now — Paul is judging placement on screen.

5. **The bet** → `cs-section`, eyebrow `The bet`, H2 and the argument + the adversary-officer pull-quote, as written. First-person voiced beat — this is where the reverence tone belongs.

6. **How the gate works** → the gate sequence. Map these crops (do NOT reuse the modal — it is the hero):
     - `baseline-map--feature` — the baseline disposition view (opens the section).
     - `anomaly--feature` (+ inline `anomaly--confidence-pill`) — confidence first.
     - `verification--band` (aspect 1.778) + `verification--sources` — the verification steps are the doctrine.
     - `response--feature` + `response--chat` — the human escalates.
   - Follow Bard's BentoBand / FramedPair patterns for the feature+detail pairings.

7. **What I got wrong** → text only. No image (the rich-vs-austere diptych is notional and does not exist).

8. **What I can't show you** → text only.

9. **Where it is now** → use a `milestone`-style block (see Bard's `<div className="milestone">`) for the active-use status: frame "In active use across every Joint Service and major command," plus the "still in the field, and still growing" note. Keep the "dozens of mission types, including strike and search-and-rescue" line as written.

10. **Credit / Role** → closing `cs-section`, eyebrow `Credit`, H2 `Role`, the exact role paragraph.

## New component: FdteFigure (Oku-style)
Create `components/fdte-figure.tsx` + `components/fdte/` figures, mirroring `components/oku-figure.tsx` / `components/oku/*`:
- Inline **monochrome line diagram**, authored with `fill="currentColor"` so it renders in text-ink and flips with theme. No box, border, or background — floats on paper. Landscape viewBox (~16:9), matching the Oku convention.
- Variants: `int-convergence`, `tempo-sustained`, `tempo-training`, `tempo-war`.
- **Stub first:** ship simple placeholder line art (a labeled monochrome sketch is fine) so the build is green and the page renders. The real line art is a later design pass — Paul may draw these himself. Do not block the build waiting on final art.
- Concept for the eventual art (for the stubs' intent):
    - `int-convergence`: source streams (COMINT, ELINT, GEOINT, HUMINT, MASINT, OSINT) converging on one contact but arriving out of step / disagreeing — "not too little data, too much."
    - `tempo-sustained / -training / -war`: one unifying idea — an aperture of tolerated ambiguity that is wide in sustained ops, gaps-lit in training, and collapsed to a single fact-plus-confidence in war. "The war sets the dial."

## Image manifest
`public/case-studies/us-navy-fdt-e/gate-walk/manifest.json` — take `src`, `alt`, `focalPoint`, and `aspect` from it. Hero image is `public/case-studies/us-navy-fdt-e/hero.png` (a copy of `anomaly--modal`).

## Constraints (repo rules)
- No em-dashes (U+2014) anywhere in prose — `npm run lint:prose` hard-fails on them.
- No banned words: `craft`, `seamless`.
- Numerals spelled out in prose (eighty percent, not 80%), except inside the product screenshots.

## Verify before reporting
1. `npm run lint:prose` passes.
2. Page builds and renders at the FDT-E route (same mechanism as Bard's `[slug]`).
3. Screenshot the page in **light and dark**.
4. Report: what renders well, which crops need re-treatment at real size (watch `activity-feed--tall` — smallest render — and the dense `provenance--band`), which figures are still stubs, and any copy line that fought the layout (flag, don't rewrite).

## Suggested orchestration
skill-director → frontend/ui doers to wire the MDX + build FdteFigure; content/ux reviewers to check the rendered page against the `case-study` skill's tests (skim layer, four hiring questions, plain-terms legibility, voice). Adversarial pass on the reverence hint: does it read as Paul, or as decoration?
