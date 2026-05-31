import type { MDXComponents } from 'mdx/types';
import { PopUp } from '@/components/popup';
import { Figure } from '@/components/figure';
import { FullBleed } from '@/components/full-bleed';
import { ConstrainedBleed } from '@/components/constrained-bleed';
import { ModePair } from '@/components/mode-pair';
import { Compare } from '@/components/compare';
import { Detail } from '@/components/detail';
import { SmallMultiples } from '@/components/small-multiples';
import { AsymmetricPair } from '@/components/asymmetric-pair';
import { BentoGrid } from '@/components/bento-grid';
import { FramedPair } from '@/components/framed-pair';
import { HeroBlock } from '@/components/hero-block';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    PopUp,
    Figure,
    FullBleed,
    ConstrainedBleed,
    ModePair,
    Compare,
    Detail,
    SmallMultiples,
    AsymmetricPair,
    BentoGrid,
    FramedPair,
    HeroBlock,
  };
}
