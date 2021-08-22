## Tooling

To create a WebAssembly module for Deno (and in general) a few additional tools are required. These are:

1. A language that compiles to Webassembly
2. A utility that generates type bindings between JavaScript/TypeScript and the language used for the compilation.

Languages that are commonly used to compile to WebAssembly include [Rust](https://www.rust-lang.org/) and [Go](https://golang.org/), or [AssemblyScript](https://www.assemblyscript.org/) if you'd prefer something that is closer to the style and syntax of TypeScript.

A good example of creating a "Hello World" WebAssembly module with Rust can be found on for example [MDN](https://developer.mozilla.org/en-US/docs/WebAssembly/Rust_to_wasm). It covers the basics of generating type bindings, compiling the code into a binary and calling it from a JavaScript program.
