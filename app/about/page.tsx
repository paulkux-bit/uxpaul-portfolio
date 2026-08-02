import Link from 'next/link';

import portrait from '@/public/paul-portrait.jpg';
import { AboutDrawer } from '@/components/about/drawer';
import { FramedImage } from '@/components/framed-image';
import { RevealSection } from '@/components/about/reveal-section';

export const metadata = {
  title: 'About · uxpaul',
};

/**
 * Timeline eras. Years only: the phase names live once, as the section titles
 * below. Column widths are proportional to duration, so a dot's position on
 * the line reads as when, and the distance to the next reads as how long.
 */
const ERAS = ['2006 – 2010', '2010 – 2017', '2017 – Now'];

export default function AboutPage() {
  return (
    <div className="page-container py-24 md:py-32 space-y-24 2xl:space-y-32">
      {/* ── Hero ───────────────────────────────────────────────────────────
          Portrait left, type right. The portrait is the LCP element, so it
          carries `priority` and explicit intrinsic dimensions; the 4:5 frame
          reserves its box before the bytes land, so nothing shifts. The static
          import is what lets Next generate the blur placeholder at build.
          Not wrapped in RevealSection: it is above the fold, and hiding the LCP
          element to fade it in would be self-defeating. */}
      <header className="about-hero">
        <FramedImage
          src={portrait}
          alt="Paul Kali, smiling, at a waterfront"
          ratio="4 / 5"
          variant="portrait"
          priority
          sizes="(max-width:720px) 320px, 340px"
        />

        <div className="space-y-6">
          <p className="text-eyebrow text-muted">About</p>

          {/* Heading level and visual scale are deliberately split here. The
              greeting stays the <h1> for the document outline, but the POV line
              below is the hero's focal statement, so it carries the larger role.
              An h1 at text-h2 above a p at text-h1 is intentional, not a slip. */}
          <div className="space-y-3">
            <h1 className="text-h2">Hi, I&apos;m Paul.</h1>
            <p className="text-lead text-secondary">Product Designer</p>
          </div>

          <div className="space-y-3">
            <p className="about-hero__pov text-h1">
              I design the parts of a product people can&apos;t afford to get wrong.
            </p>
            <p className="text-body text-secondary">
              Right now, intelligence systems for the U.S. Navy. Before that, the platform behind
              URBN&apos;s brands, from Anthropologie to Nuuly.
            </p>
          </div>

          <div className="about-pills">
            <a
              className="about-pill"
              href="/Paul-Kali-Resume-2026.pdf"
              target="_blank"
              rel="noopener"
              download
            >
              Résumé (PDF) ↓
            </a>
            <a
              className="about-pill about-pill--ghost"
              href="https://linkedin.com/in/uxpaul"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a className="about-pill about-pill--ghost" href="mailto:paulk.ux@gmail.com">
              Email
            </a>
          </div>
        </div>
      </header>

      {/* ── Timeline ───────────────────────────────────────────────────────
          A dot marks the start of each era; the rule runs past the last one to
          the right edge, which is what carries "ongoing". Dot and years sit in
          the same cell at both orientations, so they cannot decouple. The line
          and dots are decoration; the years are the real text. */}
      <RevealSection aria-labelledby="career-timeline" className="about-timeline-section">
        <h2 id="career-timeline" className="sr-only">
          Career timeline
        </h2>
        <ol className="about-timeline">
          {ERAS.map((years) => (
            <li key={years} className="about-timeline__era">
              <span className="about-timeline__dot" aria-hidden="true" />
              <span className="about-timeline__years text-caption">{years}</span>
            </li>
          ))}
        </ol>
      </RevealSection>

      {/* ── Phase 1 ────────────────────────────────────────────────────── */}
      <RevealSection aria-labelledby="phase-foundations" className="about-phase space-y-8">
        <h2 id="phase-foundations" className="text-h3">
          Where I learned the trade.
        </h2>

        <div>
          <AboutDrawer
            company="Comcast Interactive Media"
            year="2006 – 2010"
            roles={[{ title: 'Information Architect', dates: 'Apr 2006 – Jan 2010' }]}
          >
            <p className="about-drawer__body text-body">
              Designed the information architecture behind Comcast.net and Xfinitytv.com, in front
              of millions of households. Where the fundamentals came from: systems thinking, IA,
              and designing for scale.
            </p>
          </AboutDrawer>
        </div>
      </RevealSection>

      {/* ── Phase 2 ────────────────────────────────────────────────────── */}
      <RevealSection aria-labelledby="phase-adaptation" className="about-phase space-y-8">
        <h2 id="phase-adaptation" className="text-h3">
          The agency years.
        </h2>

        <div>
          <AboutDrawer
            company="Empathy Lab (EPAM)"
            year="2010 – 2014"
            tag="Agency · client work"
            roles={[
              { title: 'Director, Experience Design', dates: 'Jun 2013 – Jan 2014' },
              { title: 'Senior UX Designer', dates: 'Oct 2011 – May 2013' },
              { title: 'Information Architect', dates: 'Feb 2010 – Sep 2011' },
            ]}
          >
            <p className="about-drawer__body text-body">
              Started as an information architect and left running experience design as a director,
              in under four years. UX lead across DirecTV, American Red Cross, Lionsgate,
              Philosophy, Sentara, and Televisa, including OTT apps for live TV and video on demand
              across Televisa, Cablevision Mexico, and Sky Mexico.
            </p>
          </AboutDrawer>

          <AboutDrawer
            company="SevOne"
            year="2014"
            roles={[{ title: 'Senior UX Designer', dates: 'Jan 2014 – Jun 2014' }]}
          >
            <p className="about-drawer__body text-body">
              Designed the UX framework for a next-gen, mobile-first enterprise network-management
              tool, and built the demos that helped secure $48M in Series C funding from Bain
              Capital.
            </p>
          </AboutDrawer>

          <AboutDrawer
            company="Tonic Design Co."
            year="2014 – 2017"
            tag="Agency · client work"
            roles={[
              { title: 'Director, UX Design', dates: 'Aug 2016 – Jul 2017' },
              { title: 'Senior UX Designer', dates: 'Jun 2014 – Aug 2016' },
            ]}
          >
            <p className="about-drawer__body text-body">
              Joined as a senior designer, left as director. Designed the Abercrombie &amp; Fitch
              loyalty program, which drove a 30% increase in repeat app visits, and led strategy
              and concept validation that won new retail and healthcare business.
            </p>
          </AboutDrawer>
        </div>
      </RevealSection>

      {/* ── Phase 3 ────────────────────────────────────────────────────── */}
      <RevealSection aria-labelledby="phase-delivery" className="about-phase about-phase--last space-y-8">
        <div className="space-y-3">
          <h2 id="phase-delivery" className="text-h3">
            Full ownership, discovery to shipped.
          </h2>
          <p className="text-body text-secondary">First retail, then defense, on purpose.</p>
        </div>

        <div>
          <AboutDrawer
            company="URBN"
            year="2017 – 2019"
            roles={[{ title: 'Manager, Product Design', dates: 'Nov 2017 – Oct 2019' }]}
          >
            <p className="about-drawer__body text-body">
              Led product design on the platform behind URBN&apos;s brands (Anthropologie, Free
              People, Urban Outfitters, and Nuuly), and mentored the team building it. Together we
              took Nuuly&apos;s rental platform from concept to launch, including its 0→1 warehouse
              operations, and shipped a navigation redesign that drove a 20% traffic increase to
              category pages across all four brands.
            </p>
          </AboutDrawer>

          <AboutDrawer
            company="U.S. Navy · NIWC Pacific"
            year="2019 – Now"
            roles={[{ title: 'Senior Product Designer', dates: 'Nov 2019 – Present' }]}
          >
            <p className="about-drawer__body text-body">
              Sole design lead for core intelligence platforms used by thousands of operators,
              discovery through delivery. Cut mission-critical reporting time by 25% around direct
              user research, and turned static briefing slides into interactive data
              visualizations.
            </p>
            <p className="about-drawer__body text-body">
              Moving to a hands-on IC role was a deliberate choice: to go deep on systems where a
              wrong call carries real weight. The hard part isn&apos;t the pixels. It&apos;s
              designing for air-gapped systems with no internet, and making the case for UX to
              stakeholders who&apos;ve never had a designer in the room.
            </p>
          </AboutDrawer>
        </div>
      </RevealSection>

      {/* The one bridge out of this page. Plain text link: it inherits the site's
          link treatment and focus halo, so it needs no local CSS. Points at the
          same target the header's "Work" nav uses, since there is no /work
          route. */}
      <p className="text-small">
        <Link href="/#selected-work">See selected work →</Link>
      </p>

      {/* ── Credentials ──────────────────────────────────────────────────
          The label and the chips, nothing else. A clearance and a war-college
          certificate are facts a reader can weigh unaided; a line telling them
          what to conclude turned the credential into a pitch, so it is gone. */}
      <RevealSection aria-labelledby="credentials" className="space-y-6">
        <p id="credentials" className="text-eyebrow text-muted">
          Credentials
        </p>
        <ul className="about-chips text-small">
          <li className="about-chip">Active TS/SCI clearance</li>
          <li className="about-chip">JPME Phase 1 · Naval War College</li>
          <li className="about-chip">B.A. · Rutgers University</li>
        </ul>
      </RevealSection>

      {/* ── Contact ────────────────────────────────────────────────────── */}
      {/* space-y-8 puts the h2 on the same 2rem step as every other module
          heading; the nested space-y-6 keeps the paragraph and its links at the
          intimate tier. */}
      <RevealSection aria-labelledby="contact" className="space-y-8">
        <h2 id="contact" className="text-h2">
          Let&apos;s talk.
        </h2>
        <div className="space-y-6">
          <p className="text-body text-secondary max-w-[64ch]">
            Open to senior IC, staff, and design-management roles on teams with a real mission.
            Philadelphia-based; remote, hybrid, or the occasional NYC/DC trip.
          </p>
          <p className="text-body">
            <a href="mailto:paulk.ux@gmail.com">paulk.ux@gmail.com</a>
            {' · '}
            <a href="https://linkedin.com/in/uxpaul" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </p>
        </div>
      </RevealSection>
    </div>
  );
}
