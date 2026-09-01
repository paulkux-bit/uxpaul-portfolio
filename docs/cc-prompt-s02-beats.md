# Delivery Promise §02 — wire the three beat figures, move the journey map out

**Supersedes `docs/cc-prompt-s02-journeyline-move.md` entirely.** That brief was
written when the art did not exist and told you not to render it. It does now.

**Stop at the diff. Paul commits, then push.**

---

## What is already in the tree, and how it got there

Three traced SVGs are committed:

```
components/promise-beats/blind.svg
components/promise-beats/phantom.svg
components/promise-beats/split.svg
```

Paul drew them; they were normalized and traced by
`scripts/normalize-beat-figure.py`, which is also in the tree and carries the
derivation in its docstring. **Do not re-trace, re-scale or re-position them.**
Their geometry is measured against the four shipped figures and is the point.

Measured, post-trace, rendered:

| | paths | subpaths | fill W | fill H | margins L/R/T/B | bytes |
| --- | --- | --- | --- | --- | --- | --- |
| `blind` | 1 | 110 | 53.9% | 80.0% | 634 / 634 / 166 / 141 | 25.0k |
| `phantom` | 1 | 92 | 63.7% | 80.0% | 500 / 499 / 167 / 141 | 22.8k |
| `split` | 1 | 116 | 94.5% | 78.2% | 76 / 75 / 181 / 155 | 35.3k |

All three: `viewBox="0 0 2750 1536"`, one `<g>` carrying
`fill="currentColor" fill-rule="evenodd"`, no `stroke`, no `<text>`, no
`width`/`height` attributes. `currentColor` verified flipping in both modes.

**Verify this table rather than trusting it.** Two numbers in a brief have
already been wrong this session.

---

## 1. Build `PromiseBeatFigure`

`components/promise-beat-figure.tsx`, plus whatever per-figure modules the
existing pattern uses.

There are three precedents and they were built at different times:
`components/oku-figure.tsx`, `components/fdte-figure.tsx`,
`components/nuuly-beat-figure.tsx`. **Read all three before writing one.** Copy
the cleanest, name it, and say which and why.

`scripts/regen-oku-tsx.mjs` is the existing SVG-to-TSX converter. Check whether
it generalises before writing a second one; if it is hard-wired to
`components/oku/`, propose the smallest change rather than duplicating it.

The MDX call sites already exist as comments with alt text written:

```jsx
<PromiseBeatFigure variant="blind" alt="..." />
<PromiseBeatFigure variant="phantom" alt="..." />
<PromiseBeatFigure variant="split" alt="..." />
```

**Uncomment them and use the existing alt text**, with one correction below.

### Alt text, corrected for what was actually drawn

The originals were written before the art. Two no longer describe the picture.
Replace with:

- **blind** — `A shopper holding a dress up at arm's length in front of a large wall calendar whose grid is completely empty, with no day marked.`
- **phantom** — `A shopper leaning over an open cardboard shipping box on a table, reaching into it. The box is empty. A long paper receipt hangs from her other hand.`
- **split** — `Three separate clothing parcels on a doorstep, spread apart: two soft mailers and a flat box. A shopper crouches beside the smallest, opening it.`

**Do not describe them as URBN-branded.** The blank label panels are drawn but
the wordmark is not set yet — that is a later pass, and the alt text follows the
art rather than the plan.

---

## 2. `JourneyLine` moves out of §02

Section 02's job is *her order broke in three places* — three human moments.
`JourneyLine` is an analytical trajectory. With three figures now in the beats,
leaving it here makes four pictures in one section, three of them the same claim.

**Move `<JourneyLine />` to the top of section 03**, immediately after that
section's `section-lede`, and **move its MDX comment block with it**. That
comment records why the module exists and what it replaced; it must not be
orphaned.

Add at the new site:

```
PROVISIONAL PLACEMENT. JourneyLine moved out of section 02 because that
section is three human moments and this is an analytical trajectory.
Section 03's own read has not happened yet. THE OPEN RISK IS ADJACENCY:
InversionChart also follows the lede, so these are two line drawings with
no prose between them, which is a house-rules section 8 problem. Settle
the order when section 03 is read. This position is not decided.
```

**Report, do not fix:** measure whether `JourneyLine` and `InversionChart`
adjacent read as two hands or one. §8 justifies a repeat on **axis** —
`JourneyLine` is a trajectory over time, `InversionChart` a comparison across
service tiers. Different on paper. Say whether it survives contact.

---

## 3. The layout change this triggers, which is the likeliest thing to break

`globals.css` carries
`.friction-beat:not(:has(figure)) { grid-template-columns: minmax(0,1fr) }`.
Section 02's beats currently match it and render full width. **The moment the
figures land they stop matching**, and the beats snap into a two-column layout
this study has never rendered.

Verify at **1440, 1024 and a real 390px**, both modes:

- The 300px figure column resolves at ≥1024, and each figure renders **168px**
  tall — 2750 / 1536 is 1.790, and the column cap is 300. Report the measured
  height for all three; they must agree.
- The text column reads at every width. Beat headlines do not wrap badly at the
  narrow column — they have only ever been seen full-width here.
- `thread-index` numerals still sit correctly.
- Below 1024, confirm what the figures do. `.friction-beat` is `align-items: start`
  and the beats stack; say where the figure lands relative to its text.
- **Beat 02 contains a `pull-quote--quiet` blockquote inside its text column.**
  That is the only beat with a quote, and it is now sharing a row with a figure.
  Check it does not collide or overflow.

**Then measure the three rendered figures against each other.** Ink tops and
bottoms should sit at consistent offsets inside their boxes, because that is what
the normalization was for. Report the numbers.

---

## 4. Gates

`npm test` → `npm run build` → `lint:prose`, plus `cover-art` and
`testimony-leads` named explicitly. **`rm -rf .next` first.**

- `lint:color` scans `.svg` and untracked `.tsx`. The three figures use
  `currentColor` only and should pass; confirm rather than assume.
- `lint:type` cannot see anything here.
- Report page-weight delta for the route. Three figures at ~83k of path data
  total land on the LCP route; say what it costs.

---

## 5. Do NOT

- Re-trace, re-scale, re-crop or re-position the SVGs
- Add the URBN wordmark. The label panels are blank on purpose; that is a
  separate pass
- Change any beat headline or scene text
- Change the `pull-quote--quiet` inside beat 02 — its provenance is still
  unresolved and it is not part of this job
- Touch the `mt-14!` closer. Known systems item across three studies; fixing it
  here hides the pattern
- Change section 03's prose. `JourneyLine` moves in; nothing else is settled

## Done means

1. The three figures render in §02's beats at 168px, measured, both modes
2. `JourneyLine` renders at the top of §03 with its comment and the provisional
   note
3. The two-column beat layout verified at three widths, beat 02's quote checked
4. Alt text corrected to match the drawn art
5. The adjacency finding reported, not fixed
6. Every gate green, every number reported, page-weight delta stated
7. Diff unstaged, Paul commits, then push and report the hash and preview URL
