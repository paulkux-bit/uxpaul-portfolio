#!/usr/bin/env bash
#
# Build the shipped Commissioner woff2.
#
# PINNED TOOLCHAIN: fontTools 4.60.2, brotli 1.2.0 (scripts/requirements-fonttools.txt).
# The output of this script is a COMMITTED BINARY. An unpinned subsetter produces a
# different woff2 from the same source, so the version is asserted below and a mismatch
# fails loudly rather than silently shipping different bytes.
#
# SOURCE is the designer's own v1.012 file, read from $HOME and never copied into the repo:
#   ~/Library/Fonts/Commissioner/Variable/Commissioner[FLAR,VOLM,wght].ttf
# It is NOT the v1.001 build Google Fonts serves, which is five years stale, carries slnt,
# and lacks tnum, case, ss01 and the arrow glyphs.
#
# WHAT IT DOES, and why each step is a ruling rather than a preference:
#   VOLM is instanced OUT      Phase 1 ruling 4c: the crescendo difference was not visible,
#                              so the axis does not ship. An axis you do not ship cannot
#                              fail silently, which is the one gap assertion 8b cannot see.
#   wght repositioned to 400   the source defaults to 100. next/font derives its fallback
#                              metrics from the DEFAULT instance, and anything that does not
#                              set weight explicitly sets hairline.
#   wght restricted 340-720    the locked tokens. Nothing on the site sits outside them.
#
#   ./scripts/build-commissioner-font.sh
#
set -euo pipefail
cd "$(dirname "$0")/.."

SRC="$HOME/Library/Fonts/Commissioner/Variable/Commissioner[FLAR,VOLM,wght].ttf"
OUT="app/_fonts/commissioner-latin.woff2"
VENV=".venv-fonttools"
WORK="build-fonts"

if [ ! -f "$SRC" ]; then
  echo "ERROR: source font not found:" >&2
  echo "  $SRC" >&2
  echo >&2
  echo "This is the designer's v1.012 variable font, not Google's v1.001. Get it from" >&2
  echo "  https://github.com/kosbarts/Commissioner  ->  fonts/variable/" >&2
  echo "and install it to ~/Library/Fonts/Commissioner/Variable/." >&2
  exit 1
fi

if [ ! -d "$VENV" ]; then
  echo "creating $VENV"
  python3 -m venv "$VENV"
  "$VENV/bin/pip" install --quiet --upgrade pip
  "$VENV/bin/pip" install --quiet -r scripts/requirements-fonttools.txt
fi

mkdir -p "$WORK" "$(dirname "$OUT")"
SRC="$SRC" OUT="$OUT" WORK="$WORK" "$VENV/bin/python" - <<'PYEOF'
import os, sys
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools import subset
import fontTools

PINNED = "4.60.2"
if fontTools.version != PINNED:
    sys.exit(
        f"ERROR: fontTools {fontTools.version} but this script is pinned to {PINNED}.\n"
        "The output is a committed binary; a different subsetter produces different bytes\n"
        "from the same source. Rebuild the venv from scripts/requirements-fonttools.txt,\n"
        "or re-pin deliberately and re-verify the output table."
    )

SRC, OUT, WORK = os.environ["SRC"], os.environ["OUT"], os.environ["WORK"]
TMP = os.path.join(WORK, "commissioner-instanced.ttf")

# Latin subset, matching what next/font/google emits for `subsets: ['latin']`.
UNI = ("U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,"
       "U+0329,U+2000-206F,U+20AC,U+2122,U+2190-2193,U+2212,U+2215,U+FEFF,U+FFFD")

f = TTFont(SRC)
src_axes = [a.axisTag for a in f["fvar"].axes]
f = instantiateVariableFont(f, {"VOLM": 0, "wght": (340, 400, 720)},
                            inplace=False, updateFontNames=True)
f.save(TMP)
subset.main([TMP, "--flavor=woff2", f"--unicodes={UNI}",
             "--layout-features=*", "--name-IDs=*", "--notdef-outline",
             f"--output-file={OUT}"])

# ── Verify the OUTPUT. Producing a file is not producing the right file. ──
out = TTFont(OUT)
fails = []

axes = {a.axisTag: (a.minValue, a.defaultValue, a.maxValue) for a in out["fvar"].axes}
if set(axes) != {"wght", "FLAR"}:
    fails.append(f"fvar axes are {sorted(axes)}, expected wght + FLAR (VOLM must be ABSENT, "
                 "not present-and-pinned - that is ruling 4c)")
if "wght" in axes and axes["wght"] != (340.0, 400.0, 720.0):
    fails.append(f"wght is {axes['wght']}, expected (340, 400, 720). The 400 default is the "
                 "point: the source defaults to 100 and sets hairline in anything that does "
                 "not set weight explicitly.")

usw = out["OS/2"].usWeightClass
if usw != 400:
    fails.append(f"OS/2.usWeightClass is {usw}, expected 400")

name1 = out["name"].getDebugName(1) or ""
if "thin" in name1.lower():
    fails.append(f"nameID 1 is {name1!r} - still reads Thin, so updateFontNames did not take")

feats = sorted({r.FeatureTag for r in out["GSUB"].table.FeatureList.FeatureRecord}) \
        if "GSUB" in out else []
for want in ("tnum", "case", "ss01"):
    if want not in feats:
        fails.append(f"GSUB lost {want!r} - --layout-features=* should keep it")

size = os.path.getsize(OUT)
kb = size / 1024
if kb > 70:
    fails.append(f"output is {kb:.1f} KB, above the 70 KB ceiling (target ~55.5 KB)")

BRICOLAGE_KB = 126.1
print()
print(f"  source axes      {', '.join(src_axes)}  (v1.012)")
print(f"  output axes      {', '.join(a.axisTag for a in out['fvar'].axes)}")
for tag, (lo, df, hi) in axes.items():
    print(f"    {tag:<14} {lo:g} .. {df:g} (default) .. {hi:g}")
print(f"  usWeightClass    {usw}")
print(f"  nameID 1         {name1}")
print(f"  GSUB features    {', '.join(feats)}")
print(f"  bytes            {size} ({kb:.1f} KB)")
print(f"  vs Bricolage     {BRICOLAGE_KB} KB  ->  {(1 - kb / BRICOLAGE_KB) * 100:.1f}% lighter")
print()

if fails:
    print("FAILED:")
    for x in fails:
        print("  - " + x)
    sys.exit(1)
print(f"OK  {OUT}")
PYEOF
