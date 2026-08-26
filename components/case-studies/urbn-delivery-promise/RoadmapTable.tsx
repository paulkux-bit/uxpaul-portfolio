import manifest from './roadmap-manifest.json';

/**
 * The roadmap, as three shipped milestones and what each one put on a screen.
 * Ported from the `.mf` block of docs/previews/roadmap-table-prototype.html. That
 * file also holds `.pa` and `.cf`, two earlier candidates that are not this, and
 * four further rejected forms sit in docs/previews/dependency-map-*.html.
 *
 * THIS MODULE HAS NO GEOMETRY, AND THAT IS WHY IT SURVIVED. No SVG, no viewBox,
 * no computed positions. Seven forms were prototyped; every one that carried a
 * drawing broke at one width or another, and one stretched into a solid black
 * blob below 768 because vector-effect was scoped to a media query while the
 * drawing was not. Three columns at desktop, stacked below 768, and nothing in
 * between needs to be positioned.
 *
 * ROW ORDER IS THE DECK'S AND IT IS SETTLED, confirmed 25 Aug. See $orderDoc in
 * the manifest for where the reasoning lives. Reordering is three `n` values and
 * the array order, nothing here.
 *
 * Every string comes from roadmap-manifest.json. Nothing is hardcoded here.
 */
export default function RoadmapTable() {
  const { columns, rows, coda, caption } = manifest;

  return (
    <figure className="roadmap-table">
      {/* aria-hidden: at desktop these are visual column headers, and each row
          repeats the third one inline for the stacked reading below 768. */}
      <div className="roadmap-table__head" aria-hidden="true">
        <span className="text-eyebrow">{columns.milestone}</span>
        <span className="text-eyebrow">{columns.built}</span>
        <span className="text-eyebrow">{columns.replaced}</span>
      </div>

      <ol className="roadmap-table__rows">
        {rows.map((row) => (
          <li key={row.n}>
            <span className="roadmap-table__milestone">
              {/* A span, not an <em>. The numeral is a label, not stress emphasis,
                  and routing it through the global em remap would make its weight
                  inherited rather than authored. */}
              <span className="roadmap-table__n">{row.n}</span>
              {row.milestone}
            </span>

            <ul className="roadmap-table__features">
              {row.built.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>

            <p className="roadmap-table__replaced">
              <span className="roadmap-table__replaced-label text-eyebrow">{columns.replaced}</span>
              {row.replaced}
            </p>
          </li>
        ))}
      </ol>

      <div className="roadmap-table__coda">
        <span className="roadmap-table__coda-label text-eyebrow">{coda.label}</span>
        <p>{coda.line}</p>
      </div>

      <figcaption className="bento-theme__caption">
        <span className="bento-theme__lead">{caption.lead}</span>{' '}
        <span className="bento-theme__gloss">{caption.gloss}</span>
      </figcaption>
    </figure>
  );
}
