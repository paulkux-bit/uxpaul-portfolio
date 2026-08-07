# BARD case study — animation plumbing

> **One item here is superseded.** The proposed wdth-axis entrance on the problem
> labels (animating `font-stretch` 100% → 90%) is banned twice over by type-system
> v3: **R11** and **§8** forbid animating any axis, and 90 is not one of the three
> legal widths ({100, 94, 88}), so `npm run lint:type` check 1 would fail the build
> on the end state. The structural hooks and the reduced-motion guard below are
> unaffected. Anything referencing the PopUp layer is also stale; that system is
> retired.

Motion is **not** implemented during the section-by-section craft rebuild. This file records
the structural hooks set up so animation slots in later **without a refactor**. Every future
motion must be guarded by `prefers-reduced-motion: reduce` (skip/disable, never degrade content).

## THE PROBLEM (built May 2026 · was THE USER)

Section wrapper: `<section className="cs-section cs-section--problem">`. Layout: lede + felt-pain
prose → two-up `FramedPair` evidence → three problem **columns** (`.thread-cols`).

| Hook | Where | Future animation it enables |
|---|---|---|
| `data-thread="1\|2\|3"` | each `.thread-cols > li` | Staggered **left-to-right** reveal of the three problems. The attribute is also the cross-page thread identity — DESIGN and WHAT CHANGED tag their instances with the same `data-thread` so a thread can be highlighted/linked across appearances. |
| `.thread-cols` | the `<ol>` | Stagger-group selector. The three columns are discrete, reveal-ready. |
| `.framed-pair` cells | the two `<figure>` panels | Discrete — the two evidence images can reveal independently. |
| Discrete block elements | `h2`, `.section-lede`, the pain `<p>`, each column, each panel | Each unit is its own element — entrance animations (fade/translate) attach per element with no wrapper changes. |

### Candidates noted, deferred
- ~~**wdth-axis entrance on the problem labels** — animate `font-stretch` (e.g. 100% → 90%) on
  `.thread-cols__label` as each column enters. No markup change required.~~
  **SUPERSEDED:** banned by v3 R11 and §8 (no axis animation), and 90 is not one
  of the three legal widths. `.thread-cols__label` is now 94, the display band.
- **Per-sentence reveal of the felt-pain staccato** — would require splitting the pain `<p>`
  into per-sentence spans. **Not** done now (keeps the prose clean / `text-wrap` intact).

## When the annotation layer goes live — recheck the evidence gap

THE PROBLEM tightens the felt-pain-prose → evidence gap with
`.cs-section p:has(+ .framed-pair) { margin-bottom: 1rem }`. This relies on the pain paragraph
and the `.framed-pair` being **DOM-adjacent**, which holds only because `PopUp` renders `null`
while annotations are disabled (the default today). When the PopUp layer is built and toggled
**on**, the `courtroom` PopUp renders a `.popup` element **between** that paragraph and the
images, so the `:has(+ .framed-pair)` selector stops matching and the gap reverts to 1.5rem.
Recheck/adjust the evidence-gap spacing when the annotation layer ships.

## THREE FRICTIONS — oku figures (built as placeholders, June 2026)

The three friction beats each carry an `OkuFigure` (`components/oku-figure.tsx`) — variants
`forms-diverge` / `insight-trapped` / `manual-reconcile`, depicting the FRICTION (not the fix).
Static placeholders now. The full animation contract lives in the component's doc comment: inline
SVG, `currentColor` stroke, no fills/monochrome, scroll-triggered play-once via IntersectionObserver
(reuse `popup.tsx`), `prefers-reduced-motion` → final static frame. Placeholder box and animation
share the locked `OKU_RATIO` (3/2) → drop-in with zero layout shift; `OkuFigure` becomes a client
component then, the MDX section stays server. **DESIGN will add resolution-counterpart variants so
the figures rhyme by thread number (01/02/03).**

## Parked for DESIGN

- **Filter-taxonomy `SmallMultiples`** (Status / Event / Cause / Severity popovers, caption
  "Filter taxonomy mirrors the doctrine analysts use. The vocabulary came from the field.") —
  pulled from THE OPPORTUNITY build (it's a design artifact, not did/found/opened). Hold it for the
  DESIGN/system section, where the "vocabulary came from the field" caption becomes the
  research→design bridge. Markup preserved in git history (commit before this build).

## Parked for DESIGN (Thread 1)

The redesigned-queue image (`/case-studies/uscg-bard/incidents-queue.png`) and its line
**"The real workspace is a queue, not a form. Count and status do the work before the prose."**
were removed from THE PROBLEM (they are *solution* evidence, not legacy evidence). **Parked for
DESIGN Thread 1** (the standardization / form work) — do not lose them; the line is strong and
belongs with the solution.
