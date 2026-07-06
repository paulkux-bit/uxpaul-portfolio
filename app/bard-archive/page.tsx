import type { Metadata } from 'next';
import Content from '@/app/content/_drafts/bard-archive.mdx';

// Holder route for the BARD case-study content moved out from below "Three
// frictions" during the Resolutions-spine migration (2026-07). Verbatim move,
// nothing deleted. NOT a case study (absent from the [slug] map) and not indexed —
// a private draft the author can revisit before deciding its final home.
export const metadata: Metadata = {
  title: 'BARD archive (draft)',
  robots: { index: false, follow: false },
};

export default function BardArchivePage() {
  return (
    <article className="case-study-article">
      <div className="case-study-prose">
        <Content />
      </div>
    </article>
  );
}
