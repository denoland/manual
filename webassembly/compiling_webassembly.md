## Deno and WebAssembly

In general there are two scenarios where you'd want to consider utilizing a WebAssembly module:

- Server-side, to perform some computationally intensive task
- Client-side, to run for example a game or some other service requiring a lot of horsepower

In the second scenario the size of the WebAssembly binaries becomes quite important, because every byte has to be served over a network and modern applications like to serve their content fast. For these cases you can look into performing optimizations that reduce the size of WebAssembly binaries, such as compression. You can find a good guide on optimizing builds for size [here](https://rustwasm.github.io/docs/book/reference/code-size.html).

## Non-Streaming Compilation

```typescript

```

## Streaming Compilation

```typescript

```
