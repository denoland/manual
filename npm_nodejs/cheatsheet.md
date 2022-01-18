## Node -> Deno cheatsheet

| Node               | Deno                                   |
| ------------------ | -------------------------------------- |
| npm i -g           | deno install                           |
| npm i              | _not needed_                           |
| npm run            | deno run                               |
| eslint             | deno lint                              |
| prettier           | deno fmt                               |
| rollup/webpack/etc | deno bundle                            |
| package.json       | Deno.json / import_map.json            |
| tsc                | _not needed: ts is built-in_           |
| documentation      | deno doc                               |
| jest/ava/tap/etc   | deno test                              |
| benchmarks         | https://deno.land/std/testing/bench.ts |
| nodemon            | deno run/lint/test --watch             |
| nexe/pkg           | deno compile                           |
| npm explain        | deno info                              |
| nvm/n              | deno upgrade                           |
| tsserver           | deno lsp                               |
| c8/istanbul        | deno coverage                          |
