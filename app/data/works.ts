// The fine art works, typed. The data is JSON so scripts/lint-works.mjs and
// scripts/build-fine-art.mjs can read it with plain Node; this module is what the
// component imports. See the $doc in works.json for what each field is for.
import data from './works.json';

export interface Work {
  slug: string;
  /** The case-study slug whose section 2 renders this work. */
  study: string;
  artist: string;
  title: string;
  date: string;
  institution: string;
  accession: string;
  objectUrl: string;
  licence: string;
  master: { file: string; md5: string; width: number; height: number };
  /** The 1x box at 1440. The 2x files are exactly twice it. */
  display: { width: number; height: number };
  /** [1x, 2x] per format. */
  files: { avif: [string, string]; webp: [string, string] };
  alt: string;
  caption: { lead: string; gloss: string };
}

export const WORKS = data.works as Work[];

export function getWork(slug: string): Work {
  const work = WORKS.find((w) => w.slug === slug);
  if (!work) throw new Error(`No fine art work "${slug}" in app/data/works.json`);
  return work;
}
