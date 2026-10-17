'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import face120 from '@/public/header-face.webp';

/** The trigger's hysteresis: the face shows once the anchor's bottom passes
 *  under the header, and leaves only once it is this far back below it. */
const HYSTERESIS_PX = 8;

/**
 * Wordmark / home link, and the header identity mark (ruled 12 Oct 2026).
 * Since the nav carries no "Home" item, this is the sole home affordance, so it
 * announces itself as current on `/` via aria-current. No underline in any
 * state (that idiom is reserved for nav links).
 *
 * THE HANDOFF. Once a page's opening scrolls under the header, the word hands
 * off to Paul's profile in a coin, and back on the way up. The anchor is the
 * first `[data-header-handoff]` (the "Paul Kali" line on home, the portrait on
 * About), else the page's h1, so every page, future ones included, follows the
 * rule without an edit. A page with neither keeps the wordmark.
 *
 * - Two IntersectionObservers on the anchor, with root margins of minus the
 *   measured header height and minus that plus 8px. Past the first line the
 *   face shows; it leaves only back across the second, so the edge cannot
 *   flicker. A ResizeObserver on the header rebuilds them when its height
 *   changes (resize, text zoom: the header is sized in rem).
 * - A MutationObserver on #main finds the anchor when it mounts after this
 *   effect, or is replaced, on a client navigation.
 * - The face waits for img.decode(), so it never shows half-loaded.
 * - State starts as the wordmark and is keyed to the path, so the server
 *   render, no-JS and anchorless pages are unchanged.
 *
 * "uxpaul" stays the link's text and accessible name, hidden by opacity only;
 * the face is aria-hidden with alt="". The look, the sequenced motion and the
 * round focus live in globals.css (SITE HEADER, wordmark handoff).
 */
export function WordmarkLink() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const imgRef = useRef<HTMLImageElement>(null);
  // The path the face is showing for, or null. Keyed to the path so a
  // navigation drops back to the wordmark without a reset in the effect.
  const [facePath, setFacePath] = useState<string | null>(null);
  const face = facePath === pathname;

  useEffect(() => {
    const header = document.querySelector<HTMLElement>('.site-header');
    const main = document.getElementById('main');
    if (!header || !main) return;

    let decoded = false;
    let past = false;
    let anchor: Element | null = null;
    let headerHeight = 0;
    let on: IntersectionObserver | undefined;
    let off: IntersectionObserver | undefined;
    let cancelled = false;
    // Set by the reader's own input, so the font re-jump below never undoes a
    // scroll they have started.
    let readerMoved = false;
    const INPUTS = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;
    const onInput = () => {
      readerMoved = true;
    };
    for (const t of INPUTS) window.addEventListener(t, onInput, { passive: true, capture: true });

    const apply = () => {
      if (!cancelled) setFacePath(decoded && past ? pathname : null);
    };

    const find = () => document.querySelector('[data-header-handoff]') ?? main.querySelector('h1');

    const observe = () => {
      on?.disconnect();
      off?.disconnect();
      if (!anchor) return;
      headerHeight = header.getBoundingClientRect().height;
      on = new IntersectionObserver(
        ([e]) => {
          const line = e.rootBounds?.top ?? headerHeight;
          if (!e.isIntersecting && e.boundingClientRect.bottom <= line) {
            past = true;
            apply();
          }
        },
        { rootMargin: `-${headerHeight}px 0px 0px 0px` },
      );
      off = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            past = false;
            apply();
          }
        },
        { rootMargin: `-${headerHeight + HYSTERESIS_PX}px 0px 0px 0px` },
      );
      on.observe(anchor);
      off.observe(anchor);
    };

    const track = () => {
      if (anchor?.isConnected) return;
      // A new anchor starts from the wordmark; a rebuild on resize does not,
      // so the face never blinks when the header changes height.
      anchor = find();
      past = false;
      apply();
      observe();
    };

    imgRef.current?.decode().then(
      () => {
        decoded = true;
        apply();
      },
      () => {}, // a failed decode keeps the wordmark
    );

    const mutations = new MutationObserver(track);
    mutations.observe(main, { childList: true, subtree: true });
    let firstResize = true;
    const resize = new ResizeObserver(() => {
      // The header's measured height feeds scroll-padding-top (globals.css, the
      // html rule), so an anchor jump clears a header that has wrapped to two
      // rows (200% text, or a phone at 200% page zoom). Written on every
      // resize, the first included (step 6 part 4, 16 Oct 2026).
      const height = header.getBoundingClientRect().height;
      document.documentElement.style.setProperty('--header-h', `${height}px`);
      // A cold load of a #fragment jumps before this property exists, so a
      // wrapped header can cover the target. Once, on the first run: if the
      // fragment's element sits above the header's bottom edge, jump to it
      // again now that the padding is right.
      if (firstResize) {
        firstResize = false;
        const id = decodeURIComponent(location.hash.slice(1));
        const target = id ? document.getElementById(id) : null;
        if (target && target.getBoundingClientRect().top < header.getBoundingClientRect().bottom) target.scrollIntoView();
        // A late webfont reflows the page after that jump, and Chromium under
        // reduced motion does not hold the target through it (Dagr and
        // Delivery Promise #outcome at 1440 overshot 254 and 147px with the
        // font 600ms late, on main too). Once the fonts are in, jump once more
        // if the target has left the scroll-padding line by more than 2px,
        // unless the reader has scrolled, tapped, clicked or pressed a key.
        if (target) {
          document.fonts.ready.then(() => {
            if (cancelled || readerMoved) return;
            const line = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
            if (Math.abs(target.getBoundingClientRect().top - line) > 2) target.scrollIntoView();
          });
        }
      }
      if (anchor && height !== headerHeight) observe();
    });
    resize.observe(header);
    track();

    return () => {
      cancelled = true;
      for (const t of INPUTS) window.removeEventListener(t, onInput, { capture: true });
      on?.disconnect();
      off?.disconnect();
      mutations.disconnect();
      resize.disconnect();
    };
  }, [pathname]);

  return (
    <Link
      href="/"
      aria-current={isHome ? 'page' : undefined}
      data-face={face || undefined}
      className="wordmark"
    >
      <span className="wordmark__word">uxpaul</span>
      <span className="wordmark__face" aria-hidden="true">
        <Image
          ref={imgRef}
          src={face120}
          alt=""
          width={120}
          height={120}
          unoptimized
          loading="eager"
          decoding="async"
        />
      </span>
    </Link>
  );
}
