# Copy tells — the inventory

The copy tell often gives a page away faster than the visuals. This is the list the audit checks. It is organized so the mechanizable items map straight to `grep-pass.sh`, and the judgment items are marked.

**Canonical banned words live in `05-anti-patterns.md` (voice section) and `07-content-strategy.md` §3.** This file does not restate that list. It points the grep at it, and it adds the constructions and punctuation tells the article names that Paul's word-lists do not cover.

Every hit is a candidate, not a verdict. Judge each against the legitimate-use notes at the end.

---

## Punctuation and rhythm (mostly grep-able)

- **Em dash as the default connector.** Grep-able. Paul's ceiling is one per paragraph. Flag the second in a paragraph, alarm on the third. A file with more em dashes than paragraphs is voiced by a model.
- **Interpunct `·` as a separator.** `Docs · API · Pricing`, `L7 · HTTP / TLS`. Grep-able. The model reaches for it almost as readily as the em dash. Nearly always a tell in body and nav copy.
- **Trailing arrow `→` at the end of a link.** `Get started →`, `Learn more →`, twelve times on a page. Grep-able. One is fine; a page full of them is a tell.
- **Fragment stacking.** "The structure is the problem. Not the font. Not the palette." A sentence followed by two fragments. Semi-grep-able (short sentence starting with a capitalized negation after a period). Judge in context.
- **Uniform paragraph length.** Every paragraph three or four lines, no variation. Not grep-able; read for it. Real writing varies its paragraph length because it has uneven things to say.
- **Perfectly parallel bullets.** Same length, same shape, same rhythm down a list. A tell against naturally ragged human lists. Read for it.
- **And / But / So openers, repeated.** Manufactures conversation without being conversational. Grep sentence-initial "And "/"But "/"So "; flag clusters, not singletons.
- **Threes everywhere.** Three examples, three adjectives, three clauses, three cards, when three does nothing. Read for it; the structural pass catches the three-card version.

## Constructions (read for these; a few are grep-able)

- **The negation pair.** "It's not a font problem, it's a structure problem." "This isn't about speed. It's about clarity." "Not X but Y." Grep-able with a rough regex (see `grep-pass.sh`). Once you see it you see it everywhere. High-value tell.
- **The escalation.** "Not just faster, but fundamentally different."
- **Rhetorical question then its answer.** "Why does this matter? Because your users already know." Grep-able (a `?` mid-paragraph followed by a capitalized answer).
- **Balanced antithesis as a headline.** "Less noise, more signal." Reads designed, decides nothing.
- **Concessive opener.** "While X is true, the more interesting point is Y."
- **Aphorism ending.** A neat closing line that sums up a paragraph that did not need summing up.

## Vocabulary (grep-able — seed from Paul's lists, then add)

Paul's canonical list already bans: delve, leverage, robust, spearheaded, holistic, seamless, cutting-edge, wear many hats, passionate about delivering, dive deep, unpack, surface (v.), unlock (v.), elevate, supercharge, transform, reimagine, **craft** (in positioning), **consumer-grade**, and the adverbial fluff set (truly, really, very, simply, just, basically, essentially, ultimately, fundamentally). Grep for all of it.

Article additions to fold in:

- **Filler adverbs:** genuinely, actually, quietly, deeply, remarkably, surprisingly, incredibly, honestly, effortlessly.
- **Vague evaluatives:** vibe, feel, texture, energy, magic, delightful.
- **Consultant nouns:** landscape, realm, journey, tapestry, testament, ecosystem.
- **Consultant verbs:** empower, streamline (beyond Paul's set).
- **Hedges:** arguably, in some sense, to some degree, it's worth noting that, that said.
- **Self-narration:** let's dig in, here's the thing, the reality is, let me break this down, now the interesting part.

## Behavior (read for these — not grep-able)

- **Preamble before the answer.** Two sentences of framing before anything lands. On a case study this delays the Dana hook past the first 600px.
- **Restating the point after making it.** A good line, then a weaker sentence saying the same thing.
- **Never committing.** Everything hedged so nobody can disagree, which means nobody learns anything. Directly against Paul's "confident understatement, specific over impressive."
- **No specifics.** No numbers, names, dates, prices, examples where those are exactly what would make it believable. This is the same failure as `07` §3's vague-metrics ban. High-value on a portfolio.

## Interface and marketing copy (mostly read; a few grep-able)

- **Generic CTA labels:** "Get Started", "Learn More", "Get in Touch". Grep-able. Paul's `07` §4.4 already bans the "Let's chat / Let's connect" bloat; this extends it.
- **Subhead formula:** "The [category] for [audience] who [aspiration]."
- **Headline formula:** "Everything you need to X, all in one place."
- **Feature cards as two-word abstractions:** "Lightning Fast", "Fully Customizable", "Built to Scale."
- **Empty state:** "Nothing here yet" with no next action. (Paul's site should have almost none of these, but a 404 or a gated route can.)
- **Errors that apologize and explain nothing:** "Something went wrong. Please try again."
- **FAQ phrased as questions the company wishes it were asked.**
- **Title Case On Everything,** including small UI labels. Grep-able heuristically.
- **Emoji as section markers.** Grep-able.

---

## Legitimate uses — do not auto-fail these

- **Em dash, one per paragraph.** Paul's intended style. Only the overrun is a tell.
- **Mono for numbers, IDs, code.** Real typographic use. Mono as a decorative "technical" label is the tell.
- **A rhetorical question that a case study actually answers with evidence** — different from the model's ask-and-immediately-answer tic. Judge by whether the answer is specific.
- **First-person prose** is the required voice, never a tell.
- **A real, specific number** (47%, 90 seconds, three theaters) is the goal, not filler.

## How to report a copy finding

`file:line` · the tell · the exact string · why it fires · owning fix (content strategist for a rewrite, plain-pass if it is also hard to read, `05`/`07` if it is a banned-word update). Rank the negation pairs, vague metrics, and any agency/direct conflation above single-punctuation hits.
