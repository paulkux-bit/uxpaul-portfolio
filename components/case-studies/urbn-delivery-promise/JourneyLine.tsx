import type { CSSProperties } from 'react';
import manifest from './journey-manifest.json';

/**
 * One shopper's order, drawn as a single line. Track A of
 * docs/previews/journey-line-prototype.html — the approved shape, and still the
 * approved shape. Track B (the full map, with a problems inventory) was compared and
 * rejected; none of it is here.
 *
 * THE RULE, and it is stronger than the one the prototype encoded:
 *
 *     Only geometry and numerals stay in the SVG. Every word goes in HTML.
 *
 * The prototype moved the three break descriptions out and kept the stage labels, the
 * reference label and the tail note in. Measured at a real 390px viewport those render
 * at 4.79px and 5.47px — the prose container is 342px, so the scale is 0.342. Scaling
 * the type is not the fix: "POST PURCHASE" at a legible 32 units is ~250 units wide,
 * and five of those want ~1,250 units in a 1,000-unit box. Words structurally do not
 * fit a shared coordinate space. Numerals stay because two characters do fit, and they
 * are bumped at mobile through --jl-mark-sm.
 *
 * The last point is a FILLED dot below the reference rule. That is the whole argument
 * of the module: she ends lower than she started. Do not normalise it away.
 *
 * Every number and string comes from journey-manifest.json. Nothing is hardcoded here.
 */
export default function JourneyLine() {
  const { geometry: g, points, marks, stages, breaks, caption } = manifest;

  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const last = points.length - 1;
  const vbWidth = Number(g.viewBox.split(' ')[2]);

  /* Grid tracks from the stage x values: a leading spacer to the first label, then the
     gap to each next one, then the remainder. Items are placed explicitly from column 2,
     so a label sits under its point and moving a point in the manifest moves its label. */
  const tracks = [
    stages[0].x,
    ...stages.slice(1).map((s, i) => s.x - stages[i].x),
    vbWidth - stages[stages.length - 1].x,
  ]
    .map((t) => `${((t / vbWidth) * 100).toFixed(3)}%`)
    .join(' ');

  const style = {
    ['--jl-mark' as string]: `${g.fontSize.mark}px`,
    ['--jl-mark-sm' as string]: `${g.fontSize.markMobile}px`,
    ['--jl-dot-r' as string]: `${g.dotR}px`,
    ['--jl-dot-r-sm' as string]: `${g.dotRMobile}px`,
    ['--jl-dot-r-end' as string]: `${g.endDotR}px`,
    ['--jl-dot-r-end-sm' as string]: `${g.endDotRMobile}px`,
    ['--jl-stage-cols' as string]: tracks,
  } as CSSProperties;

  const refLabel = <p className="journey-line__ref-label">{manifest.refLabel}</p>;

  return (
    <figure className="journey-line" style={style}>
      {manifest.refLabelPlacement === 'above' ? refLabel : null}

      <svg className="journey-line__svg" viewBox={g.viewBox} role="img" aria-label={manifest.ariaLabel}>
        <line className="journey-line__ref" x1={g.refX1} y1={g.refY} x2={g.refX2} y2={g.refY} />
        <path className="journey-line__path" d={d} />

        {points.map((p, i) => (
          <circle
            key={`dot-${i}`}
            className={i === last ? 'journey-line__dot journey-line__dot--end' : 'journey-line__dot'}
            cx={p.x}
            cy={p.y}
            /* The attribute is the fallback. CSS `r` overrides it at mobile where it is
               supported; where it is not, the dot degrades to this radius, never to none. */
            r={i === last ? g.endDotR : g.dotR}
          />
        ))}

        {/* The only text left in the drawing. Two characters, so they fit.

            x/y anchor the numeral to its POINT and the offset rides a CSS transform,
            rather than being baked into x/y. That is what lets the offset change at the
            breakpoint: below md the type goes 17 -> 44 units and the dot 4.5 -> 13, and
            the desktop offset would sit the numeral on top of its own dot. */}
        {marks.map((m) => (
          <text
            key={`mark-${m.index}`}
            className="journey-line__idx"
            x={points[m.pointIndex].x}
            y={points[m.pointIndex].y}
            style={{
              ['--jl-mdx' as string]: `${m.dx}px`,
              ['--jl-mdy' as string]: `${m.dy}px`,
              ['--jl-mdx-sm' as string]: `${m.dxMobile}px`,
              ['--jl-mdy-sm' as string]: `${m.dyMobile}px`,
            } as CSSProperties}
          >
            {m.index}
          </text>
        ))}

        <line className="journey-line__axis" x1={g.axisX1} y1={g.axisY} x2={g.axisX2} y2={g.axisY} />
      </svg>

      {manifest.refLabelPlacement === 'below' ? refLabel : null}

      {/* The x axis, in HTML. Aligned to the stage x values from md up; an interpunct
          run below that, where five aligned columns would be 68px each. */}
      <ol className="journey-line__stages">
        {stages.map((s, i) => (
          <li key={s.label} style={{ gridColumnStart: i + 2 }}>
            {s.label}
          </li>
        ))}
      </ol>

      {/* The note annotates where the LINE ends, so at md it is placed in the last stage
          column rather than left where it would read as a note about "Arrive". Below md
          the row is a run, the grid is off, and it is simply the next line. */}
      <p className="journey-line__endnote">
        <span style={{ gridColumnStart: stages.length + 1 }}>{manifest.tailNote}</span>
      </p>

      <ol className="journey-line__breaks">
        {breaks.map((b) => (
          <li key={b.index}>
            <span className="journey-line__breaks-idx">{b.index}</span>
            <span className="journey-line__breaks-lead">{b.lead}</span> {b.tail}
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
