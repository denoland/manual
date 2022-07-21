# Configuration file

Deno supports configuration file that allows to customize built-in TypeScript
compiler, formatter and linter.

The configuration file supports `.json` and `.jsonc` extensions.
[Since v1.18](https://deno.com/blog/v1.18#auto-discovery-of-the-config-file),
Deno will automatically detect `deno.json` or `deno.jsonc` configuration file if
it's in your current working directory (or parent directories). To manually tell
Deno to use a specific configuration file pass `--config path/to/file.json`
flag.

> ⚠️ Starting with Deno v1.22 you can disable automatic detection of the
> configuration file, by passing `--no-config`.

Note that using a configuration file is not required now, and will not be
required in the future. Deno still works best with the default options and no
configuration file. All options specified in the configuration file can also be
set using command line flags (for example `--options-use-tabs` for `deno fmt`).
Using the configuration file should be considered an "as needed" feature, not
something every user should be reaching to as the first thing when setting up a
project.

## Example

```json
{
  "compilerOptions": {
    "allowJs": true,
    "lib": ["deno.window"],
    "strict": true
  },
  "importMap": "import_map.json",
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
