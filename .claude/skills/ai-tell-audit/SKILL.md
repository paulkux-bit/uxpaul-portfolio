---
name: ai-tell-audit
description: Audit a page, screen, or whole site for the tells that make it read as AI-made — the generic layout skeleton and the AI-voiced copy. Detection and reporting only; it finds and names tells, then hands fixes to the skill that owns them. Use whenever the question is "does this look AI-made / generic / like slop," "does this read as AI," "tell check," "genericness audit," "is this too generic," "run the tell check," "does the site back its own claims," or before shipping any surface of uxpaul.com. Runs a mechanical copy pass (grep + counts) and a structural pass (read the source / read the render), then reports what fired ranked by severity. Composes with — does not replace — the content strategist (07-content-strategy.md, owns copy rewrites), plain-pass (owns readability), and 05-anti-patterns.md (canonical banned list). NOT for writing new copy, positioning, or design decisions.
---

# AI-tell audit — does this read as AI-made?

The job of this skill is one question asked mechanically: **where does this surface read as something a model produced with a loose brief, rather than something Paul decided?**

It does not write copy, invent positioning, or make design calls. It finds tells, names them, says why each fires, and points the fix at the skill or doc that owns it. Turning "this feels AI" into a list of located, checkable hits is the whole value — a taste problem becomes a compliance problem, and compliance is checkable.

## The one idea to hold onto

A ban moves the default down the ranking, not out of it. Ban Inter and the model reaches for Geist. Ban the em dash and it reaches for the colon. So two things follow, and they set the order of this audit:

1. **Structure is the deeper tell.** The section order and page skeleton survive a font swap, a palette change, and a new icon set. Audit structure first; a page can pass every copy check and still read as AI from its shape alone.
2. **Mechanize what you can.** "Does this look good" gets unreliable answers. "Is there a pill badge above the headline? How many distinct radius values are in this file? Is there an em dash in this paragraph?" get answers you can check. Push every check that can be a grep or a count into `grep-pass.sh`; reserve judgment for what genuinely needs an eye.

## What this owns, and what it hands off

This skill **detects and reports**. It does not fix. When a tell fires, route the fix:

- **Copy rewrites** → the portfolio content strategist (`07-content-strategy.md`). It owns voice, the banned list, headline rules, the honesty/cross-check rules.
- **Readability** (a line is hard to understand, not just generic) → `plain-pass`.
- **Banned words and design anti-patterns** → `05-anti-patterns.md` is canonical. This skill treats that file as the source of truth and only *adds* the article's tells that Paul's lists do not already name.
- **Positioning / hero** → locked in `00-project-overview.md` and `07` §4.1. Out of scope. Do not flag the locked hero as a tell for being short; restraint is the intended signal.

If the audit is asked to also fix, run the detection pass first, deliver the findings, then invoke the owning skill for the fixes as a separate step.

## Branch on scope

- **Copy only** (a paragraph, a case study, hero/card copy pasted in): run the copy pass, skip structure.
- **Structure only** (a layout, a component, a screenshot): run the structural pass, skip copy.
- **A surface or the whole site** (a route, or "audit the site"): run both, structure first.

## The workflow

### 1. Scope and gather
Name the surface(s). Get the material: source files (`.mdx`, `.tsx`, `globals.css`), a live URL or preview, and screenshots if a render is available. In Claude Code and Cowork there is a shell and a browser, so gather real files and real renders. In Claude web there is neither, so work from pasted source and pasted screenshots and say so in the report.

### 2. Mechanical copy pass
Run `grep-pass.sh` from the repo root (or paste the copy and run the greps inline). It reports, with `file:line`:

- em dashes per file (flag files over the threshold — one per paragraph is Paul's intended ceiling, not zero)
- interpuncts `·` and trailing arrows `→` at the end of links
- negation-pair constructions ("not X, it's Y" / "not X but Y")
- banned words (seeded from `05` voice section and `07` §3, plus the article's additions)
- distinct border-radius, font-size, and spacing token counts in `globals.css`

Report **every** hit. Do not summarize them away — a silent pass reads as "clean" when it was not checked. Then judge each hit: intentional or a tell. Paul uses em dashes on purpose and mono for numbers on purpose; those are not automatic fails. See `copy-tells.md` for the full inventory and which items have legitimate uses.

### 3. Structural pass
Read the source, and the render if you have one, against `structural-tells.md`. This is where the AI skeleton hides. Check the countable ones first (they are in the grep output already): distinct radii, distinct font sizes, distinct spacing steps. Then the shape checks: centered-everything, pill badge above the headline, three-column icon-card grid, gradient on one word, backdrop-blur nav, uniform section padding top to bottom, a "Trusted by" logo strip, a four-column footer, a timid type scale where the largest text is barely larger than the body.

### 4. Divergence-ledger check
For each major surface, is there a **named default** and a **chosen divergence**, or has it drifted back to the middle? Paul's locked docs already carry most of these decisions (Bricolage over the overused sans, oklch roles over Tailwind defaults, one persimmon accent, names-led hero over a positioning tagline). The audit's job is to confirm the *built* surface still matches the *decided* one. A surface whose ledger reads "default: centered hero / instead: centered hero with more spacing" has not diverged; flag it.

### 5. Render and read (when a browser is available)
Screenshot every route and important state at 390 and 1440, light and dark. Read the screenshots back and re-run the structural list against what actually rendered. Spacing rhythm, crowding, broken states, and weak hierarchy show up in the render in ways the source does not. Never report "done" on structure from reading code alone when a render was available.

### 6. Report
Rank findings most-severe first. Each finding is: **the tell**, **where** (`file:line` or the route + region), **why it fires**, and **the owning fix** (which skill or doc). Close with the three quick "is it working" reads:
- **Read the ledger, not the screen.** Do the decisions contain real divergences?
- **Count.** Distinct font sizes, radii, spacing steps. Too few and there is no hierarchy; too many and there is no system.
- **Grep first, read second.** The copy hits are the fastest, loudest tells.

## Severity

- **High** — a structural skeleton match (the page reads as a template), agency/direct client conflation, a vague metric, or a cross-check exposure. These cost Paul the Marcus and Jordan read.
- **Medium** — a copy tell cluster (several banned words, negation pairs, em-dash overrun), a countable overrun (nine radii, three font sizes), a missing divergence.
- **Low** — a single em dash in a long paragraph, one trailing arrow, Title Case on a label. Note it, do not alarm on it.

## False positives — do not flag these

Pulled from Paul's own docs so the audit does not fight intended choices:

- **Em dashes at one per paragraph.** Intended. Only the third one in a paragraph is a tell.
- **Mono for numbers, IDs, or code.** Legitimate. Mono as decoration on a section label is the tell.
- **The short, names-led hero.** Locked and deliberate. Its restraint is the signal, not a gap.
- **First-person prose.** Required voice, not a tell.
- **A specific number that reads "designed" (47%, not 50%).** That is the target, not a tell.

## Portability

- **Claude web** — no shell, no browser. Read pasted source and pasted screenshots, run the checklist by eye, note in the report that the mechanical pass was not run.
- **Cowork** — shell available; stage the repo's text files and run `grep-pass.sh`. A browser render is possible but heavy; prefer source-based structural checks unless a render is specifically wanted.
- **Claude Code** — shell, browser, repo, and hooks. Run the full loop including render-and-read. `grep-pass.sh` can also be wired as a `Stop` hook so the check runs on every build; that wiring lives in the repo, not in this skill.

## Files

- `copy-tells.md` — the copy tell inventory, grep patterns, and the legitimate-use notes.
- `structural-tells.md` — the visual-skeleton checklist and the countable thresholds.
- `grep-pass.sh` — the portable mechanical pass. Run from repo root.
