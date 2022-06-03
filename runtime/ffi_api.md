## Foreign Function Interface API

As of Deno 1.13 and later, the FFI (foreign function interface) API allows users
to call libraries written in native languages that support the C ABIs (Rust,
C/C++, C#, Zig, Nim, Kotlin, etc) using `Deno.dlopen`.

### Usage

Here's an example showing how to call a Rust function from Deno:

```rust
// add.rs
#[no_mangle]
pub extern "C" fn add(a: isize, b: isize) -> isize {
    a + b
}
```

Compile it to a C dynamic library (`libadd.so` on Linux):

```sh
rustc --crate-type cdylib add.rs
```

In C you can write it as:

```c
// add.c
int add(int a, int b) {
  return a + b;
}
```

And compile it:

```sh
// unix
cc -c -o add.o add.c
cc -shared -W -o libadd.so add.o
// Windows
cl /LD add.c /link /EXPORT:add
```

Calling the library from Deno:

```typescript
// ffi.ts

// Determine library extension based on
// your OS.
let libSuffix = "";
switch (Deno.build.os) {
  case "windows":
    libSuffix = "dll";
    break;
  case "darwin":
    libSuffix = "dylib";
    break;
  default:
    libSuffix = "so";
    break;
}

const libName = `./libadd.${libSuffix}`;
// Open library and define exported symbols
const dylib = Deno.dlopen(libName, {
  "add": { parameters: ["isize", "isize"], result: "isize" },
});

// Call the symbol `add`
const result = dylib.symbols.add(35, 34); // 69

console.log(`Result from external addition of 35 and 34: ${result}`);
```

Run with `--allow-ffi` and `--unstable` flag:

```sh
deno run --allow-ffi --unstable ffi.ts
```

### Non-blocking FFI

There are many use cases where users might want to run CPU-bound FFI functions
in the background without blocking other tasks on the main thread.

As of Deno 1.15, symbols can be marked `nonblocking` in `Deno.dlopen`. These
function calls will run on a dedicated blocking thread and will return a
`Promise` resolving to the desired `result`.

Example of executing expensive FFI calls with Deno:

```c
// sleep.c
#ifdef _WIN32
#include <Windows.h>
#else
#include <time.h>
#endif

int sleep(unsigned int ms) {
  #ifdef _WIN32
  Sleep(ms);
  #else
  struct timespec ts;
  ts.tv_sec = ms / 1000;
  ts.tv_nsec = (ms % 1000) * 1000000;
  nanosleep(&ts, NULL);
  #endif
}
```

Calling it from Deno:

```typescript
// nonblocking_ffi.ts
const library = Deno.dlopen("./sleep.so", {
  sleep: {
    parameters: ["usize"],
    result: "void",
    nonblocking: true,
  },
});

library.symbols.sleep(500).then(() => console.log("After"));
console.log("Before");
```

Result:

```sh
$ deno run --allow-ffi --unstable unblocking_ffi.ts
Before
After
```

### Supported types

Here's a list of types supported currently by the Deno FFI API.

| FFI Type     | C                        | Rust        |
| ------------ | ------------------------ | ----------- |
| `i8`         | `char` / `signed char`   | `i8`        |
| `u8`         | `unsigned char`          | `u8`        |
| `i16`        | `short int`              | `i16`       |
| `u16`        | `unsigned short int`     | `u16`       |
| `i32`        | `int` / `signed int`     | `i32`       |
| `u32`        | `unsigned int`           | `u32`       |
| `i64`        | `long long int`          | `i64`       |
| `u64`        | `unsigned long long int` | `u64`       |
| `usize`      | `size_t`                 | `usize`     |
| `f32`        | `float`                  | `f32`       |
| `f64`        | `double`                 | `f64`       |
| `void`       | `void`                   | `()`        |
| `pointer`[1] | `const uint8_t *`        | `*const u8` |

- [1] `pointer` type accepts both Typed Arrays and `Deno.UnsafePointer` as
  parameter, while it always returns the latter when used as result type.

### deno_bindgen

[`deno_bindgen`](https://github.com/littledivy/deno_bindgen) is an external tool
to simplify glue code generation of Deno FFI libraries written in Rust.

It is similar to [`wasm-bindgen`](https://github.com/rustwasm/wasm-bindgen) in
the Rust WASM ecosystem.

Here's an example showing its usage:

```rust
// mul.rs
use deno_bindgen::deno_bindgen;

#[deno_bindgen]
struct Input {
  a: i32,
  b: i32,
}

#[deno_bindgen]
fn mul(input: Input) -> i32 {
  input.a * input.b
}
```

Run `deno_bindgen` to generate bindings. You can now directly import them into
Deno:

```ts, ignore
// mul.ts
import { mul } from "./bindings/bindings.ts";
mul({ a: 10, b: 2 }); // 20
```

Any issues related to `deno_bindgen` should be reported at
https://github.com/littledivy/deno_bindgen/issues
