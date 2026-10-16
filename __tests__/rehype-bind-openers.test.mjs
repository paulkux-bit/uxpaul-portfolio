import { describe, expect, it } from 'vitest';
import rehypeBindOpeners, { bindOpeners } from '../lib/rehype-bind-openers.mjs';

const NBSP = ' ';

// Ruling 5b (16 Oct 2026): a word of three letters or fewer that opens a
// sentence is bound to the next word, so no line ends on it.
describe('bindOpeners', () => {
  it('binds a short sentence opener to the next word', () => {
    expect(bindOpeners('could actually do. I was proud.')).toBe(`could actually do. I${NBSP}was proud.`);
    expect(bindOpeners('I set the direction. The teams built it.')).toBe(`I set the direction. The${NBSP}teams built it.`);
    expect(bindOpeners('It ended. At URBN, I led.')).toBe(`It ended. At${NBSP}URBN, I led.`);
  });

  it('binds after a question mark, an exclamation mark and a closing quote', () => {
    expect(bindOpeners('Why? A form.')).toBe(`Why? A${NBSP}form.`);
    expect(bindOpeners('Stop! On it.')).toBe(`Stop! On${NBSP}it.`);
    expect(bindOpeners('“It held.” Our team.')).toBe(`“It held.” Our${NBSP}team.`);
  });

  it('leaves longer openers, mid-sentence words and the first word alone', () => {
    expect(bindOpeners('It held. They knew.')).toBe('It held. They knew.');
    expect(bindOpeners('I set the date and it held.')).toBe('I set the date and it held.');
    expect(bindOpeners('A date. 2025 was the year.')).toBe('A date. 2025 was the year.');
  });
});

describe('rehypeBindOpeners', () => {
  it('binds an opener that starts a node after a sentence ends in the node before', () => {
    const tree = {
      type: 'element',
      tagName: 'p',
      children: [
        { type: 'element', tagName: 'strong', children: [{ type: 'text', value: 'A kept date was invisible.' }] },
        { type: 'text', value: ' A missed one had a price.' },
      ],
    };
    rehypeBindOpeners()(tree);
    expect(tree.children[1].value).toBe(` A${NBSP}missed one had a price.`);
  });

  it('does not bind a node-initial word when the node before ended mid-sentence', () => {
    const tree = {
      type: 'element',
      tagName: 'p',
      children: [
        { type: 'element', tagName: 'strong', children: [{ type: 'text', value: 'right on' }] },
        { type: 'text', value: ' the day it said.' },
      ],
    };
    rehypeBindOpeners()(tree);
    expect(tree.children[1].value).toBe(' the day it said.');
  });

  it('rewrites text nodes and skips code', () => {
    const tree = {
      type: 'root',
      children: [
        { type: 'element', tagName: 'p', children: [{ type: 'text', value: 'Done. I was proud.' }] },
        { type: 'element', tagName: 'code', children: [{ type: 'text', value: 'x. I y' }] },
      ],
    };
    rehypeBindOpeners()(tree);
    expect(tree.children[0].children[0].value).toBe(`Done. I${NBSP}was proud.`);
    expect(tree.children[1].children[0].value).toBe('x. I y');
  });
});
