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
    // Generated figure wrappers (scripts/regen-*-tsx.mjs output; the .svg beside
    // each .tsx is the source of truth). Ignoring them here replaces the per-file
    // eslint-disable banners, which lint flagged as unused.
    "components/oku/*.tsx",
    "components/fdte/*.tsx",
  ]),
]);

export default eslintConfig;
