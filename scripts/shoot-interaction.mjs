// Pixel-identity harness for the interaction migration.
//   node scripts/shoot-interaction.mjs <outdir> [--reduced]
//
// Committed rather than improvised so a future reader can rerun a proof instead
// of reconstructing one, the same principle as the lint fixtures.
//
// It exists because the extension-screenshot route was not trustworthy. Its null
// test — two captures with no change between — found two independent sources of
// nondeterminism: the mix-blend-mode cover art settling into one of two stable
// compositor states (14,196 px, all inside the art, zero outside), and the
// sticky header still settling after a programmatic scroll (89,947 px, max
// delta 245). At that second noise level a real regression is indistinguishable
// from the harness.
//
// Playwright removes every one of those variables:
//   page.hover()              a real :hover without moving an OS cursor
//   animations: 'disabled'    freezes the settle instead of waiting it out
//   type: 'png'               lossless, so no encoder variance
//   clip                      the element box only, so the sticky header is
//                             outside the frame entirely
//   reducedMotion             the media emulation the extension cannot reach
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const OUT = process.argv[2];
const REDUCED = process.argv.includes('--reduced');
if (!OUT) { console.error('usage: shoot-interaction.mjs <outdir> [--reduced]'); process.exit(2); }
const BASE = process.env.BASE_URL ?? 'http://localhost:3000';

const PUB = 'article:has(a[href^="/case-studies"])';
const UNPUB = 'article:not(:has(a[href^="/case-studies"]))';
const MAIL = 'a[href^="mailto:"]';

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const notes = [];

for (const scheme of ['light', 'dark']) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    colorScheme: scheme,
    reducedMotion: REDUCED ? 'reduce' : 'no-preference',
  });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  const tag = `${scheme}${REDUCED ? '-reduced' : ''}`;
  const shot = async (name, opts = {}) => {
    const buf = await page.screenshot({ animations: 'disabled', caret: 'hide', type: 'png', ...opts });
    await writeFile(join(OUT, `${tag}-${name}.png`), buf);
  };
  const el = (sel, n = 0) => page.locator(sel).nth(n);

  // full page at rest — commit 3's proof surface
  await shot('page-rest', { fullPage: false });

  // published card: rest, hovered, focus-within
  await el(PUB).scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await shot('pub-rest', { clip: await el(PUB).boundingBox() });
  await el(PUB).hover();
  await page.waitForTimeout(600);
  await shot('pub-hover', { clip: await el(PUB).boundingBox() });
  await page.mouse.move(0, 0);
  await page.waitForTimeout(600);
  await el(PUB).locator('a[href^="/case-studies"]').focus();
  await page.waitForTimeout(600);
  await shot('pub-focus', { clip: await el(PUB).boundingBox() });
  await page.locator('body').evaluate((b) => b.ownerDocument.activeElement?.blur());

  // unpublished card: rest and hovered. The modifier must NOT lift it, and
  // before the media tier was deleted its media well scaled on hover while the
  // card did not — the scoping trap this pair exists to catch.
  await el(UNPUB).first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await shot('unpub-rest', { clip: await el(UNPUB).boundingBox() });
  await el(UNPUB).hover();
  await page.waitForTimeout(600);
  await shot('unpub-hover', { clip: await el(UNPUB).boundingBox() });
  await page.mouse.move(0, 0);

  // the quiet mailto link
  await el(MAIL).scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await shot('mail-rest', { clip: await el(MAIL).boundingBox() });
  await el(MAIL).hover();
  await page.waitForTimeout(600);
  await shot('mail-hover', { clip: await el(MAIL).boundingBox() });

  notes.push(`${tag}: html.dark=${await page.evaluate(() => document.documentElement.classList.contains('dark'))}`);
  await ctx.close();
}

await browser.close();
console.log(notes.join('\n'));
console.log(`wrote ${OUT}`);
