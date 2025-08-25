# marked-extended-latex

LaTex support to Marked

# Usage

```typescript
import Katex from "katex";
import Marked from "marked";
import extendedLatex from "marked-extended-latex";

const options = {
  render: (formula: string, displayMode: boolean) => Katex.renderToString(formula, { displayMode })
};

marked.use(extendedLatex(options));
marked("$a+b=c$");
// <p><span class="katex"><span ...
```

## `options`

- `lazy`, a boolean, whether to use lazy rendering, default `false`
- `render`, a callback, LaTex renderer. When `lazy` is true, it can be an async function (returns Promise)
