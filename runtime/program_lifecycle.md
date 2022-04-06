## Program lifecycle

Deno supports browser compatible lifecycle events: `load` and `unload`. You can
use these events to provide setup and cleanup code in your program.

Listeners for `load` events can be asynchronous and will be awaited. Listeners
for `unload` events need to be synchronous. Both events cannot be cancelled.

Example:

**main.ts**

```ts, ignore
import "./imported.ts";

const handler = (e: Event): void => {
  console.log(`got ${e.type} event in event handler (main)`);
};

globalThis.addEventListener("load", handler);

globalThis.addEventListener("unload", handler);

globalThis.onload = (e: Event): void => {
  console.log(`got ${e.type} event in onload function (main)`);
};

globalThis.onunload = (e: Event): void => {
  console.log(`got ${e.type} event in onunload function (main)`);
};

console.log("log from main script");
```

**imported.ts**

```ts
const handler = (e: Event): void => {
  console.log(`got ${e.type} event in event handler (imported)`);
};

globalThis.addEventListener("load", handler);
globalThis.addEventListener("unload", handler);

globalThis.onload = (e: Event): void => {
  console.log(`got ${e.type} event in onload function (imported)`);
};

globalThis.onunload = (e: Event): void => {
  console.log(`got ${e.type} event in onunload function (imported)`);
};

console.log("log from imported script");
```

A couple notes on this example:

- `addEventListener` and `onload`/`onunload` are prefixed with `globalThis`, but
  you could also use `self` or no prefix at all.
  [It is not recommended to use `window` as a prefix](https://lint.deno.land/#no-window-prefix).
- You can use `addEventListener` and/or `onload`/`onunload` to define handlers
  for events. There is a major difference between them, let's run the example:

```shell
$ deno run main.ts
log from imported script
log from main script
got load event in event handler (imported)
got load event in event handler (main)
got load event in onload function (main)
got unload event in event handler (imported)
got unload event in event handler (main)
got unload event in onunload function (main)
```

All listeners added using `addEventListener` were run, but `onload` and
`onunload` defined in `main.ts` overrode handlers defined in `imported.ts`.

In other words, you can use `addEventListener` to register multiple `"load"` or
`"unload"` event handlers, but only the last loaded `onload` or `onunload` event
handlers will be executed. It is preferable to use `addEventListener` when
possible for this reason.
