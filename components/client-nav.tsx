'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// The wordmark carries "home", so the nav doesn't repeat it. "Work" is an
// in-page anchor to the Selected Work section (/#selected-work works from any
// page); it never matches pathname, so it carries no active state — by design.
const LINKS = [
  { href: '/#selected-work', label: 'Work' },
  { href: '/about', label: 'About' },
] as const;

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
