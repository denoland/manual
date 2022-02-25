# Publishing Modules

Deno is not prescriptive about how developers make their modules
available—modules may be imported from any source. To help publish and
distribute modules, separate standalone solutions are provided.

## Publishing on deno.land/x

A common way to publish Deno modules is via the official
[https://deno.land/x](https://deno.land/x) hosting service. It caches releases
of open source modules and serves them at one easy to remember domain.

To use it, modules must be developed and hosted in public repositories on
GitHub. Their source is then published to deno.land/x on tag creation. They can
then be accessed by using a url in the following format:

```
https://deno.land/x/<module_name>@<tag_name>/<file_path>
```

Module versions are persistent and immutable. It is thus not possible to editor
or delete a module (or version), to prevent breaking programs that rely on this
module. Modules may be removed if there is a legal reason to do so (for example
copyright infringement).

For more details, see [Adding a Module](https://deno.land/add_module).

## dnt - Publishing Deno modules for Node.js

Library authors may want to make their Deno modules available to Node.js users.
This is possible by using the [dnt](https://github.com/denoland/dnt) build tool.

dnt allows you to develop your Deno module mostly as-is and use a single Deno
script to build, type check, and test an npm package in an output directory.
Once built, you only need to `npm publish` the output directory to distribute it
to Node.js users.

For more details, see https://github.com/denoland/dnt
