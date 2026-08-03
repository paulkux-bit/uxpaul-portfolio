import Link from 'next/link';

import portrait from '@/public/paul-portrait.jpg';
import { AboutDrawer } from '@/components/about/drawer';
import { FramedImage } from '@/components/framed-image';
import { RevealSection } from '@/components/about/reveal-section';

export const metadata = {
  title: 'About · uxpaul',
};

export default function AboutPage() {
  return (
    <div className="page-container py-24 md:py-32 space-y-24 2xl:space-y-32">
      {/* ── Hero ───────────────────────────────────────────────────────────
          Portrait leads in the DOM, which is also the mobile reading order;
          from md up the grid moves it to the right column. It is the LCP
          element, so it keeps priority and the blur placeholder, and the 4:5
          box reserves its space before the bytes land. Not wrapped in
          RevealSection: hiding the LCP element to fade it in is self-defeating. */}
      <header className="about-hero">
        <FramedImage
          src={portrait}
          alt="Paul Kali, smiling, at a waterfront"
          ratio="4 / 5"
          variant="portrait"
          priority
          position="50% 18%"
          className="about-hero__portrait"
          sizes="(max-width: 767px) min(100vw - 3rem, 300px), 440px"
        />

        <div className="about-hero__type">
          <div className="space-y-2">
            <p className="about-hero__name text-h2">Paul Kali</p>
            <p className="about-hero__title text-lead">Senior Product Designer</p>
          </div>

          {/* The page's only two-tone moment. One <h1>, two spans: the
              accessible name is the whole sentence, and the spans carry
              nothing but colour. */}
          <h1 className="about-hero__pov text-h1">
            <span className="about-hero__pov-lead">I design the parts of</span>{' '}
            <span>a product people can&apos;t afford to get wrong.</span>
          </h1>

          <p className="about-hero__grounding text-body">
            Right now, intelligence systems for the U.S. Navy. Before that, the platform behind
            URBN&apos;s brands, from Anthropologie to Nuuly.
          </p>

          <div className="about-actions">
            <a
              className="about-btn"
              href="/Paul-Kali-Resume-2026.pdf"
              target="_blank"
              rel="noopener"
              download
            >
              Resume (PDF)
            </a>
            <a
              className="about-link text-body"
              href="https://linkedin.com/in/uxpaul"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a className="about-link text-body" href="mailto:paulk.ux@gmail.com">
              Email
            </a>
          </div>
        </div>
      </header>

      {/* ── Phase 1 ────────────────────────────────────────────────────── */}
      <RevealSection aria-labelledby="phase-foundations" className="about-phase space-y-8">
        <h2 id="phase-foundations" className="about-phase__title text-h2">
          Where I learned the trade.
        </h2>

        <div>
          <AboutDrawer
            company="Comcast Interactive Media"
            year="2006 – 2010"
            roles={[{ title: 'Information Architect', dates: 'Apr 2006 – Jan 2010' }]}
          >
            <p className="about-row__body text-body">
              Designed the information architecture behind Comcast.net and Xfinitytv.com, in front
              of millions of households. Where the fundamentals came from: systems thinking, IA,
              and designing for scale.
            </p>
          </AboutDrawer>
        </div>
      </RevealSection>

      {/* ── Phase 2 ────────────────────────────────────────────────────── */}
      <RevealSection aria-labelledby="phase-lead" className="about-phase space-y-8">
        <h2 id="phase-lead" className="about-phase__title text-h2">
          From maker to lead.
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
            <p className="about-row__body text-body">
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
            <p className="about-row__body text-body">
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
            <p className="about-row__body text-body">
              Joined as a senior designer, left as director. Designed the Abercrombie &amp; Fitch
              loyalty program, which drove a 30% increase in repeat app visits, and led strategy
              and concept validation that won new retail and healthcare business.
            </p>
          </AboutDrawer>
        </div>
      </RevealSection>

      {/* ── Phase 3 ────────────────────────────────────────────────────── */}
      <RevealSection aria-labelledby="phase-ownership" className="about-phase space-y-8">
        <div className="space-y-3">
          <h2 id="phase-ownership" className="about-phase__title text-h2">
            Full ownership, end to end.
          </h2>
          <p className="about-phase__note text-body">First retail, then defense, on purpose.</p>
        </div>

        <div>
          <AboutDrawer
            company="URBN"
            year="2017 – 2019"
            roles={[{ title: 'Manager, Product Design', dates: 'Nov 2017 – Oct 2019' }]}
          >
            <p className="about-row__body text-body">
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
            <p className="about-row__body text-body">
              Sole design lead for core intelligence platforms used by thousands of operators,
              discovery through delivery. Cut mission-critical reporting time by 25% around direct
              user research, and turned static briefing slides into interactive data
              visualizations.
            </p>
            <p className="about-row__body text-body">
              Moving to a hands-on IC role was a deliberate choice: to go deep on systems where a
              wrong call carries real weight. The hard part isn&apos;t the pixels. It&apos;s
              designing for air-gapped systems with no internet, and making the case for UX to
              stakeholders who&apos;ve never had a designer in the room.
            </p>
          </AboutDrawer>
        </div>
      </RevealSection>

      {/* ── Selected-work band ─────────────────────────────────────────────
          The one bridge out of this page. Points at the same target the
          header's "Work" nav uses, since there is no /work route. */}
      <RevealSection aria-label="Selected work">
        <Link className="about-work-band" href="/#selected-work">
          <span className="about-work-band__label text-h3">See selected work</span>
          <span className="about-work-band__arrow text-h3" aria-hidden="true">
            →
          </span>
        </Link>
      </RevealSection>

      {/* ── Credentials ────────────────────────────────────────────────── */}
      <RevealSection aria-labelledby="credentials" className="space-y-8">
        <h2 id="credentials" className="about-phase__title text-h2">
          Cleared, credentialed, and current.
        </h2>

        <ul className="about-creds">
          <li className="about-creds__item">
            <span className="about-creds__label text-body">Active TS/SCI clearance</span>
          </li>
          <li className="about-creds__item">
            <span className="about-creds__label text-body">JPME Phase 1</span>
            <span className="about-creds__context text-small">U.S. Naval War College</span>
          </li>
          <li className="about-creds__item">
            <span className="about-creds__label text-body">B.A.</span>
            <span className="about-creds__context text-small">Rutgers University</span>
          </li>
        </ul>
      </RevealSection>

      {/* ── Contact ────────────────────────────────────────────────────── */}
      <RevealSection aria-labelledby="contact" className="space-y-8">
        <h2 id="contact" className="about-phase__title text-h2">
          Let&apos;s talk.
        </h2>

        <div className="space-y-6">
          <p className="about-contact__body text-body">
            Open to senior IC, staff, and design-management roles. Philadelphia-based; remote,
            hybrid, or the occasional NYC/DC trip.
          </p>
          <p className="about-contact__links">
            <a className="about-link text-body" href="mailto:paulk.ux@gmail.com">
              paulk.ux@gmail.com
            </a>
            <a
              className="about-link text-body"
              href="https://linkedin.com/in/uxpaul"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </p>
        </div>
      </RevealSection>
    </div>
  );
}
