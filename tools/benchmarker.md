## Benchmarking tool

> ⚠️ `deno bench` was introduced in Deno v1.20 and currently requires
> `--unstable` flag.

Deno has a built-in benchmark runner that you can use for checking performance
of JavaScript or TypeScript code.

## Quickstart

Firstly, let's create a file `url_bench.ts` and register a bench using the
`Deno.bench()` function.

```ts
// url_bench.ts
Deno.bench("URL parsing", () => {
  new URL("https://deno.land");
});
```

Secondly, run the benchmark using the `deno bench` subcommand.

```sh
deno bench --unstable url_bench.ts
cpu: Apple M1 Max
runtime: deno 1.21.0 (aarch64-apple-darwin)

file:///dev/deno/url_bench.ts
benchmark        time (avg)             (min … max)       p75       p99      p995
--------------------------------------------------- -----------------------------
URL parsing   17.29 µs/iter  (16.67 µs … 153.62 µs)  17.25 µs  18.92 µs  22.25 µs
```

## Writing benchmarks

To define a benchmark you need to register it with a call to the `Deno.bench`
API. There are multiple overloads of this API to allow for the greatest
flexibility and easy switching between the forms (eg. when you need to quickly
focus a single bench for debugging, using the `only: true` option):

```ts
// Compact form: name and function
Deno.bench("hello world #1", () => {
  new URL("https://deno.land");
});

// Compact form: named function.
Deno.bench(function helloWorld3() {
  new URL("https://deno.land");
});

// Longer form: test definition.
Deno.bench({
  name: "hello world #2",
  fn: () => {
    new URL("https://deno.land");
  },
});

// Similar to compact form, with additional configuration as a second argument.
Deno.bench("hello world #4", { permissions: { read: true } }, () => {
  new URL("https://deno.land");
});

// Similar to longer form, with test function as a second argument.
Deno.bench(
  { name: "hello world #5", permissions: { read: true } },
  () => {
    new URL("https://deno.land");
  },
);

// Similar to longer form, with a named test function as a second argument.
Deno.bench({ permissions: { read: true } }, function helloWorld6() {
  new URL("https://deno.land");
});
```

### Async functions

You can also bench asynchronous code by passing a bench function that returns a
promise. For this you can use the `async` keyword when defining a function:

```ts
Deno.bench("async hello world", async () => {
  await 1;
});
```

## Grouping and baselines

When registering a bench case, it can be assigned to a group, using
`Deno.BenchDefinition.group` option:

```ts, ignore
// url_bench.ts
Deno.bench("url parse", { group: "url" }, () => {
  new URL("https://deno.land");
});
```

It is useful to assign several cases to a single group and compare how they
perform against a "baseline" case.

In this example we'll check how performant is `Date.now()` compared to
`performance.now()`, to do that we'll mark the first case as a "baseline" using
`Deno.BechnDefintion.baseline` option:

```ts, ignore
// time_bench.ts
Deno.bench("Date.now()", { group: "timing", baseline: true }, () => {
  Date.now();
});

Deno.bench("performance.now()", { group: "timing" }, () => {
  performance.now();
});
```

```shellsesssion
$ deno bench --unstable time_bench.ts
cpu: Apple M1 Max
runtime: deno 1.21.0 (aarch64-apple-darwin)

file:///dev/deno/time_bench.ts
benchmark              time (avg)             (min … max)       p75       p99      p995
--------------------------------------------------------- -----------------------------
Date.now()         125.24 ns/iter (118.98 ns … 559.95 ns) 123.62 ns 150.69 ns 156.63 ns
performance.now()    2.67 µs/iter     (2.64 µs … 2.82 µs)   2.67 µs   2.82 µs   2.82 µs

summary
  Date.now()
   21.29x times faster than performance.now()
```

You can specify multiple groups in the same file.

## Running benchmarks

To run a benchmark, call `deno bench` with the file that contains your bench
function. You can also omit the file name, in which case all benchmarks in the
current directory (recursively) that match the glob
`{*_,*.,}bench.{ts, tsx, mts, js, mjs, jsx, cjs, cts}` will be run. If you pass
a directory, all files in the directory that match this glob will be run.

The glob expands to:

- files named `bench.{ts, tsx, mts, js, mjs, jsx, cjs, cts}`,
- or files ending with `.bench.{ts, tsx, mts, js, mjs, jsx, cjs, cts}`,
- or files ending with `_bench.{ts, tsx, mts, js, mjs, jsx, cjs, cts}`

```shell
# Run all benches in the current directory and all sub-directories
deno bench

# Run all benches in the util directory
deno bench util/

# Run just my_bench.ts
deno bench my_bench.ts
```

> ⚠️ If you want to pass additional CLI arguments to the bench files use `--` to
> inform Deno that remaining arguments are scripts arguments.

```shell
# Pass additional arguments to the bench file
deno bench my_test.ts -- -e --foo --bar
```

`deno bench` uses the same permission model as `deno run` and therefore will
require, for example, `--allow-write` to write to the file system during
benching.

To see all runtime options with `deno bench`, you can reference the command line
help:

```shell
deno help bench
```

## Filtering

There are a number of options to filter the benches you are running.

### Command line filtering

Benches can be run individually or in groups using the command line `--filter`
option.

The filter flags accept a string or a pattern as value.

Assuming the following benches:

```ts
Deno.bench({
  name: "my-bench",
  fn: () => {/* bench function zero */},
});
Deno.bench({
  name: "bench-1",
  fn: () => {/* bench function one */},
});
Deno.bench({
  name: "bench2",
  fn: () => {/* bench function two */},
});
```

This command will run all of these benches because they all contain the word
"bench".

```shell
deno bench --filter "bench" benchmarks/
```

On the flip side, the following command uses a pattern and will run the second
and third benchmarks.

```shell
deno bench --filter "/bench-*\d/" benchmarks/
```

_To let Deno know that you want to use a pattern, wrap your filter with
forward-slashes like the JavaScript syntactic sugar for a regex._

### Bench definition filtering

Within the benches themselves, you have two options for filtering.

#### Filtering out (ignoring these benches)

Sometimes you want to ignore benches based on some sort of condition (for
example you only want a benchmark to run on Windows). For this you can use the
`ignore` boolean in the bench definition. If it is set to true the test will be
skipped.

```ts
Deno.bench({
  name: "bench windows feature",
  ignore: Deno.build.os !== "windows",
  fn() {
    // do windows feature
  },
});
```

#### Filtering in (only run these benches)

Sometimes you may be in the middle of a performance problem within a large bench
class and you would like to focus on just that single bench and ignore the rest
for now. For this you can use the `only` option to tell the benchmark harness to
only run benches with this set to true. Multiple benches can set this option.
While the benchmark run will report on the success or failure of each bench, the
overall benchmark run will always fail if any bench is flagged with `only`, as
this is a temporary measure only which disables nearly all of your benchmarks.

```ts
Deno.bench({
  name: "Focus on this bench only",
  only: true,
  fn() {
    // bench complicated stuff
  },
});
```
