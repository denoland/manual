# Crates Overview

This is an overview of `Deno`'s crates and what functionalities they provide.

## Core

### [`deno`](https://crates.io/crates/deno)

The real deal.

has All the user facing features of deno including typescript compilation and
dependancy managment in a binary package.

### [`deno_runtime`](https://crates.io/crates/deno_runtime)

The whole deno runtime packaged into an easy to use abstraction with all
features intact aside from certain ones like for example **Dependancy
managment**.

### [`deno_core`](https://crates.io/crates/deno_core)

Provides an easy abstraction over V8 to run Javascript code and to register
additional rust based deno operators.

It does not implement anything either than that and you have to register
external deno operators to do anything useful.

Note: _does not provide typescript compilation_.

## Features

### [`deno_ffi`](https://crates.io/crates/deno_ffi)

**you are playing with fire.**

Implements FFI operators for deno to be able to work with external low level
libraries within Javascript.

### [`deno_typescript`](https://crates.io/crates/deno_typescript)

Implements all of deno's typescript compilation and an operator for fetching
assets.

### [`deno_node`](https://crates.io/crates/deno_node).

Implements NodeJS compatibility operators, not needed if code is pure Deno.

### [`deno_flash`](https://crates.io/crates/deno_flash)

Deno's fast HTTP server for use in Javascript code.

## Utilities

### [`deno_ops`](https://crates.io/crates/deno_ops)

Has an easy to use macro for creating deno operators and is the defacto
'standard' for implementing features usable from Javascript into `Deno`.

Also has some automatic optimisations for certain scenarios.

### [`deno_tls`](https://crates.io/crates/deno_tls)

Utilities for doing TLS for other `deno` operator crates.

Does nothing on its own.

Required for:

- `deno_fetch`
- `deno_websocket`
- `deno_net`
- `deno_runtime`

### [`deno_ast`](https://crates.io/crates/deno_ast)

Implements deno's source code parsing and AST generation.

## CLI

### [`deno_doc`](https://crates.io/crates/deno_doc)

Implements Javascript and Typescript documentation generation for Deno's `doc`
command.

### [`deno_emit`](https://crates.io/crates/deno_emit)

Implements Module Transpilation and Event emmiting for deno's dependancy
managment.

### [`deno_lint`](https://crates.io/crates/deno_lint)

Implement's Deno's Automatic Linting for the `lint` command.

### [`deno_task_shell`](https://crates.io/crates/deno_task_shell)

Implement's Deno's Cross-Platform Shell Scripting Execution Enviorment for
tasks.

## Browser APIs

### [`deno_web`](https://crates.io/crates/deno_web)

> Collection of Web APIs

Implements operators for

- Events
- Text Encoding
- Text Decoding
- [File Standard](https://w3c.github.io/FileAPI/)

### [`deno_webidl`](https://crates.io/crates/deno_webidl)

Implements the [Web IDL Standard](https://webidl.spec.whatwg.org/)

### [`deno_url`](https://crates.io/crates/deno_url)

Implements operators for

- [URL Standard](https://url.spec.whatwg.org/)
- [URLPattern Standard](https://wicg.github.io/urlpattern/)

### [`deno_fetch`](https://crates.io/crates/deno_fetch)

Implements the `fetch` operator according to the
[Fetch Standard](https://fetch.spec.whatwg.org/)

### [`deno_crypto`](https://crates.io/crates/deno_crypto)

Implements operators cryptography according to the
[Web Cryptography API Specification](https://www.w3.org/TR/WebCryptoAPI/)

### [`deno_console`](https://crates.io/crates/deno_console)

Implements operators for the
[Console Specification](https://console.spec.whatwg.org/)

### [`deno_websocket`](https://crates.io/crates/deno_websocket)

Implements operators for using and creating websockets according to the
[Websockets Standard](https://html.spec.whatwg.org/multipage/web-sockets.html)

### [`deno_http`](https://crates.io/crates/deno_http)

Implements Server Side HTTP based on the primitives from the
[Fetch Specification](https://fetch.spec.whatwg.org/)

### [`deno_net`](https://crates.io/crates/deno_net)

Implements networking operators and is required for

- `deno_web`
- `deno_fetch`

### [`deno_webgpu`](https://crates.io/crates/deno_webgpu)

**This crate is implementing an unstable proposal and such is subject to
constant breaking changes.**

Implements operators for the
[WebGPU Specification](https://gpuweb.github.io/gpuweb/)

### [`deno_webstorage`](https://crates.io/crates/deno_webstorage)

implements operators for the
[WebStorage Specification](https://html.spec.whatwg.org/multipage/webstorage.html)

### [`deno_timers`](https://crates.io/crates/deno_timers)

Implements timer operators according to the
[Timers Specification](https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers)

### [`deno_cache`](https://crates.io/crates/deno_cache)

**does not support query options**

Implements operators for the
[Cache Interface Specification](https://w3c.github.io/ServiceWorker/#cache-interface)

### [`deno_bench_util`](https://crates.io/crates/deno_bench_util)

Implements utilites for benchmarking deno operators, useful for making sure your
custom operators are **Blazingly Fast**.

### [`deno_napi`](https://crates.io/crates/deno_napi)

[Node Addons API](https://nodejs.org/api/n-api.html#node-api) implementation for
deno.

### [`deno_file`](https://crates.io/crates/deno_file)

Implements operators for the
[File API Specification](https://w3c.github.io/FileAPI/)

### [`deno_broadcast_channel`](https://crates.io/crates/deno_broadcast_channel)

Implements operators for the
[Web Messaging Standard](https://html.spec.whatwg.org/multipage/web-messaging.html)

_aka BroadcastChannel_
