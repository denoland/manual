/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

// std
export {
  extname,
  join,
  toFileUrl,
} from "https://deno.land/std@0.111.0/path/mod.ts";

// x/semver
export * as semver from "https://deno.land/x/semver@v1.4.0/mod.ts";

// x/oak
export { Application, Router } from "https://deno.land/x/oak@v9.0.1/mod.ts";
export type { RouteParams } from "https://deno.land/x/oak@v9.0.1/mod.ts";

// x/gfm
export { CSS as gfmCSS, render } from "https://deno.land/x/gfm@0.1.4/mod.ts";
import "https://esm.sh/prismjs@1.25.0/components/prism-typescript?no-check";
import "https://esm.sh/prismjs@1.25.0/components/prism-bash?no-check";
import "https://esm.sh/prismjs@1.25.0/components/prism-rust?no-check";
import "https://esm.sh/prismjs@1.25.0/components/prism-yaml?no-check";
import "https://esm.sh/prismjs@1.25.0/components/prism-wasm?no-check";

// npm:preact
export { h } from "https://esm.sh/preact@10.5.15";
export { renderToString } from "https://esm.sh/preact-render-to-string@5.1.19?deps=preact@10.5.15";

// npm:marked
export { default as marked } from "https://esm.sh/marked@3.0.7";

// npm:he
export { decode as entityDecode } from "https://esm.sh/he@1.2.0";
