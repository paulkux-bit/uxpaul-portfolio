#!/usr/bin/env bash
# grep-pass.sh — the portable mechanical copy/structure pass for the ai-tell-audit skill.
# Run from the repo root:  bash grep-pass.sh  [path]
# Reports file:line hits and counts. Every hit is a candidate, not a verdict — judge against copy-tells.md.
# Uses ripgrep (rg) when available, falls back to grep. Excludes node_modules/.next/.git/out/dist.

set -uo pipefail
ROOT="${1:-.}"
CONTENT_GLOBS=(--glob '!**/node_modules/**' --glob '!**/.next/**' --glob '!**/.git/**' --glob '!**/out/**' --glob '!**/dist/**')
GREP_EXCLUDES=(--exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git --exclude-dir=out --exclude-dir=dist)

# THE TWO ENGINES DISAGREED ABOUT SCOPE AND THAT IS WHAT MADE THE PASS UNRUNNABLE.
# ripgrep honours .gitignore; the grep fallback honoured a hand-written list, so a
# repo-root run emitted 7,889 lines of which 2,228 came out of .venv-fonttools alone.
# Nobody reads 7,889 lines, so the pass stopped being run. The ignored directories are
# now DERIVED from git at run time rather than maintained by hand, which is what keeps
# the next virtualenv or cache directory from reopening this.
IGNORED_DIRS=()
if git -C "$ROOT" rev-parse --git-dir >/dev/null 2>&1; then
  for d in "$ROOT"/*/ "$ROOT"/.*/; do
    [ -d "$d" ] || continue
    b=$(basename "$d")
    case "$b" in .|..) continue ;; esac
    if git -C "$ROOT" check-ignore -q "$d" 2>/dev/null; then
      case " ${GREP_EXCLUDES[*]} " in *"--exclude-dir=$b "*) continue ;; esac
      GREP_EXCLUDES+=(--exclude-dir="$b")
      IGNORED_DIRS+=("$b")
    fi
  done
fi

if command -v rg >/dev/null 2>&1; then RG=1; else RG=0; fi
hr() { printf '\n\033[1m== %s ==\033[0m\n' "$1"; }

search() { # $1 = description, $2 = pattern, $3 = optional file-type filter (rg -t / grep --include)
  local desc="$1" pat="$2" ft="${3:-}"
  hr "$desc"
  if [ "$RG" -eq 1 ]; then
    if [ -n "$ft" ]; then rg -n --pcre2 "${CONTENT_GLOBS[@]}" -t "$ft" "$pat" "$ROOT" 2>/dev/null || echo "  (no hits)"
    else rg -n --pcre2 "${CONTENT_GLOBS[@]}" "$pat" "$ROOT" 2>/dev/null || echo "  (no hits)"; fi
  else
    grep -rInE "${GREP_EXCLUDES[@]}" "$pat" "$ROOT" 2>/dev/null || echo "  (no hits)"
  fi
}

echo "AI-tell mechanical pass over: $ROOT"
# THE ENGINE LINE IS LOUD ON PURPOSE. It read "Engine: grep" for months and every
# operator read past it, including one who measured ripgrep's behaviour and reported it
# as the script's. On this machine `rg` is a shell function with no binary on PATH, so
# `command -v rg` fails inside bash and the fallback is the only path that has ever run.
# A measurement of a dependency is not a measurement of the program that calls it.
if [ "$RG" -eq 1 ]; then
  echo "Engine: ripgrep ($(command -v rg)) - .gitignore honoured natively"
else
  echo "Engine: grep ($(command -v grep 2>/dev/null || echo grep))"
  echo "  WARNING: ripgrep is not on PATH, so this is the fallback. If you expected rg," \
       "check whether it is a shell function rather than a binary; command -v fails on" \
       "those inside bash."
fi
if [ "${#IGNORED_DIRS[@]}" -gt 0 ]; then
  echo "Also excluded (git-ignored): ${IGNORED_DIRS[*]}"
fi

# ---------- PUNCTUATION ----------
search "Em dashes (— ) — ceiling is one per paragraph" '—'
search "Interpuncts (·) — separator tell, nearly always a hit" '·'
search "Arrows (→) — flag when trailing on links/labels" '→'

# ---------- CONSTRUCTIONS ----------
# negation pair: "not X, it's Y" / "isn't X, it's Y" / "not X but Y". (?i) = case-insensitive.
search "Negation pairs (not X, it's Y / not X but Y)" "(?i)\b(it'?s not|isn'?t|not just|not only)\b.{0,60}\b(it'?s|but|rather)\b"
search "Rhetorical question then answer (mid-text ? then Capital)" '\?\s+[A-Z][a-z]+'

# ---------- VOCABULARY ----------
# Seeded from 05 voice section + 07 §3 + the article additions. Keep in sync with those docs.
BANNED='delve|leverage|robust|spearhead(ed)?|holistic|seamless(ly)?|cutting-edge|wear many hats|passionate about delivering|dive deep|unpack|reimagine|supercharge|streamline|empower|elevate|unlock|delightful|genuinely|effortlessly|in today'"'"'s fast-paced|at the end of the day|embark(ed)? on a journey|tapestry|testament|ecosystem|landscape|realm|journey|it'"'"'s worth noting|that said|arguably|let'"'"'s dig in|here'"'"'s the thing|the reality is'
search "Banned / AI-voiced vocabulary" "\b($BANNED)\b"
search "Adverbial fluff (truly/really/very/simply/just/basically/essentially/ultimately/fundamentally/actually/quietly/deeply/remarkably/surprisingly/incredibly/honestly)" "\b(truly|really|very|simply|just|basically|essentially|ultimately|fundamentally|actually|quietly|deeply|remarkably|surprisingly|incredibly|honestly)\b"
search "Banned positioning words on this site (craft / consumer-grade)" "\b(craft|consumer-grade)\b"

# ---------- INTERFACE COPY ----------
search "Generic CTA labels" "\b(Get Started|Learn More|Get in Touch|Sign Up Free|Try it free)\b"
search "Feature two-word abstractions" "\b(Lightning Fast|Fully Customizable|Built to Scale|Blazing Fast|Enterprise Ready)\b"
search "Apologetic empty/error copy" "(Something went wrong|Nothing here yet|Oops|Please try again)"
search "Emoji as section markers (leading emoji on a line)" '^\s*[\x{1F000}-\x{1FAFF}\x{2600}-\x{27BF}]'

# ---------- STRUCTURE / SURFACE (countable) ----------
hr "Distinct border-radius values (want 1; flag 3; alarm 4+)"
if [ "$RG" -eq 1 ]; then
  rg -oN --pcre2 "${CONTENT_GLOBS[@]}" 'border-radius:\s*[^;]+|rounded-(sm|md|lg|xl|2xl|3xl|full|\[[^\]]+\])' "$ROOT" 2>/dev/null | sed 's/.*://; s/^ *//' | sort -u | sed 's/^/  /' || echo "  (none found)"
else
  grep -rhoE "${GREP_EXCLUDES[@]}" 'border-radius:[^;]+|rounded-(sm|md|lg|xl|2xl|3xl|full)' "$ROOT" 2>/dev/null | sort -u | sed 's/^/  /' || echo "  (none found)"
fi

hr "Distinct font-size declarations (want a stepped 4-6; flag flat 2-3 or 9+)"
if [ "$RG" -eq 1 ]; then
  rg -oN --pcre2 "${CONTENT_GLOBS[@]}" 'font-size:\s*[^;]+' "$ROOT" 2>/dev/null | sed 's/.*font-size:\s*//; s/;.*//' | sort -u | sed 's/^/  /' || echo "  (none found)"
else
  grep -rhoE "${GREP_EXCLUDES[@]}" 'font-size:[^;]+' "$ROOT" 2>/dev/null | sort -u | sed 's/^/  /' || echo "  (none found)"
fi

search "Hex / rgb colors downstream (site is oklch role tokens — any hit is a tell)" '#[0-9a-fA-F]{3,8}\b|rgba?\('
search "Gradient text on headlines (banned)" 'bg-clip-text|text-transparent|linear-gradient\([^)]*\).{0,40}(h1|title|headline|hero)'
search "Backdrop blur (confirm it was a decision, not a default)" 'backdrop-blur'
search "Raw Tailwind palette names (site uses role tokens)" '\b(slate|sky|indigo|violet|zinc|gray|blue)-(50|100|200|300|400|500|600|700|800|900)\b'

hr "Done"
echo "Judge every hit against copy-tells.md / structural-tells.md. Rank negation pairs, vague metrics, and client conflation above single-punctuation hits."
