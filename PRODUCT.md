# Product

## Register

brand

## Users

Product design hiring managers and design leads at consumer-grade product companies — FAANG, well-funded startups, and design-mature in-house teams. They evaluate senior candidates across IC, lead, and director tracks. They spend roughly five minutes per portfolio and have seen hundreds. They pattern-match on craft quality, systems thinking, and process visibility before they read a single word.

## Product Purpose

A senior product designer's portfolio with eight years of leadership experience. The site must telegraph deliberate decision-making, range across problem types, and the ability to lead — within the first scroll. Not a gallery of polished mockups; a structured argument for hiring.

The home hero leads with a **concrete proof statement**, not a positioning tagline: a single large line stating what Paul does and for whom (currently: intelligence platforms for the U.S. Navy), set so that *weight* carries the emphasis. The name follows as a quiet signature, then the fuller proof (URBN leadership across four brands). A fact does the arguing — no marketing tagline, no tenure number, no geographic qualifier. (The retired "Consumer-grade craft…" line is gone for good; "craft" and "consumer-grade" stay out of hero copy.)

## Brand Personality

Warm, refined, inventive. Confident without being cold. Personal without being casual. The kind of person you'd want leading your design team: someone who makes deliberate choices, communicates clearly, and brings unexpected craft to everything they touch.

## References

- **Rauno Freiberg**: Craft-forward, interaction-rich, shows technical depth alongside design sensibility. Take the interaction quality and attention to micro-detail.
- **Tobias van Schneider**: Editorial, personal voice, storytelling-led case studies. Take the narrative structure and personal tone.
- **Diana Lu** (diana.lu): Motion-rich case study covers, irreverent section labeling, personality breaking through the template. Take the energy and structural inventiveness — but in a senior register, not aspirational-intern.

## Anti-references

- **Dribbble showcase**: All polish, no process. Flashy mockups with no story behind them.
- **SaaS template**: Generic hero + features grid + testimonials. Cookie-cutter layout. The visible AI-generated landing-page signature.
- **Brutalist / dark-terminal**: Over-indexed on developer aesthetic, not warm or approachable.
- **Agency portfolio**: Too corporate, too many logos, not personal enough.

### Specific patterns to avoid

- **Wall of screenshots**: Undifferentiated case study grids of 20–40 mockups with no hierarchy, annotation, or narrative role.
- **AI-marketing aesthetic**: Oversized italic-serif hero h1, uppercase letter-spaced eyebrow chips, purple gradients, glassmorphism. Instantly dated.
- **Overused designer fonts**: Inter, Geist, Mona Sans, Plus Jakarta Sans, Space Grotesk, Recoleta, Instrument Sans, Fraunces. Hiring managers see these on every other portfolio.
- **Junior-coded playfulness**: Emojis as decoration, giddy tone, hobby-collage about pages. Personality comes through structure and voice, not through trying to seem fun.
- **Generic Tailwind tropes**: Centered hero, three-column feature grid, testimonial section, CTA. This sequence is the visible AI signature.
- **Nested cards, decorative gradients, stock testimonials**: Instant red flags.

## Design Principles

1. **Show the thinking.** Process visibility over polished outcomes. Every case study image carries hierarchy, annotation, or narrative role. The portfolio is a structured argument, not a lookbook.
2. **Earn every element.** Nothing decorative without purpose. If it doesn't telegraph craft, systems thinking, or leadership, remove it. Restraint is the proof of seniority.
3. **First-scroll conviction.** Five minutes, hundreds of portfolios. The opening must make the case before anyone scrolls to a case study. Structure and quality do the talking.
4. **Craft as proof.** The portfolio itself is a case study. Interaction design, typography, and motion quality demonstrate capability directly. Practice what you preach.
5. **Senior register.** Warm and personal, never casual or performative. Personality expressed through structural choices and voice, not decoration.
6. **Rhythm is the baseline; deviation is a tool.** A consistent spacing/layout grid is the default, but intentional departure from it is a craft move, not a defect. Distinguish chosen-irregular (deliberate tension, overlap, asymmetry, density — a strength; respect it) from accidental-irregular (an unowned value off the grid that nobody decided on — a flaw; flag it). Flag only the accidents. Example: the mobile callout overlapping the hero image is chosen tension (keep); a 28px heading margin nobody chose is an accident (snap to grid).

## Accessibility & Inclusion

- WCAG AAA contrast on body text where feasible; AA minimum elsewhere
- Full keyboard navigation including annotation/popup toggles
- Visible focus states on every interactive element — no `outline: none` without a replacement
- Contrast verified in both light and dark modes
- Semantic HTML before ARIA — no div soup with role attributes papered on
- Meaningful alt text on every case study image (e.g., "Navigation prototype showing four-brand cross-shopping," not "screenshot of design")
- Reduced-motion fallbacks: when `prefers-reduced-motion` is enabled, animations render as static alternatives rather than being stripped
- No information conveyed by color alone — pair color with text, icon, or shape
