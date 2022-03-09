const CLASS_NAME = 'latex-b172fea480b';

const latexRenderer = async(options) => {
  if (options.env !== 'test') {
    await import('katex/dist/katex.min.css');
  }
  const { default: katex } = await import('katex');

  return (formula, displayMode) => {
    return katex.renderToString(formula, {
      displayMode,
      output: options.output || 'html',
      throwOnError: false
    });
  };
};

const extBlock = (options) => ({
  name: 'latex-block',
  level: 'block',
  start(src) {
    return src.match(/\$\$[^\$]/)?.index ?? -1;
  },
  tokenizer(src, tokens) {
    const match = /^\$\$([^\$]+)\$\$/.exec(src);
    return match ? { type: 'latex-block', raw: match[0], formula: match[1] } : undefined;
  },
  renderer(token) {
    if (!options.lazy) return options.renderer(token.formula, true);
    return `<span class="${CLASS_NAME}" block>${token.formula}</span>`;
  }
});

const extInline = (options) => ({
  name: 'latex',
  level: 'inline',
  start(src) {
    return src.match(/\$[^\$]/)?.index ?? -1;
  },
  tokenizer(src, tokens) {
    const match = /^\$([^\$]+)\$/.exec(src);
    return match ? { type: 'latex', raw: match[0], formula: match[1] } : undefined;
  },
  renderer(token) {
    if (!options.lazy) return options.renderer(token.formula, false);
    return `<span class="${CLASS_NAME}">${token.formula}</span>`;
  }
});

let observer;
export default async(options = {}) => {
  if (options.lazy) {
    observer = new IntersectionObserver(async(entries, self) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue;
        }

        const span = entry.target;
        self.unobserve(span);

        if (!options.renderer) {
          options.renderer = await latexRenderer(options);
        }

        span.innerHTML = options.renderer(span.innerText, span.hasAttribute('block'));
        span.classList.add('latex-rendered');
      }
    });
  }

  if (!options.renderer && !options.lazy) {
    options.renderer = await latexRenderer(options);
  }

  return {
    extensions: [extBlock(options), extInline(options)]
  };
};

export const observe = () => {
  if (!observer) {
    return;
  }

  observer.disconnect();
  document.querySelectorAll(`span.${CLASS_NAME}:not(.latex-rendered)`).forEach(span => {
    observer.observe(span);
  });
};

export const disconnect = () => {
  observer?.disconnect();
};
