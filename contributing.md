# Contributing

We welcome and appreciate all contributions to Deno.

This page serves as a helper to get you started on cotributing.

## Projects

There are numerous repositories in the [`denoland`](https://github.com/denoland)
organization that are part of the Deno ecosystem.

Repositories have different scopes, use different programming languages and have
varying difficulty level when it comes to contributions.

To help you decide which repository might be the best to start contributing
(and/or falls into your interest), here's a short comparison (**languages in
bold comprise most of the codebase**):

### [`deno`](https://github.com/denoland/deno)

This is the main repository that provides the `deno` CLI.

If you want to fix a bug or add a new feature to `deno` this is the repository
you want to contribute to.

Languages: **Rust**, **JavaScript**

### [`deno_std`](https://github.com/denoland/deno_std)

The standard libarary for Deno.

Languages: **TypeScript**, WebAssembly.

### [`deno_website2`](https://github.com/denoland/deno_website2)

Frontend for official Deno webpage: https://deno.land/

Languages: **TypeScript**, TSX, CSS

### [`deno_lint`](https://github.com/denoland/deno_lint)

Linter that power `deno lint` subcommand.

Languages: **Rust**

### [`deno_doc`](https://github.com/denoland/deno_doc)

Documentation generator that powers `deno doc` subcommand and
https://doc.deno.land

Languages: **Rust**

### [`doc_website`](https://github.com/denoland/doc_website)

Frontend for documentation generator: https://doc.deno.land

Languages: **TypeScript**, TSX, CSS

### [`rusty_v8`](https://github.com/denoland/rusty_v8)

Rust bindings for the V8 JavaScript engine. Very technical and low-level.

Languages: **Rust**

### [`serde_v8`](https://github.com/denoland/serde_v8)

Library that provides bijection layer between V8 and Rust objects. Based on
[`serde`](https://crates.io/crates/serde) library. Very technical and low-level.

Languages: **Rust**

### [`deno_docker`](https://github.com/denoland/deno_docker)

Official Docker images for Deno.

## General remarks

- Read the [style guide](./contributing/style_guide.md).

- Please don't make [the benchmarks](https://deno.land/benchmarks) worse.

- Ask for help in the [community chat room](https://discord.gg/deno).

- If you are going to work on an issue, mention so in the issue comments
  _before_ you start working on the issue.

- If you are going to work on a new feature, create an issue and discuss with
  other contributors _before_ you start working on the feature.

- Please be professional in the forums. We follow
  [Rust's code of conduct](https://www.rust-lang.org/policies/code-of-conduct)
  (CoC). Have a problem? Email ry@tinyclouds.org.

## Development

Instructions on how to build from source can be found
[here](./contributing/building_from_source.md).

TODO(@bartlomieju): this is only valid for the cli repo, there should be a
section for `std` as well

## Submitting a Pull Request

Before submitting, please make sure the following is done:

1. Give the PR a descriptive title.

Examples of good PR title:

- fix(std/http): Fix race condition in server
- docs(console): Update docstrings
- feat(doc): Handle nested re-exports

Examples of bad PR title:

- fix #7123
- update docs
- fix bugs

2. Ensure there is a related issue and it is referenced in the PR text.
3. Ensure there are tests that cover the changes.
4. Ensure `cargo test` passes.
5. Ensure `./tools/format.js` passes without changing files.
6. Ensure `./tools/lint.js` passes.

TODO(@bartlomieju): complately outdated, should be on the page for `deno`

## Adding Ops (aka bindings)

We are very concerned about making mistakes when adding new APIs. When adding an
Op to Deno, the counterpart interfaces on other platforms should be researched.
Please list how this functionality is done in Go, Node, Rust, and Python.

As an example, see how `Deno.rename()` was proposed and added in
[PR #671](https://github.com/denoland/deno/pull/671).

TODO(@bartlomieju): these two section should be a separate chapter in the manual

## Documenting APIs

It is important to document public APIs and we want to do that inline with the
code. This helps ensure that code and documentation are tightly coupled
together.

### Utilize JSDoc

All publicly exposed APIs and types, both via the `deno` module as well as the
global/`window` namespace should have JSDoc documentation. This documentation is
parsed and available to the TypeScript compiler, and therefore easy to provide
further downstream. JSDoc blocks come just prior to the statement they apply to
and are denoted by a leading `/**` before terminating with a `*/`. For example:

```ts
/** A simple JSDoc comment */
export const FOO = "foo";
```

Find more at: https://jsdoc.app/
