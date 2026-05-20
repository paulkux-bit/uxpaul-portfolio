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
  // No `weight` array — that forces single-weight loading.
  // Omitting it loads the full variable file with all three axes.
});
```

### `app/layout.tsx`

```tsx
import { bricolage } from './fonts';
import './globals.css';

export const metadata = {
  title: 'uxpaul',
  description: 'Senior product designer — consumer-grade craft for complex technical challenges.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={bricolage.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
```

The `suppressHydrationWarning` on both `<html>` and `<body>` prevents false hydration mismatches from `next-themes` and browser extensions (ColorZilla, Grammarly, etc.) that inject attributes after server render. It does not suppress real hydration errors — only attribute-level mismatches.

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

@utility text-display {
  /* 64 → 112px — home page hero. Pushed high to fully activate the 96pt cut. */
  font-size: clamp(4rem, 5vw + 2rem, 7rem);
  line-height: 0.9;
  letter-spacing: -0.035em;
  font-weight: 600;
  font-stretch: 96%;
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
| `text-display` | 64 → 112px | Home page hero name. Used once per page. |
| `text-hero` | 48 → 80px | Case study & About hero |
| `text-h1` | 36 → 56px | Case study titles, section page titles |
| `text-h2` | 28 → 40px | Major section breaks within case studies |
| `text-h3` | 22 → 28px (weight 500) | Subsections, card titles, callouts |
| `text-lead` | 22px | Intro paragraph, project tagline, key claim |
| `text-body` | 18px | All body copy, default |
| `text-small` | 16px | Dense lists, captions, footnotes |
| `text-caption` | 14px | Date, role, year, byline |
| `text-eyebrow` | 14px caps | All-caps labels, tags |

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
For full sentences or clauses where bold would be too heavy. Use a utility class that pulls weight up to 500 and shifts color slightly (once color tokens land).

```tsx
<p className="text-body">
  This was the moment everything changed.
  <span className="emphasis-quiet">We had been solving the wrong problem all along.</span>
</p>
```

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

---

## 8 — Usage examples

```tsx
// Home hero
<section>
  <h1 className="text-display">uxpaul</h1>
  <p className="text-lead">
    Senior product designer — consumer-grade craft for complex technical challenges.
  </p>
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

When this is revisited, add a `text-wordmark` utility specific to the home page hero rather than mutating `text-display`. Keeps the system clean for everywhere else.

---

## 10 — Swap protocol

If Bricolage is ever replaced (e.g. with a purchased Stornoway, Tofino, or another variable font), only two surfaces change:

1. The `next/font/google` import in `fonts.ts` (or move to a self-hosted file)
2. The `font-stretch` values in `text-display` and `text-hero` — delete the lines if the new font has no `wdth` axis

The ten role utilities, the role map, and every component that uses them stay identical. No find-and-replace, no per-component updates. The italic strategy in Section 6 may need revisiting if the new font *does* have italics — but that's an addition, not a refactor.

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

**Dark mode adjustment to anticipate**
Type on a dark background appears slightly heavier than the same weight on a light background. If display or hero feels heavy in dark mode once `next-themes` is wired up, drop the weight by ~50 in the dark variant (600 → 550). Don't pre-empt this — wait until you can see it.

---

## 12 — Test page

Quick visual audit page at `app/page.tsx` (or wherever convenient during scaffolding):

```tsx
export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24 space-y-16">
      <section className="space-y-6">
        <h1 className="text-display">uxpaul</h1>
        <p className="text-lead">
          Senior product designer — consumer-grade craft for complex technical challenges.
        </p>
      </section>

      <section className="space-y-3 border-t border-neutral-200 pt-12">
        <p className="text-eyebrow">2023 · URBN</p>
        <h3 className="text-h3">Cross-brand navigation</h3>
        <p className="text-body">
          Eight designers, four global brands — building a unified navigation system
          that preserved each brand's voice within one shared design language. The
          <em>visible</em> result: faster onboarding, fewer cross-brand support tickets.
        </p>
        <p className="text-caption">Lead designer · 8 months</p>
      </section>

      <section className="space-y-6 border-t border-neutral-200 pt-12">
        <h2 className="text-h2">Type scale audit</h2>
        <div className="space-y-3">
          <p className="text-display">Display 64→112</p>
          <p className="text-hero">Hero 48→80</p>
          <p className="text-h1">Heading 1 — 36→56</p>
          <p className="text-h2">Heading 2 — 28→40</p>
          <p className="text-h3">Heading 3 — 22→28</p>
          <p className="text-lead">Lead paragraph — 22</p>
          <p className="text-body">Body — 18. Default reading size for case studies and prose.</p>
          <p className="text-small">Small — 16. Dense lists and captions.</p>
          <p className="text-caption">Caption — 14. Meta and bylines.</p>
          <p className="text-eyebrow">Eyebrow — 14 caps</p>
        </div>
      </section>
    </main>
  );
}
```

Delete this page once real home page content lands. The audit is scaffolding, not a feature.
