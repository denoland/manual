## Node -> Deno cheatsheet

| Node                                   | Deno                                           |
| -------------------------------------- | ---------------------------------------------- |
| `node file.js`                         | `deno run file.ts`                             |
| `npm i -g`                             | `deno install`                                 |
| `npm i` / `npm install`                | _n/a_ ¹                                        |
| `npm run`                              | `deno task`                                    |
| `eslint`                               | `deno lint`                                    |
| `prettier`                             | `deno fmt`                                     |
| `rollup` / `webpack` / etc             | `deno bundle`                                  |
| `package.json`                         | `deno.json` / `deno.jsonc` / `import_map.json` |
| `tsc`                                  | _n/a; tsc is built-in_ ²                       |
| `typedoc`                              | `deno doc`                                     |
| `jest` / `ava` / `mocha` / `tap` / etc | `deno test`                                    |
| `nodemon`                              | `deno run/lint/test --watch`                   |
| `nexe` / `pkg`                         | `deno compile`                                 |
| `npm explain`                          | `deno info`                                    |
| `nvm` / `n` / `fnm`                    | `deno upgrade`                                 |
| `tsserver`                             | `deno lsp`                                     |
| `nyc` / `c8` / `istanbul`              | `deno coverage`                                |
| benchmarks                             | `deno bench`                                   |

¹ See [Linking to external code](../linking_to_external_code.md), the runtime
downloads and caches the code on first use.

² Type checking happens automatically, TypeScript compiler is built into the
`deno` binary.
