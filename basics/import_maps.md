# Import Maps

In order for Deno to resolve a _bare specifier_ like `"react"` or `"lodash"`, it
needs to be told where to look for it. Does `"lodash"` refer to an npm module or
does it map to an https URL?

```ts, ignore
import lodash from "lodash";
```

Node and npm use `package.json` and the `node_modules` folder to do this
resolution. Deno, on the other hand, uses the
[import map](https://github.com/WICG/import-maps) standard to do this.

To make the above `import lodash from "lodash"` work, add the following to the
[`deno.json` configuration file](../getting_started/configuration_file.md).

```json
{
  "imports": {
    "lodash": "https://esm.sh/lodash"
  }
}
```

The `deno.json` file is auto-discovered and acts (among other things) as an
import map.
[Read more about `deno.json` here](../getting_started/configuration_file.md).

This also works with npm specifiers. Instead of the above, we could have also
written something similar in our `deno.json` configuration file:

```json
{
  "imports": {
    "lodash": "npm:lodash@^4.17"
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
