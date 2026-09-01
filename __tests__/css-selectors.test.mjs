import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..');
const CSS_FILE = 'app/globals.css';

// WHY THIS EXISTS. Commit c7d0b1c deleted a rule and left one word of its
// selector behind:
//
//     .journey-line__axis,
//     .tier-chart__axis {  <- both lines deleted
//       stroke: ...
//     }                    <- and the body, leaving the bare word `axis`
//
// CSS has no error for that. The parser reads the orphan as the start of the
// NEXT rule's selector, so `.tier-chart__ref` became `axis .tier-chart__ref`,
// which matches nothing. Four SVG lines lost their stroke and an SVG line with
// no stroke is invisible rather than faint, so no gate and no eye caught it:
// lint:type, lint:space, lint:color and lint:interaction all stayed green, the
// build succeeded, and the page shipped with a chart that had no baseline and a
// caption naming a dotted rule that was not drawn.
//
// THE CHECK IS ON THE GENERAL SHAPE, NOT ON THIS BUG. Asserting that
// `.tier-chart__axis` has a stroke would pass the next orphan somewhere else.
// What actually went wrong is that a TYPE SELECTOR appeared which is not an
// element, and every real type selector in this stylesheet is a small, closed
// set of tags. So: any bare word used as a type selector must be a known HTML or
// SVG element name. `axis` is not one, and neither is any other fragment a
// half-deleted rule can leave behind.
const HTML = `a abbr address area article aside audio b base bdi bdo blockquote body br button
canvas caption cite code col colgroup data datalist dd del details dfn dialog div dl dt em
embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup hr html i
iframe img input ins kbd label legend li link main map mark menu meta meter nav noscript
object ol optgroup option output p param picture pre progress q rp rt ruby s samp script
search section select slot small source span strong style sub summary sup table tbody td
template textarea tfoot th thead time title tr track u ul var video wbr`;

const SVG = `svg g defs symbol use image switch style path rect circle ellipse line polyline
polygon text tspan textPath marker linearGradient radialGradient stop pattern clipPath mask
filter foreignObject desc title animate animateMotion animateTransform set view`;

const ELEMENTS = new Set([...HTML.split(/\s+/), ...SVG.split(/\s+/)].filter(Boolean));

// Tailwind v4 at-rules take an identifier, not a selector: `@utility text-body`,
// `@custom-variant dark`. Those live in `params`, not in a rule's `selector`, so
// walkRules never sees them. Keyframe steps do come through as rules, with
// selectors like `from`, `to` and `40%`, so their parent is skipped by name.
const KEYFRAME_AT = /^(-\w+-)?keyframes$/;

describe('every type selector in globals.css is a real element', () => {
  const css = readFileSync(join(REPO, CSS_FILE), 'utf8');
  const root = postcss.parse(css, { from: CSS_FILE });

  const offenders = [];
  root.walkRules((rule) => {
    let p = rule.parent;
    while (p) {
      if (p.type === 'atrule' && KEYFRAME_AT.test(p.name)) return;
      p = p.parent;
    }
    for (const selector of rule.selectors) {
      // Strip everything that is not a bare word in type position: classes, ids,
      // attribute selectors, pseudos (and their parenthesised arguments),
      // combinators and the universal selector.
      const stripped = selector
        .replace(/\[[^\]]*\]/g, ' ')
        .replace(/::?[\w-]+(\([^)]*\))?/g, ' ')
        .replace(/[.#][\w-]+/g, ' ')
        .replace(/[>+~*,]/g, ' ');
      for (const word of stripped.split(/\s+/).filter(Boolean)) {
        if (!/^[a-zA-Z][\w-]*$/.test(word)) continue;
        if (ELEMENTS.has(word)) continue;
        offenders.push({ line: rule.source?.start?.line ?? 0, selector, word });
      }
    }
  });

  it('finds no bare word that is not an HTML or SVG tag', () => {
    const detail = offenders
      .map((o) => `${CSS_FILE}:${o.line}  "${o.word}" in \`${o.selector}\``)
      .join('\n');
    expect(offenders, `orphaned type selector(s):\n${detail}`).toEqual([]);
  });

  // The check above is only worth having if it would have gone red on the real
  // defect, so the real defect is fed back through it. This is the shape the
  // stylesheet actually had on 29 Aug, orphan and all.
  it('would have caught the c7d0b1c orphan', () => {
    const broken = postcss.parse(
      'axis\n\n.tier-chart__ref { stroke: var(--text-subtle); }',
      { from: 'fixture' },
    );
    const found = [];
    broken.walkRules((rule) => {
      for (const word of rule.selector.replace(/[.#][\w-]+/g, ' ').split(/\s+/).filter(Boolean)) {
        if (/^[a-zA-Z][\w-]*$/.test(word) && !ELEMENTS.has(word)) found.push(word);
      }
    });
    expect(found).toEqual(['axis']);
  });
});
