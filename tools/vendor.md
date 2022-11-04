# Vendoring Dependencies

`deno vendor <specifiers>...` will download all remote dependencies of the
specified modules into a local `vendor` folder. For example:

```shell
# Vendor the remote dependencies of main.ts
$ deno vendor main.ts

# Example file system tree
$ tree
.
├── main.ts
└── vendor
    ├── deno.land
    ├── import_map.json
    └── raw.githubusercontent.com

# Check the directory into source control
$ git add -u vendor
$ git commit
```

To then use the vendored dependencies in your program, just add
`--import-map=vendor/import_map.json` to your Deno invocations. You can also add
`--no-remote` to your invocation to completely disable fetching of remote
modules to ensure it's using the modules in the vendor directory.

```shell
deno run --no-remote --import-map=vendor/import_map.json main.ts
```

Note that you may specify multiple modules and remote modules when vendoring.

```shell
deno vendor main.ts test.deps.ts https://deno.land/std/path/mod.ts
```

Run `deno vendor --help` for more details.
