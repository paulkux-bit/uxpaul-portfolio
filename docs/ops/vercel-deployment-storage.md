# Vercel Deployment Storage — measurement report

Measured 30 Sep 2026. Read-only: nothing was modified, converted, committed or
pushed during the measurement pass. Retention and old-deployment deletion are
being handled by hand in the Vercel dashboard and are **not** covered here.

## Why this was taken

The Vercel Hobby team hit 75% of the 10 GB Deployment Storage limit (≈7.5 GB).
Storage = per-deployment payload × retained deployments, and both sides needed
a number before anything was changed.

## Verdict in one line

**104.32 MB of PNG in `public/case-studies/` is the storage.** It is 93% of
everything the repo ships, it is re-uploaded on every one of the 77 retained
deployments, and 115 files carry it. Nothing else on either side of the
multiplication is close.

---

## 1. Per-deployment payload

Deployments are all git-triggered (every one of the 77 carries a
`githubCommitRef`), so Vercel clones from GitHub and **only tracked files
upload**. Local untracked bulk — `Claude outputs/` 39 MB, `docs/_ref/`,
`artifacts/` 6.9 MB, `measurements/` 9.7 MB, `.venv-fonttools/` 24 MB,
`build-fonts/`, `out/claude-scratch` 6.2 MB — never leaves the machine. The
1.1 GB working tree is not what is being stored.

| Tracked, per deployment | Files | Bytes |
|---|---:|---:|
| `public/` | 130 | **111.73 MB** |
| `docs/` | 69 | 1.61 MB |
| `components/` | 102 | 1.59 MB |
| `app/` | 25 | 0.52 MB |
| `package-lock.json` | 1 | 0.36 MB |
| `scripts/` | 45 | 0.36 MB |
| everything else | ~26 | 0.16 MB |
| **tracked source total** | **398** | **≈112 MB** |
| build output (stale `.next`, excl. 7.2 MB local cache) | — | ≈18 MB |

`public/` breakdown:

| Path | Size |
|---|---:|
| `public/case-studies/us-navy-dagr` | 39 MB |
| `public/case-studies/urbn-delivery-promise` | 19 MB |
| `public/case-studies/us-navy-fdt-e` | 17 MB |
| `public/case-studies/uscg-bard` | 16 MB |
| `public/case-studies/nuuly` | 16 MB |
| `public/case-studies/covers` | 744 KB |
| `public/sandbox` | 1.2 MB |
| `paul-portrait-square.jpg` + résumé PDF | 408 KB |

Format census of tracked `public/`:

| Format | Files | Bytes |
|---|---:|---:|
| **png** | **115** | **104.32 MB** |
| jpg | 3 | 0.74 MB |
| webm | 2 | 0.57 MB |
| mp4 | 2 | 0.53 MB |
| webp | 7 | 0.31 MB |
| pdf | 1 | 0.09 MB |

**44 PNGs are over 500 KB, totalling 88.51 MB.** All are 8-bit-per-channel
RGB/RGBA screenshots — no palette compression, no interlacing. Ten largest:

| MB | File | Pixels |
|---:|---|---|
| 8.38 | `us-navy-dagr/05-08-radius.png` | 3704×2315 |
| 6.38 | `us-navy-dagr/04-06-five-shapes.png` | 3704×2315 |
| 6.15 | `us-navy-fdt-e/intel-example--wide.png` | 2539×1587 |
| 4.35 | `us-navy-dagr/problem-briefing--feature.png` | 2320×1473 |
| 4.09 | `nuuly/range-variety--feature.png` | 2320×1450 |
| 4.07 | `us-navy-dagr/04-01-quickview.png` | — |
| 3.88 | `us-navy-fdt-e/gate-walk/establish--band.png` | — |
| 3.66 | `us-navy-fdt-e/problem-dataflood--feature.png` | — |
| 3.57 | `urbn-delivery-promise/solution/ad--post.png` | — |
| 3.42 | `urbn-delivery-promise/hero-pdp.png` | 2500×3125 |

Width census: **24 PNGs are ≥3000px wide**, 51 are 2000–2999, 22 are
1500–1999, 18 are under 1500.

That first bucket is oversized against the project's own documented floor.
`components/case-studies/us-navy-dagr/ingest-manifest.json` `$slotDoc` states
the retina floors explicitly: *"band and feature need 2 × 1088 = 2176, standard
needs 2 × 536 = 1072."* `05-08-radius.png` is a band at 3704px — **1.7× past
its own stated floor**, which is 2.9× the pixel area.

### Nothing else flagged

Checked for and did **not** find: raw/uncropped screenshots (`_raw/` is
gitignored), crop working files (`.proto-tmp/` gitignored), duplicate sizes of
the same image, PSD/Figma exports, test fixtures in `public/`. `docs/` is
96 MB on disk but only **1.61 MB tracked**, so a `.vercelignore` for it would
save ~1.6 MB per deployment — noise. The 1.2 MB `public/sandbox/home-video`
(mp4 + webm) does ship and is review scaffolding, but it is 1% of the problem.

Source maps: 82 `.map` files, 7.18 MB, in the stale `.next` — all under
`.next/server`, so they land in the function bundle, not the client. Real but
second-order, and the number needs re-taking from a clean build.

---

## 2. Deployment volume

- **`.vercelignore`: ABSENT.**
- **`vercel.json` / `vercel.ts`: ABSENT.** No `git.deploymentEnabled`, so
  every push to every branch deploys.
- **77 retained deployments**, all `READY`: **63 production, 14 preview.**
  Oldest 31 Aug 2026, newest 28 Sep 2026 — a 28-day window. A second
  paginated call confirmed nothing older is retained.
- 7.5 GB ÷ 77 ≈ **97 MB per deployment**, which lands squarely on the
  measured ~112 MB tracked payload (Vercel dedupes identical blobs across
  deployments, so the two should not be expected to match exactly).

**Commit cadence is the multiplier.** 190 commits on `main` in 30 days;
393 in 60; 470 in 90. 11 remote branches:

| Prefix | Branches | Commits, last 30d |
|---|---:|---:|
| `main` | 1 | 190 |
| `case-study/` | 3 | 83 |
| `(root-named)` | 5 | 138 (`fdte-copy-pass`) + 0 × 4 |
| `spike/` | 1 | 35 |
| `site/` | 1 | 26 |

Four branches are dormant (`type-system-v4`,
`qa-phase3-dead-fields-and-assets`, `nuuly-hero-and-figures`,
`commissioner-preview` — 0 commits in 30 days) yet still hold deployments.

**63 of the 77 deployments were production, from pushes to `main`.** Preview
branches are not the driver; push frequency on `main` is.

---

## 3. Measured savings — all four numbers taken by encoding all 115 files

Encoded in memory with `sharp` (already a devDependency), writing nothing:

| Treatment | Total | Saved |
|---|---:|---:|
| PNG as shipped | 104.32 MB | — |
| WebP **lossless** | 66.99 MB | 35.8% |
| WebP **q82** | 12.50 MB | **88.0%** |
| WebP **q82, width capped at 2176px** | 9.92 MB | **90.5%** |

These are byte measurements only. **No visual judgment has been made**, and
none of the four is a recommendation yet — see Deferred work.

## Ranked contributors

| # | Contributor | Measured | Savings per deployment if fixed |
|---|---|---|---|
| 1 | 115 source PNGs in `public/case-studies/` | 104.32 MB (93% of payload) | −91.8 MB (→ WebP q82), or −94.4 MB with the 2176px cap |
| 2 | 190 commits/30d on `main`, no deployment gate | 77 deployments in 28 days | 0 MB/deployment, but it is the ×77 — the only lever on *count* |
| 3 | 24 PNGs ≥3000px, past the manifest's own 2176px retina floor | ~2.6 MB beyond #1 | −2.6 MB on top of the conversion |

Combined, #1 + #3 would take the per-deployment payload from ~112 MB to
**~18 MB**, an **84% cut**.

At 190 commits/month a one-time retention cleanup is re-breached in roughly
four weeks. The payload is the durable fix; pruning buys time.

---

## Not measured

**A clean production build.** Deliberately not run. The ~18 MB build figure
above comes from the existing `.next` dated 28 Sep 19:20, one commit old
(`6ccd405`) — close, but not current. What a clean build would settle: the
real `.next` size and its static/server split, the current source-map total,
and whether `next build` writes image derivatives into the output.

---

## Deferred work

The image pass is **scheduled after the spacing tokens pass, on its own
branch.** Nothing below has been started.

### Correction to carry forward

An earlier draft of this report argued lossy q82 was "free" because
`next/image` is in the path and Vercel re-encodes to AVIF/WebP anyway. **That
reasoning is wrong.** A lossy source plus a lossy delivery re-encode is **two
lossy passes**, and generation loss compounds exactly where it is most visible
— dense UI text at 100%. The savings table stays as measured; the conclusion
does not follow from it. **Treat the format choice as a by-eye decision.**

### 1. Build a comparison page before converting anything

Standalone HTML, **not in the app**. Four or five worst-case images, chosen
for the densest text:

- `us-navy-dagr/05-08-radius.png`
- `us-navy-dagr/04-06-five-shapes.png`
- `us-navy-fdt-e/intel-example--wide.png`
- `us-navy-fdt-e/problem-dataflood--feature.png`
- one URBN image

Each shown at **100% crop on a text-heavy region**, in three treatments, all
width-capped at 2176px:

| | Treatment |
|---|---|
| a | lossless PNG |
| b | WebP lossless |
| c | WebP q82 |

**Each labelled with its file size.** Paul judges by eye before any format is
chosen.

### 2. Reference audit before any extension rename

- `components/case-study-card.tsx` contains the one raw `<img>` in the
  codebase — check it specifically.
- Sweep **every** manifest and MDX reference. Image paths live in
  `*-manifest.json` files (`ingest-manifest.json`, `analysis-manifest.json`,
  `walk-manifest.json`, …) as well as in MDX, and `npm run lint:assets`
  (`scripts/check-manifest-assets.mjs`) exists to check manifest/asset
  agreement — run it.

### 3. Habit change, not configuration

63 of 77 deployments were production pushes to `main`. **Batch pushes** rather
than gating preview branches. No `vercel.json` and no `.vercelignore` are
being added.

### 4. Re-measure first

**Re-measure Vercel Usage after the retention cleanup** lands, before starting
the image pass. The 75% / 7.5 GB figure above is pre-cleanup and will be stale.
