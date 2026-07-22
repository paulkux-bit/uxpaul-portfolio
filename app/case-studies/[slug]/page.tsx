import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

// Add new case studies to this map. The dynamic import is statically
// analyzable so Next.js can build them at compile time.
const caseStudies = {
  'uscg-bard': () => import('@/app/content/case-studies/uscg-bard.mdx'),
  'us-navy-fdt-e': () => import('@/app/content/case-studies/us-navy-fdt-e.mdx'),
  // 'us-navy-dagr':    () => import('@/app/content/case-studies/us-navy-dagr.mdx'),
  // 'urbn-shipping':   () => import('@/app/content/case-studies/urbn-shipping.mdx'),
  // 'nuuly':           () => import('@/app/content/case-studies/nuuly.mdx'),
} as const;

type Slug = keyof typeof caseStudies;

export async function generateStaticParams() {
  return (Object.keys(caseStudies) as Slug[]).map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!(slug in caseStudies)) return {};
  const mod = await caseStudies[slug as Slug]();
  const fm = (mod as { frontmatter?: Record<string, string> }).frontmatter ?? {};
  return {
    title: fm.title ?? 'Case study',
    description: fm.summary ?? undefined,
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  if (!(slug in caseStudies)) notFound();

  const mod = await caseStudies[slug as Slug]();
  const MDXContent = (mod as { default: React.ComponentType }).default;

  return (
    <article className="case-study-article">
      <div className="case-study-prose">
        <MDXContent />
      </div>
    </article>
  );
}
