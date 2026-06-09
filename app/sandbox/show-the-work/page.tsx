import type { Metadata } from 'next';
import { ResolutionBlock } from '@/components/show-work';
import { BentoTheme, BentoItem } from '@/components/bento';

// Private scratch route for iterating the "Show the Work" layout. Mirrors the
// real case-study shell (.case-study-article > .case-study-prose) so every band /
// rhythm / breakout rule resolves identically; the live uscg-bard.mdx is untouched.
// noindex — this is a design sandbox, not a shipped page.
export const metadata: Metadata = {
  title: 'Sandbox · Show the Work',
  robots: { index: false, follow: false },
};

// PARKED for the PopUp annotation layer (NOT rendered — keyed by surface src).
// The glance layer carries the short two-part caption; these first-person
// decision-claims become PopUp annotations on the real-MDX port.
const ENGINE_CLAIMS: Record<string, string> = {
  report: 'I opened the report with the finding in words, not a wall of charts.',
  map: 'I plotted incidents on a map, not a table — patterns read before you query.',
  pipeline: "I put the pipeline on one screen, so status isn't a USCG email.",
  projection: "I projected compliance forward, not just today's number.",
  coordinator: 'I had the engine greet the coordinator by name, not a dashboard.',
};
void ENGINE_CLAIMS;

const ENGINE = '/case-studies/uscg-bard/engine';

export default function ShowTheWorkSandbox() {
  return (
    <article className="case-study-article">
      <div className="case-study-prose">
        <section className="cs-section">
          <div className="eyebrow">The resolutions</div>

          <h2>How might every jurisdiction keep working its own way, and still add up to one current national picture?</h2>

          <p className="section-lede">
            As the sole designer, I had one hard constraint: unify the data without asking a single
            state to change how it files.
          </p>

          {/* Block 02 — Insight Engine (resolves the staleness friction 02) · 5 engine surfaces ·
              now on the reusable BentoTheme "Spine" preset ([[wide,wide],[tall,tall,tall]]).
              Anchors (report, coordinator) land in 16:10 wide slots and are cover-cropped from
              the native 3:4 assets via focal="top" (keeps the finding / the greeting). Satellites
              stay native 3:4. Glance = the two-part caption; decision-claims parked in ENGINE_CLAIMS
              for the PopUp layer. The headline IS the framing (framing={null}). */}
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
              <BentoItem
                src={`${ENGINE}/report.png`}
                alt="The annual report opening with its leading finding written as a sentence, above the supporting charts."
                caption="The finding"
                gloss=", in words"
                focal="top"
              />
              <BentoItem
                src={`${ENGINE}/coordinator.png`}
                alt="The dashboard greeting the state coordinator by name at the top of the screen."
                caption="It greets her"
                gloss=" by name"
                focal="top"
              />
              <BentoItem
                src={`${ENGINE}/map.png`}
                alt="Boating incidents plotted as points across the jurisdiction map, clustering into visible patterns."
                caption="Patterns"
              />
              <BentoItem
                src={`${ENGINE}/pipeline.png`}
                alt="Every case and its current review stage shown together on a single pipeline screen."
                caption="Every case"
              />
              <BentoItem
                src={`${ENGINE}/projection.png`}
                alt="A compliance figure charted with its trend projected forward past the current value."
                caption="Compliance"
              />
            </BentoTheme>
          </ResolutionBlock>
        </section>

        {/* ───────────────────────────────────────────────────────────────────
            PRESET GEOMETRY SANITY — placeholders (sandbox only). These prove
            GEOMETRY ONLY: arrangement per count, the per-row subgrid caption
            baseline-lock, the <lg 2-col satellite collapse. Each box is at its
            true slot aspect; captions are deliberately mixed-length — in each
            theme one row pairs a 1-line lead+short gloss against a row-mate whose
            gloss wraps to 2 lines, so the min-height:2lh + subgrid lock is under
            stress. Do NOT tune caption density/spacing against these grey boxes;
            per-theme tuning is deferred to the real-MDX port (01/03 crops). */}

        <section className="cs-section">
          <div className="eyebrow">Preset: 2 (wide · wide)</div>
          <BentoTheme>
            <BentoItem caption="Two-up" gloss=" short gloss" />
            <BentoItem
              caption="Two-up"
              gloss=" a deliberately longer continuation that should wrap onto a second line at this measure"
            />
          </BentoTheme>
        </section>

        <section className="cs-section">
          <div className="eyebrow">Preset: 3 (feature / standard · standard)</div>
          <BentoTheme>
            <BentoItem caption="Feature" gloss=" full-band hero slot" />
            <BentoItem caption="Standard" gloss=" short" />
            <BentoItem
              caption="Standard"
              gloss=" a longer gloss here that wraps to two lines and tests the subgrid lock across the pair"
            />
          </BentoTheme>
        </section>

        <section className="cs-section">
          <div className="eyebrow">Preset: 4 (wide · wide / standard · standard)</div>
          <BentoTheme>
            <BentoItem caption="Wide" gloss=" one line" />
            <BentoItem
              caption="Wide"
              gloss=" a noticeably longer continuation that wraps to a second line to test the row lock"
            />
            <BentoItem caption="Standard" gloss=" short" />
            <BentoItem
              caption="Standard"
              gloss=" another long gloss so the pair's media tops stay locked across the row"
            />
          </BentoTheme>
        </section>
      </div>
    </article>
  );
}
