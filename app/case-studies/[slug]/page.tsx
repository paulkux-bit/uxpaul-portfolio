import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { caseStudyRoutes, type PublishedSlug } from '@/app/data/case-study-routes';

export async function generateStaticParams() {
  return (Object.keys(caseStudyRoutes) as PublishedSlug[]).map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!(slug in caseStudyRoutes)) return {};
  const mod = await caseStudyRoutes[slug as PublishedSlug]();
  const fm = (mod as { frontmatter?: Record<string, string> }).frontmatter ?? {};
  return {
    title: fm.title ?? 'Case study',
    description: fm.summary ?? undefined,
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  if (!(slug in caseStudyRoutes)) notFound();

  const mod = await caseStudyRoutes[slug as PublishedSlug]();
  const MDXContent = (mod as { default: React.ComponentType }).default;

  return (
    <article className="case-study-article">
      <div className="case-study-prose">
        <MDXContent />
      </div>
    </article>
  );
}
