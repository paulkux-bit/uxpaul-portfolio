'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { role, templateB, type TemplateBImage } from '@/app/data/template-b';
import manifest from '@/app/data/client-work-images.json';

/**
 * The client work dialog (Template B). Each "Client work" shelf row's title
 * links to `#slug`; this island opens that piece in a native <dialog> over the
 * home page. Built from the locked prototype
 * (docs/previews/template-b/template-b-dialog-locked.html) to the plan in
 * docs/template-b-build-plan.md. Styles live in globals.css under CLIENT WORK
 * DIALOG.
 *
 * ONE URL PER PIECE, AS A HASH (Paul's "dialog, not page" ruling). A click on a
 * row pushes `#slug` and opens; a cold load with the hash opens that piece; Back
 * closes; Esc closes; a click on the scrim closes. Previous and next REPLACE the
 * hash, so one Back closes however many pieces were visited. Next 16 patches
 * history.pushState to copy its own marker into our state, so Back is an in-app
 * traversal and never a reload (node_modules/next/dist/client/components/
 * app-router.js, the onPopState handler).
 *
 * THE ROWS STAY SERVER COMPONENTS. This listens for clicks on
 * `a[data-client-work]` at the document, so nothing on the shelf hydrates.
 * A modified click (new tab, new window) is left to the browser, and the new
 * tab cold-opens the piece from its hash.
 *
 * IMAGES LOAD ONLY WHEN OPEN. Nothing inside the dialog renders while it is
 * closed, so the home page asks for no image of this surface until a reader
 * opens one.
 *
 * Focus moves into the dialog on open and returns on close to the row that
 * opened it, or, after a cold deep link, to the current piece's row. Opened from
 * the keyboard, it lands on the close button, whose halo shows; opened by a
 * pointer, a deep link or Back/Forward, it lands on the panel, which draws no
 * ring (Paul's ruling, 11 Oct 2026: the ring on open is for keyboard users).
 */

type ImageFile = { width: number; height: number };
const FILES = (manifest as { images: Record<string, { files: ImageFile[] }> }).images;
const COUNT = templateB.length;

// The frame is 588px wide from 1216 up (the panel reaches --page-max-width),
// about 46vw between 768 and 1216, and the column less the two gutters on the
// sheet. Thumbnails are about 70px wide at most, so they take the 144 rung.
const FRAME_SIZES = '(min-width: 1216px) 588px, (min-width: 768px) 46vw, calc(100vw - 48px)';
const THUMB_SIZES = '72px';

function indexOfHash(hash: string) {
  return templateB.findIndex((piece) => `#${piece.slug}` === hash);
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** A duration token in milliseconds. The production build minifies 180ms to
 *  .18s, and parseFloat alone read that as 0.18 ms, so the swap waited no time
 *  at all and the old piece never left (found by the behaviour checks). */
function durationMs(token: string, fallback: number) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  const value = parseFloat(raw);
  if (Number.isNaN(value)) return fallback;
  return raw.endsWith('ms') ? value : value * 1000;
}

function srcSetFor(image: TemplateBImage, format: 'avif' | 'webp') {
  return (FILES[image.src]?.files ?? []).map((f) => `${image.src}-${f.width}.${format} ${f.width}w`).join(', ');
}

/** AVIF and WebP at every rung the encoder wrote. The <img> falls back to the
 *  588 WebP (or the widest rung below it) and carries the widest rung's size,
 *  so the box has its aspect ratio before the bytes arrive. */
function Picture({ image, sizes, alt, eager }: { image: TemplateBImage; sizes: string; alt: string; eager: boolean }) {
  const files = FILES[image.src]?.files ?? [];
  if (files.length === 0) return null;
  const srcSet = (format: 'avif' | 'webp') => srcSetFor(image, format);
  const fallback = files[Math.min(1, files.length - 1)];
  const widest = files[files.length - 1];
  return (
    <picture>
      <source type="image/avif" srcSet={srcSet('avif')} sizes={sizes} />
      <img
        src={`${image.src}-${fallback.width}.webp`}
        srcSet={srcSet('webp')}
        sizes={sizes}
        width={widest.width}
        height={widest.height}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
      />
    </picture>
  );
}

export function ClientWorkDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  // The row that opened the dialog, and whether we pushed a history entry
  // (a cold deep link did not, so closing it must not go Back off the site).
  const openerRef = useRef<HTMLElement | null>(null);
  const pushedRef = useRef(false);
  // Opened by a keyboard activation of a row (Enter fires a click with
  // detail 0). Everything else, including a cold deep link, is not.
  const keyboardRef = useRef(false);
  // The current image, readable from observer callbacks without a stale closure.
  const imageRef = useRef(0);

  const [current, setCurrent] = useState<number | null>(null);
  const [image, setImage] = useState(0);
  // A piece change runs in three phases: the old piece leaves against the
  // direction of travel, the new one is placed on the far side with no
  // transition, then it settles into place. `travel` is +1 for next, -1 for
  // previous. Under reduced motion the phase never leaves 'idle'.
  const [phase, setPhase] = useState<'idle' | 'leaving' | 'arriving'>('idle');
  const [travel, setTravel] = useState(1);
  const [announcement, setAnnouncement] = useState('');

  const titleId = useId();
  const statementId = useId();

  const show = useCallback((index: number) => {
    setCurrent(index);
    setImage(0);
    imageRef.current = 0;
  }, []);

  // showModal() AFTER the content renders, not in show(): opened empty, it would
  // find nothing to focus and announce a dialog with no name. Focus is then
  // placed by hand rather than left to showModal, whose choice differs between
  // the sheet (Chrome makes the scrolling panel focusable, and it comes first)
  // and the panel. A keyboard open goes to the close button, so its halo marks
  // where the reader is. Any other open goes to the panel (tabindex -1, no
  // ring): a script focus on a cold load counts as keyboard-like to the
  // browser, so focusing the button there would light its halo for a reader
  // who never touched a key.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (current === null || !dialog || dialog.open) return;
    dialog.showModal();
    if (keyboardRef.current) closeRef.current?.focus();
    else panelRef.current?.focus({ preventScroll: true });
  }, [current]);

  // Rows: a plain click opens; anything modified is the browser's.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>('a[data-client-work]');
      if (!link) return;
      const index = indexOfHash(`#${link.dataset.clientWork}`);
      if (index < 0) return;
      event.preventDefault();
      openerRef.current = link;
      pushedRef.current = true;
      keyboardRef.current = event.detail === 0;
      window.history.pushState({ clientWork: true }, '', `#${templateB[index].slug}`);
      show(index);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [show]);

  // Open on intent (build review, 10x move D): when a row is hovered or takes
  // focus, fetch that piece's first image with the same srcset and sizes the
  // frame will ask for, so the browser picks the same rung and the open finds
  // it in the cache. Once per piece. Measured before this: 548 ms from click to
  // first image on a throttled connection. Touch has no hover; a tap still
  // fires pointerover a moment before its click.
  //
  // AN OFF-DOM Image, NOT <link rel="preload">. A preload that is not used
  // within a few seconds logs a console warning, and hovering through the shelf
  // without opening left four of them (measured): noise for the reader who
  // opens DevTools. Image() warms the same cache and logs nothing.
  useEffect(() => {
    const done = new Set<string>();
    const onIntent = (event: Event) => {
      if (!(event.target instanceof Element)) return;
      const slug = event.target.closest<HTMLAnchorElement>('a[data-client-work]')?.dataset.clientWork;
      const piece = templateB.find((p) => p.slug === slug);
      if (!piece || done.has(piece.slug)) return;
      done.add(piece.slug);
      const warm = new Image();
      warm.decoding = 'async';
      warm.sizes = FRAME_SIZES;
      warm.srcset = srcSetFor(piece.images[0], 'avif');
    };
    document.addEventListener('pointerover', onIntent);
    document.addEventListener('focusin', onIntent);
    return () => {
      document.removeEventListener('pointerover', onIntent);
      document.removeEventListener('focusin', onIntent);
    };
  }, []);

  // Cold deep link, and Back or Forward onto (or off) a piece's hash. A hash
  // that names no piece (the skip link's #main, for one) leaves a closed
  // dialog alone and closes an open one.
  useEffect(() => {
    const sync = () => {
      const index = indexOfHash(window.location.hash);
      keyboardRef.current = false;
      if (index >= 0) show(index);
      else if (dialogRef.current?.open) dialogRef.current.close();
    };
    if (indexOfHash(window.location.hash) >= 0) sync();
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, [show]);

  // Every way of closing (the button, Esc, the scrim, Back) ends here.
  const onClose = useCallback(() => {
    if (indexOfHash(window.location.hash) >= 0) {
      if (pushedRef.current) window.history.back();
      else window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search);
    }
    pushedRef.current = false;
    const row =
      openerRef.current ??
      (current !== null
        ? document.querySelector<HTMLElement>(`a[data-client-work="${templateB[current].slug}"]`)
        : null);
    openerRef.current = null;
    setCurrent(null);
    setPhase('idle');
    setAnnouncement('');
    row?.focus();
  }, [current]);

  const close = () => dialogRef.current?.close();

  // Image changes, from the thumbnails, the arrow keys or a swipe.
  const goToImage = (next: number) => {
    const track = trackRef.current;
    if (!track || next < 0 || next >= track.children.length) return;
    const slide = track.children[next] as HTMLElement;
    track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    if (next !== imageRef.current) {
      imageRef.current = next;
      setImage(next);
      setAnnouncement(`Image ${next + 1} of ${track.children.length}`);
    }
  };

  // A swipe moves the track without telling anyone; the slide that is mostly
  // in view becomes the current image.
  useEffect(() => {
    const track = trackRef.current;
    if (current === null || !track) return;
    track.scrollLeft = 0;
    const slides = Array.from(track.children);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = slides.indexOf(entry.target);
          if (index === imageRef.current) continue;
          imageRef.current = index;
          setImage(index);
          setAnnouncement(`Image ${index + 1} of ${slides.length}`);
        }
      },
      { root: track, threshold: 0.6 },
    );
    slides.forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, [current]);

  // Previous and next: replace the hash, move the content in the direction of
  // travel, announce. The four pieces read as one set a reader flips through
  // (build review, 10x move C), which the ruled-out counter would otherwise
  // have had to say.
  const goToPiece = (step: number) => {
    if (current === null) return;
    const next = (current + step + COUNT) % COUNT;
    window.history.replaceState(window.history.state, '', `#${templateB[next].slug}`);
    const reduce = prefersReducedMotion();
    const swap = () => {
      // Closed while the old piece was leaving: do not reopen.
      if (!dialogRef.current?.open) return;
      setCurrent(next);
      setImage(0);
      imageRef.current = 0;
      setPhase(reduce ? 'idle' : 'arriving');
      setAnnouncement(`Now showing ${templateB[next].name}`);
      panelRef.current?.scrollTo({ top: 0 });
    };
    if (reduce) return swap();
    setTravel(step > 0 ? 1 : -1);
    setPhase('leaving');
    window.setTimeout(swap, durationMs('--duration-control', 180));
  };

  // The arriving piece is painted once on the far side, then released, so it
  // transitions into place rather than jumping. Two frames: the first commits
  // the far-side position, the second lets it move.
  useEffect(() => {
    if (phase !== 'arriving') return;
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setPhase('idle'));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [phase]);

  const onPieceLink = (event: React.MouseEvent<HTMLAnchorElement>, step: number) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    goToPiece(step);
  };

  const piece = current === null ? null : templateB[current];
  const previous = current === null ? null : templateB[(current - 1 + COUNT) % COUNT];
  const next = current === null ? null : templateB[(current + 1) % COUNT];

  return (
    <dialog
      ref={dialogRef}
      className="client-work"
      aria-labelledby={piece ? titleId : undefined}
      aria-describedby={piece ? statementId : undefined}
      onClose={onClose}
    >
      {piece && previous && next ? (
        <div
          className="client-work__stage"
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div
            ref={panelRef}
            tabIndex={-1}
            className={`client-work__panel${phase === 'idle' ? '' : ` is-${phase}`}`}
            style={{ ['--client-work-travel' as string]: travel }}
          >
            <button ref={closeRef} type="button" className="client-work__close" aria-label="Close" onClick={close}>
              <X className="icon" aria-hidden="true" />
            </button>

            <div className="client-work__media">
              <div
                ref={trackRef}
                className="client-work__track"
                tabIndex={0}
                role="region"
                aria-roledescription="carousel"
                aria-label="Images of the work"
                onKeyDown={(event) => {
                  if (event.key === 'ArrowRight') {
                    event.preventDefault();
                    goToImage(image + 1);
                  } else if (event.key === 'ArrowLeft') {
                    event.preventDefault();
                    goToImage(image - 1);
                  }
                }}
              >
                {piece.images.map((item, k) => (
                  <figure
                    key={item.src}
                    className={`client-work__slide${item.fit === 'whole' ? ' client-work__slide--whole' : ''}`}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${k + 1} of ${piece.images.length}`}
                  >
                    <Picture image={item} sizes={FRAME_SIZES} alt={item.alt} eager={k === 0} />
                  </figure>
                ))}
              </div>
              <div className="client-work__thumbs" role="group" aria-label="Choose an image">
                {piece.images.map((item, k) => (
                  <button
                    key={item.src}
                    type="button"
                    className={`client-work__thumb${item.fit === 'whole' ? ' client-work__thumb--whole' : ''}`}
                    aria-label={`Image ${k + 1} of ${piece.images.length}`}
                    aria-current={k === image ? 'true' : undefined}
                    onClick={() => goToImage(k)}
                  >
                    <Picture image={item} sizes={THUMB_SIZES} alt="" eager />
                  </button>
                ))}
              </div>
            </div>

            <div className="client-work__side">
              {/* The h2 shows the title, then the byline, and is NAMED by the
                  full name line ("Connected Politics, pitched to the BBC"),
                  which the dialog takes as its own name. The punctuation used to
                  ride in an sr-only span; positioned out of flow, it became its
                  own box in name computation and read "Politics , pitched"
                  (build review, path item 4). */}
              <h2 id={titleId} className="client-work__title" aria-label={piece.name}>
                <span className="client-work__name text-h1">{piece.title}</span>{' '}
                <span className="client-work__byline">{piece.byline}</span>
              </h2>
              <p className="client-work__role text-caption">{role}</p>
              <p id={statementId} className="client-work__statement text-h3">
                {piece.statement}
              </p>
              <p className="client-work__paragraph text-small">{piece.paragraph}</p>

              <nav className="client-work__nav text-caption" aria-label="Other client work">
                <a
                  href={`#${previous.slug}`}
                  className="client-work__nav-link client-work__nav-link--prev quiet-link"
                  onClick={(event) => onPieceLink(event, -1)}
                >
                  <ArrowLeft className="icon" aria-hidden="true" />
                  <span className="sr-only">Previous piece: </span>
                  <span className="client-work__nav-label">{previous.wordmark}</span>
                </a>
                <a
                  href={`#${next.slug}`}
                  className="client-work__nav-link quiet-link"
                  onClick={(event) => onPieceLink(event, 1)}
                >
                  <span className="sr-only">Next piece: </span>
                  <span className="client-work__nav-label">{next.wordmark}</span>
                  <ArrowRight className="icon" aria-hidden="true" />
                </a>
              </nav>

              <p className="sr-only" aria-live="polite">
                {announcement}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
