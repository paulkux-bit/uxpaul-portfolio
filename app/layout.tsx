import { bricolage } from './fonts';
import { ThemeProvider } from '@/components/theme-provider';
import { PopUpProvider } from '@/components/popup-context';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import './globals.css';

// Pre-paint: apply the annotation tint before hydration so a previously-enabled
// session never flashes cool -> warm. Mirrors the next-themes class injection.
const popupInitScript = `try{if(localStorage.getItem('annotations')==='on')document.body.classList.add('popup-on')}catch(e){}`;

export const metadata = {
  title: 'uxpaul',
  description: 'Senior product designer — consumer-grade craft for complex technical challenges.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={bricolage.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: popupInitScript }} />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <PopUpProvider>
            <SiteHeader />
            <main id="main" tabIndex={-1}>
              {children}
            </main>
            <SiteFooter />
          </PopUpProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}