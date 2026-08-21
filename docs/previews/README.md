# Preview pages

Self-contained HTML for judging a typeface on a phone, without a dev server and
without a network. Open them from the filesystem; that is the whole point of
them.

## Why these are in `docs/` and not `public/`

**`public/` is not gated.** `app/sandbox/*` 404s on the production deployment —
a page guard, a layout guard and `__tests__/sandbox-guard.test.mjs` all enforce
it, after a route was found shipping 506 KB of scratch HTML that nobody outside
this repo was meant to read. None of that reaches `public/`. Next serves
everything under `public/` statically, at its own path, on the production domain,
with no guard available to stop it.

So a preview committed to `public/sandbox/` would be live at
`uxpaul.com/sandbox/commissioner-bench.html` for anyone who guessed the URL,
which is the exact failure the sandbox gate exists to prevent, reintroduced
through a directory the gate has no reach into.

`docs/` is not served by Next at all. The files are versioned, diffable and
openable locally, and unreachable from the deployed site.

## What is here

**`commissioner-bench.html`** — the specimen bench. Six toggles: face, display
voice, reading voice, body size, rung 0, signature. Both variable fonts are
embedded as data URIs rather than linked, because a linked stylesheet that fails
leaves you comparing Commissioner against Arial and blaming Bricolage. ~320 KB,
committed, works forever offline.

**`uxpaul-commissioner.html`** — the real home page in Commissioner, captured
from a local production build with its compiled stylesheet, both fonts and all
five cover images inlined. **Not committed**, and gitignored.

## Why the home preview is generated rather than committed

It is a **capture of a build**, not a source file. Committing it would put a 1 MB
generated snapshot in git forever, and it goes stale the moment `app/page.tsx`
changes — silently, because a stale capture still renders perfectly. That is the
same argument that makes `app/sandbox/home-commissioner/page.tsx` import the real
home page instead of copying it.

Regenerate it in one command:

```
node scripts/capture-commissioner-preview.mjs
```

The script builds, serves, captures, inlines and tears down. It refuses to run if
the capture would be wrong rather than producing a plausible-looking file, which
is the only useful behaviour for a tool whose output is judged by eye.
