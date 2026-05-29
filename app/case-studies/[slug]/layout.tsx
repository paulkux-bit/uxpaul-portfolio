import { AnnotationFAB } from '@/components/annotation-fab';
import type { ReactNode } from 'react';

/**
 * Case study layout. Relies on the root layout's PopUpProvider (no nesting).
 * Adds only the case-study-scoped chrome: the floating annotation button.
 */
export default function CaseStudyLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <main className="case-study-page">{children}</main>
      <AnnotationFAB />
    </>
  );
}
