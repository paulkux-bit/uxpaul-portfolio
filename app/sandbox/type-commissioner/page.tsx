import { notFound } from 'next/navigation';
import MDXContent from '@/app/content/case-studies/uscg-bard.mdx';
import { commissioner } from './fonts';
import './type-commissioner.css';

/**
 * SANDBOX — /sandbox/type-commissioner
 *
 * The Commissioner spike. Follows the /sandbox/type-bard pattern exactly:
 * the REAL uscg-bard.mdx inside the real case-study shell, one extra class on
 * the root, every proposed rule scoped under it, production markup and
 * production styles untouched.
 *
 * WHAT THIS IS FOR. The feasibility study answered the measurement questions
 * from the binaries — the axes, the avar map, the metrics, the payload, the
 * missing figure features. It could not answer the judgment questions, and no
 * amount of further measurement will. This page is the judgment instrument and
 * nothing else. Five toggles, real copy, both modes:
 *
 *   1  display voice   candidate FLAR/VOLM pairs, including the designer's own
 *                      two named locations, Flare (100/0) and Loud (100/100)
 *   2  reading voice   FLAR 0 against 10 and 20 — does prose keep family
 *                      character, or do rungs 0-2 read as a different typeface
 *                      from rungs 5-6
 *   3  body size       18px against 19px, with a Bricolage column beside it
 *   4  rung 0          caption and eyebrow at the sizes that pull apart
 *   5  signature       340/720 against 340/820, at 40, 72 and 88px, with a `g`
 *
 * WHAT IT IS NOT. Not a migration, not a proposal, and not a decision. Nothing
 * here touches globals.css, no token is added, no lint assertion changes. If the
 * answers come back wrong the whole thing deletes in one commit and the only
 * trace is this directory going away.
 *
 * ONE HONEST LIMIT, stated because a spike that oversells itself is worse than
 * no spike. This page renders ONE case study. It cannot tell you whether the
 * home hero survives, because the 340/720 signature lives there and on the about
 * opener, neither of which is a case study — hence the specimen panel, which is
 * a controlled proxy and not the real page. It also cannot tell you what five
 * shipped studies look like in Commissioner, because two of the five are still
 * unwritten. Read a good result here as "worth continuing", never as "decided".
 */

export const metadata = {
  title: 'Type sandbox: Commissioner',
  robots: { index: false, follow: false },
};

/** Lowercase `g` in both strings, deliberately — see the CSS. */
const SIG_SIZES = [
  { cls: 'sig--40', label: '40px, the rule floor' },
  { cls: 'sig--72', label: '72px, rung 5 ceiling' },
  { cls: 'sig--88', label: '88px, rung 6 ceiling' },
];

const BODY_SPECIMEN =
  'Fifty-six jurisdictions filed the same report and none of them agreed on what a ' +
  'boating accident was. The data was there. The system could not speak it. Reading ' +
  'this paragraph at length is the only test that matters for a body face, because ' +
  'the eye forgives a specimen and does not forgive a page.';

/**
 * A <div>, not a <main>: the root layout already owns the page's single
 * <main id="main"> landmark, and <main> cannot nest inside <main>.
 */
export default function TypeCommissionerSandbox() {
  if (process.env.VERCEL_ENV === 'production') notFound();

  return (
    <div
      className={`cmsr ${commissioner.variable}`}
      id="cmsr-root"
      data-face="commissioner"
      data-voice="soft"
      data-read="0"
      data-body="18"
      data-r0="unified"
      data-sig="720"
    >
      <div className="cmsr-probe" id="cmsr-probe" />

      {/* ── 5 · The signature ─────────────────────────────────────── */}
      <section className="spec">
        <p className="spec__label">1. The signature, 340 against 720</p>
        {SIG_SIZES.map((s) => (
          <div key={s.cls}>
            <p className="spec__cellLabel">{s.label}</p>
            <p className={`sig ${s.cls}`}>
              The engine <b>argues</b> with the shape of the thing
            </p>
          </div>
        ))}
        <p className="spec__note">
          Two independent failure modes. The light half has no help. Bricolage flares its light
          stems by design to hold weight against the ink traps and Commissioner has no such
          compensation, so 340 sits at a large size in the plain voice with flared display all
          around it. The heavy half has a documented drawing weakness in exactly this range.
          Toggle to 820 and read them together: 820 restores the contrast span the pair loses to
          the non-linear weight axis, and makes the counters worse while doing it.
        </p>
      </section>

      {/* ── 3 · Body size ─────────────────────────────────────────── */}
      <section className="spec spec-body">
        <p className="spec__label">2. Body size, Bricolage against Commissioner</p>
        <div className="spec__row spec__row--pair">
          <div className="spec__cell spec-body--bricolage">
            <p className="spec__cellLabel">Bricolage, 18px, production today</p>
            <p>{BODY_SPECIMEN}</p>
          </div>
          <div className="spec__cell spec-body--commissioner">
            <p className="spec__cellLabel">Commissioner, at the toggled size</p>
            <p>{BODY_SPECIMEN}</p>
          </div>
        </div>
        <p className="spec__note">
          Matching x-height puts body at 18.76px, which rounds to 19. That is arithmetic, not a
          ruling. Cap-height moves the other way, roughly 8% larger, so matching lowercase makes
          capitals bigger still. Matching x-height, matching cap-height, and re-judging from render
          are three defensible answers and this comparison is how you pick between them.
        </p>
      </section>

      {/* ── 4 · Rung 0 ────────────────────────────────────────────── */}
      <section className="spec spec-r0">
        <p className="spec__label">3. Rung 0, where one value stops serving two roles</p>
        <div className="spec__row spec__row--pair">
          <div className="spec__cell">
            <p className="spec__cellLabel">Caption, lowercase</p>
            <p className="r0-caption">
              The projection panel, showing the modelled season against the five years behind it.
              Lowercase at small size is the case for raising the floor.
            </p>
          </div>
          <div className="spec__cell">
            <p className="spec__cellLabel">Eyebrow, all caps</p>
            <p className="r0-eyebrow">What it took</p>
            <p className="r0-caption">
              The same rung, set in capitals. Commissioner&rsquo;s caps run ~8% larger relative to
              em, so the size that rescues the caption inflates this one.
            </p>
          </div>
        </div>
        <p className="spec__note">
          If the split reads as correct, rung 0 stops being one rung and §2&rsquo;s floor becomes a
          lowercase rule with a stated caps exception. That is a ruling change, not a value change,
          and it is the cleanest example of the typeface forcing one.
        </p>
      </section>

      {/* ── Slant, shown once ─────────────────────────────────────── */}
      <section className="spec">
        <p className="spec__label">4. Slant, which is not the answer to emphasis</p>
        <div className="spec__row spec__row--pair">
          <div className="spec__cell">
            <p className="spec__cellLabel">Upright</p>
            <p className="r0-caption" style={{ fontSize: '1.125rem', color: 'var(--text-primary)' }}>
              a single gauge, and a good agreement
            </p>
          </div>
          <div className="spec__cell">
            <p className="spec__cellLabel">slnt −8</p>
            <p
              className="r0-caption spec-slnt-slanted"
              style={{ fontSize: '1.125rem', color: 'var(--text-primary)' }}
            >
              a single gauge, and a good agreement
            </p>
          </div>
        </div>
        <p className="spec__note">
          A pure shear. No outline is redrawn, so the lowercase g and a stay double-storey where a humanist
          sans wants single-storey shapes. Emphasis stays on weight regardless; the only open
          question is whether slant earns a place in a standfirst or a pull quote.
        </p>
      </section>

      {/* ── 1 + 2 · The real page ─────────────────────────────────── */}
      <section className="spec">
        <p className="spec__label">5. The real BARD study, under the voice system</p>
        <p className="spec__note">
          Everything below is the shipped MDX in the shipped shell. Read it for the two questions a
          specimen cannot answer: whether the display voice does what width used to do, and whether
          the site still looks like the site.
        </p>
      </section>

      <div className="case-study-page">
        <article className="case-study-article">
          <div className="case-study-prose">
            <MDXContent />
          </div>
        </article>
      </div>

      {/* Sandbox-only controls. Inline vanilla, no client component, same as
          /sandbox/type-bard — a scratch page should not add a React island. */}
      <div className="cmsr-controls" id="cmsr-controls">
        <fieldset data-key="face">
          <span className="lg">face</span>
          <button type="button" data-val="commissioner" aria-pressed="true">Commissioner</button>
          <button type="button" data-val="bricolage" aria-pressed="false">Bricolage</button>
        </fieldset>
        <fieldset data-key="voice">
          <span className="lg">display voice</span>
          <button type="button" data-val="off" aria-pressed="false">off</button>
          <button type="button" data-val="soft" aria-pressed="true">40/70</button>
          <button type="button" data-val="flare" aria-pressed="false">Flare</button>
          <button type="button" data-val="loud" aria-pressed="false">Loud</button>
        </fieldset>
        <fieldset data-key="read">
          <span className="lg">reading voice</span>
          <button type="button" data-val="0" aria-pressed="true">0</button>
          <button type="button" data-val="10" aria-pressed="false">10</button>
          <button type="button" data-val="20" aria-pressed="false">20</button>
        </fieldset>
        <fieldset data-key="body">
          <span className="lg">body</span>
          <button type="button" data-val="18" aria-pressed="true">18px</button>
          <button type="button" data-val="19" aria-pressed="false">19px</button>
        </fieldset>
        <fieldset data-key="r0">
          <span className="lg">rung 0</span>
          <button type="button" data-val="unified" aria-pressed="true">14/14</button>
          <button type="button" data-val="split" aria-pressed="false">15/13</button>
          <button type="button" data-val="split14" aria-pressed="false">15/14</button>
        </fieldset>
        <fieldset data-key="sig">
          <span className="lg">signature</span>
          <button type="button" data-val="720" aria-pressed="true">340/720</button>
          <button type="button" data-val="820" aria-pressed="false">340/820</button>
        </fieldset>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){
var root=document.getElementById('cmsr-root'),bar=document.getElementById('cmsr-controls');
if(!root||!bar)return;
bar.addEventListener('click',function(e){
  var b=e.target.closest('button[data-val]');if(!b)return;
  var fs=b.closest('fieldset[data-key]');if(!fs)return;
  var key=fs.getAttribute('data-key');
  fs.querySelectorAll('button[data-val]').forEach(function(o){o.setAttribute('aria-pressed',String(o===b));});
  root.setAttribute('data-'+key,b.getAttribute('data-val'));
});
/* Assertion 8b, local copy — and NOT the technique the feasibility
   study proposes. Two things were measured on this page before it was
   written down, and both change the design:

   1. THE STRING MATTERS BY 7x. Flare deforms terminals, so the probe
      string has to be full of them. Measured in Chromium at FLAR 0
      against 100: 'HAMBURGEFONTSIV' moves 0.20% because it is
      caps-heavy and caps carry few terminals; a run of lowercase n
      moves 1.48%. The pangram is the intuitive choice and it is the
      wrong one — at 64px it yields a 1.3px delta, which is close
      enough to measurement noise that a 0.5px threshold is luck
      rather than a test.

   2. VOLM CANNOT BE PROBED THIS WAY AT ALL. Volume changes serif
      SHAPE, not advance width: the delta between VOLM 0 and VOLM 100
      is exactly 0.00px at every size and string tried. So an
      advance-width check would pass a file with FLAR and no VOLM and
      report success. This is stated rather than solved. The mitigation
      is structural: VOLM is inert without FLAR, and both arrive from
      the same axes array in the same file, so FLAR rendering is
      strong evidence the multi-axis build was served. It is evidence,
      not proof, and assertion 8b should say so rather than imply a
      coverage it does not have. */
function widthAt(fam,fvs){
  var s=document.createElement('span');
  s.textContent='nnnnnnnnnnnnnnnn';
  s.setAttribute('aria-hidden','true');
  s.style.cssText='position:absolute;left:-9999px;top:0;white-space:nowrap;font-size:200px;font-weight:400;font-family:'+fam+';font-variation-settings:'+fvs;
  document.body.appendChild(s);
  var w=s.getBoundingClientRect().width;s.remove();return w;
}
function probe(){
  var fam=getComputedStyle(root).getPropertyValue('font-family').trim();
  if(!fam)return;
  var flat=widthAt(fam,"'FLAR' 0"),flared=widthAt(fam,"'FLAR' 100");
  var ok=Math.abs(flat-flared)>2;
  var el=document.getElementById('cmsr-probe');
  root.setAttribute('data-axes',String(ok));
  if(!ok&&el){
    el.setAttribute('data-failed','true');
    el.textContent='FLAR is not rendering ('+flat.toFixed(1)+'px against '+flared.toFixed(1)+'px at FLAR 0 and 100, 200px type). Every voice decision on this page is inert in this state. Judge nothing until it clears, and check the axes array in ./fonts.ts.';
  }
}
if(document.fonts&&document.fonts.ready){document.fonts.ready.then(probe).catch(function(){});}else{setTimeout(probe,1200);}
})();`,
        }}
      />
    </div>
  );
}
