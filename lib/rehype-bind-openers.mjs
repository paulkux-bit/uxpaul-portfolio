// Binds a short word that opens a sentence to the word after it (ruling 5b,
// 16 Oct 2026). Book typesetting keeps a line from ending on "I", "A", "At" or
// "The" when that word starts the next sentence: the eye reads it as the end
// of the thought and has to come back for it. On main at 69f09f1, 13 lines at
// 390 and 1440 ended that way ("At / URBN", "The / teams", "I / was").
//
// The rule: after a sentence ends (. ! ? and any closing quote or bracket),
// a following word of three letters or fewer is joined to the next word with
// a no-break space (U+00A0). Nothing longer is touched, so it can never push a
// long word past a 360px column. Code, preformatted text and anything without
// a text node are left alone. A sentence break that falls across two nodes
// (a full stop, then a <strong> starting with "I") is not bound: rare, and a
// guess at element boundaries would be worse than a missed line end.
//
// It runs on the case-study MDX through @next/mdx (next.config.mjs). Home and
// About set their strings in JSX and bind by hand.

const SKIP = new Set(['code', 'pre', 'script', 'style', 'kbd', 'samp']);
const OPENER = /([.!?][”’"')\]]*\s+)([A-Za-z’']{1,3}) (?=\S)/g;

export function bindOpeners(text) {
  return text.replace(OPENER, '$1$2 ');
}

function walk(node) {
  if (node.type === 'text' && typeof node.value === 'string') {
    node.value = bindOpeners(node.value);
    return;
  }
  if (node.type === 'element' && SKIP.has(node.tagName)) return;
  if (Array.isArray(node.children)) for (const child of node.children) walk(child);
}

export default function rehypeBindOpeners() {
  return (tree) => {
    walk(tree);
  };
}
