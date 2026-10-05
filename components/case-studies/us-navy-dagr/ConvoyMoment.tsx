import { FrictionMoment, type FrictionMomentProps } from '@/components/friction-moment';
import manifest from './moment-manifest.json';

/**
 * Line of Sight's friction moment, section 02: the convoy that has moved on while
 * the analyst's pin stays where he last put it. Binds moment-manifest.json to the
 * generic FrictionMoment, the way AnalysisBento binds its manifest to the bento
 * adapter, so the MDX carries only the caption and the asset facts live in one
 * file that lint:assets checks against git.
 */
export default function ConvoyMoment({ caption, gloss }: { caption: string; gloss?: string }) {
  const { label, base, vehicles } = manifest as Pick<FrictionMomentProps, 'label' | 'base' | 'vehicles'>;
  return <FrictionMoment label={label} base={base} vehicles={vehicles} caption={caption} gloss={gloss} />;
}
