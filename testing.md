# Testing

Deno has a built-in test runner that you can use for testing JavaScript or
TypeScript code.

`deno test` will search in `./*` and `./**/*` recursively, for test files:

- named `test.{ts, tsx, js, mjs, jsx}`,
- or ending with `.test.{ts, tsx, js, mjs, jsx}`,
- or ending with `_test.{ts, tsx, js, mjs, jsx}`

## Writing tests

To define a test you need to register it with a call to `Deno.test` with a name
and function to be tested. There are two styles you can use.

```ts
import { assertEquals } from "https://deno.land/std@$STD_VERSION/testing/asserts.ts";

// Simple name and function, compact form, but not configurable
Deno.test("hello world #1", () => {
  const x = 1 + 2;
  assertEquals(x, 3);
});

// Fully fledged test definition, longer form, but configurable (see below)
Deno.test({
  name: "hello world #2",
  fn: () => {
    const x = 1 + 2;
    assertEquals(x, 3);
  },
});
```

### Async functions

You can also test asynchronous code by passing a test function that returns a
promise. For this you can use the `async` keyword when defining a function:

```ts
import { delay } from "https://deno.land/std@$STD_VERSION/async/delay.ts";

Deno.test("async hello world", async () => {
  const x = 1 + 2;

  // await some async task
  await delay(100);

  if (x !== 3) {
    throw Error("x should be equal to 3");
  }
});
```

## Running tests

To run the test, call `deno test` with the file that contains your test
function. You can also omit the file name, in which case all tests in the
current directory (recursively) that match the glob
`{*_,*.,}test.{js,mjs,ts,jsx,tsx}` will be run. If you pass a directory, all
files in the directory that match this glob will be run.

```shell
# Run all tests in the current directory and all sub-directories
deno test

# Run all tests in the util directory
deno test util/

# Run just my_test.ts
deno test my_test.ts
```

`deno test` uses the same permission model as `deno run` and therefore will
require, for example, `--allow-write` to write to the file system during
testing.

To see all runtime options with `deno test`, you can reference the command line
help:

```shell
deno help test
```

## Filtering

There are a number of options to filter the tests you are running.

### Command line filtering

Tests can be run individually or in groups using the command line `--filter`
option.

The filter flags accept a string or a pattern as value.

Assuming the following tests:

```ts
Deno.test({ name: "my-test", fn: myTest });
Deno.test({ name: "test-1", fn: test1 });
Deno.test({ name: "test2", fn: test2 });
```

This command will run all of these tests because they all contain the word
"test".

```shell
deno test --filter "test" tests/
```

On the flip side, the following command uses a pattern and will run the second
and third tests.

```shell
deno test --filter "/test-*\d/" tests/
```

_To let Deno know that you want to use a pattern, wrap your filter with
forward-slashes like the JavaScript syntactic sugar for a REGEX._

### Test definition filtering

Within the tests themselves, you have two options for filtering.

#### Filtering out (Ignoring these tests)

Sometimes you want to ignore tests based on some sort of condition (for example
you only want a test to run on Windows). For this you can use the `ignore`
boolean in the test definition. If it is set to true the test will be skipped.

```ts
Deno.test({
  name: "do macOS feature",
  ignore: Deno.build.os !== "darwin",
  fn() {
    doMacOSFeature();
  },
});
```

#### Filtering in (Only run these tests)

Sometimes you may be in the middle of a problem within a large test class and
you would like to focus on just that test and ignore the rest for now. For this
you can use the `only` option to tell the test framework to only run tests with
this set to true. Multiple tests can set this option. While the test run will
report on the success or failure of each test, the overall test run will always
fail if any test is flagged with `only`, as this is a temporary measure only
which disables nearly all of your tests.

```ts
Deno.test({
  name: "Focus on this test only",
  only: true,
  fn() {
    testComplicatedStuff();
  },
});
```

## Failing fast

If you have a long-running test suite and wish for it to stop on the first
failure, you can specify the `--fail-fast` flag when running the suite.

```shell
deno test --fail-fast
```

## Integration with testing libraries

Deno's test runner works with popular testing libraries like
[Chai](https://www.chaijs.com/), [Sinon.JS](https://sinonjs.org/) or
[fast-check](https://dubzzz.github.io/fast-check.github.com/).

For example integration see:

- https://deno.land/std@$STD_VERSION/testing/chai_example.ts
- https://deno.land/std@$STD_VERSION/testing/sinon_example.ts
- https://deno.land/std@$STD_VERSION/testing/fast_check_example.ts

### Example: spying on a function with Sinon

Test spies are function stand-ins that are used to assert if a function's
internal behavior matches expectations. Sinon is a widely used testing library
that provides test spies and can be used in Deno by importing it from a CDN,
such as Skypack:

```js
import sinon from "https://cdn.skypack.dev/sinon";
```

Say we have two functions, `foo` and `bar` and want to assert that `bar` is
called during execution of `foo`. There are a few ways to achieve this with
Sinon, one is to have function `foo` take another function as a parameter:

```js
// my_file.js
export function bar() {/*...*/}

export function foo(fn) {
  fn();
}
```

This way, we can call `foo(bar)` in the application code or wrap a spy function
around `bar` and call `foo(spy)` in the testing code:

```js
import sinon from "https://cdn.skypack.dev/sinon";
import { assertEquals } from "https://deno.land/std@$STD_VERSION/testing/asserts.ts";
import { bar, foo } from "./my_file.js";

Deno.test("calls bar during execution of foo", () => {
  // create a test spy that wraps 'bar'
  const spy = sinon.spy(bar);

  // call function 'foo' and pass the spy as an argument
  foo(spy);

  assertEquals(spy.called, true);
  assertEquals(spy.getCalls().length, 1);
});
```

If you prefer not to add additional parameters for testing purposes only, you
can also use `sinon` to wrap a method on an object instead. In other JavaScript
environments `bar` might have been accessible via a global such as `window` and
callable via `sinon.spy(window, "bar")`, but in Deno this will not work and
instead you can `export` an object with the functions to be tested. This means
rewriting `my_file.js` to something like this:

```js
// my_file.js
function bar() {/*...*/}

export const funcs = {
  bar,
};

// 'foo' no longer takes a parameter, but calls 'bar' from an object
export function foo() {
  funcs.bar();
}
```

And then `import` in a test file:

```js
import sinon from "https://cdn.skypack.dev/sinon";
import { assertEquals } from "https://deno.land/std@$STD_VERSION/testing/asserts.ts";
import { foo, funcs } from "./my_file.js";

Deno.test("calls bar during execution of foo", () => {
  // create a test spy that wraps 'bar' on the 'funcs' object
  const spy = sinon.spy(funcs, "bar");

  // call function 'foo' without an argument
  foo();

  assertEquals(spy.called, true);
  assertEquals(spy.getCalls().length, 1);
});
```
