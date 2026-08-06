# Migrating to type system v3 — the plan

Companion to `docs/type-system-v3-locked.md`. That document says what the system is; this one says how `main` gets there without a big-bang commit.

The organising idea comes from §7 of the locked doc: **`npm run lint:type` run against `main` today fails eight of its nine assertions, so the test is the checklist.** Each commit below turns exactly one assertion green. The lint script lands first and stays red on purpose — a failing test that nobody has wired into the build is a to-do list with a definition of done attached.

**The invariant that makes this work: the lint rules are written once, at full strength, in C0. Later commits change the code, never the test.** If a rule appears to need softening so a commit can look clean, the commit is wrong, not the rule. (An earlier draft of this plan claimed "2 of 8 passing" after C0. That was an error with no derivation behind it, and it would have been reachable only by weakening two assertions. Corrected here.)

---

## Sequencing

**C0 — Harness and tokens.** Add the three width tokens and five weight tokens under `@theme static`, and add `lint:type` beside the existing `lint:prose` with all nine assertions live at full strength and the allowlist empty. Do **not** wire it into `npm run build` yet. Nothing visual changes in this commit; it exists so every commit after it has a number to move. **Expected state at the end: 1 of 9 passing** — only 8a, the static `axes: ['opsz','wdth']` guard, which is green because that bug was already found and fixed. Any other number means a rule got softened; stop and say so.

The `static` keyword is load-bearing and the reason this commit is separate from the one that uses the tokens. Tailwind v4 tree-shakes `@theme` variables that nothing references, and because `font-stretch` inherits, an undefined token resolves to `inherit` and renders as though it worked. Land the tokens, then confirm they survive a production build before anything depends on them.

**C1 — Width bands.** The largest commit and the only one with broad visual consequence. Replace every `font-stretch` and every FVS `wdth` on the shipped pages with one of the three tokens, per the table in §5: the hero clause split retires (100/88 → 88/88), `h2` 96 → 94, `.text-cover` 90 → 94, `.text-statement` 96 → 88, `text-hero` 97 → 88, `.bento-theme__lead` 92 → 100, `.wordmark` 88 → 100, `.hero-block__callout-label` 90 → 100, and `.thread-index` gets its own pinned 100 so it stops inheriting from whatever heading it sits in. Turns assertion 1 green.

Verify by screenshot diff on the Bard and FDT-E heroes, the home statement, and the wordmark in site chrome. The wordmark appears on every page, so it is the one regression here that would ship everywhere at once.

**C2 — The 14px floor.** Raise or delete the five rules currently shipping below it: `.mode-pair__label`, `.asymmetric-pair__label`, `.bento__label`, `.small-multiples__label` (all 11.2px) and `.compare__label` (12px). Deleting is usually right — a label that only worked at 11px was carrying a hierarchy the layout should carry instead. Turns assertion 2 green.

**C3 — The ladder.** Retune the rung 3 and rung 2 clamps to fix the 1.03 convergence at 560px, and retune rung 5 so its crossovers align with rung 4 at 430 and 1180 with endpoints unchanged at 40 and 72. Turns assertion 3 green. This is the one commit where the lint assertion is a genuinely better check than the eye: it computes the worst adjacent ratio across 320–2560 from the clamps directly.

**C4 — Weight.** Author `strong, b { font-weight: 600 }` in the base layer so it stops inheriting preflight's `bolder`; set `.milestone__date` to 600 at width 88 in the FVS string; and register the three signature placements (home hero, about opener, one moment per case study) in the allowlist with their one-line reasons. Turns assertions 4 and 5 green.

Two live decisions belong to this commit, not to C0. `text-lede` currently sits at weight 340 with a 60px ceiling — it clears the size gate but is not one of the three sanctioned placements, so it either gets named as one or gets re-weighted to 400. And the `font-[720]` in `app/page.tsx` is invisible to a `globals.css`-only parser; extend the scan to `app/**/*.tsx` here, since this is where the allowlist that would sanction it is written.

**C5 — Colour.** Remove every `color-mix(… currentColor …)` and every legacy `--color-text-*` alias in favour of the four `--text-*` tokens. Turns assertion 6 green.

**C6 — FVS cleanup.** Delete the redundant optical-size pins — `.hero-block__callout-label` and `.hero-block__callout-body` both reproduce what `auto` already does, and the body one additionally pins its descendants — keeping only the two sanctioned survivors (`.milestone__date`, `.text-qh-title`). Allowlist the two exception surfaces. Delete the "FVS LAST, do not reorder" comments; per R8 they encode a superstition, since FVS overrides per axis regardless of source order. Turns assertion 7 green.

**C7 — Font-load probe.** Add the client-side check that the variable font actually loaded. Turns **8b** green. (8a, the static `axes` guard, is already green — see C0.) Worth its own commit because it is the only assertion that can fail in production while passing in CI, and because every width decision in the system is invisible in the Arial-based fallback. This is app code, not lint code; the linter's job here is only to assert the probe exists.

**C8 — Adopt.** Wire `lint:type` into `npm run build`, and update `docs/typography-system.md` and the Typography section of `CLAUDE.md` in this same commit — the locked doc requires those two to move together with adoption, and until they do there are three documents on disk disagreeing about width.

---

## What to watch

**The fallback period is real.** R9 exists because the `next/font` fallback is Arial-based with no `wdth` and no `opsz`, so during swap every width distinction in C1 collapses to nothing. Check the heroes with the font blocked in DevTools before shipping C1, not after.

**C1 is the only revert-worthy commit.** Everything else is mechanical or additive. Keep it isolated so a revert doesn't drag the floor fixes or the ladder retune back with it.

**Order within C1 doesn't matter; order between C1 and C3 does.** Retuning clamps under old widths, or vice versa, means judging two changes through each other. Land the widths, look at it, then move the ladder.

**`.impeccable` / `npm run typeset` already exists.** There is a separate external typography check in this repo. `lint:type` is not a replacement for it and should not try to absorb it. Check for overlapping assertions before adding rules, and if the two disagree on a value, v3 wins and `typeset`'s config gets updated.

---

## Superseded documents

Until C8 lands, three documents on disk disagree with this one. All three are stale on typography and must not be followed:

- **`docs/typography-system.md`** ("Locked May 2026"). §4 and §11 lock `font-stretch: 96%` / `97%` and explicitly *reject* 92–94% as "squeezed," a finding re-affirmed twice in the May 2026 tuning and amplification passes. v3 supersedes this: display is 94 and large display is 88. §7's "FVS as the LAST declaration" rule is retired by R8. The `font-stretch: 80%` example in §7 is below the v3 minimum. §11's suggestion to add a dedicated `text-wordmark` utility for *more* compression runs opposite to v3, which moves the wordmark to 100.
- **`CLAUDE.md`, Typography section.** Points at `docs/typography-system.md` as "the source of truth for typography" (three times) — that pointer is now wrong. Also records work titles at `font-stretch: 90%`, which is not one of the three v3 bands.
- **`docs/color-system.md`** is *not* superseded. Colour is locked and contrast-verified; the only colour work in this plan is C5, which removes two known anti-patterns the colour doc already bans.

---

## Out of scope

§9 of the locked doc lists what remains unspecified: the about page (`.about-phase h2` at 36.4px sits between rungs 3 and 4, `.about-row__company` at 25.2px/500 is off-ladder), nav, footer, buttons, card meta, and every type state — hover, focus, visited, disabled, `forced-colors`, `prefers-contrast`, 200% zoom, print. Dark mode has no stated position on optical weight gain against a dark ground.

None of it blocks this migration. All of it blocks calling the system complete.
