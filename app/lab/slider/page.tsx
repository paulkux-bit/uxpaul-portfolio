/**
 * /lab/slider: a before/after slider prototype. Not linked from the nav, not
 * wired into any case study; the images are stand-ins and the mechanism is
 * the deliverable.
 *
 * slider.css is deliberately NOT imported as a module: Turbopack merges every
 * imported stylesheet into the one CSS chunk shared by all routes, which
 * would add this prototype's bytes to every shipped page. Instead this server
 * page reads the file at build time (the route is static) and renders it as a
 * style element scoped to this route's payload. The .css stays a real file on
 * disk so the interaction, type, spacing and color linters scan it like any
 * other stylesheet.
 */

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { CompareSlider } from './compare-slider';

export default async function SliderLabPage() {
  const css = await readFile(join(process.cwd(), 'app/lab/slider/slider.css'), 'utf8');

  return (
    <div className="lab-page">
      <style>{css}</style>
      <h1 className="text-h1 text-primary">A before and after, on one divider.</h1>
      <p className="text-body text-secondary lab-mt-s lab-prose">
        Drag anywhere on the frame, or focus the handle and use the left and right
        arrow keys; Home and End jump to either edge. The content here is a stand-in
        (two unrelated Bard screens, labelled A and B); the mechanism is the
        deliverable. Whether the legacy screens can be published is an open question
        this page does not settle.
      </p>
      <div className="mt-8 lab-measure">
        <CompareSlider
          aSrc="/case-studies/uscg-bard/legacy-dashboard.png"
          aAlt="Stand-in screen A: the legacy dashboard"
          bSrc="/case-studies/uscg-bard/hero-dashboard-fl.png"
          bAlt="Stand-in screen B: the redesigned dashboard"
        />
      </div>
    </div>
  );
}
