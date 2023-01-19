# Frequently Asked Questions

## Getting errors when type checking like `cannot find namespace NodeJS`

One of the modules you are using has type definitions that depend upon the
NodeJS global namespace, but those types don't include the NodeJS global
namespace in their types.

The quickest fix is to skip type checking. You can do this by using the
`--no-check` flag.

Skipping type checking might not be acceptable though. You could try to load the
Node types yourself.

### When using npm specifiers

If you are getting this error while using npm specifiers, then add a triple
slash types reference directive to your main entry point, specifying to include
the types from the `@types/node` package:

```ts, ignore
/// <reference types="npm:@types/node">
```

## Getting type errors like cannot find `document` or `HTMLElement`

The library you are using has dependencies on the DOM. This is common for
packages that are designed to run in a browser as well as server-side. By
default, Deno only includes the libraries that are directly supported. Assuming
the package properly identifies what environment it is running in at runtime it
is "safe" to use the DOM libraries to type check the code. For more information
on this, check out the
[Targeting Deno and the Browser](../advanced/typescript/configuration.md#targeting-deno-and-the-browser)
section of the manual.
