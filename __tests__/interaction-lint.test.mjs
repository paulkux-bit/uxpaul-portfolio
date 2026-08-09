import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALLOWLIST, PENDING_RULES, run } from '../scripts/lint-interaction.mjs';
// THE SELF-REFERENCE TRAP, AGAIN — fourth time in this project. Both guards
// below first failed on clean code because their regexes matched the COMMENTS
// that explain them: globals.css documents the `.theme-toggle svg` rule it
// deliberately removed, and theme-toggle.tsx spells out the conditional render
// it warns against. Sharing the linter's own comment-blanker rather than
// writing a second one.
import { blankComments } from '../scripts/color-literals.mjs';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..');
const postcss = createRequire(join(REPO, 'package.json'))('postcss');

// NOT `new URL('…', import.meta.url)`: Vite statically rewrites that pattern as
// an asset reference. It resolved to a root-relative path that did not exist,
// and every fixture then reported zero findings — which is what a passing
// negative control also looks like. Found during the colour migration; the same
// trap would be invisible here.
const FIXTURES = join(dirname(fileURLToPath(import.meta.url)), '..', 'scripts', 'fixtures', 'interaction');

const { checks, scanned } = await run(FIXTURES, { includeFixtures: true });
const check = (id) => {
  const c = checks.find((x) => x.id === id);
  expect(c, `check ${id} did not run`).toBeDefined();
  return c;
};
const where = (c) => [...c.failures, ...c.excluded].map((x) => x.where);
const failFiles = (c) => c.failures.map((x) => x.where.split(':')[0]);
const excReasons = (c) => c.excluded.map((x) => x.reason);

// ── The load-bearing assertion ─────────────────────────────────────────────
// Every count below is meaningless if the files were never opened. A fixture
// that is skipped produces no failures, which is exactly what a correct
// negative control produces (§8).
describe('the fixtures were actually scanned', () => {
  it('reaches every fixture file', () => {
    expect(scanned.css.sort()).toEqual(['clean.css', 'violations.css']);
    expect(scanned.tsx.sort()).toEqual([
      'clean.tsx', 'components/oku/artwork.tsx', 'violations.tsx',
    ]);
  });
  it('runs all nine checks', () => {
    expect(checks.map((c) => c.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
  // Check 9 reads `.next/static/css` relative to the tree it is given. The
  // fixture tree carries its own; if it ever goes missing this assertion is what
  // says so, instead of check 9 quietly finding nothing to complain about.
  it('check 9 read the fixture tree\'s built CSS', () => {
    expect(check(9).failures.map((x) => x.detail).join(' ')).not.toContain('no built CSS');
    expect(excReasons(check(9))).toContain('resolves');
  });
  it('every clean fixture is represented in the output, as exclusions', () => {
    // positive result, not absence of output
    const seen = checks.flatMap(where).map((w) => w.split(':')[0]);
    expect(seen).toContain('clean.css');
    expect(seen).toContain('clean.tsx');
    expect(seen).toContain('components/oku/artwork.tsx');
  });
});

describe('check 1 — literal durations', () => {
  const c = () => check(1);
  it('catches a literal duration', () => {
    expect(c().failures.some((f) => f.detail.includes('240ms'))).toBe(true);
  });
  it('counts a repeated shorthand literal once, not three times', () => {
    const hits = c().failures.filter((f) => f.detail.includes('320ms'));
    expect(hits).toHaveLength(1);
    expect(hits[0].detail).toContain('×3');
  });
  it('never flags a tokenised duration or a transition-delay', () => {
    expect(failFiles(c())).not.toContain('clean.css');
  });
  it('excludes the reduced-motion kill switch BY NAME', () => {
    expect(excReasons(c())).toContain('allowlisted-duration');
  });
  // Finding #14. The transition-delay PROPERTY was skipped while a delay in the
  // shorthand was read as a duration — one rule, two answers, decided by how
  // the author spelled it.
  it('reads the second time in a shorthand as a DELAY, not a duration', () => {
    expect(excReasons(c())).toContain('shorthand-delay');
    expect(c().excluded.some((x) => x.reason === 'shorthand-delay' && x.detail.includes('100ms'))).toBe(true);
  });
  it('never flags a shorthand delay as a literal duration', () => {
    expect(c().failures.some((f) => f.detail.includes('100ms'))).toBe(false);
    expect(failFiles(c())).not.toContain('clean.css');
  });
});

describe('check 2 — easing tokens', () => {
  const c = () => check(2);
  it('catches a bare keyword easing', () => {
    expect(c().failures.some((f) => f.detail.includes("bare 'ease-in-out'"))).toBe(true);
  });
  it('catches an inline cubic-bezier', () => {
    expect(c().failures.some((f) => f.detail.includes('inline cubic-bezier'))).toBe(true);
  });
  it('excludes token-eased transitions with a reason', () => {
    expect(excReasons(c())).toContain('uses-ease-token');
  });
});

describe('check 3 — radius scale', () => {
  const c = () => check(3);
  it('catches a literal radius', () => {
    expect(c().failures.some((f) => f.detail.includes('6px'))).toBe(true);
  });
  it('excludes a scale token, a reset, and the token definitions by name', () => {
    expect(excReasons(c())).toEqual(expect.arrayContaining([
      'uses-radius-token', 'zero-or-keyword', 'token-definition',
    ]));
  });
  // The JSX half. §4's map was wrong because the audit that wrote it and the
  // check that enforced it shared this exact gap.
  it('catches a Tailwind radius utility in .tsx', () => {
    expect(c().failures.some((f) => f.detail.startsWith('rounded-lg'))).toBe(true);
    expect(failFiles(c())).toContain('violations.tsx');
  });
  it('does NOT flag a class that merely starts with "rounded"', () => {
    // `rounded-m` is not a Tailwind size. A className-shaped string is not
    // automatically a radius utility, and check 9 owns the dangling case.
    expect(c().failures.some((f) => f.detail.startsWith('rounded-m'))).toBe(false);
    expect(failFiles(c())).not.toContain('clean.tsx');
  });
});

describe('check 4 — hand-authored svg', () => {
  const c = () => check(4);
  it('catches a hand-drawn icon in .tsx', () => {
    expect(failFiles(c())).toContain('violations.tsx');
  });
  it('catches a non-grain svg payload in CSS', () => {
    expect(failFiles(c())).toContain('violations.css');
  });
  it('excludes case-study artwork via the SHARED allowlist, not a second list', () => {
    const art = c().excluded.filter((x) => x.where.startsWith('components/oku/'));
    expect(art.length).toBeGreaterThan(0);
    expect(art.every((x) => x.reason === 'artwork')).toBe(true);
  });
  it('excludes the paper grain as artwork', () => {
    expect(c().excluded.some((x) => x.where.startsWith('clean.css') && x.reason === 'artwork')).toBe(true);
  });
});

describe('check 5 — icons sized in em', () => {
  const c = () => check(5);
  it('catches size, width and height in px', () => {
    const d = c().failures.map((f) => f.detail).join(' ');
    expect(d).toContain('size={24}');
    expect(d).toContain('width={20}');
    expect(d).toContain('height={20}');
  });
  it('does NOT mistake next/image width for an icon', () => {
    expect(c().failures.some((f) => f.detail.includes('1600'))).toBe(false);
    expect(failFiles(c())).not.toContain('clean.tsx');
  });
  it('excludes an icon sized 1em in BOTH axes by its class', () => {
    expect(excReasons(c())).toContain('sized-1em');
  });
  // The half that was missing at I0. lucide-react 1.28.0 defaults width/height
  // to 24 and writes them as px ATTRIBUTES, so "no size prop" is 24px, not 1em.
  // The first version of check 5 called this clean.
  it('catches an icon with no px prop AND no governing class', () => {
    expect(c().failures.some((f) => f.detail.includes('lucide defaults to 24px'))).toBe(true);
  });
  it('rejects rem as firmly as px — 1.125rem is not 1em', () => {
    expect(c().failures.some((f) => f.detail.includes('1.125rem'))).toBe(true);
  });
});

describe('check 6 — stroke table', () => {
  const c = () => check(6);
  it('catches an --icon-stroke off the table', () => {
    expect(c().failures.some((f) => f.detail.includes('--icon-stroke: 2'))).toBe(true);
  });
  it('catches a strokeWidth off the table', () => {
    expect(c().failures.some((f) => f.detail.includes('strokeWidth={2}'))).toBe(true);
  });
  it('accepts a table value from either surface', () => {
    expect(excReasons(c()).filter((r) => r === 'in-table').length).toBeGreaterThanOrEqual(2);
  });
  // §2.3's containment half, unimplemented at I0 and printed as UNCHECKED:
  // --icon-stroke sits on the CONTAINER, not on the icon.
  it('accepts an icon whose stroke is governed by an ancestor class', () => {
    expect(excReasons(c())).toContain('governed-by-container');
  });
  it('catches an icon governed by neither a prop nor an ancestor', () => {
    expect(c().failures.some((f) => f.detail.includes('no class on it or an ancestor'))).toBe(true);
  });
});

describe('check 7 — hover implies active', () => {
  const c = () => check(7);
  it('catches :hover with no :active', () => {
    expect(c().failures.some((f) => f.detail.includes('.v-hover-only:hover'))).toBe(true);
  });
  it('excludes a complete hover/active pair', () => {
    expect(excReasons(c())).toContain('has-active');
  });
  it('excludes a text link by its written reason', () => {
    expect(excReasons(c())).toContain('allowlisted-no-active');
  });
  // R5 governs the SURFACE, not the selector string. A hover expressed on a
  // descendant is satisfied by an :active on the ancestor being pressed.
  it('accepts an :active on the ancestor of a descendant hover', () => {
    expect(excReasons(c())).toContain('ancestor-active');
    expect(c().excluded.some((x) => x.reason === 'ancestor-active' && x.detail.includes('.c-band:active'))).toBe(true);
  });
  // A matching :active that cannot apply is not a matching :active.
  it('catches a pair authored in the WRONG ORDER', () => {
    expect(c().failures.some((f) => f.detail.includes('.v-wrong-order:active is authored BEFORE'))).toBe(true);
  });
});

describe('check 8 — no state variants in .tsx', () => {
  const c = () => check(8);
  it('catches all four variant forms', () => {
    const d = c().failures.map((f) => f.detail).join(' ');
    for (const v of ['hover:', 'focus:', 'active:', 'group-hover:']) expect(d).toContain(v);
  });
  it('does not flag the same words used as prose', () => {
    expect(failFiles(c())).not.toContain('clean.tsx');
  });
});

describe('check 9 — dangling classNames', () => {
  const c = () => check(9);
  it('catches a class with no utility and no authored rule', () => {
    expect(c().failures.some((f) => f.detail.includes('v-dangling-wrapper'))).toBe(true);
  });
  it('never fails a clean fixture — every token there resolves or is excluded', () => {
    expect(failFiles(c())).not.toContain('clean.tsx');
  });
  it('resolves against BOTH sources — the built CSS and an authored rule', () => {
    const d = c().excluded.filter((x) => x.reason === 'resolves').map((x) => x.detail).join(' ');
    expect(d).toContain('md:px-8');        // only in .next/static/css/built-stub.css
    expect(d).toContain('c-authored-only'); // only in clean.css
  });
  // The two halves of finding #12. Both used to leave the loop with no record,
  // which is indistinguishable from having resolved.
  it('resolves the important modifier rather than discarding it', () => {
    const d = c().excluded.filter((x) => x.reason === 'resolves').map((x) => x.detail).join(' ');
    expect(d).toContain('mt-24!');
  });
  it('treats an arbitrary value carrying quotes as ONE token, and resolves it', () => {
    const d = c().excluded.filter((x) => x.reason === 'resolves').map((x) => x.detail).join(' ');
    expect(d).toContain("after:content-['']");
    // the shredded fragments the whitespace-only split exists to prevent
    expect(c().failures.some((f) => f.detail.includes("content-['"))).toBe(false);
  });
  it('reports a token shape it cannot resolve, rather than dropping it', () => {
    expect(excReasons(c())).toContain('unrecognized-token-shape');
    expect(c().excluded.some((x) => x.reason === 'unrecognized-token-shape' && x.detail.includes('[&>*]:mt-4'))).toBe(true);
  });
  it('counts a className EXPRESSION it cannot read as a literal class list', () => {
    expect(excReasons(c())).toContain('unparsed-className-expression');
  });
  it('excludes marker classes and counts interpolation', () => {
    expect(excReasons(c())).toEqual(expect.arrayContaining(['marker-class', 'interpolated']));
  });
  it('excludes a deliberately unstyled wrapper via the REAL allowlist entry', () => {
    const hit = c().excluded.filter((x) => x.reason === 'allowlisted-unstyled-wrapper');
    expect(hit.length).toBeGreaterThan(0);
    expect(hit.some((x) => x.detail.startsWith('friction-beat__text'))).toBe(true);
  });
});

// ── The allowlist entries' premises, guarded ───────────────────────────────
//
// ALLOWLIST.danglingClasses excuses two classes on the grounds of what the
// structure around them IS. Those grounds can stop being true without anyone
// touching the allowlist, and a stale exception reads exactly like a live one —
// which is how the pinned specimen tones ended up describing a palette that no
// longer existed. So the reason is coupled to the fact.
//
// Static, over the real app/globals.css: no dev server, no build, milliseconds.
// The rendered proof (Playwright, both case studies and the sandbox route, 1440
// and 900, light and dark) was a one-shot; this is what carries it forward.
describe('the unstyled-wrapper allowlist still rests on a true premise', () => {
  const css = postcss.parse(readFileSync(join(REPO, 'app', 'globals.css'), 'utf8'));
  const declsFor = (selector, inMedia = null) => {
    const out = [];
    css.walkRules((r) => {
      if (r.selector.split(',').map((s) => s.trim()).every((s) => s !== selector)) return;
      const media = r.parent?.type === 'atrule' ? `@${r.parent.name} ${r.parent.params}` : null;
      if (inMedia && media !== inMedia) return;
      if (!inMedia && media) return;
      for (const d of r.nodes ?? []) if (d.type === 'decl') out.push([d.prop, d.value.trim()]);
    });
    return out;
  };

  it('names exactly the two wrappers this suite guards', () => {
    expect(ALLOWLIST.danglingClasses.map((a) => a.class).sort()).toEqual([
      'friction-beat__text', 'resolution-block__framing',
    ]);
  });

  // "the grid track carries the sizing" is only a reason while there IS a grid
  // with the wrapper as its first column.
  it('.friction-beat is still a two-column grid above 1024', () => {
    const decls = new Map(declsFor('.friction-beat', '@media (min-width: 1024px)'));
    expect(decls.get('display')).toBe('grid');
    const cols = decls.get('grid-template-columns');
    expect(cols).toBeDefined();
    // two tracks, the second capped — the 300px the text column is measured against
    expect(cols.match(/minmax\(/g) ?? []).toHaveLength(2);
    expect(cols).toContain('300px');
  });

  // The mirror premise: .resolution-block__framing inherits its measure because
  // it sits in plain block flow. The moment its parent becomes a container it is
  // a track item and the reason no longer holds.
  it('.resolution-block is still NOT a grid or flex container', () => {
    for (const [prop, value] of declsFor('.resolution-block')) {
      if (prop === 'display') expect(['grid', 'flex', 'inline-grid', 'inline-flex']).not.toContain(value);
    }
  });
});

// ── The motion mapping, guarded ────────────────────────────────────────────
//
// Check 1 proves a duration is TOKENISED. It does not prove the token is the
// RIGHT one — put --duration-card on the nav link and check 1 still passes.
// §3's whole content is which surface moves at which speed, so that is what
// gets asserted, statically, against the real globals.css.
//
// The rendered timing proof (computed transitionDuration under Playwright) was
// a one-shot for I2. This is what carries the claim forward.
describe('§3 motion mapping — the right token, not merely a token', () => {
  const css = postcss.parse(readFileSync(join(REPO, 'app', 'globals.css'), 'utf8'));
  const transitionsFor = (selector) => {
    const out = [];
    css.walkRules((r) => {
      if (!r.selector.split(',').some((s) => s.trim() === selector)) return;
      for (const d of r.nodes ?? []) {
        if (d.type === 'decl' && /^transition(-duration)?$/.test(d.prop)) out.push(d.value);
      }
    });
    return out;
  };

  const CONTROL = [
    'a', '.site-header', '.skip-link', '.nav-link', '.theme-toggle',
    '.about-row__mark', '.about-row::details-content',
    '.about-btn', '.about-work-band__arrow',
  ];
  for (const sel of CONTROL) {
    it(`${sel} moves at --duration-control`, () => {
      const t = transitionsFor(sel);
      expect(t, `${sel} has no transition declaration`).not.toHaveLength(0);
      for (const v of t) {
        expect(v).toContain('--duration-control');
        expect(v, `${sel} still carries a literal duration`).not.toMatch(/\d+m?s(?![\w-])/);
      }
    });
  }

  it('body and body::before move at --duration-theme — one mode transition, one speed', () => {
    for (const sel of ['body', 'body::before']) {
      const t = transitionsFor(sel);
      expect(t, `${sel} has no transition`).not.toHaveLength(0);
      for (const v of t) expect(v).toContain('--duration-theme');
    }
  });

  it('the card lift moves at --duration-card', () => {
    // @utility lift is an at-rule, not a selector rule — walk it by name.
    let value = null;
    css.walkAtRules('utility', (r) => {
      if (r.params.trim() !== 'lift') return;
      for (const d of r.nodes ?? []) if (d.type === 'decl' && d.prop === 'transition') value = d.value;
    });
    expect(value, '@utility lift has no transition').not.toBeNull();
    expect(value).toContain('--duration-card');
    expect(value).not.toContain('--duration-control');
  });

  it('--duration-hover is retired — defined nowhere, consumed nowhere', () => {
    const src = readFileSync(join(REPO, 'app', 'globals.css'), 'utf8');
    expect(src).not.toContain('--duration-hover');
  });

  it('entrance motion is NOT swept into an interaction token', () => {
    for (const sel of ALLOWLIST.entranceMotion.selectors) {
      for (const v of transitionsFor(sel)) {
        expect(v, `${sel} was migrated; §9 leaves entrance open on purpose`)
          .not.toMatch(/--duration-(control|card|theme)/);
      }
    }
  });
});

// ── §2's icon contexts, guarded ────────────────────────────────────────────
//
// Checks 5 and 6 prove an icon is SIZED and GOVERNED. They do not prove it is
// governed by the right value, or that it sits in the right type context —
// --icon-stroke: 2.25 on the button would pass both. §2's content is which
// adjacent type each icon belongs to, so that is what gets asserted.
describe('§2 icon contexts — the right stroke, from the right adjacent type', () => {
  const css = readFileSync(join(REPO, 'app', 'globals.css'), 'utf8');
  const rules = postcss.parse(css);
  const declFor = (selector, prop) => {
    let v = null;
    rules.walkRules((r) => {
      if (!r.selector.split(',').some((s) => s.trim() === selector)) return;
      for (const d of r.nodes ?? []) if (d.type === 'decl' && d.prop === prop) v = d.value.trim();
    });
    return v;
  };

  it('.icon sizes 1em in both axes and takes its stroke from the container', () => {
    expect(declFor('.icon', 'width')).toBe('1em');
    expect(declFor('.icon', 'height')).toBe('1em');
    expect(declFor('.icon', 'stroke-width')).toContain('--icon-stroke');
  });

  // The stroke each container declares, and why it is that number.
  for (const [sel, stroke, why] of [
    ['.about-btn', '1.70', 'label weight 500'],
    ['.about-work-band', '1.70', 'sibling label text-h3, weight 500'],
    ['.about-row__summary', '1.70', 'sibling company text-h3, weight 500'],
    ['.theme-toggle', '1.95', 'no adjacent text — judged against the wordmark, weight 600'],
  ]) {
    it(`${sel} declares --icon-stroke: ${stroke} (${why})`, () => {
      expect(declFor(sel, '--icon-stroke')).toBe(stroke);
    });
  }

  // The toggle has no text, so its type context only exists because it is
  // declared. If these go, the icon silently falls back to inherited size and
  // the default 1.70 — with every check still green.
  it('.theme-toggle declares the type context its icons resolve against', () => {
    expect(declFor('.theme-toggle', 'font-size')).toBe('1rem');
    expect(declFor('.theme-toggle', 'font-weight')).toBe('600');
  });

  // (0,1,1) outranks .icon at (0,1,0): this rule would pin the icons to 18px
  // while checks 4, 5 and 6 all stayed green.
  it('no descendant rule outranks .icon on size', () => {
    expect(blankComments(css)).not.toMatch(/\.theme-toggle\s+svg\s*\{[^}]*width/);
  });

  // A sibling icon cannot inherit its neighbour's font-size, so the rung comes
  // to the icon. If someone "cleans up" the utility off these nodes, 1em
  // silently resolves against the container instead.
  for (const [file, node] of [
    ['app/about/page.tsx', 'about-work-band__arrow'],
    ['components/about/drawer.tsx', 'about-row__mark'],
  ]) {
    it(`${node} carries text-h3 for its font-size`, () => {
      const src = readFileSync(join(REPO, file), 'utf8');
      expect(src).toMatch(new RegExp(`className="icon text-h3 ${node}"`));
    });
  }

  // THE MECHANISM, not the geometry. A conditional render here passes checks 4,
  // 5 and 6, tsc and eslint, and reintroduces the theme flash plus a hydration
  // mismatch, because the server has no resolved theme.
  it('the theme toggle renders BOTH glyphs unconditionally', () => {
    const src = readFileSync(join(REPO, 'components', 'theme-toggle.tsx'), 'utf8');
    expect(src).toContain('<Moon className="icon icon-moon"');
    expect(src).toContain('<Sun className="icon icon-sun"');
    expect(blankComments(src), 'a conditional glyph reintroduces the flash and a hydration mismatch')
      .not.toMatch(/resolvedTheme[^\n]*\?[^\n]*<(Sun|Moon)/);
  });
});

// ── §5's pressed states, guarded ───────────────────────────────────────────
//
// Check 7 proves an :active EXISTS and is authored after its :hover. It does not
// prove the :active says what §5 says — translateY(4px) would pass it. Same gap
// the I2 motion and I3 radius guards were written for.
describe('§5 pressed states — the specified values, on the specified surfaces', () => {
  const src = readFileSync(join(REPO, 'app', 'globals.css'), 'utf8');
  const css = postcss.parse(src);
  const activeDecls = (selector) => {
    const out = new Map();
    css.walkRules((r) => {
      if (!r.selector.split(',').some((s) => s.trim() === `${selector}:active`)) return;
      for (const d of r.nodes ?? []) if (d.type === 'decl') out.set(d.prop, d.value.trim());
    });
    return out;
  };

  // Every surface sinks by exactly 1px. §5 chose the sink over scale and tint.
  for (const sel of ['.case-card--linked', '.about-btn', '.nav-link', '.theme-toggle', '.about-work-band']) {
    it(`${sel}:active sinks 1px`, () => {
      const d = activeDecls(sel);
      expect(d.size, `${sel}:active has no declarations`).toBeGreaterThan(0);
      expect(d.get('transform')).toBe('translateY(1px)');
    });
  }

  // Only the card has a resting shadow to drop, so it is the only row where the
  // shadow half of §5 means anything.
  it('the card drops to --shadow-rest; nothing else claims a shadow it lacks', () => {
    expect(activeDecls('.case-card--linked').get('box-shadow')).toContain('--shadow-rest');
    for (const sel of ['.about-btn', '.nav-link', '.theme-toggle', '.about-work-band']) {
      expect(activeDecls(sel).has('box-shadow'), `${sel} has no resting shadow to drop`).toBe(false);
    }
  });

  // The exemptions are decisions, so they are asserted rather than left as the
  // absence of a rule — which is what an oversight also looks like.
  it('the two exempt surfaces have NO :active, by design', () => {
    for (const sel of ['a', '.quiet-link', '.case-card__title-link', '.about-row__summary']) {
      expect(activeDecls(sel).size, `${sel} should have no :active (§5)`).toBe(0);
    }
  });

  // The work band sinks as a band. If this ever becomes two descendant rules,
  // the interface got worse to satisfy a selector-string reading of check 7.
  it('the work band sinks itself, not its arrow and label separately', () => {
    expect(activeDecls('.about-work-band').get('transform')).toBe('translateY(1px)');
    expect(src).not.toContain('.about-work-band:active .about-work-band__arrow');
    expect(src).not.toContain('.about-work-band:active .about-work-band__label');
  });
});

// ── The radius mapping, guarded ────────────────────────────────────────────
//
// Check 3 proves a radius is TOKENISED. It does not prove the token is the
// RIGHT one — put --radius-l on the button and check 3 still passes. §4's whole
// content is which surface gets which step, so that is what gets asserted.
//
// Same shape as the §3 motion guard above, and the same reason: the pixel proof
// was a one-shot, this is what carries the claim forward.
describe('§4 radius mapping — the right step, not merely a token', () => {
  const css = postcss.parse(readFileSync(join(REPO, 'app', 'globals.css'), 'utf8'));
  const radiusFor = (selector) => {
    const out = [];
    css.walkRules((r) => {
      if (!r.selector.split(',').some((s) => s.trim() === selector)) return;
      for (const d of r.nodes ?? []) if (d.type === 'decl' && d.prop === 'border-radius') out.push(d.value.trim());
    });
    return out;
  };

  const EXPECT = [
    [':focus-visible', '--radius-xs'],   // the widest blast radius in §4
    ['.skip-link', '--radius-xs'],
    ['.mode-pair__label', '--radius-xs'],
    ['.bento-theme__media', '--radius-xs'],
    ['.theme-toggle', '--radius-s'],
    ['.milestone', '--radius-s'],
    ['.figure__image', '--radius-s'],
    ['.mode-pair__cell', '--radius-s'],
    ['.hero-block__callout', '--radius-s'],
    ['.about-btn', '--radius-m'],        // the button
    ['.quick-hit', '--radius-m'],
    ['.case-card', '--radius-l'],        // the card sits a step above the button
    ['.about-roles__step::before', '--radius-full'],
  ];
  for (const [sel, token] of EXPECT) {
    it(`${sel} → ${token}`, () => {
      const got = radiusFor(sel);
      expect(got, `${sel} declares no border-radius`).not.toHaveLength(0);
      for (const v of got) {
        expect(v).toContain(token);
        expect(v, `${sel} still carries a literal radius`).not.toMatch(/\d+px/);
      }
    });
  }

  it('the card and the button are different steps — that is why l exists', () => {
    expect(radiusFor('.case-card')[0]).not.toBe(radiusFor('.about-btn')[0]);
  });

  it('all five steps are defined', () => {
    const src = readFileSync(join(REPO, 'app', 'globals.css'), 'utf8');
    for (const t of ['--radius-xs:', '--radius-s:', '--radius-m:', '--radius-l:', '--radius-full:']) {
      expect(src).toContain(t);
    }
  });
});

// ── Forward references, scheduled rather than excused ──────────────────────
//
// PENDING_RULES names a class authored ahead of the rules meant to target it,
// and the step expected to deliver them. The risk is not that the entry is
// wrong — it is that it silently outlives its own subject, which is a typo with
// a comment on it.
//
// So it is self-clearing: each entry asserts the class still has NO rule. The
// moment the named step gives it one, this reddens and forces the entry out.
// It does NOT catch the opposite case — a step that lands without resolving —
// because no lint knows which step it is standing in. That one is caught by the
// note being printed on every run and read when the step is planned.
describe('pending forward references have not silently resolved', () => {
  const css = readFileSync(join(REPO, 'app', 'globals.css'), 'utf8');
  const rules = postcss.parse(css);

  // Empty as of I3, and asserted as empty rather than deleted along with its
  // last entry: the list is the mechanism, and a future forward reference gets
  // its coupled test for free by being added here.
  it('names exactly the forward references this suite tracks', () => {
    expect(PENDING_RULES.map((p) => p.class)).toEqual([]);
  });

  for (const p of PENDING_RULES) {
    it(`.${p.class} still has no rule — delete this entry when ${p.expectedAt} gives it one`, () => {
      const matched = [];
      rules.walkRules((r) => {
        for (const sel of r.selector.split(',')) {
          // the bare class, not .case-card--linked or .case-card__title-link
          if (new RegExp(`\\.${p.class}(?![\\w-])`).test(sel.trim())) matched.push(sel.trim());
        }
      });
      expect(matched, `.${p.class} now has rules: ${matched.join(', ')}`).toEqual([]);
    });
  }
});

// A check that passes because its input was missing is the shape this migration
// keeps finding — the .mdx gap in the colour migration, and finding #11 here.
// Check 9 is the only check with an external input, so it is the only one that
// can fail this way, and until now nothing asserted that it does not.
describe('check 9 is never green when it cannot see', () => {
  it('fails loudly on a tree with no built CSS', async () => {
    const blind = await run(join(FIXTURES, 'components'), { includeFixtures: true });
    const c9 = blind.checks.find((x) => x.id === 9);
    expect(c9.pass).toBe(false);
    expect(c9.failures.map((x) => x.detail).join(' ')).toContain('no built CSS found');
  });
});
