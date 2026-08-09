/* FIXTURE — NEGATIVE CONTROLS for the .tsx-side checks. Nothing here may fail,
 * and each item must appear as an exclusion with a named reason. */
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

// check 5 — an icon with no px size AND a class that sizes it to 1em. Both
// halves must hold: the first version of this fixture used a class with no CSS
// behind it, which the strengthened check correctly failed.
export const Sized = () => <ArrowRight className="fx-icon" strokeWidth={1.7} />;

// check 5 — next/image also carries width/height and is NOT an icon. If this
// ever starts failing, the icon detector has stopped distinguishing the two.
export const Photo = () => (
  <Image src="/case-studies/x.jpg" alt="A photograph, not an icon" width={1600} height={900} />
);

// check 8 — a className with no state variants.
// Doubles as check 3's negative control: `rounded-m` is NOT a Tailwind radius
// utility (no such size in Tailwind's scale), so check 3's JSX half must leave
// it alone. A class like that is check 9's business, not check 3's.
export const Plain = () => <div className="text-primary bg-surface rounded-m" />;

// check 8 — the words appear in PROSE, not as utilities. A reader hovers; that
// is not a `hover:` utility.
export const Prose = () => <p>When the reader hovers a card it lifts, and focus is visible.</p>;

// check 5 — sized 1em in both axes by its class: excluded as sized-1em
export const OneEm = () => <ArrowRight className="fx-icon" strokeWidth={1.7} />;

// check 6 — stroke governed by an ANCESTOR, not by a prop on the icon. This is
// the containment half of §2.3, and it was unimplemented at I0.
export const Governed = () => (
  <span className="fx-governed">
    <ArrowRight className="fx-icon" />
  </span>
);

// ── check 9 — every one of these must land as a NAMED exclusion ─────────────

// resolves against the BUILT css, via the escaped selector `.md\:px-8`
export const Built = () => <div className="md:px-8" />;

// resolves against an AUTHORED rule in clean.css — the other source
export const Authored = () => <div className="c-authored-only" />;

// Tailwind's important modifier. `.mt-24\!` is in the built stub; the token
// `mt-24!` used to be discarded by the shape test with no record at all.
export const Important = () => <div className="mt-24! c-authored-only" />;

// One token, not five. An arbitrary value carries quotes and brackets, which is
// why the split is on whitespace only — and why the shape test has to admit them.
export const Arbitrary = () => <div className="after:content-[''] c-authored-only" />;

// marker classes: they emit no CSS by design, so "resolves to nothing" is correct
export const Markers = () => <div className="group peer c-authored-only" />;

// interpolation is counted, never dropped silently
export const Interpolated = ({ x }: { x: string }) => <div className={`c-authored-only ${x}`} />;

// a token shape this check cannot resolve to a selector. Reported, not dropped —
// the distinction the whole of check 9's completion turns on.
export const OddShape = () => <div className="[&>*]:mt-4 c-authored-only" />;

// A deliberately unstyled structural wrapper, allowlisted BY THE REAL ENTRY —
// the class name here is the shipped one, so if ALLOWLIST.danglingClasses ever
// loses it this fixture goes red. Same coupling as components/oku/artwork.tsx,
// whose path is matched by the real ARTWORK_DIRS rather than a list written for
// tests.
export const UnstyledWrapper = () => <div className="friction-beat__text" />;

// a className EXPRESSION. Not a literal class list, so it is counted and printed
// rather than guessed at: harvesting string literals out of an expression reads
// comparison operands as class names.
export const FromVariable = ({ cls }: { cls: string }) => <div className={cls} />;
