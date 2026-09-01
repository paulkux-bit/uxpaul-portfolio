// "Off the clock" — personal takes as a typographic wall (v2).
//
// v2 adds: composition templates (per-card layout + axis intent), an optional
// eyebrow, and a curated build-seeded rotation (getWallTakes picks 6-8 from the
// `featured` pool, varied per deploy, deterministic per build → no hydration
// mismatch). Axis character comes from the composition (CSS .comp-* classes)
// and per-take `mark.axisCharacter` overrides; both via font-variation-settings.
//
// NOTE: 9 of these takes are SAMPLE/PLACEHOLDER (see comments) — they exist so
// the rotation pool is large enough to be real. Paul curates: edit copy, set
// `featured`/`weight`, replace samples with real takes before public.

export type TakeSlot = 'large' | 'medium6' | 'medium5' | 'medium' | 'small4' | 'small3';
export type MarkType = 'stacked' | 'inline' | 'coords' | 'play';
export type EntrancePattern =
  | 'rise' | 'glide-right' | 'drop' | 'settle' | 'pop' | 'glide-left' | 'unfold';

// Per-card composition. (`word-swap` was "mark-inline" in the brief — renamed to
// avoid colliding with MarkType 'inline'.)
export type Composition =
  | 'mark-stacked'   // v1 default: mark top, thought below
  | 'mark-dominant'  // mark fills the card; thought a small caption
  | 'mark-watermark' // huge faint mark behind; thought overlaid
  | 'mark-beside'    // mark left / thought right
  | 'mark-cropped'   // mark overflows + clipped by the card edge
  | 'word-swap'      // mark sits inline with the thought
  | 'statement'      // no mark; the thought IS the display element
  | 'coords-corner'; // mark in a corner; thought dominant

export interface Take {
  id: string;
  slot: TakeSlot;
  composition: Composition;
  /** Optional — `statement` has no mark. */
  mark?: {
    type: MarkType;
    content: string | string[]; // string[] for stacked + coords
    /* wght only. Commissioner exposes no wdth and no opsz axis (type system v3, C3). */
    axisCharacter?: { wght?: number };
  };
  /** Optional — only when the mark doesn't carry the context. */
  eyebrow?: string;
  thought: string;
  entrance: EntrancePattern;
  featured: boolean;
  /** 0-10 selection weight (default 5). */
  weight: number;
}

export const SLOT_SPAN: Record<TakeSlot, number> = {
  large: 8, medium6: 6, medium5: 5, medium: 4, small4: 4, small3: 3,
};

export const takes: Take[] = [
  // --- The original 7, voice-refined ---
  { id: 'philly', slot: 'large', composition: 'mark-stacked',
    mark: { type: 'stacked', content: ['SUPER', 'BOWL', 'LII'] },
    thought: 'I’ll never forget the Philly Special.', entrance: 'rise', featured: true, weight: 8 },
  { id: 'wkw', slot: 'medium', composition: 'mark-beside',
    mark: { type: 'inline', content: 'WKW' },
    thought: 'Director: Wong Kar-wai.', entrance: 'glide-right', featured: true, weight: 6 },
  { id: 'arsenal', slot: 'small3', composition: 'mark-cropped',
    mark: { type: 'inline', content: '1886' },
    thought: 'Arsenal since 1886.', entrance: 'drop', featured: true, weight: 5 },
  { id: 'dorset', slot: 'medium6', composition: 'coords-corner',
    mark: { type: 'coords', content: ['50°43′N', '2°27′W'] },
    thought: 'Paradise is Dorset, England.', entrance: 'settle', featured: true, weight: 6 },
  { id: 'tony', slot: 'small3', composition: 'mark-stacked',
    mark: { type: 'inline', content: 'T·C' },
    thought: 'Tony’s Chocolonely is worth the markup.', entrance: 'pop', featured: true, weight: 4 },
  { id: 'mhtn', slot: 'medium5', composition: 'mark-watermark',
    mark: { type: 'stacked', content: ['BLK', 'MHTN'] },
    thought: 'A black Manhattan, slowly.', entrance: 'glide-left', featured: true, weight: 6 },
  { id: 'play', slot: 'small4', composition: 'mark-dominant',
    mark: { type: 'play', content: '▶' },
    thought: 'Down the cover-songs rabbit hole.', entrance: 'unfold', featured: true, weight: 5 },

  // --- SAMPLE takes (placeholder copy — curate/replace before public) ---
  { id: 'kerning', slot: 'medium6', composition: 'statement',
    thought: 'I will always notice your kerning.', entrance: 'settle', featured: true, weight: 5 },
  { id: 'coffee', slot: 'small4', composition: 'mark-dominant',
    mark: { type: 'inline', content: 'AM' },
    thought: 'Flat white, one shot.', entrance: 'drop', featured: true, weight: 4 },
  { id: 'calvino', slot: 'medium', composition: 'statement',
    thought: 'Rereading Calvino, again.', entrance: 'settle', featured: true, weight: 4 },
  { id: 'film', slot: 'medium', composition: 'word-swap',
    mark: { type: 'inline', content: '35mm' },
    thought: 'Shot on 35mm when I can.', entrance: 'glide-right', featured: true, weight: 4 },
  { id: 'london', slot: 'medium5', composition: 'coords-corner',
    mark: { type: 'coords', content: ['51°30′N', '0°07′W'] },
    thought: 'London, on foot.', entrance: 'settle', featured: true, weight: 5 },
  { id: 'type', slot: 'small3', composition: 'mark-cropped',
    mark: { type: 'inline', content: 'Aa' },
    thought: 'I will move that one pixel.', entrance: 'drop', featured: true, weight: 5 },
  { id: 'vinyl', slot: 'medium6', composition: 'mark-watermark',
    mark: { type: 'stacked', content: ['SIDE', 'A'] },
    thought: 'Vinyl, side A first.', entrance: 'glide-left', featured: true, weight: 4 },
  { id: 'rides', slot: 'medium', composition: 'statement',
    thought: 'Saturdays are for long rides.', entrance: 'settle', featured: true, weight: 4 },
  { id: 'undo', slot: 'small4', composition: 'mark-beside',
    mark: { type: 'inline', content: '⌘Z' },
    thought: 'Undo is underrated.', entrance: 'glide-right', featured: true, weight: 4 },
];

// ---- Build-seeded curated selection (deterministic per deploy, SSR-safe) ----

function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function weightedSample(pool: Take[], n: number, rng: () => number): Take[] {
  const remaining = [...pool];
  const out: Take[] = [];
  while (out.length < n && remaining.length) {
    const total = remaining.reduce((s, t) => s + Math.max(0.0001, t.weight), 0);
    let r = rng() * total;
    let idx = 0;
    for (let i = 0; i < remaining.length; i++) {
      r -= Math.max(0.0001, remaining[i].weight);
      if (r <= 0) { idx = i; break; }
    }
    out.push(remaining.splice(idx, 1)[0]);
  }
  return out;
}

/** Order so no two neighbours share a composition (hard); prefer differing mark
 *  type (soft). Greedy with a relaxed fallback so it never fails on a small set. */
function orderByAdjacency(items: Take[], rng: () => number): Take[] {
  const pool = [...items].sort(() => rng() - 0.5);
  const out: Take[] = [];
  while (pool.length) {
    const prev = out[out.length - 1];
    let pick = pool.findIndex(
      (t) => !prev || (t.composition !== prev.composition && t.mark?.type !== prev.mark?.type),
    );
    if (pick === -1) pick = pool.findIndex((t) => !prev || t.composition !== prev.composition);
    if (pick === -1) pick = 0; // relaxed fallback (tiny pool) — accept a repeat
    out.push(pool.splice(pick, 1)[0]);
  }
  return out;
}

/** The 6-8 takes shown this build. Reseeds per deploy via the git SHA. */
export function getWallTakes(): Take[] {
  const seedStr =
    process.env.VERCEL_GIT_COMMIT_SHA || process.env.GIT_SHA || 'dev-seed';
  const rng = mulberry32(hashSeed(seedStr));
  const pool = takes.filter((t) => t.featured);
  const count = Math.min(pool.length, 6 + Math.floor(rng() * 3)); // 6-8
  return orderByAdjacency(weightedSample(pool, count, rng), rng);
}
