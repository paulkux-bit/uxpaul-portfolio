# Delivery Promise v4 — the narrative revision, the roadmap table, and a craft review

**Supersedes `docs/urbn-delivery-promise-v3-brief.md` §2 entirely. The rest of v3
still stands.** This is one job in two passes: build, then review what you built.

**Stop at the diff. Paul commits.**

Written 25 Aug 2026. Seven module forms were prototyped and rendered at 1100,
390 and dark before this one was chosen. Every number below was measured.

---

## 0. Read these first, in this order

1. `docs/urbn-delivery-promise-content-draft-v3.md` — the copy for sections 01, 03, 04 and 06, and why each edit exists
2. `docs/previews/roadmap-table-prototype.html` — the module. **The `.mf` block only.** The `.pa` and `.cf` blocks in that file are earlier candidates, kept for the record
3. `claude/case-study-house-rules-learned.md` (project knowledge) — the measured rules
4. `claude/delivery-promise-interview-record.md` (project knowledge) — the facts, including what is cleared and what is excluded
5. `components/case-studies/urbn-delivery-promise/inversion-manifest.json` — the manifest pattern to follow

**Four dead prototypes are in `docs/previews/`:** `dependency-map-prototype.html`,
`dependency-map-candidates.html`, `dependency-map-explorations.html`,
`dependency-map-explorations-2.html`. They record forms that were built,
rendered and rejected. **Delete none of them, build none of them.**

---

## PASS ONE — build

### 1. The MDX edits

Copy the blocks from the v3 content draft into
`app/content/case-studies/urbn-delivery-promise.mdx`.

| Section | Change | Source |
| --- | --- | --- |
| 01 | Replace whole section | v3 draft |
| 03 | Replace whole section | v3 draft |
| 04 | Add one paragraph before `<PromiseSequence />` | v3 draft. **Moved from 05, not written** |
| 05 | Replace whole section | §3 below, not the v3 draft |
| 06 | Replace the body, keep the heading | v3 draft |

Add the `RoadmapTable` import. **Rewrite the MDX comment that explains `FanOut`
is deferred** — `FanOut` is retired, not deferred, and so is `DependencyMap`.
Both were named for shapes the argument turned out not to have. Say so in the
comment so nobody restores either.

Do not touch the hero, section 02, the milestone section, or Role.

**The pull quote in section 01 is a real customer, verbatim with elisions.** Do
not tighten it by rewording. Ellipses are legitimate; substituting words turns a
quotation into a fabrication.

### 2. Build RoadmapTable

`components/case-studies/urbn-delivery-promise/RoadmapTable.tsx` plus
`roadmap-manifest.json`. Port the `.mf` block from the prototype.

**There is no geometry in this module.** No SVG, no viewBox, no computed
positions. That is not an accident — it is why this form survived seven rounds of
prototypes that each broke at one width. Three columns at desktop, stacked below
768, and the mobile stack shows a "What it replaced" label that is `display:none`
at desktop where the column header carries it.

Every string in the manifest. Editing a feature or reordering a row must change
the render without opening the `.tsx`.

```json
{
  "$doc": "Content for <RoadmapTable>. Three rows, three columns, then a coda. Rows are the roadmap's short-term column from deck p23, verbatim. Every feature in `built` is on a real 2019 screen: p16 home, p17 PLP, p18 PDP, p19 cart, p20 SMS. Nothing here is reconstructed.",

  "$orderDoc": "ORDER IS THE DECK'S, AND IT IS CONTESTED. Deck p23 lists inventory sync, then delivery date accuracy, then reduce split shipments, and that is what ships here because it is what the artifact says. Paul has said in conversation that date accuracy came first. Unresolved as of 25 Aug. Reordering means editing three `n` values and the array order, nothing else. Do NOT add a why-this-order clause to the caption: there is not one yet.",

  "$replacedDoc": "The `replaced` column is a callback, not new information. Each line is one of the three friction beats from section 02, so a reader who has scrolled this far has already met all three failures. That is what makes section 05 a decision beat rather than a second outcome section.",

  "$codaDoc": "The coda is the module's conclusion and it absorbed a whole rejected candidate: an earlier form built the entire module around this one sentence. Here the three rows earn it. 'Arrives by Sept 13' is verbatim from p18; 'in one box' is the split-shipment outcome and is NOT on any screen, which is why the label reads 'what all three made possible' rather than presenting it as a product string.",

  "columns": {
    "milestone": "What shipped",
    "built": "What it put on the screen",
    "replaced": "What it replaced"
  },

  "rows": [
    {
      "n": "01",
      "milestone": "Inventory sync",
      "built": [
        "Stock truth at the item level, not the page level",
        "Pickup offered only at stores that have it, with the nearest one named",
        "Out of stock caught before the charge"
      ],
      "replaced": "An order confirmed, then a cancellation email four days after she paid."
    },
    {
      "n": "02",
      "milestone": "Delivery date accuracy",
      "built": [
        "A named arrival date on the product page",
        "Delivery-date and pickup filters in browse",
        "The same date in the ad, the cart, and the text message"
      ],
      "replaced": "Cost and timing appearing at checkout, after she had chosen everything."
    },
    {
      "n": "03",
      "milestone": "Split shipment logic",
      "built": [
        "One shipment wherever one was possible",
        "An options panel that says why a choice is unavailable",
        "Shipped, arriving today, and delivered, by text"
      ],
      "replaced": "One order arriving as three boxes, because nothing decided otherwise."
    }
  ],

  "coda": {
    "label": "What all three made possible",
    "line": "Arrives by Sept 13, in one box."
  },

  "caption": {
    "lead": "The roadmap, and what each fix put on the screen.",
    "gloss": "Every feature here is on a 2019 screen. None of them could ship until the plumbing under it was true."
  }
}
```

### 3. Section 05's MDX

```mdx
## The date had to be true before we could show it.

<p className="section-lede">I set the direction from the shopper's side, then built the sequence with the engineers who would have to make it real.</p>

<RoadmapTable />

**Every screen in this study sits in the back half of that roadmap.** The browse filters, the cart, Shop My Store. A filter promising two-day delivery is worse than no filter when the date is a guess.

We had a mature design practice, so screens were never the constraint. What stopped us was that no team held more than a third of the promise, and the thirds had to land in order. **The best thing I designed was a roadmap.**
```

The second paragraph is new. It carries the six consumer surfaces in prose,
which is where they belong once the table stops being an inventory of them.

### 4. Spacing and type, already resolved by measurement

**Use these, do not re-derive them.**

| Slot | Token | Why |
| --- | --- | --- |
| Row internal gap | `--spacing-xs` (0.75rem) | keeps a step over the feature gap |
| Feature list gap | `--spacing-2xs` (0.5rem) | within-unit |
| Mobile "what it replaced" label margin | `--spacing-3xs` (0.25rem) | label to value |
| Feature hanging indent | `--spacing-s` (1rem) | the hairline is 0.55rem, leaving 0.45rem |
| Coda top margin / padding | `--spacing-l` / `--spacing-m` | evidence step, then intimate |

**`--spacing-3xs` exists at 0.25rem.** An earlier pass on this work assumed
`--spacing-2xs` was the floor and it is not.

Type: 18px milestone, 15px features and replaced line, `text-eyebrow` on column
heads, 28/36px on the coda. All clear of `lint:type` check 2's 14px hard floor.
An earlier prototype used 10px and 11px and would have failed it.

### 5. Gates

`npm test`, then `npm run build`, then `lint:prose`. Report every number. Run
`__tests__/cover-art.test.mjs` too — nothing here should touch it and a green run
is the cheap confirmation.

Known traps, all still live:

- `lint:type` hard floor is 14px
- `lint:space` check 4 forbids spacing inside a media query. Declare gaps once, outside the breakpoint
- `lint:prose` hard-fails on em-dash U+2014, and it scans rendered `.next` HTML, so the new MDX prose is in scope even though source comments are not
- `lint:color`'s `EXTS` excludes `.html` and `.md`, so the prototypes and the briefs are structurally exempt. It does scan untracked `.tsx`
- Commissioner has no `wdth` and no `opsz`
- Verify at a real 390px viewport. A browser resize is invalid

---

## PASS TWO — craft review

**Run this after the gates are green and before you stop at the diff.** Separate
pass, separate posture. The build asks "does it work." This asks "should it
exist in this shape." You are reviewing as the person who owns craft standards
on this repo, not as the person who just built it.

Read the locked specs and the house rules first. **Where they disagree with this
brief, say so rather than silently picking one.**

Answer each of these in writing, with evidence:

**Does the module pass the invention test?** House rule: *does this module carry
an argument the prose cannot?* A three-row table is close to the line. Make the
case for or against in one paragraph. If against, say so plainly. A module you
argue yourself out of is a better outcome than one that ships because it was
specced.

**Is section 05 inside budget?** Count body words, tags and comments stripped,
against house rules §1. Nothing shipped exceeds ~150. Report the number, not an
impression.

**Do the four modules read as four different hands?** The study carries
`JourneyLine`, `InversionChart`, `PromiseSequence` and `RoadmapTable`. House
rules §8: the beats may repeat, the modules must not. Three are line-based
drawings and the fourth is a table. Deliberate variety, or one module that gave
up?

**Run the skim extraction cold.** Pull eyebrows, headings and bolded phrases in
page order. Paste the flat list. Confirm all four hiring questions answer from it
alone. **Then prove it in both directions:** delete the heading you think carries
"what failed" and confirm the answer actually disappears. If it does not,
something else is carrying it and you should find out what.

**Check one specific redundancy.** Row 02's third feature is "The same date in
the ad, the cart, and the text message." `PromiseSequence`, one section earlier,
*shows* those exact screens. Same claim twice, four hundred words apart. Report
whether it reads as an echo or a repeat, and recommend. **The author's instinct
is to cut it** — the module does not need three features per row and this is the
weakest of the three in that row.

**Then check the checks.** Fifteen of twenty findings across this repo's four
design-system migrations were faults in the measuring instrument, not the thing
measured. For every green result you report, say how you would know if it were
lying. A gate that cannot fail is not a gate: the cover-art defect shipped
through six green gates and was caught by eye in four seconds.

**Rank findings by severity. Fix nothing you find in this pass.** Bring it back
first. A build and a review of that build in one commit means neither can be
judged.

---

## Do NOT

- Restore `FanOut` or `DependencyMap`
- Build anything from the four dead prototypes
- Change `problemFraming` or `projectName` in `app/data/case-studies.ts` — the card is written after this lands, and Paul writes it
- Touch `heroImage` or the crops — the crop pass is a propose-and-judge session with Paul
- Force-add anything from `public/case-studies/**/_raw/`. **The repository is public** and those extracts hold per-brand failure rates and absolute order counts that Paul cleared for exclusion
- Add a why-this-order clause. The order is contested and unresolved

## Done means

1. The five edited sections render at `/case-studies/urbn-delivery-promise`
2. `RoadmapTable` takes every string from its manifest
3. Zero hardcoded colours, spacings or type values
4. Both modes, and a real 390px viewport
5. Every gate green, every number reported
6. The craft review delivered as findings, nothing fixed
7. A Vercel preview URL
8. **The diff is unstaged and Paul commits it**
