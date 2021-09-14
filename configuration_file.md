# Configuration file

> ⚠️ With v1.14 Deno started supporting more general configuration than only
> specifying TypeScript options.

Deno supports configuration file that allows to customize built-in TypeScript
compiler, formatter and linter.

To tell Deno to use the configuration file pass `--config path/to/file.json`
flag.

Configuration file supports `.json` and `.jsonc` extensions. We recommend to use
`deno.json` or `deno.jsonc` as a file name, as as automatic lookup of this file
is planned for the upcoming releases.

## Example

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
      "singleQuote": true,
      "proseWrap": "preserve"
    }
  }
}
```

## JSON schema

A JSON schema file is available for editors to provide autocomplete. The file is
versioned and available at:
https://deno.land/x/deno/cli/schemas/config-file.v1.json
