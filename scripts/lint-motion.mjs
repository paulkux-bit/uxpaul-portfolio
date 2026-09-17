// Usage: node scripts/lint-motion.mjs   (no build required — parses source)
//
// Reduced-motion gate. Parses app/globals.css and MAPS every animation and
// transition declaration to the guard that covers it. It does not count.
//
// WHY A MAP AND NOT A COUNT. The Dagr review measured "11 prefers-reduced-motion
// blocks against 19 animation/transition declarations" and correctly refused to
// call that coverage: a declaration count is not a mapping, and the two numbers
// can both be right while a specific selector animates for a user who asked it
// not to. This script resolves each declaration's own selector and says which
// guard covers it, by name.
//
// THE TWO GUARD FORMS, both legitimate:
//   A. The declaration sits inside `@media (prefers-reduced-motion: no-preference)`,
//      so it never applies to a user who asked for reduced motion.
//   B. A blanket `@media (prefers-reduced-motion: reduce)` rule whose selector is
//      `*` neutralises animation-duration and transition-duration with !important.
//
// FORM B IS A SINGLE POINT OF FAILURE AND THAT IS THE POINT OF CHECK 1. Most of
// this stylesheet's animated selectors are covered by form B alone. Delete that
// one rule and they all go unguarded at once, silently, with every other gate
// still green. Check 1 asserts the blanket rule exists in the shape the others
// rely on; check 2 then names every selector that would be left exposed if it
// went. That is the "couple an exception to its premise" discipline: the guard
// and the thing it protects fail together or not at all.
//
// UNCHECKED, AND SAID OUT LOUD. This script sees CSS only. Framer Motion and any
// other JS-driven animation are invisible to it, and they carry their own
// prefers-reduced-motion obligation that nothing here asserts.
// NEGATIVE-TESTABLE ON PURPOSE. An optional path argument lets this run against a
// fixture, which is how the two checks below were proved red before being trusted:
//   node scripts/lint-motion.mjs /tmp/fixture.css
// Run from the repo root either way, so postcss resolves.
import { readFile } from 'node:fs/promises';
import postcss from 'postcss';

const CSS_FILE = process.argv[2] ?? 'app/globals.css';

const ANIMATED_PROPS = /^(animation|animation-name|animation-duration|transition|transition-duration)$/;
const NO_PREFERENCE = /prefers-reduced-motion\s*:\s*no-preference/;
const REDUCE = /prefers-reduced-motion\s*:\s*reduce/;

// A declaration is inert for motion purposes when it turns motion OFF rather than
// on: `transition: none`, `animation: none`, or a duration at or near zero. Those
// are guards themselves, not things needing one.
const INERT = /^(none|0s|0ms|initial|unset)$/i;

const css = await readFile(CSS_FILE, 'utf8');
const root = postcss.parse(css, { from: CSS_FILE });

const checks = [];
const add = (id, title, failures, note) =>
  checks.push({ id, title, failures, pass: failures.length === 0, note });

/** Walk up the AST collecting enclosing at-rules. */
function ancestors(node) {
  const out = [];
  for (let p = node.parent; p; p = p.parent) if (p.type === 'atrule') out.push(p);
  return out;
}

// ── Find the blanket form-B guard ──────────────────────────────────────────
let blanket = null;
root.walkAtRules('media', (at) => {
  if (!REDUCE.test(at.params)) return;
  at.walkRules((rule) => {
    const selectors = rule.selectors.map((s) => s.trim());
    const isUniversal = selectors.some((s) => s === '*' || s === '*::before' || s === '*::after');
    if (!isUniversal) return;
    const props = new Map();
    rule.walkDecls((d) => props.set(d.prop, d.important));
    if (props.has('animation-duration') && props.has('transition-duration')) {
      blanket = {
        line: rule.source?.start?.line,
        selectors: selectors.join(', '),
        important:
          props.get('animation-duration') === true && props.get('transition-duration') === true,
      };
    }
  });
});

{
  const f = [];
  if (!blanket) {
    f.push({
      where: CSS_FILE,
      detail:
        'No blanket `@media (prefers-reduced-motion: reduce)` rule on `*` setting ' +
        'animation-duration AND transition-duration. Every selector relying on form B ' +
        'is now unguarded — see check 2 for the list.',
    });
  } else if (!blanket.important) {
    f.push({
      where: `${CSS_FILE}:${blanket.line}`,
      detail:
        'The blanket reduce rule exists but does not use !important on both durations, ' +
        'so a more specific animation rule still wins over it.',
    });
  }
  add(1, 'A blanket reduced-motion guard exists, on * , with !important', f);
}

// ── Map every animated declaration to its guard ────────────────────────────
const mapped = [];
root.walkDecls((decl) => {
  if (!ANIMATED_PROPS.test(decl.prop)) return;
  const value = decl.value.trim();
  if (INERT.test(value)) return;

  const ats = ancestors(decl);
  // A declaration inside a reduce block IS a guard; it is not guarded prey.
  if (ats.some((a) => a.name === 'media' && REDUCE.test(a.params))) return;

  const guardedA = ats.some((a) => a.name === 'media' && NO_PREFERENCE.test(a.params));
  const rule = decl.parent;
  mapped.push({
    line: decl.source?.start?.line,
    selector: rule && rule.type === 'rule' ? rule.selector.replace(/\s+/g, ' ').slice(0, 64) : '(at-rule)',
    prop: decl.prop,
    guard: guardedA ? 'A: no-preference block' : blanket ? 'B: blanket reduce rule' : 'NONE',
  });
});

{
  const f = mapped
    .filter((m) => m.guard === 'NONE')
    .map((m) => ({
      where: `${CSS_FILE}:${m.line}`,
      detail: `${m.selector} { ${m.prop} } animates with no reduced-motion guard.`,
    }));
  add(2, 'Every animation and transition resolves to a guard (A or B)', f);
}

// ── Report ─────────────────────────────────────────────────────────────────
const byA = mapped.filter((m) => m.guard.startsWith('A')).length;
const byB = mapped.filter((m) => m.guard.startsWith('B')).length;
const none = mapped.filter((m) => m.guard === 'NONE').length;

console.log(`motion-lint: ${CSS_FILE} (${mapped.length} animated declarations)\n`);
for (const c of checks) {
  console.log(`${c.pass ? '✓' : '✗'} ${c.id}. ${c.title}`);
  if (c.pass) console.log('    PASS');
  else for (const x of c.failures.slice(0, 20)) console.log(`    ✗ ${x.where}\n        ${x.detail}`);
  if (!c.pass && c.failures.length > 20)
    console.log(`    … and ${c.failures.length - 20} more (${c.failures.length} total)`);
  console.log('');
}

console.log('Guard map:');
console.log(`    A, inside a no-preference block:  ${byA}`);
console.log(`    B, covered by the blanket rule:   ${byB}${
  blanket ? `  (${CSS_FILE}:${blanket.line})` : ''
}`);
console.log(`    unguarded:                        ${none}`);
if (byB > byA)
  console.log(
    `\n    NOTE: ${byB} of ${mapped.length} depend on ONE rule. If ${CSS_FILE}:${blanket?.line} ` +
      'is deleted, check 2 turns red and names every one of them.',
  );
console.log('\n⚠ UNCHECKED: JS-driven animation (Framer Motion) is invisible to this script.');

const passing = checks.filter((c) => c.pass).length;
const failing = checks.length - passing;
console.log(`\nResult: ${passing} of ${checks.length} passing, ${failing} failing`);
process.exit(failing === 0 ? 0 : 1);
