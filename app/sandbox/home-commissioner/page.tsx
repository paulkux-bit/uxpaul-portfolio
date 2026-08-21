import { notFound } from 'next/navigation';
import Home from '@/app/page';
import { commissioner } from '../type-commissioner/fonts';
import './home-commissioner.css';

/**
 * SANDBOX — /sandbox/home-commissioner
 *
 * The home page, in Commissioner. This is the surface /sandbox/type-commissioner
 * could only proxy: the 340/720 signature lives in the home h1 and nowhere else
 * that ships, so a controlled specimen of it is an argument about a specimen.
 * This is the page.
 *
 * IT IMPORTS `app/page.tsx` RATHER THAN COPYING IT, and that is the whole design
 * of this file. A copied home page is correct on the day it is made and drifts
 * every time the real one changes - and it drifts silently, because a stale copy
 * still renders. Importing the default export means this route cannot disagree
 * with production about what the home page is. If `app/page.tsx` changes, this
 * changes with it or fails to compile.
 *
 * The font is applied by class on the wrapper and inherits down, so no rule in
 * globals.css is touched and the same DOM renders in either face.
 *
 * TWO LIMITS, both real, neither fixable from inside this route:
 *
 *   the header and footer stay Bricolage. They are rendered by the ROOT layout,
 *   outside this subtree, so the wrapper's font-family never reaches them. The
 *   wordmark in particular is a reading-rung role at 16px and it will look like
 *   the old site sitting on top of the new one. That is an artefact of where the
 *   route sits, not a judgement about the wordmark.
 *
 *   every font-stretch inherited from globals.css goes INERT rather than wrong.
 *   Commissioner has no wdth axis, so the browser ignores a width request
 *   instead of failing it. The page will look plausible while three band
 *   decisions silently do nothing, which is exactly why the probe below reports
 *   rather than assumes.
 *
 * Not linked from anywhere. Deletes with the spike.
 */

export const metadata = {
  title: 'Home sandbox: Commissioner',
  robots: { index: false, follow: false },
};

export default function HomeCommissionerSandbox() {
  if (process.env.VERCEL_ENV === 'production') notFound();

  return (
    <div className={`cmsr-home ${commissioner.variable}`} id="cmsr-home-root" data-face="commissioner">
      <div className="cmsr-home__probe" id="cmsr-home-probe" />

      <Home />

      <div className="cmsr-home__bar">
        <span className="cmsr-home__lg">face</span>
        <button type="button" data-val="commissioner" aria-pressed="true">
          Commissioner
        </button>
        <button type="button" data-val="bricolage" aria-pressed="false">
          Bricolage
        </button>
        <span className="cmsr-home__lg">signature</span>
        <button type="button" data-key="sig" data-val="720" aria-pressed="true">
          340 / 720
        </button>
        <button type="button" data-key="sig" data-val="820" aria-pressed="false">
          340 / 820
        </button>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){
var root=document.getElementById('cmsr-home-root');
var bar=root&&root.querySelector('.cmsr-home__bar');
if(!root||!bar)return;
bar.addEventListener('click',function(e){
  var b=e.target.closest('button[data-val]');if(!b)return;
  var key=b.getAttribute('data-key')||'face';
  bar.querySelectorAll('button[data-val]').forEach(function(o){
    if((o.getAttribute('data-key')||'face')===key)o.setAttribute('aria-pressed',String(o===b));
  });
  root.setAttribute('data-'+key,b.getAttribute('data-val'));
});
/* Same probe as the type sandbox, same two corrections: a terminal-rich
   lowercase string because flare barely moves a caps-heavy one, and no claim
   about VOLM, which does not change advance width at all. */
function w(fvs){
  var s=document.createElement('span');
  s.textContent='nnnnnnnnnnnnnnnn';s.setAttribute('aria-hidden','true');
  s.style.cssText='position:absolute;left:-9999px;top:0;white-space:nowrap;font-size:200px;font-weight:400;font-family:'+getComputedStyle(root).getPropertyValue('font-family').trim()+';font-variation-settings:'+fvs;
  document.body.appendChild(s);var x=s.getBoundingClientRect().width;s.remove();return x;
}
function probe(){
  if(root.getAttribute('data-face')!=='commissioner')return;
  var a=w("'FLAR' 0"),b2=w("'FLAR' 100");
  if(Math.abs(a-b2)>2)return;
  var el=document.getElementById('cmsr-home-probe');
  el.setAttribute('data-failed','true');
  el.textContent='FLAR is not rendering ('+a.toFixed(1)+'px against '+b2.toFixed(1)+'px). The page below is Commissioner with no voice axis. Judge nothing until it clears.';
}
if(document.fonts&&document.fonts.ready){document.fonts.ready.then(probe).catch(function(){});}else{setTimeout(probe,1200);}
})();`,
        }}
      />
    </div>
  );
}
