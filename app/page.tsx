import { CaseStudyCard } from '@/components/case-study-card';
import { RevealGrid } from '@/components/reveal-grid';
import { QuickHitsSection } from '@/components/quick-hits/quick-hits-section';
import { caseStudies } from '@/app/data/case-studies';

export default function Home() {
  return (
    <div className="page-container pt-2xl pb-section space-y-section">
      {/* Hero, structure 1a amended (Paul, 13 Oct 2026; docs/hero-home-review-cc.md).
          The claim stands alone as the h1; then the proof group, headed by the name.
          Every line is one weight and one colour until the design system pass: the
          h1 rides text-lede's own 340 in --text-primary, with no <strong> inside it.
          Three beats fade up via the .hero-beat CSS entrance (reduced-motion and
          no-JS safe). Server component, pure CSS. */}
      {/* Two-scale rhythm (Phase 2): 48px (--spacing-xl) between the h1 and the
          proof group, 24px (--spacing-m) inside the group. */}
      {/* Intro to "Selected work" is 64, not the 128 section break: the intro
          introduces the work (top-of-page ruling T2b, 1 Oct 2026). mb-2xl! because
          space-y-section sets this margin on every non-last child; the work to
          Client work break stays 128. The page top above is 64 (T1c). */}
      <section className="space-y-xl mb-2xl!">
        <h1
          className="hero-beat text-lede text-primary max-w-[18ch] min-[1280px]:max-w-[30ch]"
          style={{ ['--beat' as string]: 0 }}
        >
          I design the parts of products that people can&apos;t afford to get&nbsp;wrong.
        </h1>

        <div className="space-y-m">
          {/* The name heads the proof. Its WEIGHT lives in globals.css
              (.hero-credit-name, --wght-credit), not in a utility here, so the
              CSS parser can see it. P2b, 1 Oct 2026: two lines, name then title,
              no interpunct. The sr-only comma keeps the pause a screen reader
              would otherwise lose. */}
          <p className="hero-beat text-h3" style={{ ['--beat' as string]: 1 }}>
            {/* data-header-handoff: the header's wordmark hands off to the face
                once this line's bottom passes under the header. */}
            <span className="hero-credit-name block text-primary" data-header-handoff="">
              Paul Kali
            </span>
            <span className="sr-only">, </span>
            <span className="block text-secondary">Senior Product Designer</span>
          </p>

          {/* Proof: Navy, then URBN. Brand names and "hands-on" are wrapped in
              whitespace-nowrap so none breaks mid-name or at its hyphen. */}
          <p
            className="hero-beat text-body text-primary max-w-[62ch]"
            style={{ ['--beat' as string]: 2 }}
          >
            I currently work for the U.S. Navy, where I&apos;ve designed intelligence tools for
            thousands of operators. Previously at URBN, I designed Nuuly&apos;s first warehouse
            tools and led design across{' '}
            <span className="whitespace-nowrap">Urban Outfitters</span>, Anthropologie, and{' '}
            <span className="whitespace-nowrap">Free People</span>. I&nbsp;work{' '}
            <span className="whitespace-nowrap">hands-on</span>, from research to delivery.
          </p>
        </div>
      </section>

      {/* Case study index — labeled list, 2-up gallery, staggered reveal */}
      <section aria-labelledby="selected-work" className="space-y-m">
        {/* Sentence-case section label (not text-eyebrow's uppercase) — warmer
            for the senior register; text-eyebrow stays reserved for true
            all-caps tags. Weight + the whitespace gap above carry the label. */}
        <p id="selected-work" className="text-caption font-semibold text-muted tracking-wide">
          Selected work
        </p>
        {/* 32 across, 48 down, on purpose (closing review A5a, 1 Oct 2026): 48 lets
            each card read as its own entry, 32 holds the pair together. */}
        <RevealGrid className="grid gap-x-l gap-y-xl lg:grid-cols-2 lg:[grid-auto-rows:1fr]">
          {caseStudies.map((study) => (
            <li key={study.slug} className="h-full">
              <CaseStudyCard study={study} />
            </li>
          ))}
        </RevealGrid>
      </section>

      {/* Client work: the shelf of four agency-era client pieces (Template B).
          Each row's title opens the piece in the client work dialog. */}
      <QuickHitsSection />
    </div>
  );
}
