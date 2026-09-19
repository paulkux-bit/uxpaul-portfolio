// Usage: node scripts/check-manifest-assets.mjs   (run from the repo root)
//
// Every image `src` in every case-study manifest must resolve to a path that
// `git ls-files` returns. NOT to a file on disk.
//
// WHY THE INDEX AND NOT THE FILESYSTEM. On 19 Sep 2026 a pass removed six
// superseded PNGs from git and never added the six replacements. The new files
// existed on disk, untracked, so every local instrument agreed: the manifests
// parsed, the dimensions matched, `next build` succeeded, and all eight gates
// went green. Vercel builds from git, which did not have the files, so three
// tiles shipped as broken-image placeholders. The defect was invisible to every
// check that asked the filesystem, because disk and index had diverged and only
// the index is what deploys.
//
// This is the declared-versus-rendered family again, and the nastiest member so
// far: it cannot be seen before a push. A green local build is not evidence that
// a referenced asset will exist in production.
//
// `next build` does not verify that an image src resolves to anything, so this
// check is the only thing standing between a renamed crop and a 404 on the
// deployed page.
import { readFile, readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const MANIFEST_ROOT = 'components/case-studies';
const PUBLIC_PREFIX = 'public';

/** Every path git actually tracks, as a Set for O(1) membership. */
function trackedPaths() {
  const out = execFileSync('git', ['ls-files'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  return new Set(out.split('\n').filter(Boolean));
}

async function manifestFiles(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await manifestFiles(full)));
    else if (entry.name.endsWith('.json')) found.push(full);
  }
  return found;
}

/**
 * Walk any JSON shape and yield every string value under a `src` key.
 *
 * PENDING ENTRIES ARE SKIPPED, and that exception is coupled to its premise. A
 * tile marked `pending: true` declares a crop that has not been cut yet: the file
 * is absent from disk AND from the index, and the renderer does not emit it, so
 * it cannot 404. Delivery Promise's sequence-manifest carries three of these
 * (ad--wide, pdp--standard, cart--standard); the built page references them zero
 * times. Failing on those would make this check red for a reason it was not
 * written to catch, and a gate that is red for the wrong reason gets switched off.
 *
 * The premise is `pending` meaning "not rendered". If a pending tile ever starts
 * rendering, this exception stops being safe — which is why the skip is counted
 * and printed rather than silent.
 */
function collectSrcs(node, out = [], pendingOut = []) {
  if (Array.isArray(node)) {
    for (const v of node) collectSrcs(v, out, pendingOut);
  } else if (node && typeof node === 'object') {
    const isPendingTile = node.pending === true && typeof node.src === 'string';
    for (const [k, v] of Object.entries(node)) {
      if (k === 'src' && typeof v === 'string') {
        (isPendingTile ? pendingOut : out).push(v);
      } else if (k !== 'src') {
        collectSrcs(v, out, pendingOut);
      }
    }
  }
  return out;
}

const tracked = trackedPaths();
const files = await manifestFiles(MANIFEST_ROOT);

const failures = [];
const skipped = [];
let checked = 0;

for (const file of files) {
  let data;
  try {
    data = JSON.parse(await readFile(file, 'utf8'));
  } catch (err) {
    failures.push({ where: file, detail: `does not parse: ${err.message}` });
    continue;
  }
  const pending = [];
  for (const src of collectSrcs(data, [], pending)) {
    // Only web-root asset references. Anything else (a bare stem, an http URL)
    // is not this check's business.
    if (!src.startsWith('/')) continue;
    checked += 1;
    const repoPath = PUBLIC_PREFIX + src;
    if (!tracked.has(repoPath)) {
      failures.push({
        where: file,
        detail: `src "${src}" is NOT in git ls-files (expected ${repoPath}). It may exist on disk and still 404 in production.`,
      });
    }
  }
  for (const src of pending) skipped.push({ where: file, src });
}

console.log(
  `manifest-assets: ${files.length} manifests, ${checked} src references, ${skipped.length} pending skipped\n`,
);

// The pending exception is PRINTED, never silent. It is safe only while a pending
// tile does not render; showing it every run is what makes that premise checkable
// by eye instead of rotting unnoticed.
if (skipped.length) {
  console.log('⚠ SKIPPED, marked pending:true (declared but not rendered):');
  for (const s of skipped) console.log(`    ${s.src}\n        in ${s.where}`);
  console.log('');
}
if (failures.length === 0) {
  console.log('✓ 1. Every manifest src resolves to a git-tracked path');
  console.log('    PASS\n');
} else {
  console.log('✗ 1. Every manifest src resolves to a git-tracked path');
  for (const f of failures.slice(0, 20)) console.log(`    ✗ ${f.where}\n        ${f.detail}`);
  if (failures.length > 20) console.log(`    … and ${failures.length - 20} more (${failures.length} total)`);
  console.log('');
}

console.log(`Result: ${failures.length === 0 ? 1 : 0} of 1 passing, ${failures.length === 0 ? 0 : 1} failing`);
process.exit(failures.length === 0 ? 0 : 1);
