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
   * Role history, NEWEST FIRST. One entry renders the single meta line; more
   * than one renders the progression thread.
   */
  roles: AboutRole[];
  /** Optional provenance tag, e.g. "Agency · client work". */
  tag?: string;
  children: React.ReactNode;
};

/**
 * One résumé row. Native <details>/<summary>, closed by default, each one
 * independent. Server Component: there is no state to hold and no handler to
 * bind, so open/close, Enter and Space, and the screen-reader disclosure role
 * are all the browser's own.
 *
 * ONE DOM for both breakpoints. Company, role and year are flat siblings, and
 * the layout difference is entirely grid-template-columns: stacked as
 * company + year / role on mobile, and company | role | year | mark inline from
 * md up. An earlier version wrapped company and role in a shared element, which
 * forced the two layouts to disagree about what the grid items were.
 *
 * The mark is the summary's ::after, so it is a grid item without being a node:
 * nothing for a screen reader to skip, and no SVG to keep in sync. It is drawn
 * from two gradients rather than a glyph so the cross stays geometric at any
 * font, and it rotates 45deg on open only when motion is allowed.
 *
 * The whole row is the affordance: <summary> is the click and focus target, and
 * it carries a 44px minimum so the tap area clears the floor.
 */
export function AboutDrawer({ company, year, roles, tag, children }: AboutDrawerProps) {
  const isProgression = roles.length > 1;

  return (
    <details className="about-row">
      <summary className="about-row__summary">
        <span className="about-row__company text-h3">{company}</span>
        <span className="about-row__role text-small">{roles[0].title}</span>
        <span className="about-row__year text-small">{year}</span>
      </summary>

      <div className="about-row__inner">
        {tag ? <p className="about-row__tag text-caption">{tag}</p> : null}

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
          /* Dates only. The title already reads on the row, so repeating it here
             would echo it a line later. The precise months are the added value. */
          <p className="about-row__meta text-eyebrow">{roles[0].dates}</p>
        )}

        {children}
      </div>
    </details>
  );
}
