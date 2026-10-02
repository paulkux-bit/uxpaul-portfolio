import Link from 'next/link';

/**
 * The site's own 404 (E1b and E2a, ruled 1 Oct 2026). It replaces Next's default,
 * which rendered centred in the window in its own type and graded F in the
 * human-made review. The root layout supplies the header and footer, so this is
 * only the content: one heading, one line, one link, on the same 64 page top as
 * every other page (top-of-page ruling T1c). Words are Paul's pick from drafts.
 * The line is text-body, not the text-lead the option render used: text-lead is
 * allowlisted in lint:type check 12 as About-only, and using it here would make
 * that entry's reason false.
 *
 * Server Component, static.
 */
export const metadata = {
  title: 'Nothing here',
};

export default function NotFound() {
  return (
    <div className="page-container pt-2xl pb-section">
      <h1 className="text-h1 text-primary">Nothing here.</h1>
      <p className="mt-m text-body text-secondary">The work is on the home page.</p>
      <p className="mt-l">
        <Link className="text-body" href="/">
          See the work
        </Link>
      </p>
    </div>
  );
}
