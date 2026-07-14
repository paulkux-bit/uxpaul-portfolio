# Typography system — Bricolage Grotesque

Locked May 2026. Source of truth for the portfolio's typography. Engineered around the font's three variable axes (`wght`, `wdth`, `opsz`) — informed by Mathieu Triay's design notes at https://ateliertriay.github.io/bricolage/#design-notes.

This isn't a generic type scale with Bricolage swapped in. The scale exists to use the personality Mathieu drew into the font at different sizes.

---

## 1 — What Bricolage actually is (and why the scale is shaped this way)

Bricolage Grotesque is essentially two fonts in one file — connected by a continuous optical-size axis (`opsz`). At the 12pt master, the font is a neutral, contemporary humanist sans optimized for reading. At the 96pt master, it's an expressive editorial display with visible ink traps, more contrast, and more attitude. Everything between is interpolated.

The width axis (`wdth`, 75–100) is the font's geographic personality: 100 is its French/Antique Olive side — relaxed, confident, slightly warm. 75 is its British/Grotesque No. 9 side — anxious, compressed, slightly wonky. Compressed at large sizes leans editorial-British (closer to Stornoway). Default-width at large sizes leans editorial-French (closer to Tofino).

Weight (`wght`, 200–800) is straightforward, with one detail: at very light weights, the stems flare up to maintain visual weight against the ink traps. This is a stylistic decision by Mathieu — light weights still have spine.

**Hard constraint: no italics.** Bricolage ships without italics. There is no oblique either. Emphasis in body has to be solved with weight, color, or another mechanism. This shapes how we use the font and is addressed explicitly below.

---

## 2 — Font loading

Use `next/font/google` rather than `@fontsource` or `<link>` tags. Subsetting, preloading, and CSS variable wiring are handled automatically.

### `app/fonts.ts`

```typescript
import { Bricolage_Grotesque } from 'next/font/google';

export const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
  // `next/font/google` ships ONLY the default `wght` axis for a variable font
  // unless the others are named explicitly. `opsz` and `wdth` MUST be listed
  // here or `font-optical-sizing` and `font-stretch` have no axis to act on and
  // are silently inert. `wght` is the default — do not list it. Do not add a
  // `weight` prop; it's mutually exclusive with variable-axis loading.
  axes: ['opsz', 'wdth'],
});
```

> **Hard-won note:** an earlier version of this doc claimed omitting `weight`
> "loads the full variable file with all three axes." That is wrong, and it
> shipped a bug — `opsz`/`wdth` were absent and every optical-sizing /
> `font-stretch` rule did nothing in production until the `axes` line was added.

### `app/layout.tsx`

```tsx
import { bricolage } from './fonts';
import { ThemeProvider } from '@/components/theme-provider';
import { PopUpProvider } from '@/components/popup-context';
import { SiteHeader } from '@/components/site-header';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={bricolage.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <PopUpProvider>
            <SiteHeader />
            <main id="main" tabIndex={-1}>{children}</main>
          </PopUpProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

Trimmed for the font wiring; see the real `app/layout.tsx` for the popup
pre-paint script and metadata. Theme switching is **class-based** (`attribute="class"`
→ `.dark` on `<html>`), not `data-theme`. The `suppressHydrationWarning` on both
`<html>` and `<body>` prevents false hydration mismatches from `next-themes` and
browser extensions (ColorZilla, Grammarly, etc.) that inject attributes after
server render. It does not suppress real hydration errors — only attribute-level mismatches.

---

## 3 — Tailwind v4 theme

Enable optical sizing globally. This means every rendered size automatically gets the correct `opsz` value — body at 18px renders close to Mathieu's 12pt master, hero at 96px renders his 96pt master. One CSS declaration, the whole personality system activates.

### `app/globals.css` (top of file)

```css
@import 'tailwindcss';

@theme {
  --font-sans: var(--font-bricolage), system-ui, sans-serif;
}

@layer base {
  html {
    font-family: var(--font-sans);
    font-optical-sizing: auto;       /* Activates the opsz axis */
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Bricolage has no italics — map em/i to weight emphasis instead.
     Without this, browsers synthesize a fake oblique that looks bad. */
  em, i {
    font-style: normal;
    font-weight: 600;
  }
}
```

---

## 4 — The type scale

Floor raised: nothing below 14px. Body at 18px (editorial standard). Display sizes pushed harder to reach Mathieu's 96pt cut and get the full character.

The `font-stretch` property maps directly to Bricolage's `wdth` axis. Lower numbers = more British/compressed. Used only on display and hero — body text stays at default 100% for warmth.

```css
/* === Display & headings (fluid) === */

@utility text-statement {
  /* 40 → 96px — the largest single type role. (text-display, an unused step, was
     cut — see §9.) Stretch 96%, weight 600; §11 rejected 92–94% as "squeezed" at
     display sizes. The May-2026 168px amplification was reverted (bombast); the
     home hero now leads with text-lede instead. */
  font-size: clamp(2.5rem, 4vw + 1.75rem, 6rem);
  line-height: 1;
  letter-spacing: -0.025em;
  font-weight: 600;
  font-stretch: 96%;
  text-wrap: balance;
}

/* text-lede — home hero weighted sentence (Direction D1). The element rides a
   thin 340 + recessive tone; the load-bearing noun phrases jump to font-[720] +
   --text-primary inline, so weight carries the emphasis (Bricolage's wght axis
   doing semantic work). No font-variation-settings; opsz auto. */
@utility text-lede {
  font-size: clamp(2rem, 4.5vw, 3.75rem); /* 32 → 60px */
  line-height: 1.08;
  letter-spacing: -0.02em;
  font-weight: 340;
  font-stretch: 100%;
  text-wrap: balance;
}

@utility text-hero {
  /* 48 → 80px — case study & about page heroes */
  font-size: clamp(3rem, 3vw + 2rem, 5rem);
  line-height: 0.95;
  letter-spacing: -0.025em;
  font-weight: 600;
  font-stretch: 97%;
}

@utility text-h1 {
  /* 36 → 56px — case study titles, section page titles */
  font-size: clamp(2.25rem, 1.75vw + 1.625rem, 3.5rem);
  line-height: 1.05;
  letter-spacing: -0.02em;
  font-weight: 600;
}

@utility text-h2 {
  /* 28 → 40px — major section breaks within a case study */
  font-size: clamp(1.75rem, 1vw + 1.375rem, 2.5rem);
  line-height: 1.15;
  letter-spacing: -0.015em;
  font-weight: 600;
}

@utility text-h3 {
  /* 22 → 28px — subsections, card titles, callouts.
     Weight 500 (not 600) differentiates from H2 by weight as well as size. */
  font-size: clamp(1.375rem, 0.5vw + 1.125rem, 1.75rem);
  line-height: 1.25;
  letter-spacing: -0.01em;
  font-weight: 500;
}

@utility text-cover {
  /* 22 → 32px — case-study card cover headline (the typographic-tier cover,
     where the first-person problem framing IS the cover). Sized between h3 and
     h2 and capped lower than h2 so the longest framings still fit the
     aspect-video well at 360/390 without clipping; text-wrap: balance evens the
     lines. Cover-only role, not a section heading. No font-stretch — wdth
     compression only earns its keep above ~48px; below that it just cramps. */
  font-size: clamp(1.375rem, 1.4vw + 1rem, 2rem);
  line-height: 1.12;
  letter-spacing: -0.015em;
  font-weight: 600;
  text-wrap: balance;
}

/* === Body & supporting (fixed) === */

@utility text-lead {
  /* 22px — intro paragraph, project tagline, key claim */
  font-size: 1.375rem;
  line-height: 1.5;
  letter-spacing: -0.005em;
  font-weight: 400;
}

@utility text-body {
  /* 18px — all body copy, default. Editorial reading size. */
  font-size: 1.125rem;
  line-height: 1.65;
  font-weight: 400;
}

@utility text-small {
  /* 16px — dense lists, image captions, footnotes */
  font-size: 1rem;
  line-height: 1.55;
  font-weight: 400;
}

@utility text-caption {
  /* 14px — meta data: date, role, year. The system's floor. */
  font-size: 0.875rem;
  line-height: 1.45;
  font-weight: 400;
}

@utility text-eyebrow {
  /* 14px UPPERCASE — all-caps labels, tags, eyebrow text.
     Tracking at 0.08em gives caps room to breathe. */
  font-size: 0.875rem;
  line-height: 1.4;
  letter-spacing: 0.08em;
  font-weight: 600;
  text-transform: uppercase;
}
```

---

## 5 — Role map

| Utility | Size (mobile → desktop) | Where it goes |
|---|---|---|
| `text-statement` | 40 → 96px | Home positioning statement. The largest single type role. Once per page. |
| `text-lede` | 32 → 60px | Home hero weighted sentence (h1). Thin base (340); key noun phrases jump to `font-[720]` so weight carries emphasis. |
| `text-hero` | 48 → 80px | Case study & About hero |
| `text-h1` | 36 → 56px | Case study titles, section page titles |
| `text-h2` | 28 → 40px | Major section breaks within case studies; card title (media-tier cover) |
| `text-h3` | 22 → 28px (weight 500) | Subsections, callouts |
| `text-cover` | 22 → 32px (weight 600) | Case-study card cover headline (typographic tier). Card-only. |
| `text-lead` | 22px | Intro paragraph, project tagline, key claim |
| `text-body` | 18px | All body copy, default |
| `text-small` | 16px | Dense lists, captions, footnotes |
| `text-caption` | 14px | Date, role, year, byline; card project·client meta |
| `text-eyebrow` | 14px caps | Reserved for all-caps tags. (The home "Selected work" label is intentionally sentence-case, not eyebrow — warmer register.) |

Eleven role utilities (`text-display` was cut as homeless — see §9).

Floor is **14px**. Anything that wants to be smaller — change the layout, don't shrink the type.

**No H4.** If a fourth heading level is needed, the case study structure is too deep. Flatten it, or use `text-eyebrow` as a sub-block label instead. This is intentional discipline, not an oversight.

---

## 6 — Emphasis strategy (no italics)

Bricolage has no italics. This is the single most important design constraint to internalize. The instinctive `<em>` → italic mapping doesn't work — and the browser's synthetic oblique on a font without real italics looks visibly wrong.

The base style in `globals.css` (Section 3) maps `<em>` and `<i>` to weight 600. That's the default emphasis mechanism. Three patterns of use:

### Pattern A — Default inline emphasis
Just write `<em>` (or `*emphasis*` in MDX). Renders at weight 600. No additional classes needed.

```tsx
<p className="text-body">
  The <em>visible</em> result: faster onboarding.
</p>
```

### Pattern B — Quiet emphasis (longer passages)
For full sentences or clauses where bold would be too heavy. `<em>` (weight 600)
is *loud* emphasis; this is the *quiet*, contrastive register italic would
otherwise carry. The `emphasis-quiet` utility is **defined** in `globals.css`:
`font-weight: 500; color: var(--text-secondary)`.

```tsx
<p className="text-body">
  This was the moment everything changed.
  <span className="emphasis-quiet">We had been solving the wrong problem all along.</span>
</p>
```

### Product, ship, and project names
Do **not** emphasize them. "Bard", "Dagr", "FDT-E" are normal-weight proper
nouns — they earn identity through repetition and context, not type style.
Inline-bolding every codename is visual noise.

### Pattern C — No type-style emphasis at all
For book titles, foreign words, ship names — use quotation marks or a different mechanism. Don't lean on type style.

```tsx
<p className="text-body">
  I borrowed the structure from Tufte's "Visual Display of Quantitative Information."
</p>
```

---

## 7 — Advanced: manual axis control

`font-optical-sizing: auto` handles 95% of cases. For the other 5%, override `opsz` or `wdth` directly using standard CSS properties — no `font-variation-settings` needed unless absolutely necessary.

```css
/* Force display-style character at a non-display size — useful for
   small-but-expressive moments like a pull quote at 24px that wants
   the 96pt ink-trap personality */
.pull-quote {
  font-size: 1.5rem;            /* 24px */
  font-optical-sizing: none;
  font-variation-settings: 'opsz' 72;
}

/* Force the neutral 12pt cut at a larger size — useful for dense data
   tables where you want the readability of the 12pt master at 20px */
.data-cell {
  font-size: 1.25rem;
  font-variation-settings: 'opsz' 12;
}

/* A single hero word with maximum British/anxious compression */
.hero-word-compressed {
  font-stretch: 80%;
}
```

Use sparingly. The whole point of `auto` is that the font modulates personality at the right places. Manual overrides are for breaking the rule deliberately, not for tuning the system.

### Sanctioned multi-axis instances

The examples above are single-axis (`opsz` alone, or `wdth` via `font-stretch`). Folding **multiple** axes into one `font-variation-settings` declaration — instead of opsz-via-FVS plus wdth/wght via standard properties — is reserved for cases where the axes must render *together* and can't be allowed to drift apart in the cascade (mixing an opsz-only FVS with `font-weight`/`font-stretch` is fragile; FVS and the standard properties can fight, hence the LAST-declaration rule below). Two live, sanctioned instances:

1. **`text-qh-title`** ("Also shipped" brief titles) — per-module `opsz`/`wght`/`wdth` so the four blocks read as one curated set (first instance).
2. **`.milestone__date`** (BARD reflection arrival crescendo) — `'opsz' 96, 'wdth' 100, 'wght' 520` forces Bricolage's ink-trapped 96pt display cut on the "Spring 2027" payoff line. The case study's closing moment earns the display exception (second instance, added 2026-07-14).

Both pair `font-optical-sizing: none` with the FVS as the **last** declaration in the rule so the forced `opsz` wins over any standard-property fallback. Any new multi-axis FVS use should be deliberate and logged here. (The `CLAUDE.md` "FVS only on the hero callout" summary predates both and is now stale — treat this section as the source of truth.)

---

## 8 — Usage examples

```tsx
// Home hero — weighted sentence (Direction D1). h1 is text-lede; weight carries
// the emphasis (thin connectives + bold noun phrases). Name is the signature.
<section>
  <h1 className="text-lede text-muted">
    I design <span className="font-[720] text-primary">intelligence platforms</span>{' '}
    for the <span className="font-[720] text-primary">U.S.&nbsp;Navy</span>.
  </h1>
  <p className="text-h3">
    <span className="font-semibold text-primary">Paul Kali</span>
    <span className="text-secondary"> · Senior Product Designer</span>
  </p>
  <p className="text-body">Modernizing the tools thousands of operators rely on…</p>
</section>

// Case study card
<article>
  <p className="text-eyebrow">2023 · URBN</p>
  <h3 className="text-h3">Cross-brand navigation</h3>
  <p className="text-body">
    Eight designers, four global brands — building a unified navigation system
    that preserved each brand's voice within one shared design language. The
    <em>visible</em> result: faster onboarding, fewer cross-brand support tickets.
  </p>
  <p className="text-caption">Lead designer · 8 months</p>
</article>

// Case study detail page
<article>
  <p className="text-eyebrow">Case study</p>
  <h1 className="text-hero">Cross-brand navigation at URBN</h1>
  <p className="text-lead">
    How four global brands ship navigation as one system without
    sounding like one company.
  </p>
  
  <h2 className="text-h2">The problem</h2>
  <p className="text-body">
    URBN's four brands had drifted apart in <em>visible</em> ways —
    navigation patterns, button shapes, even the meaning of "search."
  </p>
  
  <h3 className="text-h3">What we tried first</h3>
  <p className="text-body">...</p>
</article>
```

---

## 9 — Signature moves: deferred

The system as locked is a solid neutral foundation. Distinctive typographic moments are deliberately deferred until real home page and case study content exists. Don't invent them in the abstract — design them against real content.

Three places a signature move could live, with my current best guesses:

**Wordmark ("uxpaul" on home hero)** — strongest candidate
- Push compression further (84–88%) just on the wordmark for real editorial-British bite
- Drop weight to 400 or 500 for an unexpected light-display moment (Bricolage's light weights have those flared stems Mathieu mentions — they look great big)
- Add subtle letter-spacing variation
- Pull the wordmark size up further — make it dominate, not just lead

**Lead paragraph** — second candidate
- Push weight from 400 to 500 (more warmth)
- Tighter tracking
- Slightly larger

**Eyebrow** — leave alone unless there's a specific concept
- Eyebrows are conventional because they work
- Messing with them creates extra reading work

When this is revisited, add a dedicated `text-wordmark` utility for the home hero. (The old 112px `text-display` step was **cut** — it had no consumer once the home h1 became `text-statement`, and the wordmark wants its own compression anyway. Don't resurrect `text-display`; give the wordmark its own utility.)

> **Axis dependency:** the current `.wordmark` chrome already sets `font-stretch: 88%`. That only renders once `app/fonts.ts` loads the `wdth` axis (`axes: ['opsz','wdth']` — see §2). Before that fix it was inert; expect the shipped wordmark's width to *change* when the axes land.

---

## 10 — Swap protocol

If Bricolage is ever replaced (e.g. with a purchased Stornoway, Tofino, or another variable font), only two surfaces change:

1. The `next/font/google` import in `fonts.ts` (or move to a self-hosted file) — including the `axes` array if the new font's non-default axes differ
2. The `font-stretch` values in `text-statement` and `text-hero` (and `.wordmark`) — delete the lines if the new font has no `wdth` axis

The eleven role utilities, the role map, and every component that uses them stay identical. No find-and-replace, no per-component updates. The italic strategy in Section 6 may need revisiting if the new font *does* have italics — but that's an addition, not a refactor.

---

## 11 — Decisions & rationale

**Why 18px body, not 16 or 17?**
Editorial portfolios at the senior/director level read better at 18. Design directors and recruiters reviewing the site skew older than the median dev audience. 16 is the developer norm, 17 is a halfway compromise, 18 is the editorial standard.

**Why 14px floor?**
13px and below is where letterforms start to lose definition — counters fill in, ink traps disappear (Bricolage's at small sizes especially). 14px is the legibility floor for sans body work on modern displays.

**Why push display to 64–112px?**
Mathieu's 96pt cut is designed to be seen. If display tops out at 72px, the design space gets sampled at maybe 75% of where the ink traps and contrast really sing. Pushing to 112px on desktop gets the full personality the font was drawn for.

**Why `font-stretch: 96%` and `97%` (not 92/94)?**
First pass was 92/94. At full desktop display sizes, that read as "squeezed" rather than "considered editorial." 96/97 keeps the editorial intent without sacrificing readability. If wordmark wants more compression later, add a dedicated `text-wordmark` utility — don't push the system-level utilities further.

**Why H3 at weight 500 (not 600)?**
First pass had H3 at 600. Side-by-side with H2 at 600, the two read as the same heading at slightly different sizes. Dropping H3 to 500 differentiates by weight as well as size — H3 reads as "section heading inside content" rather than "small section title."

**Why no H4?**
First pass included H4 at 20px. Sitting between Lead (22) and H3 (22–28), it had no clear role. More importantly: portfolios with H4 in the hierarchy are usually too deeply nested. Forcing the floor at H3 forces case study structure to stay readable. If a fourth level is genuinely needed, use `text-eyebrow` as a sub-block label.

**Why `text-eyebrow` instead of `text-micro`?**
Naming by use, not by size. "Eyebrow" tells you it's an all-caps label sitting above a heading. "Micro" just tells you it's small — which would also be misleading, since the floor is 14px.

**Why `font-weight: 600` and `letter-spacing: 0.08em` for `text-eyebrow`?**
Caps at light weights look anemic. 600 gives them the visual weight to function as a label. First pass had tracking at 0.06em — caps almost always want more air than the eye initially thinks; 0.08em opens them up without making them feel sparse.

**Why the font is ~128kb (an accepted budget exception)**
Loading both non-default axes (`opsz` + `wdth`) puts the primary basic-latin
woff2 at ~128kb. Measured cost: ~40kb wght-only, +~35kb per axis, ~128kb for
both. The team's ordinary font budget is ≤80kb, which a single axis would meet
(~75kb) — but dropping either axis kills half the personality (optical sizing OR
editorial compression). Paul approved the overage (May 2026): on a portfolio
where type *is* the craft signal, the full personality is worth 48kb, and
`font-display: swap` keeps it non-render-blocking. Documented in the
portfolio-fullstack-lead / portfolio-qa budgets so it isn't "fixed" back later.

**Dark mode adjustment to anticipate**
Type on a dark background appears slightly heavier than the same weight on a light background. If display or hero feels heavy in dark mode once `next-themes` is wired up, drop the weight by ~50 in the dark variant (600 → 550). Don't pre-empt this — wait until you can see it.

### Tuning pass — May 2026 (hero rewrite)

Triggered by the names-led hero rewrite ("Paul Kali" + role tag). Four candidates
evaluated against the running site and the decisions already recorded above. The
authoritative axis semantics were re-confirmed from Mathieu Triay's notes (wdth:
Antique Olive/relaxed at 100 → Grotesque No.9/anxious as it compresses; opsz: 12pt
↔ 96pt masters).

- **Display wdth (`text-statement`) — NO CHANGE, stays 96%.** The brief proposed
  92–94% for a more editorial feel, but that exact range is already on record
  above as having read "squeezed" at full desktop display sizes. The new hero is
  a short proper name rather than a multi-line statement, but that doesn't change
  the per-glyph readability evidence at 96px, and the locked, eyeball-based 96%
  decision shouldn't be overridden sight-unseen. Revisit only if the 1440 eyeball
  finds 96% too loose for a two-word name.
- **Body on mobile (`text-body`) — NO CHANGE, stays fixed 18px.** 18px is the
  deliberate editorial body floor (rationale above). A `clamp()` dipping to 17px
  on 390 would trade that away to solve a "chunky" perception that isn't
  established; the measure (`max-w-[62ch]`) does the comfort work. Revisit only
  if the 390 eyeball reads genuinely heavy.
- **Eyebrow tracking (`text-eyebrow`) — NO CHANGE, stays 0.08em.** Already at the
  value the brief targets (and already raised from a 0.06em first pass). 0.08em
  gives the role tag ("Senior Product Designer") enough air at 14px without
  feeling sparse; a global retune would ripple to every eyebrow.
- **Dark display weight — NO CHANGE yet (candidate live).** The "don't pre-empt"
  note above applies: a 600→550 dark drop for `text-statement` is the right move
  *if* the Low Light eyeball finds the name heavy, via `.dark .text-statement
  { font-weight: 550 }` (mirrors `--mark-weight` 700→650). Not applied blind.

- **Confirmed satisfied (no work):** `font-optical-sizing: auto` is on `html`;
  `text-statement` already emits `font-stretch` (live because `fonts.ts` loads
  `axes: ['opsz','wdth']`).

Net: the tuning pass made no blind code changes — every candidate either matches
a prior eyeballed decision or is explicitly deferred to the in-browser check.

### Amplification pass — May 2026 (hero name scale)

A follow-up hero spec wanted the name much larger. Diagnosis: the issue was
**scale, not the width axis** — at the 96px cap "Paul Kali" filled only ~40% of
the desktop column. Change made:

- **`text-statement` size cap 96px → 168px:** `clamp(3.75rem, 10vw, 10.5rem)` →
  60px (390) · 102px (1024) · 144px (1440) · 168px (1920, capped). One line at
  every breakpoint.
- **Width stays 96%, weight stays 600.** The spec proposed 93% / 650; both were
  declined in favour of the recorded "92–94% squeezed" finding and the weight-600
  decision above. Width was never the problem.
- **Method:** standard `font-stretch` / `font-weight` (not `font-variation-
  settings`, per the CLAUDE.md constraint) — `opsz` still auto-tracks, so the
  96pt master expresses at the new display sizes. DevTools shows
  `font-stretch: 96%` + `font-weight: 600` + `font-optical-sizing: auto`.
- **Hero entrance:** CSS keyframe staggered fade-up (`.hero-beat`,
  motion-safe-gated), not Framer — keeps the hero a server component and visible
  with JS off.

### Reverted → "weighted sentence" (Direction D1, May 2026)

The 168px amplification **regressed** (council grade B−): the giant name read as
bombast, inverted the brand's restraint signal, competed with the proof for the
first read, and opened a ~9× hierarchy cliff to the body. Reverted:

- **`text-statement` back to 40→96px** (its lock). Now unused on home.
- **New `text-lede` (32→60px) leads the hero** as a *weighted sentence*: the
  element rides a thin 340 + `--text-muted`; the two key noun phrases jump to
  `font-[720]` + `--text-primary`, so **weight carries the emphasis** — Bricolage's
  wght axis doing semantic work (its signature move), all via plain `font-weight`
  (no `font-variation-settings`; opsz auto). The name drops to a `text-h3`
  signature. This is beautiful *and* senior: one expressive device, no shouting,
  no color, proof-led. The lesson: the hero wanted *expression on the weight
  axis*, not *more scale on the name*.

- **Hero scale ladder (Phase 1 lock):** `text-lede` 60 → `text-h3` (name) 28 →
  `text-body` (proof) 18 → `text-small` (availability) 16. Step ratios
  2.14 / 1.56 / 1.13 — each register steps down intentionally (the availability
  coda was moved 18→16 so no two registers share a size).

### Phase 2 — page arc + two-scale spacing

The whole home page reads as one designed sequence by giving **each register a
different Bricolage axis to express** (not just a different size):

| Register | Where | cap | owns |
|---|---|---|---|
| Display | hero catch line (`text-lede`) | 60px | **weight** (340 → 720 shift) |
| Major | work titles — Selected Work cards + Also Shipped | 32–40px | **width** (`font-stretch: 90%`) |
| Editorial | hero proof, prose (`text-body`) | 18px | — (neutral, reading) |
| Eyebrow/Caption | section labels (sentence-case), project·client meta | 14px | tracking |
| Subordinate | availability (`text-small`), footer (`text-caption`) | 16/14px | tone |

- **Major owns width:** `text-cover` (typographic card title) + the media-tier
  card `<h2>` carry `font-stretch: 90%` — rhyming with Also Shipped's
  `text-qh-title` (~90%) so the two work modules read as one compressed-title
  family, distinct from the hero's weight device. Compression also helps the long
  first-person framings fit the aspect-video well. Fallback 92% if tight.

**Two-scale spacing** (editorial drama, not uniform Tailwind rhythm):
- **Intimate** 12–24px within groups: hero beat-groups 20px (`space-y-5`),
  label→grid 24px (`space-y-6`), card title→meta 8–12px.
- **Sectional** 96 / 80 / 128px (base / xl / 2xl) between sections + 128px above
  the footer. ~4–5× the intimate scale. Section breaks are **space, not rules** —
  the footer's top hairline is the page's only structural line (declined adding
  section dividers: they'd read agency-decorative).

**Bento proximity pair (`--bento-caption-gap` / `--bento-row-gap`).** The bento gallery
(`components/bento.tsx`) binds each caption DOWN to its own tile via a deliberate ratio: caption→media
`0.5rem`, row→row `2rem` (1:4). `--bento-row-gap` is on the {0.75,1,2,6} scale; **`--bento-caption-gap:
0.5rem` is a sanctioned off-scale value** — the scale's tightest step (0.75rem) doesn't bind tight
enough to read as "this caption belongs to the tile below." Don't "correct" the 0.5rem to 0.75rem; it
would weaken the bind.

**Hero left-weight fix (Option 1):** the catch line widens to a 2-line band at
desktop (`xl:max-w-[30ch]`, ≥1280) so the hero top spans the column like the
cards; ≤1024 keeps the 18ch / 3-line wrap. `text-wrap: balance` guards the split.

References studied: Triay specimen (weight-as-event, width-as-character,
compressed leading, near-empty space framing display); Kosas (restraint, narrow
column, sentence-case labels); Awwwards Bricolage portfolios as anti-refs (only
Display is loud — no every-section-shouts, no decorative rules).

The scaffolding type-audit page has been superseded by the real home page
(`app/page.tsx`) and case-study cards. No standalone audit page ships.

If you want a throwaway specimen sheet again, build it with the **current**
utilities (no `text-display`; include `text-statement` and `text-cover`) and use
**warm tokens** for any rules/borders (`border-subtle` / `border-default`) — never
cool Tailwind neutrals like `border-neutral-200`, which violate the warm-only
color rule.
