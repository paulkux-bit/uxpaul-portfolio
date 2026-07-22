import type { SVGProps } from 'react';

/**
 * STUB — placeholder line art for "tempo-training".
 * Intent: the aperture with its GAPS LIT — training wants the rough edges
 * surfaced, friction is the point. Real art is a later pass.
 */
export default function FdteTempoTraining(props: SVGProps<SVGSVGElement>) {
  const r = 110;
  const cx = 320;
  const cy = 168;
  // ring drawn as segments with deliberate gaps; the gaps get emphasis ticks
  const segs = [
    [-80, -30], [-10, 40], [65, 110], [140, 200], [225, 265],
  ];
  return (
    <svg viewBox="0 0 640 360" fill="none" {...props}>
      {segs.map(([a0, a1], i) => {
        const large = a1 - a0 > 180 ? 1 : 0;
        const x0 = cx + r * Math.cos((a0 * Math.PI) / 180);
        const y0 = cy + r * Math.sin((a0 * Math.PI) / 180);
        const x1 = cx + r * Math.cos((a1 * Math.PI) / 180);
        const y1 = cy + r * Math.sin((a1 * Math.PI) / 180);
        return (
          <path
            key={i}
            d={`M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`}
            stroke="currentColor"
            strokeWidth={5}
          />
        );
      })}
      {/* the gaps, lit: small markers pointing at what the exercise surfaced */}
      {[[-20, 0], [52, 0], [125, 0], [212, 0], [278, 0]].map(([mid], i) => {
        const gx = cx + (r + 22) * Math.cos((mid * Math.PI) / 180);
        const gy = cy + (r + 22) * Math.sin((mid * Math.PI) / 180);
        return <circle key={i} cx={gx} cy={gy} r={5} fill="currentColor" />;
      })}
      <text x={320} y={330} fontSize="20" textAnchor="middle" fill="currentColor" opacity={0.7}>
        gaps lit: friction is the point
      </text>
    </svg>
  );
}
