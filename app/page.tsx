import { CaseStudyCard } from '@/components/case-study-card';
import { RevealGrid } from '@/components/reveal-grid';
import { QuickHitsSection } from '@/components/quick-hits/quick-hits-section';
import { caseStudies } from '@/app/data/case-studies';

export default function Home() {
  return (
    <div className="page-container pt-16 md:pt-20 xl:pt-16 2xl:pt-28 pb-32 space-y-24 xl:space-y-20 2xl:space-y-32">
      {/* Hero — "weighted sentence" (Direction D1), range-led copy. The h1 names
          the three domains Paul works across; WEIGHT carries the emphasis:
          connectives ride text-lede's thin 340 + recessive --text-muted, the
          three domain nouns jump to font-[720] + --text-primary. No
          font-variation-settings, opsz auto. Then the signature, the Navy/URBN
          proof, and the availability beat. Four beats fade up via the .hero-beat
          CSS entrance (reduced-motion + no-JS safe). Server component, pure CSS. */}
      {/* Two-scale rhythm (Phase 2): the four beats are grouped into a title
          block (catch line + name) and a supporting block (proof + availability),
          12px intimate within each group, 48px between groups. The .hero-beat
          stagger (--beat 0..3) stays on the four elements regardless of grouping. */}
      <section className="space-y-12">
        <div className="space-y-5">
          <h1
            className="hero-beat text-lede text-muted max-w-[18ch] min-[1280px]:max-w-[30ch]"
            style={{ ['--beat' as string]: 0 }}
          >
            I design across{' '}
            <span className="font-[720] text-primary">consumer</span>,{' '}
            <span className="font-[720] text-primary">enterprise</span>, and{' '}
            <span className="font-[720] text-primary">defense</span>.
          </h1>

          {/* Signature — name present but quiet; the role recedes. */}
          <p className="hero-beat text-h3" style={{ ['--beat' as string]: 1 }}>
            <span className="font-semibold text-primary">Paul Kali</span>
            <span className="text-secondary"> · Senior Product Designer</span>
          </p>
        </div>

        <div className="space-y-5">
          {/* Proof — Navy + URBN. Brand names wrapped in whitespace-nowrap so none
              breaks mid-name at any width. */}
          <p
            className="hero-beat text-body text-primary max-w-[62ch]"
            style={{ ['--beat' as string]: 2 }}
          >
            Currently at the U.S. Navy, modernizing intelligence platforms for
            thousands of operators. Previously led design at URBN for the platform
            behind{' '}
            <span className="whitespace-nowrap">Anthropologie</span>,{' '}
            <span className="whitespace-nowrap">Free People</span>,{' '}
            <span className="whitespace-nowrap">Urban Outfitters</span>, and{' '}
            <span className="whitespace-nowrap">Nuuly</span>.
          </p>

          {/* Availability — quiet coda, grouped with the proof. */}
          <p className="hero-beat text-small text-secondary max-w-[62ch]" style={{ ['--beat' as string]: 3 }}>
            {/* Quiet mailto: inherits text-small/secondary; no underline at rest,
                underline on hover only. Same email as the footer. */}
            <a href="mailto:paulk.ux@gmail.com" className="no-underline hover:underline">
              Open to senior and staff IC roles.
            </a>
          </p>
        </div>
      </section>

      {/* Case study index — labeled list, 2-up gallery, staggered reveal */}
      <section aria-labelledby="selected-work" className="space-y-6">
        {/* Sentence-case section label (not text-eyebrow's uppercase) — warmer
            for the senior register; text-eyebrow stays reserved for true
            all-caps tags. Weight + the whitespace gap above carry the label. */}
        <p id="selected-work" className="text-caption font-semibold text-muted tracking-wide">
          Selected work
        </p>
        <RevealGrid className="grid gap-x-8 gap-y-12 lg:grid-cols-2">
          {caseStudies.map((study) => (
            <li key={study.slug}>
              <CaseStudyCard study={study} />
            </li>
          ))}
        </RevealGrid>
      </section>

      {/* Also shipped — book-styled shelf of brief-work entries (Template B).
          Non-interactive in v1. */}
      <QuickHitsSection />
    </div>
  );
}
