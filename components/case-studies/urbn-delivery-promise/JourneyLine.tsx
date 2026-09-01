import manifest from './journey-manifest.json';

type Point = { x: number; y: number };
type Composition = {
  viewBox: string;
  dotR: number;
  points: Point[];
};

/** Percent along an axis, for positioning an HTML element over a viewBox coordinate. */
const pct = (value: number, extent: number) => `${((value / extent) * 100).toFixed(3)}%`;

/** viewBox "0 0 W H" → [W, H]. */
const extent = (viewBox: string) => {
  const [, , w, h] = viewBox.split(' ').map(Number);
  return [w, h] as const;
};

const path = (points: Point[]) =>
  points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

/**
 * Angela's order, drawn as a line across five stages of sentiment.
 *
 * SHE RECOVERS THREE TIMES AND IS KNOCKED DOWN THREE TIMES. That sawtooth is the
 * argument: every time the order looks fine again, something else breaks. An earlier
 * point array had been flattened toward a steady decline, which reads as a customer
 * who was disappointed once - a bad day rather than a horror story.
 *
 * TWO COMPOSITIONS, NOT ONE DRAWING THAT SHRINKS. Horizontal from 768, vertical
 * below. A phone scrolls down, so the journey runs down and each stage gets a full
 * label instead of a 65px column. Both are rendered and CSS picks one, because the
 * choice is a layout question and belongs in the stylesheet.
 *
 * THE AXIS IS LABELLED, WHICH REPLACED AN APPARATUS. Happy / Fine / Angry comes from
 * the 2019 deck's three faces. It retired the abstract reference rule, its label, its
 * placement flag and the caption clause that all existed to explain what the ending
 * meant. See the manifest's $sentimentDoc; do not reintroduce a reference rule.
 *
 * NO TEXT INSIDE THE SVG, at either orientation. The marks are HTML badges positioned
 * from their own point's coordinates, and there is no SVG dot underneath one - the
 * badge IS the marker at those three points. Every position here is COMPUTED from the
 * manifest; edit journey-manifest.json, never this file.
 */
export default function JourneyLine() {
  const { horizontal, vertical, stages, marks, breaks, sentiment, caption } = manifest;

  /* The three break points carry badges, so they are excluded from the dot list
     rather than drawn under one. Derived from `marks` so adding a mark cannot leave
     a dot stranded beneath it. */
  const badged = new Set(marks.map((m) => m.pointIndex));

  const drawing = (comp: Composition, orientation: 'horizontal' | 'vertical') => {
    const [w, h] = extent(comp.viewBox);
    return (
      /* role="img" + the label live HERE, on the plot, NOT on the outer <figure>.
         ARIA declares `img` Children Presentational, so a figure-level role can collapse
         the whole subtree into one leaf and take the breaks list and the figcaption with
         it. Chromium's own AX tree does NOT collapse them - measured 1 Sep, all five
         strings unignored - but WebKit and several screen readers do, and the label
         narrates the sentiment arc without containing any of those five strings, so where
         it does collapse they are simply gone. TierChart and NodeChart already scope their
         role to an inner element for the same reason; this was the outlier. */
      <div className="journey-line__plot" role="img" aria-label={manifest.ariaLabel}>
        <svg className="journey-line__svg" viewBox={comp.viewBox} aria-hidden="true">
          {orientation === 'horizontal' ? (
            <>
              {horizontal.bandY.map((y) => (
                <line key={y} className="journey-line__band" x1={0} y1={y} x2={w} y2={y} />
              ))}
              {horizontal.dividerX.map((x) => (
                <line key={x} className="journey-line__divider" x1={x} y1={40} x2={x} y2={h} />
              ))}
            </>
          ) : (
            vertical.bandX.map((x) => (
              <line key={x} className="journey-line__band" x1={x} y1={10} x2={x} y2={h - 10} />
            ))
          )}

          <path className="journey-line__path" d={path(comp.points)} />

          {comp.points.map((p, i) =>
            badged.has(i) ? null : (
              <circle key={i} className="journey-line__dot" cx={p.x} cy={p.y} r={comp.dotR} />
            ),
          )}
        </svg>

        {marks.map((m) => {
          const p = comp.points[m.pointIndex];
          return (
            <span
              key={m.index}
              className="journey-line__mark"
              aria-hidden="true"
              style={{ left: pct(p.x, w), top: pct(p.y, h) }}
            >
              {m.index}
            </span>
          );
        })}
      </div>
    );
  };

  const [, vh] = extent(vertical.viewBox);
  const [hw] = extent(horizontal.viewBox);

  return (
    <figure className="journey-line">
      {/* Horizontal, from 768. The sentiment labels are a column beside the drawing,
          one per band, and the stage labels sit under it at their band centres. */}
      <div className="journey-line__horizontal">
        <ul className="journey-line__sentiment" aria-hidden="true">
          {sentiment.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <div>
          {drawing(horizontal, 'horizontal')}
          <p className="journey-line__stages" aria-hidden="true">
            {stages.map((s, i) => (
              <span key={s.label} style={{ left: pct(horizontal.stageX[i], hw) }}>
                {s.label}
              </span>
            ))}
          </p>
        </div>
      </div>

      {/* Vertical, below 768. The same three labels head three columns, and each stage
          label sits at the y of its own first point - computed, never laid out on an
          even grid, which is what put every label near but not on its stage before. */}
      <div className="journey-line__vertical">
        <div className="journey-line__vertical-head" aria-hidden="true">
          <span />
          {/* NO role="list" HERE, AND THAT IS AN EXCLUSION RATHER THAN A MISS. The
              other three decorative lists carry aria-hidden on the element itself;
              this one is hidden BY INHERITANCE from .journey-line__vertical-head
              directly above, so a grep over element attributes reads it as the one
              list on the site still missing the role. It is not. If that parent
              ever stops being aria-hidden, this needs the role. */}
          <ul className="journey-line__sentiment-cols">
            {sentiment.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
        <div className="journey-line__vertical-body">
          <ul className="journey-line__stages-down" aria-hidden="true">
            {stages.map((s) => (
              <li key={s.label} style={{ top: pct(vertical.points[s.firstPointIndex].y, vh) }}>
                {s.label}
              </li>
            ))}
          </ul>
          {drawing(vertical, 'vertical')}
        </div>
      </div>

      {/* role="list" because .journey-line__breaks is list-style: none, which strips list
          semantics in WebKit. Same instrument and same reasoning as RoadmapList's <ol>. */}
      <ol className="journey-line__breaks" role="list">
        {breaks.map((b) => (
          <li key={b.index}>
            <span className="journey-line__breaks-idx" aria-hidden="true">
              {b.index}
            </span>
            <span className="journey-line__breaks-lead">{b.lead}</span>
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
