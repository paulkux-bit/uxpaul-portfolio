import { bricolage } from './fonts';
import { ThemeProvider } from '@/components/theme-provider';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { FontLoadProbe } from '@/components/font-load-probe';
import './globals.css';

export const metadata = {
  title: 'uxpaul',
  description:
    'Paul Kali. Senior product designer. Currently with the U.S. Navy, previously URBN. Open to senior IC, staff, and management roles.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={bricolage.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* Renders nothing; asserts at runtime that the variable font and its
              wdth axis actually arrived. See components/font-load-probe.tsx. */}
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
