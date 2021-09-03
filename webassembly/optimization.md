### Optimizing WebAssembly

For production builds it is a good idea to perform optimizations on WebAssembly
binaries. If you're mainly serving binaries to clients then optimizing for size
can make a real difference, whereas if you're mainly executing WebAssembly on a
server to perform computationally intensive tasks, optimizing for speed can be
beneficial. You can find a good guide on optimizing (production) builds
[here](https://rustwasm.github.io/docs/book/reference/code-size.html). In
addition, the
[rust-wasm group](https://rustwasm.github.io/docs/book/reference/tools.html) has
a list of tools that can be used to optimize and manipulate WebAssembly
binaries.
