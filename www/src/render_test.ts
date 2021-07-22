import { assert, assertEquals } from "../test_deps.ts";
import { decodeMarkdown, renderMarkdown } from "./render.ts";
import { VersionType } from "./versions.ts";

const VERSION_1_12_1 = {
  type: VersionType.Release,
  version: "1.12.1",
  inOldRepo: false,
  stdVersion: "0.102.0",
};

Deno.test("decode markdown CLI_VERSION replacement", () => {
  const markdown = `https://deno.land/x/deno@$CLI_VERSION`;
  const actual = decodeMarkdown(
    new TextEncoder().encode(markdown),
    VERSION_1_12_1,
  );
  assertEquals(actual, "https://deno.land/x/deno@v1.12.1");
});

Deno.test("decode markdown STD_VERSION replacement", () => {
  const markdown = `https://deno.land/std@$STD_VERSION`;
  const actual = decodeMarkdown(
    new TextEncoder().encode(markdown),
    VERSION_1_12_1,
  );
  assertEquals(actual, "https://deno.land/std@0.102.0");
});

Deno.test("render markdown sanitization", () => {
  const markdown = `XSS <script>alert(1)</script>`;
  const html = renderMarkdown(markdown);
  assertEquals(html, "<p>XSS </p>\n");
});

Deno.test("render markdown relative url remove .md", () => {
  const markdown = `[Getting Started](./getting_started.md)`;
  const html = renderMarkdown(markdown);
  assertEquals(
    html,
    `<p><a href="./getting_started" rel="noopener noreferrer">Getting Started</a></p>\n`,
  );
});

Deno.test("render markdown absolute url don't touch .md", () => {
  const markdown = `[Getting Started](https://deno.land/getting_started.md)`;
  const html = renderMarkdown(markdown);
  assertEquals(
    html,
    `<p><a href="https://deno.land/getting_started.md" rel="noopener noreferrer">Getting Started</a></p>\n`,
  );
});

Deno.test("render markdown should have octicon in header", () => {
  const markdown = `## Hello World`;
  const html = renderMarkdown(markdown);
  assert(html.includes("<h2>"));
  assert(html.includes("<svg"));
  assert(html.includes("octicon"));
});
