import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(REPO, p), 'utf8');

// CLAUDE.md's typography section was wrong for a day short of a migration, and
// wrong in the way that costs the most: it is the first thing every author and
// every agent reads, and it described a typeface the repo had stopped using.
// Eight Bricolage references, zero Commissioner. It named next/font/google when
// the loader is next/font/local, prescribed font-optical-sizing and font-stretch
// for axes that do not exist, published a table of three --wdth-* tokens that
// commit 25011cc had deleted, and told anyone swapping the face to edit them.
//
// This is the SAME FAILURE, IN THE SAME FILE, as the one canon.test.mjs was
// written for: a hand-maintained description of the code, drifting silently
// because nothing compared it to the code. That one was fixed by coupling the
// table to the filesystem. This does the same for typography.
//
// WHAT IS ASSERTED AND WHAT IS NOT. A claim about what the code IS gets
// asserted here. A claim about WHY it is that way does not — the 52px flare
// cut, H3 at weight 500, the declaration living on `*`. Those are judgments,
// and a test that pinned them would either be vacuous or would freeze a
// decision that is meant to stay arguable. Every check below reads a fact out
// of app/fonts.ts, app/globals.css, scripts/lint-type.mjs or package.json and
// compares it to what CLAUDE.md says. None of them reads the prose.
describe('CLAUDE.md typography matches the code', () => {
  const claude = read('CLAUDE.md');
  const fonts = read('app/fonts.ts');
  const css = read('app/globals.css');
  const lintType = read('scripts/lint-type.mjs');
  const pkg = JSON.parse(read('package.json'));

  const typographySection = claude.slice(
    claude.indexOf('## Typography\n'),
    claude.indexOf('## Colour by rung'),
  );

  it('the section exists and is non-trivial', () => {
    expect(typographySection.length).toBeGreaterThan(2000);
  });

  // ── The loader and the face ──────────────────────────────────────────────
  it('names the loader app/fonts.ts actually imports', () => {
    const loader = fonts.match(/from '(next\/font\/[a-z]+)'/)?.[1];
    expect(loader, 'app/fonts.ts imports no next/font loader').toBeTruthy();
    expect(typographySection).toContain(loader);
  });

  // The first draft of this guarded with `if (fonts.includes('next/font/google'))
  // continue`, and it silently passed on the stale file: app/fonts.ts names the
  // google loader in a comment about the bug it caused. A guard keyed on a
  // substring of the whole source is defeated by that source's own history.
  // Key it on the IMPORT, and diff against every loader the section mentions.
  it('names no next/font loader other than the imported one', () => {
    const loader = fonts.match(/from '(next\/font\/[a-z]+)'/)?.[1];
    const named = [...new Set([...typographySection.matchAll(/next\/font\/[a-z]+/g)].map((m) => m[0]))];
    expect(named.filter((l) => l !== loader), 'CLAUDE.md names a loader app/fonts.ts does not import').toEqual([]);
  });

  // `axes: [...]` is a next/font/google-only option. CLAUDE.md used to say
  // omitting it would silently ship a weight-only file — true once, and about a
  // loader this repo no longer uses.
  it('does not prescribe an axes array unless the loader takes one', () => {
    if (/axes:\s*\[/.test(fonts)) return;
    expect(/axes:\s*\[/.test(typographySection), 'CLAUDE.md prescribes an `axes: [...]` array; the local loader has no such option').toBe(false);
  });

  it('names the font file app/fonts.ts points at, and that file exists', () => {
    const src = fonts.match(/src:\s*'\.\/([^']+)'/)?.[1];
    expect(src, 'app/fonts.ts declares no src').toBeTruthy();
    expect(existsSync(join(REPO, 'app', src)), `app/${src} is missing`).toBe(true);
    expect(typographySection).toContain(src.split('/').pop());
  });

  it('names the CSS variable app/fonts.ts exposes', () => {
    const v = fonts.match(/variable:\s*'(--[a-z0-9-]+)'/)?.[1];
    expect(typographySection).toContain(v);
    expect(css, `${v} is exposed by fonts.ts but nothing in globals.css reads it`).toContain(v);
  });

  it('states the weight range app/fonts.ts instances', () => {
    const w = fonts.match(/weight:\s*'(\d+)\s+(\d+)'/);
    expect(w, 'app/fonts.ts declares no weight range').toBeTruthy();
    expect(typographySection).toMatch(new RegExp(`${w[1]}\\s*[-–—]\\s*${w[2]}|'${w[1]} ${w[2]}'`));
  });

  // ── The axes that do not exist ───────────────────────────────────────────
  // Coupled to lint:type check 10 rather than hardcoded: the check exists
  // BECAUSE the axes are gone, so if it is ever removed this relaxes with it
  // instead of becoming a rule nobody can trace to a reason.
  it('prescribes no property whose axis lint:type check 10 says is absent', () => {
    const check10 = /No font-stretch or font-optical-sizing: the axes do not exist/.test(lintType);
    expect(check10, 'lint:type check 10 is gone — revisit this assertion').toBe(true);

    // A DECLARATION (`prop:`) is a prescription. A bare mention is history, and
    // the section is required to carry history, so only the colon form fails.
    for (const prop of ['font-stretch', 'font-optical-sizing']) {
      const declared = new RegExp(`${prop}\\s*:`).test(claude);
      expect(declared, `CLAUDE.md authors a \`${prop}:\` declaration; check 10 forbids it in CSS`).toBe(false);
    }
  });

  it('does not present the deleted width tokens as live tokens', () => {
    // Backticked = referenced as a thing you can use. The token-resolution test
    // below is the general form; this names the specific trio because they had
    // their own table and their own step in the swap protocol.
    for (const t of ['--wdth-read', '--wdth-display', '--wdth-large']) {
      expect(css.includes(`${t}:`), `${t} is defined again in globals.css — revisit`).toBe(false);
      expect(claude.includes(`\`${t}\``), `CLAUDE.md still cites \`${t}\` as a live token`).toBe(false);
    }
  });

  // ── Every token named is a token that exists ─────────────────────────────
  // The single highest-value check here: it would have caught the --wdth-*
  // table and the swap-protocol step on the day 25011cc landed.
  it('every backticked --token in CLAUDE.md resolves in globals.css', () => {
    const ALLOW = new Map([
      ['--color-blue-500', 'cited as an anti-pattern example of a raw colour token; deliberately not real'],
    ]);
    // next/font defines its own variable in JS, not in the stylesheet, so the
    // definition set is globals.css PLUS whatever app/fonts.ts exposes.
    const defined = new Set([...css.matchAll(/(--[a-z0-9-]+)\s*:/gi)].map((m) => m[1]));
    const exposed = fonts.match(/variable:\s*'(--[a-z0-9-]+)'/)?.[1];
    if (exposed) defined.add(exposed);
    const missing = [...new Set([...claude.matchAll(/`(--[a-z0-9-]+)`/gi)].map((m) => m[1]))]
      .filter((t) => !defined.has(t) && !ALLOW.has(t));
    expect(missing, `CLAUDE.md cites tokens that globals.css does not define: ${missing.join(', ')}`).toEqual([]);
  });

  // ── The scale table, both directions ─────────────────────────────────────
  const utilities = new Map(
    [...css.matchAll(/@utility\s+(text-[a-z0-9-]+)\s*\{([^}]*)\}/g)]
      .map(([, name, body]) => [name, body.match(/font-size:\s*([^;]+);/)?.[1]?.trim()])
      .filter(([, size]) => size),
  );
  const rows = new Map(
    [...typographySection.matchAll(/^\|\s*`(text-[a-z0-9-]+)`\s*\|\s*([^|]+)\|/gm)]
      .map(([, name, size]) => [name, size.trim()]),
  );

  it('every type-role utility has a row in the scale table', () => {
    expect([...rows.keys()].sort()).toEqual([...utilities.keys()].sort());
  });

  // The row's px range is checked against the real clamp, so a resize that
  // leaves the utility name alone still reddens this.
  // Sizes that name a --type-* token are resolved through the token, down to
  // rem. Until 14 Oct 2026 this read only literal rem, so every tokenised row
  // (five, then six when T4 tokenised text-cover) was skipped as "cannot
  // parse", and a stale text-cover row stayed green.
  const typeTokens = new Map(
    [...css.matchAll(/(--type-[a-z0-9-]+)\s*:\s*([^;]+);/g)].map(([, n, v]) => [n, v.trim()]),
  );
  const resolveType = (v, depth = 0) => {
    const m = v.trim().match(/^var\(\s*(--type-[a-z0-9-]+)\s*\)$/);
    return m && depth < 5 && typeTokens.has(m[1]) ? resolveType(typeTokens.get(m[1]), depth + 1) : v.trim();
  };
  const clampEnds = (v) => {
    const body = v.match(/^clamp\((.*)\)$/)?.[1];
    if (!body) return null;
    const args = [];
    let depth = 0, start = 0;
    for (let i = 0; i < body.length; i++) {
      if (body[i] === '(') depth++;
      else if (body[i] === ')') depth--;
      else if (body[i] === ',' && depth === 0) { args.push(body.slice(start, i)); start = i + 1; }
    }
    args.push(body.slice(start));
    return args.length === 3 ? [resolveType(args[0]), resolveType(args[2])] : null;
  };
  it('every row states the px range its utility actually renders', () => {
    const toPx = (rem) => Math.round(parseFloat(rem) * 16);
    const remOf = (v) => v.match(/^([\d.]+)rem$/)?.[1];
    for (const [name, raw] of utilities) {
      const size = resolveType(raw);
      const ends = clampEnds(size) ?? [size];
      const rems = ends.map(remOf);
      const expected = rems.every(Boolean) ? rems.map(toPx) : null;
      if (!expected) continue; // a size this test cannot parse is not a failure to state
      const stated = (rows.get(name).match(/\d+/g) ?? []).map(Number);
      for (const px of expected) {
        expect(stated, `CLAUDE.md's \`${name}\` row does not state ${px}px (utility is ${size})`).toContain(px);
      }
    }
  });

  // ── The gate counts in the canon table ───────────────────────────────────
  // canon.test.mjs checks that each row names a real spec and a real script.
  // It does not read the "— N checks" tail, which is how the type row sat at 9
  // while the linter ran 10.
  it('each canon row states the number of checks its linter runs', () => {
    for (const [, script, stated] of claude.matchAll(/`npm run (lint:[a-z]+)`\s*—\s*(\d+)\s*checks/g)) {
      const file = pkg.scripts[script]?.match(/(scripts\/[\w-]+\.mjs)/)?.[1];
      expect(file, `${script} is not a node script`).toBeTruthy();
      // IDs are written three ways in these scripts: add(2, …), add('8a', …)
      // and an add( that breaks the line before its id. All three, or the count
      // silently under-reports and this check passes while the table is wrong.
      const ids = new Set([...read(file).matchAll(/\badd\(\s*'?(\d+[ab]?)'?\s*,/gs)].map((m) => m[1]));
      expect(ids.size, `CLAUDE.md says ${script} runs ${stated} checks; it runs ${ids.size}`)
        .toBe(Number(stated));
    }
  });
});
