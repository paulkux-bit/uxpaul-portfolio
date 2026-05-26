/**
 * Global site footer. Server-rendered, static. Rendered in app/layout.tsx so it
 * sits below every page. A full-bleed top hairline (--border-subtle) bookends
 * the header's bottom hairline; content is contained in the shared max-w-6xl
 * shell. One horizontal row at md+, stacked on mobile.
 *
 * Links are plain <a>: the base `a` rule in globals.css supplies the editorial
 * two-channel hover (underline 1px -> 2px, border-strong -> link-hover) and the
 * global two-layer focus halo, so no per-link styling is needed. Text is
 * text-caption / --text-secondary (AAA on canvas in both modes).
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-subtle">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-caption text-secondary md:flex-row md:items-center md:justify-between md:px-8 md:py-12">
        <p>Designed and built by Paul Kali &middot; 2026</p>
        <nav aria-label="Footer" className="flex gap-6">
          <a
            href="https://www.linkedin.com/in/uxpaul/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a href="mailto:paulk.ux@gmail.com">Email</a>
        </nav>
      </div>
    </footer>
  );
}
