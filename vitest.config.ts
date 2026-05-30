import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

/**
 * Vitest config for component tests. Uses jsdom for DOM APIs and the React
 * plugin for JSX. The `@/` alias mirrors the tsconfig path so imports inside
 * components resolve identically in tests.
 *
 * next/image is mocked in test-setup.ts so component tests don't need to boot
 * Next's image-loader runtime.
 */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test-setup.ts'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
    },
  },
});
