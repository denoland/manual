## Using deno-dom with Deno

[deno-dom](https://deno.land/x/deno_dom) is an implementation of DOM and HTML
parser in Deno. It is implemented in Rust (via Wasm) and TypeScript.

```ts
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.21-alpha/deno-dom-wasm.ts";

const doc = new DOMParser().parseFromString(
  `
  <!doctype html>
  <html lang="en">
    <head>
      <title>Hello SSR</title>
    </head>
    <body>
      <form>
        <input name="user">
        <button>
          Submit
        </button>
      </form>
    </body>
  </html>
`,
  "text/html",
);
```
