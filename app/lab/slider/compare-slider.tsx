'use client';

/**
 * The draggable divider for /lab/slider. Pointer drag (mouse and touch)
 * anywhere on the frame; keyboard on the focusable handle: left/right arrows
 * step 5%, Home/End jump. Both images stay in the DOM and are legible at the
 * default position; this is not a click-to-expand pattern. Under reduced
 * motion the divider still drags, nothing eases (see slider.css).
 */

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import { GripVertical } from 'lucide-react';

const STEP = 5;
const clamp = (n: number) => Math.min(100, Math.max(0, n));

export function CompareSlider({
  aSrc,
  aAlt,
  bSrc,
  bAlt,
}: {
  aSrc: string;
  aAlt: string;
  bSrc: string;
  bAlt: string;
}) {
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  const posFromClientX = useCallback((clientX: number) => {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    setPos(clamp(((clientX - rect.left) / rect.width) * 100));
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    posFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragging) posFromClientX(e.clientX);
  };
  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setDragging(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowLeft') setPos((p) => clamp(p - STEP));
    else if (e.key === 'ArrowRight') setPos((p) => clamp(p + STEP));
    else if (e.key === 'Home') setPos(0);
    else if (e.key === 'End') setPos(100);
    else return;
    e.preventDefault();
  };

  return (
    <div
      ref={frameRef}
      className="lab-compare"
      style={{ '--lab-pos': `${pos}%` } as React.CSSProperties}
      data-dragging={dragging || undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {/* B underneath, full frame; A on top, clipped to the divider. */}
      <Image
        className="lab-compare__img"
        src={bSrc}
        alt={bAlt}
        fill
        sizes="(max-width: 768px) 100vw, 768px"
        draggable={false}
      />
      <Image
        className="lab-compare__img lab-compare__img--a"
        src={aSrc}
        alt={aAlt}
        fill
        sizes="(max-width: 768px) 100vw, 768px"
        draggable={false}
      />
      <div className="lab-compare__divider" aria-hidden="true" />
      <span className="lab-compare__label lab-compare__label--a text-caption">A</span>
      <span className="lab-compare__label lab-compare__label--b text-caption">B</span>
      <button
        type="button"
        className="lab-compare__handle"
        role="slider"
        aria-label="Reveal of screen A over screen B"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        aria-valuetext={`${Math.round(pos)} percent of screen A shown`}
        onKeyDown={onKeyDown}
      >
        <GripVertical className="icon" aria-hidden="true" focusable="false" />
      </button>
    </div>
  );
}
