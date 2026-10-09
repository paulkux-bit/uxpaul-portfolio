import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // lint:color check-7 fixtures. Deliberately full of colour literals and not
    // source: they are scanned by scripts/color-literals.mjs and asserted in
    // __tests__/color-literals.test.mjs, never compiled or rendered.
    "scripts/fixtures/**",
  ]),
]);

export default eslintConfig;
