import { describe, expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';
import { run } from '../scripts/lint-works.mjs';

// The negative controls for lint:works. The gate itself is the build step; this
// proves each of its checks CAN fail, because a check that cannot go red reads
// exactly like one that passed. Each case starts from a clean tree that passes
// all five, breaks one thing, and asserts that the right check names it.

const RECORD = {
  slug: 'test-work',
  study: 'test-study',
  artist: 'An Artist',
  title: 'A Title',
  date: '1900',
  institution: 'A Museum',
  accession: '1.2.3',
  objectUrl: 'https://example.org/1',
  licence: 'Public Domain',
  master: { file: 'test.jpg', md5: '0', width: 1280, height: 800 },
  display: { width: 640, height: 400 },
  files: {
    avif: ['/fine-art/test-work-640.avif', '/fine-art/test-work-1280.avif'],
    webp: ['/fine-art/test-work-640.webp', '/fine-art/test-work-1280.webp'],
  },
  alt: "A boat's crew in a swell.",
  caption: { lead: 'Lead.', gloss: 'Gloss.' },
};

const PAGE = (src = '/fine-art/test-work-640.webp', alt = 'A boat&#x27;s crew in a swell.') =>
  `<main><figure class="friction-moment"><picture><img class="friction-moment__image" src="${src}" alt="${alt}"/></picture></figure></main>`;

async function tree({ record = RECORD, page = PAGE(), skip = [], sizes = {}, tracked } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'lint-works-'));
  for (const d of ['data', 'mdx', 'html', 'public/fine-art']) mkdirSync(join(root, d), { recursive: true });
  writeFileSync(join(root, 'data/works.json'), JSON.stringify({ works: [record] }));
  writeFileSync(join(root, 'mdx/test-study.mdx'), '---\nslug: "test-study"\ntemplate: "A"\n---\n');
  if (page !== null) writeFileSync(join(root, 'html/test-study.html'), page);
  for (const format of ['avif', 'webp']) {
    for (const [i, file] of RECORD.files[format].entries()) {
      if (skip.includes(file)) continue;
      const [w, h] = sizes[file] ?? [640 * (i + 1), 400 * (i + 1)];
      await sharp({ create: { width: w, height: h, channels: 3, background: { r: 136, g: 136, b: 136 } } })[format]().toFile(join(root, 'public', file));
    }
  }
  const all = new Set(Object.values(RECORD.files).flat().map((f) => join('public', f)));
  const { checks } = await run({
    root,
    worksPath: join(root, 'data/works.json'),
    mdxDir: join(root, 'mdx'),
    htmlDir: join(root, 'html'),
    publicDir: join(root, 'public'),
    tracked: tracked === undefined ? all : tracked,
  });
  rmSync(root, { recursive: true, force: true });
  const failing = checks.filter((c) => c.failures.length).map((c) => c.id);
  return { checks, failing, text: checks.flatMap((c) => c.failures).join('\n') };
}

describe('lint:works', () => {
  it('passes a clean tree on all five checks', async () => {
    const { checks, failing } = await tree();
    expect(checks.map((c) => c.id)).toEqual([1, 2, 3, 4, 5]);
    expect(failing).toEqual([]);
  });

  it('check 1: a study with no moment', async () => {
    const r = await tree({ page: '<main></main>' });
    expect(r.failing).toContain(1);
    expect(r.text).toContain('renders 0 friction moments');
  });

  it('check 1: a study rendering a src no record owns', async () => {
    const r = await tree({ page: PAGE('/fine-art/other.webp') });
    expect(r.failing).toContain(1);
    expect(r.text).toContain('belongs to no record');
  });

  it('check 1: a rendered alt that drifted from the record', async () => {
    const r = await tree({ page: PAGE(undefined, 'Something else.') });
    expect(r.text).toContain('rendered alt does not match');
  });

  it('check 1 and 2: a record pointed at the wrong study', async () => {
    const r = await tree({ record: { ...RECORD, study: 'elsewhere' } });
    expect(r.failing).toEqual(expect.arrayContaining([1]));
    expect(r.text).toContain('whose record says study "elsewhere"');
  });

  it('check 2: a record nobody renders', async () => {
    const r = await tree({ page: null });
    expect(r.failing).toEqual(expect.arrayContaining([1, 2]));
  });

  it('check 3: an empty alt and an empty licence', async () => {
    const r = await tree({ record: { ...RECORD, alt: ' ', licence: '' }, page: PAGE(undefined, ' ') });
    expect(r.failing).toContain(3);
    expect(r.text).toContain('alt is empty');
    expect(r.text).toContain('licence is empty');
  });

  it('check 4: a missing delivery file', async () => {
    const r = await tree({ skip: ['/fine-art/test-work-1280.avif'] });
    expect(r.failing).toEqual([4]);
    expect(r.text).toContain('test-work-1280.avif does not exist');
  });

  it('check 4: a delivery file at the wrong size', async () => {
    const r = await tree({ sizes: { '/fine-art/test-work-640.webp': [600, 400] } });
    expect(r.failing).toEqual([4]);
    expect(r.text).toContain('is 600x400, the record says 640x400');
  });

  it('check 4: a file on disk but not in the index', async () => {
    const r = await tree({ tracked: new Set() });
    expect(r.failing).toEqual([4]);
    expect(r.text).toContain('not in the git index');
  });

  it('check 5: a box over the cap, and one off the master aspect', async () => {
    const r = await tree({ record: { ...RECORD, display: { width: 700, height: 400 } }, sizes: {
      '/fine-art/test-work-640.avif': [700, 400], '/fine-art/test-work-1280.avif': [1400, 800],
      '/fine-art/test-work-640.webp': [700, 400], '/fine-art/test-work-1280.webp': [1400, 800],
    } });
    expect(r.failing).toEqual([5]);
    expect(r.text).toContain('exceeds the 640 box');
    expect(r.text).toContain("not the master's aspect");
  });
});
