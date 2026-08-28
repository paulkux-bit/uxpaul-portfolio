# Delivery Promise §02 — swap in the corrected `split` figure

Small job. One asset, one alt string, the gates. **Stop at the diff. Paul commits,
then push.**

---

## What is already done, and by whom

`components/promise-beats/split.svg` is **already replaced in the working tree**
— written directly, not by you. It is the third generation of that drawing and it
is final. Do not re-trace, re-scale, re-crop or re-position it.

It was normalized and traced by `scripts/normalize-beat-figure.py` from a
2752 × 1536 source. Measured after tracing:

| | fill W | side margin @300px | height fill | pen | bytes |
| --- | --- | --- | --- | --- | --- |
| `blind` | 53.9% | 69px | 79.9% | 10u / 1.09px | 24513 |
| `phantom` | 63.7% | 55px | 79.9% | 11u / 1.20px | 22766 |
| `split` **(new)** | 55.2% | 67px | 80.0% | 11u / 1.20px | 27001 |
| `split` (old, replaced) | 94.5% | **8px** | 78.2% | 10u / 1.09px | 35291 |

**Verify this table rather than trusting it.** Numbers in briefs have been wrong
in this project before.

`viewBox` is unchanged at `0 0 2750 1536`, so the rendered height stays 168px and
**the beat layout cannot shift.** One confirming measurement is enough; no
three-width sweep needed this time.

**Do not re-trace `blind` or `phantom`.** They predate the normalizer's
assert-order fix and come out byte-different if re-run, but that bug could only
affect a figure sitting at the 75-unit margin floor and those two sit at 632 and
500. Same rendered result, so re-tracing is pure churn. Reasoning is in
`docs/split-recompose.md`.

---

## 1. Regenerate the component

```bash
npm run regen:promise-beats
```

That rewrites `components/promise-beats/split.tsx` from the new SVG. **No wiring
changes** — the component, the allowlist entry and the MDX call site all stay
exactly as they are.

Confirm the regenerated `.tsx` carries `currentColor` and `fill-rule="evenodd"`
and contains no `<text>` and no `stroke`.

---

## 2. Fix the alt text

`app/content/case-studies/urbn-delivery-promise.mdx`, the `variant="split"` call
site. It currently reads:

> Four clothing parcels spread apart on blank ground: three soft mailers, the
> largest with a t-shirt visible inside, and a flat taped box. A shopper crouches
> at the right, opening the smallest mailer.

That was honest to the art it was written against. The art has changed and every
clause is now wrong — the count, the arrangement, and which parcel she is opening.
Replace with:

> Three clothing parcels grouped together on blank ground: a flat taped box, an
> upright soft mailer behind it, and a third mailer that a shopper, crouched
> beside them, is pulling open with both hands.

**Do not describe them as URBN-branded.** The label panels are drawn but blank;
the wordmark is a later pass. The alt text follows the art, not the plan.

---

## 3. Gates

`rm -rf .next` first, then `npm test` → `npm run build` → `lint:prose`, with
`cover-art` and `testimony-leads` named explicitly.

- `lint:color` scans `.svg`. The new figure is `currentColor` only — confirm.
- `lint:interaction` check 4 bans hand-authored `<svg>` in `.tsx` outside the
  allowlist. `components/promise-beats/` is already allowlisted; confirm the
  regenerated file did not land outside it.

---

## 4. Verify and report

1. **Count the parcels in the rendered figure. Three.** This is the whole point
   and it is the one thing no automated step can check.
2. Rendered height of all three figures at ≥1024. They must agree at 168px.
3. Both modes — the figure inherits `currentColor`, confirm it flips.
4. **Page-weight delta for the route.** The asset drops 35291 → 27001. State the
   route total before and after.
5. One look at 390px to confirm nothing regressed in the stacked layout.

## Do NOT

- Re-trace, re-scale or re-position any of the three SVGs
- Add the URBN wordmark — separate pass, panels stay blank
- Change any beat headline or scene text
- Change the `pull-quote--quiet` inside beat 02 — provenance still unresolved
- Touch the `mt-14!` closer
- Touch `JourneyLine` / `InversionChart` in §03. Their adjacency is a known open
  item and it is not this job

## Done means

Figure regenerated, alt text corrected, every gate green, the five numbers above
reported, diff unstaged.
