import { PopUpProvider } from '@/components/popup-context';
import { PopUpToggle } from '@/components/popup-toggle';
import type { ReactNode } from 'react';

export default function CaseStudyLayout({ children }: { children: ReactNode }) {
  return (
    <PopUpProvider>
      <header className="case-study-header">
        <div className="case-study-header__inner">
          <a href="/" className="case-study-header__brand">
            Paul Kali
          </a>
          <PopUpToggle />
        </div>
      </header>
      <main className="case-study-page">{children}</main>
    </PopUpProvider>
  );
}
