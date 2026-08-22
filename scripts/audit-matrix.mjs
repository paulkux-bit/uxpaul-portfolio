import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const BASE = 'https://uxpaul-portfolio.vercel.app';
const OUT_DIR = '/Users/paulkali/.gemini/antigravity-cli/brain/01392927-7515-4403-b44f-8793e843d322/scratch/shots';

const PAGES = [
  '/',
  '/about',
  '/case-studies/uscg-bard',
  '/case-studies/us-navy-fdt-e',
];

const VIEWPORTS = [390, 768, 834, 1024, 1440, 2560];
const MODES = ['light', 'dark'];

await mkdir(OUT_DIR, { recursive: true });
const browser = await chromium.launch({ headless: true });

const findings = [];
const matrixReached = [];

for (const pagePath of PAGES) {
  for (const width of VIEWPORTS) {
    for (const mode of MODES) {
      const cellId = `${pagePath} | ${width}px | ${mode}`;
      console.log(`Checking ${cellId}...`);
      
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        deviceScaleFactor: 2,
        colorScheme: mode,
        isMobile: width < 768,
        hasTouch: width < 768,
      });

      const page = await context.newPage();

      // Test cold cache / first paint for hero images on /about and case studies
      let firstPaintHeroState = null;
      if (pagePath === '/about' || pagePath.startsWith('/case-studies/')) {
        // Intercept image requests to simulate cold cache & initial paint
        await page.route('**/*.{png,jpg,jpeg,webp,avif,svg}', async (route) => {
          await new Promise(r => setTimeout(r, 600));
          await route.continue();
        });

        const initialPromise = page.goto(BASE + pagePath, { waitUntil: 'domcontentloaded' });
        await initialPromise;

        // Inspect DOM right at DOMContentLoaded before images finish downloading
        firstPaintHeroState = await page.evaluate(() => {
          const imgs = Array.from(document.querySelectorAll('img'));
          const heroImg = imgs.find(img => img.src.includes('hero') || img.closest('.hero-block, .about-hero, header + section, figure')) || imgs[0];
          const heroContainer = heroImg?.parentElement || document.querySelector('.hero-block, .about-hero, header + section, figure');
          
          if (!heroImg && !heroContainer) return null;

          const imgBox = heroImg ? heroImg.getBoundingClientRect() : null;
          const containerBox = heroContainer ? heroContainer.getBoundingClientRect() : null;
          
          const containerStyle = heroContainer ? window.getComputedStyle(heroContainer) : null;
          const imgStyle = heroImg ? window.getComputedStyle(heroImg) : null;

          return {
            hasImg: !!heroImg,
            imgSrc: heroImg?.src,
            imgComplete: heroImg ? heroImg.complete : false,
            imgNaturalWidth: heroImg ? heroImg.naturalWidth : 0,
            imgBox: imgBox ? { width: Math.round(imgBox.width), height: Math.round(imgBox.height), top: Math.round(imgBox.top) } : null,
            containerBox: containerBox ? { width: Math.round(containerBox.width), height: Math.round(containerBox.height) } : null,
            containerBorder: containerStyle ? containerStyle.border : null,
            containerBoxShadow: containerStyle ? containerStyle.boxShadow : null,
            containerBg: containerStyle ? containerStyle.backgroundColor : null,
            imgBorder: imgStyle ? imgStyle.border : null,
            imgBoxShadow: imgStyle ? imgStyle.boxShadow : null,
            imgBg: imgStyle ? imgStyle.backgroundColor : null,
          };
        });

        await page.unroute('**/*.{png,jpg,jpeg,webp,avif,svg}');
      } else {
        await page.goto(BASE + pagePath, { waitUntil: 'networkidle' });
      }

      await page.waitForLoadState('networkidle');

      // Ensure next-themes class matches requested mode
      await page.evaluate((targetMode) => {
        if (targetMode === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }, mode);

      await page.waitForTimeout(300);

      const safeSlug = pagePath.replace(/\//g, '_') || '_home';
      const screenshotName = `${safeSlug}-${width}-${mode}.png`;
      await page.screenshot({
        path: join(OUT_DIR, screenshotName),
        fullPage: true,
      });

      matrixReached.push({ page: pagePath, width, mode });

      const auditResult = await page.evaluate(({ pagePath, width, mode }) => {
        const errors = [];

        // 1. Horizontal overflow
        const scrollWidth = document.documentElement.scrollWidth;
        const innerWidth = window.innerWidth;
        if (scrollWidth > innerWidth + 1) {
          errors.push({
            type: 'HORIZONTAL_OVERFLOW',
            details: `scrollWidth (${scrollWidth}px) exceeds innerWidth (${innerWidth}px) by ${scrollWidth - innerWidth}px`
          });
        }

        // 2. Touch target size
        const interactiveElements = Array.from(document.querySelectorAll('a, button, input, select, textarea, [role="button"], [tabindex]'));
        const smallTouchTargets = [];
        for (const el of interactiveElements) {
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) continue;
          const style = window.getComputedStyle(el);
          if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') continue;

          if (rect.width < 44 || rect.height < 44) {
            const label = (el.getAttribute('aria-label') || el.innerText || el.className || el.tagName).trim().slice(0, 50);
            smallTouchTargets.push({
              tag: el.tagName.toLowerCase(),
              className: el.className,
              label,
              href: el.getAttribute('href'),
              width: Math.round(rect.width),
              height: Math.round(rect.height),
              box: { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height) }
            });
          }
        }

        // 3. "Also Shipped" module layout check on Home Page
        let alsoShippedInfo = null;
        if (pagePath === '/') {
          const section = document.querySelector('section:has(.quick-hit), .quick-hit, [class*="quick-hit"]')?.closest('section') || document.body;
          const rows = Array.from(section.querySelectorAll('.quick-hit, [class*="quick-hit"]'));
          alsoShippedInfo = rows.map(r => {
            const rect = r.getBoundingClientRect();
            const children = Array.from(r.children).map(c => {
              const cRect = c.getBoundingClientRect();
              const cs = window.getComputedStyle(c);
              return {
                tag: c.tagName,
                className: c.className,
                text: c.innerText.trim(),
                box: { x: Math.round(cRect.x), y: Math.round(cRect.y), w: Math.round(cRect.width), h: Math.round(cRect.height) },
                textAlign: cs.textAlign,
                gridColumn: cs.gridColumn,
                flex: cs.flex,
              };
            });
            const rStyle = window.getComputedStyle(r);
            return {
              rowClass: r.className,
              display: rStyle.display,
              gridTemplateColumns: rStyle.gridTemplateColumns,
              flexDirection: rStyle.flexDirection,
              rowBox: { w: Math.round(rect.width), h: Math.round(rect.height) },
              children
            };
          });
        }

        // 4. Case Study and About header/nav/footer layout metrics
        const header = document.querySelector('header');
        const headerBox = header ? header.getBoundingClientRect() : null;

        return {
          errors,
          smallTouchTargets,
          alsoShippedInfo,
          headerBox: headerBox ? { w: Math.round(headerBox.width), h: Math.round(headerBox.height) } : null,
        };
      }, { pagePath, width, mode });

      findings.push({
        pagePath,
        width,
        mode,
        firstPaintHeroState,
        auditResult
      });

      await context.close();
    }
  }
}

await browser.close();

await writeFile(
  '/Users/paulkali/.gemini/antigravity-cli/brain/01392927-7515-4403-b44f-8793e843d322/scratch/audit_results.json',
  JSON.stringify({ matrixReached, findings }, null, 2)
);

console.log(`Audit complete. Matrix reached: ${matrixReached.length} cells. Saved results.`);
