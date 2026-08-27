# Delivery Promise §01 — quote size and source weight

Two changes, both in `.testimony-pair`, both from the craft review. **Scope is
local: `.testimony-pair*` is used by one study and nothing else references it.**
Two systems-level facts fall out anyway and are recorded at the bottom.

**Stop at the diff. Paul commits, then push.**

---

## 1. The quote goes to 18px

```css
.testimony-pair__quote {
  /* 18px, the reading rung and the same size as body prose in .case-study-prose.
     Was 17px, which was neither: 18/17 is 1.06x against the type system's 1.15x
     adjacency rule, it sits on no rung, and after this change 17px renders
     nowhere on any live route. The module's whole argument is that quoted matter
     is body content and takes body treatment; 17px contradicted the argument it
     was implementing. */
  font-size: 1.125rem;
}
```

**Where the 17px came from, so this is not re-litigated.** I set it so the quote
would sit a step below the 18px/600 lead, after judging 18/18 flat in a
prototype. That judgment does not survive: it was made against a 16px stand-in
for a 26px lede and no real `h2`, so it was a hierarchy judgment against a
truncated hierarchy. Re-rendered in a correct context
(`docs/previews/s01-quote-size.html`), 18px reads better and the lead still
separates cleanly — 18/600 against 18/400 is **38.5% ink separation**, the same
the site uses between a bolded lead-in and its sentence.

**The 68-character lead ceiling is untouched.** `__tests__/testimony-leads.test.mjs`
derives from the lead at 18px/600 in that column, and the lead does not move.
Confirm the test still passes and say so.

**One thing to rule rather than inherit.** The reading rung is specified as
18px / 64ch / **1.65**. The quote will be at 18px but `line-height: 1.5`, in a
column far narrower than 64ch. Tighter leading at a narrower measure is the
conventional answer, so 1.5 is probably right — but it is currently an accident
of the old 17px setting, not a decision. **Measure both at 1100 and 390, pick
one, and write the reason into the CSS.** If you keep 1.5, say why in the
comment.

---

## 2. The source line goes to weight 500

```css
.testimony-pair__source {
  /* 500, matching .pull-quote cite's weight and colour. The uppercase and the
     0.09em stay, deliberately: `cite` sits under a 28px quote, a 2.0x size drop
     that separates it on size alone. This sits under an 18px quote, a 1.29x
     drop, so the case change is what carries the differentiation. Copying
     `cite` exactly was prototyped and rendered worse — the source blurred into
     the quote above it and stopped marking where the testimony ends. */
  font-weight: 500;
}
```

At 600 the labels read as a second bold line and compete with the leads for the
same attention. Contrast is unaffected — the token does not change.

---

## 3. Verification

Gates in order, every number: `npm test` → `npm run build` → `lint:prose`, plus
`cover-art` and `testimony-leads` named explicitly. **`rm -rf .next` first** —
this round is entirely CSS, which is the case Turbopack's stale-CSS bug gets
wrong, and it has bitten three times this session.

At a real 390px and 1440, both modes:

- Quote computes to **18px**, source to **500**. Read `getComputedStyle`, do not
  infer from the stylesheet
- **Re-measure both lead tops and line counts.** The leads do not change, but the
  quotes below them grow, and measured beats assumed. They were 1185/1185, two
  lines each
- Cell heights: the left quote gains a line. Confirm `align-content: start` still
  holds the two leads level and nothing stretches
- Min font 14px, no horizontal overflow, zero console errors

---

## 4. Two systems facts, for the backlog — do not act on them here

**17px disappears from every live route.** The only other use is
`.slot-small4 .take-thought` (`globals.css:1409`), which the systems backlog
records as rendering on no route. Worth noting in `claude/systems-backlog.md`
that this closes a small ladder gap rather than opening one.

**Two selectors now do the citation job.** `.pull-quote cite` and
`.testimony-pair__source` will agree on size, weight and colour, and differ only
on case and tracking, for the stated size-drop reason. Two is not yet a system
and consolidating now would be premature. **The trigger to record: if a third
citation surface appears, it becomes a shared class or token rather than a third
selector.** This is the same shape as the `problemFraming` two-sources item
already in the backlog.

---

## 5. Do NOT

- Change the ink on the quotes, the leads, or anything else. The review confirmed
  `--text-primary` against measurement and against every other quotation on the
  site
- Change the lead's size or weight — it is what the 68-character test is derived
  from
- Change either quote's text
- Touch section 02, which still has not been read

## Done means

1. Quote computes 18px, source computes 500, both measured not inferred
2. The line-height question ruled, with the reason in the CSS
3. `testimony-leads` still green
4. Every gate green, every number reported, both modes, a real 390px viewport
5. Diff unstaged, Paul commits, then push and report the hash and preview URL
