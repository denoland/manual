//! This module is responsible for preparing and rendering the markdown files in
//! the manual.

import { ammonia, comrak } from "../deps.ts";
import { TableOfContents } from "./table_of_contents.ts";
import { VersionInfo } from "./versions.ts";

// TODO(lucacasonato): this should be streaming in the future.
/**
 * Take a raw markdown source file, replace any placeholder variables (e.g.
 * $STD_VERSION and $CLI_VERSION).
 */
export function decodeMarkdown(
  source: Uint8Array,
  versionInfo: VersionInfo,
): string {
  const text = new TextDecoder().decode(source);
  const final = text
    .replaceAll("$CLI_VERSION", `v${versionInfo.version}`)
    .replaceAll("$STD_VERSION", versionInfo.stdVersion);
  return final;
}

const COMRAK_OPTIONS: comrak.ComrakOptions = {
  extension: {
    autolink: true,
    headerIDs: "",
    strikethrough: true,
    table: true,
    tagfilter: true,
    tasklist: true,
  },
  render: {
    unsafe: true, // HTML is always passed through ammonia to sanitize.
  },
};

const HIGHLIGHTER_LANGUAGES = [
  // js
  "javascript",
  "js",
  // ts
  "typescript",
  "ts",
  // json
  "json",
  "jsonc",
  // markup
  "markup",
  "mathml",
  "html",
  "xml",
  "rss",
  "ssml",
  "ssml",
  "ssml",
  // wasm
  "wasm",
];

const AMMONIA_BUILDER = new ammonia.AmmoniaBuilder();
AMMONIA_BUILDER.allowedClasses.set("svg", new Set(["octicon", "octicon-link"]));
AMMONIA_BUILDER.allowedClasses.set(
  "code",
  new Set(HIGHLIGHTER_LANGUAGES.map((lang) => `language-${lang}`)),
);
AMMONIA_BUILDER.allowedClasses.set("a", new Set(["anchor"]));
AMMONIA_BUILDER.tagAttributes.get("a")!.add("aria-hidden");
AMMONIA_BUILDER.tagAttributes.get("a")!.add("tabindex");
AMMONIA_BUILDER.tagAttributes.get("a")!.add("id");
const AMMONIA = AMMONIA_BUILDER.build();

const OCTICON_SVG =
  `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="octicon octicon-link"><path fill-rule="evenodd" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"/></svg></a>`;

/** Render a markdown file to HTML. */
export function renderMarkdown(markdown: string): string {
  // Replace any relative links that end in `.md` with the same link without the
  // `.md`. This ensures that links to other markdown go to HTML pages, not the
  // raw markdown pages.
  markdown = markdown.replaceAll(
    /\[[^\]]*\]\((\.[^\)]*\.md)\)/g,
    (match, path) => {
      return match.replace(path, path.substring(0, path.length - 3));
    },
  );

  // Render the markdown to HTML.
  let html = comrak.markdownToHTML(markdown, COMRAK_OPTIONS);

  // Sanitize the HTML using ammonia.
  html = AMMONIA.clean(html);

  // Inject the octicon icon into header links.
  html = html.replaceAll(
    /<a href="#[a-zA-Z\d-]*" aria-hidden="true" class="anchor" id="[a-zA-Z\d-]*" rel="noopener noreferrer"><\/a>/g,
    (match) =>
      match.replace("</a>", OCTICON_SVG)
        .replace(`aria-hidden="true"`, `aria-hidden="true" tabindex="-1"`),
  );

  return html;
}

/** Turn an arbitrary string into unformatted HTML. */
export function sanitizeText(html: string): string {
  return ammonia.cleanText(html);
}

/** Render a table of contents to HTML. */
export function renderToC(
  toc: TableOfContents,
  version: VersionInfo,
  currentPath: string,
) {
  let html = `<ol class="list">`;
  for (const item of toc.listItems()) {
    const path = `/${version.version}/${sanitizeText(item.slug)}`;
    const isActive = path === currentPath;
    const childrenHtml = item.children.map((child) => {
      const childPath = `${path}/${sanitizeText(child.slug)}`;
      const isActive = childPath === currentPath;
      return `<li${
        isActive ? ` class="active" aria-current="page"` : ""
      }><a href="${childPath}">${sanitizeText(child.name)}</a></li>`;
    }).join("\n");
    html += `<li${
      isActive ? ` class="active" aria-current="page"` : ""
    }><a href="${path}">${
      sanitizeText(item.name)
    }</a><ol class="list">${childrenHtml}</ol></li>\n`;
  }
  html += `</ol>`;
  return html;
}