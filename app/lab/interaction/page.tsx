/**
 * /lab/interaction: a specimen sheet for the shipped interaction system. Not
 * linked from the nav, not in the sitemap; the site is noindex globally.
 *
 * lab.css is deliberately NOT imported as a module: Turbopack merges every
 * imported stylesheet into the one CSS chunk shared by all routes, and
 * Tailwind emits any new utility into that same shared sheet, which would add
 * this page's bytes to every shipped route. This server page reads the file
 * at build time (the route is static) and renders it as a style element
 * scoped to this route's payload. The .css stays a real file on disk so the
 * linters scan it like any other stylesheet.
 */

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { InteractionLab } from './interaction-lab';

export default async function InteractionLabPage() {
  const css = await readFile(join(process.cwd(), 'app/lab/interaction/lab.css'), 'utf8');

  return (
    <>
      <style>{css}</style>
      <InteractionLab />
    </>
  );
}
