# Delivery Promise — content draft v3

**Supersedes `docs/urbn-delivery-promise-content-draft.md`.** Named `.md` so the
content loader does not pick it up. Copy the body into
`app/content/case-studies/urbn-delivery-promise.mdx`.

Written 24 Aug 2026 after a full re-read of all 24 deck pages. v2 was built and
shipped; this is a narrative revision, not a restructure. **The arc does not
move.** Six sections plus milestone plus Role, same order, same modules except
one that was never built.

---

## What changed and why

The built study answers *what I found*. It does not answer *how I knew*, and the
project's own audit of the old Squarespace site named exactly that gap: "process
is invisible, the case studies jump straight from Overview to Solution." This
one jumps from Overview to Verdict, which is the same gap in better clothes. It
matters more here than on the other three because this is the strategy study.

Four edits close it. None of them is a new section.

**1. Section 01 declares the method.** A bold-lead paragraph names three
independent sources so the reader knows to watch them converge, and the pull
quote is swapped for the one that IS the insight rather than the one that is the
complaint.

**2. Section 03 lands the convergence.** The 4 percent / 45 percent pairing goes
in, and the closing paragraph stops citing Baymard alone and states what all
three sources ruled out.

**3. Section 05 is rebuilt around dependency.** New heading, new module, and the
horror-stories beat moves to section 04 where it belongs.

**4. Section 06 gets its counterweight.** The commissioned 96 percent figure
makes the confession land, because free shipping was not a mistake, it was
extremely effective, and that is exactly why one blended measure across four
businesses was the wrong instrument.

### The evidence that was sitting unused

All of it is in the deck. None of it was in the study.

| Deck page | What it is | Where it lands |
| --- | --- | --- |
| p9 | The thesis, in a customer's own words | Section 01 pull quote |
| p10 | Rush is 4% of UO purchases, bought out of desperation | Section 03 |
| p10 | "I have to be extremely desperate" | Section 03 pull quote |
| p5 | Commissioned survey: cost beats speed | Section 03 close |
| p7 | 96% say free shipping changes their order | Section 06 |
| p23 | The roadmap, as two columns | `DependencyMap` |

**The 4 percent figure was cleared by Paul on 24 Aug**, specifically to make a
point in the investigation. It is a mix percentage, not a tier miss rate, so it
sat outside the earlier clearance until he ruled on it directly. Per-brand
columns and absolute order counts remain excluded.

### The skim test on the result

> Speed was the wrong thing to measure → **Three sources, and none of them could
> see the whole thing** → Most shoppers could not tell you how long an order took
> → Her order broke in three places → Nobody owned all three → We failed hardest
> where we charged the most → **None of them pointed at money either. They pointed
> at the date.** → A shopper should meet the same date everywhere → Leadership
> moved when I showed them the horror stories → The date had to be true before we
> could show it → **Every screen in this study sits in the back half of that
> roadmap** → The best thing I designed was a roadmap → I measured four businesses
> with one set of numbers

The investigation is now traceable from the skim alone: three sources are
declared, they converge on a verdict, the verdict produces an order. That thread
did not exist in v2. All four hiring questions still answer.

### Budgets, measured

| Section | v2 words | v3 words | Ceiling |
| --- | --- | --- | --- |
| 01 | 134 | 138 | ~150 |
| 03 | 82 | 138 | ~150 |
| 04 | 61 | 92 | ~150 |
| 05 | 85 | 114 | ~150 |
| 06 | 66 | 108 | ~150 |

**One open question for Paul.** The p9 quote runs about seven lines at
`.pull-quote--quiet` (28ch, roughly seven words a line). That is a deliberate
spend and it is the thesis of the study in a stranger's voice, but it may want
`.section-note` at 56ch instead. Decide against the render, not the draft.

**One thing now unused.** The July 2019 App Store review about the $190 of
vacation clothes leaves section 01, because the prose already tells that story
and two blockquotes in one section is heavy. It could go into friction beat 01,
which has no quote. Paul's call.

---

## The body

Everything below goes into the MDX. Sections not shown are unchanged from what
is built.

### Section 01 — replace the whole section

```mdx
<section className="cs-section cs-section--problem">

## Speed was the wrong thing to measure.

<p className="section-lede">Leadership asked us to surface inventory and location data earlier in the shopping journey. They had half of it.</p>

**Three sources, and none of them could see the whole thing.** What shoppers told a researcher, what they wrote in public without being asked, and what the order data said about all of them.

**Most shoppers could not tell you how long an order took.** They could tell you whether it came when we said it would. That was the part they remembered, and the part they repeated.

<blockquote className="pull-quote pull-quote--quiet">
  <p>“I think it got around here right on time, like the time it said it would... I don't remember complaining about it to my friends... if it said it was gonna get here on say like the 5th and it got here later I would have told my friends, ‘my damn package isn't here.’”</p>
  <cite>Urban Outfitters customer, primary research</cite>
</blockquote>

**One shopper bought a wardrobe for a vacation, weeks ahead.** It arrived after she left. She posted about it, then waited a long time for her money back. Every inventory failure came out the other end as a broken date, and that is where a shopper feels it.

</section>
```

The quote is verbatim with elisions. **Do not tighten it by rewording** — a
paraphrase presented as a quotation is a fabrication. Cutting with ellipses is
legitimate; substituting words is not.

### Section 03 — replace the whole section

```mdx
<section className="cs-section">

## We failed hardest where we charged the most.

<p className="section-lede">Standard shipping was dependable. The faster a shopper paid to go, the more likely we were to miss.</p>

<InversionChart />

**The premium bought a worse chance of arriving on time.** Orders out of stores were the worst of all, and one fulfillment center was proof the rest could be fixed.

Rush shipping is four percent of orders at Urban Outfitters, bought for a graduation or a birthday, for a date that cannot move. Out of stores we missed nearly half of them. The shoppers who needed the date most were the ones we failed most.

<blockquote className="pull-quote pull-quote--quiet">
  <p>“I have to be extremely desperate to pay for expedited.”</p>
  <cite>Urban Outfitters customer, primary research</cite>
</blockquote>

Three sources had already ruled out speed: what shoppers ranked when asked, what industry research says about abandoned carts, and what four percent says about the price of hurry. **None of them pointed at money either. They pointed at the date.**

</section>
```

The desperation quote sits in prose rather than in the chart caption on purpose.
The caption already carries the Reno sentence and is full; a customer's voice in
it would overload it and blend the two registers.

### Section 04 — add one paragraph, keep everything else

After the existing "four guesses" paragraph and **before** `<PromiseSequence />`:

```mdx
**Leadership moved when I showed them the horror stories.** The vacation that left without its clothes. The order cancelled four days after it was paid for. After that the argument stopped being about inventory.
```

This paragraph is **moved, not written.** It leaves section 05 because
persuading executives is how the bet got accepted, not how the sequence got
built. Section 04 was 61 words and has the room.

### Section 05 — replace the whole section

```mdx
<section className="cs-section">

## The date had to be true before we could show it.

<p className="section-lede">I set the direction from the shopper's side, then built the sequence with the engineers who would have to make it real.</p>

<DependencyMap />

**Every screen in this study sits in the back half of that roadmap.** A filter promising two-day delivery is worse than no filter when the date is a guess. A cart that says one shipment is a lie until something decides which warehouse ships what.

We had a mature design practice, so screens were never the constraint. What stopped us was that no team held more than a third of the promise, and the thirds had to land in order. **The best thing I designed was a roadmap.**

</section>
```

Three things happened here and each has a reason.

**The heading changed from a verdict to a claim.** *"The best thing I designed
was a roadmap"* is Paul's own line from the deck and it is good, but it is a
conclusion, and this is the section where the study most needs to show reasoning
rather than deliver one. It survives as the closing bold, which is where a
verdict belongs — after the thinking, not instead of it. The new heading also
rhymes with the hero callout (*this one tells you when it lands*), so the page
closes a loop it opened.

**The define-by-negation budget is still unspent.** Neither heading uses it. It
remains available.

**The argument merged.** v2's section 05 carried two claims at once: org
alignment was hard, and the roadmap was the deliverable. With the module they
collapse into one and it is stronger — no team held more than a third of the
promise, *and the thirds had to land in order*. That is why it could not be one
team's project.

### Section 06 — replace the body, keep the heading

```mdx
<section className="cs-section">

## I measured four businesses with one set of numbers.

Anthropologie, Free People, Urban Outfitters and Nuuly run on different seasons and different business models. I set one set of measures across all four, and it flattened the differences that mattered.

Free shipping worked. Nearly everyone we surveyed said it changed what they ordered, which is exactly why one blended number was the wrong instrument to judge it with. **It bought engagement and cost margin, and I could not tell you which brand was paying.** Targeted offers in the app replaced it and lifted order value instead. Per-brand measures would have surfaced that sooner, and that is the thing I would do differently.

</section>
```

The 96 percent is what makes this land. v2 read as *free shipping was a mistake*,
which is not what happened and is a weaker confession. Free shipping was
extremely effective. The error was Paul's instrument, and naming what the
instrument could not see — which brand was paying — is a sharper admission than
naming a business outcome he measured.

Reported generically, per the layer-2 rule. **Do not print the figure.**

### The imports

```mdx
import JourneyLine from '@/components/case-studies/urbn-delivery-promise/JourneyLine';
import InversionChart from '@/components/case-studies/urbn-delivery-promise/InversionChart';
import PromiseSequence from '@/components/case-studies/urbn-delivery-promise/PromiseSequence';
import DependencyMap from '@/components/case-studies/urbn-delivery-promise/DependencyMap';
```

The MDX comment block currently explains that `FanOut` is deliberately absent.
**Replace that paragraph** — `FanOut` is not deferred any more, it is retired.
It was named for a shape the argument turned out not to have. The roadmap is not
a fan-out from a centre; it is an ordering, and `DependencyMap` is what it
actually is. Say so, so nobody restores it.

The `PromiseBeatFigure` note stays exactly as it is.

---

## Provenance, unchanged

Three labelled layers, and the study must never blur them.

**Public industry (Baymard).** Cart abandonment: extra costs beat slow delivery.
Citable directly.

**URBN-commissioned (proprietary).** The cost-versus-speed ranking and the 96
percent. **Generic reporting only, never the figures.**

**URBN operational (proprietary).** Tier and node miss rates, the Reno
comparison, and now the 4 percent. Cleared as shapes and directions. **Per-brand
columns and absolute order counts stay excluded** — they are in the source table
and they are exactly what Paul cleared for exclusion.
