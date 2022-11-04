# Importing npm packages via CDN

Most developers currently use npm modules in Deno by importing them using one of
many CDNs. You can reference the CDN URL in your Deno TS code or directly in
your browser as an ES Module. These CDN URLs are reusuable - they also provide
instructions on how to use in Deno, the browser, etc. Sometimes you need a URL
flag to indicate that that you need a Deno-specific module.

**Starting with Deno release 1.25**, Deno also offers experimental support for
[npm specifiers](), which are a new way of using npm modules in Deno that offers
a higher chance of compatibility. Our recommendation is that you use npm
specifiers when possible.

However, given that npm specifiers are still a work in progress, below we cover
how to use npm modules in Deno via some popular CDNs.

## esm.sh

[esm.sh](esm.sh) is a fast, global content delivery network for ES Modules. All
modules are transformed to ESM by [esbuild](https://github.com/evanw/esbuild) in
[npm](https://www.npmjs.com/).

Format:

Default: `https://esm.sh/package` Version: `https://esm.sh/package@version`

React:

```ts
import React from "https://esm.sh/react";
```

Content from following that React URL:

```ts
/* esm.sh - react@17.0.1 */
export * from "https://cdn.esm.sh/v15/react@17.0.1/esnext/react.js";
export { default } from "https://cdn.esm.sh/v15/react@17.0.1/esnext/react.js";
```

Sample from the Deno Compatibility section of the homepage:

Note that esm.sh will polyfill the node internal modules (fs, os , etc.) with
https://deno.land/std/node to support some modules to work in Deno, like
postcss:

```ts
import postcss from "https://esm.sh/postcss";
import autoprefixer from "https://esm.sh/autoprefixer";

const css = (await postcss([autoprefixer]).process(`
    backdrop-filter: blur(5px);
    user-select: none;
`).async()).content;
```
