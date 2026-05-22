'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// The wordmark carries "home", so the nav doesn't repeat it. Work lands here
// when case studies exist.
const LINKS = [{ href: '/about', label: 'About' }] as const;

/** Primary nav links. Client-only for the `usePathname` active-state read. */
export function ClientNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary">
      <ul className="flex items-center gap-6">
        {LINKS.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                data-active={active || undefined}
                className="nav-link inline-flex min-h-11 items-center"
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
