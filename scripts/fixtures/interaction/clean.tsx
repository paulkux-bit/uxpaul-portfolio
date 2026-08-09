/* FIXTURE — NEGATIVE CONTROLS for the .tsx-side checks. Nothing here may fail,
 * and each item must appear as an exclusion with a named reason. */
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

// check 5 — an icon with no px size at all: excluded as no-px-size
export const Sized = () => <ArrowRight className="icon" strokeWidth={1.7} />;

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
