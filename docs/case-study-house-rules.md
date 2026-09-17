# Template A house rules, learned the hard way

Measured from the shipped studies. Each rule is a number off a real file or a
mistake that got caught. **Read this before starting Dagr.**

Study-specific decisions live in the per-study docs. This is only what transfers.

**Precedence: when this doc and the `case-study` skill disagree, this doc wins.**
It is measured later and against more studies.

**THIS IS A MIRROR.** The editable copy is
`claude/case-study-house-rules-learned.md` in project knowledge. This file exists
because Claude Code cannot read project knowledge: four consecutive build briefs
listed the canonical as required reading that no agent could open, so every
house-rules judgment in the 25 Aug RoadmapTable review was reconstruction rather
than reading. **Exported 1 Sep 2026.** Edits made here are lost on the next
export. Edit the canonical, then re-export.

---

## 1. Section length and count

Body words per section — **section lede plus body prose, excluding headings and
pull quotes.** That convention was never written down until 25 Aug, which is why
Delivery Promise section 01 read as 201 words against a ~150 ceiling under a
literal count and 138 under this one. The BARD and FDT-E figures below were built
the same way.

| | |
| --- | --- |
| **BARD** | 146, 94, 49, 59, 31, 73, 23, 34 — 509 total, 8 sections |
| **FDT-E** | 109, 149, 107, 29, 46, 23, 55 — 518 total, 7 sections |
| **Nuuly** | 81, 148, 50, 20, 102, 136, 83, 55, 47 — 722 total, 9 sections |
| **Delivery Promise** | 134, 139, 82, 61, 85, 66, 58, 75 — 700 total, 8 sections |

**Nothing shipped exceeds ~150 words in a section.** Nuuly's heaviest is 148.

**The section ceiling is nine, not seven.** The earlier figure was measured on
BARD and FDT-E only. Very short sections are legitimate.

**Re-count after every content edit.** A count taken before an edit is not a
count. Delivery Promise section 01 was briefed at "74 quoted words, 180 total"
after its second quote had already been replaced with a longer one; the real
figures were 92 and 198, and the "230 before" it was compared against had never
been measured at all. Actual was 201, so the reduction was 201 to 198 — nil.

**A section carrying two real quotes cannot reach BARD or FDT-E length.** Those
are short because `FramedPair` does the work and images cost zero words. Stop
comparing word counts across sections whose figures differ in kind.

## 2. The bold rule

> **The problem section uses bold-lead per paragraph as a structural device.
> Everywhere else, roughly one bold per section, placed wherever the claim
> actually falls.**

BARD ships three bolds, all in the problem section. FDT-E ships four, roughly one
per section, and they move position.

**A bold must START its paragraph.** The skim layer works because the eye runs
down the left edge; a bold beginning 60 characters in is invisible to that scan.
A Delivery Promise pass moved a bold to a paragraph's second sentence to kill a
repetition, and produced the longest skim line in the study while removing it
from the scan. **When a bold repeats something nearby, cut the sentence, do not
move the bold.**

**A bold must not restate its own heading.** Delivery Promise shipped two that
did — §03's "Miss the date and you lose trust" under "We were losing trust where
we charged the most", and §06's "PMs and dev leads across several teams…" under
"Strategic UX is how several teams got one roadmap". Both spent the section's
only skim unit saying what the reader had just read. Extract the headings and
bolds as a flat list and read them alone; a section that says one thing twice is
visible immediately and invisible any other way.

**An all-bold paragraph renders as a bulleted list with the bullets deleted.**

Vary paragraph lengths. BARD's problem section runs 17 / 11 / 17 words.

## 3. Headings name a person and a failure

Both shipped problem headings name **who** and **what goes wrong**. Length is not
the constraint. A heading that states a mechanism with nobody in it fails even
when the sentence is good.

**Research sections name the finding, not the method.** "I did research" never
appears in an H2.

**Define-by-negation is Paul's signature and it needs a budget.** One per study,
and both shipped heroes place it in the hero title rather than an H2.

**Naming a discipline in a heading is an override, not a default.** Of 24 shipped
h2s across four studies, exactly one has an abstraction as its grammatical
subject: Delivery Promise's "Strategic UX is how several teams got one roadmap."
Paul kept it deliberately, because that study is the strategy-heavy one and the
term is legible to a recruiter. Every other heading is a claim about the work, the
system or a person. Deviate only on purpose, and record the reason.

## 4. Character budgets — CALIBRATED FOR COMMISSIONER

`ch` is the advance of the "0" glyph *in the font that renders*. Measured at 1440:

| Slot | Bricolage (stale) | **Commissioner** |
| --- | --- | --- |
| **case-study h2 — the one that governs** (`.cs-section h2`, `max-width: 30ch`) | 42 | **44.9** |
| `.case-study-prose h2` alone (`max-width: 22ch`) | 31 | 32.9 |
| `.case-study-prose p` | 88 | **94.0** |

**Read the first row when sizing a case-study heading.** This table used to lead
with the 22ch row, and the label `.case-study-prose h2` reads like "the case
study's h2" — so an author budgeting a heading would take **32.9** when the real
line is **44.9**, roughly 30 percent short.

The mechanism, verified in `globals.css` on 1 Sep 2026: `.case-study-prose h2` is
`max-width: 22ch` (line 1624), and `.cs-section h2` overrides it to `30ch` (line
1838) under a comment that says exactly that — *"Heading uses a wider measure in
the band than the default 22ch."* **Every heading in every shipped study sits
inside a `<section className="cs-section">`, so every one gets 30ch.** The 22ch
row is real CSS describing a case that does not occur in a case study; it is kept
only so nobody re-derives it.

Two-line heading threshold moves from 62 characters to about **66** — against the
44.9 line, not the 32.9 one.

**The hero plain anchor budget is stated in rendered lines, not characters, and
the old "~160 characters" figure is contradicted by every shipped page.**
Measured at 1440: BARD 170 chars / 4 lines, Nuuly 172 / 4, Delivery Promise
179 / 4, FDT-E 231 / 5. The real band is **170 to 231 characters, four to five
rendered lines** — and the character count predicts nothing on its own, because
Delivery Promise at 179 costs the same four lines as BARD at 170. **A
"deliberate overspend" that costs no lines is not an overspend.**

**Frontmatter `title:` has no budget and needs one.** It is the page's
H1-equivalent, and since 1 Sep it also feeds the browser tab and the unfurl title
through the `%s · Paul Kali` template. Measured from the built HTML: **BARD 101
characters, 113 with the suffix** — more than double Nuuly's 38/50, and far past
every client's truncation band. Delivery Promise sits exactly on the 70-character
ceiling; FDT-E is 53/65. **BARD's is a live content defect, unfixed**, and it is
Paul's copy to rule on rather than a string to trim for a metadata budget.

## 5. Figures — measured conventions

| | |
| --- | --- |
| viewBox | 2750x1536 (16:9); one Oku figure is 2446x1728 |
| paths | 1-4 per figure |
| fill | `currentColor`, `fill-rule="evenodd"` |
| stroke attribute | **none** — linework converted to filled outlines |
| `<text>` | **zero, in all five shipped figures** |

**No DRAWN figure contains type.** Numbers and labels go in the caption, never in
the art. The subject of this rule is the SVG: this whole section is about
viewBox, paths, fill and stroke. It does **not** bar a text-bearing `<figure>`
element — `FramedPair` is a `<figure>` whose captions are prose, and so is
`TestimonyPair`.

*Wording corrected 26 Aug 2026.* The old line read "No figure contains type,"
which is unambiguous in context and misleading when quoted alone. It was quoted
alone twice in one session and read as barring a module it does not govern. The
ruling it produced still stands: an illustration with a quote set inside it is
barred, because an illustration is a drawn figure.

**Friction-beat figures render at a 300px cap**, 169px tall. Anything finer than
~40px disappears. A figure-less beat uses the additive rule
`.friction-beat:not(:has(figure)) { grid-template-columns: minmax(0,1fr) }`
beside the existing one, never replacing it.

**Index cover art is a different asset class.** 600x600 line art,
`public/case-studies/covers/<name>.{webp,png}`, 185x185 in the card, theme-flipped
by `.cover-art`. Both halves of the pair required — see rule 13.

**A crop's horizontal edges land on a structural boundary, never through type.**
Top and bottom go to the nearest rule, container border, or clear band of
background. If the height budget does not reach the next boundary, **the crop
takes less, not more** — and taking more requires the original source, which
lives outside the repo. A crop cannot be extended from the cropped file.

**A luminance threshold is a hypothesis about the pixels, not a measurement of
them.** Three separate crop calls on Delivery Promise were settled only by
rendering the edge at 7-14x and looking: a threshold put one boundary eight pixels
off, and on `browse--page` two thresholds disagreed about whether a band was clear
at all — `<235` read clear, `<252` read the heading's own cap tops. **Render the
edge and look.**

## 6. Data visualisation

**Only geometry and numerals stay in the SVG. Every word goes in HTML.**

A 13px label inside a 1000-unit viewBox scaled into a 342px container renders at
**4.4px**, which is absent rather than small. Scaling cannot rescue it: "POST
PURCHASE" at a legible 32 viewBox units is ~250 units wide, and five stage labels
need 1,250 in a 1,000-unit box.

**`lint:type`'s 14px floor cannot see this.** It reads CSS declarations; SVG text
authored as presentation attributes never enters the stylesheet.

**Pin strokes with `vector-effect: non-scaling-stroke`.** `stroke-width: 2` user
units renders at 0.68px at 390px.

**The site is monochrome and accent-free at rest**, so the `dataviz` skill's
colour procedure is inert. Encode by position, length and order only.

**A structural line in a chart is a graphic and owes 3:1 contrast.** Delivery
Promise shipped three below it — a chart axis at 1.47, sentiment gridlines at
1.25, and a stage rule at 1.39 that its own CSS called the only thing marking a
stage boundary at every width. **`lint:color` cannot see any of them:** check 4
iterates TEXTS × SURFACES only, and the whole border ramp tops out at 2.03, so
**no border token can carry a 3:1 graphic.** Anything that must be seen reaches
for a text token — `--text-subtle` at 3.87/4.22 is the working floor.

**The best form may not be a drawing.** Seven forms were prototyped for Delivery
Promise section 05 — a convergence fan, a load-bearing stack, a matrix, a
sequenced matrix, an unlock staircase, small multiples, an anatomy-of-a-sentence
and a consequence table. **The one that shipped is a three-column table with no
geometry at all**, and it shipped partly because every form with geometry broke at
one width or another. A relation-plus-order is not in the standard chart
vocabulary; do not force it into one.

**A caption that counts must match what the drawing shows.** Delivery Promise's
journey caption said "She recovers three times"; computed from the manifest's own
point arrays it was **two**. That is a figure whose entire argument is that an
average hid the real shape, miscounting the shape a reader can count off it.

## 7. Captions are the largest hidden writing job

BARD's three bentos carry 24 tiles with lead-plus-gloss captions. That is more
words than several prose sections combined, and captions are where AI voice is
easiest to detect.

Bento captions sit **above** their image; `FramedPair` captions sit **below**.

**The caption contract is `<strong>Lead.</strong> Gloss.`, per side, with no
outer `figcaption`** (`uscg-bard.mdx:50-76`). `TestimonyPair` inverts only the
ORDER, putting the lead above the quote, and the reason is worth keeping: an
image is legible at a glance and a 45-word quote is not, so the takeaway has to
be catchable before the reader commits. Two leads level at the top read as a
pair; two leads under content of unequal length do not.

**A caption must not restate the bold above it.** Delivery Promise's §05 figure
caption repeated "before she commits" from the bold seven lines up, in the same
words, adding nothing. A caption's job is to describe what is in the frame, which
is the one thing the bold cannot do.

**A citation names exactly the facts the artifact supports — no more, no less.**
The variation across the site is the discipline, not a lapse. Four shapes, each
determined by which facts exist: *channel only* where both channels are known and
the contrast between them is the argument (TestimonyPair's "Research session" /
"App Store review, July 2019", whose `$sourceDoc` forbids merging them into one
generic customer label); *brand only* where the channel is not knowable (a deck
speech bubble labelled "-AN Customer"); *brand + method*; *role + channel* where
the role is load-bearing and the employer is the client. **Normalising them would
require inventing a fact or discarding one.** This has been raised as an
inconsistency twice; it is not one.

## 8. Module repetition

The beats may repeat. **The modules must not** — but justify a repeat on **axis**,
not on art.

| Study | Three beats of |
| --- | --- |
| BARD | three defects in a system |
| FDT-E | three states of a person's mind |
| Nuuly | three constraints of a room |
| Delivery Promise | three breaks inside one order |

**A pattern is not lazy by virtue of being a pattern.** Paul's ruling, 23 Aug:
use the shape the story wants.

**The callout is a house construction, 3 for 3:** "[general case]. This one
[does X]." In every instance the second clause holds a surprise — **and it
reverses a role**, not merely a subject. BARD passive to active, FDT-E answer to
work, Nuuly record to instruction. A Delivery Promise callout that changed the
subject (speed to date) without reversing a role read as weaker before anyone
could say why, and was retired.

**Count the modules before claiming a variety problem.** A Delivery Promise brief
asserted "three line-based drawings and a table" and was wrong: two SVGs, one
image grid, one table. `PromiseSequence` carries no linework. The claim was made
in a brief that twice tells the reader to measure rather than assert.

**Two modules can share a shape and still be distinct, if the axis differs.**
`RoadmapTable` and `TestimonyPair` are both text in ruled cells. `RoadmapTable`
is ordered, read down, numbered, and ends in a coda; `TestimonyPair` is a
comparison, read across, two peers, no numerals, no coda. **Adding a third cell
or a numeral collapses one into the other**, which is why a source-ledger form
for the quotes was rejected during design.

## 9. Build gates

- `lint:type`, `lint:space`, `lint:color` — any time
- `next build` -> then `lint:interaction` and `lint:prose`
- `npm test` (vitest) — 9 files, 156 assertions as of 1 Sep

**`lint:prose` joined `npm run build` on 1 Sep 2026** (`9fd0eee`), after
`next build` because it scans rendered `.next` HTML. Before that it was the only
gate that could see manifest copy and the only one nobody had to run — **6,213
characters of rendered and aria copy for one study live in `*-manifest.json`
files, and no lint script opens a `.json`.** It was negative-tested before being
wired in, which is the only reason it can be claimed to work.

Traps:

- **`lint:space` check 4 forbids spacing inside a media query.** `SPACING_PROP`
  is anchored over `margin|padding|gap|row-gap|column-gap`. A shorthand `gap`
  that changes inside a breakpoint fails; **splitting it into `row-gap` and
  `column-gap` declared once outside the query passes and is the better fix.**
  Watch for the same value declared twice — once outside and once inside — which
  is a failure even though nothing changes.
- **`lint:prose` hard-fails on em-dash U+2014** but scans **rendered `.next`
  HTML**, so source comments and manifest `$doc` keys cannot reach it. It also
  **exits 1 only on ZERO HTML files**, so a stale `.next` scans clean and prints
  PASS. Both a staleness guard and a durable fixture-based negative test are owed.
- **`lint:color`'s `EXTS` is `.css .ts .tsx .mdx .mjs .js .jsx .svg`.** `.html`
  and `.md` are exempt, so previews and briefs are structurally outside it. It
  does scan **untracked** files with those extensions.
- **`lint:type` parses `app/globals.css` only.** It cannot see a utility applied
  in JSX, and it accepts any value that clears 14px whether or not it is on the
  scale. Check 3 walks only `ladder: true` rungs, so a size that is on no rung —
  17px, say — is invisible to it entirely. `.promise-walk__label` is one such
  selector and nothing measures it.
- `SKIP_DIRS` matches directory **names**, not paths.
- **`next build` cannot run through the Cowork device bridge** — linux/arm64, no
  SWC binary. Builds happen on Paul's machine.
- **Commissioner has no `wdth` and no `opsz`,** and **no italic** — the italic
  lives in a separate binary that is not shipped, which is why `globals.css`
  remaps `em, i` to `font-style: normal; font-weight: 600`. A ported `<i>`
  therefore renders **bold**, not italic. `FLAR` is capped at 52px by the C5
  ruling and is unavailable at body sizes.
- **`--spacing-3xs` exists at 0.25rem.** A pass on Delivery Promise assumed
  `--spacing-2xs` (0.5rem) was the floor and it is not.
- **`--text-subtle` is AA-large only (>=24px) for TEXT**, measured 3.87 light /
  4.22 dark. Below 24px use `--text-muted`. It is nonetheless the right token for
  a **graphic** that must clear 3:1, because no border token can.
- **"Zero hardcoded type values" means no literal WHERE A TOKEN EXISTS.** The
  repo has no utility at 18px or 15px, and `InversionChart` carries raw values in
  its manifest for the same reason. Settled 25 Aug: the criterion was worded too
  broadly, not the practice.
- **The vitest suite does not run on Vercel.** The deploy runs the linters and
  `next build`. So `cover-art.test.mjs` and `testimony-leads.test.mjs` — the two
  guards written in response to real defects — protect the repo and not the
  deploy. Recorded in the systems backlog; unfixed.
- **Tailwind v4 preflight emits `ol,ul,menu{list-style:none}`**, so **every** list
  on the site loses its list role in WebKit, not only the classed ones. Fifteen
  lists exist; seven needed `role="list"` added on 1 Sep. Four are correctly
  exempt because they are `aria-hidden` — one only by inheritance from a parent,
  which is the one a future grep reads as a miss.

**Until 24 Aug no gate covered the index.** All six were green on a study whose
card rendered empty. `__tests__/cover-art.test.mjs` now covers the cover-art map;
nothing else about the index is checked, so **look at it after shipping a study.**

**Running a gate is not the check; saying the number out loud is.** A commit went
out on 1 Sep with a red snapshot (155/156) because the gate ran and its output was
not read. Caught on the next command and amended before anything was pushed.

## 10. Instrument faults — check the check first

Fifteen of twenty findings across four design-system migrations were faults in
the measuring instrument, not the thing measured.

**Turbopack serves cached stylesheets that survive a dev restart and
`rm -rf .next/cache`.** `rm -rf .next` is what actually clears it. Confirm by
diffing served CSS against source, not by trusting the browser.

**A screenshot at `deviceScaleFactor: 2` cannot see a sub-pixel stroke defect.**
A 2x capture is evidence about layout, position and blend, not fine detail.

**A green suite can be blind to the thing you just built.** `npm test` was 154/154
before and after the RoadmapTable build. No test references the module, its
manifest, or the MDX. Green meant "nothing else broke," not "this works."
**Say which of your green results could not have failed.**

**Advance width is a bad proxy for weight.** Commissioner at 340 versus 400
measures a 0.32% advance-width delta and would read as inert; ink coverage
measures **10.25%**, roughly thirty times more sensitive. A weight probe built on
advance width would report the same false negative the `wdth` probe did.

**Spec text is not measured behaviour.** A brief asserted ARIA's
Children-Presentational rule as determinative for `role="img"`; Chromium does not
collapse the subtree, and the measured tree came back unignored with three
children. The fix still stood — WebKit and several screen readers do collapse it —
but the severity was overstated by quoting a spec as a render.

**State the measurement basis rather than reconciling to one number.** The same
promise line measures a 15px cap height (6.7 CSS px at 1088) or a 22px full ink
run (9.8 CSS px). Both are right; neither is "the" number, and either clears a
14px floor argument.

The rules that follow:

- **A fixture must produce a positive, not merely fail to produce a negative.**
- **Enumerate what renders, not what the source says.**
- **Test your query against a known answer before you trust a zero.**
- **A gate you routed around is weaker evidence than one you satisfied.**
- **A code reading predicts; a render decides.**
- **A prototype is evidence only for the construction it actually used.** Check
  that it implements the spec the figure is being offered in support of. One
  quoted +80px and −43px against a measured +24px and **−5px**, because the
  prototype set a unitless line-height where the brief said to set it on the
  title's own.

And the one that keeps proving itself: **run the check against a version you know
is broken.** The cover-art test was validated that way, and the run was
informative twice over: reverting one key fired assertions 1 and 3 while 2 and 4
stayed correctly green. **A known-broken run tells you which assertions actually
see a given defect.** The `testimony-leads` test was validated the same way and
the demonstration paid for itself: at 76 characters against 66 the delta was
exactly 10, so the divergence assertion passed while the ceiling caught it —
which is the only proof that the two assertions are not one weak copy of the
other.

**A "not X" assertion goes stale the same way the thing it guards does.** State
what the code IS, never what it is not.

**A budget stated in characters is a proxy; rendered lines is the thing.** Where
a character count guards a layout property, say so in the test header, set the
number at the last measured-good value rather than a round one, and record the
value that was measured to break.

**The deletion test has a direction, and it is easy to aim wrong.** "What failed"
in the four hiring questions means *what did YOU try that failed* — the designer's
own failure, not a business one. A Delivery Promise review deleted the business-
failure heading, found the answer survived, and reported a defect. The heading was
never carrying that question.

**A skim extraction against the DOM is an upper bound, not what the eye gets.**
`RoadmapTable` renders "What it replaced" four times: one visible column header
and three per-row labels that are `sr-only` at desktop. Mark clipped lines in the
output. Scope the extractor `body > header`, because `HeroBlock` renders a
`<header>`. And in a two-column module the anchors do not share one left edge —
the second column's lead sits at the left edge of *its own* column, which is what
a comparison requires.

**A claim about blast radius is a measurement, not an inference.** How many things
a selector, a constant or a shared rule actually touches is countable. Count it,
or say the count is unknown. **A shared base class is not its most visible
consumer:** `.figure__image` reaches twelve components, not the one `<Figure>`
that names it. **And a house-pattern claim is a number** — five cross-study counts
were asserted from memory in one week and all five were wrong.

## 11. Documents go stale silently, so couple them to the code

`CLAUDE.md` has been the stale document twice. Both times the fix that worked was
**coupling the claim to the filesystem** rather than maintaining it by hand.
`__tests__/claude-md-typography.test.mjs` asserts every backticked custom property
resolves, and that the scale table matches the real `@utility` set in both
directions.

**What a test cannot check, and should not try: the reasoning.** A claim about
what the code IS gets asserted. A claim about why it is that way does not.

**A doc an agent cannot open is a doc that does not exist.** This file went
uncited-but-required through four briefs. `docs/case-study-house-rules.md` is the
mirror that fixed it. **Do not cite a project-doc path to Claude Code** — inline
the sentence that matters, or name the finding without the path.

**A source doc can keep repeating an error the code has already fixed.** The
Delivery Promise interview record said "four brands" in five places for a day
after the MDX had been corrected to three — the same bug that had reached the
shipped hero, still sitting in the document a future pass would read as truth.
**When a fact is corrected in code, grep the docs for it in the same pass.**

**A note that justifies a decision by a CONDITION goes false when the condition
changes, and nothing checks it.** `roadmap-manifest.json`'s `$captionDoc` argued
that a caption did not repeat §07 because they sat "two sections apart"; removing
a section deleted the distance and the note could not notice. **When a pass
removes a section, module or asset, the sweep is not only for references to it by
name or number — it is for notes whose reasoning assumed it was there.**

**Section numbers in comments rot in both directions.** Before the §07 removal,
two comments called the milestone section 07 and three called it 08; the removal
flipped which set was right. Sweep them in one pass against the post-change file,
pick one notation, and prefer citing a section by its content over its number.

## 12. Process rules that held up

**Paul rewrites every section in his own voice.** The model is editor and
structural sparring partner, never ghostwriter.

**Content before crops.** Tuning crops against prose that is still moving is
wasted work.

**Record rulings where the next pass will trip over them.** An inline MDX comment
stating the decision *and its reason* is what stops it being re-litigated.
**An accepted defect needs a note saying it was NOTICED and accepted** — a note
that reads as an oversight invites a fix. Three of Delivery Promise's six final
rulings were "leave it", and each got a note for exactly this reason.

**When a placeholder is bad, say so.**

**Build and review are two passes, never one commit.** A build and a review of
that build in the same commit means neither can be judged. The RoadmapTable review
found seven issues in work that had just passed nine green gates.

**A replacement line is new copy, and new copy gets read against its neighbours
before it ships, not after.** Two Delivery Promise fixes introduced their own
defect one line from where they landed: a caption that duplicated the departure
date it was meant to scope, and a milestone sub-line opening on "Built" directly
under the milestone word "Built". Both were caught at the render.

**A quotation gets transcribed from the artifact, or it does not ship.** A
Delivery Promise App Store quote was drafted from Paul's spoken description before
the slide was seen. One sentence came out verbatim by luck; the next rendered
*"They're still running me in circles about it."* as the fragment *"still running
me in circles."* Close is not right, and a reworded quotation is a fabrication
regardless of intent. Where a quote is ported between files, **decode it from
markup entities rather than retyping or pasting** — an entity is unambiguous
where a pasted apostrophe is not.

**A deletion is not local.** Cutting section 01's vacation paragraph silently
re-pointed section 04's *"the vacation that left without its clothes"* at a
different person. The sentence stayed true of someone, so nothing looked broken;
what degraded was invisible. **Grep the whole study for every noun a deleted
passage owned before cutting it**, and fix the collision at the callback rather
than by restoring the cut.

**Paul's eye beat every audit.** Delivery Promise shipped with a dark index card
through a seven-seat council review, a full build brief, a Claude Code build and
six green gates, and Paul saw it in about four seconds. **When the render
disagrees with the report, the render wins.**

## 13. A slug is a foreign key

The Delivery Promise index card shipped with no cover illustration. `COVER_ART` in
`components/case-study-card.tsx` is keyed by slug and still held
`'urbn-shipping'`; commit `0ee2dcc` had renamed it. The lookup missed, `art` came
back `undefined`, and the card fell through to a deliberate non-erroring branch,
so nothing complained. The assets were correct the whole time.

- **Renaming a slug means a repo-wide grep for the old value**, not a review of
  the files the rename touched.
- **A graceful-degradation branch hides a wiring bug.**
- **Look at the index after shipping a study**, in both modes.

**The guard: `__tests__/cover-art.test.mjs`, four assertions.** Every key is a
published slug; every value resolves to both halves of its pair; every published
study has a key; no two studies share art.

- **Import, do not parse.** A regex over a TypeScript object literal is a grep,
  and it fails in the same silent-wrong-answer class the guard exists to catch.
  Vitest resolves real `.ts` and `.tsx` app modules.
- **Tolerant at runtime, loud in CI.** The component keeps its fallback branch
  because a card should never crash. The test is strict because a missing
  illustration should never be silent. Say so, or someone will "fix" one to match
  the other.
- **Strict with no opt-out, plus a check that protects the strictness.**
  Declining speculative capability and closing a bypass around a constraint you
  just tightened are different calls, not the same one.

**The card is written AFTER the study, never before.** Delivery Promise's card
asked "Why were customers not excited by free shipping?" for a week after the
study had removed every mention of free shipping — the index framing a page around
the one thing it refuses to discuss. **`problemFraming` and `projectName` live in
two places** (`app/data/case-studies.ts` and the MDX frontmatter) and only the
first renders; keep them in step anyway, because two sources that disagree is how
this happened.

## 14. Evidence that is not evidence

Two shapes, both found on Delivery Promise section 01, both of which produced
judgments that had to be withdrawn after they had already changed shipped code.
This is rule 10 one layer up: rule 10 is about instruments that measure wrong,
this is about evidence that was never measuring the right thing.

### A prototype's chrome must be copied, never authored

Five instances in a single session, on one module:

1. **A duplicate `gap` inside a media query.** Correct in the prototype, a
   `lint:space` check 4 failure in the repo. The prototype had no way to run the
   gate that governs it.
2. **The surrounding lede set at 16px** where the real one is rung 2 at ~26px.
   The module looked correct in type the page does not have, and section 01's
   skim problem did not surface until it was built.
3. **`.prose p` at specificity (0,1,1) outranking `.testimony-pair__quote` at
   (0,1,0).** Every render in that session showed the quote at 18px regardless of
   what the module asked for. Nobody saw the shipped 17px until it was measured
   on the live page.
4. **Scaffolding declaring body prose `--text-secondary`** where
   `.case-study-prose` is `--text-primary`. This did not merely distort the
   comparison, it **inverted** it: in that context a secondary quote *matched*
   the surrounding prose, where on the real page it would be the only demoted
   element in a section of primary text. Three colour options were judged against
   a page that does not exist.
5. **The fix for (4) was applied to the file being edited and asserted for the
   other three**, which shipped uncorrected inside a commit whose message said
   they were corrected.

The rules:

- **Copy chrome out of `globals.css`. Never author it.** Every declaration in
  scaffolding is a claim about the page, and a claim can be false. Cite the line
  number in a comment so the next reader can check it.
- **Scope it so it cannot reach inside the module.** Direct-child selectors, not
  descendant. Scaffolding must not be able to outrank the thing being
  prototyped.
- **Verify computed values against the real page before judging anything.** The
  lede's size and ink, body's size and ink, the heading's size. All are
  checkable in one `getComputedStyle` pass.
- **Prove the variants differ.** Read the property you are varying, per option.
  Three "different" colour options once rendered identically and the error was
  invisible in the picture.
- **A prototype cannot run the gates.** Whatever `lint:space`, `lint:type` and
  `lint:prose` would catch, catch by hand.
- **A defect found in one file is a defect in every file that shares the
  pattern.** Fix by grep, verify by grep, and do not report a fix you have not
  re-read. Instance (5) is the whole reason this rule needs stating: the failure
  survived being found once. **"Verify by grep" is not "write a lint check"** —
  a new gate must be negative-tested in both directions before it is trusted, so
  it is its own pass, never the last commit before a merge.

### A value that has never rendered is not a precedent

`.framed-pair`'s `margin-bottom` was cited as the precedent for
`TestimonyPair`'s. **All three `.framed-pair` instances are their section's last
child**, so `.cs-section > :last-child` zeroes them: that declaration has never
rendered on any page in the repo. The top gap was confirmed against three
shipped instances at 32px. The bottom was the spec's own value being exercised
for the first time, and the comparison table read as a matched pair until someone
checked.

`globals.css` carries at least three never-exercised bottom margins —
`.framed-pair`, the milestone, and the bento theme block. The file has a habit of
specifying symmetric margins and only ever rendering the top half.

- **Before citing a value as precedent, confirm something renders it.** A number
  that agrees with nothing is not a number that agrees.
- **Say which half of a claim is confirmed and which is not.** A table with one
  measured column and one aspirational column, presented without the
  distinction, is a false report even when every figure in it is accurate.
- **The first page to exercise a never-rendered value is the test.** Look at it,
  in both modes, because there is no precedent to appeal to if it reads wrong.

**And a border that paints nothing is the same class.** `.figure__image`'s
`color-mix(… currentColor 12% …)` border rendered invisibly because `color` on
that element computes to `rgba(0,0,0,0)`; the visible hairline came from a
different rule entirely. A right conclusion reached by a wrong mechanism will hide
the next case.
