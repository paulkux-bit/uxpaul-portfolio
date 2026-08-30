import manifest from './inversion-manifest.json';

/**
 * Missed delivery dates against price, across the whole network. One line, three
 * points, monochrome.
 *
 * THE MODULE IS THE INVERSION. The x axis is ordered by price, cheapest first, so
 * the line rises exactly where a reader expects it to fall: the premium bought a
 * worse chance of arriving on time. The dotted rule marks where standard sat, so the
 * climb is measured against dependable rather than against zero.
 *
 * ONE SERIES, DELIBERATELY. This replaced a two-line chart that plotted All nodes
 * against Store network as peers; they are not peers, because All nodes is the
 * aggregate that contains the store network. See the manifest's $historyDoc. The
 * breakdown that chart was reaching for is <NodeChart>, which does it correctly by
 * holding the tier constant.
 *
 * NO TEXT IN THE SVG. Every position is COMPUTED from `scale`, never stored, so a
 * value and its plotted point cannot drift apart. Edit inversion-manifest.json,
 * never this file.
 */
export default function TierChart() {
  const { tierGeometry: g, scale, tiers, unit, tierCaption: caption } = manifest;

  const y = (value: number) => scale.yZero - (value / scale.valueMax) * (scale.yZero - scale.yMax);
  const round = (n: number) => Number(n.toFixed(1));

  const refY = round(y(manifest.refValue));
  const d = tiers.map((t, i) => `${i === 0 ? 'M' : 'L'}${t.x},${round(y(t.value))}`).join(' ');
  const last = tiers.length - 1;

  return (
    <figure className="tier-chart">
      {/* ONE BODY WRAPPER, AND IT EXISTS FOR THE PAIR RATHER THAN FOR THIS CHART.
          .chart-pair gives each figure `grid-template-rows: 1fr auto`, so the caption
          sits in its own row at the foot and the two captions land on one line. That
          needs everything above the caption to be a SINGLE child; without it each of
          these four blocks would claim a row of its own and the pair would have
          nothing to align. NodeChart carries the same wrapper for the same reason. */}
      <div className="tier-chart__body">
      <svg className="tier-chart__svg" viewBox={g.viewBox} role="img" aria-label={manifest.tierAriaLabel}>
        <line className="tier-chart__ref" x1={g.refX1} y1={refY} x2={g.refX2} y2={refY} />
        <path className="tier-chart__line" d={d} />
        {tiers.map((t, i) => (
          <circle
            key={t.label}
            /* The last point is filled and larger: it is the argument, not just the
               end of the line. Same move as JourneyLine's end dot. */
            className={i === last ? 'tier-chart__dot tier-chart__dot--end' : 'tier-chart__dot'}
            cx={t.x}
            cy={round(y(t.value))}
            r={i === last ? g.dotREnd : g.dotR}
          />
        ))}
        <line className="tier-chart__axis" x1={g.axisX1} y1={g.axisY} x2={g.axisX2} y2={g.axisY} />
      </svg>

      {/* The values and tier names, in HTML at reading size. aria-hidden because the
          SVG's label above already states every number: a screen reader should get
          the data once, not twice. Three equal columns, with the first left, the
          second centred and the third right, so each label sits under its own point
          without any of them overflowing the drawing at 320px. */}
      <ol className="tier-chart__tiers" aria-hidden="true">
        {tiers.map((t, i) => (
          <li key={t.label}>
            <span className={i === last ? 'tier-chart__value tier-chart__value--end' : 'tier-chart__value'}>
              {t.value}
              {unit}
            </span>
            <span className="tier-chart__tier">{t.label}</span>
          </li>
        ))}
      </ol>

      <p className="tier-chart__ref-label">{manifest.refLabel}</p>
      </div>

      <figcaption className="bento-theme__caption">
        <span className="bento-theme__lead">{caption.lead}</span>{' '}
        <span className="bento-theme__gloss">{caption.gloss}</span>
      </figcaption>
    </figure>
  );
}
