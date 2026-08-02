import type { ReactNode } from 'react';

/**
 * Case study layout — wraps the article in the shared page shell.
 *
 * A <div>, not a <main>: the root layout (app/layout.tsx) already renders the
 * page's single <main id="main"> landmark, and <main> is not a permitted
 * descendant of <main>. Nesting them shipped two identical "main" regions to
 * the landmark rotor on every case-study route. `.case-study-page` is a class
 * selector, so the styling is unaffected by the tag change.
 */
export default function CaseStudyLayout({ children }: { children: ReactNode }) {
  return <div className="case-study-page">{children}</div>;
}
