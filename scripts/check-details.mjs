import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'fs';

const BASE = 'https://uxpaul-portfolio.vercel.app';
const PAGES = ['/', '/about', '/case-studies/uscg-bard', '/case-studies/us-navy-fdt-e'];
const VIEWPORTS = [390, 768, 834, 1024, 1440, 2560];
const MODES = ['light', 'dark'];

const browser = await chromium.launch({ headless: true });
const detailResults = [];

for (const pagePath of PAGES) {
  for (const width of VIEWPORTS) {
    for (const mode of MODES) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        deviceScaleFactor: 2,
        colorScheme: mode,
      });

      const page = await context.newPage();
      await page.goto(BASE + pagePath, { waitUntil: 'networkidle' });

      await page.evaluate((targetMode) => {
        if (targetMode === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }, mode);

      await page.waitForTimeout(300);

      // On /about, test opening a drawer to check role alignment & grid
      if (pagePath === '/about') {
        await page.evaluate(async () => {
          const summary = document.querySelector('.about-row__summary');
          if (summary) {
            (summary).click();
          }
        });
        await page.waitForTimeout(300);
      }

      const pageAnalysis = await page.evaluate(({ pagePath, width, mode }) => {
        const issues = [];

        // Helper: get rgba and compute luminance/contrast
        function getRGB(colorStr) {
          const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
          if (!match) return null;
          return { r: parseInt(match[1]), g: parseInt(match[2]), b: parseInt(match[3]), a: match[4] !== undefined ? parseFloat(match[4]) : 1 };
        }

        function luminance(r, g, b) {
          const a = [r, g, b].map(v => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
          });
          return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
        }

        function contrastRatio(rgb1, rgb2) {
          const l1 = luminance(rgb1.r, rgb1.g, rgb1.b);
          const l2 = luminance(rgb2.r, rgb2.g, rgb2.b);
          return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        }

        // Check text elements for contrast against their parent background
        const textNodes = Array.from(document.querySelectorAll('p, h1, h2, h3, span, a, li, button, figcaption'));
        const contrastIssues = [];

        for (const el of textNodes) {
          const style = window.getComputedStyle(el);
          if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') continue;
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) continue;

          let parent = el.parentElement;
          let bgStyle = window.getComputedStyle(parent);
          let bgRgb = getRGB(bgStyle.backgroundColor);
          
          while (parent && (!bgRgb || bgRgb.a < 0.9)) {
            parent = parent.parentElement;
            if (parent) {
              bgStyle = window.getComputedStyle(parent);
              bgRgb = getRGB(bgStyle.backgroundColor);
            }
          }

          const fgRgb = getRGB(style.color);
          if (fgRgb && bgRgb) {
            const ratio = contrastRatio(fgRgb, bgRgb);
            const fontSize = parseFloat(style.fontSize);
            const isBold = parseInt(style.fontWeight) >= 600;
            const isLarge = fontSize >= 24 || (fontSize >= 18.66 && isBold);
            const minRequired = isLarge ? 3.0 : 4.5;

            if (ratio < minRequired) {
              const txt = (el.innerText || el.textContent || '').trim().slice(0, 40);
              contrastIssues.push({
                text: txt,
                tagName: el.tagName,
                className: el.className,
                fg: style.color,
                bg: bgStyle.backgroundColor,
                ratio: Math.round(ratio * 100) / 100,
                minRequired,
                fontSize,
                fontWeight: style.fontWeight
              });
            }
          }
        }

        // Check for single word orphans on last line of headings
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, .text-h1, .text-h2, .text-h3, .text-lede'));
        const orphanHeadings = [];
        for (const h of headings) {
          const text = (h.innerText || h.textContent || '').trim();
          const words = text.split(/\s+/);
          if (words.length > 2) {
            // Check line boxes if possible by inspecting range or line height
            const range = document.createRange();
            range.selectNodeContents(h);
            const rects = Array.from(range.getClientRects());
            if (rects.length > 1) {
              // Heading wraps onto multiple lines. Check if last line width is very narrow compared to last word
              const lastRect = rects[rects.length - 1];
              const lastWord = words[words.length - 1];
              if (lastRect.width < 120 && words.length > 3) {
                orphanHeadings.push({
                  text,
                  lastWord,
                  lastLineWidth: Math.round(lastRect.width),
                  lineCount: rects.length
                });
              }
            }
          }
        }

        // Specific checks for /about drawer rows alignment
        let drawerInfo = null;
        if (pagePath === '/about') {
          const rows = Array.from(document.querySelectorAll('.about-row'));
          drawerInfo = rows.map(r => {
            const summary = r.querySelector('.about-row__summary');
            const summaryRect = summary ? summary.getBoundingClientRect() : null;
            const company = r.querySelector('.about-row__company');
            const role = r.querySelector('.about-row__role');
            const year = r.querySelector('.about-row__year');

            return {
              summaryBox: summaryRect ? { w: Math.round(summaryRect.width), h: Math.round(summaryRect.height) } : null,
              companyText: (company?.innerText || company?.textContent || '').trim(),
              companyBox: company ? company.getBoundingClientRect() : null,
              roleText: (role?.innerText || role?.textContent || '').trim(),
              roleBox: role ? role.getBoundingClientRect() : null,
              yearText: (year?.innerText || year?.textContent || '').trim(),
              yearBox: year ? year.getBoundingClientRect() : null,
            };
          });
        }

        return {
          contrastIssues: contrastIssues.slice(0, 10), // cap to top 10 unique
          orphanHeadings,
          drawerInfo,
        };
      }, { pagePath, width, mode });

      detailResults.push({ pagePath, width, mode, pageAnalysis });
      await context.close();
    }
  }
}

await browser.close();
writeFileSync(
  '/Users/paulkali/.gemini/antigravity-cli/brain/01392927-7515-4403-b44f-8793e843d322/scratch/detail_results.json',
  JSON.stringify(detailResults, null, 2)
);
console.log('Detailed analysis complete.');
