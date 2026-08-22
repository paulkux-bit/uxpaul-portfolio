import localFont from 'next/font/local';

/**
 * Commissioner, self-hosted. Built by scripts/build-commissioner-font.sh from the
 * designer's v1.012 variable font — NOT the v1.001 Google Fonts serves, which is five
 * years stale and carries slnt but not tnum, case or ss01.
 *
 * THE SCAR TISSUE, CARRIED FORWARD IN ITS NEW SHAPE. This repo once shipped
 * `next/font/google` without an `axes` array, which served a weight-only file and made
 * every font-stretch and optical-sizing rule in the system silently inert for months.
 * Nothing threw. The page looked plausible. That failure mode did not go away with the
 * loader; it changed shape. Under next/font/local the same class of bug is:
 *
 *   - a `variable` name that no longer matches --font-sans in globals.css. The font
 *     simply does not apply and the page renders in fallback, looking fine.
 *   - a `weight` range narrower than the CSS asks for, silently clamping.
 *   - an `src` path that resolves to nothing, which DOES throw at build - the one
 *     member of this family that fails closed rather than open.
 *
 * So the wiring is asserted in three independent places, and none of them claims the
 * others' coverage: the BUILD SCRIPT asserts the binary's axes and ranges,
 * lint:type 8a asserts this file is wired to a file that exists, and
 * components/font-load-probe.tsx asserts at runtime that FLAR actually renders.
 *
 * `weight: '340 720'` rather than the font's full range. The binary is already
 * instanced to 340-720, so this is the second of two independent places that agree:
 * the browser clamps a request above 720 because the CSS says so, and the font clamps
 * it because the axis stops there. The lint's weight rules then get the same answer
 * from the stylesheet and from the file.
 *
 * WHY THE FALLBACK METRICS COME OUT SANE. next/font derives size-adjust and
 * ascent-override from the variable font's DEFAULT INSTANCE. Commissioner's source
 * defaults to Thin (wght 100), so shipping the binary with its native default would
 * have computed the adjusted-Arial fallback against a hairline and quietly poisoned
 * every fallback measurement. C1 repositions the default to 400 with
 * updateFontNames=True. That reposition is usually justified by the desktop/Figma/PDF
 * consequence; this is the second and larger reason for it.
 */
export const commissioner = localFont({
  src: './_fonts/commissioner-latin.woff2',
  variable: '--font-commissioner',
  display: 'swap',
  weight: '340 720',
  style: 'normal',
});
