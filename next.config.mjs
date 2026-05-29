import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  images: {
    formats: ['image/avif', 'image/webp'],
    // Allowed densities/widths — defaults are fine; tighten later if needed.
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
