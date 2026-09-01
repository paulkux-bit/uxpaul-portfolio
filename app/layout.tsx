import { commissioner } from './fonts';
import { ThemeProvider } from '@/components/theme-provider';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { FontLoadProbe } from '@/components/font-load-probe';
import './globals.css';

export const metadata = {
  /* THE TEMPLATE IS WHAT PUTS PAUL'S NAME IN THE TAB. Without it a case study's
     `title: fm.title` REPLACES this one outright rather than extending it, so the
     Delivery Promise tab read "Nobody remembered the wait. Everybody remembered the
     miss." with the candidate's name nowhere in it - on a link sent to a recruiter,
     who has that tab open while they read.

     `default` is NOT run through `template`: Next applies the template to CHILD
     segments only, so `/` stays "uxpaul" and every child gains the suffix.

     MIDDOT, NEVER AN EM DASH. U+2014 is a lint:prose hard fail and lint:prose now
     gates the build (9fd0eee). The middot is also already the house separator -
     the home name line and every case-study card meta use it. */
  title: {
    default: 'uxpaul',
    template: '%s · Paul Kali',
  },
  description:
    'Paul Kali. Senior product designer. Currently with the U.S. Navy, previously URBN. Open to senior IC, staff, and management roles.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={commissioner.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* Renders nothing; asserts at runtime that the variable font and its
              FLAR axis actually arrived. See components/font-load-probe.tsx —
              it probed wdth until 21 Aug 2026, an axis Commissioner does not have. */}
          <FontLoadProbe />
          <SiteHeader />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
