import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CaseStudyCard } from '@/components/case-study-card';
import { RevealGrid } from '@/components/reveal-grid';
import { QuickHitsSection } from '@/components/quick-hits/quick-hits-section';
import { caseStudies } from '@/app/data/case-studies';
import { VideoCoverCard } from '@/components/sandbox/video-cover-card';

// THROWAWAY experiment — a duplicate of the real home page (app/page.tsx) with
// ONLY the Bard card swapped for a video-cover variant. noindex + absent from nav;
// the real / is untouched. Delete this route + components/sandbox + the
// public/sandbox/home-video assets to remove the experiment cleanly.
export const metadata: Metadata = {
  title: 'Sandbox · Home video card',
  robots: { index: false, follow: false },
};

export default function HomeVideoSandbox() {
  if (process.env.VERCEL_ENV === 'production') notFound();

  return (
    <div className="page-container pt-16 md:pt-20 xl:pt-16 2xl:pt-28 pb-32 space-y-24 xl:space-y-20 2xl:space-y-32">
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

          <p className="hero-beat text-h3" style={{ ['--beat' as string]: 1 }}>
            <span className="font-semibold text-primary">Paul Kali</span>
            <span className="text-secondary"> · Senior Product Designer</span>
          </p>
        </div>

        <div className="space-y-5">
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

          <p className="hero-beat text-small text-secondary max-w-[62ch]" style={{ ['--beat' as string]: 3 }}>
            <a href="mailto:paulk.ux@gmail.com" className="no-underline hover:underline">
              Open to senior and staff IC roles.
            </a>
          </p>
        </div>
      </section>

      <section aria-labelledby="selected-work" className="space-y-6">
        <p id="selected-work" className="text-caption font-semibold text-muted tracking-wide">
          Selected work <span className="font-normal text-subtle">· sandbox: Bard card = video</span>
        </p>
        <RevealGrid className="grid gap-x-8 gap-y-12 lg:grid-cols-2">
          {caseStudies.map((study) => (
            <li key={study.slug}>
              {study.slug === 'uscg-bard' ? (
                <VideoCoverCard study={study} />
              ) : (
                <CaseStudyCard study={study} />
              )}
            </li>
          ))}
        </RevealGrid>
      </section>

      <QuickHitsSection />
    </div>
  );
}
