export type AboutRole = {
  title: string;
  /** e.g. "Jun 2013 – Jan 2014". En-dash, never U+2014. */
  dates: string;
};

type AboutDrawerProps = {
  company: string;
  /** Full span shown on the row, e.g. "2010 – 2014". */
  year: string;
  /**
   * Role history, NEWEST FIRST. One entry renders the precise date line; more
   * than one renders the progression list.
   */
  roles: AboutRole[];
  children: React.ReactNode;
};

/**
 * One résumé row. Native <details>/<summary>, closed by default, each one
 * independent. Server Component: there is no state to hold and no handler to
 * bind, so open/close, Enter and Space, and the screen-reader disclosure role
 * are all the browser's own.
 *
 * ONE DOM for both breakpoints. Company, role and year are flat siblings and
 * the layout difference is entirely the grid definition:
 *
 *   mobile   company on its own line, then a single muted meta line reading
 *            "Role · Year". The interpunct is a ::after on the role, not a
 *            text node, so the desktop layout can drop it without a second
 *            markup branch.
 *   desktop  one line: company, role, year right-aligned, mark.
 *
 * The mark is the summary's own ::after, which makes it the fourth grid item
 * without being a node: nothing for a screen reader to skip, and no SVG to keep
 * in sync. It is drawn from two gradients rather than a glyph so the cross stays
 * geometric at any font, and it aligns to the FIRST baseline so a company name
 * that wraps cannot drag it down the row.
 *
 * The whole row is the affordance: <summary> is the click and focus target and
 * carries a 44px minimum so the tap area clears the floor.
 *
 * Open body order is prose first, then the role history. That separation is
 * what stops the row's muted role line sitting directly above an identical
 * bright progression title.
 */
export function AboutDrawer({ company, year, roles, children }: AboutDrawerProps) {
  const isProgression = roles.length > 1;

  return (
    <details className="about-row">
      <summary className="about-row__summary">
        <span className="about-row__company text-h3">{company}</span>
        <span className="about-row__role text-small">{roles[0].title}</span>
        <span className="about-row__year text-small">{year}</span>
      </summary>

      <div className="about-row__inner">
        {children}

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
          /* The precise months, which the row's coarse span does not carry.
             text-caption, not text-eyebrow: that utility is reserved for
             all-caps tags, and it was rendering these dates as tracked
             uppercase while the progression list a screen away stayed sentence
             case. */
          <p className="about-row__meta text-caption">{roles[0].dates}</p>
        )}
      </div>
    </details>
  );
}
