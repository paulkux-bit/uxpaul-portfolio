import createMDX from '@next/mdx';
import { BLOCK_INDEXING } from './seo.config.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  // Enforcing counterpart to app/robots.ts. robots.txt is only advisory, so
  // while the launch flag is set we also send X-Robots-Tag: noindex, nofollow
  // on every route, which Google honors even for disallowed-but-linked URLs.
  // Gated by the single BLOCK_INDEXING flag (seo.config.mjs) -> flip it to launch.
  async headers() {
    if (!BLOCK_INDEXING) return [];
    return [
      {
        source: '/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    // Next 16 narrowed the default qualities allowlist to [75]. The figure
    // components ladder across 75 (small-multiples thumbs), 80 (workhorse
    // Figure/Detail/Compare/ModePair/in-column), 85 (ConstrainedBleed +
    // non-priority FullBleed + bento span≥3), and 90 (priority LCP — hero
    // image, FullBleed-with-priority). All four must be declared or the
    // un-listed values throw at render time.
    qualities: [75, 80, 85, 90],
  },
};

// Next 16 / Turbopack requires remarkPlugins as string package names (not
// imported function references — functions aren't serializable across worker
// boundaries). The bundle's original config used imported refs, which would
// build under webpack but errors under Turbopack with "does not have
// serializable options". Adapted here.
const withMDX = createMDX({
  options: {
    remarkPlugins: [
      'remark-frontmatter',
      ['remark-mdx-frontmatter', { name: 'frontmatter' }],
    ],
  },
});

export default withMDX(nextConfig);
