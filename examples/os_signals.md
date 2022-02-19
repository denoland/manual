# Handle OS Signals

> ⚠️ Handling OS signals is currently not available on Windows.

## Concepts

- [Deno.addSignalListener()](https://doc.deno.land/deno/stable/~/Deno.addSignalListener)
  can be used to capture and monitor OS signals.
- [Deno.removeSignalListener()](https://doc.deno.land/deno/stable/~/Deno.removeSignalListener)
  can be used to stop watching the signal.

## Set up an OS signal listener

APIs for handling OS signals are modelled after already familiar
[`addEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
and
[`removeEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener)
APIs.

> ⚠️ Note that listening for OS signals doesn't prevent event loop from
> finishing, ie. if there are no more pending async operations the process will
> exit.

You can use `Deno.addSignalListener()` function for handling OS signals:

```ts
/**
 * add_signal_listener.ts
 */
console.log("Press Ctrl-C to trigger a SIGINT signal");

Deno.addSignalListener("SIGINT", () => {
  console.log("interrupted!");
  Deno.exit();
});

// Add a timeout to prevent process exiting immediately.
setTimeout(() => {}, 5000);
```

Run with:

```shell
deno run add_signal_listener.ts
```

You can use `Deno.removeSignalListener()` function to unregister previously
added signal handler.

```ts
/**
 * signal_listeners.ts
 */
console.log("Press Ctrl-C to trigger a SIGINT signal");

const sigIntHandler = () => {
  console.log("interrupted!");
  Deno.exit();
};
Deno.addSignalListener("SIGINT", sigIntHandler);

// Add a timeout to prevent process existing immediately.
setTimeout(() => {}, 5000);

// Stop listening for a signal after 1s.
setTimeout(() => {
  Deno.removeSignalListener("SIGINT", sigIntHandler);
}, 1000);
```

Run with:

```shell
deno run signal_listeners.ts
```

## Async iterator example

If you prefer to handle signals using an async iterator, you can use
[`signal()`](https://deno.land/std/signal/mod.ts) API available in `deno_std`:

```ts
/**
 * async_iterator_signal.ts
 */
import { signal } from "https://deno.land/std@$STD_VERSION/signal/mod.ts";

const sig = signal("SIGUSR1", "SIGINT");

// Add a timeout to prevent process exiting immediately.
setTimeout(() => {}, 5000);

for await (const _ of sig) {
  console.log("interrupt or usr1 signal received");
}
```

Run with:

```shell
deno run async_iterator_signal.ts
```
