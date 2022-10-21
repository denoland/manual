# Using npm packages with npm specifiers

Deno release 1.25 offers experimental support for npm specifiers. npm specifiers
allow you to use npm modules directly in Deno with a higher chance of
compatibility than importing from CDN's, particularly if the modules depend on
artifact files in their package.

It is important to emphasize that this feature is still under development. **npm
specifiers are extremely new** and you're likely find scenarios where something
doesn't work. Please report these problems to the
[issue tracker](https://github.com/denoland/deno/issues). We'll be working hard
to improve the compatibility layer and user experience over the next few
releases.

The way these work is best described with an example:

```ts, ignore
// main.ts
import express from "npm:express";
const app = express();

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.listen(3000);
console.log("listening on http://localhost:3000/");
```

These npm specifiers have the following format:

```ts, ignore
npm:<package-name>[@<version-requirement>][/<sub-path>]
```

Then doing the following will start a simple express server:

```sh
$ deno run --unstable --A main.ts
listening on http://localhost:3000/
```

When doing this, no `npm install` is necessary and no `node_modules` folder is
created. These packages are also subject to the same permissions as Deno
applications. At the moment though, there are some unnecessary permissions that
get asked for, but in the future the above program will only require network
permissions.

These specifiers currently work with `deno run`, `deno test`, and `deno bench`.
Type checking is not yet supported. Integration for the language server,
`deno vendor`, `deno info`, and `deno install` is not yet ready either.

npm package binaries can be executed from the command line without an npm
install using a specifier in the following format:

```ts, ignore
npm:<package-name>[@<version-requirement>][/<binary-name>]
```

For example:

```sh
$ deno run --unstable --allow-env --allow-read npm:cowsay@1.5.0 Hello there!
 ______________
< Hello there! >
 --------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
$ deno run --unstable --allow-env --allow-read npm:cowsay@1.5.0/cowthink What to eat?
 ______________
( What to eat? )
 --------------
        o   ^__^
         o  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```

Similar to the previous example, this npm package requires env and read
permissions, but in the future it shouldn't require any permissions.

We'll add `deno install` and lockfile support for npm package binaries in a
future release.

Because the feature is still experimental, specifying `--unstable` is required
when importing an npm specifier.
