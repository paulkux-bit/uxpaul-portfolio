import type { SVGProps } from 'react';

/**
 * STUB — placeholder line art for the FDT-E "int-convergence" figure.
 * Intent (for the real art pass): six intelligence disciplines converging on
 * one contact, arriving out of step and disagreeing — "not too little data,
 * too much." Monochrome, currentColor, floats on paper. Real art is a later
 * design pass (Paul may draw these); keep the build green meanwhile.
 */
const STREAMS = ['COMINT', 'ELINT', 'GEOINT', 'HUMINT', 'MASINT', 'OSINT'];

export default function FdteIntConvergence(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 640 360" fill="none" {...props}>
      {STREAMS.map((name, i) => {
        const y = 40 + i * 56;
        // staggered, out-of-step arrival: each stream stops a different distance short
        const reach = 380 + (i % 3) * 46;
        return (
          <g key={name}>
            <text x="16" y={y + 5} fontSize="20" fontWeight="600" fill="currentColor" letterSpacing="1">
              {name}
            </text>
            {/* stream line, drawn as thin fill bars with a gap pattern per stream */}
            {Array.from({ length: 6 }, (_, seg) => {
              const x0 = 110 + seg * 50 + (i % 2) * 12;
              if (x0 > reach) return null;
              return <rect key={seg} x={x0} y={y - 1.5} width={34} height={3} fill="currentColor" />;
            })}
            {/* arrival tick, deliberately misaligned vertically toward the node */}
            <circle cx={reach} cy={y} r={5} fill="currentColor" />
          </g>
        );
      })}
      {/* the single contact the streams claim to describe */}
      <circle cx={560} cy={180} r={26} stroke="currentColor" strokeWidth={4} />
      <circle cx={560} cy={180} r={7} fill="currentColor" />
      <text x={560} y={236} fontSize="18" textAnchor="middle" fill="currentColor" opacity={0.7}>
        one contact
      </text>
    </svg>
  );
}
