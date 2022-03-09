# marked-extended-latex

<!-- Description -->

# Usage

```js
const marked = require("marked");
const extendedLatex = require("marked-extended-latex");

// or ES Module script
// import marked from "https://cdn.jsdelivr.net/gh/markedjs/marked/lib/marked.esm.js";
// import extendedLatex from "https://cdn.jsdelivr.net/gh/UziTech/marked-extended-latex/lib/index.mjs";

const options = {}
const extended = await extendedLatex(options)

marked.use(extended);
marked("$a+b=c$");
// <p>|example html|</p>
```

## `options`

- `lazy`, a boolean, whether to use lazy rendering, default `false`
- `output`, a string, the output mode of LaTex, default `html`
- `renderer`, a callback, LaTex renderer if you want to do something, otherwise use the default renderer
