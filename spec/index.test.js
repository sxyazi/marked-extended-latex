import { marked } from 'marked';
import extendedLatex from '../src/index.js';
import Katex from 'katex';

describe('latex-extension', () => {
  beforeEach(() => {
    marked.setOptions(marked.getDefaults());
  });

  test('inline latex', () => {
    marked.use(extendedLatex({
      env: 'test',
      render: (formula, displayMode) => Katex.renderToString(formula, { displayMode })
    }));

    expect(marked('y=f(x)').includes('y=f(x)')).toBe(true);
    expect(marked('$y=f(x)$').includes('<span class="katex">')).toBe(true);
  });

  test('block latex', () => {
    marked.use(extendedLatex({
      env: 'test',
      render: (formula, displayMode) => Katex.renderToString(formula, { displayMode })
    }));

    expect(marked('y=f(x)').includes('y=f(x)')).toBe(true);
    expect(marked('$$y=f(x)$$').includes('<span class="katex-display">')).toBe(true);
  });

  test('inline latex and lazy is true', () => {
    marked.use(extendedLatex({
      env: 'test',
      lazy: true,
      render: async(formula, displayMode) => Katex.renderToString(formula, { displayMode })
    }));

    expect(marked('$y=f(x)$').includes('y=f(x)')).toBe(true);
  });

  test('block latex and lazy is true', () => {
    marked.use(extendedLatex({
      env: 'test',
      lazy: true,
      render: async(formula, displayMode) => Katex.renderToString(formula, { displayMode })
    }));

    expect(marked('$$y=f(x)$$').includes('y=f(x)')).toBe(true);
  });
});
