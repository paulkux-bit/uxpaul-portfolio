import { describe, expect, it } from 'vitest';
import { BLOCK_INDEXING } from '../seo.config.mjs';
import robots from '../app/robots.ts';
import nextConfig from '../next.config.mjs';

// PAUL DOES NOT WANT THIS SITE DISCOVERABLE BY NAME SEARCH, BY ANYONE, EVER.
// Launch is the DNS cutover to uxpaul.com with noindex still on.
//
// This test exists because that is the one requirement in the codebase with no
// other signal. Flipping BLOCK_INDEXING to false breaks nothing: every gate
// stays green, every page still renders, and nothing looks wrong. The
// consequence appears weeks later, once Google has crawled the site and his
// name resolves to it — at which point it cannot be undone by editing a flag.
//
// seo.config.mjs used to instruct exactly that flip as "the ONE edit" to
// launch. Four files repeated some form of it. Those comments are corrected,
// but comments are advisory and this is not: reversing the decision now means
// editing an assertion whose message states the decision, which is a
// deliberate act rather than a one-character change. That friction is the
// point.
//
// If the requirement genuinely changes, change it here first and let the test
// name the decision. The fix is never to loosen the assertion quietly.
describe('the site is permanently non-indexable', () => {
  it('BLOCK_INDEXING is true', () => {
    expect(
      BLOCK_INDEXING,
      'Paul does not want this site discoverable by name search, by anyone, ever. ' +
        'Launch is the DNS cutover to uxpaul.com with noindex still on, not this flag. ' +
        'If you are changing this, change the requirement first — see seo.config.mjs.',
    ).toBe(true);
  });

  // The flag being true is only half of it. Asserting the WIRING as well,
  // because the lesson from __tests__/sandbox-guard.test.mjs is that source
  // text and behaviour are different things: a guard can exist and not work.
  // If someone deletes the flag's consumer, the flag stays true and the site
  // starts being crawlable anyway.
  it('robots.txt disallows every crawler while the flag holds', () => {
    const r = robots();
    expect(r.rules, 'app/robots.ts no longer disallows crawling').toMatchObject({
      userAgent: '*',
      disallow: '/',
    });
  });

  it('every route sends the enforcing X-Robots-Tag header', async () => {
    const headers = await nextConfig.headers();
    const all = headers.flatMap((h) => h.headers.map((k) => `${h.source} ${k.key}: ${k.value}`));
    expect(all, 'next.config.mjs no longer sends X-Robots-Tag on every route').toContain(
      '/:path* X-Robots-Tag: noindex, nofollow',
    );
  });
});
