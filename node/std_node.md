## The `std/node` library

> ⚠️ Starting with v1.15 Deno provides a compatibility mode, that allows to
> emulate Node environment and consume code authored for Node directly. See
> [Node compatibility mode](./compatibility_mode.md) chapter for details.

The `std/node` part of the Deno standard library is a Node compatibility layer.
Its primary focus is providing "polyfills" for Node's
[built-in modules](https://github.com/denoland/deno_std/tree/main/node#supported-builtins).
It also provides a mechanism for loading CommonJS modules into Deno.

The library is most useful when trying to use your own or private code that was
written for Node. If you are trying to consume public npm packages, you are
likely to get a better result using a [CDN](./cdns.md).

### Node built-in modules

The standard library provides several "replacement" modules for Node built-in
modules. These either replicate the functionality of the built-in or they call
the Deno native APIs, returning an interface that is compatible with Node.

The standard library provides modules for the following built-ins:

- [`assert`](https://doc.deno.land/https://deno.land/std/node/assert.ts)
  (_partly_)
- [`assert/strict`](https://doc.deno.land/https://deno.land/std/node/assert/strict.ts)
  (_partly_)
- [`buffer`](https://doc.deno.land/https://deno.land/std/node/buffer.ts)
- [`console`](https://doc.deno.land/https://deno.land/std/node/console.ts)
  (_partly_)
- [`constants`](https://doc.deno.land/https://deno.land/std/node/constants.ts)
- [`crypto`](https://doc.deno.land/https://deno.land/std/node/crypto.ts)
  (_partly_)
- [`child_process`](https://doc.deno.land/https://deno.land/std/node/child_process.ts)
  (_partly_)
- [`dns`](https://doc.deno.land/https://deno.land/std/node/dns.ts) (_partly_)
- [`events`](https://doc.deno.land/https://deno.land/std/node/events.ts)
- [`fs`](https://doc.deno.land/https://deno.land/std/node/fs.ts) (_partly_)
- [`fs/promises`](https://doc.deno.land/https://deno.land/std/node/fs/promises.ts)
  (_partly_)
- [`http`](https://doc.deno.land/https://deno.land/std/node/http.ts) (_partly_)
- [`module`](https://doc.deno.land/https://deno.land/std/node/module.ts)
- [`net`](https://doc.deno.land/https://deno.land/std/node/net.ts) (_partly_)
- [`os`](https://doc.deno.land/https://deno.land/std/node/os.ts) (_partly_)
- [`path`](https://doc.deno.land/https://deno.land/std/node/path.ts)
- [`perf_hooks`](https://doc.deno.land/https://deno.land/std/node/perf_hooks.ts)
  (_partly_)
- [`process`](https://doc.deno.land/https://deno.land/std/node/process.ts)
  (_partly_)
- [`querystring`](https://doc.deno.land/https://deno.land/std/node/querystring.ts)
- [`readline`](https://doc.deno.land/https://deno.land/std/node/readline.ts)
  (_partly_)
- [`stream`](https://doc.deno.land/https://deno.land/std/node/stream.ts)
- [`string_decoder`](https://doc.deno.land/https://deno.land/std/node/string_decoder.ts)
- [`sys`](https://doc.deno.land/https://deno.land/std/node/sys.ts) (_partly_)
- [`timers`](https://doc.deno.land/https://deno.land/std/node/timers.ts)
- [`timers/promises`](https://doc.deno.land/https://deno.land/std/node/timers/promises.ts)
- [`tty`](https://doc.deno.land/https://deno.land/std/node/tty.ts) (_partly_)
- [`url`](https://doc.deno.land/https://deno.land/std/node/url.ts) (_partly_)
- [`util`](https://doc.deno.land/https://deno.land/std/node/util.ts) (_partly_)
- [`worker_threads`](https://doc.deno.land/https://deno.land/std/node/worker_threads.ts)

Following modules are not yet implemented:

- `cluster`
- `dgram`
- `http2`
- `https`
- `repl`
- `tls`
- `vm`
- `zlib`

If you try to run a Node code that requires any of the not implemented modules,
please open an issue in https://github.com/denoland/deno_std/issues with example
code.

In addition, there is the
[`std/node/global.ts`](https://doc.deno.land/https://deno.land/std/node/global.ts)
module which provides some of the Node globals like `global`, `process`, and
`Buffer`.

If you want documentation for any of the modules, you can simply type `deno doc`
and the URL of the module in your terminal:

```
> deno doc https://deno.land/std/fs/move.ts
```

### Loading CommonJS modules

Deno only supports natively loading ES Modules, but a lot of Node code is still
written in the CommonJS format. As mentioned above, for public npm packages, it
is often better to use a CDN to transpile CommonJS modules to ES Modules for
consumption by Deno. Not only do you get reliable conversion plus all the
dependency resolution and management without requiring a package manager to
install the packages on your local machine, you get the advantages of being able
to share your code easier without requiring other users to setup some of the
Node infrastructure to consume your code with Node.

That being said, the built-in Node module `"module"` provides a function named
`createRequire()` which allows you to create a Node compatible `require()`
function which can be used to load CommonJS modules, as well as use the same
resolution logic that Node uses when trying to load a module. `createRequire()`
will also install the Node globals for you.

Example usage would look like this:

```ts, ignore
import { createRequire } from "https://deno.land/std@$STD_VERSION/node/module.ts";

// import.meta.url will be the location of "this" module (like `__filename` in
// Node), and then serve as the root for your "package", where the
// `package.json` is expected to be, and where the `node_modules` will be used
// for resolution of packages.
const require = createRequire(import.meta.url);

// Loads the built-in module Deno "replacement":
const path = require("path");

// Loads a CommonJS module (without specifying the extension):
const cjsModule = require("./my_mod");

// Uses Node resolution in `node_modules` to load the package/module. The
// package would need to be installed locally via a package management tool
// like npm:
const leftPad = require("left-pad");
```

When modules are loaded via the created `require()`, they are executed in a
context which is similar to a Node context, which means that a lot of code
written targeting Node will work.
