## Supported modules

// TODO: verify all links are correct

- ✅ [assert](https://nodejs.org/api/assert.html)

- ℹ️ [assert/strict](https://nodejs.org/api/assert.html)

- ℹ️ [async_hooks](https://nodejs.org/api/async_hooks.html)

`AsyncLocalStorage` is supported. `AsyncResource`, `executionAsyncId`, and
`createHook` are stubs that do nothing. // TODO: add an issue link if users need
this API

- ✅ [buffer](https://nodejs.org/api/buffer.html)

Fully polyfilled

- ℹ️ [child_process](https://nodejs.org/api/child_process.html)

- ℹ️ [cluster](https://nodejs.org/api/cluster.html)

- ℹ️ [console](https://nodejs.org/api/console.html)

- ✅ [constants](https://nodejs.org/api/constants.html)

Fully polyfilled

- ℹ️ [crypto](https://nodejs.org/api/crypto.html)

- ℹ️ [dgram](https://nodejs.org/api/dgram.html)

- ✅ [diagnostics_channel](https://nodejs.org/api/diagnostics_channel.html)

- ℹ️ [dns](https://nodejs.org/api/dns.html)

- ✅ [events](https://nodejs.org/api/events.html)

- ℹ️ [fs](https://nodejs.org/api/fs.html)

- ℹ️ [fs/promises](https://nodejs.org/api/fs.html)

- ✅ / ℹ️ [http](https://nodejs.org/api/http.html)

`createConnection` option is currently not supported. // TODO: add an issue link
if users need this API

- ℹ️ [http2](https://nodejs.org/api/http2.html)

Partially polyfilled, major work in progress to enable `grpc-js`.

- ℹ️ [https](https://nodejs.org/api/https.html) // TODO: add an issue link if
  users need this API

- ℹ️ [inspector](https://nodejs.org/api/inspector.html)

`console` is supported.

Other APIs are stubs and will throw an error. Due to security implications the
Deno team does not plan to polyfill these APIs. // TODO: add an issue link if
users need this API

- ✅ [module](https://nodejs.org/api/module.html)

Fully polyfilled

- ✅ [net](https://nodejs.org/api/net.html)

- ✅ [os](https://nodejs.org/api/os.html)

Fully polyfilled

- ✅ [path](https://nodejs.org/api/path.html)

Fully polyfilled

- ✅ [path/posix](https://nodejs.org/api/path.html)

Fully polyfilled

- ✅ [path/win32](https://nodejs.org/api/path.html)

Fully polyfilled

- ✅ [perf_hooks](https://nodejs.org/api/perf_hooks.html)

Fully polyfilled

- ✅ / ℹ️ [process](https://nodejs.org/api/process.html)

// TODO: Some APIs are stubs, check which...

- ✅ [punycode](https://nodejs.org/api/punycode.html)

Fully polyfilled

- ✅ [querystring](https://nodejs.org/api/querystring.html)

Fully polyfilled

- ✅ [readline](https://nodejs.org/api/readline.html)

Fully polyfilled

- ℹ️ [repl](https://nodejs.org/api/repl.html)

`builtinModules` and `_builtinLibs` are supported.

Other APIs are stubs and will throw an error. // TODO: add an issue link if
users need this API

- ✅ [stream](https://nodejs.org/api/stream.html)

- ✅ [stream/promises](https://nodejs.org/api/stream.html)

- ℹ️ [stream/web](https://nodejs.org/api/stream.html)

- ✅ [string_decoder](https://nodejs.org/api/string_decoder.html)

- ✅ [sys](https://nodejs.org/api/sys.html)

- ✅ [timers](https://nodejs.org/api/timers.html)

Fully polyfilled

- ✅ [timers/promises](https://nodejs.org/api/timers.html)

Fully polyfilled

- ❌ [tls](https://nodejs.org/api/tls.html)

- ❌ [trace_events](https://nodejs.org/api/trace_events.html)

- ℹ️ [tty](https://nodejs.org/api/tty.html)

- ✅ [url](https://nodejs.org/api/url.html)

Fully polyfilled

- ℹ️ [util](https://nodejs.org/api/util.html)

- ℹ️ [util/types](https://nodejs.org/api/util.html)

- ℹ️ [v8](https://nodejs.org/api/v8.html)

`cachedDataVersionTag` and `getHeapStatistics` are supported.

`setFlagsFromStrings` is a noop.

Other APIs are not polyfilled and will throw and error. The other APIs _could_
be polyfilled, but due inherent lack of format stability between the V8
versions, the Deno team is considering requiring a special flag to use them. //
TODO: add an issue link if users need this API

- ℹ️ [vm](https://nodejs.org/api/vm.html)

`runInThisContext` is supported.

Other APIs are not polyfilled and will throw and error. // TODO: add an issue
link if users need this API

- ✅ [wasi](https://nodejs.org/api/wasi.html)

- ❌ [webcrypto](https://nodejs.org/api/webcrypto.html)

- ✅ / ℹ️ [worker_threads](https://nodejs.org/api/worker_threads.html)

- ✅ [zlib](https://nodejs.org/api/zlib.html)

Fully polyfilled
