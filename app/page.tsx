import { CaseStudyCard } from '@/components/case-study-card';
import { RevealGrid } from '@/components/reveal-grid';
import { QuickHitsSection } from '@/components/quick-hits/quick-hits-section';
import { caseStudies } from '@/app/data/case-studies';

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-6 md:px-8 py-16 md:py-20 xl:py-16 2xl:py-28 space-y-16 xl:space-y-12 2xl:space-y-24">
      {/* Hero — "weighted sentence" (Direction D1), range-led copy. The h1 names
          the three domains Paul works across; WEIGHT carries the emphasis:
          connectives ride text-lede's thin 340 + recessive --text-muted, the
          three domain nouns jump to font-[720] + --text-primary. No
          font-variation-settings, opsz auto. Then the signature, the Navy/URBN
          proof, and the availability beat. Four beats fade up via the .hero-beat
          CSS entrance (reduced-motion + no-JS safe). Server component, pure CSS. */}
      <section className="space-y-8 md:space-y-10">
        <h1
          className="hero-beat text-lede text-muted max-w-[18ch]"
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

        {/* Availability — its own beat, quiet coda. No eyebrow label. */}
        <p className="hero-beat text-body text-secondary max-w-[62ch]" style={{ ['--beat' as string]: 3 }}>
          Open to senior and staff IC roles.
        </p>
      </section>

      {/* Case study index — labeled list, 2-up gallery, staggered reveal */}
      <section aria-labelledby="selected-work" className="space-y-8">
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
