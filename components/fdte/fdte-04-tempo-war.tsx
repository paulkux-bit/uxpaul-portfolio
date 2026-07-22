import type { SVGProps } from 'react';

/**
 * STUB — placeholder line art for "tempo-war".
 * Intent: the aperture COLLAPSED to a single fact with its confidence
 * attached — tempo collapses the window. Real art is a later pass.
 */
export default function FdteTempoWar(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 640 360" fill="none" {...props}>
      {/* the aperture, collapsed: faint ghost of the wide ring */}
      <circle cx={320} cy={168} r={110} stroke="currentColor" strokeWidth={1.5} opacity={0.25} />
      <circle cx={320} cy={168} r={44} stroke="currentColor" strokeWidth={2} opacity={0.4} />
      {/* one fact */}
      <circle cx={320} cy={168} r={11} fill="currentColor" />
      {/* its confidence, attached: a short bar and its measure */}
      <rect x={352} y={162} width={96} height={12} rx={2} stroke="currentColor" strokeWidth={2.5} />
      <rect x={352} y={162} width={77} height={12} rx={2} fill="currentColor" />
      <text x={320} y={330} fontSize="20" textAnchor="middle" fill="currentColor" opacity={0.7}>
        collapsed: one fact, confidence attached
      </text>
    </svg>
  );
}
