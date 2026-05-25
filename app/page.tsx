import { CaseStudyCard } from '@/components/case-study-card';
import { RevealGrid } from '@/components/reveal-grid';
import { QuickHitsSection } from '@/components/quick-hits/quick-hits-section';
import { caseStudies } from '@/app/data/case-studies';

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-6 md:px-8 py-16 md:py-20 xl:py-24 2xl:py-32 space-y-16 2xl:space-y-24">
      {/* Hero — text-led: positioning statement + supporting line. No hero
          visual in v1 (the type treatment carries it). Supporting line is
          weight 500 (typography §9 "lead" move) at a readable measure.
          Desktop padding/gap tightened so the first selected-work row clears
          the 1440 fold; 1920 keeps the generous rhythm. */}
      <section className="space-y-6">
        {/* Meaning-unit line breaks forced from xl up (isolates the
            differentiator "Consumer-grade craft" on line 1; lands line-end
            emphasis on craft / complex / challenges). Below xl the breaks
            collapse and text-statement's text-wrap:balance evens the rag.
            max-w-5xl so each forced line fits at desktop size (verified 1440/1920). */}
        <h1 className="text-statement text-primary max-w-5xl">
          Consumer-grade craft{' '}
          <br className="hidden xl:block" />
          applied to complex{' '}
          <br className="hidden xl:block" />
          technical challenges.
        </h1>
        <p className="text-lead text-secondary font-medium max-w-[60ch]">
          I&rsquo;m Paul Kali, a senior product designer. Eight years of careful
          research and practical design, with a taste for the technical problems
          most teams route around.
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
