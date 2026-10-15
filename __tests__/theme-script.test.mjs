import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { themeInitScript, THEME_STORAGE_KEY } from '../lib/theme';

// The head script and the ThemeProvider must agree, or the first paint and the
// hydrated page pick different modes. The layout passes the same constants to
// both; these tests run the script itself in jsdom.
const run = (stored, systemDark) => {
  const html = document.documentElement;
  html.className = '';
  html.style.colorScheme = '';
  localStorage.clear();
  if (stored) localStorage.setItem(THEME_STORAGE_KEY, stored);
  window.matchMedia = () => ({ matches: systemDark, addListener() {}, removeListener() {} });
  new Function(themeInitScript)();
  return { cls: html.className, scheme: html.style.colorScheme };
};

describe('head theme script', () => {
  beforeEach(() => localStorage.clear());
  it('follows the system when nothing is stored', () => {
    expect(run(null, true)).toEqual({ cls: 'dark', scheme: 'dark' });
    expect(run(null, false)).toEqual({ cls: 'light', scheme: 'light' });
  });
  it('a stored choice beats the system', () => {
    expect(run('light', true)).toEqual({ cls: 'light', scheme: 'light' });
    expect(run('dark', false)).toEqual({ cls: 'dark', scheme: 'dark' });
  });
  it('"system" stored behaves as nothing stored', () => {
    expect(run('system', true).cls).toBe('dark');
  });
  it('the layout passes the same settings to the head script and the ThemeProvider', () => {
    const layout = readFileSync('app/layout.tsx', 'utf8');
    expect(layout).toMatch(/<head>[\s\S]*themeInitScript[\s\S]*<\/head>/);
    for (const k of ['THEME_ATTRIBUTE', 'THEME_DEFAULT', 'THEME_STORAGE_KEY'])
      expect(layout).toContain(`={${k}}`);
  });
});
