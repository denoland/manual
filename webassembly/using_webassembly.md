## Using WebAssembly in Deno

At its simplest, all you need to run WebAssembly in Deno are some bytes. The following binary exports a `main` function that just returns `42` upon invocation:

<!-- deno-fmt-ignore -->
```ts
const wasmCode = new Uint8Array([
  0, 97, 115, 109, 1, 0, 0, 0, 1, 133, 128, 128, 128, 0, 1, 96, 0, 1, 127,
  3, 130, 128, 128, 128, 0, 1, 0, 4, 132, 128, 128, 128, 0, 1, 112, 0, 0,
  5, 131, 128, 128, 128, 0, 1, 0, 1, 6, 129, 128, 128, 128, 0, 0, 7, 145,
  128, 128, 128, 0, 2, 6, 109, 101, 109, 111, 114, 121, 2, 0, 4, 109, 97,
  105, 110, 0, 0, 10, 138, 128, 128, 128, 0, 1, 132, 128, 128, 128, 0, 0,
  65, 42, 11
]);

const wasmModule = new WebAssembly.Module(wasmCode);

const wasmInstance = new WebAssembly.Instance(wasmModule);

const main = wasmInstance.exports.main as CallableFunction
console.log(main().toString());
```

However, for more complex scenarios you will probably want to write in a programming language that compiles down to WebAssembly. A number of languages exist that can do this, such as [Rust](https://www.rust-lang.org/), [Go](https://golang.org/) or [AssemblyScript](https://www.assemblyscript.org/). For example, a Rust program that compiles to the aforementioned bytes would look something like this (the return type `i32` stands for an `i`nteger using `32` bits of memory):

```rust
pub fn main() -> i32 {
  42
}
```

The code above uses only numeric types and is simple enough that it can just work in JavaScript, but in order to run more sophisticated modules using more complex types (strings, classes) you will need tools to generate type bindings between JavaScript and whatever language is used to compile to WebAssembly. An example on how to achieve this with JavaScript and Rust can be found on [MDN](https://developer.mozilla.org/en-US/docs/WebAssembly/Rust_to_wasm), covering the basics of generating type bindings, compiling the code into a binary and calling WebAssembly from a JavaScript program.

### Loading and Running a WebAssembly Module

The following steps need to be performed before a WebAssembly file can be run in a JavaScript program:

1. Fetching the bytecode
2. Compiling the bytecode into a `WebAssembly.Module` object
3. Instantiating the WebAssembly module

The [most efficient](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/instantiateStreaming) way to achieve the above is to use the streaming variants of the WebAssembly compilation and instantiation methods. For example, you can use `instantiateStreaming` to perform all three steps in a single call:

```ts
const { instance, module } = await WebAssembly.instantiateStreaming(
  fetch("https://wpt.live/wasm/incrementer.wasm"),
);

const increment = instance.exports.increment as (input: number) => number;
console.log(increment(41));
```

Note that the `.wasm` file must be served with the `application/wasm` MIME type. If you want to do additional work on the module before instantiation you can instead use `compileStreaming`:

```ts
WebAssembly.compileStreaming(fetch("https://wpt.live/wasm/incrementer.wasm"))
    .then(module =>  {
        /* do some more stuff */
        return WebAssembly.instantiate(module));
    })
    .then(instance => {
        instance.exports.increment as (input: number) => number;
    })
```

If for some reason you cannot make use of the streaming methods you can fall back to the (somewhat less efficient) `compile` and `instantiate` methods. See for example the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/instantiate). For a more in-depth look on what makes the streaming methods more performant, see for example [this post](https://hacks.mozilla.org/2018/01/making-webassembly-even-faster-firefoxs-new-streaming-and-tiering-compiler/).
