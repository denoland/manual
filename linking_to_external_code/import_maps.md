## Import maps

Deno supports [import maps](https://github.com/WICG/import-maps).

You can use import maps with the `--import-map=<FILE>` CLI flag or `importMap`
option in the [configuration file](../getting_started/configuration_file.md),
the former will take precedence.

Example:

**import_map.json**

```json
{
  "imports": {
    "fmt/": "https://deno.land/std@$STD_VERSION/fmt/"
  }
}
```

**color.ts**

```ts, ignore
import { red } from "fmt/colors.ts";

console.log(red("hello world"));
```

Then:

```shell
$ deno run --import-map=import_map.json color.ts
```

To use your project root for absolute imports:

**import_map.json**

```jsonc
{
  "imports": {
    "/": "./",
    "./": "./"
  }
}
```

**main.ts**

```ts, ignore
import { MyUtil } from "/util.ts";
```

This causes import specifiers starting with `/` to be resolved relative to the
import map's URL or file path.
