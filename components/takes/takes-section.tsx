import { TakesWall } from './takes-wall';

/**
 * "Off the clock" — the personal-takes wall, a humanizing coda below the work
 * tiers on the home page. Server Component. Section label matches the home
 * pattern ("Selected work" / "Also shipped"): sentence-case, not the demo's
 * uppercase eyebrow. No theme toggle (the site header owns it).
 */
export function TakesSection() {
  return (
    <section aria-labelledby="off-the-clock" className="space-y-8">
      <p id="off-the-clock" className="text-caption font-semibold tracking-wide text-muted">
        Off the clock
      </p>
      <TakesWall />
    </section>
  );
}
