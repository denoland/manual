## Node -> Deno cheatsheet

| Node                                   | Deno                                                                                             |
| -------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `npm i -g`                             | `deno install`                                                                                   |
| `npm i` / `npm install`                | TODO(add superscript about pulling deps on first use): _not needed_                              |
| `npm run`                              | `deno run`                                                                                       |
| `eslint`                               | `deno lint`                                                                                      |
| `prettier`                             | `deno fmt`                                                                                       |
| `rollup` / `webpack` / etc             | `deno bundle`                                                                                    |
| `package.json`                         | `deno.json` / `deno.jsonc` / `import_map.json`                                                   |
| `tsc`                                  | TODO(add superscript about doing type checking in several commands):_not needed: ts is built-in_ |
| `typedoc`                              | `deno doc`                                                                                       |
| `jest` / `ava` / `mocha` / `tap` / etc | `deno test`                                                                                      |
| benchmarks                             | TODO(add superscript about `deno bench` issue) https://deno.land/std/testing/bench.ts            |
| `nodemon`                              | TODO: make it more self-describing `deno run` / `lint` / `test --watch`                          |
| `nexe` / `pkg`                         | `deno compile`                                                                                   |
| `npm explain`                          | `deno info`                                                                                      |
| `nvm` / `n` / `fnm`                    | `deno upgrade`                                                                                   |
| `tsserver`                             | `deno lsp`                                                                                       |
| `nyc` / `c8` / `istanbul`              | `deno coverage`                                                                                  |
