export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 space-y-16">
      {/* Hero block */}
      <section className="space-y-6">
        <h1 className="text-display">uxpaul</h1>
        <p className="text-lead">
          Senior product designer — consumer-grade craft for complex technical challenges.
        </p>
      </section>

      {/* Case study card preview */}
      <section className="space-y-3 border-t border-neutral-200 pt-12">
        <p className="text-eyebrow">2023 · URBN</p>
        <h3 className="text-h3">Cross-brand navigation</h3>
        <p className="text-body">
          Eight designers, four global brands — building a unified navigation system
          that preserved each brand&apos;s voice within one shared design language. The <em>visible</em>
          : faster onboarding, fewer cross-brand support tickets.
        </p>
        <p className="text-caption">Lead designer · 8 months</p>
      </section>

      {/* Full scale audit */}
      <section className="space-y-6 border-t border-neutral-200 pt-12">
        <h2 className="text-h2">Type scale audit</h2>
        <div className="space-y-3">
          <p className="text-display">Display 64→112</p>
          <p className="text-hero">Hero 48→80</p>
          <p className="text-h1">Heading 1 — 36→56</p>
          <p className="text-h2">Heading 2 — 28→40</p>
          <p className="text-h3">Heading 3 — 22→28</p>
          <p className="text-lead">Lead paragraph — 22</p>
          <p className="text-body">Body — 18. Default reading size for case studies and prose.</p>
          <p className="text-small">Small — 16. Dense lists and captions.</p>
          <p className="text-caption">Caption — 14. Meta and bylines.</p>
          <p className="text-eyebrow">Eyebrow — 14 caps</p>
        </div>
      </section>
    </div>
  );
}