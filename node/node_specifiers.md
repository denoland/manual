# Using Node.js Built-in Modules with Node Specifiers

Deno supports using Node.js built-in modules such as
[fs](https://nodejs.org/api/fs.html#file-system),
[path](https://nodejs.org/api/path.html#path),
[process](https://nodejs.org/api/process.html#process), and many more via
`node:` specifiers.

```ts, ignore
import { readFileSync } from "node:fs";

console.log(fs.readFileSync("deno.json", { encoding: "utf8" }));
```

Take note that importing via a bare specifier (ex.
`import { readFileSync } from "fs";`) is not supported. If you attempt to do so
and the bare specifier matches a Node.js built-in module not found in an import
map, Deno will provide a helpful error message asking if you meant to import
with the `node:` prefix. Additionally the LSP provides a quick fix to update to
a `node:` specifier.

If you are using code both with Deno and Node.js, the `node:` scheme will work
in both runtimes and it's recommended to update to them for your Node.js code
anyway.

## Node.js compatibility layer

Support for importing Node.js built-in modules is implemented in Deno std's
Node.js compatibility layer. Documentation on which modules are implemented or
not can be found in its repository:
https://github.com/denoland/deno_std/tree/main/node#deno-nodejs-compatibility
