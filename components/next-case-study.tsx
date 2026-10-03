import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { caseStudies } from '@/app/data/case-studies';
import { isPublished } from '@/app/data/case-study-routes';

/**
 * The link at the foot of every Template A study, after Role (Phase 3, ruled
 * 2 Oct 2026: 1c, 2a, Xb; copy 1a 2i 3a).
 *
 * WHERE IT GOES. The next study in home index order, read from the same
 * `caseStudies` array the home cards render, so reordering the cards reorders
 * these links and there is no second list. The last study has no next and
 * links to About instead (1c). A loop back to the first was rejected: most
 * readers come in from home at the first study, so a loop would send them to
 * the study they read first, and a ring never tells a reader the set is done.
 *
 * WHAT IT LOOKS LIKE. The About page's selected-work band, reused rather than
 * copied (2a): a text-h3 label, an arrow that nudges on hover, a 1px press, all
 * in globals.css under .about-work-band. It carries the --unruled modifier, as
 * About's own band now does: no hairlines, and the label underlined at rest
 * like any link. That modifier is one block in globals.css, built to be tuned
 * or removed after the post-build review; dropping the class brings the
 * hairline band back. The about- prefix is now a misnomer. Renaming it reaches
 * the interaction lint, its tests and the locked interaction spec, so it waits
 * for the Phase 12 cleanup.
 *
 * WHAT IT SAYS. For a study it shows what the home card shows: the client and
 * the question (B2, 3 Oct 2026: the visible project line went, on the cards
 * and here). No visible lead-in word (2i). "Next case study" and the project
 * name are screen-reader text (3a), placed so the visible text stays in
 * reading order inside the accessible name (SC 2.5.3). The About label is
 * Paul's copy (1a), to be revisited when About is rewritten in Phase 8.
 *
 * No margin of its own: the Role section's bottom margin is the section break
 * above it, and .case-study-page's bottom padding is the one below it.
 */
export function NextCaseStudy({ slug }: { slug: string }) {
  // Published studies only, so an unpublished card in the index is skipped
  // rather than linked to a route that does not exist.
  const order = caseStudies.filter((study) => isPublished(study.slug));
  const index = order.findIndex((study) => study.slug === slug);
  if (index === -1) return null;

  const next = order[index + 1];

  // The arrow sits INSIDE the label, after its last word (A2, 3 Oct 2026), so
  // it follows the question wherever the question wraps instead of standing at
  // the far edge of the column. It is written out in both links rather than
  // held in a variable: lint:interaction check 6 finds the --icon-stroke that
  // governs an icon by walking its JSX ancestors, and a hoisted element has
  // none. text-h3 stays on the icon so its size does not depend on where it
  // sits (interaction spec §2.3). The last word goes in a no-wrap tail with
  // the arrow, so the arrow never starts a line alone; the visible text and
  // the accessible name are unchanged by the split.

  if (!next) {
    return (
      <Link className="about-work-band about-work-band--unruled" href="/about">
        <span className="about-work-band__label text-h3">
          About{' '}
          <span className="about-work-band__tail">
            me
            <ArrowRight className="icon text-h3 about-work-band__arrow" aria-hidden="true" focusable="false" />
          </span>
        </span>
      </Link>
    );
  }

  const question = next.problemFraming;
  const cut = question.lastIndexOf(' ');

  return (
    <Link className="about-work-band about-work-band--unruled" href={`/case-studies/${next.slug}`}>
      <span className="block">
        <span className="sr-only">Next case study: </span>
        <span className="block text-caption font-semibold text-primary">{next.client}</span>
        <span className="sr-only">, {next.projectName}. </span>
        <span className="about-work-band__label mt-xs block text-h3">
          {question.slice(0, cut + 1)}
          <span className="about-work-band__tail">
            {question.slice(cut + 1)}
            <ArrowRight className="icon text-h3 about-work-band__arrow" aria-hidden="true" focusable="false" />
          </span>
        </span>
      </span>
    </Link>
  );
}
