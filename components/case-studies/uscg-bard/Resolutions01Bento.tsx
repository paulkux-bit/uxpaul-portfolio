import { BentoTheme, BentoItem, BentoBand, BentoRibbon } from '@/components/bento';
import manifest from './theme1-grid-manifest.json';

/**
 * Resolutions 01 — "how you file" bento.
 *
 * A thin MANIFEST → <BentoTheme> adapter: it maps each crop in the bento-crop
 * manifest onto an engine element and lets <BentoTheme> (components/bento.tsx) do
 * all the layout, `sizes`, retina, object-position, caption typography, flush
 * hairline, and reduced-motion work. The crops were cut to lib/bento-slots.json's
 * slot aspects, so cover-to-slot is ~lossless. See
 * docs/decisions/RESOLUTIONS-BENTO-ARCHITECTURE.md — this same adapter shape is the
 * path for Themes 2 & 3 (different manifest, same renderer).
 *
 * FIXED-MIX, not a theme toggle: each tile shows ONE screenshot at the `mode`
 * (light/dark) named in `composition`. The engine never swaps a src with the theme.
 * To audit an alternate mix, pass a `composition` override (Phase 3 A/B) — do NOT
 * mutate the JSON. NO PopUp layer, by design.
 */

type Mode = 'light' | 'dark';
type CompEntry = { name: string; mode: Mode };
/** A solo tile, or a nested array = one shared row (adjacency carries the grouping). */
type CompRow = CompEntry | CompEntry[];

interface ManifestImage {
  src: string;
  alt: string;
  focalPoint: { x: number; y: number };
  caption: string;
  /** Standard-grid tile. Mutually exclusive with `breakout`. */
  slot?: 'feature' | 'standard';
  /** Full-width breakout. `aspect` (N:1) is required when set. */
  breakout?: 'band' | 'ribbon';
  aspect?: number;
}

const images = manifest.images as ManifestImage[];
const defaultComposition = manifest.composition as CompRow[];

/** Manifest src → bare filename, e.g. ".../location--chip-strip-light.png" → "location--chip-strip-light". */
const stem = (src: string) => src.split('/').pop()!.replace(/\.png$/, '');
const byStem = new Map(images.map((im) => [stem(im.src), im]));

/** A composition entry names a crop + its mode; the stem encodes both. */
function resolve({ name, mode }: CompEntry): ManifestImage {
  const im = byStem.get(`${name}-${mode}`);
  if (!im) throw new Error(`Resolutions01Bento: no crop for "${name}-${mode}" in the manifest`);
  return im;
}

/** Split a one-string caption into the engine's bold lead + muted gloss at the first ". ". */
function splitCaption(text: string): { caption: string; gloss?: string } {
  const i = text.indexOf('. ');
  if (i < 0) return { caption: text };
  return { caption: text.slice(0, i + 1), gloss: text.slice(i + 2) };
}

function renderTile(entry: CompEntry, key: string) {
  const im = resolve(entry);
  const { caption, gloss } = splitCaption(im.caption);
  const shared = { src: im.src, alt: im.alt, caption, gloss, focal: im.focalPoint };

  if (im.breakout === 'ribbon') return <BentoRibbon key={key} {...shared} aspect={im.aspect!} />;
  if (im.breakout === 'band') return <BentoBand key={key} {...shared} aspect={im.aspect!} />;
  return <BentoItem key={key} {...shared} slot={im.slot!} />;
}

export default function Resolutions01Bento({
  composition = defaultComposition,
}: {
  composition?: CompRow[];
}) {
  // Flatten in document order — a nested row's entries emit inline and adjacent, which
  // is exactly what the engine reads to build the shared row (override mode chunks the
  // two `standard` slots into one 2-up). Breakouts self-isolate at their document spot.
  const children = composition.flatMap((row, i) =>
    Array.isArray(row)
      ? row.map((entry, j) => renderTile(entry, `${i}-${j}`))
      : renderTile(row, `${i}`),
  );

  return <BentoTheme>{children}</BentoTheme>;
}
