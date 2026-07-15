import { BentoTheme, BentoItem, BentoBand, BentoRibbon } from '@/components/bento';

/**
 * ResolutionsBento — the generic manifest → <BentoTheme> adapter.
 *
 * The "one adapter for all themes" from docs/decisions/RESOLUTIONS-BENTO-ARCHITECTURE.md,
 * built generic now that Theme 2 is the first second consumer. It is a THIN adapter that
 * feeds the existing bento engine (components/bento.tsx): all slot geometry, cover/focal,
 * retina floors, ribbon behaviour, and caption typography (`.bento-theme__lead` →
 * --text-primary, `.bento-theme__gloss` → --text-secondary) live in the engine. This file
 * only maps manifest → engine children. NOT a new engine, NOT a copy of it.
 *
 * Manifest shape (Theme 2 onward):
 *   • `caption` is an object `{ lead, tail }` — passed straight through (lead → the tile's
 *     `caption`, tail → `gloss`); no ". " string split.
 *   • src resolved by name + mode: the light stem is `<name>`, the dark twin `<name>--dark`
 *     — NOT a `${name}-${mode}` suffix.
 * Fixed-mix: the engine never theme-swaps a src.
 *
 * TODO(migrate): fold Resolutions01Bento.tsx onto this adapter once Theme-1's manifest is
 * reshaped to `{ lead, tail }` captions. Left untouched for now — its string-caption /
 * `${name}-${mode}` convention still works standalone.
 */

type Mode = 'light' | 'dark';

interface ManifestImage {
  src: string;
  alt: string;
  focalPoint: { x: number; y: number };
  caption: { lead: string; tail?: string };
  slot?: 'feature' | 'standard';
  breakout?: 'band' | 'ribbon';
  aspect?: number;
  /** Band only: below md, floor the media at this px width in a scroll track (targeted
   *  per-crop; unset = no floor). Set for the KPI strip, illegibly thin on mobile. */
  scrollFloor?: number;
}
type CompEntry = { name: string; mode: Mode };
type CompRow = CompEntry | CompEntry[];

export interface ResolutionsManifest {
  images: ManifestImage[];
  composition: CompRow[];
}

/** Filename stem: `.../projection--band.png` → `projection--band`. */
const stem = (src: string) => (src.split('/').pop() ?? src).replace(/\.png$/, '');

export default function ResolutionsBento({ manifest }: { manifest: ResolutionsManifest }) {
  const byStem = new Map(manifest.images.map((im) => [stem(im.src), im]));

  /** Light tile stem is `<name>`; the dark twin is `<name>--dark`. No mode suffix. */
  function resolve({ name, mode }: CompEntry): ManifestImage {
    const key = mode === 'dark' ? `${name}--dark` : name;
    const im = byStem.get(key);
    if (!im) throw new Error(`ResolutionsBento: no image "${key}" in the manifest`);
    return im;
  }

  function renderTile(entry: CompEntry, key: string) {
    const im = resolve(entry);
    // lead → the tile's bold caption; tail → the muted gloss. The engine paints both.
    const shared = {
      src: im.src,
      alt: im.alt,
      caption: im.caption.lead,
      gloss: im.caption.tail,
      focal: im.focalPoint,
    };
    if (im.breakout === 'ribbon') return <BentoRibbon key={key} {...shared} aspect={im.aspect!} />;
    if (im.breakout === 'band')
      return <BentoBand key={key} {...shared} aspect={im.aspect!} scrollFloor={im.scrollFloor} />;
    return <BentoItem key={key} {...shared} slot={im.slot!} />;
  }

  // Flatten in document order — a nested row's entries emit inline and adjacent, which the
  // engine reads to build a shared row; breakouts self-isolate at their document position.
  const children = manifest.composition.flatMap((row, i) =>
    Array.isArray(row)
      ? row.map((entry, j) => renderTile(entry, `${i}-${j}`))
      : renderTile(row, `${i}`),
  );

  return <BentoTheme>{children}</BentoTheme>;
}
