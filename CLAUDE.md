# UX Paul Portfolio — Claude Code Context

## Strategic direction
Strategic direction (audience, brand personality, references, anti-references, 
design principles, accessibility floor) lives in `PRODUCT.md` at the repo root. 
Read it before making design decisions. Defer to it on every judgment call.

## Project
Personal portfolio site for Paul Kali (Senior Product Designer with 8 years 
of leadership experience). Goal: land a senior IC, design lead, or director 
role by Aug 31, 2026.

## Stack (don't suggest changing)
- Next.js 16 (App Router) with Turbopack dev
- TypeScript strict mode
- Tailwind CSS v4 (CSS-based config in `app/globals.css`)
- next-themes for class-based dark mode
- Framer Motion for animation
- MDX for case study authoring (`@next/mdx`)
- Deployed on Vercel via GitHub (main branch = production)
- Impeccable skill installed; Retune to be added later

## File structure
- `app/` — App Router pages, layouts, globals.css
- `components/` — reusable components (no src/ folder)
- `mdx-components.tsx` — registers custom MDX components
- `PRODUCT.md` — strategic foundation (Impeccable-maintained)
- `CLAUDE.md` — this file (technical conventions)
- `AGENTS.md` — auto-generated, leave alone

## Breakpoints (match exactly)
Defined as CSS custom properties in `app/globals.css` under `@theme`:
- xs: 360px (small Android fallback)
- sm: 390px (mobile — primary mobile design target)
- md: 768px (tablet portrait)
- lg: 1024px (small laptop / tablet landscape)
- xl: 1440px (standard laptop — primary desktop design target)
- 2xl: 1920px (large desktop)

## Component conventions
- Server Components by default; add `'use client'` only when truly needed 
  (state, effects, browser APIs, Framer Motion components)
- Components live in `components/` at the repo root
- Co-locate styles via Tailwind utility classes
- No shadcn/ui — roll custom; my components are part of my craft signal
- Avoid premature abstraction; copy before generalizing

## PopUp annotation system (VH1 Pop-Up Video style)
Case studies live in `app/content/case-studies/*.mdx` (path TBD when 
implemented). Inline annotations authored as:

    <PopUp anchor="section-id">commentary text</PopUp>

Behavior:
- A global PopUpContext (in `components/popup-context.tsx`) toggles the 
  entire annotation layer on/off via a header button
- Each PopUp uses IntersectionObserver to trigger when its `anchor` 
  element enters viewport
- Framer Motion handles enter/exit (spring physics, gentle)
- Respect `prefers-reduced-motion`: skip animation, render as static 
  side annotation
- Mobile (below sm breakpoint): collapse pop-ups to footnote-style 
  inline links

This system is the portfolio's signature interaction — it solves the 
process-visibility gap without forcing linear case study walkthroughs.

## Accessibility (non-negotiable)
See `PRODUCT.md` for the full accessibility floor. Quick summary:
- WCAG AAA contrast on body text where feasible; AA elsewhere
- Honor `prefers-reduced-motion` for all motion
- Visible focus states on every interactive element
- Full keyboard navigation including PopUp toggle
- Meaningful alt text on every image (not "screenshot of design")
- Semantic HTML before ARIA

## Don't do this
- No purple gradients (anywhere)
- No generic Tailwind landing-page tropes (centered hero + 3-col feature 
  grid + testimonial + CTA pattern)
- No stock testimonials or placeholder marketing copy
- No fonts from the overused list: Inter, Geist, Mona Sans, Plus Jakarta 
  Sans, Space Grotesk, Recoleta, Instrument Sans, Fraunces — unless 
  we've documented a deliberate exception
- No oversized italic-serif hero h1 (current AI-marketing fingerprint)
- No uppercase letter-spaced eyebrow chips above hero h1
- No nested cards or glassmorphism
- No body text running to absolute viewport edge — always horizontal padding
- No emojis as decoration

## Typography (to be filled in during design system phase)
- Primary typeface: TBD
- Display typeface: TBD
- Mono: TBD
- Type scale: TBD (fixed for app UI, fluid for marketing pages)

## Color tokens (to be filled in during design system phase)
- Light mode palette: TBD (current placeholder in globals.css)
- Dark mode palette: TBD (current placeholder in globals.css)
- Use `oklch()` for everything; CSS variables defined in globals.css

## Workflow conventions
- Feature work happens on branches; PR before merge to main
- Run `/impeccable polish` before declaring any page "done"
- Run `/impeccable critique` on a page before showing it to anyone
- Use Retune for direct visual tweaks (when installed); Impeccable Live 
  Mode for variant exploration
- Commit messages in imperative mood ("Add header nav" not "Added header nav")
- Always test in both light and dark mode before committing