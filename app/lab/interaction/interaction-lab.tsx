'use client';

/**
 * The client half of /lab/interaction: a specimen sheet for the shipped
 * interaction system. The server page renders this plus the fs-read lab.css.
 *
 * Renders the real shipped components in all four states (rest, hover,
 * pressed, focus-visible), in both themes, side by side. The non-rest states
 * are not hand-authored: after mount the page walks document.styleSheets,
 * finds the shipped rule for each state by selector, and applies that rule's
 * own declarations to the specimen. Whatever globals.css declares is what the
 * specimen shows; a hand-copied declaration would be a typed claim, and typed
 * claims drift.
 *
 * Not linked from the nav, not in the sitemap; the site is noindex globally.
 * This page is the one 'use client' surface the spike branch adds beyond the
 * slider prototype, and it changes no shipped component.
 */

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { CaseStudyCard } from '@/components/case-study-card';
import { caseStudies } from '@/app/data/case-studies';
import { ClientNav } from '@/components/client-nav';
import { ThemeToggle } from '@/components/theme-toggle';

/* ── CSSOM: find shipped rules, never retype them ─────────────────────── */

interface FoundRule {
  rule: CSSStyleRule;
  /** The single comma-split selector that matched. */
  selector: string;
  /** Enclosing at-rule conditions, outermost first. */
  conditions: string[];
  sheetName: string;
  sheetNode: CSSStyleSheet;
}

function sheetLabel(sheet: CSSStyleSheet): string {
  if (sheet.href) {
    try {
      return new URL(sheet.href).pathname.split('/').pop() ?? sheet.href;
    } catch {
      return sheet.href;
    }
  }
  return 'inline <style>';
}

/** Recursively collect every CSSStyleRule from same-origin stylesheets. */
function collectRules(): FoundRule[] {
  const out: FoundRule[] = [];
  const visit = (rules: CSSRuleList, sheet: CSSStyleSheet, conditions: string[]) => {
    for (const r of Array.from(rules)) {
      if (r instanceof CSSStyleRule) {
        for (const sel of r.selectorText.split(',')) {
          out.push({
            rule: r,
            selector: sel.trim(),
            conditions,
            sheetName: sheetLabel(sheet),
            sheetNode: sheet,
          });
        }
      } else if (r instanceof CSSMediaRule) {
        visit(r.cssRules, sheet, [...conditions, `@media ${r.conditionText}`]);
      } else if (r instanceof CSSSupportsRule) {
        visit(r.cssRules, sheet, [...conditions, `@supports ${r.conditionText}`]);
      } else if (typeof CSSLayerBlockRule !== 'undefined' && r instanceof CSSLayerBlockRule) {
        visit(r.cssRules, sheet, [...conditions, `@layer ${r.name}`]);
      }
    }
  };
  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules; // throws on cross-origin sheets
    } catch {
      continue;
    }
    visit(rules, sheet as CSSStyleSheet, []);
  }
  return out;
}

function stripStatePseudos(selector: string): string {
  return selector
    .replace(/:(hover|active|focus-visible|focus-within)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** One source rule a forced state derives from. */
interface StateSource {
  /** Exact comma-split selector to find, as authored in globals.css. */
  find: string;
  /** Where to apply it, relative to the cell; defaults to find minus pseudos. */
  applyTo?: string;
}

interface AppliedSource {
  find: string;
  matched: boolean;
  declarations: string[];
  provenance: string;
  targetMissing?: boolean;
}

/** Locate the matched selector inside its stylesheet's text for provenance. */
async function locateInSheet(found: FoundRule): Promise<string> {
  let text: string | null = null;
  const node = found.sheetNode.ownerNode;
  if (node instanceof HTMLStyleElement) {
    text = node.textContent;
  } else if (found.sheetNode.href) {
    try {
      const res = await fetch(found.sheetNode.href);
      if (res.ok) text = await res.text();
    } catch {
      text = null;
    }
  }
  if (!text) return '';
  const idx = text.indexOf(found.selector);
  if (idx < 0) return '';
  const line = text.slice(0, idx).split('\n').length;
  return line === 1 && !text.includes('\n')
    ? ` at char ${idx} (minified, single line)`
    : ` line ${line}`;
}

function applySources(
  cell: HTMLElement,
  sources: StateSource[],
  all: FoundRule[],
  report: (results: AppliedSource[]) => void,
) {
  const results: AppliedSource[] = [];
  const pending: Promise<void>[] = [];
  for (const src of sources) {
    const matches = all.filter((f) => f.selector === src.find);
    if (matches.length === 0) {
      results.push({ find: src.find, matched: false, declarations: [], provenance: '' });
      continue;
    }
    for (const found of matches) {
      const target = src.applyTo ?? stripStatePseudos(found.selector);
      const els = target ? Array.from(cell.querySelectorAll<HTMLElement>(target)) : [];
      // Parse cssText rather than enumerating style[i]: a shorthand whose
      // value contains var() (border-color: var(--border-strong)) is stored as
      // a pending substitution, so its longhands enumerate with empty values
      // and would apply as nothing.
      const declarations: string[] = [];
      for (const decl of found.rule.style.cssText.split(';')) {
        const colon = decl.indexOf(':');
        if (colon < 0) continue;
        const prop = decl.slice(0, colon).trim();
        let value = decl.slice(colon + 1).trim();
        if (!prop || !value) continue;
        const important = /\s*!important$/.test(value);
        if (important) value = value.replace(/\s*!important$/, '');
        declarations.push(`${prop}: ${value}`);
        for (const el of els) {
          el.style.setProperty(prop, value, important ? 'important' : '');
        }
      }
      const entry: AppliedSource = {
        find: src.find,
        matched: declarations.length > 0,
        declarations,
        targetMissing: els.length === 0,
        provenance:
          `${found.selector}` +
          (found.conditions.length ? ` in ${found.conditions.join(' > ')}` : '') +
          ` (${found.sheetName})`,
      };
      results.push(entry);
      pending.push(
        locateInSheet(found).then((loc) => {
          if (loc) entry.provenance += loc;
        }),
      );
    }
  }
  Promise.allSettled(pending).then(() => report([...results]));
  report(results);
}

/**
 * Theme-fidelity check for one cell. The page shows both themes at once, but
 * the document itself is only ever in one. Rules scoped to html.dark cannot
 * reach inside a div.dark wrapper when the document is light, and they leak
 * into the light column when the document is dark, as do .dark descendant
 * rules. Report both directions instead of rendering a quiet lie.
 */
function findThemeFidelityIssues(
  cell: HTMLElement,
  all: FoundRule[],
  column: 'light' | 'dark',
): string[] {
  const htmlIsDark = document.documentElement.classList.contains('dark');
  const out: string[] = [];
  for (const f of all) {
    const isHtmlDark = f.selector.startsWith('html.dark');
    const isDarkDescendant = /^\.dark[\s.]/.test(f.selector);
    if (!isHtmlDark && !isDarkDescendant) continue;
    const remainder = f.selector.replace(/^(html\.dark|\.dark)\s*/, '').trim();
    if (!remainder) continue;
    let matches = false;
    try {
      matches = cell.querySelector(remainder) !== null;
    } catch {
      continue;
    }
    if (!matches) continue;
    if (column === 'dark' && isHtmlDark && !htmlIsDark) {
      out.push(`${f.selector} is scoped to html.dark and cannot reach inside this div.dark wrapper`);
    }
    if (column === 'light' && htmlIsDark) {
      out.push(`${f.selector} leaks into this light column because the document theme is dark`);
    }
  }
  return [...new Set(out)];
}

/**
 * When the document theme is dark, the light column re-applies the :root
 * custom properties, read from the stylesheets, so light tokens resolve
 * inside it. A read, not a hand-copy.
 */
function applyRootTokens(wrapper: HTMLElement, all: FoundRule[]): number {
  let count = 0;
  for (const f of all) {
    if (f.selector !== ':root' && f.selector !== ':host') continue;
    if (f.selector === ':host') continue;
    for (let i = 0; i < f.rule.style.length; i += 1) {
      const prop = f.rule.style[i];
      if (!prop.startsWith('--')) continue;
      wrapper.style.setProperty(prop, f.rule.style.getPropertyValue(prop));
      count += 1;
    }
  }
  return count;
}

/* ── Specimen cells ───────────────────────────────────────────────────── */

const STATE_NAMES = ['rest', 'hover', 'pressed', 'focus-visible'] as const;
type StateName = (typeof STATE_NAMES)[number];

interface Specimen {
  id: string;
  title: string;
  note?: string;
  states: Partial<Record<Exclude<StateName, 'rest'>, StateSource[]>>;
  render: () => ReactNode;
}

function StateCell({
  specimen,
  state,
  darkColumn,
}: {
  specimen: Specimen;
  state: StateName;
  darkColumn: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [applied, setApplied] = useState<AppliedSource[] | null>(null);
  const [fidelity, setFidelity] = useState<string[]>([]);

  useEffect(() => {
    const cell = ref.current;
    if (!cell) return;
    const all = collectRules();
    if (state !== 'rest') {
      const sources = specimen.states[state] ?? [];
      applySources(cell, sources, all, setApplied);
    }
    setFidelity(findThemeFidelityIssues(cell, all, darkColumn ? 'dark' : 'light'));
  }, [specimen, state, darkColumn]);

  const failures = (applied ?? []).filter((a) => !a.matched);

  return (
    <div className="flex flex-col gap-2">
      <div
        ref={ref}
        className="lab-cell"
      >
        {specimen.render()}
      </div>
      <p className="text-caption text-muted">{state}</p>
      {state !== 'rest' && applied === null ? (
        <p className="text-caption text-muted">reading source rules...</p>
      ) : null}
      {failures.length > 0 ? (
        <div
          className="lab-fail">
          <p className="text-caption text-primary font-semibold">
            No source rule matched. This cell is showing rest, not {state}.
          </p>
          {failures.map((f) => (
            <p key={f.find} className="text-caption text-primary">
              unmatched selector: {f.find}
            </p>
          ))}
        </div>
      ) : null}
      {(applied ?? [])
        .filter((a) => a.matched)
        .map((a) => (
          <div key={a.provenance + a.find}>
            <p className="text-caption text-muted">read from {a.provenance}</p>
            {a.targetMissing ? (
              <p className="text-caption text-primary font-semibold">
                Source rule found but no element in this cell matches its target.
              </p>
            ) : null}
            {a.declarations.map((d) => (
              <p key={d} className="text-caption text-secondary">
                {d}
              </p>
            ))}
          </div>
        ))}
      {fidelity.length > 0 ? (
        <div>
          <p className="text-caption text-primary font-semibold">
            Not a fully faithful render for this surface:
          </p>
          {fidelity.map((s) => (
            <p key={s} className="text-caption text-secondary">
              {s}.
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/* ── Token table: values read at runtime, never typed ─────────────────── */

const TOKENS = [
  '--duration-control',
  '--duration-card',
  '--duration-theme',
  '--duration-reveal',
  '--ease-out-soft',
  '--ease-out-quint',
  '--shadow-rest',
  '--shadow-hover',
  '--focus-ring',
  '--focus-glow',
  '--border-subtle',
  '--border-strong',
  '--radius-xs',
  '--radius-s',
  '--radius-m',
  '--radius-l',
  '--radius-image',
];

function TokenTable() {
  const probeRef = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    const probe = probeRef.current;
    if (!probe) return;
    const read = () => {
      const style = getComputedStyle(probe);
      const next: Record<string, string> = {};
      for (const t of TOKENS) next[t] = style.getPropertyValue(t).trim() || '(unset)';
      setValues(next);
    };
    // Child effects run before the parent column's retokening effect, so the
    // first read is deferred a tick, and re-runs when the column wrapper's
    // inline tokens change (theme flip, retokening).
    const id = setTimeout(read, 0);
    const wrapper = probe.closest('.lab-panel');
    const observer = new MutationObserver(read);
    if (wrapper) observer.observe(wrapper, { attributes: true, attributeFilter: ['style', 'class'] });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => {
      clearTimeout(id);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={probeRef}>
      {values === null ? (
        <p className="text-caption text-muted">reading computed values...</p>
      ) : (
        <dl className="lab-tokens">
          {TOKENS.map((t) => (
            <div key={t}>
              <dt className="text-caption text-secondary">{t}</dt>
              <dd className="text-caption text-primary">{values[t]}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

/* ── The specimens: real shipped components and verbatim inline surfaces ─ */

const study = caseStudies[0];

const SPECIMENS: Specimen[] = [
  {
    id: 'case-card',
    title: 'The case study card lifts, tightens its border, and sinks on press.',
    states: {
      'hover': [
        { find: '.case-card--linked:hover' },
        { find: '.case-card--linked:focus-within' },
        { find: '.case-card__title-link:hover', applyTo: '.case-card__title-link' },
      ],
      pressed: [{ find: '.case-card--linked:active' }],
      'focus-visible': [
        { find: ':focus-visible', applyTo: '.case-card__title-link' },
        { find: '.case-card--linked:focus-within' },
      ],
    },
    render: () => (
      <div className="lab-card-well">
        <CaseStudyCard study={study} />
      </div>
    ),
  },
  {
    id: 'work-band',
    title: 'The work band shifts its arrow and underlines its label.',
    note: 'The work band is an inline anchor in app/about/page.tsx, not a component; its markup is reproduced verbatim here.',
    states: {
      'hover': [
        { find: '.about-work-band:hover .about-work-band__arrow' },
        { find: '.about-work-band:hover .about-work-band__label' },
      ],
      pressed: [{ find: '.about-work-band:active' }],
      'focus-visible': [{ find: ':focus-visible', applyTo: '.about-work-band' }],
    },
    render: () => (
      <Link className="about-work-band" href="/#selected-work">
        <span className="about-work-band__label text-h3">See selected work</span>
        <ArrowRight
          className="icon text-h3 about-work-band__arrow"
          aria-hidden="true"
          focusable="false"
        />
      </Link>
    ),
  },
  {
    id: 'about-btn',
    title: 'The about button responds on hover and sinks on press.',
    note: 'The about button is an inline anchor in app/about/page.tsx, not a component; its markup is reproduced verbatim here.',
    states: {
      'hover': [{ find: '.about-btn:hover' }],
      pressed: [{ find: '.about-btn:active' }],
      'focus-visible': [{ find: ':focus-visible', applyTo: '.about-btn' }],
    },
    render: () => (
      <a
        className="about-btn"
        href="/Paul-Kali-Resume-2026.pdf"
        target="_blank"
        rel="noopener"
        download
      >
        Résumé (PDF)
        <ArrowDown className="icon about-btn__icon" aria-hidden="true" focusable="false" />
      </a>
    ),
  },
  {
    id: 'nav-link',
    title: 'Nav links carry a two channel hover and sink on press.',
    states: {
      'hover': [{ find: '.nav-link:hover' }],
      pressed: [{ find: '.nav-link:active' }],
      'focus-visible': [{ find: ':focus-visible', applyTo: '.nav-link' }],
    },
    render: () => <ClientNav />,
  },
  {
    id: 'theme-toggle',
    title: 'The theme toggle responds on hover and sinks on press.',
    states: {
      'hover': [{ find: '.theme-toggle:hover' }],
      pressed: [{ find: '.theme-toggle:active' }],
      'focus-visible': [{ find: ':focus-visible', applyTo: '.theme-toggle' }],
    },
    render: () => <ThemeToggle />,
  },
];

function ThemeColumn({ theme }: { theme: 'light' | 'dark' }) {
  const dark = theme === 'dark';
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [retokened, setRetokened] = useState<number | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || dark) return;
    const fix = () => {
      if (document.documentElement.classList.contains('dark')) {
        setRetokened(applyRootTokens(wrapper, collectRules()));
      } else {
        wrapper.removeAttribute('style');
        setRetokened(null);
      }
    };
    fix();
    const observer = new MutationObserver(fix);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [dark]);

  return (
    <div ref={wrapperRef} className={dark ? 'dark lab-panel' : 'lab-panel'}>
      <h2 className="text-h3 text-primary">
        {dark ? 'The same surfaces in dark.' : 'Every state, read from the shipped rules.'}
      </h2>
      {retokened !== null ? (
        <p className="text-caption text-muted">
          The document theme is dark, so this column re-applies the {retokened} custom
          properties read from the :root block to resolve light tokens here. Rules scoped
          to .dark or html.dark still leak in; affected cells say so below.
        </p>
      ) : null}
      <div className="lab-stack">
        {SPECIMENS.map((s) => (
          <section key={s.id} aria-label={s.title}>
            <h3 className="text-body text-primary font-semibold">{s.title}</h3>
            {s.note ? <p className="text-caption text-muted">{s.note}</p> : null}
            <div className="lab-mt-s grid gap-6 lg:grid-cols-2">
              {STATE_NAMES.map((state) => (
                <StateCell key={state} specimen={s} state={state} darkColumn={dark} />
              ))}
            </div>
          </section>
        ))}
        <section aria-label="Token values">
          <h3 className="text-body text-primary font-semibold">
            Token values, read with getComputedStyle in this column.
          </h3>
          <div className="lab-mt-s">
            <TokenTable />
          </div>
        </section>
      </div>
    </div>
  );
}

export function InteractionLab() {
  return (
    <div className="lab-page">
      <h1 className="text-h1 text-primary">The interaction system, measured.</h1>
      <p className="text-body text-secondary lab-mt-s lab-prose">
        Each specimen below is the real shipped component. The hover, pressed, and
        focus-visible cells are forced by reading the shipped rule out of the live
        stylesheets and applying its own declarations; nothing here is typed by hand.
        Every label names the rule it was read from. A cell that cannot find its source
        rule says so instead of quietly showing rest.
      </p>
      <div className="lab-columns">
        <ThemeColumn theme="light" />
        <ThemeColumn theme="dark" />
      </div>
    </div>
  );
}
