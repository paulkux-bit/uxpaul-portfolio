export type AboutRole = {
  title: string;
  /** e.g. "Jun 2013 – Jan 2014". En-dash, never U+2014. */
  dates: string;
};

type AboutDrawerProps = {
  company: string;
  /** Full span shown in the summary row, e.g. "2010 – 2014". */
  year: string;
  /**
   * Role history, NEWEST FIRST. One entry renders the single meta line; more
   * than one renders the progression thread.
   */
  roles: AboutRole[];
  /** Optional provenance tag, e.g. "Agency · client work". */
  tag?: string;
  children: React.ReactNode;
};

/**
 * One résumé drawer. Native <details>/<summary>, closed by default, each one
 * independent. Server Component: there is no state to hold and no handler to
 * bind, so the open/close behaviour, Enter and Space, and the screen-reader
 * disclosure role are all the browser's own.
 *
 * A company can hold a role progression. With more than one role the summary
 * row carries the company and the full span but no title (the titles would
 * contradict each other), and the body opens with the progression thread so
 * the promotion is the first thing read. Ordered list, because the order is
 * the point.
 *
 * The animation is CSS-only, on ::details-content (see globals.css). An earlier
 * pass used the grid-template-rows 0fr->1fr wrapper, which needs JS to hold
 * `open` through the closing transition, and that interception broke the
 * keyboard in two ways under test: the native activation survived preventDefault
 * on the synthesised click and stranded the drawer open with its wrapper still
 * collapsed, and once keydown was handled too, Enter toggled twice and landed
 * back where it started. Driving it from the [open] attribute removes the class
 * of bug entirely. Browsers without ::details-content open instantly, which is
 * the same result the reduced-motion path gives.
 */
export function AboutDrawer({ company, year, roles, tag, children }: AboutDrawerProps) {
  const isProgression = roles.length > 1;

  return (
    <details className="about-drawer">
      <summary className="about-drawer__summary">
        {/* Company and role travel together: the role is the thing being
            scanned for, so it reads in the closed row rather than only inside.
            Multi-role companies surface the senior-most, which is roles[0]
            because roles are stored newest-first. */}
        <span className="about-drawer__id">
          <span className="about-drawer__company text-h3">{company}</span>
          <span className="about-drawer__role text-small">{roles[0].title}</span>
        </span>
        <span className="about-drawer__year text-small">{year}</span>
        <svg
          className="about-drawer__mark"
          viewBox="0 0 16 16"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M8 2.5v11M2.5 8h11" />
        </svg>
      </summary>

      <div className="about-drawer__inner">
        {tag ? <p className="about-drawer__tag text-caption">{tag}</p> : null}

        {isProgression ? (
          <ol className="about-roles">
            {roles.map((role) => (
              <li key={role.title} className="about-roles__step">
                <span className="about-roles__title text-small">{role.title}</span>
                <span className="about-roles__dates text-small">{role.dates}</span>
              </li>
            ))}
          </ol>
        ) : (
          /* Dates only. The title now reads in the summary row, so repeating it
             here would echo it a line later, which is the duplication this pass
             exists to remove. The precise months are the added value. */
          <p className="about-drawer__meta text-eyebrow">{roles[0].dates}</p>
        )}

        {children}
      </div>
    </details>
  );
}
