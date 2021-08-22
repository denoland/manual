## Running a WebAssembly module in Deno

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

However, for real-world scenarios you will probably want to write in a programming language that compiles down to WebAssembly. A number of languages exist that can do this. For example, a Rust program that compiles to the aforementioned bytes would look something like:

```rust
pub fn main() -> i32 {
  return 42;
}
```

Where the function return type `i32` stands for an `i`nteger using `32` bits of memory.

The module above uses only numeric types and is simple enough that it just works in Deno, but in order to run more sophisticated modules using more complex types (strings, classes) you would need some tools that generate type bindings between JavaScript and the language that is used to compile to WebAssembly, which is discussed on the next page.
