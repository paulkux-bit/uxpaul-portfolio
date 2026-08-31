import manifest from './roadmap-manifest.json';

/**
 * The roadmap, as six numbered items across one horizon.
 *
 * THIS WAS A THREE-COLUMN TABLE CALLED RoadmapTable UNTIL 1 Sep, and the rename is
 * the point rather than tidying: a component named for a shape it no longer renders
 * is the defect class this study has spent a week logging. The table's fourteen
 * cells restated earlier sections in eleven of them, and the deck's longer-term
 * column - the half that actually evidences a direction - had never been shown at
 * all. See $doc and $horizonDoc.
 *
 * TITLE AND GLOSS ARE IN THEIR OWN COLUMNS, AND THAT IS THE WHOLE READING ARGUMENT.
 * Six glosses sharing one left edge are scanned in a single pass down that edge. Set
 * inline after their titles they would each start somewhere different, and the eye
 * has to hunt for the next one. The grid is what buys it; the tracks are explicit in
 * globals.css rather than left to `fr` resolution, so the edge is a construction
 * rather than a coincidence of six similar title lengths.
 *
 * NO GEOMETRY, WHICH IS WHY THE MODULE IT REPLACES SURVIVED SEVEN REJECTED FORMS. No
 * SVG, no viewBox, no computed positions - every candidate carrying a drawing broke
 * at one width or another, and one stretched into a solid black blob below 768.
 * Grid columns and hairlines only.
 *
 * ORDER IS THE DECK'S AND IT IS SETTLED. See $orderDoc, which also carries the
 * standing constraint that no caption may explain WHY this order: the sequence is
 * settled, the reasoning for it is not.
 *
 * Every string comes from roadmap-manifest.json. Nothing is hardcoded here.
 */
export default function RoadmapList() {
  const { items, caption } = manifest;

  return (
    <figure className="roadmap-list">
      <ol className="roadmap-list__items">
        {items.map((item) => (
          <li key={item.n}>
            {/* A span, not an <em>. The numeral is a label, not stress emphasis, and
                routing it through the global em remap would make its weight inherited
                rather than authored. Carried over from the module this replaces. */}
            <span className="roadmap-list__n">{item.n}</span>
            {/* A span rather than a heading. Six roadmap items are a LIST, not six
                subsections, and <h3> would put all six into the document outline
                between section 06's h2 and section 07's. The old module used a span
                here for the same reason. */}
            <span className="roadmap-list__title">{item.title}</span>
            <p className="roadmap-list__gloss">{item.gloss}</p>
          </li>
        ))}
      </ol>

      <figcaption className="bento-theme__caption">
        <span className="bento-theme__lead">{caption.lead}</span>{' '}
        <span className="bento-theme__gloss">{caption.gloss}</span>
      </figcaption>
    </figure>
  );
}
