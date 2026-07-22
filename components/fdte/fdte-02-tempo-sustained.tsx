import type { SVGProps } from 'react';

/**
 * STUB — placeholder line art for "tempo-sustained".
 * Intent: an aperture of tolerated ambiguity, WIDE OPEN — sustained
 * operations afford ambiguity. One unifying aperture idea across the tempo
 * trio; the war sets the dial. Real art is a later pass.
 */
export default function FdteTempoSustained(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 640 360" fill="none" {...props}>
      {/* wide-open aperture: a full, generous ring */}
      <circle cx={320} cy={168} r={110} stroke="currentColor" strokeWidth={5} />
      <circle cx={320} cy={168} r={64} stroke="currentColor" strokeWidth={2.5} opacity={0.55} />
      {/* ambiguity admitted freely: loose marks scattered inside the aperture */}
      {[
        [278, 128], [356, 112], [312, 190], [370, 208], [262, 206], [332, 148],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={4.5} fill="currentColor" opacity={0.6} />
      ))}
      <text x={320} y={330} fontSize="20" textAnchor="middle" fill="currentColor" opacity={0.7}>
        aperture wide: ambiguity affordable
      </text>
    </svg>
  );
}
