## Node.js compability mode

Starting with v1.15 Deno provides Node compatiblity mode that can be activated
by passing `--compat` flag in CLI.

> ⚠️ Currently using compatiblity mode requires the `--unstable` flag, and if
> you are loading CJS modules, the `--allow-read` flag is needed too.

When using compatibility mode there are a few things happening behind the
scenes:

- Node globals are available in the global scope, so you can access `process`,
  `global`, `Buffer`, `setImmediate`, `clearImmediate`. This is done by
  executing
  [`std/node/global.ts`](https://doc.deno.land/https/deno.land/std/node/global.ts)
  on startup.

- Node built-in modules are set up on startup, eg.:
  - `import fs from "fs";`
  - `import fs from "node:fs";`
  - `const fs = require("fs");`
  - `const fs = require("node:fs");`

- Deno will support Node resolution algorithm so importing packages using "bare"
  specifiers will work. For details on how module resolution works check Node
  documentation on [CJS](https://nodejs.org/api/modules.html) and
  [ES](https://nodejs.org/api/esm.html) modules.

### Node.js built-in modules

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
- `worker_threads`

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

Currently, the compability mode does not support TypeScript.

In the upcoming releases we plan to add support for a `types` field in
`package.json`, to automatically lookup types and use them during type checking.

In the long term, we'd like to provide ability to consume TypeScript code
authored for the Node.js runtime.
