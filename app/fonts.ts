import { Bricolage_Grotesque } from 'next/font/google';

export const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
  // Load the non-default axes. next/font/google ships ONLY the default `wght`
  // axis unless others are named here — without this line `opsz`
  // (font-optical-sizing) and `wdth` (font-stretch) are absent from the served
  // file and every optical-sizing / font-stretch rule is silently inert.
  // `wght` is the default axis and must NOT be listed; `weight` must NOT be set
  // (it's mutually exclusive with variable-axis loading).
  axes: ['opsz', 'wdth'],
});
