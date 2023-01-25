# Configuration File

Deno supports configuration file that allows to customize built-in TypeScript
compiler, formatter and linter.

The configuration file supports `.json` and `.jsonc` extensions.
[Since v1.18](https://deno.com/blog/v1.18#auto-discovery-of-the-config-file),
Deno will automatically detect `deno.json` or `deno.jsonc` configuration file if
it's in your current working directory or parent directories. (`--config` flag
can be used to specify a different configuration file.)

> ⚠️ Before Deno v1.23 you needed to supply an explicit `--config` flag.

## `imports` and `scopes`

Since version 1.30, the `deno.json` configuration file acts as an
[import map](../basics/import_maps.md) for resolving bar specifiers.

```jsonc
{
  "imports": {
    "std/": "https://deno.land/std@0.174.0/"
  },
  "tasks": {
    "dev": "deno run --watch main.ts"
  }
}
```

See [the import map section](../basics/import_maps.md) for more information on
imort maps.

Then your script can use the bare specifier `std`:

```js, ignore
import { assertEquals } from "std/testing/assert.ts";

assertEquals(1, 2);
```

The top-level `deno.json` option `importMap` along with the `--importmap` flag
can be used to specify the import map in other files.

## `tasks`

Similar to `package.json`'s `script` field. Essentially short cuts for command
line invocations.

```json
{
  "tasks": {
    "start": "deno run -A --watch=static/,routes/,data/ dev.ts"
  }
}
```

Using `deno task start` will run the command.

## `lint`

Configuration for `deno lint`.

```json
{
  "lint": {
    "files": {
      "include": ["src/"],
      "exclude": ["src/testdata/"]
    },
    "rules": {
      "tags": ["recommended"],
      "include": ["ban-untagged-todo"],
      "exclude": ["no-unused-vars"]
    }
  }
}
```

## `fmt`

Configuration for `deno fmt`

```json
{
  "fmt": {
    "files": {
      "include": ["src/"],
      "exclude": ["src/testdata/"]
    },
    "options": {
      "useTabs": true,
      "lineWidth": 80,
      "indentWidth": 4,
      "singleQuote": true,
      "proseWrap": "preserve"
    }
  }
}
```

## `test` and `bench`

TODO!

## `lock`

Used to specify a different file name for the lockfile. By default deno will use
`deno.lock` and place it alongside the configuration file.

## `compilerOptions`

`deno.json` can also act as a TypeScript configuration file and supports
[most of the TS compiler options](https://www.typescriptlang.org/tsconfig).

Deno encourages users to use the default TypeScript configuration to help
sharing code.

## Full example

```json
{
  "compilerOptions": {
    "allowJs": true,
    "lib": ["deno.window"],
    "strict": true
  },
  "lint": {
    "files": {
      "include": ["src/"],
      "exclude": ["src/testdata/"]
    },
    "rules": {
      "tags": ["recommended"],
      "include": ["ban-untagged-todo"],
      "exclude": ["no-unused-vars"]
    }
  },
  "fmt": {
    "files": {
      "include": ["src/"],
      "exclude": ["src/testdata/"]
    },
    "options": {
      "useTabs": true,
      "lineWidth": 80,
      "indentWidth": 4,
      "semiColons": false,
      "singleQuote": true,
      "proseWrap": "preserve"
    }
  },
  "test": {
    "files": {
      "include": ["src/"],
      "exclude": ["src/testdata/"]
    }
  }
}
```

## JSON schema

A JSON schema file is available for editors to provide autocomplete. The file is
versioned and available at:
https://deno.land/x/deno/cli/schemas/config-file.v1.json
