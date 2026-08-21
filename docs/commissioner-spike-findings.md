# Commissioner spike — what running it changed

Companion to [`commissioner-feasibility.md`](./commissioner-feasibility.md), which
is preserved as written. This file carries only what came out of **building the
thing**: re-deriving the study's measurements independently, asking `next/font`
what it actually accepts, and rendering the axes in a browser.

Nothing here is a decision either. The two sandbox routes and the two preview
pages are the instruments; this is the log.

Written 21 Aug 2026, against `main` at `38182fc`.

---

## 1. What held

Re-read out of `commissioner-latin-full-normal.woff2` (Fontsource v5.3.0, the
Google build, v1.001) with `fontTools`, not from the study's numbers:

| Claim | Verdict |
|---|---|
| Axes are `wght` 100–900, `slnt` 0 to −12, `FLAR` 0–100, `VOLM` 0–100 | Confirmed |
| No `wdth`, no `opsz` | Confirmed |
| `avar` present; **`wght` non-linear**, `slnt`/`FLAR`/`VOLM` linear | Confirmed, 10-point map on `wght` alone |
| 2000 upm, 18 named instances | Confirmed |
| STAT names exactly two non-default locations, **Flare** and **Loud** | Confirmed, both format 4 |
| No `tnum` / `lnum` / `onum` / `pnum` anywhere in GSUB | Confirmed — the feature list is `calt ccmp dnom frac liga locl numr rvrn` |
| cap-height 0.713, typo asc/desc 1.017 / −0.206 | Confirmed to three places |

x-height read 0.494 at the default instance against the study's 0.4960 at
`wght` 400. Same direction, no material difference; the ladder consequence in §6
stands.

**Payload corroborated by a different route.** Fontsource's Latin builds:
Bricolage full-axis **131.5 KB**, Commissioner four-axis **95.1 KB**. Different
subsetting from the study's, same direction and roughly the same magnitude. The
`wght`-only Commissioner build is 36.7 KB and the `wght`+`FLAR` build is 47.6 KB,
which is the study's point about terminal-only deltas costing almost nothing,
arrived at from the other side.

---

## 2. §8.1 is answered, and it is the good answer

**`next/font/google` accepts `axes: ['FLAR','VOLM','slnt']`.** `next@16.2.6`
ships Commissioner in its own `font-data.json` with all four axes and their full
ranges. No self-host, no Fontsource dependency, no different preload story, and
**assertion 8a survives as the same guard with a new list** — exactly as §5
predicted, which was the cheapest of the outcomes it costed.

`axes: ['FLAR','VOLM']` is a legal subset, so §8.3 resolves too: `slnt` can be
dropped at load and the payload lands at the study's 55.5 KB configuration.

### §8.2 has the sort direction backwards

The study warns that the v2 API sorts uppercase custom axes *before* lowercase
registered ones. Next's own URL builder says the opposite in a comment — "Google
api requires the axes to be sorted, starting with lowercase words" — and emits:

```
https://fonts.googleapis.com/css2?family=Commissioner:slnt,wght,FLAR,VOLM@-12..0,100..900,0..100,0..100
```

Lowercase first, then uppercase, each alphabetical. This changes nothing
operationally, because Next builds the URL from its own table and the order is
never hand-authored — which was the study's actual conclusion. Only the stated
direction is wrong, and it is worth correcting because a hand-built URL following
this document would 400.

---

## 3. The 8b probe as specified does not work

§5 proposes extending the runtime probe by rendering a reference glyph at
`FLAR` 0 and `FLAR` 100 and comparing advance width, "same technique for `slnt`".
Both halves of that have a defect, and neither is visible without running it.

### 3.1 The probe string matters by 7x

Flare deforms **terminals**, so a probe string has to be full of them. Measured in
Chromium at `FLAR` 0 against 100:

| String | Delta at 64px | As % of width |
|---|---|---|
| `HAMBURGEFONTSIV` | 1.30px | **0.20%** |
| `EEEEEEEEEEEEEEEE` | 1.53px | 0.25% |
| `nnnnnnnnnnnnnnnn` | 8.70px | **1.48%** |

The pangram is the intuitive choice and it is the worst one, because caps carry
few terminals. At 64px it yields a 1.3px delta, close enough to measurement noise
that the existing 0.5px threshold is luck rather than a test. Both spike routes
use a run of lowercase `n` at 200px against a 2px threshold, where the delta is
27px and a static-font control reads exactly 0.00px.

### 3.2 `VOLM` cannot be probed by advance width at all

Volume changes serif **shape**, not advance width. Measured across three sizes and
three strings, the delta between `VOLM` 0 and `VOLM` 100 is **exactly 0.00px every
time**. An advance-width check therefore passes a file carrying `FLAR` and no
`VOLM` and reports success — the precise class of false pass assertion 8a exists
to prevent.

This is **stated rather than solved**. Canvas 2D does not honour
`font-variation-settings`, so a raster diff needs an SVG `foreignObject` round
trip that is heavier than the check deserves. The mitigation is structural, and
it is evidence rather than proof: `VOLM` is inert without `FLAR`, and both arrive
in the same file from the same `axes` list, so `FLAR` rendering is strong evidence
the multi-axis build was served.

**Assertion 8b should say so in its own text.** A check that implies coverage it
does not have is worse than a check that names its blind spot, and this repo has
now written that sentence four times.

---

## 4. §1's hairline warning is true of the binary and false in the browser

The study notes Commissioner's `fvar` default `wght` is **100** against
Bricolage's 200, and reasons that any element losing its authored weight renders
hairline — "a louder failure, which is good."

The `fvar` default is 100; that part is confirmed. But CSS never reads it.
Un-authored text computes `font-weight: normal`, which is 400, and `next/font`
emits `@font-face { font-weight: 100 900 }`, so the browser instances at 400.
Google's API metadata and Fontsource both report 400 for this reason.

The failure mode described does not occur on the web. It **does** occur anywhere
the font is instanced outside CSS — Figma, static exports, anything baking type
into an image — so the observation is worth keeping, scoped.

---

## 5. What the tokenisation pass found, which was not about Commissioner

Routing the 57 live weight literals through the `--wght-*` tokens **made
`lint:type` check 4 go blind and still report PASS**. It found the signature with
`parseFloat()` on each `font-weight`; once `.text-lede`'s 340 became
`var(--wght-thin)` that returned `NaN`, the hit list emptied, and a check that
asserted nothing printed green.

Proven both ways rather than argued, because a green check is exactly what the
bug looks like:

| Resolver | `.text-lede` in `ALLOWLIST.signature` | Check 4 |
|---|---|---|
| on | removed | **RED** |
| bypassed | removed | **GREEN** |

The second row is the bug, reproduced on demand.

Fixed with a one-level `var()` resolver against the `@theme` blocks, the same
two-pass approach `scripts/lint-space.mjs` already uses. Weights that stay
`var()`-driven after that pass are printed as an UNCHECKED blind spot beside
`varWidths`.

**This is the general answer to the study's §3.4**, and it is narrower than the
three options offered there. The tension between a tokenised system and a
CSS-parser gate exists **only for axes with no standard property**. `wght` has
one and resolves fine; `FLAR` and `VOLM` do not. So the rule is not (a) plus (c)
as a compromise — it is **tokens for weight, literals for voice**, by
construction.

---

## 6. Still open, and not covered by the study

**Also Shipped.** `.text-qh-title` runs per-brand three-axis variation at
`wdth` 84–100. A third of that premise does not survive a font with no width
axis, and §6 of the locked doc calls that surface's variation "the content". The
study does not cost it. `app/sandbox/home-commissioner/` leaves it at the reading
voice on purpose so the loss is visible rather than papered over with a flare
substitute nobody has agreed to.

**The about page.** Its `h1` is the second of three signature placements, and §9
already records two off-ladder sizes there. Neither spike route renders it.

**`.transformation` at 700.** Surfaced by the tokenisation as the only live
weight literal left, and logged in
[`unspecified-surfaces.md`](./unspecified-surfaces.md). Unrelated to Commissioner
except that a font change would force the ruling.

---

## 7. The instruments

| Route / file | What it answers |
|---|---|
| `app/sandbox/type-commissioner/` | Voice by rung against a real case study, plus specimens for the signature, body size and the rung-0 split |
| `app/sandbox/home-commissioner/` | The home page, imported rather than copied, where the 340/720 signature actually lives |
| `docs/previews/commissioner-bench.html` | The specimen bench, self-contained, opens on any device with no server |
| `scripts/capture-commissioner-preview.mjs` | Regenerates the home-page preview from a local build |

Both routes 404 on the production deployment and carry the page guard
`__tests__/sandbox-guard.test.mjs` asserts. Both preview files live under `docs/`
rather than `public/` **because `public/` is not gated** — see the note in
`docs/previews/README.md`.
