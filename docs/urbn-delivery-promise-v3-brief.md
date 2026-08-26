# Delivery Promise v3 — narrative revision and DependencyMap

Follow-on to `docs/urbn-delivery-promise-build-brief.md`, which covered the
original build. That study is shipped and green. **This brief is a narrative
revision, not a restructure.** The arc does not move.

**Stop at the diff. Paul commits.**

Written 24 Aug 2026 after a full re-read of the source deck. Everything below
was either measured or rendered, not assumed.

---

## 0. Read these first, in this order

1. `docs/urbn-delivery-promise-content-draft-v3.md` — the new copy and why
2. `docs/previews/dependency-map-prototype.html` — the module, rendered and verified
3. `claude/delivery-promise-interview-record.md` (project knowledge) — the facts
4. `components/case-studies/urbn-delivery-promise/inversion-manifest.json` — the pattern to follow

---

## 1. The MDX edits

Copy the blocks from `docs/urbn-delivery-promise-content-draft-v3.md` into
`app/content/case-studies/urbn-delivery-promise.mdx`. Five edits:

| Section | Change |
| --- | --- |
| 01 | Replace whole section. New bold-lead paragraph, new pull quote. |
| 03 | Replace whole section. Adds the 4 percent paragraph and a pull quote; rewrites the close. |
| 04 | Add one paragraph before `<PromiseSequence />`. **Moved from 05, not written.** |
| 05 | Replace whole section. New heading, new module, merged argument. |
| 06 | Replace the body. Heading unchanged. |

Also: add the `DependencyMap` import, and **rewrite the MDX comment that
explains `FanOut` is deferred.** `FanOut` is not deferred any more, it is
retired — it was named for a shape the argument turned out not to have. Say so
in the comment so nobody restores it.

Do not touch the hero, section 02, the milestone section, or Role.

**The pull quote in section 01 is verbatim with elisions.** Do not tighten it by
rewording. A paraphrase presented as a quotation is a fabrication, and this one
is a real customer. Ellipses are legitimate; substituting words is not.

---

## 2. Build DependencyMap

`components/case-studies/urbn-delivery-promise/DependencyMap.tsx` plus
`dependency-manifest.json`. Same rules as the other three: **every value in the
manifest, nothing hardcoded in the TSX.**

### The argument it carries

Six things a shopper would see converge on three foundational fixes. That
many-to-few convergence is a shape prose cannot hold, and it is the section's
whole claim: the visible half of the roadmap was downstream of the invisible
half.

The three fixes are the roadmap's short-term column verbatim. The six surfaces
are its long-term column, which is also every screen in this study.

### Port the prototype

`docs/previews/dependency-map-prototype.html` renders correctly at 1100 and 390
in both modes. **Do not redesign it.** Findings already baked in, each from a
render rather than a guess:

- **Mobile-first switching.** The desktop grid and header are `display:none` by
  default and switch on at 768. An earlier draft hid only the mobile view inside
  the media query and left the grid visible at every width: below 768 the
  `preserveAspectRatio="none"` band stretched into a solid black blob, because
  `vector-effect` was also scoped to the query so the stroke scaled with the
  distortion. Both now live in the same place.
- **The band must not drive height.** An `<svg>` with `width:100%`, no height,
  and a 100x600 viewBox resolves its intrinsic height from that ratio: at 7rem
  wide that is 672px, which inflated every row to ~98px and made the module read
  as sparse. It is absolutely positioned inside its own cell so the two text
  columns set the height.
- **Row order was chosen to eliminate crossings.** Left rows run
  filter, product page, cart, Shop My Store, recommendations, one box. In that
  order every edge is monotone and nothing crosses. The first draft ordered them
  by roadmap column and produced four crossings. **Do not reorder.**
- **Type sizes in the prototype were 10px and 11px and would have failed
  `lint:type` check 2** (`MIN_FONT_PX = 14`, hard floor). Re-rendered at 14px and
  it still fits. **Use `text-eyebrow` (0.875rem) for both the column headers and
  the fix labels** — do not reintroduce a smaller size.

### The split rule, again

**Only geometry stays in the SVG. Every word goes in HTML.** The band holds
eight cubic paths and nothing else. Both columns are HTML.

### Accessibility, and this one is easy to get wrong

The desktop grid is `aria-hidden`. The mobile grouped list is the single
accessible reading and it must be **present in the a11y tree at both widths** —
so at desktop it is visually clipped (`clip-path: inset(50%)`), never
`display:none`. Hiding both leaves a screen reader with nothing at all above
768px. The prototype does this correctly; keep it.

### Manifest

`dependency-manifest.json`. Editing a string or reordering a surface must change
the render without touching the TSX. The edge list is derived from
`surfaces[].waitsOn`, never stored as paths, so the drawing and the data cannot
drift apart — same discipline as `InversionChart` computing y from values.

```json
{
  "$doc": "Content and geometry for <DependencyMap>. The roadmap's short-term column is `fixes`; its long-term column is `surfaces`. Edges are DERIVED from surfaces[].waitsOn at render, never stored, so the drawing cannot disagree with the data.",

  "$orderDoc": "surfaces[] order was chosen by rendering: in this order every edge is monotone and none cross. Ordering them by roadmap column instead produces four crossings. Do not reorder without re-rendering.",

  "$splitDoc": "Only geometry in the SVG, every word in HTML. Same rule as JourneyLine and InversionChart.",

  "leftHeading": "What a shopper sees",
  "rightHeading": "What it waits on",

  "fixes": [
    { "id": "date",  "label": "Delivery date accuracy" },
    { "id": "sync",  "label": "Inventory sync" },
    { "id": "rules", "label": "Fulfillment rules engine" }
  ],

  "surfaces": [
    { "label": "A filter for free two-day to your zip",  "waitsOn": ["date"] },
    { "label": "A product page naming an arrival date",  "waitsOn": ["date", "sync"] },
    { "label": "A cart confirming two-day eligibility",  "waitsOn": ["sync"] },
    { "label": "Shop My Store",                          "waitsOn": ["sync"] },
    { "label": "Recommendations from nearby inventory",  "waitsOn": ["sync", "rules"] },
    { "label": "One order arriving as one box",          "waitsOn": ["rules"] }
  ],

  "geometry": {
    "$doc": "viewBox units. Left anchors sit at the row midpoints of a 6-row column, right anchors at the midpoints of a 3-row column, both across the same 600-unit height. Computed, not listed.",
    "viewBox": "0 0 100 600",
    "height": 600,
    "xStart": 6,
    "xEnd": 94,
    "controlIn": 50,
    "controlOut": 56,
    "bandWidth": "7rem",
    "rowMinHeight": "2.75rem"
  },

  "caption": {
    "lead": "The roadmap, as dependencies.",
    "gloss": "Everything on the left is something I designed. Everything on the right had to ship first."
  },

  "ariaLabel": "A dependency map. Six parts of the shopping experience converge on three foundational fixes. Delivery date accuracy blocks the two-day filter and the product page arrival date. Inventory sync blocks the product page, the cart, Shop My Store, and nearby-inventory recommendations. A fulfillment rules engine blocks nearby-inventory recommendations and single-shipment orders."
}
```

---

## 3. Gates

`npm test`, then `npm run build`, then `lint:prose`.

Known traps, all still live:

- **`lint:type` hard floor is 14px.** See above.
- **`lint:space` check 4 forbids spacing inside a media query.** The prototype
  declares `gap` outside the breakpoint; keep it that way.
- **`lint:prose` hard-fails on em-dash U+2014** and it scans rendered `.next`
  HTML, so the new MDX prose is in scope even though comments are not.
- **`lint:color` `EXTS` does not include `.html` or `.md`**, so the prototype and
  this brief are structurally exempt. It does scan untracked `.tsx`.
- **Commissioner has no `wdth` and no `opsz`.**
- **Verify at a real 390px viewport.** A browser resize is invalid.

**Also run the cover-art test.** `__tests__/cover-art.test.mjs` is new as of
`a353f81` and nothing in this change should touch it, but a green run is the
cheap confirmation.

---

## 4. Do NOT

- Do not restore `FanOut`.
- Do not reorder `surfaces[]`.
- Do not change `problemFraming` or `projectName` in `app/data/case-studies.ts`.
  The card is still Paul's to write, and it gets written after this lands.
- Do not touch the crops or `heroImage`. The crop pass is the next step and it
  is a propose-and-judge session with Paul.
- Do not force-add anything from `public/case-studies/**/_raw/`. **The
  repository is public** and those extracts include per-brand failure rates and
  absolute order counts that Paul cleared for exclusion.

---

## 5. Done means

1. `/case-studies/urbn-delivery-promise` renders the five edited sections
2. `DependencyMap` takes all content from its manifest, edges derived not stored
3. Zero hardcoded colours, spacings or type values
4. Both modes, and a real 390px viewport
5. Every gate green, every number reported
6. A Vercel preview URL
7. **The diff is unstaged and Paul commits it**
