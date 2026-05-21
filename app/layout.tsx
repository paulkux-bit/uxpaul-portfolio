import { bricolage } from './fonts';
import './globals.css';

export const metadata = {
  title: 'uxpaul',
  description: 'Senior product designer — consumer-grade craft for complex technical challenges.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={bricolage.variable} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}