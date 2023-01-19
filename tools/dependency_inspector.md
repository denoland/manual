# Dependency Inspector

`deno info [URL]` will inspect an ES module and all of its dependencies.

```shell
deno info deno:std@0.67.0/http/file_server.ts
Download deno:std@0.67.0/http/file_server.ts
...
local: /home/deno/.cache/deno/deps/https/deno.land/f57792e36f2dbf28b14a75e2372a479c6392780d4712d76698d5031f943c0020
type: TypeScript
emit: /home/deno/.cache/deno/gen/https/deno.land/f57792e36f2dbf28b14a75e2372a479c6392780d4712d76698d5031f943c0020.js
dependencies: 23 unique (total 139.89KB)
deno:std@0.67.0/http/file_server.ts (10.49KB)
├─┬ deno:std@0.67.0/path/mod.ts (717B)
│ ├── deno:std@0.67.0/path/_constants.ts (2.35KB)
│ ├─┬ deno:std@0.67.0/path/win32.ts (27.36KB)
│ │ ├── deno:std@0.67.0/path/_interface.ts (657B)
│ │ ├── deno:std@0.67.0/path/_constants.ts *
│ │ ├─┬ deno:std@0.67.0/path/_util.ts (3.3KB)
│ │ │ ├── deno:std@0.67.0/path/_interface.ts *
│ │ │ └── deno:std@0.67.0/path/_constants.ts *
│ │ └── deno:std@0.67.0/_util/assert.ts (405B)
│ ├─┬ deno:std@0.67.0/path/posix.ts (12.67KB)
│ │ ├── deno:std@0.67.0/path/_interface.ts *
│ │ ├── deno:std@0.67.0/path/_constants.ts *
│ │ └── deno:std@0.67.0/path/_util.ts *
│ ├─┬ deno:std@0.67.0/path/common.ts (1.14KB)
│ │ └─┬ deno:std@0.67.0/path/separator.ts (264B)
│ │   └── deno:std@0.67.0/path/_constants.ts *
│ ├── deno:std@0.67.0/path/separator.ts *
│ ├── deno:std@0.67.0/path/_interface.ts *
│ └─┬ deno:std@0.67.0/path/glob.ts (8.12KB)
│   ├── deno:std@0.67.0/path/_constants.ts *
│   ├── deno:std@0.67.0/path/mod.ts *
│   └── deno:std@0.67.0/path/separator.ts *
├─┬ deno:std@0.67.0/http/server.ts (10.23KB)
│ ├── deno:std@0.67.0/encoding/utf8.ts (433B)
│ ├─┬ deno:std@0.67.0/io/bufio.ts (21.15KB)
│ │ ├── deno:std@0.67.0/bytes/mod.ts (4.34KB)
│ │ └── deno:std@0.67.0/_util/assert.ts *
│ ├── deno:std@0.67.0/_util/assert.ts *
│ ├─┬ deno:std@0.67.0/async/mod.ts (202B)
│ │ ├── deno:std@0.67.0/async/deferred.ts (1.03KB)
│ │ ├── deno:std@0.67.0/async/delay.ts (279B)
│ │ ├─┬ deno:std@0.67.0/async/mux_async_iterator.ts (1.98KB)
│ │ │ └── deno:std@0.67.0/async/deferred.ts *
│ │ └── deno:std@0.67.0/async/pool.ts (1.58KB)
│ └─┬ deno:std@0.67.0/http/_io.ts (11.25KB)
│   ├── deno:std@0.67.0/io/bufio.ts *
│   ├─┬ deno:std@0.67.0/textproto/mod.ts (4.52KB)
│   │ ├── deno:std@0.67.0/io/bufio.ts *
│   │ ├── deno:std@0.67.0/bytes/mod.ts *
│   │ └── deno:std@0.67.0/encoding/utf8.ts *
│   ├── deno:std@0.67.0/_util/assert.ts *
│   ├── deno:std@0.67.0/encoding/utf8.ts *
│   ├── deno:std@0.67.0/http/server.ts *
│   └── deno:std@0.67.0/http/http_status.ts (5.93KB)
├─┬ deno:std@0.67.0/flags/mod.ts (9.54KB)
│ └── deno:std@0.67.0/_util/assert.ts *
└── deno:std@0.67.0/_util/assert.ts *
```

Dependency inspector works with any local or remote ES modules.

## Cache location

`deno info` can be used to display information about cache location:

```shell
deno info
DENO_DIR location: "/Users/deno/Library/Caches/deno"
Remote modules cache: "/Users/deno/Library/Caches/deno/deps"
TypeScript compiler cache: "/Users/deno/Library/Caches/deno/gen"
```
