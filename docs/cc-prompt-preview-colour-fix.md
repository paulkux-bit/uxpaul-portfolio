# Commit the three preview colour corrections

Small job. **Three files are already modified in the working tree** — written
there directly, not by you. Verify, commit, push.

```
docs/previews/s01-quote-colour.html
docs/previews/s01-source-line.html
docs/previews/s01-spacing-skim.html
```

---

## What changed and why

Commit `1a72308` was supposed to correct all four §01 previews. It corrected
**one**. The specificity fix (`.prose p` → `.prose > p`) landed in all four; the
colour value was only changed in `s01-quote-size.html`. So these three shipped
still declaring:

```css
.prose > p:not(.section-lede) { color: var(--text-secondary) }
```

`globals.css:1556` says `.case-study-prose { color: var(--text-primary) }`. Body
prose in a case study is primary. The scaffolding was asserting a fact about the
page that is false — and in `s01-quote-colour.html` that inverted the very
comparison the file exists to make: a secondary quote *matched* the surrounding
prose in the preview, where on the real page it would be the only demoted
element.

All three now declare `--text-primary`, with a comment recording that the value
is copied from `globals.css`, not authored.

**Each file also gained a banner** noting the render is a record rather than
current: these were judged when the quote was 17px, and `c06ce50` set it to 18px.
`s01-source-line.html`'s banner also corrects a live figure in its own argument —
the size drop it cites as 17→14 (1.21×) is now 18→14 (1.29×), still far from
`.pull-quote cite`'s 2.0×, so its conclusion is unchanged.

---

## Verify before committing

**Do not take the above on trust — it is the second report about these files this
session and the first one was wrong.**

1. `grep -n "not(.section-lede)" docs/previews/s01-*.html` — all four should now
   read `--text-primary`. Report what you see.
2. Open each of the four and read the computed values against the real page.
   Every claim the scaffolding makes is checkable:

   | scaffolding claim | real page |
   | --- | --- |
   | `.section-lede` size and ink | rung 2, `--text-secondary` |
   | body prose size and ink | 18px, `--text-primary` |
   | `h2` size | rung 4 clamp |

   Report the measured values. **If any preview still disagrees with the page,
   say so and stop** rather than committing a fourth round of the same defect.
3. Confirm nothing outside `docs/previews/` is modified. This commit touches
   previews only.

No gates needed — these files render nothing on any route and `lint:color`'s
`EXTS` excludes `.html`. Say that explicitly rather than running a suite that
cannot see them.

---

## Commit message

```
Correct the body-prose colour in three section 01 previews

1a72308 claimed to correct all four previews and corrected one. The
specificity fix landed everywhere; the colour value did not. These three
kept declaring body prose --text-secondary, where globals.css:1556 sets
.case-study-prose to --text-primary.

The scaffolding was asserting a fact about the page that is false. In
s01-quote-colour.html it inverted the comparison the file exists to make:
a secondary quote matched the surrounding prose in the preview, where on
the real page it is the only demoted element. That file was used to judge
the quote ink, and it was judging against a page that does not exist.

Each file also gains a banner marking it a record rather than current --
all three were judged at a 17px quote, which c06ce50 moved to 18px.
s01-source-line.html's banner corrects a stale figure in its own argument:
the size drop it cites as 17 to 14 is now 18 to 14, still far from
.pull-quote cite's 2.0x, so the conclusion stands.

Fifth instance of a prototype correct in the wrong context, and the first
that survived being found once -- the fix was applied to the file being
edited and asserted for the rest.
```

Then **push**, and report the hash.

---

## Do NOT

- Change any preview's content, layout or conclusions. Only the body-prose colour
  declaration and the banners changed, and they are already written
- Re-render the three at an 18px quote. They are the record of a judgment made at
  17px; the banner is what reconciles that, not a rewrite
- Touch `s01-quote-size.html`, which was already correct
- Touch anything in `app/` or `components/`
- Touch section 02
