/* FIXTURE — nothing here is a colour literal. Every item MUST be reported as
 * excluded WITH A NAMED REASON, never silently dropped. See §7: a fixture that
 * passes by producing no output cannot be told apart from a file that was never
 * opened, which is precisely how the .mdx gap survived the K4 census.
 *
 * A comment mentioning oklch(0.5 0.02 55) and #ff0000 and rebeccapurple, all of
 * which must be excluded as `comment`. */

// A line comment naming rgb(1,2,3) and hsl(1,2%,3%) — excluded as `comment`.

// fragment references that satisfy the hex grammar — excluded as `fragment-ref`
export const A = () => <a href="#abc">anchor</a>;
export const B = () => <svg><rect fill="url(#grad)" /></svg>;

// a colour-space KEYWORD, not a call — excluded as `not-a-call`
export const C = () => (
  <div style={{ borderColor: 'color-mix(in oklch, currentColor 12%, transparent)' }} />
);

// prose inside JSX — excluded as `prose`
export const D = () => <p>Colour theory: red and green are complements.</p>;

// keywords that are always legitimate: never candidates at all
export const E = () => <div style={{ color: 'transparent', fill: 'currentColor' }} />;

// a hex of an invalid length — excluded as `not-a-hex-length`
export const F = () => <span data-id="#abcde">five digits is not a colour</span>;
