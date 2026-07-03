import type { Metadata } from 'next';
import { ResolutionBlock } from '@/components/show-work';
import { BentoTheme, BentoItem, BentoBand, BentoRibbon } from '@/components/bento';
import Resolutions01Bento from '@/components/case-studies/uscg-bard/Resolutions01Bento';
import Resolutions02Bento from '@/components/case-studies/uscg-bard/Resolutions02Bento';

// Private scratch route — the bento STRESS TEST. Mirrors the case-study shell
// (.case-study-article > .case-study-prose) so every band / rhythm / breakout
// rule resolves identically. Labeled grey placeholders prove GEOMETRY only:
// every count (2/3/4/5), the author-override compact trio, both breakouts, the
// per-row baseline-lock (shared rows pair a 1-line vs 2-line caption), the
// light/dark tone tiles, and the 2+1 mobile orphans. NOT real content — captions
// are lorem (02's header is the one real line). The live uscg-bard.mdx is untouched.
export const metadata: Metadata = {
  title: 'Sandbox · Bento stress test',
  robots: { index: false, follow: false },
};

// Captions stay short: a bold lead + a few muted gloss words. Exactly ONE 2-line
// gloss (GLOSS_2) lives in the Spine's tall trio (02) — the baseline-lock insurance
// (lg+ 3-up AND the mobile 2-up top pair).
const LEAD = 'Lorem ipsum';
const GLOSS = ' dolor sit';
const GLOSS_2 = ' dolor sit amet consectetur adipiscing elit sed';

export default function ShowTheWorkSandbox() {
  return (
    <article className="case-study-article">
      <div className="case-study-prose">
        {/* Resolutions section intro (eyebrow + HMW + role-line lede) + Theme 1 (01 · How you
            file). The count-2 geometry stress block that used to trail Theme 1 here was removed
            so 01 and 02 read adjacent; the remaining stress blocks (02–05) live below Theme 2. */}
        <section className="cs-section">
          <div className="eyebrow">The resolutions</div>

          <h2>How might every jurisdiction keep working its own way, and still add up to one current national picture?</h2>

          <p className="section-lede">
            As the sole designer, I had one hard constraint: unify the data without asking a single
            state to change how it files.
          </p>

          {/* Resolutions 01 — first theme beneath the section intro. Real content via the
              manifest → <BentoTheme> adapter (fixed-mix: light everything, dark map only).
              The grey GEOMETRY stress block below is separate.

              Header hierarchy is sandbox-scoped (engine/manifest untouched):
              • Label is a QUIET NUMERAL LOCKUP (numeral 01 + sentence-case "How you file"),
                NOT a second uppercase-tracked eyebrow. The section already owns one tracked
                eyebrow ("THE RESOLUTIONS"); a second one here — plus the repeated word
                "Resolutions" — was an AI-slop tell, so this sits in a different register:
                small, sentence-case, numeral-anchored. One tracked eyebrow per section, max.
              • Title is the block <h3>, styled to the prose `> h3` ramp — one step under the
                section <h2> on the SAME ramp (fluid clamp, wght 600, ramp tracking). Inlined
                because that prose rule is direct-child-scoped and this h3 is nested in .cs-section.
              Spacing is per-boundary (the section model is margin-collapse based):
              lede→lockup mt-24/40 (the one dramatic break, halves on mobile), lockup→title
              mt-2 (one unit), title→bento mb-10/14 (collapses with the figure's own 2rem top —
              the larger wins, so this stays exact). */}
          <div className="mt-24 md:mt-40 flex items-baseline gap-2 text-caption">
            <span className="font-semibold tabular-nums text-secondary">01</span>
            <span className="text-muted">How you file</span>
          </div>
          <h3
            className="mt-2 mb-10 md:mb-14"
            style={{
              fontSize: 'clamp(1.375rem, 1vw + 0.95rem, 1.625rem)',
              fontWeight: 600,
              letterSpacing: '-0.005em',
              lineHeight: 1.2,
            }}
          >
            Every state files differently. One set of filters reads them all.
          </h3>
          <Resolutions01Bento />
        </section>

        {/* Resolutions 02 — "How you see". Second real theme, its OWN section (distinct from
            the Theme-1 section above and from the grey GEOMETRY stress blocks below). Rendered
            through the generic ResolutionsBento adapter reading theme2-grid-manifest.json —
            all-light, per the 01-dark / 02-light / 03-dark rhythm. Header matches Theme 1's
            treatment: a quiet numeral lockup (02 · sentence-case "How you see") over a bold
            display title; one tracked eyebrow max, no stacked uppercase labels (the slop tell
            the council killed on 01).

            The lockup is this section's FIRST child, so `.cs-section > :first-child {
            margin-top: 0 }` (unlayered) would zero a plain mt-24. The `!` important restores
            Theme 1's dramatic preamble void (mt-24 md:mt-40) at a section-leading position;
            it collapses with the section break → ~6rem mobile / ~10rem desktop, matching 01. */}
        <section className="cs-section">
          {/* `!` beats the unlayered `.cs-section > :first-child { margin-top: 0 }` so this first-child lockup still gets the responsive preamble void — a required override, not a hack. */}
          <div className="mt-24! md:mt-40! flex items-baseline gap-2 text-caption">
            <span className="font-semibold tabular-nums text-secondary">02</span>
            <span className="text-muted">How you see</span>
          </div>
          <h3
            className="mt-2 mb-10 md:mb-14"
            style={{
              fontSize: 'clamp(1.375rem, 1vw + 0.95rem, 1.625rem)',
              fontWeight: 600,
              letterSpacing: '-0.005em',
              lineHeight: 1.2,
            }}
          >
            Every jurisdiction sees its own dashboard. One live source underneath.
          </h3>
          <Resolutions02Bento />
        </section>

        {/* 02 — count 5 SPINE → [wide, wide]/[tall, tall, tall] + trailing band.
            The two wides carry fixed light / dark tones (do NOT swap with theme). */}
        <section className="cs-section">
          <ResolutionBlock
            thread="02"
            headline={
              <>
                One engine keeps every screen current.
                <br />
                Not cranked once a year.
              </>
            }
            framing={null}
          >
            <BentoTheme>
              <BentoItem caption="Light design" tone="light" label="02 · wide · 16:10 · light" />
              <BentoItem caption="Dark design" tone="dark" label="02 · wide · 16:10 · dark" />
              <BentoItem caption={LEAD} gloss={GLOSS} label="02 · tall · 3:4" />
              <BentoItem caption={LEAD} gloss={GLOSS_2} label="02 · tall · 3:4" />
              <BentoItem caption={LEAD} gloss={GLOSS} label="02 · tall · 3:4" />
              <BentoBand aspect={4.9} label="02 · band · 4.9:1" />
            </BentoTheme>
          </ResolutionBlock>
        </section>

        {/* 03 — count 3 auto → [feature 16:10]/[standard 3:4, standard 3:4].
            Captions short; the 2-line insurance lives in 02. On mobile the standard
            pair goes 2-up (ratio-keyed), not towering full-width. */}
        <section className="cs-section">
          <ResolutionBlock
            thread="03"
            headline={
              <>
                Lorem ipsum dolor sit.
                <br />
                Count three, a feature.
              </>
            }
            framing={null}
          >
            <BentoTheme>
              <BentoItem caption={LEAD} gloss={GLOSS} label="03 · feature · 16:10" />
              <BentoItem caption={LEAD} gloss={GLOSS} label="03 · standard · 3:4" />
              <BentoItem caption={LEAD} gloss={GLOSS} label="03 · standard · 3:4" />
            </BentoTheme>
          </ResolutionBlock>
        </section>

        {/* 04 — count 4 auto → [wide, wide]/[standard, standard] + trailing ribbon 13:1. */}
        <section className="cs-section">
          <ResolutionBlock
            thread="04"
            headline={
              <>
                Lorem ipsum dolor sit.
                <br />
                Count four, plus a ribbon.
              </>
            }
            framing={null}
          >
            <BentoTheme>
              <BentoItem caption={LEAD} gloss={GLOSS} label="04 · wide · 16:10" />
              <BentoItem caption={LEAD} gloss={GLOSS} label="04 · wide · 16:10" />
              <BentoItem caption={LEAD} gloss={GLOSS} label="04 · standard · 3:4" />
              <BentoItem caption={LEAD} gloss={GLOSS} label="04 · standard · 3:4" />
              <BentoRibbon aspect={13} label="04 · ribbon · 13:1" />
            </BentoTheme>
          </ResolutionBlock>
        </section>

        {/* 05 — author override: three slot="compact" → [1:1, 1:1, 1:1] (bypasses the
            count-3 preset) + trailing ribbon 22:1. */}
        <section className="cs-section">
          <ResolutionBlock
            thread="05"
            headline={
              <>
                Lorem ipsum dolor sit.
                <br />
                Override: a compact trio.
              </>
            }
            framing={null}
          >
            <BentoTheme>
              <BentoItem slot="compact" caption={LEAD} gloss={GLOSS} label="05 · compact · 1:1" />
              <BentoItem slot="compact" caption={LEAD} gloss={GLOSS} label="05 · compact · 1:1" />
              <BentoItem slot="compact" caption={LEAD} gloss={GLOSS} label="05 · compact · 1:1" />
              <BentoRibbon aspect={22} label="05 · ribbon · 22:1" />
            </BentoTheme>
          </ResolutionBlock>
        </section>
      </div>
    </article>
  );
}
