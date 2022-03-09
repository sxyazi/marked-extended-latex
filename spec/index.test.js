import { marked } from 'marked';
import extendedLatex from '../src/index.js';

describe('latex-extension', () => {
  beforeEach(() => {
    marked.setOptions(marked.getDefaults());
  });

  test('inline latex', async() => {
    marked.use(await extendedLatex({ env: 'test' }));
    expect(marked('y=f(x)').includes('y=f(x)')).toBe(true);
    expect(marked('$y=f(x)$').includes('<span class="katex">')).toBe(true);
  });

  test('block latex', async() => {
    marked.use(await extendedLatex({ env: 'test' }));
    expect(marked('y=f(x)').includes('y=f(x)')).toBe(true);
    expect(marked('$$y=f(x)$$').includes('<span class="katex-display">')).toBe(true);
  });

  test('output is html', async() => {
    marked.use(await extendedLatex({ env: 'test', output: 'html' }));
    expect(marked('$y=f(x)$').includes('<span class="katex-mathml">')).toBe(false);
  });

  test('output is htmlAndMathml', async() => {
    marked.use(await extendedLatex({ env: 'test', output: 'htmlAndMathml' }));
    expect(marked('$y=f(x)$').includes('<span class="katex-mathml">')).toBe(true);
  });

  test('inline latex and lazy is true', async() => {
    marked.use(await extendedLatex({ env: 'test', lazy: true }));
    expect(marked('$y=f(x)$').includes('y=f(x)')).toBe(true);
  });

  test('block latex and lazy is true', async() => {
    marked.use(await extendedLatex({ env: 'test', lazy: true }));
    expect(marked('$$y=f(x)$$').includes('y=f(x)')).toBe(true);
  });
});
