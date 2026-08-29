import { Fragment } from 'react';
import type { CSSProperties } from 'react';
import manifest from './inversion-manifest.json';

/**
 * Missed delivery dates on overnight and rush only, broken out by node. Three
 * labelled rows with proportional widths, and an average marker where the aggregate
 * sits.
 *
 * THE ARGUMENT IS THE SPREAD. 11, 15 and 45 at one tier, one company, one period,
 * rolling up into an average of 22. The average was hiding a four-fold gap, and a
 * reader who only saw the aggregate would have concluded the network had a mild
 * problem everywhere instead of a severe one in one place.
 *
 * NOT AN SVG, AND THAT IS THE WHOLE DESIGN. Three labelled rows with proportional
 * widths is a CSS grid: `max-content 1fr max-content`, so the names and the values
 * are real HTML text that never wraps or shrinks, and the track is the only thing
 * that flexes. At 320px the track is around 150px and the store bar is still ~135 of
 * it against Reno's ~33 — the comparison survives because the ratio lives in the
 * geometry rather than in the size. A drawing would have put those labels inside a
 * viewBox and back under the type floor. See the manifest's $splitDoc.
 *
 * PRECISION: Reno and Gap are FULFILMENT CENTRES and the store network is STORES, so
 * these read against the network aggregate and never as proof about stores. The
 * caption's gloss carries that and is not a placeholder. See $precisionDoc.
 *
 * Widths are COMPUTED from `barMax`, and the average marker from the tier chart's
 * own last value, so the marker cannot drift from the line it summarises. Edit
 * inversion-manifest.json, never this file.
 */
export default function NodeChart() {
  const { nodes, barMax, tiers, unit, nodeCaption: caption } = manifest;

  const pct = (value: number) => `${((value / barMax) * 100).toFixed(1)}%`;

  /* The aggregate these three roll up into is the tier chart's overnight point,
     referenced rather than restated so the two modules cannot disagree. */
  const average = tiers[tiers.length - 1].value;

  const style = { ['--nc-average' as string]: pct(average) } as CSSProperties;

  return (
    <figure className="node-chart" style={style}>
      {/* The marker label rides the same track as the bars, so it sits over the rule
          rather than over the row labels. aria-hidden: the SVG-free chart below is
          already fully readable text, and the aria label on the group states the
          average in a sentence. */}
      <p className="node-chart__average" aria-hidden="true">
        <span className="node-chart__average-label">
          Average {average}
          {unit}
        </span>
      </p>

      {/* ONE GRID, NINE CELLS, NOT THREE NESTED GRIDS. Each row must share the same
          three columns or the 1fr track is sized per row and the bars stop being
          comparable. Measured when this was three sub-grids: tracks came out 394,
          401 and 332px, because "Store network" is a wider label than "Reno FC" and
          ate its own row's track. The bars are the argument, so they have to be on
          one scale. Fragment per node, never a wrapper element. */}
      <div className="node-chart__rows" role="img" aria-label={manifest.nodeAriaLabel}>
        {nodes.map((n) => (
          <Fragment key={n.label}>
            <span className={n.emphasis ? 'node-chart__name node-chart__name--hi' : 'node-chart__name'}>
              {n.label}
            </span>
            <span className="node-chart__track" aria-hidden="true">
              <span
                className={n.emphasis ? 'node-chart__fill node-chart__fill--hi' : 'node-chart__fill'}
                style={{ width: pct(n.value) }}
              />
            </span>
            <span className={n.emphasis ? 'node-chart__value node-chart__value--hi' : 'node-chart__value'}>
              {n.value}
              {unit}
            </span>
          </Fragment>
        ))}
      </div>

      <figcaption className="bento-theme__caption">
        <span className="bento-theme__lead">{caption.lead}</span>{' '}
        <span className="bento-theme__gloss">{caption.gloss}</span>
      </figcaption>
    </figure>
  );
}
