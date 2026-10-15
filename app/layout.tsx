import { commissioner } from './fonts';
import { ThemeProvider } from '@/components/theme-provider';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { FontLoadProbe } from '@/components/font-load-probe';
import { THEME_ATTRIBUTE, THEME_DEFAULT, THEME_STORAGE_KEY, themeInitScript } from '@/lib/theme';
import './globals.css';

export const metadata = {
  /* THE TEMPLATE IS WHAT PUTS PAUL'S NAME IN THE TAB. Without it a case study's
     `title: fm.title` REPLACES this one outright rather than extending it, so the
     Delivery Promise tab read "Nobody remembered the wait. Everybody remembered the
     miss." with the candidate's name nowhere in it - on a link sent to a recruiter,
     who has that tab open while they read.

     `default` is NOT run through `template`: Next applies the template to CHILD
     segments only, so `/` reads the default whole and every child gains the
     suffix. The default carries the name and title itself for that reason; it
     was "uxpaul" until 13 Oct 2026, a home tab with no name in it.

     A PIPE, NEVER AN EM DASH. U+2014 is a lint:prose hard fail and lint:prose
     gates the build (9fd0eee). The middle dot this template used until 13 Oct
     2026 went with the site-wide rule against it (Paul, final copy v11). */
  title: {
    default: 'Paul Kali, Senior Product Designer',
    template: '%s | Paul Kali',
  },
  description:
    "Paul Kali, Senior Product Designer. Currently with the U.S. Navy, where I've designed intelligence tools for thousands of operators. Previously at URBN.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={commissioner.variable} suppressHydrationWarning>
      <head>
        {/* Sets the theme class before the body is parsed. See lib/theme.ts. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute={THEME_ATTRIBUTE}
          defaultTheme={THEME_DEFAULT}
          storageKey={THEME_STORAGE_KEY}
          enableSystem
        >
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
