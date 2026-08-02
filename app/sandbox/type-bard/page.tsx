import MDXContent from '@/app/content/case-studies/uscg-bard.mdx';
import './type-exp.css';

/**
 * SANDBOX — /sandbox/type-bard
 *
 * Typography experiment bench for the Bard case study. Renders the REAL
 * uscg-bard.mdx inside the real case-study shell, with one extra class
 * (`type-exp`) on the article root. Every proposed change lives in
 * ./type-exp.css, scoped under that class — production markup and
 * production styles are untouched.
 *
 * The fixed pill (bottom right) toggles `type-exp` on/off so current vs
 * proposed can be compared on identical content, live, in either theme.
 *
 * Thesis under test (see the CSS header for the full argument):
 *   1. The width axis should perform the story's arc — tense in the
 *      problem half, released in the resolution half.
 *   2. Bricolage's thin display cut (flared stems against ink traps)
 *      should appear at least once; today the page never goes below 520
 *      at display size.
 *   3. Body emphasis is browser-default 700 — unchosen; calm it to 600
 *      and add dark-mode weight compensation.
 *
 * Not linked from anywhere; delete after decisions graduate into
 * globals.css (or are rejected).
 */

export const metadata = {
  title: 'Type sandbox: Bard',
  robots: { index: false, follow: false },
};

/**
 * A <div>, not a <main>: the root layout already owns the page's single
 * <main id="main"> landmark, and <main> cannot nest inside <main>.
 */
export default function TypeBardSandbox() {
  return (
    <div className="case-study-page">
      <article className="case-study-article type-exp" id="type-exp-root">
        <div className="case-study-prose">
          <MDXContent />
        </div>
      </article>

      <button type="button" id="type-exp-toggle" className="type-exp-pill" aria-pressed="true">
        type: proposed
      </button>

      {/* Tiny inline toggle — sandbox-only, no client component needed. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){var b=document.getElementById('type-exp-toggle'),r=document.getElementById('type-exp-root');if(!b||!r)return;b.addEventListener('click',function(){var on=r.classList.toggle('type-exp');b.textContent='type: '+(on?'proposed':'current');b.setAttribute('aria-pressed',String(on));});})();`,
        }}
      />
    </div>
  );
}
