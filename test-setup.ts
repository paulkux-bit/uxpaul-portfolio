import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import React from 'react';

/**
 * Mock next/image so component tests can render without Next's image-loader
 * runtime. The `priority` prop surfaces as `data-priority="true"` on the
 * rendered <img>, which lets tests assert LCP exclusivity by querying that
 * attribute.
 */
type MockImageProps = {
  src: string | { src: string };
  alt: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  width?: number;
  height?: number;
  className?: string;
};

vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    priority,
    sizes,
    quality,
    width,
    height,
    className,
  }: MockImageProps) => {
    const resolvedSrc = typeof src === 'string' ? src : src.src;
    return React.createElement('img', {
      src: resolvedSrc,
      alt,
      width,
      height,
      className,
      sizes,
      'data-quality': quality,
      ...(priority ? { 'data-priority': 'true' } : {}),
    });
  },
}));
