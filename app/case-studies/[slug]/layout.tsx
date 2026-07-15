import type { ReactNode } from 'react';

/**
 * Case study layout — wraps the article in the shared page shell.
 */
export default function CaseStudyLayout({ children }: { children: ReactNode }) {
  return <main className="case-study-page">{children}</main>;
}
