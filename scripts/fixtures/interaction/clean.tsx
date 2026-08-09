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

// check 8 — a className with no state variants
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
