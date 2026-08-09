/* FIXTURE — every literal here MUST be found by scripts/color-literals.mjs.
 * Not compiled, not rendered, not linted: excluded in tsconfig.json and
 * eslint.config.mjs. Counts are asserted in __tests__/color-literals.test.mjs.
 *
 * The .tsx channels were the ones the K4 census could prove; the .mdx ones in
 * positives.mdx were the gap it could not, so both live here now. */

// 1. className with prefab Tailwind palette utilities (3 literals)
export const A = () => <div className="text-slate-700 bg-zinc-900 border-gray-200" />;

// 2. inline style object, named colour (1)
export const B = () => <div style={{ color: 'white' }} />;

// 3. inline style object, six-digit hex (1)
export const C = () => <div style={{ color: '#ff0000' }} />;

// 4. Tailwind ARBITRARY values — a hex and an oklch inside bracket syntax (2)
export const D = () => <div className="bg-[#ff0000] text-[oklch(0.5_0.02_55)]" />;

// 5. JSX attribute, three-digit hex (1)
export const E = () => <svg><path fill="#abc" /></svg>;

// 6. JSX attribute, six-digit hex (1)
export const F = () => <svg><path fill="#123456" /></svg>;

// 7. eight-digit hex, i.e. #rrggbbaa (1)
export const G = () => <div style={{ background: '#ff000080' }} />;

// 8. rgb()/rgba()/hsl()/hsla() calls (4)
export const H = () => (
  <div
    style={{
      color: 'rgb(1,2,3)',
      background: 'rgba(1,2,3,.5)',
      borderColor: 'hsl(1,2%,3%)',
      outlineColor: 'hsla(1,2%,3%,.5)',
    }}
  />
);
