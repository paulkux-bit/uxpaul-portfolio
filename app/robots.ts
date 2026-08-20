import type { MetadataRoute } from 'next';
import { BLOCK_INDEXING } from '@/seo.config.mjs';

/**
 * Site-wide robots.txt. Gated by BLOCK_INDEXING in seo.config.mjs, which is
 * PERMANENT and not a launch switch - see that file for why. This disallows all
 * crawling; robots.txt is advisory, so the enforcing X-Robots-Tag header in
 * next.config.mjs is what actually keeps disallowed-but-linked URLs out.
 */
export default function robots(): MetadataRoute.Robots {
  if (BLOCK_INDEXING) {
    return {
      rules: { userAgent: '*', disallow: '/' },
    };
  }

  return {
    rules: { userAgent: '*', allow: '/' },
  };
}
