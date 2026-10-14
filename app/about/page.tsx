import { ArrowDown } from 'lucide-react';

import portrait from '@/public/paul-portrait-square.jpg';
import { FramedImage } from '@/components/framed-image';
import { RevealSection } from '@/components/about/reveal-section';

export const metadata = {
  /* 'About' alone: the root layout's title template appends " | Paul Kali",
     so a hand-rolled site name here would print the name twice. Renders
     "About | Paul Kali". */
  title: 'About',
};

/* Every string below is Paul's, ruled module by module on 12 and 13 Oct 2026
   (docs/previews/hero/final-copy-v11.md). Copy them, never reword them. Styling
   is deferred to the design system pass: one weight and one colour per line. */

const BRING = [
  {
    label: 'End-to-end product design.',
    line: 'I enjoy designing features from concept through delivery, partnering with product managers and developers.',
  },
  {
    label: 'Design systems.',
    line: 'I ensure my work is grounded in shared components and processes so teams can reuse strong solutions and move faster.',
  },
  {
    label: 'Complex, data-heavy interfaces.',
    line: "At the Navy, I've had many reps designing tools that help analysts and operators make decisions from dense data.",
  },
  {
    label: 'Stakeholder alignment.',
    line: "Beyond the hands-on work, I focus on aligning internal and external partners, because that's what turns design into something that ships.",
  },
  {
    label: 'User research partner.',
    line: 'I never turn down a chance to work with user researchers and learn firsthand from users.',
  },
];

/* Latest first. Promotions live in the title as "X to Y", and dates are written
   with "to". The line is JSX so a brand name or a hyphenated compound can be
   held together with whitespace-nowrap, as in v11. */
const WORKED = [
  {
    company: 'U.S. Navy, NIWC Pacific',
    title: 'Senior Product Designer',
    dates: '2019 to present',
    line: <>Designed intelligence tools for Navy and Air Force units on systems with no internet.</>,
  },
  {
    company: 'URBN',
    title: 'Manager, Product Design',
    dates: '2017 to 2019',
    line: (
      <>
        Managed eight designers on the platform behind{' '}
        <span className="whitespace-nowrap">Urban Outfitters</span>, Anthropologie, and{' '}
        <span className="whitespace-nowrap">Free People</span>, and designed Nuuly&apos;s first
        warehouse tools myself.
      </>
    ),
  },
  {
    company: 'Tonic Design Co.',
    title: 'Senior UX Designer to Director, UX Design',
    dates: '2014 to 2017',
    line: (
      <>
        Worked mostly with real estate and <span className="whitespace-nowrap">e-commerce</span>{' '}
        clients, and designed Abercrombie &amp; Fitch&apos;s loyalty program, which lifted repeat
        app visits 30%.
      </>
    ),
  },
  {
    company: 'SevOne',
    title: 'Senior UX Designer',
    dates: '2014',
    line: (
      <>
        Designed the UX framework for a <span className="whitespace-nowrap">mobile-first</span>{' '}
        network management tool for enterprise IT, and built product demos used in SevOne&apos;s
        fundraising.
      </>
    ),
  },
  {
    company: 'Empathy Lab, now EPAM',
    title: 'Information Architect to Director, Experience Design',
    dates: '2010 to 2014',
    line: (
      <>
        Led UX for media and nonprofit clients, including DirecTV, Lionsgate, Televisa, and the
        American Red Cross.
      </>
    ),
  },
  {
    company: 'Comcast Interactive Media',
    title: 'Information Architect',
    dates: '2006 to 2010',
    line: (
      <>
        Designed the information architecture for Comcast&apos;s{' '}
        <span className="whitespace-nowrap">video-on-demand</span> service, available in millions
        of households.
      </>
    ),
  },
];

const CREDENTIALS = [
  'Active TS/SCI clearance',
  'JPME Phase 1, U.S. Naval War College',
  'B.A., Rutgers University',
];

export default function AboutPage() {
  return (
    <div className="page-container pt-2xl pb-section space-y-section">
      {/* Page top is 64 on every page (top-of-page ruling T1c, 1 Oct 2026). */}
      {/* ── Hero ───────────────────────────────────────────────────────────
          Portrait leads in the DOM, which is also the mobile reading order;
          from md up the grid moves it to the right column. It is the LCP
          element, so it keeps priority and the blur placeholder, and the square
          box reserves its space before the bytes land. Not wrapped in
          RevealSection: hiding the LCP element to fade it in is self-defeating. */}
      <header className="about-hero">
        <FramedImage
          src={portrait}
          alt="Paul Kali, smiling, at a waterfront"
          ratio="1 / 1"
          variant="portrait"
          priority
          headerHandoff
          className="about-hero__portrait"
          sizes="(max-width: 767px) calc(100vw - 3rem), 440px"
        />

        <div className="about-hero__type">
          {/* The title is a label, not the heading: the h1 below carries the page. */}
          <p className="about-hero__title text-lead">Senior Product Designer</p>

          {/* One weight and one colour until the design system pass (13 Oct
              2026); it was the page's two-tone moment until then. */}
          <h1 className="about-hero__pov text-h1">
            I&apos;m Paul. I&apos;ve designed for shoppers, TV viewers, and Navy operators.
          </h1>

          <div className="about-actions">
            <a
              className="about-btn"
              href="/Paul-Kali-Resume-2026.pdf"
              target="_blank"
              rel="noopener"
              download="Paul Kali Resume.pdf"
            >
              Résumé (PDF)
              {/* §2: no size, no strokeWidth. 1em against the button's own
                  label, stroke from the button's --icon-stroke. */}
              <ArrowDown className="icon about-btn__icon" aria-hidden="true" focusable="false" />
            </a>
            <a
              className="about-link text-body"
              href="https://linkedin.com/in/uxpaul"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </header>

      {/* ── What I bring ───────────────────────────────────────────────────
          role="list" because Tailwind preflight sets `list-style: none` on every
          ol/ul, which strips list semantics in WebKit. Same fix on every list
          below. */}
      <RevealSection aria-labelledby="bring" className="about-phase space-y-xl">
        <h2 id="bring" className="about-phase__title text-h2">
          What I bring
        </h2>
        <ul className="about-bring" role="list">
          {BRING.map(({ label, line }) => (
            <li key={label} className="about-bring__item">
              <h3 className="about-bring__label text-h3">{label}</h3>
              <p className="about-bring__line text-body">{line}</p>
            </li>
          ))}
        </ul>
      </RevealSection>

      {/* ── Where I've worked ──────────────────────────────────────────────
          A flat list: every row shows its line, with no expand and collapse.
          The sr-only punctuation gives a screen reader the pauses the grid
          gives the eye. */}
      <RevealSection aria-labelledby="worked" className="about-phase space-y-xl">
        <h2 id="worked" className="about-phase__title text-h2">
          Where I&apos;ve worked
        </h2>
        <div className="space-y-l">
          <ul className="about-cv text-body" role="list">
            {WORKED.map(({ company, title, dates, line }) => (
              <li key={company} className="about-cv__row">
                <span className="about-cv__company">{company}</span>
                <span className="sr-only">, </span>
                <span className="about-cv__title">{title}</span>
                <span className="sr-only">, </span>
                <span className="about-cv__dates">{dates}</span>
                <span className="sr-only">. </span>
                <p className="about-cv__line">{line}</p>
              </li>
            ))}
          </ul>

          <ul className="about-credentials text-small" role="list">
            {CREDENTIALS.map((credential) => (
              <li key={credential}>{credential}</li>
            ))}
          </ul>
        </div>
      </RevealSection>

      {/* ── What I'm looking for ───────────────────────────────────────── */}
      <RevealSection aria-labelledby="looking" className="about-phase space-y-xl">
        <h2 id="looking" className="about-phase__title text-h2">
          What I&apos;m looking for
        </h2>
        <dl className="text-body">
          <div className="about-looking__row">
            <dt className="about-looking__label">Role</dt>
            <dd className="about-looking__value">Senior or staff product designer, IC</dd>
            <dd className="about-looking__note">
              I moved from managing to IC work to be closer to design decisions, and I still mentor
              junior designers.
            </dd>
          </div>
          <div className="about-looking__row">
            <dt className="about-looking__label">Location</dt>
            <dd className="about-looking__value">Hybrid, remote, or in person near Philadelphia</dd>
          </div>
          <div className="about-looking__row">
            <dt className="about-looking__label">Scope</dt>
            <dd className="about-looking__value">
              Large-scale products with problems that cross many teams
            </dd>
          </div>
        </dl>
      </RevealSection>

      {/* ── Close ──────────────────────────────────────────────────────────
          T4c, 1 Oct 2026: the address is the heading. The plain base `a` rule
          carries it. Its own section, so the gap above it is the page's section
          break (Q7-a, 13 Oct 2026). */}
      <RevealSection aria-labelledby="contact" className="about-phase space-y-m">
        <h2 id="contact" className="about-phase__title text-h2">
          <a href="mailto:paulk.ux@gmail.com">paulk.ux@gmail.com</a>
        </h2>
        <p className="about-close__life text-small">
          I live outside Philadelphia with my wife, who teaches high school art.
        </p>
        <p className="about-close__life text-small">
          Thanks, sweetheart, for your love and support!
        </p>
      </RevealSection>
    </div>
  );
}
