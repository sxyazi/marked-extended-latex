const CLASS_NAME = 'latex-b172fea480b';

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
    if (!options.lazy) return options.render(token.formula, true);
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
    if (!options.lazy) return options.render(token.formula, false);
    return `<span class="${CLASS_NAME}">${token.formula}</span>`;
  }
});

let observer;
/* istanbul ignore next */
export default (options = {}) => {
  /* istanbul ignore next */
  if (options.lazy && options.env !== 'test') {
    observer = new IntersectionObserver((entries, self) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue;
        }

        const span = entry.target;
        self.unobserve(span);

        Promise.resolve(options.render(span.innerText, span.hasAttribute('block'))).then((html) => {
          span.innerHTML = html;
        });
        span.classList.add('latex-rendered');
      }
    });
  }

  return {
    extensions: [extBlock(options), extInline(options)]
  };
};

/* istanbul ignore next */
export const observe = () => {
  if (!observer) {
    return;
  }

  observer.disconnect();
  document.querySelectorAll(`span.${CLASS_NAME}:not(.latex-rendered)`).forEach(span => {
    observer.observe(span);
  });
};

/* istanbul ignore next */
export const disconnect = () => {
  observer?.disconnect();
};
