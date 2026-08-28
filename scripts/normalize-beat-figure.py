#!/usr/bin/env python3
"""
Normalize a raster beat figure to the canonical box, equalize its pen weight,
then trace it to an SVG the repo can ship.

    python3 scripts/normalize-beat-figure.py blind.jpg phantom.jpg split.jpg

Writes <name>-norm.png (the traced source) and <name>.svg beside each input.


THE GEOMETRY SPEC, DERIVED FROM THE FOUR SHIPPED FIGURES
--------------------------------------------------------
Measured, not chosen. oku-02, oku-03, fdte-01 and nuuly-01 were rendered at
1px-per-viewBox-unit and their ink bounds read off the DOM.

  box           2750 x 1536   6 of the 9 shipped figures are exactly this
  ink height    80% of box height
                  shipped: oku-02 74.9, fdte-01 80.4, oku-03 82.7, nuuly-01 82.8
                  mean 80.2, sd 3.3
  ink width     UNCONSTRAINED
                  shipped range 36.5% to 94.7%. Width is whatever the
                  composition wants and normalizing it fights the compositions.
  horizontal    centred
  vertical      sits slightly LOW: top margin > bottom. Three of four shipped
                  do this (246/139, 190/76, 214/50); only fdte-01, a single
                  centred figure, is even at 150/151.
  min margin    75 units, from oku-03's tightest shipped edge (B76)

WHY HEIGHT AND NOT WIDTH. The figures render in a fixed 300 x 168 slot, stacked
down a column and read in sequence. What the eye compares beat to beat is how
tall the drawing is.

PRECEDENCE. Height fill is the TARGET; the margin floor is a HARD CONSTRAINT and
wins. A wide composition cannot satisfy both -- `split`, ink aspect 2.16, would
leave 45 units of side margin at 80% height. It fits to width instead and lands
at 78.2%, still inside the band the shipped figures occupy.


THE PEN SPEC
------------
  target        10 units, which is 1.09px at the 300px column cap
                  shipped: nuuly-01 4, fdte-01 8, oku-02 11, oku-03 12

Everything at 1.20px and up (BARD's pair) carries no stroke floor. fdte-01 at
0.87px and nuuly-01 at 0.44px both needed `vector-effect: non-scaling-stroke`
pinned at 0.75px. So the operative boundary sits between 0.87 and 1.20, and
hitting >= 10 units keeps a figure on the safe side of it with no CSS at all.

WHY THIS STEP EXISTS. Scaling to normalize ink extent also scales pen weight.
The first pass through this pipeline scaled three figures by 0.97 / 1.01 / 1.09
and produced pens of 7 / 10 / 9 units -- a 43% spread across a set that is
supposed to read as one set, introduced by the very step meant to make them
consistent. Dilating back to a common pen undoes it.


ORDER OF OPERATIONS, AND THE BUG THIS FIXES
-------------------------------------------
An earlier version ran the margin assert BEFORE dilating. Dilation then grew the
ink by one to two units per edge and silently invalidated the guarantee the
assert exists to make -- `split` shipped at 74 units against a floor of 75, with
the gate green. A guard that a later step can falsify is not a guard.

The order below is therefore fixed: place, dilate, THEN measure and assert.
"""

import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

BOX_W, BOX_H = 2750, 1536
TARGET_H_FILL = 0.80
MIN_MARGIN = 75
H_FILL_BAND = (0.745, 0.835)      # the four shipped figures, widened to the nearest 0.005
TARGET_PEN = 10                   # units; see THE PEN SPEC above
INK_DELTA = 60                    # a pixel is ink if it is this much darker than the page


def ink_mask(gray: np.ndarray) -> np.ndarray:
    """Background is a flat cream or white; ink is near-black. Threshold off the median."""
    return gray < (int(np.median(gray)) - INK_DELTA)


def bbox(mask: np.ndarray):
    ys, xs = np.where(mask)
    if not len(xs):
        raise ValueError("no ink found -- check INK_DELTA against this image's background")
    return xs.min(), ys.min(), xs.max(), ys.max()


def pen_width(mask: np.ndarray) -> int:
    """Median horizontal run of ink. Runs over 40 units are fills, not strokes."""
    from collections import Counter
    runs = Counter()
    for row in mask[::4]:
        run = 0
        for on in row:
            if on:
                run += 1
            elif run:
                if 1 <= run <= 40:
                    runs[run] += 1
                run = 0
    total = sum(runs.values())
    seen = 0
    for width in sorted(runs):
        seen += runs[width]
        if seen >= total / 2:
            return width
    raise ValueError("no measurable strokes")


def normalize(src: Path):
    name = src.stem
    gray = np.asarray(Image.open(src).convert("L"))
    x0, y0, x1, y1 = bbox(ink_mask(gray))
    iw, ih = x1 - x0 + 1, y1 - y0 + 1

    scale_h = (BOX_H * TARGET_H_FILL) / ih
    scale_w = (BOX_W - 2 * MIN_MARGIN) / iw
    scale = min(scale_h, scale_w)
    bound = "height" if scale_h <= scale_w else "width"
    nw, nh = round(iw * scale), round(ih * scale)

    crop = Image.open(src).convert("L").crop((x0, y0, x1 + 1, y1 + 1)).resize((nw, nh), Image.LANCZOS)

    # Centre horizontally; sit low vertically, matching the shipped convention.
    left = round((BOX_W - nw) / 2)
    top = round((BOX_H - nh) * 0.54)

    canvas = Image.new("L", (BOX_W, BOX_H), 255)
    canvas.paste(crop, (left, top))
    placed = ink_mask(np.asarray(canvas))

    # --- dilate to the common pen, BEFORE anything is asserted -------------
    pen_before = pen_width(placed)
    grow = TARGET_PEN - pen_before
    iterations = max(0, round(grow / 2))
    if iterations:
        placed = ndimage.binary_dilation(placed, structure=np.ones((3, 3)), iterations=iterations)
    pen_after = pen_width(placed)

    # --- now measure what actually exists, and assert against that ---------
    bx0, by0, bx1, by1 = bbox(placed)
    m_l, m_r = int(bx0), int(BOX_W - 1 - bx1)
    m_t, m_b = int(by0), int(BOX_H - 1 - by1)
    h_fill = (by1 - by0 + 1) / BOX_H

    assert min(m_l, m_r, m_t, m_b) >= MIN_MARGIN, (
        f"{name}: tightest margin {min(m_l, m_r, m_t, m_b)} < {MIN_MARGIN} "
        f"(L{m_l} R{m_r} T{m_t} B{m_b}) -- post-dilation, which is the measurement that counts"
    )
    assert H_FILL_BAND[0] <= h_fill <= H_FILL_BAND[1], (
        f"{name}: height fill {h_fill:.1%} outside the shipped band {H_FILL_BAND}"
    )
    assert pen_after >= TARGET_PEN - 1, (
        f"{name}: pen {pen_after}u is under target {TARGET_PEN}u "
        f"({pen_after * 300 / BOX_W:.2f}px at the cap) -- would need a stroke floor"
    )

    out_png = src.with_name(f"{name}-norm.png")
    Image.fromarray(np.where(placed, 0, 255).astype("uint8")).save(out_png)

    pbm = src.with_name(f".{name}.pbm")
    Image.fromarray(np.where(placed, 0, 255).astype("uint8")).save(pbm)
    raw = src.with_name(f".{name}.raw.svg")
    subprocess.run(
        ["potrace", str(pbm), "-s", "-o", str(raw),
         "--flat", "--turdsize", "8", "--alphamax", "1.0", "--opttolerance", "0.4"],
        check=True,
    )

    # Rewrite potrace's output to the repo contract: viewBox only on the root,
    # currentColor so the figure theme-flips, evenodd so compound paths hole out.
    import re
    s = raw.read_text()
    g = re.search(r"<g([^>]*)>(.*?)</g>", s, re.S)
    transform = re.search(r'transform="([^"]*)"', g.group(1)).group(1)
    paths = re.findall(r"<path[^>]*/>", g.group(2))
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {BOX_W} {BOX_H}">\n'
        f'  <g transform="{transform}" fill="currentColor" fill-rule="evenodd">\n'
        + "".join(re.sub(r'\s(fill|stroke)="[^"]*"', "", p) + "\n" for p in paths)
        + "  </g>\n</svg>\n"
    )
    src.with_suffix(".svg").write_text(svg)
    pbm.unlink()
    raw.unlink()

    return dict(name=name, bound=bound, scale=round(scale, 4),
                pen=f"{pen_before}->{pen_after}", px=round(pen_after * 300 / BOX_W, 2),
                fill_w=round((bx1 - bx0 + 1) / BOX_W * 100, 1), fill_h=round(h_fill * 100, 1),
                margins=f"{m_l}/{m_r}/{m_t}/{m_b}", paths=len(paths))


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    rows = [normalize(Path(a)) for a in sys.argv[1:]]
    hdr = f"{'':9}{'bound':>7}{'scale':>8}{'pen (u)':>10}{'px@cap':>8}{'fill W':>8}{'fill H':>8}{'paths':>7}   margins L/R/T/B"
    print(hdr)
    for r in rows:
        print(f"{r['name']:9}{r['bound']:>7}{r['scale']:>8}{r['pen']:>10}{r['px']:>8}"
              f"{r['fill_w']:>7}%{r['fill_h']:>7}%{r['paths']:>7}   {r['margins']}")
