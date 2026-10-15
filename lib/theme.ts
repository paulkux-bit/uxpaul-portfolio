/**
 * One source for the theme settings that two places need: the ThemeProvider
 * in app/layout.tsx, and the script below, which runs at the top of <head>.
 *
 * next-themes renders its own copy of this script as the first child of
 * <body>, after the stylesheet. A paint that lands before it would show the
 * wrong mode, and the 450ms background transition on body would stretch that
 * into a visible fade. The colour review (15 Oct 2026) saw no such paint in 80
 * throttled loads, so this is insurance, not a fix: the class is now set before
 * the body is parsed. next-themes' own script still runs and sets the same
 * class, and it owns every change after first paint.
 */
export const THEME_STORAGE_KEY = 'theme';
export const THEME_ATTRIBUTE = 'class';
export const THEME_DEFAULT = 'system';
export const THEMES = ['light', 'dark'] as const;

/** Mirrors next-themes 0.4.6 for attribute="class", enableSystem, enableColorScheme. */
export const themeInitScript = `(function(){try{var d=document.documentElement,t=localStorage.getItem('${THEME_STORAGE_KEY}')||'${THEME_DEFAULT}',r=t==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):t;d.classList.remove('${THEMES[0]}','${THEMES[1]}');d.classList.add(r);if(r==='${THEMES[0]}'||r==='${THEMES[1]}')d.style.colorScheme=r}catch(e){}})();`;
