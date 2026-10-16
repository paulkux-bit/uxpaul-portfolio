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

/** Mirrors next-themes 0.4.6 for attribute="class", enableSystem, enableColorScheme.
 *  One difference: the storage read has its own try, so a browser that throws on
 *  localStorage (Safari with site data blocked) still gets the system mode at first
 *  paint, rather than no class and then a 450ms fade once the provider hydrates. */
export const themeInitScript = `(function(){var t;try{t=localStorage.getItem('${THEME_STORAGE_KEY}')}catch(e){}try{var d=document.documentElement;t=t||'${THEME_DEFAULT}';var r=t==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):t;d.classList.remove('${THEMES[0]}','${THEMES[1]}');d.classList.add(r);if(r==='${THEMES[0]}'||r==='${THEMES[1]}')d.style.colorScheme=r}catch(e){}})();`;
