# Modules

## Concepts

- [import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)
  allows you to include and use modules held elsewhere, on your local file
  system or remotely.
- Imports are URLs or file system paths.
- [export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export)
  allows you to specify which parts of your module are accessible to users who
  import your module.

## Overview

Deno by default standardizes the way modules are imported in both JavaScript and
TypeScript using the ECMAScript 6 `import/export` standard.

It adopts browser-like module resolution, meaning that file names must be
specified in full. You may not omit the file extension and there is no special
handling of `index.js`.

```js, ignore
import { add, multiply } from "./arithmetic.ts";
```

Dependencies are also imported directly, there is no package management
overhead. Local modules are imported in exactly the same way as remote modules.
As the examples show below, the same functionality can be produced in the same
way with local or remote modules.

## Local Import

In this example the `add` and `multiply` functions are imported from a local
`arithmetic.ts` module.

**Command:** `deno run local.ts`

```ts, ignore
/**
 * local.ts
 */
import { add, multiply } from "./arithmetic.ts";

function totalCost(outbound: number, inbound: number, tax: number): number {
  return multiply(add(outbound, inbound), tax);
}

console.log(totalCost(19, 31, 1.2));
console.log(totalCost(45, 27, 1.15));

/**
 * Output
 *
 * 60
 * 82.8
 */
```

## Importing Libraries

In the local import example above an `add` and `multiply` method are imported
from a locally stored arithmetic module. The same functionality can be created
by importing `add` and `multiply` methods from a remotely hosted library too.

Deno can import libraries from multiple sources:

- `deno:` is code originally written for Deno or browsers, usually in TypeScript
- `npm:` is existing code written for Node or browsers
- `https:` is code hosted on any web server (gist, unpkg.com, etc.)

`deno:` modules are written for Deno and will work out of the box. These modules
are hosted on https://deno.land/x. This is the recommended way to share code in
Deno.

`npm:` specifiers allow importing code written originally for Node from the
[npm](https://npmjs.org) registry. Generally this code will work out of the
box - if it doesn't, please
[open an issue](https://github.com/denoland/deno/issues/new).

`https:` specifiers allow importing code just like in the browser. This is
useful to share one off scripts - for example, in a GitHub gist.

```ts
import { serve } from "deno:std@0.173.0/http/server.ts";

import chalk from "npm:chalk@^5";

import { add } from "https://gist.githubusercontent.com/ry/6f05bb1c5ee248841de5cbc6a2294e9a/raw/f653cb2ca8bc9719f09db2a34a368ed50ebdef76/add.ts";
```

Both `deno:` and `npm:` specifiers can include a version constraint. When Deno
encounters these constraints, it will resolve each package to the latest version
that satisfies all constraints.

The syntax for `deno:` and `npm:` specifiers is:

```
deno:<package>[@<version>][/<path>]
npm:<package>[@<version>][/<path>]
```

In this example, is_odd module from deno.land/x is referenced:

**Command:** `deno run ./foo.ts`

```ts
// foo.ts
import { isOdd } from "deno:is_odd";

console.log(isOdd(19)); // true
console.log(isOdd(42)); // false
```

## Export

In the local import example above the `add` and `multiply` functions are
imported from a locally stored arithmetic module. To make this possible the
functions stored in the arithmetic module must be exported.

To do this just add the keyword `export` to the beginning of the function
signature as is shown below.

```ts
export function add(a: number, b: number): number {
  return a + b;
}

export function multiply(a: number, b: number): number {
  return a * b;
}
```

All functions, classes, constants and variables which need to be accessible
inside external modules must be exported. Either by prepending them with the
`export` keyword or including them in an export statement at the bottom of the
file.

## Managing dependencies

Deno supports the [import map]() standard for mapping bare specifiers (like
`"oak"`) to fully resolved specifiers (like `"deno:oak@11"`). This allows one to
manage dependencies and their versions centrally.

In Deno, the `deno.json` config file also can be an import map.

```json
// deno.json
{
  "imports": {
    "chalk": "npm:chalk@^1.0",
    "cowsay": "npm:chalk@^1.0",
    "dax": "deno:dax@~0.23/mod.ts"
  }
}
```

```ts
// main.ts
import chalk from "chalk";
import cowsay from "cowsay";
import $ from "dax";

const data = await $`echo hello`.text();
const message = cowsay.getMessage(data);

console.log(chalk.green(message));
```

For managing dependencies using an import map in libraries, see the
[_Advanced: Publishing Modules_ section](../advanced/publishing_modules).

## FAQ

### How do I import a specific version of a module?

For `deno:` and `npm:` modules, you can specify the version in the specifier:

```ts
import { serve } from "deno:std@0.173/http/server.ts";

import chalk from "npm:chalk@^5";
```

If you use `http` specifiers, you specify the version in the URL. For example,
this URL fully specifies the code being run:
`https://unpkg.com/liltest@0.0.5/dist/liltest.js`.
