### Running WebAssembly with Non-Numeric Types

In the code samples on the previous pages only numeric types were used in the
WebAssembly modules. To run WebAssembly with more complex types (strings,
classes) you will want to use tools that can generate type bindings between
JavaScript and the language used to compile to WebAssembly. Generally speaking,
such tools create some 'glue' code that enable you to use the WebAssembly from
JavaScript. This glue code can be imported into a Deno program just like any
other ES Module using an `import` statement.

An example on how to create type bindings between JavaScript and Rust, compiling
it into a binary and calling it from a JavaScript program can be found on
[MDN](https://developer.mozilla.org/en-US/docs/WebAssembly/Rust_to_wasm).
