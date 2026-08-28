# Gemini prompts — the three Delivery Promise friction-beat figures

Companion to `docs/promise-beats-drawing-sheet.md`, which carries the geometry.

**Rewritten 26 Aug 2026 after actually rendering the shipped SVGs.** An earlier
version of this file inferred the style from path geometry and got four things
wrong, all of them load-bearing. Corrections are listed at the bottom so the
mistake is not repeated by the next person who reasons instead of looking.

---

## BEFORE YOU PROMPT: attach the references

**This matters more than anything written below.** Gemini takes image input, and
it matches a supplied reference far more reliably than it reproduces a written
description.

Attach **`oku-02-once-a-year`** and **`oku-03-reconciliation`** as PNGs and open
with:

> Here are two illustrations from an existing set. I need three more in exactly
> this style — the same line weight, the same level of detail, the same amount of
> white space. Study them before you draw.

Then paste the style block, then one scene. **Do all three in one conversation,
in order**, asking each time for "the same hand and line weight as the previous
image."

---

## STYLE BLOCK — prepend to every scene, unchanged

> A clean black outline illustration on a plain background. Every line is the
> same uniform weight throughout — an even, steady contour line, like a fine
> technical pen held at constant pressure. No thick-to-thin taper, no brush
> feel, no sketchiness.
>
> Outline only. Nothing is filled in. No solid black areas, no grey, no
> gradients, no cross-hatching. The only interior marks are a few short parallel
> strokes used sparingly to suggest a surface — the corrugation on a cardboard
> box, the boards of a floor — never to shade a form.
>
> Warm, observational editorial illustration. A real person doing a real thing,
> drawn with care and a little humour, in loose natural perspective rather than
> flat or isometric. Faces are simple but present: a few strokes for the eye,
> the nose, the mouth. Hands and posture do the acting.
>
> Wide landscape, 16:9. One dominant object drawn large, the person clearly
> readable beside it, and very little else. The drawing floats on the page with
> generous empty space on all four sides — no border, no frame, no ground
> shadow, no scenery behind it.
>
> It must read instantly at thumbnail size, about 300 pixels wide. No lettering
> of any kind: no words, no labels, no signage, no logos, no brand marks.

---

## SCENE 01 · `blind`

**Beat: She could not see the date.** Cost and timing showed up at checkout,
after she had already chosen everything. Until then she was guessing.

> A woman standing, holding a dress or shirt up at arm's length in front of her,
> studying it, deciding whether to buy it. Behind her hangs a large wall
> calendar: a plain grid of empty squares. The grid is completely blank — no
> numbers written in it, no day circled, no marks of any kind.
>
> The calendar is the dominant object, drawn large enough to fill most of the
> frame's height behind her. She stands in front of it, turned slightly away, at
> roughly two-thirds her own height against it.
>
> The blankness of the grid is the subject of the picture. Nothing has gone
> wrong yet — she simply has no information to work from.

**Reject if:** a day is circled, crossed out, or marked; a question mark appears;
the calendar reads as *cancelled* rather than *empty*. Nothing has failed in this
beat.

---

## SCENE 02 · `phantom`

**Beat: She paid for something we did not have.** Inventory updated slowly, so
the out-of-stock message landed on order submit, or as a cancellation days after
she had been charged.

> A woman leaning over an open cardboard shipping box on a table, reaching one
> hand down into it. The box is empty — its four flaps are open and folded back,
> and the inside is bare. In her other hand, held down at her side, is a long
> narrow paper receipt with a torn bottom edge.
>
> **This is a clothing box, not a moving box.** Shallow and wide — the size a
> couple of folded garments ship in, roughly as long as her forearm. She can lift
> it in one hand. It must not read as a large freight or storage carton.
>
> The box is the dominant object, drawn large in the frame and angled so the
> viewer sees straight down into the empty inside. She is beside and slightly
> above it, looking in.
>
> **Leave the front face of the box clean and blank** — a plain empty rectangular
> panel with no marks on it. A logo will be added there afterwards; do not draw
> any lettering.
>
> A few short parallel strokes on the box's cut edges to read as corrugated
> cardboard. The receipt must be unmistakable at small size: keep it long,
> narrow, and clearly paper.

**Reject if:** the receipt is too small to read at thumbnail size, the box has
anything in it, or the box reads as freight-scale. The receipt is the entire
difference between this beat and a picture about a late delivery.

*Optional, if it comes back too bare:* a single sheet of crumpled tissue paper in
the bottom of the box reads as "the clothes should have been here" and costs one
or two lines. Skip it if the box already reads empty enough.

---

## SCENE 03 · `split`

**Beat: One order arrived as three.** About half of multi-item orders split
across shipments, most of them out of stores, and no rules engine decided which.

> Three separate clothing parcels sitting on a doorstep, spread apart from one
> another rather than stacked. A woman crouches beside the nearest one, opening
> it.
>
> **These are apparel shipments, not freight.** Two are soft plastic mailer
> envelopes with a single garment inside, so they bulge and slump rather than
> holding a rigid shape. The third is a shallow cardboard clothing box, about as
> long as her forearm. Nothing here is bigger than something one person carries
> in one hand. **No large moving boxes, no crates, no stacked cartons.**
>
> The mix of packaging is deliberate and should be obvious: the soft mailers and
> the box clearly came from different places.
>
> The three parcels are the dominant objects, arranged across the width of the
> frame with clear space between them so they read as three separate arrivals.
> Angle them slightly differently. Short parallel strokes on the box's edges for
> corrugation; smooth, slightly creased contours on the soft mailers.
>
> **Leave one clean blank panel on each parcel** — a plain empty rectangle on the
> box's face and on each mailer. Logos will be added afterwards; do not draw any
> lettering.
>
> Keep the woman small and low in the frame, crouching in profile. The parcels
> carry the picture; she is there for scale and for the act of opening.

**Reject if:** the parcels stack or touch, anything reads as freight or moving
scale, or the figure competes with them. This is the only scene with a repeated
element, and repetition plus a person risks four competing objects at 300px. If
it comes back busy, ask for the parcels larger and the figure smaller.

**Why the mix matters, beyond looking right.** The finding behind this beat is
that about half of multi-item orders split, *most of them store-partial* — so the
three arrivals genuinely came from different origins. Two soft mailers and one
box carries that without a word of explanation.

---

## NEGATIVE LIST — append if it drifts

> No colour. No grey. No shading, no cross-hatching, no stippling. No filled or
> solid black shapes. No thick-and-thin or brushy line — the weight must stay
> constant. No lettering, numbers, labels, signage, logos or brand marks of any
> kind — leave those panels blank, they get filled in by hand afterwards. No arrows, icons, screens,
> phones, dashboards or UI. No speech bubbles. No border or frame. No background
> room, wall, window or scenery beyond the one object named. No watermark or
> signature. Not a cartoon, not a comic panel, not clip art, not a flat vector
> icon set.

---

## THE URBN MARK — added by hand, never by Gemini

The parcels are URBN's, and saying so turns a generic delivery picture into *this
company failing this shopper*. But **do not ask the image model for it.**

**Why not.** Image models are unreliable at lettering, and a four-letter wordmark
is exactly the case they mangle — you will get URBIN, UBRN, or something
letter-shaped that is not letters at all. Worse, a near-miss is harder to spot
than a total failure, and a misspelled client name on a portfolio piece about that
client is the kind of imprecision the whole study is trying not to commit.

**Do it in the trace instead.** The scenes above ask Gemini to leave a clean blank
panel on each parcel face. After tracing, set `URBN` there yourself, in Commissioner,
as outlined paths.

Rules for it:

- **Outline the type.** House rules §5 bars `<text>` elements in shipped figures.
  `fdte-01-tempo` depicts a clock face with numerals and is compliant because they
  are drawn as paths. Same treatment here: set it, then Create Outlines.
- **Match the drawing's line weight**, or set it solid if the mark reads better
  filled at this scale. Judge it at 300px, not at full size.
- **Small enough to read as branding, not as a caption.** Four letters on a parcel
  face at a 300px render is roughly 30–40px wide. That is deliberately near the
  edge of legibility: it should read as *a mark is there* at a glance and resolve
  to URBN when someone looks. A wordmark you can read across the room is too big.
- **One mark per parcel, on one face only.** Not on the top and the side.
- **Beat 01 gets no mark.** There is no parcel in that scene, and putting the
  logo on the calendar would be a different and worse idea.

**Update the alt text when the art lands.** The MDX currently says "three separate
parcels"; once they are branded and clothing-scale it should say so — the alt text
is what a screen reader gets instead of the picture, and "three URBN clothing
parcels" is more use than "three parcels."

---

## ACCEPTING AN IMAGE

1. **Scale it to 300 × 168 and judge it there.** That is the only size it ever
   renders at. If the subject is not instantly readable, it fails regardless of
   how good it looks large.
2. **Ink must not touch any edge.** The trace target is 80 units of clear space
   inside a 2750 × 1536 box, roughly 8.7px at rendered size.
3. **Density against `oku-02` and `oku-03`.** These three sit beside BARD's, so
   they should match BARD's detail level. Nuuly's `beat-01-station` is an order
   of magnitude denser — 528 closed subpaths against `oku-02`'s 48 — and that
   gap is most of what reads as "some are fuller." Aim at the Oku end.
4. **Look at all three together at 300px.** Same line weight, same apparent
   figure scale, same amount of white. This is the check that catches a set
   approved one image at a time.

---

## FROM GEMINI TO THE REPO

1. **Trace to filled outlines, not strokes.** House rules §5: no `stroke`
   attribute in any shipped figure. Image Trace → Expand → Outline Stroke.
2. **`viewBox="0 0 2750 1536"`**, artwork fitted so ink stays 80 units clear of
   every edge.
3. **`fill="currentColor"` and `fill-rule="evenodd"`.** A hardcoded `#000`
   renders invisible in dark mode — these theme-flip by inheriting colour.
4. **1–4 top-level paths**, and keep the subpath count near `oku-02`'s rather
   than `beat-01-station`'s. A heavy path is real page weight on the LCP route.
5. **No `<text>` elements.** Note the distinction: `fdte-01-tempo` depicts a
   clock face with numerals on it, and that is fine — they are drawn as paths.
   The rule bars `<text>` elements, not drawn numbers. Check after tracing.

Files land in `components/promise-beats/` as `blind.svg`, `phantom.svg`,
`split.svg`.

---

## WHAT THE EARLIER VERSION OF THIS FILE GOT WRONG

Recorded because it is the same failure this session has now produced six times:
reasoning from a proxy instead of looking at the thing.

The proxy was path geometry — curve-to-line ratios, subpath counts, and the fact
that every figure is filled outlines with no `stroke` attribute. Four conclusions
drawn from it, all wrong:

| inferred | actual |
| --- | --- |
| Variable-width, tapering brush or ink-pen strokes — because outlining is only *necessary* for a variable stroke | **Uniform weight throughout.** Clean constant-pressure monoline. The outlining is for theme-flip and scaling, not taper |
| No faces, no expressions | **Faces are present in three of four**, simple but drawn — eye, nose, mouth, hair |
| No text or numbers anywhere | `fdte-01-tempo` **depicts a clock face with numerals**. The rule is no `<text>` *elements*; drawn numbers are fine |
| No background, no room, no furniture | `beat-01-station` has **a full room** with floor boards, perspective and a ghosted second workstation receding behind |

The inference about outlining was sound reasoning from a real constraint. It was
still wrong, because a second explanation existed — theming — and nothing in the
geometry could distinguish them. **A mechanism that would explain the evidence is
not the mechanism that produced it.**
