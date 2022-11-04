# Using Import Maps

Node.js allows you to import bare specifiers (e.g. `react` or `lodash`) -- its
module resolution algorithm will look in your local and global `node_modules`
for a path, introspect the `package.json` and try to see if there is a module
named the right way.

Deno, on the other hand, resolves modules the same way a browser does. For local
files, Deno expects a full module name, including the extension. When dealing
with remote imports, Deno expects the web server to do any "resolving" and
provide back the media type of the code.

To bridge this gap, Deno supports
[Import maps](https://github.com/WICG/import-maps#the-import-map), a
web-platform standard that allows you to use bare specifiers with Deno without
having to install the Node.js package locally.

So if we want to do the following in our code:

```ts, ignore
import lodash from "lodash";
```

We can accomplish this using an import map, and we don't even have to install
the `lodash` package locally. We would want to create a JSON file (for example
**import_map.json**) with the following:

```json
{
  "imports": {
    "lodash": "https://cdn.skypack.dev/lodash"
  }
}
```

And we would run our program like:

```
> deno run --import-map ./import_map.json example.ts
```

## Managing version of modules in the import map.

If you wanted to manage the versions in the import map, you could do this as
well. For example if you were using Skypack CDN, you can use a
[pinned URL](https://docs.skypack.dev/skypack-cdn/api-reference/pinned-urls-optimized)
for the dependency in your import map. To pin to `lodash` version 4.17.21 (and
minified production ready version), you would do this:

```json
{
  "imports": {
    "lodash": "https://cdn.skypack.dev/pin/lodash@v4.17.21-K6GEbP02mWFnLA45zAmi/mode=imports,min/optimized/lodash.js"
  }
}
```

## Overriding imports

The other situation where import maps can be very useful is when you have tried
your best to import a npm package, but keep getting errors. For example you are
using an npm package which has a dependency on some code that just doesn't work
under Deno, and you want to substitute another module that "polyfills" the
incompatible APIs.

Let's say we have a package that is using a version of the built-in `"fs"`
module. We want to replace it with a local module when the scope is
`https://deno.land/x/example`, but then we want to use the std library
replacement module for `"fs"` for all other code. To do this, we can create an
import map that looks something like this:

```json
{
  "imports": {
    "fs": "https://deno.land/std@$STD_VERSION/node/fs.ts"
  },
  "scopes": {
    "https://deno.land/x/example": {
      "fs": "./patched/fs.ts"
    }
  }
}
```
