# Commissioner — feasibility and complexity study

Not a migration plan. This is the answer to "how hard would this be," written against
`claude_type-system-v3-locked.md` (7 Aug 2026, all nine `lint:type` assertions green)
and `02-design-system.md`. Nothing here is a decision.

Axis facts are from the designer's own repository (`kosbarts/Commissioner`, v1.012,
18 Nov 2025, OFL-1.1), not from secondary listings, three of which disagree with it.

> **RECONCILED, NOT SUPERSEDED — 21 Aug 2026.** This document is preserved as
> written. Its measured claims were re-derived independently from the shipped
> binary, from `next@16.2.6`'s own font data, and from a rendered page. Seven
> held, three did not, and both questions §8 left open are now answered — one of
> them in the direction that removes the largest risk here. The corrections live in
> [`commissioner-spike-findings.md`](./commissioner-spike-findings.md) rather
> than being edited in here, for the same reason `typography-system.md` keeps
> its rejected values: the record of what was believed is worth as much as the
> record of what is true, and silently patching a study makes it impossible to
> tell which is which.
>
> **Read the findings before implementing anything from §5 or §8.** Two of them
> change the design of a lint assertion, and one of them removes the largest
> risk this document identifies.

---

## 1. The font, verified

| Axis | Range | Default | Notes from the designer |
|---|---|---|---|
| `wght` | 100–900 | **100** | Thin/UltraLight/ExtraBold/Black are display-only; Light–Bold work at both sizes |
| `slnt` | 0 to −12° | 0 | Oblique, not a true italic |
| `FLAR` | 0–100 | 0 | Grotesque terminals swell into near-glyphic serifs; joints get idiosyncratic |
| `VOLM` | 0–100 | 0 | Turns those serifs wedge-like. **Only functions in combination with FLAR** |

No `wdth`. No `opsz`. Latin Plus / Latin Pro / Cyrillic / Greek Core.
Fontsource ships `@fontsource-variable/commissioner` with all four axes, which is the
self-host escape hatch if Google's served file turns out to be reduced.

Two details with direct consequences:

- **Default weight is 100.** Bricolage's is 200. Any element that loses its authored
  weight renders hairline rather than merely light. Louder failure, which is good, but
  it changes what a partial CSS failure looks like.
- **VOLM is a no-op without FLAR.** A `VOLM 60` declaration with FLAR at 0 renders
  identically to no declaration and throws nothing. This is a silent-failure class the
  current system has no analogue for.

### 1.1 The one substantive external review

Oliver Schöndorfer's Font Friday #158 (Pimp my Type, Apr 2024) is the only close reading
of this font by a typography specialist. Four things in it bear on the decision.

**It rates Commissioner for all three roles** — headings, long reading text, and user
interfaces. That rating is the external case for the single-typeface requirement, and
it is a rating Bricolage would not get on the same scale, since its display cut is not a
reading face.

**It confirms the voice-by-rung mapping, independently.** The default style is described
as ideal for calm body text and small functional text; the flare and volume differences
are most obvious at larger sizes and stronger weights, and that is where he recommends
using them. Volume is explicitly not recommended for tiny text.

**Two named weaknesses, and both land on the signature.** In the heavier weights the
counters, especially the lowercase `g`, are called clumsy against Source Sans 3 Black.
And the obliques are not true italics — the `g` and `a` stay double-storey where a
humanist sans wants single-storey shapes. §7 carries both.

**His own pairing instinct puts Commissioner on the body side**, reaching for a striking
serif at the display end. That is a mild signal against it carrying a hero alone. Against
it: a March 2026 commenter reports using it as a single typeface on **metehan.design**,
with Schöndorfer agreeing it holds at hero size. That site is the exact use case already
shipped and is worth looking at before the spike rather than after.

### 1.2 Measured from the binaries

Everything below was read out of the shipped fonts with `fontTools`, comparing
`Commissioner[FLAR,VOLM,slnt,wght].ttf` against
`BricolageGrotesque[opsz,wdth,wght].ttf`, both pulled from `google/fonts` at `main`.
These supersede the estimates in earlier drafts of §6 and §8, two of which were wrong.

**Version, and a discrepancy.** Both the repo's `fonts/` folder and the file Google
serves are **v1.001**. The README changelog describes v1.012 (Nov 2025) introducing
tabular figures, math symbols, arrows, and an alternate `G`. None of that is in the
binaries anyone can actually load. Evaluate v1.001; the changelog describes a build that
is not shipping.

**Structure.**

| | Commissioner | Bricolage |
|---|---|---|
| Axis order in `fvar` | `wght, slnt, FLAR, VOLM` | `opsz, wght, wdth` |
| `avar` (non-linear axes) | **`wght` is non-linear**; slnt/FLAR/VOLM linear | none at all |
| Units per em | 2000 | 1000 |
| Glyphs | 1123 | 597 |
| Named instances | 18 | — |
| `MVAR` varies | `xhgt`, `stro`, carets, sub/superscript offsets | `xhgt`, `stro` |

Two consequences. FLAR and VOLM are **linear**, so an intermediate value like FLAR 40 is
genuinely the visual midpoint between the drawn masters — intermediate voices are safe to
author. And `wght` is **not** linear, which §7 turns into a number.

**The voices are only reachable through FVS. Proven.** All 18 named instances sit at
`FLAR 0, VOLM 0`. The STAT table names exactly two non-default locations, both at the
axis extremes:

- **Flare** — `FLAR 100, VOLM 0`
- **Loud** — `FLAR 100, VOLM 100`

So the designer's three voices are Default, Flare and Loud, and the statics ship as three
subfamilies (`Commissioner`, `CommissionerFlare`, `CommissionerLoud`, 54 files). No
combination of `font-weight` and `font-style` can reach a voice. This confirms R1′ and
R8′ from evidence rather than inference, and it means the three-band scheme in §3.3 maps
onto three designer-named stops rather than three values invented here.

**The italic is a pure shear. Proven.** Contour and point counts are identical between
the roman and italic variable fonts for every letter tested — `a` 2/59, `g` 3/97, `f`
2/42, `e` 2/45, `k` 2/38. Not one point is redrawn. Schöndorfer's complaint is not a
matter of taste; there are no italic outlines in this family.

**Figure handling is a regression.**

| Feature | Commissioner | Bricolage |
|---|---|---|
| `tnum` tabular | **no** | yes |
| `lnum` / `onum` / `pnum` | **no** | yes |
| default digit widths | proportional | proportional |

Both fonts default to proportional figures, but Bricolage can switch to tabular and
Commissioner cannot — there is one figure set and no way to align columns of digits.
`.milestone__date` and the `01/02/03` thread marks are the exposed surfaces. Bricolage's
oldstyle figures also disappear. Commissioner's only stylistic set, `ss02`, is a Serbian
Cyrillic `б` alternate, irrelevant here.

---

Net axis count goes 3 → 4. That framing is misleading; the jobs don't line up.

| Job in v3 | Mechanism now | Mechanism under Commissioner |
|---|---|---|
| Reading cut at 14–18px | `opsz` low end, automatic | Built into the design. No mechanism needed |
| Display cut at 40px+ | `opsz` high end, automatic | `FLAR`/`VOLM`, **authored per rung** |
| Width follows size | `wdth`, three bands via `font-stretch` | Deleted. `FLAR` takes the slot |
| Weight carries mood | `wght` 340/720 | Unchanged, and the range is wider |
| Prose emphasis | `em` → weight 600 | `slnt`, or weight, or both |

### The finding that makes this cheaper than it looks

**v3 already retired the only width contrast that carried meaning.** §5 of the locked
doc turns `.hero-block__sentence--open`/`--anxious` from 100/88 to **88/88** — "the
clause split retires with ruling 1." After that commit, every remaining width value on
the site is assigned automatically by rung and is never co-visible with a different
value. §8 already names the anti-pattern: "trusting a width difference that is never
co-visible to carry meaning."

So the width axis, as shipped on `main` today, carries no perceptual payload anywhere.
Deleting it costs nothing the current system values. That is the single largest
de-risking fact in this document.

### The finding that makes it more expensive than it looks

`opsz` was free. `font-optical-sizing: auto` is one global declaration and the browser
tracks rendered size forever. **There is no `auto` for a custom axis.** Every FLAR and
VOLM value must be authored, in a `font-variation-settings` string, on every selector
that wants it.

That inverts R1. The current system's rule is *never pin optical size, two sanctioned
exceptions*. The replacement rule is *every display rung pins a custom axis*. FVS goes
from an exception with a seven-line allowlist to the primary mechanism.

---

## 3. Tokenization

### 3.1 What survives

The five weight tokens are unchanged. 340 and 720 both sit comfortably inside 100–900 —
in fact further from the ends than they sit in Bricolage's 200–800, which may mean the
signature reads *less* extreme and needs re-judging (§6).

### 3.2 What dies

`--wdth-read` / `--wdth-display` / `--wdth-large`, and every `font-stretch` declaration
they feed. Per the C1 record that is roughly two dozen declarations, thirteen of which
are the unmounted takes wall.

### 3.3 What's new — the voice tokens

FLAR inherits width's job description exactly: **three bands, assigned by rung, never a
per-module choice.** This preserves ruling 1 and ruling 2 verbatim with a different axis
in the slot, and it's an upgrade, because a 12-point flare change is visible at a glance
where a 12% advance-width change is not.

```css
@theme static {
  /* Voice — paired values. VOLM is inert without FLAR. */
  --voice-read-flar:      0;   --voice-read-volm:     0;   /* rungs 0–2  */
  --voice-display-flar:  40;   --voice-display-volm:  0;   /* rungs 3–4  */
  --voice-large-flar:    70;   --voice-large-volm:   40;   /* rungs 5–6  */

  --slnt-emph: -8;
}
```

The numbers are placeholders. They are the spike's job to land, from render, in both
modes. Nothing here should be treated as a proposal for the values themselves.

**`--voice-read-flar` is not forced to 0.** Schöndorfer notes the flare is still
perceptible in body text and at small sizes. A low value, perhaps 10 to 20, would keep
family character in prose rather than making rungs 0–2 look like a different typeface
from rungs 5–6. Zero is the safe default; the alternative is a real option and belongs in
the spike as a toggle rather than being decided here.

**Flare tracks weight as well as size**, which the three-band scheme does not express.
Everywhere on the ladder those co-vary, since the display rungs run 600 — with one
exception, in §7.

### 3.4 The tokenization trap

§7 of the locked doc already records the relevant blind spot: `.text-qh-title` drives
width through `var(--qh-wdth, 100)`, and "a width driven through a CSS variable is
unresolvable at parse time — so check 1 skips it and the Also Shipped surface is
effectively invisible to the width rule."

Under Commissioner that blind spot stops being one selector and becomes the entire
system, because voice can only travel through FVS, and a tokenized FVS string is exactly
the unresolvable case. **Tokenizing the type system and keeping a CSS-parser linter are
in direct tension.** Three ways out:

- **(a) Two-pass resolver.** Parse `@theme static {}` into a map, substitute
  single-level `var()` references, then assert. Modest work, keeps the linter's speed
  and determinism, and would retroactively close the existing `.text-qh-title` gap.
- **(b) Computed-style assertions.** Playwright renders each rung and reads
  `getComputedStyle().fontVariationSettings`. Far stronger — it catches inheritance,
  cascade order, and axis-absence in one check. Far heavier, and it moves typography
  enforcement out of a one-second lint into a browser run.
- **(c) Literal values in role utilities.** Voices as `@utility` classes carrying
  literal numbers, so the digits appear in `globals.css` and the existing parser sees
  them. Cheapest, but it means the tokens aren't really tokens.

(a) plus (c) is the combination worth costing: literals at the property site, tokens for
authoring, resolver for the cases that must stay variable.

---

## 4. New rules

Written in the voice of §4 so they can be dropped into a v4 document.

**R2′ — Voice follows size.** Three voices, assigned by rung, no per-module choice.
Replaces R2 unchanged in structure.

**R1′ — Voice is authored, never inherited.** The inverse of R1. There is no automatic
mode; a rung without an explicit voice renders as the plain grotesque.

**R8′ — An FVS string may name only `FLAR`, `VOLM`, and `slnt`.** This is the most
important new rule and it follows directly from R8: an axis *not* named in the string
still obeys its standard property, and FVS inherits as a string that pins every
descendant. Since `wght` has a standard property and voice does not, keeping `wght` out
of every FVS string is what lets weight and voice compose instead of fight.

This bans the current `.milestone__date` pattern outright — it carries 600 and 88 inside
the FVS string. Under Commissioner that would pin the weight of every descendant.

**R-VOLM — `VOLM` > 0 requires `FLAR` > 0 in the same declaration.** Otherwise it is a
silent no-op. Mechanically checkable.

**R-VOLM-size — `VOLM` only at rungs 5 and 6.** The designer's own guidance: the effect
is clearest at large sizes and heavy weights, and "the smaller the text, the noisier it
might look with the Volume turned up."

**R3′ — The signature stays pure weight.** 340/720 must not become
340-plain-against-720-flared, however tempting. R9's reasoning holds: the signature
exists because it survives the fallback font, and FLAR does not survive the fallback
font.

**R9′ — Three of four axes now vanish in fallback, not two.** Weight is the only axis
the Arial-based fallback carries. If `em` moves from weight 600 to `slnt −8`, prose
emphasis disappears entirely when the font is blocked.

The current recommendation is to **keep `em` on weight**. The slant is an oblique, not a
true italic — Schöndorfer's specific objection is the double-storey `g` and `a` where a
humanist sans wants single-storey shapes, and he names it as one of the font's two
weaknesses. Moving emphasis to slant would trade a fallback-safe compromise for a
fallback-fragile one that a specialist reads as the weaker of the two. Slant is still
worth having; it is just not the answer to the italics problem, and Commissioner does not
solve that problem any more than Bricolage does.

**R-stretch — `font-stretch` is a dead property.** Any occurrence is inert and must
fail, because inert-but-plausible CSS is exactly the class of bug assertion 8a exists to
catch. Same for `font-optical-sizing`, which becomes decorative.

---

## 5. Lint — what changes

| # | Assertion | Under Commissioner |
|---|---|---|
| 1 | `wdth` ∈ {100, 94, 88} | **Replaced.** Any `font-stretch` at all fails |
| 2 | 14px floor | Unchanged |
| 3 | Adjacent rungs ≥1.15× across 320–2560 | **Unchanged.** Computed from clamps; font-independent |
| 4 | 340/720 gated to ≥40px and three placements | Unchanged |
| 5 | `strong` has an authored weight | Unchanged |
| 6 | No `color-mix(… currentColor …)` | Unchanged |
| 7 | FVS allowlist | **Rewritten.** FVS is now the mechanism, not the exception |
| 8a | `fonts.ts` declares the axes | **Same guard, new list:** `['FLAR','VOLM','slnt']` |
| 8b | Runtime font-load probe | **Extended** — see below |

Six new assertions:

10. No `font-stretch` anywhere.
11. FVS may name only `FLAR`, `VOLM`, `slnt`. `wght` in an FVS string is a hard fail.
12. `VOLM` > 0 without `FLAR` > 0 in the same string is a hard fail.
13. `VOLM` on a role whose ceiling is under the rung-5 floor is a hard fail.
14. Voice pairs must match one of the three declared voices.
15. `slnt` outside the allowlist is a hard fail.

**8a is the assertion that matters most.** This repo has already shipped the bug once:
with `axes` absent, every `font-stretch` and optical-sizing rule was silently inert in
production. Under Commissioner the same failure is worse, because there is no fallback
behaviour that looks broken — the site renders as a competent plain grotesque with every
display voice missing, and nothing throws.

**8b needs a real extension.** Checking that the family loaded is no longer sufficient,
because Google could serve a weight-only file. The probe has to measure: render a
reference glyph at `FLAR 0` and `FLAR 100` in an offscreen node and compare advance
width. Identical widths mean the axis is not present. Same technique for `slnt`.

---

## 6. What the responsive system needs

### Unchanged, and this is the good news

The entire ladder. Seven clamps, the 1.15 floor, the shared-crossover mechanism, the
rung 6 retune that the C0 harness found — all of it is pure `font-size` arithmetic and
none of it references the typeface. Assertion 3 passes on day one. The hardest and
most-computed part of v3 does not move.

The colour assignment table, the measure column, and the `balance`/`pretty` rules are
equally font-independent.

### Changed, and now measured

**x-height. The ladder does have to move.** Measured at the real body instance rather
than from the static table:

| | x-height / em | cap-height / em |
|---|---|---|
| Bricolage @ wght 400, opsz 18, wdth 100 | **0.5170** | 0.6600 |
| Commissioner @ wght 400 | **0.4960** | **0.7130** |

Commissioner's lowercase is 4.2% smaller relative to em, and its capitals are 8.0%
larger. That is what "almost classical proportions" means in numbers.

To render the same lowercase as today, **18px body becomes 18.76px, call it 19px**, and
the **14px floor becomes 14.6px, call it 15px**. Both are stated hard constraints in
§2 of the locked doc, so both need a ruling rather than a rounding.

**And the two halves of rung 0 move in opposite directions.** Captions are lowercase;
eyebrows are all-caps. Raising the floor to 15px to hold lowercase legibility pushes
eyebrow cap-height from 9.24px today to 10.70px, a 16% increase, on a mark that is
already the loudest small element on the page. Holding eyebrow caps constant instead
would need roughly 13px, below any floor. **One rung cannot serve both under this
typeface.** Either eyebrows leave rung 0, or the floor becomes a lowercase rule with a
stated caps exception. This is the single cleanest example of the font choice forcing a
system change rather than a value change.

**Payload. The earlier draft had this backwards.** Latin subset, identical
`fontTools` settings, woff2:

| Configuration | Size | vs Bricolage today |
|---|---|---|
| **Bricolage, full 3-axis (shipping today)** | **150.3 KB** | — |
| Bricolage, `opsz` pinned at 36 | 91.4 KB | −59 KB |
| Bricolage, `wght` only | 46.2 KB | −104 KB |
| **Commissioner, 4-axis** | **92.7 KB** | −58 KB |
| **Commissioner, 3-axis (`slnt` dropped)** | **55.5 KB** | **−95 KB** |
| Commissioner, `wght` + `FLAR` | 46.4 KB | −104 KB |
| Commissioner, `wght` only | 35.7 KB | −115 KB |

Commissioner with the full voice system and no slant is **63% smaller than the font
shipping today**, despite four axes, nearly twice the glyphs, and 2000 upm. The reason is
that `opsz` carries two fully drawn masters and dominates Bricolage's `gvar`, where FLAR
and VOLM are terminal-only deltas that cost almost nothing — `wght`+`FLAR` at 46.4 KB is
within 200 bytes of Bricolage's weight axis alone.

Against an LCP budget of <1.5s on 4G this is not a risk to manage, it is the largest
performance win available on the site. It also prices the `slnt` axis honestly: 37 KB,
for a shear.

*Caveat: this is my subsetting, not Google's delivery pipeline, which splits into several
unicode-range files and serves only what is used. The comparison is like-for-like because
both fonts went through identical settings, but the absolute numbers will differ from
what the network panel shows.*

**This also re-prices the cheap option.** Instancing Bricolage's `opsz` — the ink-trap fix
proposed before Commissioner came up — saves **59 KB on its own**. That option now has a
performance argument attached, not just a typographic one.

**CLS is now predictable, and slightly worse.** `next/font` derives the size-adjusted
fallback from the font's own metrics. Arial's x-height sits at 0.519 of em; Bricolage's
0.517 is almost exactly on it, which is why the current swap is nearly invisible.
Commissioner's 0.496 is further away, so the adjustment is larger and the swap more
noticeable. Small, real, and worth measuring against the <0.05 budget rather than
assuming.

**Line box shifts upward.** Typo ascender and descender are 0.930/−0.270 for Bricolage
against 1.017/−0.206 for Commissioner. Nearly the same total (1.200 vs 1.223) but
redistributed: much more ascender, much less descender. At the 1.00 and 1.02 leadings on
rungs 5 and 6, that changes where a single display line optically sits in its box. Rungs
5 and 6 need re-judging; the reading rungs are forgiving.

**Tracking becomes load-bearing.** §3.4's −0.02em and −0.025em at rungs 4–6 were tuned
against Bricolage's display cut, which adds contrast and tightens fit as size grows.
Commissioner has one drawing at every size, so it will sit more open at 88px. Tracking
and FLAR together have to do what `opsz` did alone. The tracking column stops being a
fine-tune and becomes a second token set.

### Explicitly not doing

**No viewport-driven voice.** FLAR is authored, so it *could* be clamped against the
viewport. It should not be. R11 bans axis animation, and a viewport-interpolated axis is
animation during resize by another name — plus it is unjudgeable, since you would never
see two states together. Voice is assigned by rung, exactly as width was.

---

## 7. Judgment gates that no lint can cover

**The signature is the sharpest gate, and both halves are at risk independently.** It
was verified on device at 32px in both modes for Bricolage; that check re-runs from
scratch, and it now has two failure modes rather than one.

- **340 may read anaemic, and the numbers themselves are probably wrong.** Bricolage's
  light weights flare their stems to keep visual weight against the ink traps, by design;
  Commissioner has no such compensation. Worse, flare needs *weight* as well as size to
  register, so the 340 half sits in the one cell of the grid where voice cannot help it —
  a light weight at a large size, stuck at the plain voice while the 88px display around
  it carries flare.

  There is also a measurable problem with the pair itself. Bricolage has no `avar`, so
  340 and 720 sit at normalized 0.233 and 0.867 of its 200–800 range: a span of **0.633**.
  Commissioner's `wght` *is* non-linear, and after applying its `avar` map the same two
  numbers land at 0.217 and 0.660: a span of **0.443**. The identical pair covers barely
  two-thirds as much of the available contrast. Solving for an equivalent span puts the
  heavy end near **wght 820**, which is still legal — the designer marks ExtraBold and
  Black as display-only, and the signature is ≥40px by rule.

  So ruling 3 does not survive as written. Either the signature is re-numbered, roughly
  340/820, or it is accepted as a quieter gesture. Design-space position is a proxy for
  perceived weight, not a proof, so the number is a starting point for the render rather
  than an answer — but the direction is not in doubt.
- **720 has a documented drawing weakness at exactly this size.** The heavy-weight
  counters, especially the lowercase `g`, are called clumsy against Source Sans 3 Black.
  The signature is used at 40px and above, which is where a clumsy counter is most
  visible rather than least. Check the actual signature strings, not a specimen: whether
  this matters depends on whether a `g` appears in them. If the pair moves to 820 this
  gets worse, not better.
- **Does the site still look like the site?** Bricolage's temperament is French,
  relaxed, Antique Olive. Commissioner is classical-proportioned humanist. Warm palette,
  editorial register, same restraint thesis — but a different voice, and Bard, FDT-E and
  the home page were composed against the old one.
- **Does `slnt −8` read as emphasis in 18px prose, or as a rendering fault?** Per R9′ the
  recommendation is already to keep `em` on weight, so this is a question about whether
  slant earns a place anywhere else — a standfirst, a pull quote — rather than about
  prose emphasis.
- **Windows at 340.** The repository itself flags the `usWeightClass` blur debate for
  Thin and ExtraLight on certain Windows versions, and ships a fix script. Worth one
  check on Windows Chrome at the signature weight.

---

## 8. Verify before building anything

Two of the four items in the earlier draft are now answered in §1.2 and §6 — the served
file does contain all four axes at their full ranges, and the payload question resolved
in Commissioner's favour by a wide margin. Two remain, plus two new ones the binaries
surfaced.

1. **Does `next/font/google` accept `axes: ['FLAR','VOLM','slnt']`?** The `axes` option is
   documented for `slnt` on Inter; custom uppercase tags are the untested case. If it
   refuses, the path is self-hosting from `@fontsource-variable/commissioner`, which is a
   different `fonts.ts`, a different preload story, and a different assertion 8a.
2. **The Google Fonts v2 API sorts axis names** with uppercase custom axes before
   lowercase registered ones — note this is *not* the `fvar` order, which is
   `wght, slnt, FLAR, VOLM`. A wrongly-ordered request 400s rather than degrading, so it
   fails fast, but it is a real gotcha if the URL is hand-built.
3. **Can `slnt` be dropped at load?** It costs 37 KB for a shear that R9′ already declines
   to use for prose emphasis. If `next/font` can request `['FLAR','VOLM']` only, the
   payload lands at 55.5 KB. If it always serves the full file, 92.7 KB — still a saving,
   but a third of it is paying for an axis the system does not use.
4. **Does anything on the site need tabular figures?** Audit `.milestone__date`, the
   `01/02/03` thread marks, and any metric in the case studies. Commissioner has no
   `tnum` and no alternate figure sets at all, so if the answer is yes, it is a hard
   constraint rather than a preference.

---

## 9. Complexity verdict

**Smaller than v3 in mechanism, larger than v3 in what it touches.** v3 was thirteen
commits, and its hardest work — deriving the clamps, finding the 6/5 pinch at 560px,
proving 1.15 across the viewport range — was ladder work, and the clamps themselves do
not move. But measurement moved two things out of the "mechanical" column and into the
"changes a locked ruling" column:

- **The 18px body and the 14px floor both shift** (≈19px and ≈15px), and rung 0 splits,
  because captions and eyebrows move in opposite directions. §2's hard constraints get
  rewritten, not retuned.
- **Ruling 3 does not survive as written.** 340/720 covers 0.443 of Commissioner's design
  space against 0.633 of Bricolage's. The pair is re-numbered or the signature gets
  quieter.

Against that, one thing moved the other way and is worth more than both: the font is
**95 KB lighter** in the configuration the system would actually use.

| | Work |
|---|---|
| **Mechanical** | Delete width tokens and every `font-stretch`; swap `fonts.ts`; rewrite assertions 1/7/8a; add assertions 10–15; extend the 8b probe |
| **Judgment, cannot be delegated** | The FLAR/VOLM values; the tracking retune at rungs 4–6; line-height at 5 and 6; the signature numbers; whether eyebrows leave rung 0 |
| **Ruling changes** | Body size; the floor; the composition of rung 0; the signature pair; tabular figures as a lost capability |

Call it nine or ten commits, but the ruling changes mean this is a **v4 document**, not a
migration inside v3. That is the honest framing: you would not be porting the type system
to a new typeface, you would be writing the next one.

Set against three unwritten case studies and an end-of-September date, that is a real
cost, and it is larger than the earlier draft of this section implied.

---

## 10. Spike scope

The migration is not the next step. The next step is a Vercel-visible sandbox that
answers §7 and §8, and the repo already has the pattern: `app/sandbox/type-bard/` with
its own `type-exp.css`, deliberately outside lint scope so widths and weights can be
tried before they earn a place in the system.

Before building it, look at **metehan.design** — Commissioner as a single typeface with a
large hero, already shipped and endorsed by the reviewer above. Fifteen minutes, and it
answers the "can it carry a hero alone" question better than any specimen.

`app/sandbox/type-commissioner/` follows the `type-bard` pattern exactly. Real Bard MDX,
not lorem. All seven rungs. Both modes. §1.2 and §6 already answer the measurement
questions, so the spike is now purely a judgment instrument. Five things it must let you
toggle:

1. **Display voice** across candidate FLAR/VOLM pairs. Note from §1.2 that the designer
   names only the extremes — Flare at `100/0`, Loud at `100/100` — so include those two
   alongside any intermediate values. FLAR and VOLM are linear, so intermediates are
   honest interpolations.
2. **Reading voice** at FLAR 0 against FLAR 10–20, per §3.3.
3. **Body size**, 18px against 19px, with a Bricolage block beside it. The measured
   x-height says 19px; whether that reads as "same size" or "bigger" is the eye's call.
4. **Rung 0 split**, caption at 15px beside eyebrow at 13px and 14px, since §6 shows one
   value cannot serve both.
5. **The signature**, 340/720 against 340/820, at 40px, 72px and 88px, both modes, with a
   `g` in the string.

No slant toggle — R9′ and the proven-shear finding in §1.2 close that question. No tokens,
no lint, no migration, nothing touching `globals.css`. If the answers come back wrong, the
whole thing deletes in one commit.

No tokens, no lint, no migration, nothing touching `globals.css`. If the answers come
back wrong, the whole thing deletes in one commit.
