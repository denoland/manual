## Linter

Deno ships with a built in code linter for JavaScript and TypeScript.

```shell
# lint all JS/TS files in the current directory and subdirectories
deno lint
# lint specific files
deno lint myfile1.ts myfile2.ts
# print result as JSON
deno lint --json
# read from stdin
cat file.ts | deno lint -
```

For more detail, run `deno lint --help`.

### Available rules

- `adjacent-overload-signatures`
- `ban-ts-comment`
- `ban-types`
- `ban-untagged-ignore`
- `camelcase`
- `constructor-super`
- `for-direction`
- `getter-return`
- `no-array-constructor`
- `no-async-promise-executor`
- `no-case-declarations`
- `no-class-assign`
- `no-compare-neg-zero`
- `no-cond-assign`
- `no-constant-condition`
- `no-control-regex`
- `no-debugger`
- `no-delete-var`
- `no-deprecated-deno-api`
- `no-dupe-args`
- `no-dupe-class-members`
- `no-dupe-else-if`
- `no-dupe-keys`
- `no-duplicate-case`
- `no-empty`
- `no-empty-character-class`
- `no-empty-interface`
- `no-empty-pattern`
- `no-ex-assign`
- `no-explicit-any`
- `no-extra-boolean-cast`
- `no-extra-non-null-assertion`
- `no-extra-semi`
- `no-fallthrough`
- `no-func-assign`
- `no-global-assign`
- `no-import-assign`
- `no-inferrable-types`
- `no-inner-declarations`
- `no-invalid-regexp`
- `no-irregular-whitespace`
- `no-misused-new`
- `no-mixed-spaces-and-tabs`
- `no-namespace`
- `no-new-symbol`
- `no-obj-calls`
- `no-octal`
- `no-prototype-builtins`
- `no-redeclare`
- `no-regex-spaces`
- `no-self-assign`
- `no-setter-return`
- `no-shadow-restricted-names`
- `no-this-alias`
- `no-this-before-super`
- `no-unreachable`
- `no-unsafe-finally`
- `no-unsafe-negation`
- `no-unused-labels`
- `no-unused-vars`
- `no-with`
- `prefer-as-const`
- `prefer-const`
- `prefer-namespace-keyword`
- `require-await`
- `require-yield`
- `use-isnan`
- `valid-typeof`

For more detail about each rule, visit
[the deno_lint rule documentation](https://lint.deno.land).

### Ignore directives

#### Files

To ignore whole file `// deno-lint-ignore-file` directive should placed at the
top of the file:

```ts
// deno-lint-ignore-file

function foo(): any {
  // ...
}
```

Ignore directive must be placed before first statement or declaration:

```ts
// Copyright 2020 the Deno authors. All rights reserved. MIT license.

/**
 * Some JS doc
 **/

// deno-lint-ignore-file

import { bar } from "./bar.js";

function foo(): any {
  // ...
}
```

You can also ignore certain diagnostics in the whole file

```ts
// deno-lint-ignore-file no-explicit-any no-empty

function foo(): any {
  // ...
}
```

#### Diagnostics

To ignore certain diagnostic `// deno-lint-ignore <codes...>` directive should
be placed before offending line. Specifying ignored rule name is required:

```ts
// deno-lint-ignore no-explicit-any
function foo(): any {
  // ...
}

// deno-lint-ignore no-explicit-any explicit-function-return-type
function bar(a: any) {
  // ...
}
```

### Configuration

Starting with Deno v1.14 a linter can be customized using either
[a configuration file](../configuration_file.md) or following CLI flags:

- `--rules-tags` - List of tag names that will be run. Empty list disables all
  tags and will only use rules from `include`. Defaults to "recommended".

- `--rules-exclude` - List of rule names that will be excluded from configured
  tag sets. If the same rule is in `include` it be run.

- `--rules-include` - List of rule names that will be run. Even if the same rule
  is in `exclude` it will be run.
