import type { MDXComponents } from 'mdx/types';
import { PopUp } from '@/components/popup';
import { Figure } from '@/components/figure';
import { FullBleed } from '@/components/full-bleed';
import { ModePair } from '@/components/mode-pair';
import { Compare } from '@/components/compare';
import { Detail } from '@/components/detail';
import { SmallMultiples } from '@/components/small-multiples';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    PopUp,
    Figure,
    FullBleed,
    ModePair,
    Compare,
    Detail,
    SmallMultiples,
  };
}
