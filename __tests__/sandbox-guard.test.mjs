import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..');
const SANDBOX = join(REPO, 'app/sandbox');

// app/sandbox holds scratch pages — a bento stress test, a type specimen, a card
// experiment — and they must 404 on the production deployment. Each page carries
// `if (process.env.VERCEL_ENV === 'production') notFound()`.
//
// WHY THE PAGE GUARD IS REQUIRED, AND THE LAYOUT ALONE IS NOT ENOUGH.
// app/sandbox/layout.tsx carries the same guard, and it was originally the only
// one. That returned 404 while still shipping the page's content, because
// notFound() in a layout aborts its own segment but the page segment is still
// rendered and serialized into the RSC flight payload. Measured on
// /sandbox/type-bard, which embeds the whole BARD case study:
//
//     layout guard only   404, 173,677 bytes, "fifty-six jurisdictions" present
//     page guard added    404,   9,718 bytes, content absent
//
// So the PAGE guard is what keeps content out of the artifact. The layout is
// belt-and-braces. Neither is the safety net — THIS TEST IS. A fourth sandbox
// page added without a guard fails exactly the way type-bard did, and the 404
// status makes it look fine, so nothing but a red build catches it.
//
// The fix, when this goes red, is the guard — never the assertion.
//
// THIS TEST ASSERTS SOURCE TEXT, NOT BEHAVIOUR. It cannot catch a guard that
// exists and does not work, which is precisely the failure the layout had. The
// byte-level route enumeration is the only real proof:
//
//     VERCEL_ENV=production npx next build && VERCEL_ENV=production npm start
//     curl -s -o /dev/null -w '%{http_code} %{size_download}' localhost:3000/sandbox/<page>
//
// Re-run that whenever a sandbox page is added. A green suite here is not
// verification; read it as one and the 173,677-byte 404 comes back.
describe('every app/sandbox page guards itself against production', () => {
  const pages = existsSync(SANDBOX)
    ? readdirSync(SANDBOX, { withFileTypes: true })
        .filter((e) => e.isDirectory())
        .map((e) => `app/sandbox/${e.name}/page.tsx`)
        .filter((rel) => existsSync(join(REPO, rel)))
        .sort()
    : [];

  // A test that enumerates can pass vacuously — if app/sandbox moves or the read
  // breaks, zero pages means zero assertions and a green suite that checked
  // nothing. That is worse than no test, so the floor is asserted first.
  it('finds at least one sandbox page to check', () => {
    expect(pages.length, 'no app/sandbox/*/page.tsx found — did the directory move?')
      .toBeGreaterThan(0);
  });

  // Two INDEPENDENT assertions, deliberately not one condition-then-call regex.
  // \s* does not match comments, so a coupled matcher fails this — the exact
  // shape a careful person writes:
  //
  //     if (process.env.VERCEL_ENV === 'production') {
  //       // sandbox never ships to production — see __tests__/sandbox-guard
  //       notFound()
  //     }
  //
  // Punishing that gets the test .skipped within a month, after which it
  // protects nothing. Splitting admits a page carrying both halves unwired,
  // which is far cheaper than a false red and is caught by the enumeration.
  it.each(pages)('%s guards on VERCEL_ENV and calls notFound', (rel) => {
    const src = readFileSync(join(REPO, rel), 'utf8');
    expect(src, `${rel} does not import notFound from next/navigation`)
      .toMatch(/import\s*\{[^}]*\bnotFound\b[^}]*\}\s*from\s*['"]next\/navigation['"]/);
    expect(src, `${rel} has no production-conditioned VERCEL_ENV check`)
      .toMatch(/VERCEL_ENV\s*===\s*['"]production['"]/);
    expect(src, `${rel} never calls notFound()`).toMatch(/notFound\s*\(/);
  });

  // Belt-and-braces, and deleting it should be a deliberate act rather than a
  // quiet one.
  it('the subtree layout carries the same guard', () => {
    const rel = 'app/sandbox/layout.tsx';
    expect(existsSync(join(REPO, rel)), `${rel} is missing`).toBe(true);
    const src = readFileSync(join(REPO, rel), 'utf8');
    expect(src, `${rel} has no production-conditioned VERCEL_ENV check`)
      .toMatch(/VERCEL_ENV\s*===\s*['"]production['"]/);
    expect(src, `${rel} never calls notFound()`).toMatch(/notFound\s*\(/);
  });
});
