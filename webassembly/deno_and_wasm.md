## Deno and WebAssembly

In general there are two scenarios where you'd want to consider utilizing a WebAssembly module:

- Server-side, to perform some computationally intensive task
- Client-side, to run for example a game or a live-translation service requiring a lot of horsepower

For the second scenario the size of the WebAssembly binaries becomes quite important, because every byte has to be server over a network, and modern applications like to serve up content fast. For these cases you can look into some optimizations that reduce the size of WebAssembly binaries, such as compression.
