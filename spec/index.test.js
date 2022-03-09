import { marked } from 'marked';
import extendedLatex from '../src/index.js';

describe('latex-extension', () => {
  beforeEach(() => {
    marked.setOptions(marked.getDefaults());
  });

  test('inline', async() => {
    const extended = await extendedLatex({ env: 'test' });

    marked.use(extended);
    expect(marked('$y=f(x)$').includes('<span class="katex">')).toBe(true);
  });

  test('block', async() => {
    const extended = await extendedLatex({ env: 'test' });

    marked.use(extended);
    expect(marked('$$y=f(x)$$').includes('<span class="katex-display">')).toBe(true);
  });
});
