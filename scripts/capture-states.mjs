// Records silent video of the shipped interaction states on /lab/interaction.
//   node scripts/capture-states.mjs
//
// Expects a server already running (BASE_URL, default http://localhost:3000),
// same as shoot-interaction.mjs. Four recordings: 1440 and 390, light and
// dark. Each shows, in order: the pointer entering a card, holding one
// second, pressing and releasing, then keyboard tabs onto the same card to
// show the focus halo. Output goes to artifacts/, which is gitignored;
// nothing here ships to the site or enters the bundle.
//
// The card driven is the REST specimen in the column that matches the
// emulated color scheme, because under a dark document the light column
// re-applies light tokens to itself, so its card would show light states in
// a dark recording.
//
// A recording made under prefers-reduced-motion is worthless, so the capture
// asserts the media query is NOT active in each context and fails loudly if
// it is. No reducedMotion emulation is passed anywhere.

import { chromium } from 'playwright';
import { mkdir, rename, stat } from 'node:fs/promises';
import { join } from 'node:path';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const OUT = 'artifacts';
const PAGE = '/lab/interaction';

const RUNS = [
  { width: 1440, height: 900, mode: 'light' },
  { width: 1440, height: 900, mode: 'dark' },
  { width: 390, height: 844, mode: 'light' },
  { width: 390, height: 844, mode: 'dark' },
];

// First .case-card--linked inside the matching theme column is the rest cell:
// the state grid renders rest first.
const CARD = {
  light: 'div.lab-panel:not(.dark) .case-card--linked',
  dark: 'div.dark.lab-panel .case-card--linked',
};
const LINK = '.case-card__title-link';

const pause = (ms) => new Promise((r) => setTimeout(r, ms));

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const results = [];

for (const run of RUNS) {
  const name = `states-${run.width}-${run.mode}.webm`;
  const context = await browser.newContext({
    viewport: { width: run.width, height: run.height },
    colorScheme: run.mode,
    recordVideo: { dir: OUT, size: { width: run.width, height: run.height } },
  });
  const page = await context.newPage();
  await page.goto(BASE + PAGE, { waitUntil: 'networkidle' });

  const reduced = await page.evaluate(
    () => matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  if (reduced) {
    console.error(
      `FAIL: prefers-reduced-motion is active in the ${run.width}/${run.mode} context. ` +
        'A recording made under reduced motion is worthless. Aborting.',
    );
    process.exit(1);
  }

  const card = page.locator(CARD[run.mode]).first();
  if ((await card.count()) === 0) {
    console.error(`FAIL: no ${CARD[run.mode]} found on ${PAGE} — nothing to record.`);
    process.exit(1);
  }
  await card.scrollIntoViewIfNeeded();
  await page.evaluate(() => document.fonts.ready);
  await pause(1000); // settle frames before the action, for smooth playback

  // Pointer enters the card, holds one second, presses, releases. The whole
  // card is one stretched link, so the pointer moves OFF the card between
  // press and release; releasing over the link would click it and navigate
  // the recording away to the case study.
  await card.hover();
  await pause(1000);
  await page.mouse.down();
  await pause(700);
  await page.mouse.move(5, 5);
  await page.mouse.up();
  await pause(600);

  // Keyboard tab onto the same card's link to show the focus halo.
  const linkHandle = await card.locator(LINK).first().elementHandle();
  let focused = false;
  for (let i = 0; i < 60 && !focused; i += 1) {
    await page.keyboard.press('Tab');
    focused = await page.evaluate((el) => document.activeElement === el, linkHandle);
  }
  if (!focused) {
    console.error(`FAIL: 60 tabs never landed on ${LINK} in the ${run.mode} column.`);
    process.exit(1);
  }
  await pause(1200); // hold the halo on screen
  const video = page.video();
  await context.close(); // finalizes the recording
  const recorded = await video.path();
  const dest = join(OUT, name);
  await rename(recorded, dest);
  results.push(dest);
}

await browser.close();

console.log('Recordings:');
for (const f of results) {
  const { size } = await stat(f);
  console.log(`  ${f}  ${(size / 1024).toFixed(0)} kB`);
}
