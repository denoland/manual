# Interoperating with Node.js and npm

While Deno is pretty powerful itself, many people will want to leverage code and
libraries that are built for [Node](https://nodejs.org/), in particular the
large set of packages available on the [npm](https://npmjs.com/) registry.

There are currently two ways to do this:

- Using [npm specifiers](./node/npm_specifiers.md)
- Using [CDNs](./node/cdns.md)

Node specifiers are our recommendation, but they are a new feature and may not
work for all npm packages. (In particular they are
[still in progress](https://github.com/denoland/deno/issues/15960) for tooling
like `deno vendor` and `deno check`). If you run into issues, you can always
fall back to using a CDN.

Some other scenarios you may run into covered in this chapter:

- If you are trying to use your own or private code that was written for Node,
  use the [`std/node`](./node/std_node.md) modules of the Deno standard library
  to "polyfill" the built-in modules of Node.
- If you want to use "bare specifiers" (specifiers without an absolute or
  relative path to them), you can use [import maps](./node/import_maps.md) to
  map the bare specifiers to packages in Deno without needing to use a package
  manager.
