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
 * Missed delivery dates against price, in TWO PANELS on one shared scale. Monochrome,
 * one solid stroke and one dashed. No hue.
 *
 * THE MODULE IS THE INVERSION. The x axis is ordered by price, cheapest first, so the
 * line rises exactly where a reader expects it to fall: the premium bought a worse
 * chance of arriving on time. Everything else is in service of that one reading.
 *
 * PANEL 2 IS THE PROOF IT WAS SOLVABLE, and it is the part that can be got wrong in a
 * way a reader cannot detect. Reno is a FULFILMENT CENTRE, so it reads against panel 1's
 * All nodes series, never against the store network. See the manifest's $precisionDoc;
 * nothing here, in the titles, in the caption or in the aria label may imply Reno solved
 * the store problem.
 *
 * ONE MANIFEST, NOT TWO. geometry, scale, tiers and the reference rule live once at the
 * top level and every panel is drawn against them, so the panels are provably on the
 * same scale and cannot drift apart. y is COMPUTED from the percentages via `scale`,
 * never stored. Edit inversion-manifest.json, never this file.
 *
 * NO DIRECT SERIES LABELS IN THE DRAWING. They used to sit in the SVG above 768 and were
 * justified by desktop legibility at full band; at half band the same 16 units compute
 * to roughly 8px against a 14px floor, so they are gone rather than shrunk. The
 * always-present HTML legend carries identity at every width. See $splitDoc.
 *
 * Same line vocabulary as JourneyLine — same viewBox, same dotted axis, same dashed
 * reference rule, same dot radius — so the two read as one hand, and it obeys the same
 * split: only geometry and numerals in the SVG, every word in HTML. The annotation uses
 * JourneyLine's tailNote mechanism unchanged: an HTML paragraph grid-placed against the
 * same tier tracks the axis row rides.
 */
export default function InversionChart() {
  const { geometry: g, scale, tiers, panels, unit, caption } = manifest;

  const y = (value: number) => scale.yZero - (value / scale.valueMax) * (scale.yZero - scale.yMax);
  const refY = y(manifest.refValue);
  const vbWidth = Number(g.viewBox.split(' ')[2]);

  /* Grid tracks from the tier x values: a leading spacer to the first label, then the
     gap to each next one, then the remainder. Items are placed explicitly from column 2,
     so a label sits under its point and moving a point in the manifest moves its label.
     Shared by both panels, which is why the two axis rows align across the pair. */
  const tracks = [
    tiers[0].x,
    ...tiers.slice(1).map((t, i) => t.x - tiers[i].x),
    vbWidth - tiers[tiers.length - 1].x,
  ]
    .map((t) => `${((t / vbWidth) * 100).toFixed(3)}%`)
    .join(' ');

  const style = {
    ['--ic-dot-r' as string]: `${g.dotR}px`,
    ['--ic-dot-r-sm' as string]: `${g.dotRMobile}px`,
    ['--ic-tier-cols' as string]: tracks,
  } as CSSProperties;

  return (
    <figure className="inversion-chart" style={style}>
      {/* One aria-label for the pair, on a group rather than per-SVG: the panels are one
          argument and a screen reader that met them as two unrelated charts would lose
          the comparison that is the point. Each panel's own drawing is aria-hidden and
          the shared values list below carries the numbers once. */}
      <div className="inversion-chart__panels" role="img" aria-label={manifest.ariaLabel}>
        {panels.map((panel) => (
          <div className="inversion-chart__panel" key={panel.id}>
            <p className="inversion-chart__panel-title">{panel.title}</p>

            <svg className="inversion-chart__svg" viewBox={g.viewBox} aria-hidden="true">
              <line className="inversion-chart__ref" x1={g.refX1} y1={refY} x2={g.refX2} y2={refY} />

              {panel.series.map((s) => {
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
                  </g>
                );
              })}

              <line className="inversion-chart__axis" x1={g.axisX1} y1={g.axisY} x2={g.axisX2} y2={g.axisY} />
            </svg>

            <p className="inversion-chart__ref-label">{manifest.refLabel}</p>

            {/* The x axis, in HTML, aligned to the tier x values. aria-hidden because the
                values list below names every tier again and carries the numbers with it —
                a screen reader should get the data once, not the labels twice. */}
            <ol className="inversion-chart__axis-row" aria-hidden="true">
              {tiers.map((t, i) => (
                <li key={t.short} style={{ gridColumnStart: i + 2 }}>
                  {t.short}
                </li>
              ))}
            </ol>

            {/* Identity rides the line-key, never the text colour. Present at every width
                now that the direct labels are gone from the drawing. */}
            <ul className="inversion-chart__legend">
              {panel.series.map((s) => (
                <li key={s.name}>
                  <span className={`inversion-chart__key ${KEY_CLASS[s.style]}`} aria-hidden="true" />
                  {s.name}
                </li>
              ))}
            </ul>

            {/* JourneyLine's tailNote mechanism, unchanged: grid-placed against the same
                tier tracks so the note lands under the column it is about. Below the
                two-across breakpoint the row is a run, the grid is off, and it is simply
                the next line. */}
            {'annotation' in panel && panel.annotation ? (
              <p className="inversion-chart__endnote">
                <span style={{ gridColumnStart: tiers.length + 1 }}>{panel.annotation}</span>
              </p>
            ) : null}
          </div>
        ))}
      </div>

      {/* The table view, once for the pair rather than once per panel: a reader comparing
          Reno to All nodes wants the three numbers for a tier side by side, and splitting
          them across two lists would be the one arrangement that hides the comparison. */}
      <ol className="inversion-chart__tiers">
        {tiers.map((t, i) => (
          <li key={t.label}>
            <span className="inversion-chart__tier-name">{t.label}</span>
            <span className="inversion-chart__tier-days">{t.days}</span>
            <span className="inversion-chart__tier-values">
              {panels.flatMap((p) => p.series).map((s) => (
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
