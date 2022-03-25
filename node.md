# Interoperating with Node and NPM

While Deno is pretty powerful itself, many people will want to leverage code and
libraries that are built for [Node](https://nodejs.org/), in particular the
large set of packages available on the [NPM](https://npmjs.com/) registry. In
this chapter, we will explore how.

> ⚠️ Starting with v1.15 Deno provides a compatibility mode, that allows to
> emulate Node environment and consume code authored for Node directly. See
> [Node compatibility mode](./node/compatibility_mode.md) chapter for details.

The good news is that in many cases, it _just works_.

There are some foundational things to understand about differences between Node
and Deno that can help in understanding what challenges might be faced:

- Current Node supports both CommonJS and ES Modules, while Deno only supports
  ES Modules. The addition of stabilized ES Modules in Node is relatively recent
  and most code written for Node is in the CommonJS format.
- Node has quite a few built-in modules that can be imported and they are a
  fairly expansive set of APIs. On the other hand, Deno focuses on implementing
  web standards, and where functionality goes beyond the browser, we locate APIs
  in a single global `Deno` variable/namespace. Lots of code written for Node
  expects/depends upon these built-in APIs to be available.
- Node has a non-standards based module resolution algorithm, where you can
  import bare-specifiers (e.g. `react` or `lodash`) and Node will look in your
  local and global `node_modules` for a path, introspect the `package.json` and
  try to see if there is a module named the right way. Deno resolves modules the
  same way a browser does. For local files, Deno expects a full module name,
  including the extension. When dealing with remote imports, Deno expects the
  web server to do any "resolving" and provide back the media type of the code
  (see the
  [Determining the type of file](./typescript/overview.md#determining-the-type-of-file)
  for more information).
- Node effectively doesn't work without a `package.json` file. Deno doesn't
  require an external meta-data file to function or resolve modules.
- Node doesn't support remote HTTP imports. It expects all 3rd party code to be
  installed locally on your machine using a package manager like `npm` into the
  local or global `node_modules` folder. Deno supports remote HTTP imports (as
  well as `data` and `blob` URLs) and will go ahead and fetch the remote code
  and cache it locally, similar to the way a browser works.

In order to help mitigate these differences, we will further explore in this
chapter:

- Using the [`std/node`](./node/std_node.md) modules of the Deno standard
  library to "polyfill" the built-in modules of Node
- Using [CDNs](./node/cdns.md) to access the vast majority of npm packages in
  ways that work under Deno.
- How [import maps](./node/import_maps.md) can be used to provide "bare
  specifier" imports like Node under Deno, without needing to use a package
  manager to install packages locally.
- And finally, a general section of [frequently asked questions](./node/faqs.md)

That being said, some differences cannot be overcome:

- Node has a plugin system that is incompatible with Deno, and Deno will never
  support Node plugins. If the Node code you want to use requires a "native"
  Node plugin, it won't work under Deno.
- Node has some built-in modules (e.g. like `vm`) that are effectively
  incompatible with the scope of Deno and therefore there aren't easy ways to
  provide a _polyfill_ of the functionality in Deno.
