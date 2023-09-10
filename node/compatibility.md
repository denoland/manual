# Supported modules

// TODO: verify all links are correct

### [`node:assert`](https://nodejs.org/api/assert.html)

✅

### [`node:assert/strict`](https://nodejs.org/api/assert.html)

ℹ️ Partially polyfilled

### [`node:async_hooks`](https://nodejs.org/api/async_hooks.html)

ℹ️ Partially polyfilled

`AsyncLocalStorage` is supported. `AsyncResource`, `executionAsyncId`, and
`createHook` are stubs that do nothing. // TODO: add an issue link if users need
this API

### [`node:buffer`](https://nodejs.org/api/buffer.html)

✅ Fully polyfilled

### [`node:child_process`](https://nodejs.org/api/child_process.html)

ℹ️ Partially polyfilled

### [`node:cluster`](https://nodejs.org/api/cluster.html)

ℹ️ Partially polyfilled

### [`node:console`](https://nodejs.org/api/console.html)

ℹ️ Partially polyfilled

### [`node:constants`](https://nodejs.org/api/constants.html)

✅ Fully polyfilled

### [`node:crypto`](https://nodejs.org/api/crypto.html)

ℹ️ Partially polyfilled

### [`node:dgram`](https://nodejs.org/api/dgram.html)

ℹ️ Partially polyfilled

### [`node:diagnostics_channel`](https://nodejs.org/api/diagnostics_channel.html)

✅

### [`node:dns`](https://nodejs.org/api/dns.html)

ℹ️ Partially polyfilled

### [`node:events`](https://nodejs.org/api/events.html)

✅

### [`node:fs`](https://nodejs.org/api/fs.html)

ℹ️ Partially polyfilled

### [`node:fs/promises`](https://nodejs.org/api/fs.html)

ℹ️ Partially polyfilled

### ✅ / ℹ️ [`node:http`](https://nodejs.org/api/http.html)

`createConnection` option is currently not supported. // TODO: add an issue link
if users need this API

### [`node:http2`](https://nodejs.org/api/http2.html)

ℹ️ Partially polyfilled

Partially polyfilled, major work in progress to enable `grpc-js`.

### [`node:https`](https://nodejs.org/api/https.html) // TODO: add an issue link if

ℹ️ users need this API

### [`node:inspector`](https://nodejs.org/api/inspector.html)

ℹ️ Partially polyfilled

`console` is supported.

Other APIs are stubs and will throw an error. Due to security implications the
Deno team does not plan to polyfill these APIs. // TODO: add an issue link if
users need this API

### [`node:module`](https://nodejs.org/api/module.html)

✅ Fully polyfilled

### [`node:net`](https://nodejs.org/api/net.html)

✅

### [`node:os`](https://nodejs.org/api/os.html)

✅ Fully polyfilled

### [`node:path`](https://nodejs.org/api/path.html)

✅ Fully polyfilled

### [`node:path/posix`](https://nodejs.org/api/path.html)

✅ Fully polyfilled

### [`node:path/win32`](https://nodejs.org/api/path.html)

✅ Fully polyfilled

### [`node:perf_hooks`](https://nodejs.org/api/perf_hooks.html)

✅ Fully polyfilled

### ✅ / ℹ️ [`node:process`](https://nodejs.org/api/process.html)

// TODO: Some APIs are stubs, check which...

### [`node:punycode`](https://nodejs.org/api/punycode.html)

✅ Fully polyfilled

### [`node:querystring`](https://nodejs.org/api/querystring.html)

✅ Fully polyfilled

### [`node:readline`](https://nodejs.org/api/readline.html)

✅ Fully polyfilled

### [`node:repl`](https://nodejs.org/api/repl.html)

ℹ️ Partially polyfilled

`builtinModules` and `_builtinLibs` are supported.

Other APIs are stubs and will throw an error. // TODO: add an issue link if
users need this API

### [`node:stream`](https://nodejs.org/api/stream.html)

✅

### [`node:stream/promises`](https://nodejs.org/api/stream.html)

✅

### [`node:stream/web`](https://nodejs.org/api/stream.html)

ℹ️ Partially polyfilled

### [`node:string_decoder`](https://nodejs.org/api/string_decoder.html)

✅

### [`node:sys`](https://nodejs.org/api/sys.html)

✅

### [`node:timers`](https://nodejs.org/api/timers.html)

✅ Fully polyfilled

### [`node:timers/promises`](https://nodejs.org/api/timers.html)

✅ Fully polyfilled

### [`node:tls`](https://nodejs.org/api/tls.html)

❌

### [`node:trace_events`](https://nodejs.org/api/trace_events.html)

❌

### [`node:tty`](https://nodejs.org/api/tty.html)

ℹ️ Partially polyfilled

### [`node:url`](https://nodejs.org/api/url.html)

✅ Fully polyfilled

### [`node:util`](https://nodejs.org/api/util.html)

ℹ️ Partially polyfilled

### [`node:util/types`](https://nodejs.org/api/util.html)

ℹ️ Partially polyfilled

### [`node:v8`](https://nodejs.org/api/v8.html)

ℹ️ Partially polyfilled

`cachedDataVersionTag` and `getHeapStatistics` are supported.

`setFlagsFromStrings` is a noop.

Other APIs are not polyfilled and will throw and error. The other APIs _could_
be polyfilled, but due inherent lack of format stability between the V8
versions, the Deno team is considering requiring a special flag to use them. //
TODO: add an issue link if users need this API

### [`node:vm`](https://nodejs.org/api/vm.html)

ℹ️ Partially polyfilled

`runInThisContext` is supported.

Other APIs are not polyfilled and will throw and error. // TODO: add an issue
link if users need this API

### [`node:wasi`](https://nodejs.org/api/wasi.html)

✅

### [`node:webcrypto`](https://nodejs.org/api/webcrypto.html)

❌

### ✅ / ℹ️ [`node:worker_threads`](https://nodejs.org/api/worker_threads.html)

### [`node:zlib`](https://nodejs.org/api/zlib.html)

✅ Fully polyfilled
