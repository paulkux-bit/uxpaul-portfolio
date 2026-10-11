# Template B "Client work" dialog: build plan (phase 1)

11 Oct 2026. Plan only, written against `docs/cc-prompt-template-b-build.md`. Nothing else was changed and no git was run. One disclosure: a read-only research subagent ran a single `git check-ignore` to confirm the crops folder is not ignored. It changed nothing, but the brief said no git, so it is recorded here.

**Rulings received 11 Oct 2026 (Paul), folded in below. Phase 2 is authorised on a feature branch, with no push or merge without Paul.**

| Q | Ruling | Where it lands |
|---|---|---|
| Q1 | Use the locked prototype now on disk, md5 `a058e6462d0ef62b4ca0019a3c2fd005` (strategy slides, honor-gift) | Section 0 |
| Q2 | honor-gift | Section 2 (copy as briefed) |
| Q3 | Shelf changes minimal. Rows become links with the site's standard link hover (title underline) and focus ring only. No new border or card treatment, because the shelf is redesigned in a later pass, so the markup stays easy to restyle | Sections 4 and 5 |
| Q4 | Dim in dark mode | Section 5, section 7 entry point 3 |
| Q5 | Close button follows `.theme-toggle`, on mobile too | Section 5, section 7 entry point 5 |
| Q6 | Thumbnail hover: bar in `--border-strong` | Section 5 |
| Q7 | No `viewport-fit` change | Section 9, risk 5 |
| Q8 | `--duration-card` for the entrance | Section 5, section 7 entry point 4 |
| (also) | Shelf rows use the project names as titles | Section 1 |

---

## 0. What was read and measured

- **Locked prototype, rendered.** `docs/previews/template-b/template-b-dialog-locked.html` was opened with Playwright at #bbc, design D / T1 / thumbnails.
  - At **1440x900**: panel 1152x669, image **588x490**, no scroll.
  - At **1280x800**: panel 1152x637, image **588x490**, no scroll.
  - At both sizes the title top equals the image top (180 and 114) and the nav bottom equals the thumbnail row bottom (752 and 686). The targets in the brief hold in the prototype.
- **Phone references:** `phone-1-locked-dialog.png` and `phone-4-bbc-locked.png`.
- **CLAUDE.md**, the four locked specs (type v3, spacing v1, colour v2, interaction v1), `docs/unspecified-surfaces.md` and `PRODUCT.md`.
- **Every gate script** (`lint-type`, `lint-space`, `lint-color`, `lint-interaction`, `lint-motion`, `lint-prose`, `lint-works`), the tests in `__tests__/`, and `scripts/assert-bands.mjs`.
- **Image conventions:** `public/fine-art/`, `public/case-studies/`, `scripts/build-fine-art.mjs`, `components/friction-moment.tsx` and `components/case-study-card.tsx`.
- **Next 16 history handling:** `node_modules/next/dist/client/components/app-router.js` lines 234 to 300.

### Resolved by Q1 and Q2

The locked file was replaced on disk before phase 2. Its md5 is now `a058e6462d0ef62b4ca0019a3c2fd005`, which matches Paul's ruling. Checked against the brief:
- Every statement, paragraph, name line, title and industry matches.
- All twelve alt texts match, including "honor-gift" on arc-1.
- BBC images 1 and 2 are new encodes, the strategy slides, so they are no longer `bbc-1` and `bbc-2`.
- Its design stylesheet and script are identical to the earlier file apart from whitespace. Only the data changed, so the layout measurements below still stand.

The record below is kept as history.

### Discrepancies found in phase 1 (now resolved)

1. **The prototype checksum does not match.** On-disk md5 is `9ba936b154284b2a2d010f9f68e068e3`; the brief says `43e1f465dd272dc90d6192764ba32bfa`. No HTML file in `docs/previews/template-b/` (13 checked, including `mcm/`) matches the brief's md5.
2. **The on-disk locked file still shows the old BBC images.** Its embedded images 1 and 2 are byte-identical to `crops-v5/bbc-1.webp` and `bbc-2.webp` (the tablet wireframes), with the old alt text. The brief and `phone-4-bbc-locked.png` use `bbc-confusing` and `bbc-pillars`.
3. **Red Cross `arc-1` alt text differs.** The on-disk prototype says "monthly and tribute checkboxes"; the brief says "monthly and honor-gift checkboxes".
4. **Everything else matches the brief character for character:** all four statements, paragraphs, name lines, shelf titles and industries, and the other nine alt texts. The CSS for layout D looks current: the rendered sizes match the brief.

**Ruled (Q1):** the locked file now on disk governs data, copy, images, layout and CSS, and it agrees with the brief.

---

## 1. Files

### Create

| File | What |
|---|---|
| `app/data/template-b.ts` | The one source: types, the four pieces, `role`. Shape in section 2. |
| `components/client-work/client-work-dialog.tsx` | `'use client'`. The dialog, hash sync, image track, thumbnails, previous and next, live region. The `<picture>` helper lives in the same file (copy before generalising). |
| `scripts/build-client-work.mjs` | Source-to-output image encoder, modelled on `scripts/build-fine-art.mjs`. Section 6. |
| `app/data/client-work-images.json` | **Generated** by the script, never hand-edited: per image, the master's md5 and native size and every emitted file with its width and height. The component reads it for `srcSet`, `width` and `height`. |
| `public/client-work/<slug>/<id>-<w>.{avif,webp}` | Delivery files, committed. Slugs: `lionsgate`, `american-red-cross`, `bbc`, `k-hovnanian`. |
| `__tests__/client-work-images.test.mjs` | Every image in `template-b.ts` has a manifest record, and every file in the manifest exists at its recorded pixel size (read with sharp). Mirrors lint-works check 4, but as a test, because the brief does not ask for a new build gate. |

### Change

| File | Change |
|---|---|
| `app/data/quick-hits.ts` | **Folded in and deleted.** See section 3. Retires the non-interactive statement at line 7. |
| `components/quick-hits/quick-hit.tsx` | Reads a `TemplateBPiece`. The `<article>`, its classes and its three children stay as they are. The h2's text becomes a link, `<a href="#slug" class="quiet-link …">{title}</a>`, stretched over the row (section 5, "Shelf row as a link"). The title shows the project name (ruled). Rewrites the docblock at lines 3 to 19, including "NON-INTERACTIVE in v1" at line 5. |
| `components/quick-hits/quick-hits-list.tsx` | Maps `templateB`; key becomes `slug`. Docblock line 6 renamed. |
| `components/quick-hits/quick-hits-section.tsx` | Heading "Also shipped" becomes **"Client work"**, id `also-shipped` becomes `client-work`. Renders `<ClientWorkDialog />` once, after the list. Docblock line 4 renamed. |
| `app/page.tsx` | Comment at lines 100 and 101 ("Also shipped ... Non-interactive in v1") rewritten. Line 24's "Also Shipped break" becomes "Client work break". |
| `scripts/shoot-interaction.mjs` | Header lines 7 to 12 (which cite the stale `app/page.tsx:84`) and lines 78 to 81 are rewritten. The `quick-hit` target gains `hover` and `focus` states, because the decision it recorded is reversed. A `client-work-dialog` target is added with a prep that loads `/#lionsgate`. |
| `components/reveal-list.tsx` | Docblock line 6: shelf name only. |
| `app/globals.css` | All new rules in one block after the shelf block (around line 1376), plus the row's link states and the `--scrim` token. Comments at 474 and 1318 renamed. Section 5. |
| `scripts/lint-type.mjs` | RUNGS gains the dialog title (flared, `ladder: false`). The `.text-qh-title` reason at line 78 is renamed. |
| `scripts/assert-bands.mjs` | `FLARED` gains the dialog title. `ROUTES` gains `/#lionsgate`, so the dialog is open while the title is asserted. Without that the selector matches nothing on any route and the script fails for the wrong reason. |
| `scripts/lint-space.mjs` | Allowlist entries, each with a one-line reason, for spacing that changes inside a media query (check 4): the short-viewport padding drop and the sheet layout. |
| `__tests__/interaction-lint.test.mjs` | The `CONTROL` list gains the new control selectors, so their `--duration-control` mapping is asserted rather than merely lint-clean (CLAUDE.md rule 3). |
| `docs/unspecified-surfaces.md` | The entry in section 7, **written first, before the component exists**. |
| `CLAUDE.md` | The text this change makes false is rewritten in the same commit:<ul><li>Page composition (line 119).</li><li>The flared set: "six selectors" becomes seven (around line 388).</li><li>The shelf name at 325, 425, 691, 757 and 794.</li><li>The stale "eight entries" count at line 69 becomes count-free (memory rule: undated counts drift).</li></ul>`text-qh-title` and the `--qh-*` names stay. |
| `docs/color-system.md` | The "Brand identity" heading (line 102) and the exception wording at 37 and 302: shelf name only. |
| `package.json` | Adds `"build:client-work": "node scripts/build-client-work.mjs"`. No dependency change: sharp and playwright are already dev dependencies. |

### The four non-interactive statements, with current line references

1. `app/data/quick-hits.ts:7` ("v1 is a non-interactive shelf"). Removed with the file.
2. `components/quick-hits/quick-hit.tsx:5` ("Server Component, NON-INTERACTIVE in v1").
3. `app/page.tsx:100-101` (the brief's "line 84" has moved).
4. `scripts/shoot-interaction.mjs:78-81`. The brief's line 71 has moved. Its header at lines 7 to 12 also lists the other three, with the stale page reference.

Grep found **no fifth statement about this shelf.** `components/takes/take-card.tsx:5` and `globals.css:1430` say "non-interactive" about the takes wall, and `globals.css:635` says it about paper grain. Those are unrelated and stay. Review records such as `docs/human-made-review.md` N2 stay as history.

**Not renamed, on purpose:** the class names `quick-hit` and `qh-*`, the `--qh-*` tokens and `text-qh-title`. They feed lint allowlists (`lint-space.mjs:112,150,151`, `lint-type.mjs:78`) and the radius expectation in `interaction-lint.test.mjs:580`. Renaming them is churn with no reader benefit. Only the user-facing name changes.

---

## 2. Data shape (`app/data/template-b.ts`)

```ts
export type QuickHitBrand = 'lionsgate' | 'red-cross' | 'bbc' | 'k-hovnanian';

export interface TemplateBImage {
  /** Path stem under public/, e.g. '/client-work/lionsgate/lg-1'. The
   *  component appends -<width>.<ext> from client-work-images.json. */
  src: string;
  alt: string;
  /** 'whole' = shown entire and centred, no frame edge (khov-1). */
  fit?: 'whole';
}

export interface TemplateBPiece {
  slug: 'lionsgate' | 'american-red-cross' | 'bbc' | 'k-hovnanian';
  brand: QuickHitBrand;
  wordmark: string;
  industry: string;
  title: string;      // project name; also the shelf row title
  byline: string;     // 'for Lionsgate', 'pitched to the BBC'
  name: string;       // full name line, for announcements
  statement: string;
  paragraph: string;
  images: readonly [TemplateBImage, TemplateBImage, TemplateBImage];
}

export const role = 'Lead UX Designer';
export const templateB: readonly TemplateBPiece[] = [ /* Lionsgate, American Red Cross, BBC, K. Hovnanian */ ];
```

- The copy and alt text are pasted verbatim from the brief, with no edits. The build greps the rendered HTML for U+2014 (lint:prose). The data is also checked for U+00B7 and `;` by a one-line assertion in the new test.
- **The title's accessible name stays one sentence.** The h2 renders `title`, then `byline`. Whatever separates them in `name` (a space, or ", " for BBC) is derived as `name.slice(title.length)`. Its leading punctuation goes in an `sr-only` span, as the prototype does, so the h2's accessible name equals `name` exactly.
- Previous and next wrap around: `(i - 1 + 4) % 4` and `(i + 1) % 4`.

---

## 3. How `quick-hits.ts` relates to the new file

**Fold it in and delete it.**
- `QuickHitBrand` moves into `template-b.ts`.
- The shelf maps `templateB` directly, using `brand`, `wordmark`, `title` and `industry`, which the new shape already carries.

A projection file would be a second module whose only job is to restate four fields of the first, and a second place for the non-interactive comment to survive.

Consumers to update: `components/quick-hits/quick-hit.tsx` and `quick-hits-list.tsx` (the only two importers; `app/sandbox/home-video/page.tsx` imports the section, which is unchanged in API). The 5th-slot comment at `quick-hits.ts:27-28` is not carried over: the brief fixes the set at four.

---

## 4. Client and server split, and behaviour

- **Server components stay server components:**
  - `QuickHitsSection`, `QuickHitsList` and `QuickHit`.
  - Each row renders a plain `<a href="#slug">`. Without JavaScript, a click is a harmless hash change.
  - `RevealList` is the existing client island and is unchanged.
- **The single new client island is `ClientWorkDialog`**, rendered once inside the section. It owns everything interactive.
- **Opening a piece:**
  - One delegated `click` listener on the shelf's `<ol>` (found by id) catches clicks on the rows' title links.
  - It calls `preventDefault`, records the row as the opener, pushes `#slug` with `history.pushState`, and calls `showModal()`.
  - The rows never become client components.
- **Hash routing.** No hard blocker exists, and I checked rather than assumed. Next 16 patches `history.pushState` and `replaceState` (`app-router.js:252-280`) to copy its `__NA` marker into our state, so a Back press is handled as an in-app traversal, not a reload (`:290`).
  - **Cold load with a hash:** on mount, read `location.hash`; if it names a piece, `showModal()` without pushing.
  - **Back:** a `popstate` listener closes the dialog when the hash names no piece, and opens or switches when it does.
  - **Esc:** the native `cancel` event closes.
  - **Backdrop click:** the dialog fills the viewport. A click whose target is the stage (outside the panel) closes.
  - **Close path:** if we pushed the entry, `history.back()`. If the dialog was opened cold, `history.replaceState(null, '', pathname)` drops the hash without a new entry.
  - **Previous and next** use `replaceState`, so a reader who visits all four pieces needs one Back press to close, as in the prototype.
  - Rows carry **no `id` equal to their slug**. A matching id would make the browser and the router scroll the page to the row on every hash change.
- **Focus:**
  - `showModal()` moves focus to the first focusable element, the close button, and the dialog's name and description are announced with it.
  - On close, focus returns to **the row that opened the dialog**, as the brief says. The prototype focused the current piece's row instead.
  - After a cold deep link there is no opener, so focus goes to the current piece's row.
- **Labelling:** `aria-labelledby` points at the h2 and `aria-describedby` at the statement.
- **Image track:**
  - A horizontal scroll-snap track: `tabindex="0"`, `role="region"`, `aria-roledescription="carousel"`, `aria-label="Images of the work"`.
  - Slides are `role="group"`, `aria-roledescription="slide"` and labelled "n of 3".
  - Swipe is native scroll-snap. Left and Right arrows on the focused track move one image.
  - The active index comes from an `IntersectionObserver` on the slides (threshold 0.6, rooted at the track), not the prototype's 80ms scroll timer.
  - Programmatic moves use `behavior: 'auto'` under reduced motion.
- **Thumbnails:**
  - `<button>`s named "Image n of 3", with `aria-current="true"` on the active one.
  - The thumbnail `<img>` has `alt=""`, because the button's name carries it.
- **Previous and next:**
  - Links with `href="#slug"`, so a middle-click opens a new tab that cold-opens that piece.
  - Visible text is the neighbour's `wordmark`. A leading `sr-only` "Previous piece:" or "Next piece:" keeps the visible text inside the accessible name (SC 2.5.3). This follows `components/next-case-study.tsx`, not `aria-label`.
  - Below 768px the previous link's wordmark is visually hidden and stays in the accessible name.
- **Live region:** one polite `sr-only` region announces "Image n of 3" and "Now showing {name}".
- **Piece change:**
  - Add `is-swapping`, wait `--duration-control` (read from computed style), swap, remove.
  - Under reduced motion the swap is immediate.
  - The panel scrolls to top. Focus stays on the link that was used.
- **Body scroll lock:** pure CSS, `html:has(dialog.client-work[open]) { overflow: hidden; scrollbar-gutter: stable }`, so the page does not shift sideways when the scrollbar goes. No JavaScript style writes.
- **Images load only when the dialog is open.** The `<picture>` elements are rendered only while open. The closed shell holds no `<img>`, so the home page makes zero new image requests.
  - **JavaScript cost:** `next build` reports First Load JS for `/` before and after, and both numbers go in the report.
  - If the island costs more than a few kB, it moves behind `next/dynamic` with the cold-hash case preserved. That is a measured call, not a default.

---

## 5. CSS plan

Everything lives in `app/globals.css`, in one block named for the surface. It is written **mobile first** (the site convention: `min-width: 768px` appears 14 times, `max-width` rarely). There are no responsive or state utilities in the JSX (lint-space check 6, lint-interaction check 8), and type comes from role utilities in the markup, as the prototype does.

### Tokens, by surface

| Surface | Declaration | Token or utility |
|---|---|---|
| Scrim | `::backdrop` background | **New `--scrim`**, authored per mode in the theme layer by `color-mix` (mix to author a token, never to apply one). Light: `--text-primary` at 46%, as prototyped. Dark: `--bg-sunken` at about 60%, so the page dims (ruled Q4); alpha measured and stated in phase 2. |
| Panel (768 up) | background, radius, shadow | `--bg-surface`, `--radius-s`, none |
| Panel | width; padding; gutter | `min(100%, var(--page-max-width))`; `--spacing-xl`, dropping to `--spacing-l` on short viewports; `column-gap: var(--spacing-xl)` |
| Panel | grid | `minmax(0, 7fr) minmax(0, 5fr)` |
| Stage | padding round the panel | `--spacing-xl` block, `--spacing-gutter` inline |
| Image frame | ground, radius, edge | `--bg-canvas`, `--radius-xs`, 1px `--border-subtle` |
| Image frame, `fit: whole` | no ground, no edge; image centred, contain | (none) |
| Thumbnail row | columns; gap; space above | 7 (768 up), 5 (sheet); `--spacing-s`; `--spacing-m` |
| Active bar | 2px `--text-primary`, offset below the thumb | `--spacing-xs` |
| Title, part 1 | `text-h1`, weight 600, `--flar: 100`, `text-wrap: balance` | `text-h1`; colour `--text-primary` (rung colour) |
| Title, part 2 (byline) | size; colour; space above | `--type-standfirst`; `--text-secondary`; `--spacing-2xs` |
| Role | | `text-caption`, `--text-muted`, `--spacing-2xs` above |
| Statement | | `text-h3`, `--text-primary`, `--spacing-xl` above, `--spacing-m` below |
| Paragraph | | `text-small`, `--text-secondary` |
| Previous and next | | `text-caption`, `--text-muted`, hover `--text-primary`; pinned with `margin-top: auto`; `space-between` |
| Close button | rest; hover; press | **The `.theme-toggle` precedent (ruled Q5):** `font-size: var(--type-16)`, weight 600, `--icon-stroke: 1.95`, 44px box, 1px transparent border, `--radius-s`, `--text-secondary`. Hover: `--text-primary` plus `--border-strong`. Press: `translateY(1px)`. Transitions at `--duration-control`. |
| Sheet (under 768) | ground; work column inset; text inset | `--bg-surface` full screen; `--spacing-2xl` top, `--spacing-gutter` sides; `--spacing-l` top, `--spacing-gutter` sides |
| Sheet close button | fixed position | The same `.theme-toggle` states, on mobile too (ruled Q5): no resting shadow. Because it is fixed and floats over the scrolling sheet, it sits on the sheet's own `--bg-surface` ground, as the prototype's sheet did, so the icon stays legible over images. That is the surface the sheet already uses, not a new treatment. |
| Sheet bottom bar | sticky; ground; padding | `--bg-surface`; `--spacing-s`, with `calc(var(--spacing-s) + env(safe-area-inset-bottom))` at the bottom |
| Focus | every control | **Inherited** from the global `:focus-visible` halo (`globals.css:699-705`, `--focus-ring` plus `--focus-glow`). Nothing new is authored. |
| Durations and easing | | `--duration-control` for every hover, colour and opacity change, and the cross-fade; `--duration-card` for the panel entrance and the bar slide (brief; see the motion note in section 7); `--ease-out-soft` throughout |

### Icons

The icons are lucide `X`, `ArrowLeft` and `ArrowRight` with the `.icon` class (1em), per lint-interaction checks 4 to 6. There is no hand-drawn `<svg>`; the prototype's inline SVGs are replaced.
- **Close button:** no adjacent text, so it declares its type context the way `.theme-toggle` does: `font-size: var(--type-16); font-weight: 600; --icon-stroke: 1.95`.
- **Arrows:** beside caption text, so the stroke follows the label's weight under interaction §2.1 (1.43 at 400, 1.95 at 600). The prototype sets the nav at 600 in its base rule and does not override it. Phase 2 measures the shipped weight and picks the matching stroke.

### State rules lint-interaction needs

- Every new `:hover` gets an `:active` authored after it, the 1px sink (check 7, §5). This applies to the close button and the thumbnails. The shelf row adds no hover rule of its own (ruled Q3): its title link takes the existing `.quiet-link` states, already allowlisted as a text link.
- Text links (previous and next) are exempt, per §5.
- **Thumbnail hover (ruled Q6):** the 2px bar shows under a hovered thumb in `--border-strong`. The active thumb keeps `--text-primary`. The press sinks 1px. The prototype had no hover, because layout D's rule outranked the base hover.

### Raw values, each with its reason

| Value | Where | Reason |
|---|---|---|
| `44px` min-height and min-width | close button, previous and next, thumbnails | The site's touch-target constant, already a literal at `globals.css:1264-1265` and in three other places. There is no token, and none is invented. |
| `2px` | active bar height | Same as the 2px hover underline (interaction §4). It is not spacing, so lint:space does not govern it. |
| `6 / 5` | image frame and thumbnail `aspect-ratio` | The locked frame proportion: 588x490. |
| `7fr / 5fr`, `repeat(7, …)`, `repeat(5, …)` | grids | Layout proportions from the locked design. |
| `100dvh`, `100vw` | dialog and sheet size | Viewport units, with no token equivalent. |
| `848px` max-height | short-viewport query | The prototype's `53rem`, written in px to match the site's px queries. **It is the first height query on the site**, and is logged. |
| `translateY(12px) scale(0.985)` | entrance keyframe | From the prototype. A transform, not spacing. The nearest precedent is `.reveal-list`'s 8px. |
| `1` | close button `z-index` inside the panel | The site uses literal z-index values. There is no scale. |
| `0.01ms` | none authored | The blanket reduce rule already covers it. |

### Things to avoid

- **No raw colour anywhere downstream.** The prototype's `oklch(... / .22)` panel shadow belongs to layout A and is not ported.
- **No `font-variation-settings`,** no axis in any transition, and no `font-stretch`.
- **No `backdrop-filter` on the scrim** (glassmorphism is banned in PRODUCT.md).

### Motion

- **Entrance:** `@keyframes` with the animation inside `@media (prefers-reduced-motion: no-preference)` (lint-motion guard A).
- **Cross-fade and bar slide:** both transitions sit inside the same no-preference block, which fixes the prototype's unguarded bar transition.
- **Reduced motion:** the bar is static and visible, and the swap is instant. That is a still alternative, not a missing state (PRODUCT.md).

### Flare

- The dialog title gets a component selector, `.client-work__name`, so not-found's `text-h1` is not flared.
- It takes `--flar: 100` and is added to RUNGS as `voice: 'flared'`, `ladder: false`, the T6 precedent.
- **Measured size:** 51.2px at 1440, rising to 56px only above about 1690. It sits under the 52px cut by exactly the margin of `.about-hero__pov` (51.2px at 1440, flared by ruling). That is the precedent that admits it, and it is named in the RUNGS comment.

### Alignment

- `text-box: trim-start cap alphabetic` on the h2 puts the cap top on the image top, as the prototype does.
- It is unsupported in Firefox, where the title sits a few px low. Alignment is verified in Chromium and WebKit. Logged.

### Image edge over an opaque screenshot

- The house inset shadow does not paint over an `<img>` (`docs/unspecified-surfaces.md` fine art entry, point 2).
- The frame therefore uses the working pattern: an `::after` overlay with `inset: 0`, `--radius-xs` and `box-shadow: inset 0 0 0 1px var(--border-subtle)`, as on `.bento-theme__media::after` (`globals.css:3191`).
- This is what keeps the white screenshots separated from `--bg-surface` in light mode. Checked by eye at 3x in phase 2.

### Shelf row as a link

Ruled Q3: the standard link hover and focus ring only, with no new border or card treatment. The shelf is redesigned in a later pass, so the markup stays easy to restyle.
- **Markup barely moves.** `<article class="quick-hit …">` keeps its classes and its wordmark, h2 and industry. Only the h2's text becomes a link.
- **The link is `.quiet-link`.** No underline at rest. On hover the title takes the global `a:hover` underline (2px, `--link-hover`). `.quiet-link:hover` is already allowlisted in lint-interaction check 7 as a text link, so **no new hover selector and no `.quick-hit` CSS change.**
- **The hit area is the whole row.** It is stretched the way `case-study-card.tsx:73` stretches the card title: `after:absolute after:inset-0 after:content-['']` on the link, plus `relative` on the article. The accessible name is the project name alone.
- **Focus** is the global `:focus-visible` halo on the link, untouched.
- **The only shelf CSS change is a comment rename.** The brand border and fill stay exactly as they are.

---

## 6. Image pipeline

**Convention followed:** offline-encoded AVIF plus WebP in a `<picture>`, as `friction-moment.tsx` and the card covers do. Not next/image: the bytes are measured before deploy, which is the reasoning recorded at `scripts/build-fine-art.mjs:15-18`.

`scripts/build-client-work.mjs [masters-dir]`:

1. **Image list.** Read from `app/data/template-b.ts`. Node 24.14 strips TypeScript types natively, and the data file has no runtime imports.
   - **Fallback, if that import fails in phase 2:** the script reads the stems from a JSON sidecar, and the test asserts the sidecar and `template-b.ts` agree.
2. **Masters.** Default directory `docs/previews/template-b/_scratch/crops-v5/`, which is untracked, like the fine art masters. Source is `<id>.png`, or `<id>.webp` if no PNG exists. All twelve have a PNG.
3. **Widths.** A thumbnail rung at **144w** (a thumb is 70px wide at 1440 and 56px at 390). A 1x rung at **588w**. A 2x rung at **min(1176, native width)**.
   - **No upscaling ever.** A rung wider than the master is skipped, and its `srcSet` descriptor states the real width.
   - `khov-1`, a 320x574 phone screen shown whole, gets 144w and 320w only.
   - Resize is `fit: 'inside'`, lanczos3, sRGB.
4. **Encoding.** The fine art tiers to start: AVIF q68 and WebP q88, effort 6.
   - These are UI screenshots with small text, not paintings, so phase 2 reports bytes per file and checks small type at 2x.
   - If text smears, the WebP rung moves to a higher quality and the numbers are reported.
5. **Output.**
   - Writes `public/client-work/<slug>/<id>-<w>.{avif,webp}` and regenerates `app/data/client-work-images.json` (master md5, native size, every file and its size).
   - Prints a **below-2x table** of the masters that need the Firefly pass.
6. **The swap is one re-run.** When Paul has the upscales, run `npm run build:client-work -- <upscale-dir>`. The new md5 and widths show up in the manifest diff, and nothing else is edited.

Rendering: one `<picture>` per slide, with AVIF and WebP `<source>`s and a WebP `<img>` carrying `width` and `height` from the manifest, `decoding="async"`, and `object-fit: cover` (or `contain` for `fit: whole`) with `object-position: center top` as in the prototype.
- **Slide 1 loads eagerly; slides 2 and 3 are `loading="lazy"`,** since they are off-axis in the track.
- **`sizes`:** `(min-width: 768px) 588px, calc(100vw - 2 * var(--spacing-gutter))`. Thumbnails use `sizes="72px"` on the same files, which picks the 144w rung.

Source density against a 1176x980 frame at 2x (from the crops survey):

| id | native | density | id | native | density |
|---|---|---|---|---|---|
| lg-1 | 1151x959 | 1.96x | bbc-confusing | 840x700 | 1.43x |
| lg-2 | 1152x960 | 1.96x | bbc-pillars | 860x717 | 1.46x |
| lg-3 | 1160x967 | 1.97x | bbc-3 | 1013x844 | 1.72x |
| arc-1 | 905x754 | 1.54x | khov-1 (whole) | 320x574 | 1.17x |
| arc-2 | 840x700 | 1.43x | khov-2 | 1174x978 | 2.00x |
| arc-3 | 900x750 | 1.53x | khov-3 | 1284x1070 | 2.18x |

Eight of the twelve are clearly below 2x, and khov-1 most of all. They ship at native width now, and the Firefly pass replaces them.

**Noindex is unaffected.** The `X-Robots-Tag` rule in `next.config.mjs:12-17` matches `/:path*`, which covers `public/`.

---

## 7. The `docs/unspecified-surfaces.md` entry (exact text, written before the component)

This is inserted at the top of "The open set". The italic arrivals ledger gains one sentence: "**Client work dialog** joined on 11 Oct 2026, the site's first modal surface, logged before its component existed."

> **The client work dialog (Template B).** Joined 11 Oct 2026 from the Template B build brief (`docs/cc-prompt-template-b-build.md`), and logged before the component existed rather than after. The four client pieces on the home page open in a native `<dialog>` over the page, the site's first modal surface. No locked spec governs a dialog, so each of the following borrows the nearest token, and each is an input to the design system pass rather than a settled answer:
>
> 1. **The title has no rung.** The project name borrows `text-h1` (36 to 56px; CLAUDE.md scopes it to case-study and section page titles) at weight 600, and is flared. It measures 51.2px at 1440, under the 52px cut by the same margin as `.about-hero__pov`, which is flared by ruling, and that is the precedent that admits it. It sits in RUNGS off the ladder, as the turn (T6) does. What a spec would need to say: whether a dialog title is a section page title, or a rung of its own.
> 2. **The byline and the statement nearly collide.** The byline ("for Lionsgate") is `--type-standfirst` and the statement below it is `text-h3`. Measured from the clamps: 21 against 22px at 390, 23.5 against 24.4 at 1280, 24 against 25.2 at 1440, a ratio of 1.04 to 1.05 where the ladder steps at 1.15. Colour (secondary against primary) and the role line between them do the separating. What a spec would need to say: whether a near-miss is allowed when colour carries the step, or which of the two moves.
> 3. **The surface, the scrim and the width.** The panel is `--bg-surface` at `--radius-s`, with no shadow. `--radius-s` is the compact-control radius; `.milestone` and the hero callout are the precedent for using it on a panel. The width is `--page-max-width`, the page's own measure, so the dialog reads as a page laid over a page. The scrim had no token: `--scrim` is authored per mode in the theme layer. The prototype mixed `--text-primary` at 46% in both modes, which darkened the page in light mode and lifted it to grey in dark mode (measured `oklch(0.945 0.012 78 / 0.46)`). Paul ruled that it dims in both modes (11 Oct 2026), so dark mixes `--bg-sunken` instead. What a spec would need to say: a scrim role in colour v2 with a stated effect in each mode, and whether a modal panel takes the card's radius or a control's.
> 4. **Entrance motion.** Interaction v1 leaves entrance unspecified. The panel's fade and rise takes `--duration-card` (written for lift, shadow and media scale; Paul ruled it over `--duration-reveal`, 11 Oct 2026) and the content cross-fade waits `--duration-control`. What a spec would need to say: an entrance category, which the reveal containers also lack.
> 5. **Sheet chrome and two firsts.** The prototype gave the close button a `--bg-sunken` hover and, below 768px, a resting `--shadow-hover`. Paul ruled that it follows `.theme-toggle` instead, on mobile too (11 Oct 2026): colour plus `--border-strong` on hover, no resting shadow. On mobile it floats over the scrolling sheet on the sheet's own `--bg-surface` ground. The short-viewport padding drop is the site's first height query (848px). `text-box: trim-start cap alphabetic` sets the title's cap top on the image top; no spec mentions it, and Firefox ignores it. What a spec would need to say: whether a floating control needs a ground, and whether height queries are part of the breakpoint set.

---

## 8. Gates and checks (phase 2)

**Workflow:**
- Branch `feature/template-b-client-work` from a freshly fetched `main` (memory: another environment pushes here).
- Imperative commit messages, split by concern. Each comment or doc a commit falsifies is fixed in that commit.
- No push or merge without Paul. The untracked `docs/*`, `artifacts/` and `Claude outputs/` files are never staged. Staging is done path by path, never with `git add -A`.

**Order:**
1. `unspecified-surfaces.md` entry.
2. Data and image pipeline, with generated files.
3. Shelf heading, links and the non-interactive reconciliation.
4. Dialog, CSS, RUNGS and assert-bands.
5. CLAUDE.md and colour-doc wording, folded into whichever commit falsifies them.

| Gate | How it is run | What counts |
|---|---|---|
| tsc | `npx tsc --noEmit` | 0 errors |
| eslint | `npx eslint`, whole tree, never narrowed | 0 errors, warnings listed |
| build | `npm run build` (type, space, color, next build, works, interaction, prose, motion) | Green. Each linter's summary line is quoted, plus First Load JS for `/` before and after |
| tests | `npm test -- --run` | All green, `noindex.test.mjs` named explicitly. The number is quoted |
| detector | The Impeccable plugin's detector script against the dialog's markup and CSS | Findings listed |
| bands | `next start`, then `node scripts/assert-bands.mjs` | The new title computes `--flar: 100` on `/#lionsgate`; nothing leaks into the paragraph |
| Impeccable | `/impeccable critique`, then `/impeccable polish` on the home page with the dialog (CLAUDE.md workflow) | Findings reported before anything is called done |

Rules on running:
- Never build while dev runs.
- Never two `next dev` processes.
- Screenshots come from `next start`.

**Visual checks** (Playwright against `next start`, screenshots to the scratchpad, compared side by side with the locked prototype):
- All four pieces at **1440x900** and **1280x800**, light. BBC at **1440x900**, dark.
- All four at **390x844** by device emulation (a window resize cannot reach 390), light and dark.
- **Reported measurements:**
  - image width and height (target 588x490 at both desktop sizes);
  - whether the panel scrolls (target: no);
  - image top against title cap top;
  - nav baseline against the thumbnail row bottom;
  - the white screenshots' edge in light mode, by eye at 3x;
  - computed scrim in both modes.

**Keyboard and behaviour** (scripted with Playwright, then by hand once in Safari):
- Tab to a row, then Enter: the dialog opens and focus is inside.
- Thumbnails and Left/Right on the track switch images. The live region text is read back.
- Previous and next switch pieces and wrap around. The hash updates by `replaceState`.
- Esc closes, and focus returns to the opening row.
- A backdrop click closes.
- `/#bbc` loaded cold opens BBC. Back after an open closes the dialog and the page does not reload: a `window` marker survives.
- The body does not scroll while open.
- Every target measures at least 44px.
- Repeated with reduced motion emulated: no animation, instant swap.
- **Network check:** the home page loads with zero requests to `/client-work/`, and opening a piece requests only that piece's files.

**Contrast:** text on `--bg-surface` in both modes, read from the colour v2 measured table, with any pairing it lacks computed and stated.

**Deployed behaviour:** none of this is claimed for the deploy. Vercel runs only `npm run build`.

---

## 9. Risks

1. **Router re-render on hash changes.** The patched `replaceState` and `pushState` dispatch a Next `ACTION_RESTORE`. The tree is identical, so the dialog should not remount, but this is unverified. The Back and next checks in section 8 are the test. If it remounts, the fallback is to keep the open piece in a ref outside React state. The hash approach does not change.
2. **assert-bands needs the dialog open.** Hence the `/#lionsgate` route. If the script's route loop does not wait for the dialog, it gets a short wait for `dialog[open]`.
3. **Below-2x sources.** Eight of twelve will look soft on a 2x screen until the Firefly pass. This is known and accepted in the brief, and the pipeline makes the swap one command.
4. **The dark scrim.** Ruled to dim (Q4). The alpha is a measured choice in phase 2, and the screenshot pair goes in the report.
5. **`env(safe-area-inset-bottom)` is 0 without `viewport-fit=cover`.** `app/layout.tsx` sets no viewport export, so the sticky bar's safe-area padding does nothing on iPhone until that is set. Ruled Q7: no change. The bar ships with spacing-only padding on iPhone.
6. **`text-box` support.** Firefox puts the title a few px below the image top. This is accepted as progressive enhancement and logged.
7. **The type-stripping import in the build script** (section 6, step 1) has a JSON fallback.
8. **Thumbnails have no edge.** A white thumbnail on `--bg-surface` may read faint in light mode. This is checked by eye. The brief puts the 1px edge on the image frame, not the thumbs, so no edge is added without a ruling. Hover is ruled (Q6).
9. **Shelf hover is the title underline only** (ruled Q3). The stretched link covers the wordmark and the industry, so that text cannot be selected with a mouse. This is the same trade the case card makes.

---

## 10. Out of scope, stated so it is not assumed

- No change to the `--qh-*` colours, and no brand colour inside the dialog. That would widen the sanctioned exception (`docs/color-system.md`).
- No edits to any locked spec. The gaps go to `unspecified-surfaces.md` for Paul's design system pass.
- No new build gate. The image check is a vitest test.
- No copy edits, and no agency name anywhere.

---

## 11. Questions for Paul (all answered 11 Oct 2026; rulings in the table at the top)

- **Q1. Which prototype is locked?** The on-disk `template-b-dialog-locked.html` md5 is `9ba936b1…`, not the brief's `43e1f465…`, and it still embeds the old BBC wireframes (`bbc-1`, `bbc-2`).
  - **Default:** brief and `phone-4-bbc-locked.png` for images and copy (`bbc-confusing`, `bbc-pillars`); on-disk file for layout and CSS.
  - If a newer locked file exists, I'd like it in place before phase 2.
- **Q2. arc-1 alt text.** The brief says "honor-gift checkboxes"; the prototype says "tribute checkboxes".
  - **Default:** the brief.
- **Q3. Shelf row hover and press.** The prototype adds a border transition with no hover rule, so the state is undefined.
  - **Recommended:** the title takes the site's 2px `--link-hover` underline on hover, the brand border is unchanged, and the press sinks 1px. This is the case card's "title underline plus press" without the border change, which would erase the brand colour.
  - **Alternative:** the card's own `--border-strong` hover.
- **Q4. Dark-mode scrim.** The prototype's `--text-primary` at 46% lifts the dark page to grey (seen in the dark render at 1440).
  - **Recommended:** keep the light scrim as prototyped. In dark, mix the darkest surface (`--bg-sunken`) at about 60%, so the page dims in both modes.
  - Final alpha to be measured in phase 2.
- **Q5. Two tokens used against their stated roles.**
  - **(a)** `--bg-sunken` (inset surfaces) as the close button's hover. The site's icon-button precedent, `.theme-toggle`, hovers as colour plus `--border-strong`.
  - **(b)** `--shadow-hover` at rest on the mobile close button, against H1b.
  - **Default:** build as briefed, and log both (they are in the entry above).
  - Say if you would rather the close button follow `.theme-toggle`.
- **Q6. Thumbnail hover.** R5 wants rest, hover and pressed. In the prototype nothing changes on hover.
  - **Recommended:** on hover the 2px bar appears under the thumb in `--border-strong`. The active thumb keeps `--text-primary`. The press sinks 1px.
- **Q7. `viewport-fit=cover`.** Should I add it site-wide so the mobile bar's safe-area padding works on iPhone? It changes the edge behaviour of every page in landscape.
  - **Default:** no. The bar works without it, with no safe-area padding.
- **Q8. Entrance token.** The brief names `--duration-card` (300ms) for the panel entrance. The interaction spec says entrance motion is unspecified, and the one tokenised entrance is `--duration-reveal` (560ms).
  - **Default:** the brief's `--duration-card`, logged.
