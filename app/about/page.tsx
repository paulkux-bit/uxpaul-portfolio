import { TakesSection } from '@/components/takes/takes-section';

export const metadata = {
  title: 'About — uxpaul',
};

export default function AboutPage() {
  return (
    <div className="page-container py-24 md:py-32 space-y-24">
      {/* TODO: real About hero/intro — future module. Placeholder heading for now. */}
      <h1 className="text-hero">About — coming soon.</h1>
      {/* Off the clock — humanizing coda: a typographic wall of personal takes. */}
      <TakesSection />
    </div>
  );
}
