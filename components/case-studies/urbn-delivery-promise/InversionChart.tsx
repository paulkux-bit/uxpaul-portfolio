import type { CSSProperties } from 'react';
import manifest from './inversion-manifest.json';

/** Whole class strings, not `--${s.style}` interpolation. A template-built className
 *  reads to lint:interaction check 9 as the dangling prefix "inversion-chart__path--",
 *  and more to the point it hides the real name from grep. Both names carry a rule. */
const SERIES_CLASS: Record<string, string> = {
  solid: 'inversion-chart__path--solid',
  dashed: 'inversion-chart__path--dashed',
};
const KEY_CLASS: Record<string, string> = {
  solid: 'inversion-chart__key--solid',
  dashed: 'inversion-chart__key--dashed',
};

/**
 * Missed delivery dates against price. Two series, monochrome, one solid and one
 * dashed. No hue, no third series.
 *
 * THE MODULE IS THE INVERSION. The x axis is ordered by price, cheapest first, so the
 * line rises exactly where a reader expects it to fall: the premium bought a worse
 * chance of arriving on time. Everything else is in service of that one reading.
 *
 * Same line vocabulary as JourneyLine — same viewBox, same dotted axis, same dashed
 * reference rule, same dot radius — so the two read as one hand, and it obeys the same
 * split: only geometry and numerals in the SVG, every word in HTML. The tier labels are
 * an HTML row aligned to the tier x values; the values are an HTML list that doubles as
 * the table view.
 *
 * THE ONE CARVE-OUT is the direct series labels, which stay in the drawing at >=768
 * where 16 units renders at 17.4px, and are hidden below it rather than left at 5.5px.
 * The HTML legend is present at every width, so identity never depends on them. Per the
 * dataviz skill: a legend is mandatory at two or more series and direct labels
 * supplement it; identity rides a line-key beside the name, never the text colour.
 *
 * y is COMPUTED from the percentages via `scale`, never stored, so a value and its
 * plotted position cannot drift apart. Edit inversion-manifest.json, never this file.
 */
export default function InversionChart() {
  const { geometry: g, scale, tiers, series, unit, caption } = manifest;

  const y = (value: number) => scale.yZero - (value / scale.valueMax) * (scale.yZero - scale.yMax);
  const refY = y(manifest.refValue);
  const vbWidth = Number(g.viewBox.split(' ')[2]);

  const tracks = [
    tiers[0].x,
    ...tiers.slice(1).map((t, i) => t.x - tiers[i].x),
    vbWidth - tiers[tiers.length - 1].x,
  ]
    .map((t) => `${((t / vbWidth) * 100).toFixed(3)}%`)
    .join(' ');

  const style = {
    ['--ic-series' as string]: `${g.fontSize.series}px`,
    ['--ic-dot-r' as string]: `${g.dotR}px`,
    ['--ic-dot-r-sm' as string]: `${g.dotRMobile}px`,
    ['--ic-tier-cols' as string]: tracks,
  } as CSSProperties;

  const refLabel = <p className="inversion-chart__ref-label">{manifest.refLabel}</p>;

  return (
    <figure className="inversion-chart" style={style}>
      {manifest.refLabelPlacement === 'above' ? refLabel : null}

      <svg className="inversion-chart__svg" viewBox={g.viewBox} role="img" aria-label={manifest.ariaLabel}>
        <line className="inversion-chart__ref" x1={g.refX1} y1={refY} x2={g.refX2} y2={refY} />

        {series.map((s) => {
          const d = s.values.map((v, i) => `${i === 0 ? 'M' : 'L'}${tiers[i].x},${y(v)}`).join(' ');
          return (
            <g key={s.name}>
              <path className={`inversion-chart__path ${SERIES_CLASS[s.style]}`} d={d} />
              {s.values.map((v, i) => (
                <circle
                  key={`${s.name}-${i}`}
                  className="inversion-chart__dot"
                  cx={tiers[i].x}
                  cy={y(v)}
                  r={g.dotR}
                />
              ))}
              {/* Supplements the legend at >=768; hidden below it, never shrunk. */}
              <text
                className="inversion-chart__series"
                x={g.seriesLabelX}
                y={y(s.values[s.values.length - 1]) + g.seriesLabelOffsetY}
              >
                {s.name}
              </text>
            </g>
          );
        })}

        <line className="inversion-chart__axis" x1={g.axisX1} y1={g.axisY} x2={g.axisX2} y2={g.axisY} />
      </svg>

      {manifest.refLabelPlacement === 'below' ? refLabel : null}

      {/* The x axis, in HTML, aligned to the tier x values. aria-hidden because the
          list below names every tier again and carries the numbers with it — a screen
          reader should get the data once, not the labels twice. */}
      <ol className="inversion-chart__axis-row" aria-hidden="true">
        {tiers.map((t, i) => (
          <li key={t.short} style={{ gridColumnStart: i + 2 }}>
            {t.short}
          </li>
        ))}
      </ol>

      {/* Always present, at every width. Identity rides the line-key, not the text. */}
      <ul className="inversion-chart__legend">
        {series.map((s) => (
          <li key={s.name}>
            <span className={`inversion-chart__key ${KEY_CLASS[s.style]}`} aria-hidden="true" />
            {s.name}
          </li>
        ))}
      </ul>

      <ol className="inversion-chart__tiers">
        {tiers.map((t, i) => (
          <li key={t.label}>
            <span className="inversion-chart__tier-name">{t.label}</span>
            <span className="inversion-chart__tier-days">{t.days}</span>
            <span className="inversion-chart__tier-values">
              {series.map((s) => (
                <span key={s.name} className="inversion-chart__tier-value">
                  <span className="inversion-chart__tier-series">{s.name}</span>
                  {s.values[i]}
                  {unit}
                </span>
              ))}
            </span>
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
