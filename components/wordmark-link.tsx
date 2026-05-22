'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Wordmark / home link. Client-only for the `usePathname` read: since the nav
 * no longer carries a "Home" item, this is the sole home affordance, so it
 * announces itself as current on `/` via aria-current. No underline in any
 * state (that idiom is reserved for nav links).
 */
export function WordmarkLink() {
  const isHome = usePathname() === '/';

  return (
    <Link
      href="/"
      aria-current={isHome ? 'page' : undefined}
      className="wordmark inline-flex min-h-11 items-center"
    >
      uxpaul
    </Link>
  );
}
