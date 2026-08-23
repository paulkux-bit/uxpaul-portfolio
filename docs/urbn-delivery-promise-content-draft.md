---
title: "Nobody remembered the wait. Everybody remembered the miss."
slug: "urbn-delivery-promise"
client: "URBN"
template: "A"
disciplines: ["service design", "platform strategy", "research", "consumer retail"]
featured: true
order: 4
problemFraming: "Why did free shipping stop working?"
projectName: "Delivery Promise"
headline: "Reframed a shipping problem as a broken promise, across four brands."
summary: "I led delivery strategy across URBN's four brands. Research moved the company off a two-day arms race and onto the promise it was already breaking."
heroImage: "/case-studies/urbn-delivery-promise/hero-pdp.png"
heroImageAlt: "A product page showing free two-day shipping to a specific zip code with a named arrival date, above a panel listing three fulfillment options including one that is unavailable and says why."
role: "Senior Product Designer, UX strategy lead"
timeframe: "2018 – 2019"
team: "I led strategy and direction. Vertical UX designers on my team carried execution; a researcher owned the primary research. Partnered with brand marketing and e-commerce across four brands, Data Science on metrics, and Customer Service on pain points."
nda: false
---

{/* ─────────────────────────────────────────────────────────────
    Delivery Promise – Template A. Content draft v2.
    Supersedes v1, which cut the friction beats and the callout
    construction for hygiene reasons rather than story reasons.
    Paul overruled that on 23 Aug and he was right: a pattern is
    only lazy when the story does not want that shape.

    Arc: 6 sections + milestone + Role. Nuuly shipped 9, so the
    "7 ceiling" in case-study-house-rules-learned.md is stale; it
    was measured on BARD and FDT-E only.

    RULINGS RECORDED SO THEY ARE NOT RE-LITIGATED:

    - FRICTION BEATS ARE BACK, and this is the fourth study to run
      them. Justified on axis, not on art: BARD's three are defects
      in a system, FDT-E's are states of a person's mind, Nuuly's
      are constraints of a room. THESE THREE ARE BREAKS INSIDE ONE
      ORDER. Paul's own 2019 deck structured this problem in three
      parts twice, independently. If a future pass wants to cut
      them, cut them because the axis stopped being distinct, not
      because four is more than three.

    - THE CALLOUT USES THE HOUSE CONSTRUCTION on purpose. All three
      shipped studies run "[general case]. This one [does X]." The
      discipline it carries: in every shipped instance the second
      clause holds a surprise. If a rewrite flattens the surprise,
      abandon the construction rather than keeping the shape.

    - THE CONFESSION IS THE MEASUREMENT, NOT FREE SHIPPING. An
      earlier draft gave "free shipping cost margin" its own
      section on Nuuly's bright-mode precedent. That overclaims:
      Nuuly's confession works because bright mode was Paul's
      decision. Free shipping was a business outcome he measured.
      The failure that IS his is section 06. Do not swap them back.

    - Define-by-negation: ZERO headings use it. The hero's
      nobody/everybody pair is parallel structure, not a negation.
      Budget is intact if a later pass needs to spend it.

    - Milestone carries a STATUS WORD, not a date, per the
      convention change queued in the Nuuly build cards.

    - §7 keeps a paragraph AFTER the milestone. Same reason Nuuly
      does: this work is seven years old and Paul left four months
      after the roadmap landed, so the reader arrives asking
      whether it is still his. Do not "fix" to milestone-terminal.

    - Internal figures are stated as shapes. The percentages in §3
      are URBN operational data pending Paul's clearance; the
      absolute miss count is deliberately unused. Provenance stays
      in three labelled layers: public industry (Baymard),
      URBN-commissioned research, URBN operational data.

    Paul rewrites each section by hand. Do not regenerate.
   ───────────────────────────────────────────────────────────── */}

import { BentoBand } from '@/components/bento';
import InversionChart from '@/components/case-studies/urbn-delivery-promise/InversionChart';
import PromiseSequence from '@/components/case-studies/urbn-delivery-promise/PromiseSequence';
import FanOut from '@/components/case-studies/urbn-delivery-promise/FanOut';
import { PromiseBeatFigure } from '@/components/promise-beat-figure';

<HeroBlock
  eyebrow="DELIVERY PROMISE · URBN"
  title={['Nobody remembered the wait.', 'Everybody remembered the miss.']}
  role="I led delivery strategy for URBN's four brands. Research reframed a shipping problem as a broken promise to shoppers, and set the roadmap all four built against."
  image={{
    src: '/case-studies/urbn-delivery-promise/hero-pdp.png',
    alt: 'A product page showing free two-day shipping to a specific zip code with a named arrival date, above a panel listing three fulfillment options including one that is unavailable and says why.',
  }}
  callout={{
    label: 'WHAT CHANGED',
    body: 'Most retailers tell you how fast they ship. This one tells you when it lands.',
  }}
/>

<section className="cs-section cs-section--problem">

## Speed was the wrong thing to measure.

<p className="section-lede">Leadership asked us to surface inventory and location data earlier in the shopping journey. They had half of it.</p>

**Most shoppers could not tell you how long an order took.** They could tell you whether it came when we said it would. That was the part they remembered, and the part they repeated.

**One shopper bought a wardrobe for a vacation, weeks ahead.** It arrived after she left. She posted about it, then waited a long time for her money back.

**Every inventory failure came out the other end as a broken date.** That is where a shopper feels it, and that is what we were actually losing on.

<blockquote className="pull-quote pull-quote--quiet">
  <p>“I relied on this and bought $190 in vacation clothes only to have the shipment arrive a day late, after my departure.”</p>
  <cite>App Store review, July 2019</cite>
</blockquote>

</section>

<section className="cs-section cs-section--frictions">

## Her order broke in three places.

<p className="section-lede">A researcher ran the interviews and I worked the analysis with her, against the order data and the customer service queue.</p>

{/* FIGURE SLOTS x3. The subject is the SHOPPER at the moment the order breaks,
    never an abstraction and never a system diagram. That is what keeps this set
    distinct from BARD's (system defects) and Nuuly's (a specialist at work).
    Friction-beat figures render at a 300px cap, 169px tall: one oversized
    object per frame, nothing finer than 40px. That CSS is shared across all
    four studies. Do not touch it. */}
<ol className="friction-beats">
  <li className="friction-beat" data-thread="1">
    <div className="friction-beat__text">
      <span className="thread-index">01</span>
      <h3 className="friction-beat__headline">She could not see the date</h3>
      <p className="friction-beat__scene">Cost and timing showed up at checkout, after she had already chosen everything. Until then she was guessing.</p>
    </div>
    <PromiseBeatFigure variant="blind" alt="A shopper holding a garment at arm's length, a calendar behind her with no day marked on it." />
  </li>
  <li className="friction-beat" data-thread="2">
    <div className="friction-beat__text">
      <span className="thread-index">02</span>
      <h3 className="friction-beat__headline">She paid for something we did not have</h3>
      <p className="friction-beat__scene">Inventory updated slowly, so the out-of-stock message landed on order submit, or as a cancellation days after she had been charged.</p>
      <blockquote className="pull-quote pull-quote--quiet">
        <p>“Ordering, paying, and then 3-4 days later getting the email that the item wasn't actually available anymore.”</p>
        <cite>Anthropologie customer, review</cite>
      </blockquote>
    </div>
    <PromiseBeatFigure variant="phantom" alt="A shopper reaching into an open box that is empty, the receipt still in her other hand." />
  </li>
  <li className="friction-beat" data-thread="3">
    <div className="friction-beat__text">
      <span className="thread-index">03</span>
      <h3 className="friction-beat__headline">One order arrived as three</h3>
      <p className="friction-beat__scene">About half of multi-item orders split across shipments, most of them out of stores, and no rules engine decided which.</p>
    </div>
    <PromiseBeatFigure variant="split" alt="Three separate parcels on a doorstep at three different times, one shopper opening the last of them." />
  </li>
</ol>

<p className="mt-14!">**The promise was made in marketing, kept in a warehouse, and broken in a customer service queue. Nobody owned all three.**</p>

{/* Paul's own 2019 journey map. It is the evidence for the three beats above:
    the satisfaction line dips at the out-of-stock moment and closes on a frown
    after a cancellation. TWO OPEN ITEMS: it carries five accent colours onto an
    accent-free site, and 2048px against a 2176px band floor is DPR 1.88.
    Redrawing it monochrome resolves both. */}
<BentoBand
  src="/case-studies/urbn-delivery-promise/journey-angela.png"
  alt="A five-stage journey map for a cost-sensitive shopper. The satisfaction line rises through arrival and browsing, drops sharply at an out-of-stock message on order submit, recovers at the order receipt, then falls to its lowest point when an item is cancelled after purchase."
  caption="One order, mapped."
  gloss="It ends lower than it started, and the drops are not about price."
  aspect={1.778}
/>

</section>

<section className="cs-section">

## We failed hardest where we charged the most.

<p className="section-lede">Standard shipping was dependable. The faster a shopper paid to go, the more likely we were to miss.</p>

<InversionChart />

**The premium bought a worse chance of arriving on time.** Orders routed out of stores were the worst of all, and one fulfillment center was proof the rest could be fixed.

Industry research puts the cost of checkout ahead of slow delivery as a reason people abandon carts, so the money was never what we were losing on. We were losing on the date.

</section>

<section className="cs-section">

## A shopper should meet the same date everywhere.

<p className="section-lede">I built it at the platform level rather than for one brand. Four brands, one promise, with room for each to override what it needed to.</p>

The date in the ad has to be the date on the product page, the date in the cart, and the date that arrives by text. A promise told four different ways is four guesses.

<PromiseSequence />

</section>

<section className="cs-section">

## The best thing I designed was a roadmap.

<p className="section-lede">The front-end work was the easy part. Moving four brands and a dozen product teams was the job.</p>

We had a mature design practice, so screens were never the constraint. What stopped us was that no team could fix this alone, because no team held more than a third of it.

**Leadership moved when I showed them the horror stories.** The vacation that left without its clothes. The order cancelled four days after it was paid for. After that the argument stopped being about inventory.

<FanOut />

</section>

<section className="cs-section">

## I measured four businesses with one set of numbers.

Anthropologie, Free People, Urban Outfitters and Nuuly run on different seasons and different business models. I set one set of measures across all four, and it flattened the differences that mattered.

**Free shipping bought engagement and cost margin.** Targeted offers in the app replaced it and lifted order value instead. Per-brand measures would have surfaced that sooner, and that is the thing I would do differently.

</section>

<section className="cs-section">

## Where Delivery Promise landed.

<div className="milestone">
  <p className="milestone__frame">Adopted across Anthropologie, Free People, Urban Outfitters and Nuuly</p>
  <p className="milestone__date">Built</p>
  <p className="milestone__sub">Delivered through several modernization efforts.</p>
</div>

{/* §7 keeps a paragraph after the milestone, on Nuuly's precedent and for the
    same reason: the work is seven years old and Paul left months after the
    roadmap landed, so the reader arrives asking whether it is still his. The
    paragraph answers it and scopes the claim. Do not restore the
    milestone-terminal pattern BARD and FDT-E use. */}
I left URBN that November. Most of what shipped, shipped without me, and I will not claim the execution. What I will claim is the reframe: the company stopped trying to beat two-day shipping and started keeping the date it had already promised.

</section>

<section className="cs-section">

## Role

UX strategy lead on Delivery Promise at URBN, a direct employer. I set the direction and the roadmap; the vertical UX designers on my team carried execution against it, and a researcher owned the primary research while I shaped it and worked the analysis with her.

Partnered with brand marketing and e-commerce managers across all four brands, with Data Science on the metrics, and with Customer Service on what shoppers were calling about.

Designed 2018 to 2019.

</section>
