## Loading and Compiling WebAssembly

Loading WebAssembly generally consists of the following steps:

1. Fetching the binary code
2. Compiling the binary into a `WebAssembly.Module` object
3. Instantiating the WebAssembly module

It is recommended to use the streaming compilation and instantiation methods as they are the [most efficient](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/instantiateStreaming) way to achieve the above.

```ts
const { instance, module } = await WebAssembly.instantiateStreaming(
  fetch("https://wpt.live/wasm/incrementer.wasm"),
);

const increment = instance.exports.increment as (input: number) => number;
console.log(increment(41));
```

Note that the `.wasm` file must be served with the `application/wasm` MIME type. If you need to do some additional work on the binary before instantiation you can use `compileStreaming`:

```ts
WebAssembly.compileStreaming(fetch("https://wpt.live/wasm/incrementer.wasm"))
    .then(module =>  {
        /* do some more stuff */
        WebAssembly.instantiate(module));
    })
    .then(instance => {
        instance.exports.increment as (input: number) => number;
    })
```

If for some reason you cannot make use of the streaming methods you can fall back to the (somewhat less efficient) `compile` and `instantiate` methods. See for example the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/instantiate). For a more in-depth look on the streaming methods, see for example [this post](https://hacks.mozilla.org/2018/01/making-webassembly-even-faster-firefoxs-new-streaming-and-tiering-compiler/).
