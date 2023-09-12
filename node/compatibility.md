# Supported modules

This is a list of Node APIs that Deno polyfills. If you run into an issue with an API listed here or with a package, please [open an issue](https://github.com/denoland/deno).

## Built-in modules

### [`node:assert`](https://nodejs.org/api/assert.html)

✅ Fully polyfilled

### [`node:assert/strict`](https://nodejs.org/api/assert.html)

✅ Fully polyfilled

### [`node:async_hooks`](https://nodejs.org/api/async_hooks.html)

ℹ️ Partially polyfilled

`AsyncLocalStorage` is supported. `AsyncResource`, `executionAsyncId`, and
`createHook` are stubs that do nothing.

### [`node:buffer`](https://nodejs.org/api/buffer.html)

✅ Fully polyfilled

### [`node:child_process`](https://nodejs.org/api/child_process.html)

ℹ️ Partially polyfilled

The `ipc` and `overlapped` stdio option are missing. Passing file descriptors by an integer value is missing.

### [`node:cluster`](https://nodejs.org/api/cluster.html)

❌ Missing

All exports are stubs that do nothing.

### [`node:console`](https://nodejs.org/api/console.html)

✅ Fully polyfilled

### [`node:crypto`](https://nodejs.org/api/crypto.html)

ℹ️ Partially polyfilled

Missing `Certificate` class, `crypto.Cipheriv.prototype.setAutoPadding`, `crypto.Decipheriv.prototype.setAutoPaddin`, `crypto.getCipherInfo`, `crypto.publicDecrypt`, `crypto.ECDH.prototype.convertKey`, `crypto.diffieHellman`, `x448` option for `generateKeyPair`, `crypto.KeyObject`, `safe`, `add` and `rem` options for `generatePrime`, `crypto.Sign.prototype.sign` and `crypto.Verify.prototype.verify` with non `BinaryLike` input, `crypto.secureHeapUsed`, `crypto.setEngine`, legacy methods of `crypto.X509Certificate`.

### [`node:dgram`](https://nodejs.org/api/dgram.html)

ℹ️ Partially polyfilled

### [`node:diagnostics_channel`](https://nodejs.org/api/diagnostics_channel.html)

✅ Fully polyfilled

### [`node:dns`](https://nodejs.org/api/dns.html)

ℹ️ Partially polyfilled

Missing `dns.resolve*` with `ttl` option

### [`node:events`](https://nodejs.org/api/events.html)

✅ Fully polyfilled

### [`node:fs`](https://nodejs.org/api/fs.html)

ℹ️ Partially polyfilled

Missing `utf16le`, `latin1` and `ucs2` encoding for `fs.writeFile` and `fs.writeFileSync`. Missing `Dirent.isBlockDevice`, `Dirent.isCharacterDevice`, `Dirent.isFIFO`, `Dirent.isSocket`, `FSWatcher.ref`, `FSWatcher.unref`.

### [`node:fs/promises`](https://nodejs.org/api/fs.html)

ℹ️ Partially polyfilled

Missing `lchmod`, `lchown`, `lutimes`.

### [`node:http`](https://nodejs.org/api/http.html)

ℹ️ Partially polyfilled

`createConnection` option is currently not supported.

### [`node:http2`](https://nodejs.org/api/http2.html)

ℹ️ Partially polyfilled

Partially polyfilled, major work in progress to enable `grpc-js`.

### [`node:https`](https://nodejs.org/api/https.html)

ℹ️ Partially polyfilled

Missing `https.Server.opts.cert` and `https.Server.opts.key` array type

### [`node:inspector`](https://nodejs.org/api/inspector.html)

ℹ️ Partially polyfilled

`console` is supported.

Other APIs are stubs and will throw an error. Due to security implications the
Deno team does not plan to polyfill these APIs.

### [`node:module`](https://nodejs.org/api/module.html)

✅ Fully polyfilled

### [`node:net`](https://nodejs.org/api/net.html)

ℹ️ Partially polyfilled

Missing `net.Socket.prototype.constructor` with `fd` option

### [`node:os`](https://nodejs.org/api/os.html)

✅ Fully polyfilled

### [`node:path`](https://nodejs.org/api/path.html)

✅ Fully polyfilled

### [`node:path/posix`](https://nodejs.org/api/path.html)

✅ Fully polyfilled

### [`node:path/win32`](https://nodejs.org/api/path.html)

✅ Fully polyfilled

### [`node:perf_hooks`](https://nodejs.org/api/perf_hooks.html)

ℹ️ Partially polyfilled

Missing `perf_hooks.eventLoopUtilization`, `perf_hooks.timerify`, `perf_hooks.monitorEventLoopDelay`.

### [`node:process`](https://nodejs.org/api/process.html)

ℹ️ Partially polyfilled

Missing `disconnect`, `message`, `multipleResolves`, `rejectionHandled` and `worker` events.

### [`node:punycode`](https://nodejs.org/api/punycode.html)

✅ Fully polyfilled

### [`node:querystring`](https://nodejs.org/api/querystring.html)

✅ Fully polyfilled

### [`node:readline`](https://nodejs.org/api/readline.html)

✅ Fully polyfilled

### [`node:repl`](https://nodejs.org/api/repl.html)

ℹ️ Partially polyfilled

`builtinModules` and `_builtinLibs` are supported.

Missing `REPLServer.prototype.constructor` and `start()`.

### [`node:stream`](https://nodejs.org/api/stream.html)

✅ Fully polyfilled

### [`node:stream/promises`](https://nodejs.org/api/stream.html)

✅ Fully polyfilled

### [`node:stream/web`](https://nodejs.org/api/stream.html)

ℹ️ Partially polyfilled

### [`node:string_decoder`](https://nodejs.org/api/string_decoder.html)

ℹ️ Partially polyfilled

Missing decoding of `ascii`, `latin1` and `utf16le` decoding options

### [`node:sys`](https://nodejs.org/api/sys.html)

✅ Fully polyfilled

### [`node:timers`](https://nodejs.org/api/timers.html)

✅ Fully polyfilled

### [`node:timers/promises`](https://nodejs.org/api/timers.html)

✅ Fully polyfilled

### [`node:tls`](https://nodejs.org/api/tls.html)

ℹ️ Partially polyfilled

Missing `createSecurePair`

### [`node:trace_events`](https://nodejs.org/api/trace_events.html)

❌ Missing

### [`node:tty`](https://nodejs.org/api/tty.html)

ℹ️ Partially polyfilled

Missing `ReadStream` and `WriteStream` implementation.

### [`node:url`](https://nodejs.org/api/url.html)

✅ Fully polyfilled

### [`node:util`](https://nodejs.org/api/util.html)

✅ Fully polyfilled

### [`node:util/types`](https://nodejs.org/api/util.html)

✅ Fully polyfilled

### [`node:v8`](https://nodejs.org/api/v8.html)

ℹ️ Partially polyfilled

`cachedDataVersionTag` and `getHeapStatistics` are supported.

`setFlagsFromStrings` is a noop.

Other APIs are not polyfilled and will throw and error. The other APIs _could_
be polyfilled, but due inherent lack of format stability between the V8
versions, the Deno team is considering requiring a special flag to use them.

### [`node:vm`](https://nodejs.org/api/vm.html)

ℹ️ Partially polyfilled

`runInThisContext` is supported.

Other APIs are not polyfilled and will throw and error.

### [`node:wasi`](https://nodejs.org/api/wasi.html)

❌ Missing

### [`node:webcrypto`](https://nodejs.org/api/webcrypto.html)

❌ Missing

### [`node:worker_threads`](https://nodejs.org/api/worker_threads.html)

ℹ️ Partially polyfilled

Missing `parentPort.emit`, `parentPort.removeAllListeners`, `markAsUntransferable`, `moveMessagePortToContext`, `receiveMessageOnPort`, `Worker.prototype.getHeapSnapshot`

### [`node:zlib`](https://nodejs.org/api/zlib.html)

ℹ️ Partially polyfilled

Missing `Options.prototype.constructor`, `BrotliOptions.prototype.constructor`, `BrotliDecompress.prototype.constructor`, `ZlibBase.prototype.constructor`

## Globals

This is the list of Node globals that Deno supports.

| Global name                                                                                                      | Status |
| ---------------------------------------------------------------------------------------------------------------- | ------ |
| [`AbortController`](https://nodejs.org/api/globals.html#class-abortcontroller)                                   | ✅     |
| [`AbortSignal`](https://nodejs.org/api/globals.html#class-abortsignal)                                           | ✅     |
| [`Blob`](https://nodejs.org/api/globals.html#class-blob)                                                         | ✅     |
| [`Buffer`](https://nodejs.org/api/globals.html#class-buffer)                                                     | ✅     |
| [`ByteLengthQueuingStrategy`](https://nodejs.org/api/globals.html#class-bytelengthqueuingstrategy)               | ✅     |
| [`__dirname`](https://nodejs.org/api/globals.html#__dirname)                                                     | ✅     |
| [`__filename`](https://nodejs.org/api/globals.html#__filename)                                                   | ✅     |
| [`atob`](https://nodejs.org/api/globals.html#atobdata)                                                           | ✅     |
| [`BroadcastChannel`](https://nodejs.org/api/globals.html#broadcastchannel)                                       | ✅     |
| [`btoa`](https://nodejs.org/api/globals.html#btoadata)                                                           | ✅     |
| [`clearImmediate`](https://nodejs.org/api/globals.html#clearimmediateimmediateobject)                            | ✅     |
| [`clearInterval`](https://nodejs.org/api/globals.html#clearintervalintervalobject)                               | ✅     |
| [`clearTimeout`](https://nodejs.org/api/globals.html#cleartimeouttimeoutobject)                                  | ✅     |
| [`CompressionStream`](https://nodejs.org/api/globals.html#class-compressionstream)                               | ✅     |
| [`console`](https://nodejs.org/api/globals.html#console)                                                         | ✅     |
| [`CountQueuingStrategy`](https://nodejs.org/api/globals.html#class-countqueuingstrategy)                         | ✅     |
| [`Crypto`](https://nodejs.org/api/globals.html#crypto)                                                           | ✅     |
| [`CryptoKey`](https://nodejs.org/api/globals.html#cryptokey)                                                     | ✅     |
| [`CustomEvent`](https://nodejs.org/api/globals.html#customevent)                                                 | ✅     |
| [`CustomEvent`](https://nodejs.org/api/globals.html#customevent)                                                 | ✅     |
| [`DecompressionStream`](https://nodejs.org/api/globals.html#class-decompressionstream)                           | ✅     |
| [`Event`](https://nodejs.org/api/globals.html#event)                                                             | ✅     |
| [`EventTarget`](https://nodejs.org/api/globals.html#eventtarget)                                                 | ✅     |
| [`exports`](https://nodejs.org/api/globals.html#exports)                                                         | ✅     |
| [`fetch`](https://nodejs.org/api/globals.html#fetch)                                                             | ✅     |
| [`fetch`](https://nodejs.org/api/globals.html#fetch)                                                             | ✅     |
| [`File`](https://nodejs.org/api/globals.html#class-file)                                                         | ✅     |
| [`File`](https://nodejs.org/api/globals.html#class-file)                                                         | ✅     |
| [`FormData`](https://nodejs.org/api/globals.html#class-formdata)                                                 | ✅     |
| [`global`](https://nodejs.org/api/globals.html#global)                                                           | ✅     |
| [`Headers`](https://nodejs.org/api/globals.html#class-headers)                                                   | ✅     |
| [`MessageChannel`](https://nodejs.org/api/globals.html#messagechannel)                                           | ✅     |
| [`MessageEvent`](https://nodejs.org/api/globals.html#messageevent)                                               | ✅     |
| [`MessagePort`](https://nodejs.org/api/globals.html#messageport)                                                 | ✅     |
| [`module`](https://nodejs.org/api/globals.html#module)                                                           | ✅     |
| [`PerformanceEntry`](https://nodejs.org/api/globals.html#performanceentry)                                       | ✅     |
| [`PerformanceMark`](https://nodejs.org/api/globals.html#performancemark)                                         | ✅     |
| [`PerformanceMeasure`](https://nodejs.org/api/globals.html#performancemeasure)                                   | ✅     |
| [`PerformanceObserver`](https://nodejs.org/api/globals.html#performanceobserver)                                 | ✅     |
| [`PerformanceObserverEntryList`](https://nodejs.org/api/globals.html#performanceobserverentrylist)               | ❌     |
| [`PerformanceResourceTiming`](https://nodejs.org/api/globals.html#performanceresourcetiming)                     | ❌     |
| [`performance`](https://nodejs.org/api/globals.html#performance)                                                 | ✅     |
| [`process`](https://nodejs.org/api/globals.html#process)                                                         | ✅     |
| [`queueMicrotask`](https://nodejs.org/api/globals.html#queuemicrotaskcallback)                                   | ✅     |
| [`queueMicrotask`](https://nodejs.org/api/globals.html#queuemicrotaskcallback)                                   | ✅     |
| [`ReadableByteStreamController`](https://nodejs.org/api/globals.html#class-readablebytestreamcontroller)         | ✅     |
| [`ReadableStream`](https://nodejs.org/api/globals.html#class-readablestream)                                     | ✅     |
| [`ReadableStreamBYOBReader`](https://nodejs.org/api/globals.html#class-readablestreambyobreader)                 | ✅     |
| [`ReadableStreamBYOBRequest`](https://nodejs.org/api/globals.html#class-readablestreambyobrequest)               | ✅     |
| [`ReadableStreamDefaultController`](https://nodejs.org/api/globals.html#class-readablestreamdefaultcontroller)   | ✅     |
| [`ReadableStreamDefaultReader`](https://nodejs.org/api/globals.html#class-readablestreamdefaultreader)           | ✅     |
| [`require`](https://nodejs.org/api/globals.html#require)                                                         | ✅     |
| [`Response`](https://nodejs.org/api/globals.html#response)                                                       | ✅     |
| [`Request`](https://nodejs.org/api/globals.html#request)                                                         | ✅     |
| [`setImmediate`](https://nodejs.org/api/globals.html#setimmediatecallback-args)                                  | ✅     |
| [`setInterval`](https://nodejs.org/api/globals.html#setintervalcallback-delay-args)                              | ✅     |
| [`setTimeout`](https://nodejs.org/api/globals.html#settimeoutcallback-delay-args)                                | ✅     |
| [`structuredClone`](https://nodejs.org/api/globals.html#structuredclonevalue-options)                            | ✅     |
| [`structuredClone`](https://nodejs.org/api/globals.html#structuredclonevalue-options)                            | ✅     |
| [`SubtleCrypto`](https://nodejs.org/api/globals.html#subtlecrypto)                                               | ✅     |
| [`DOMException`](https://nodejs.org/api/globals.html#domexception)                                               | ✅     |
| [`TextDecoder`](https://nodejs.org/api/globals.html#textdecoder)                                                 | ✅     |
| [`TextDecoderStream`](https://nodejs.org/api/globals.html#class-textdecoderstream)                               | ✅     |
| [`TextEncoder`](https://nodejs.org/api/globals.html#textencoder)                                                 | ✅     |
| [`TextEncoderStream`](https://nodejs.org/api/globals.html#class-textencoderstream)                               | ✅     |
| [`TransformStream`](https://nodejs.org/api/globals.html#class-transformstream)                                   | ✅     |
| [`TransformStreamDefaultController`](https://nodejs.org/api/globals.html#class-transformstreamdefaultcontroller) | ✅     |
| [`URL`](https://nodejs.org/api/globals.html#url)                                                                 | ✅     |
| [`URLSearchParams`](https://nodejs.org/api/globals.html#urlsearchparams)                                         | ✅     |
| [`URLSearchParams`](https://nodejs.org/api/globals.html#urlsearchparams)                                         | ✅     |
| [`WebAssembly`](https://nodejs.org/api/globals.html#webassembly)                                                 | ✅     |
| [`WritableStream`](https://nodejs.org/api/globals.html#class-writablestream)                                     | ✅     |
| [`WritableStreamDefaultController`](https://nodejs.org/api/globals.html#class-writablestreamdefaultcontroller)   | ✅     |
| [`WritableStreamDefaultWriter`](https://nodejs.org/api/globals.html#class-writablestreamdefaultwriter)           | ✅     |
