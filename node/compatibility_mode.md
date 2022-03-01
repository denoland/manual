## Node compatibility mode

Starting with v1.15 Deno provides Node compatibility mode that makes it possible
to run a subset of programs authored for Node directly in Deno. Compatibility
mode can be activated by passing `--compat` flag in CLI.

> ⚠️ Using compatibility mode currently requires the `--unstable` flag. If you
> intend to use CJS modules, the `--allow-read` flag is needed as well.

> ⚠️ Package management is currently out of scope for Node compatibility mode.
> For the time being we suggest to keep using your current solution (`npm`,
> `yarn`, `pnpm`).

### Example

[`eslint`](https://eslint.org/) is a very popular tool used by most of Node
projects. Let's run `eslint` using Deno in Node compatibility mode. Assuming
that `eslint` is already installed locally (either using `npm install eslint` or
`yarn install eslint`) we can do so like:

```sh
$ ls
.eslintrc.json
node_modules
package.json
test.js
test.ts
$ cat test.js
function foo() {}

$ cat test.ts
function bar(): any {}

$ deno run \
  --compat --unstable \
  --allow-read --allow-write=./ --allow-env \
  node_modules/eslint/bin/eslint.js test.js test.ts

/dev/test.js
  1:10  warning  'foo' is defined but never used  @typescript-eslint/no-unused-vars
  1:16  error    Unexpected empty function 'foo'  @typescript-eslint/no-empty-function

/dev/test.ts
  1:10  warning  'bar' is defined but never used           @typescript-eslint/no-unused-vars
  1:17  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  1:21  error    Unexpected empty function 'bar'           @typescript-eslint/no-empty-function

✖ 5 problems (2 errors, 3 warnings)
```

> ⚠️ Notice that ESLint is run with limited set of permissions. We only give it
> access to the read from the file system, write to current directory and access
> environmental variables. Programs run in compatility mode are subject to
> Deno's permission model.

### How does it work?

When using compatibility mode there Deno does a few things behind the scenes:

- Node globals are set up and made available in the global scope. That means
  that APIs like `process`, `global`, `Buffer`, `setImmediate` or
  `clearImmediate` are available just like in Node. This is done by executing
  [`std/node/global.ts`](https://doc.deno.land/https://deno.land/std/node/global.ts)
  on startup.

- Node built-in modules are set up and made available to import statements and
  `require()` calls. Following calls will return appropriate Node modules
  polyfilled using [`std/node`](https://deno.land/std/node/):
  - `import fs from "fs";`
  - `import os from "node:os";`
  - `const path = require("path");`
  - `const http = require("node:http");`

- Deno will support Node resolution algorithm so importing packages using "bare"
  specifiers will work. For details on how module resolution works check Node
  documentation on [CJS](https://nodejs.org/api/modules.html) and
  [ES](https://nodejs.org/api/esm.html) modules.

### Module resolution

[CommonJS resolution](https://nodejs.org/api/modules.html) is implemented as in
Node and there should be no observable differences.

[ES module resolution](https://nodejs.org/api/esm.html) is implemented on top of
Deno's regular ESM resolution, leading to a few additional properties compared
to Node:

- In addition to `file:` and `data:` URL schemes supported in Node; `http:`,
  `https:` and `blob:` URL schemes will work in the same way if you used Deno
  without compatibility mode.

- Import maps are supported in the same way if you used Deno without
  compatibility mode. When resolving "bare" specifiers Deno will first try to
  resolve them using import map (if one is provided using `--import-map` flag).
  Bare specifiers starting with `node:` prefix are extempt from this rule.

- Deno respects
  ["Conditional exports"](https://nodejs.org/api/packages.html#conditional-exports)
  field in `package.json`; in addition to conditions recognized by Node,
  `"deno"` condition can be used. This property is useful to the package authors
  who want to provide separate entrypoint optimized for use with Deno. As an
  example, imagine that your package uses `node-fetch`. By providing a
  conditional `"deno"` export, you can add an entrypoint that doesn't depend on
  `node-fetch` and instead uses built-in `fetch` API in Deno.

### Node built-in modules

Following built-in Node modules are currently supported:

- `assert` (_partly_)
- `assert/strict` (_partly_)
- `buffer`
- `console` (_partly_)
- `constants`
- `crypto` (_partly_)
- `child_process` (_partly_)
- `dns` (_partly_)
- `events`
- `fs` (_partly_)
- `fs/promises` (_partly_)
- `http` (_partly_)
- `module`
- `net` (_partly_)
- `os` (_partly_)
- `path`
- `perf_hooks` (_partly_)
- `process` (_partly_)
- `querystring`
- `readline` (_partly_)
- `stream`
- `string_decoder`
- `sys` (_partly_)
- `timers`
- `timers/promises`
- `tty` (_partly_)
- `url` (_partly_)
- `util` (_partly_)
- `worker_threads` (_partly_)

Following modules are not yet implemented:

- `cluster`
- `dgram`
- `http2`
- `https`
- `repl`
- `tls`
- `vm`
- `zlib`

If you try to run Node code that requires any of the not implemented modules,
please open an issue in https://github.com/denoland/deno_std/issues with example
code.

### TypeScript support

Currently, the compatibility mode does not support TypeScript.

In the upcoming releases we plan to add support for a `types` field in
`package.json`, to automatically lookup types and use them during type checking.

In the long term, we'd like to provide ability to consume TypeScript code
authored for the Node runtime.
