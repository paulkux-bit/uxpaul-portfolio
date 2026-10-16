// Binds a short word that opens a sentence to the word after it (ruling 5b,
// 16 Oct 2026). Book typesetting keeps a line from ending on "I", "A", "At" or
// "The" when that word starts the next sentence: the eye reads it as the end
// of the thought and has to come back for it. On main at 69f09f1, 13 lines at
// 390 and 1440 ended that way ("At / URBN", "The / teams", "I / was").
//
// The rule: after a sentence ends (. ! ? and any closing quote or bracket),
// a following word of three letters or fewer is joined to the next word with
// a no-break space (U+00A0). Nothing longer is touched, so it can never push a
// long word past a 360px column. Code and preformatted text are left alone.
// A sentence that ends inside one node and opens in the next (a bold run-in
// "...to shoppers.</strong> A missed one") is bound too: the walk carries the
// end of the last text it saw across element boundaries.
//
// It runs on the case-study MDX through @next/mdx (next.config.mjs), and
// components call bindOpeners on strings they compose (the painting credit).
// A caption's gloss, set in its own span after a bold lead, goes through
// bindAfter, so its first word binds when the lead ended a sentence (B1a).
// Home and About set their strings in JSX and bind by hand.

const SKIP = new Set(['code', 'pre', 'script', 'style', 'kbd', 'samp']);
const OPENER = /([.!?][”’"')\]]*\s+)([A-Za-z’']{1,3}) (?=\S)/g;
// A node that opens with a short word, right after a node that ended a sentence.
const LEADING = /^(\s+)([A-Za-z’']{1,3}) (?=\S)/;
const ENDS_SENTENCE = /[.!?][”’"')\]]*$/;

export function bindOpeners(text, afterSentenceEnd = false) {
  const out = text.replace(OPENER, '$1$2 ');
  return afterSentenceEnd ? out.replace(LEADING, '$1$2 ') : out;
}

// A string that follows another in its own element (a caption gloss after its
// bold lead): binds its own short sentence openers, and its first word when
// the string before it ended a sentence. Returns no added leading space.
export function bindAfter(prev, text) {
  return bindOpeners(' ' + text, ENDS_SENTENCE.test(String(prev ?? '').trimEnd())).slice(1);
}

function walk(node, state) {
  if (node.type === 'text' && typeof node.value === 'string') {
    node.value = bindOpeners(node.value, ENDS_SENTENCE.test(state.last));
    if (node.value.trim()) state.last = node.value.trimEnd();
    return;
  }
  if (node.type === 'element' && SKIP.has(node.tagName)) return;
  if (Array.isArray(node.children)) for (const child of node.children) walk(child, state);
}

export default function rehypeBindOpeners() {
  return (tree) => {
    walk(tree, { last: '' });
  };
}
