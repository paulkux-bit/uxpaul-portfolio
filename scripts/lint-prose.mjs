// Usage: node scripts/lint-prose.mjs   (run after `next build`)
// Prose gate for shipped copy. Scans RENDERED output (.next HTML) so JSX/MDX code
// comments and metadata never reach it: only visible page prose is checked.
//
// Two severities, kept separate:
//   HARD FAIL (exit 1): em-dash U+2014 in visible text. En-dash U+2013 and hyphen are fine.
//   WARN only (exit 0): banned words from the project docs.
//
// This is the "prose" leg of the verification chain. The Impeccable "detector" is a
// separate, external, VISUAL scanner and does not read prose. See CLAUDE.md.
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

// ── Project-doc banned words ONLY. Extend here. Do not add invented rules. ──
const BANNED_WORDS = ['craft', 'seamless'];

const HTML_ROOT = '.next/server/app';
const EM_DASH = '—'; // the banned character
const CONTEXT = 40; // chars of context to show around a hit

// Recursively collect every prerendered .html under the app output.
async function collectHtml(dir) {
  let out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out = out.concat(await collectHtml(p));
    else if (e.isFile() && e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

// Decode the handful of entities Next emits, plus dash entities, so an em-dash is
// caught whether it shipped literal or encoded.
function decodeEntities(s) {
  return s
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&'); // last: avoid double-decoding
}

// Reduce a page to its visible text.
function visibleText(html) {
  return decodeEntities(
    html
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
      .replace(/<template\b[\s\S]*?<\/template>/gi, ' ')
      .replace(/<[^>]+>/g, ' '),
  ).replace(/\s+/g, ' ');
}

const snippet = (text, idx, len) =>
  `…${text.slice(Math.max(0, idx - CONTEXT), idx + len + CONTEXT).trim()}…`;

const files = await collectHtml(HTML_ROOT);
if (files.length === 0) {
  console.error(`prose-lint: no rendered HTML under ${HTML_ROOT}. Run \`next build\` first.`);
  process.exit(1);
}

const bannedRe = new RegExp(`\\b(${BANNED_WORDS.join('|')})\\w*`, 'gi');
const hard = []; // em-dash hits (fail)
const warn = []; // banned-word hits (warn)

for (const file of files) {
  const page = file.slice(HTML_ROOT.length + 1);
  const text = visibleText(await readFile(file, 'utf8'));

  for (let i = text.indexOf(EM_DASH); i !== -1; i = text.indexOf(EM_DASH, i + 1)) {
    hard.push({ page, snippet: snippet(text, i, 1) });
  }
  for (const m of text.matchAll(bannedRe)) {
    warn.push({ page, token: m[0], snippet: snippet(text, m.index, m[0].length) });
  }
}

console.log(`prose-lint: scanned ${files.length} page(s) under ${HTML_ROOT}\n`);

console.log(`HARD (em-dash U+2014):`);
if (hard.length === 0) console.log('  ✓ none');
else for (const h of hard) console.log(`  ✗ ${h.page}: ${h.snippet}`);

console.log(`\nWARN (banned words: ${BANNED_WORDS.join(', ')}):`);
if (warn.length === 0) console.log('  ✓ none');
else for (const w of warn) console.log(`  ⚠ ${w.page}: "${w.token}" -> ${w.snippet}`);

console.log(`\nResult: ${hard.length === 0 ? 'PASS' : 'FAIL'} (${hard.length} em-dash, ${warn.length} banned-word warning${warn.length === 1 ? '' : 's'})`);
process.exit(hard.length === 0 ? 0 : 1);
