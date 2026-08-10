// Usage: node scripts/measure-hit-areas.mjs        (defaults to localhost:3000)
//        BASE_URL=https://uxpaul-portfolio.vercel.app node scripts/measure-hit-areas.mjs
//
// Verifies TOUCH TARGETS, and it exists because nothing else in this repo can.
//
// A HIT REGION IS NOT AN ELEMENT BOX. Several surfaces here expand their target
// with an absolutely-positioned ::after and deliberately leave the anchor's own
// box alone — that is what keeps `text-decoration` tight to the word and keeps
// the layout rhythm unchanged. `getBoundingClientRect()` returns the ANCHOR, so
// it reports 39.3 x 44 for a nav link whose real target is 55.3 x 44, and a
// harness built on it will report a failure against passing code. One did, which
// is why this replaced it.
//
// Two measures, because neither is sufficient alone:
//
//   SIZE      getComputedStyle(el, '::after') — what the region is.
//   FUNCTION  document.elementFromPoint()     — whether a tap there lands on
//             the anchor. This also proves nothing clips or overlays the
//             region, which a computed size cannot.
//
// The probes are the real test. A ::after clipped by an ancestor's
// `overflow: hidden`, or covered by a later sibling, has exactly the right
// computed size and does not work.
//
// EXTENDING IT: add to TARGETS. Each entry is a route, a selector matching two
// or more sibling targets, and the label used in output. The pair probes assume
// at least two matches so the dead zone between adjacent targets can be
// measured; a single-target surface still gets its size and corner probes.
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const FLOOR = 44; // WCAG 2.5.5 Target Size (Enhanced); this project's stated floor

const TARGETS = [
  { name: 'nav', route: '/', sel: '.nav-link' },
  { name: 'footer', route: '/', sel: '.footer-link', scrollTo: 'footer' },
];

// Surfaces deliberately NOT on the list, so their absence is a decision rather
// than an oversight. WCAG 2.5.8 exempts a target inside a sentence or block of
// text, and padding an inline anchor would break the line box it sits in.
const EXEMPT = [{ sel: '.quiet-link', reason: 'inline in a sentence — SC 2.5.8 exemption' }];

const VIEWPORTS = [390, 1440];
const SCHEMES = ['light', 'dark'];

let failures = 0;
const fail = (m) => { failures++; console.log(`  ✗ ${m}`); };
const ok = (m) => console.log(`  ✓ ${m}`);

const browser = await chromium.launch();

for (const width of VIEWPORTS) {
  for (const colorScheme of SCHEMES) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, colorScheme });
    const page = await ctx.newPage();
    console.log(`\n══ ${width}px ${colorScheme} ══`);

    for (const t of TARGETS) {
      await page.goto(BASE + t.route, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      if (t.scrollTo) await page.locator(t.scrollTo).first().scrollIntoViewIfNeeded();
      await page.waitForTimeout(700);

      const r = await page.evaluate(({ sel, floor }) => {
        const owns = (node, anchor) => { let n = node; while (n) { if (n === anchor) return true; n = n.parentElement; } return false; };
        const hits = (anchor, x, y) => owns(document.elementFromPoint(x, y), anchor);

        const read = (i) => {
          const el = document.querySelectorAll(sel)[i];
          if (!el) return null;
          const b = el.getBoundingClientRect();
          const cs = getComputedStyle(el, '::after');
          const w = parseFloat(cs.width) || b.width;
          const h = parseFloat(cs.height) || b.height;
          // the region, derived from the anchor box plus the pseudo's own offset
          const left = b.left + (parseFloat(cs.left) || 0);
          const top = b.top + (b.height - h) / 2;
          const reg = { l: left, t: top, r: left + w, b: top + h };
          return {
            label: el.textContent.trim(),
            box: { w: +b.width.toFixed(1), h: +b.height.toFixed(1) },
            region: { w: +w.toFixed(1), h: +h.toFixed(1) },
            meets: w >= floor && h >= floor,
            corners: [[reg.l + 1, reg.t + 1], [reg.r - 1, reg.t + 1], [reg.l + 1, reg.b - 1], [reg.r - 1, reg.b - 1]].map(([x, y]) => hits(el, x, y)),
            outside: [hits(el, reg.l - 3, (reg.t + reg.b) / 2), hits(el, reg.r + 3, (reg.t + reg.b) / 2)],
            reg,
          };
        };

        const all = [...document.querySelectorAll(sel)].map((_, i) => read(i)).filter(Boolean);
        let pair = null;
        if (all.length >= 2) {
          const [a, b] = all;
          const gap = b.reg.l - a.reg.r;
          const midX = (a.reg.r + b.reg.l) / 2;
          const midY = (a.reg.t + a.reg.b) / 2;
          const els = document.querySelectorAll(sel);
          let midHits = false;
          let p = document.elementFromPoint(midX, midY);
          while (p) { if (p === els[0] || p === els[1]) { midHits = true; break; } p = p.parentElement; }
          pair = { gap: +gap.toFixed(1), midHits };
        }
        return { all: all.map((x) => ({ label: x.label, box: x.box, region: x.region, meets: x.meets, corners: x.corners, outside: x.outside })), pair };
      }, { sel: t.sel, floor: FLOOR });

      if (!r.all.length) { fail(`${t.name}: no element matched ${t.sel}`); continue; }

      for (const x of r.all) {
        const line = `${t.name} "${x.label}" visual ${x.box.w} x ${x.box.h}   HIT ${x.region.w} x ${x.region.h}`;
        if (x.meets) ok(line); else fail(`${line}  UNDER ${FLOOR}`);

        if (x.corners.every(Boolean)) ok('  all four corners of the hit region reach the anchor');
        else fail(`  corner probes failed ${JSON.stringify(x.corners)} — clipped or overlaid`);

        if (x.outside.some(Boolean)) fail('  a point outside the region still hits it');
        else ok('  3px outside both inline edges: no hit');
      }
      if (r.pair) {
        if (r.pair.gap < 0) fail(`${t.name} adjacent regions OVERLAP by ${-r.pair.gap}px`);
        else ok(`${t.name} dead zone between targets ${r.pair.gap}px, no overlap`);

        if (r.pair.midHits) fail(`${t.name} dead-zone midpoint hits a target`);
        else ok(`${t.name} dead-zone midpoint hits neither`);
      }
    }

    // Controls: these must NOT have grown. Reported every run so the exemption
    // stays visible rather than becoming a surface nobody remembers excluding.
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    for (const e of EXEMPT) {
      const box = await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const b = el.getBoundingClientRect();
        return { w: +b.width.toFixed(1), h: +b.height.toFixed(1) };
      }, e.sel);
      if (!box) { console.log(`  · ${e.sel} not present`); continue; }
      console.log(`  · ${e.sel} ${box.w} x ${box.h} — exempt, ${e.reason}`);
    }
    await ctx.close();
  }
}

await browser.close();
console.log(`\n${failures === 0 ? 'PASS' : 'FAIL'} — ${failures} failed`);
process.exit(failures === 0 ? 0 : 1);
