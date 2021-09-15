## Code formatter

Deno ships with a built in code formatter that auto-formats TypeScript,
JavaScript, Markdown, JSON, and JSONC code.

```shell
# format all supported files in the current directory and subdirectories
deno fmt
# format specific files
deno fmt myfile1.ts myfile2.ts
# check if all the supported files in the current directory and subdirectories are formatted
deno fmt --check
# format stdin and write to stdout
cat file.ts | deno fmt -
```

### Ignoring Code

Ignore formatting code by preceding it with a `// deno-fmt-ignore` comment in
TS/JS/JSONC:

```ts
// deno-fmt-ignore
export const identity = [
    1, 0, 0,
    0, 1, 0,
    0, 0, 1,
];
```

Or ignore an entire file by adding a `// deno-fmt-ignore-file` comment at the
top of the file.

In markdown you may use a `<!-- deno-fmt-ignore -->` comment or ignore a whole
file with a `<!-- deno-fmt-ignore-file -->` comment. To ignore a section of
markdown, surround the code with `<!-- deno-fmt-ignore-start -->` and
`<!-- deno-fmt-ignore-end -->` comments.

### Configuration

> ℹ️ It is recommended to stick with default options.

Starting with Deno v1.14 a formatter can be customized using either
[a configuration file](../getting_started/configuration_file.md) or following
CLI flags:

- `--options-use-tabs` - Whether to use tabs. Defaults to false (using spaces).

- `--options-line-width` - The width of a line the printer will try to stay
  under. Note that the printer may exceed this width in certain cases. Defaults
  to 80.

- `--options-indent-width` - The number of characters for an indent. Defaults
  to 2.

- `--options-single-quote` - Wheter to use single quote. Defaults to false
  (using double quote).

- `--options-prose-wrap={always,never,preserve}` - Define how prose should be
  wrapped in Markdown files. Defaults to "always".
