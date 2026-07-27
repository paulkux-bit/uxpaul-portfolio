import { TakesSection } from '@/components/takes/takes-section';

export const metadata = {
  title: 'About · uxpaul',
};

export default function AboutPage() {
  return (
    <div className="page-container py-24 md:py-32 space-y-24">
      {/* TODO: real About hero and intro, a later module. Placeholder pair for now:
          the page name, and the same coming-soon mark the index cards carry. The
          20px gap is the hero beat-group step (.hero-block__type, home hero). */}
      <header className="space-y-5">
        <h1 className="text-hero">About</h1>
        <p className="text-lead text-secondary">Coming soon</p>
      </header>
      {/* Off the clock — humanizing coda: a typographic wall of personal takes. */}
      <TakesSection />
    </div>
  );
}
