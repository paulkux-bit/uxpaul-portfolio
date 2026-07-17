import type { MetadataRoute } from 'next';
import { BLOCK_INDEXING } from '@/seo.config.mjs';

/**
 * Site-wide robots.txt. Gated by the single BLOCK_INDEXING launch flag in
 * seo.config.mjs (see that file to launch). While blocked, this disallows all
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
