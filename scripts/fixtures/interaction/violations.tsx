/* FIXTURE — every item here MUST be caught. One per .tsx-side check. */
import { ArrowRight, ChevronDown } from 'lucide-react';

// check 4 — a hand-authored <svg> icon. R3: Lucide is the only icon source. (1)
export const HandDrawn = () => (
  <svg viewBox="0 0 24 24" aria-hidden>
    <path d="M4 12h16" />
  </svg>
);

// check 5 — px sizing on an icon node. R2: em, never px. (2)
export const PxSized = () => <ArrowRight size={24} />;
export const PxWidth = () => <ChevronDown width={20} height={20} />;

// check 6 — a strokeWidth outside the §2.1 table (1 of the 3 icons here)
export const BadStroke = () => <ArrowRight strokeWidth={2} />;

// check 8 — state variants in .tsx. R4: interaction lives in globals.css. (4)
export const Variants = () => (
  <div className="hover:underline focus:outline active:translate-y-px group-hover:scale-105" />
);
