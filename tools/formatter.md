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
