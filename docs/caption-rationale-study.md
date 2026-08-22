---
name: caption-rationale-study
description: Feasibility and authenticity study for converting Template A image captions from feature-description to design-rationale (Paul's POV). Measured against the 50 shipped captions, the per-slot character budget, the caption governance rules, and the git history of two prior caption passes. Read before any caption rewrite on BARD, FDT-E or Nuuly.
sources: [cowork]
aliases: [caption-study, caption-pov, rationale-captions]
---

# Can the captions carry the POV?

Study, 22 Aug 2026. Question asked: the three shipped Template A studies show the work but do not say why Paul made the calls. Can the image captions carry that, using only material already authored, staying short and skimmable?

**Verdict: yes, and it is the cheapest POV move available — but it is a revert plus a cut, not a rewrite.** Roughly a third of the target copy already exists in Paul's own words in git history, was shipped, and was removed by two passes that optimised for something else. The layout has room on the wide tiles and none on the narrow ones. The set gets shorter, not longer.

---

## 1. What is actually on the page

50 captions across the three studies, 531 words. Every one is `bold lead + muted tail`.

| Study | Captions | Construction |
| --- | --- | --- |
| BARD | 21 (14 bento tiles, 5 bands, 2 FramedPair) | 12 leads are a deverbal noun that restates the tail |
| FDT-E | 13 (8 gate-walk, 3 bands, 2 FramedPair) | 8 leads are Title Case; 3 tails are headless verbs |
| Nuuly | 20 | strongest of the three; 2 defects |

Three measurable defects, none of them opinion:

**Label restates gloss.** *"Compliance tracking. Automatically checks reports against federal standards."* The lead is the tail with the verb turned into a noun. It costs two words and buys nothing. 27 of 50 captions do this. The Aug 4 panel review already found it and named the rule that fixes it — *the label asserts and the gloss proves* — and filed it as Tier 3. It was never actioned.

**Headless verbs.** 12 tails start with a verb whose subject has been deleted: *"Built an engine that…"*, *"Walked every jurisdiction…"*, *"Mapped, built, and tested…"*, *"Made sure the model could…"*. This is first person with the "I" removed. It reads as neither register: not evidence, not voice, just a résumé bullet with the pronoun shaved off. All 12 are in BARD's reflection bands and FDT-E's foundation bands — the two places the studies most want to sound senior.

**Title Case in FDT-E.** *"Trusted Board." "Confidence Level." "Analyst Decision."* Ruling D12 put the whole site on sentence case and BARD's round 2 applied it. FDT-E never got the pass. Title Case reads feature-brochure, which is exactly the register the rationale move is trying to leave.

---

## 2. The finding that changes the plan

The captions Paul wants already shipped once. Two commits removed them.

**`dbc8b9e`, 30 Jul — "copy(fdte): plainer register head to bottom"**

| Was | Is now |
| --- | --- |
| The analyst makes the call. / The gate informs the decision. It never makes it. | Analyst Decision. / The analyst makes the final call. |
| It says how sure it is. / A possible command node, flagged at 80% confidence. | Confidence Level. / Metadata and reasoning for the anomaly. |
| Checked against command doctrine. / All-source correlation, linked to CJADC2. | Doctrine Check. / All-source correlation for a clear picture. |
| The board they already trust. / Operation Avalanche: 187 records, nothing flagged. | Trusted Board. / Near real-time view of enemy units. |
| No verdict handed down. / JIC, DIA, and NIFC talk it through. | Collaborative Review. / Experts discuss the case in chat. |
| Honest zero. | MASINT Zero. |

Every line in the left column carries a design position. Every line in the right column names a UI feature. The commit's stated goal was a plainer register and a four-line skim layer; only one of these changes was measurement-driven (MASINT's tail went 92 → 60 characters to stop a compact tile breaking its row on mobile). The other seven were register, and the register pass took the argument with it.

**`7a4d9cb`, 19 Aug — "Nuuly: land the answers in the headings, and cut what the glosses already say"**

| Was | Is now |
| --- | --- |
| Six apps. One place. / The label changes. The corner never does. | The same corner. / Six screens, five apps, one position. |
| The answer, from across the station. / One code, one bin. Everything else goes quiet. | Wash bin assigned. / The row dims, the code fills the screen. |
| Paused, not lost. / Seventy-one of a hundred units in. The next person picks it up where it stands. | Pause the order. / It stays open at the count it reached. |
| A hem down a quarter inch. / Measured before and after, on every new style, to learn how many wears it has. | Wear measurement. / Five points, before and after a wash. |

This one had a stated reason and it was a good one: Nuuly's captions were running two-sentence tails and 4-word leads, and *"measured across the shipped manifests, BARD and FDT-E run leads of 2-3 words and tails of 5-10, one sentence."* Nuuly was brought into the house grammar.

**But the house grammar was measured off BARD and FDT-E — the two studies whose captions the Aug 4 panel review had already condemned two weeks earlier.** The strongest set on the site was normalised down to match the weakest. The council that reviewed the trim said so at the time: *"keep Nuuly's leads. They carry an argument where BARD's name a feature, and that is the better instinct, not a deviation to correct."* The length fix was correct. The argument loss was collateral.

So the direction Paul is proposing is not new territory. It is restoring a position the site already held and lost twice for reasons that do not survive re-reading.

---

## 3. Is it authentic? Where the "why" comes from

Paul's constraint — no new content, tweak what is already authored — is the right one, and there is more authored material than the page uses. Three sources, in order of safety:

**Tier 1 — git history.** The 10 captions above are Paul's own, already on-budget, already third person, already through a prose gate. Free.

**Tier 2 — inline MDX comments and project change logs.** Reasoning that was written down and never published. Examples, verbatim:

- BARD column picker: *"State Case Number: the federal schema kept each state's own identifier as a first-class field instead of overwriting it with a federal ID. First thing the states asked for, last thing I was willing to trade away."* This currently appears nowhere on the site — it was written for the PopUp layer, which was killed on 31 July with nothing replacing it. It is the single best orphan in the knowledge base.
- Nuuly corner: *"For an operator on their four hundredth garment the button's job is not to explain itself. It is to be where the hand already is."* And the rejected alternative: *"Mirroring the home for left- and right-handed operators was considered and rejected: stations are shared across shifts."*
- Nuuly bins: *"The hue was never an encoding the interface invented. It was a pointer to an object"* — the physical bins are painted, and the operator matches the screen to a bin across the room.
- Nuuly Measure: *"No pass/fail treatment: there is no shrinkage tolerance anywhere in the 143 frames, and inventing one would be inventing data. The app reports the difference; it does not judge it."*

**Tier 3 — the prose directly above the image.** Usable only by *moving*, never by copying. There is precedent and a warning: the Nuuly §5 review found *"the prose says 'so the team can tell how many wears it has left' and the caption twelve inches below says the same thing. This is most of why the section reads long"* — and the fix was to cut the prose and let the caption carry it. Same trade is available elsewhere. It shortens the page.

Coverage across ~52 image slots: **31 have a quotable, image-specific "why" available today. 9 more are workable. 12 have nothing** — and 10 of those 12 are already on a documented delete list or are the unreadable process shots (BARD's Figma canvas at ~3px, the Excel field inventory at ~6.5px, FDT-E's search artboards at ~5px). **The rationale gaps and the cut list are nearly the same list.** That is the plan writing itself: cut, then rewrite the survivors.

### The authenticity failure modes, named

1. **Uniform construction is the AI tell, not the length.** Replacing 50 identical `noun-label. feature-restatement.` captions with 50 identical `decision. because.` captions fails the same test the panel already applied. The set has to vary its move.
2. **Abstract insight is the trap Paul has already caught himself in.** He killed a Nuuly closer for being *"cheesy and not like me"*, diagnosing it as *"borrows math register for a design decision; sounds insightful without being concrete."* A rationale caption must land on the mechanism — *"a hand thrown at the bezel cannot overshoot"* — never on the lesson.
3. **Nuuly provenance.** Most of Nuuly's per-screen reasoning lives in 2026 recreation change logs, not 2019 testimony. Paul's ruling: *"these are faithful recreations… the change log is not a source for what changed when."* Safe subset is his own rulings and the interview notes. Do not let a 2026 rebuild decision get attributed to 2019 Paul.
4. **Three things must not be rationalised.** The dim/bright pair — *"keep the uncertainty; do not resolve it into a tidy lesson"* — a caption that makes bright mode read as a win breaks the study's best beat. The Test Wash taxonomy stays above the fibre mapping. And a rationale caption on an unreadable image is a broken promise at any width.

---

## 4. Is it feasible? The layout has an opinion

Caption box is 18px at `max-width: 64ch` (747px measured). Simulated against the shipped Commissioner subset, calibrated to the repo's own `ch-inventory` measurement, and validated against the one line count the FDT-E commit recorded independently (MASINT, 5 lines in a compact tile — the model agrees).

**Characters that keep a caption at N rendered lines:**

| Slot | 1 line desktop | 2 lines desktop | 1 line @390 | 2 lines @390 | 3 lines @390 |
| --- | --- | --- | --- | --- | --- |
| band / feature (full width) | ≤90 | ≤180 | ≤39 | ≤81 | ≤124 |
| wide / standard (2-up) | ≤60 | ≤124 | ≤39 | ≤81 | ≤124 |
| tall / compact (3-up) | ≤39 | ≤81 | ≤17 | ≤34 | ≤52 |

Current median caption is 68 characters. So:

- **Bands and feature tiles have real room.** Up to ~80 characters holds 1 line on desktop and 2 on mobile. Most bands are already there; BARD's dual-view (99ch) and FDT-E's three foundation bands (104–123ch) are the ones already over.
- **Wide and standard tiles are tight but workable.** 60 characters is the desktop one-line ceiling. A tradeoff clause fits; a tradeoff clause plus an example does not.
- **Tall and compact tiles cannot carry rationale.** 39 characters desktop, 17 per line on a phone. This is where BARD's nine grid tiles and FDT-E's three discipline cards live. Any decision statement here will wrap to five or six lines on a phone.

Two hard mechanical constraints on top of the budget:

**The subgrid baseline lock.** In portrait and square rows, all captions in a row share one grid track. One three-line caption sets the height for every tile beside it. Captions in a shared row have to be within a line of each other, so they get rewritten as a set, never individually.

**Compact tiles have a measured dead band.** Paul's own note from the FDT-E commit: compact tails sit in a 46–63 character window at 390px; below it they lose a line, above it they gain one. That window is the reason MASINT was cut to 60. It is not negotiable by rewriting harder.

**Feasibility summary:** the wide surfaces can carry the POV. The narrow ones cannot, and the narrow ones are mostly the tiles already recommended for deletion. This is a convergence, not a coincidence — a tile too small to explain itself is usually a tile that was not earning its slot.

---

## 5. The grammar, if this goes ahead

Six rules. Five are existing governance, restated; one is new.

1. **Third person. No "I".** POV is not first person. *"MASINT Zero. No hits, which is evidence"* and *"The gate informs the decision. It never makes it"* are pure Paul with no pronoun in sight. The register guardrail — *"never the captions"* for the first-person voice — stays intact and is not being overturned. What changes is the predicate, not the person.
2. **Sentence-case lead that carries the claim.** Never a deverbal noun. `Compliance tracking.` → `Scored as filed, not audited later.`
3. **One-sentence tail, 6–15 words.** House rule, unchanged.
4. **Digits, not spelled numbers. No em-dash. No banned words** (`craft`, `seamless`, `surface` as a verb, `consumer-grade`).
5. **Stay inside the per-slot budget above,** and rewrite shared rows as sets.
6. **New: vary the move.** No more than about 40% of a study's captions using the same one. Five moves available:

| Move | Shape | Example |
| --- | --- | --- |
| The tradeoff | what was given up | States keep their own case number. Never overwritten by a federal ID. |
| The rejected alternative | what it deliberately is not | One form, two views. The data got standardized so the process did not have to. |
| The constraint | the physical fact that forced it | The corner never moves. By garment 400, the hand stops looking. |
| The honest limit | what it does not do | Honest zero. No hits from measurement intel, and that is evidence. |
| Plain evidence | keep roughly a quarter descriptive | One garment read, five still unread. |

That last row is load-bearing. A set where every caption argues is as detectable as a set where none does.

---

## 6. Worked examples

Illustrative only — Paul writes the final copy. Each is sourced from existing material and sized against the budget.

**BARD**

| | Now | Proposed | Δ |
| --- | --- | --- | --- |
| form-structure (band) | Dual-view capability. Investigators enter local details; the Coast Guard's view is one toggle away. *(99ch, 3L mobile)* | One form, two views. The data got standardized so the process did not have to. *(78ch, 2L)* | −21 |
| form-map (band) | Conditional logic. Inputs like tidal data appear only when relevant. *(68ch)* | Fields earn their place. Tidal data appears only when the water demands it. *(74ch)* | +6 |
| column picker (tall) | Tailored metadata. Users see the case info that matters most to them. *(68ch)* | States keep their own case number. Never overwritten by a federal ID. *(68ch)* | 0 |
| compliance (tall) | Compliance tracking. Automatically checks reports against federal standards. *(76ch)* | Scored as filed, not audited later. 94% against 33 CFR thresholds. *(66ch)* | −10 |

**FDT-E** — mostly a `git revert` of the register pass, with sentence case applied:

| | Now | Proposed (Paul's own, pre-30 Jul) | Δ |
| --- | --- | --- | --- |
| elevate (standard) | Analyst Decision. The analyst makes the final call. *(52ch)* | The analyst makes the call. The gate never does. *(47ch)* | −5 |
| anomaly (feature) | Confidence Level. Metadata and reasoning for the anomaly. *(57ch)* | It says how sure it is. A possible command node, flagged at 80% confidence. *(74ch)* | +17 |
| verification (band) | Doctrine Check. All-source correlation for a clear picture. *(59ch)* | Checked against command doctrine. All-source correlation, linked to CJADC2. *(75ch)* | +16 |
| MASINT (compact) | MASINT Zero. Measurement and signature intel. No hits, which is evidence. *(73ch, 5L mobile)* | Honest zero. No hits from measurement intel, and that is evidence. *(66ch, 4L)* | −7 |

**Nuuly**

| | Now | Proposed | Δ |
| --- | --- | --- | --- |
| corner-consistency (band) | The same corner. Six screens, five apps, one position. *(54ch)* | The corner never moves. By garment 400, the hand stops looking. *(63ch)* | +9 |
| bin-answer (band) | Wash bin assigned. The row dims, the code fills the screen. *(58ch)* | Everything else goes quiet. One code, readable across the station. *(66ch)* | +8 |
| measure-table (band) | Wear measurement. Five points, before and after a wash. *(56ch)* | It reports the difference. It does not judge it. *(48ch)* | −8 |

**Leave alone.** The seven AppsBento captions (*It arrives. / It comes back. / It gets judged.*) are a working device — the garment's journey told in seven beats. Rationalising them destroys it. Both dim/bright pairs stay descriptive; the section's whole move is that the work did not matter, and a caption arguing for the design contradicts the prose above it. BARD's two FramedPair captions are already the best in that study (*"No case rose to the top. Every case is just another row"*) and need nothing.

---

## 7. Cost, and what to do first

Net word count across all three studies: **−80 to −120 words.** The rewrite is a predicate swap, not an addition, and the cut list removes more than the rewrites add.

| | Captions | Cut | Rewrite | Leave |
| --- | --- | --- | --- | --- |
| FDT-E | 13 | 3 (foundation bands: unreadable images, no rationale material, headless verbs) | 8 | 2 |
| Nuuly | 20 | 0 | 5 | 15 |
| BARD | 21 | 5–7 (the panel's zero-information-loss list) | 8 | 6 |

**Sequence:**

1. **FDT-E first.** It is a revert. The copy exists at `dbc8b9e^`, it is Paul's, it is on-budget, and applying sentence case to the eight Title Case leads closes a D12 gap that has been open since 30 July. Half a day.
2. **BARD's cuts before BARD's captions.** The page runs 17 consecutively captioned figures across 38% of its length; the panel's recommendation was 6–8. Cutting first removes most of the tiles that have no rationale to give, and shrinks the rewrite job to eight. Rewriting all 21 first would be work thrown away.
3. **Nuuly last and lightest.** Five bands, restoring the argument the Aug 19 trim removed while keeping the one-sentence tail that trim was actually enforcing.
4. **Do not touch the three unreadable BARD reflection bands as a caption job.** They have the strongest rationale material in the study and images nobody can read. That is a crop problem. A better caption on a 3px screenshot makes the mismatch worse, not better.

**One governance note.** Nothing here needs overturning. `07-content-strategy.md` §5.4 already requires *"caption text on each screen that names a specific design decision and what it accomplishes"* — the shipped captions are the deviation, not the proposal. The assert/prove rule is already filed as Tier 3 work. The first-person guardrail stays exactly as written. What this study adds is the per-slot budget, the five-move variation rule, and the finding that a third of the target copy is sitting in git.
