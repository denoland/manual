//! This module is responsible for preparing and rendering the markdown files in
//! the manual.

import { entityDecode, marked, render } from "../deps.ts";
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

/** Render a markdown file to HTML. */
export function renderMarkdown(markdown: string, baseUrl: string): string {
  // Replace any relative links that end in `.md` with the same link without the
  // `.md`. This ensures that links to other markdown go to HTML pages, not the
  // raw markdown pages.
  markdown = markdown.replaceAll(
    /\[[^\]]*\]\((\.[^\)]*\.md)\)/g,
    (match, path) => {
      return match.replace(path, path.substring(0, path.length - 3));
    },
  );

  return render(markdown, baseUrl);
}

class SummaryRenderer extends marked.Renderer {
  constructor() {
    super();
  }

  blockquote(quote: string) {
    return `"${entityDecode(quote)}"`;
  }

  br() {
    return " ";
  }

  checkbox() {
    return "";
  }

  code() {
    return "";
  }

  codespan(code: string) {
    return `${entityDecode(code)}`;
  }

  del(text: string) {
    return entityDecode(text);
  }

  em(text: string) {
    return entityDecode(text);
  }

  heading() {
    return "";
  }

  hr() {
    return "\n";
  }

  html() {
    return "";
  }

  image() {
    return "";
  }

  link(_href: string, _title: string, text: string) {
    return entityDecode(text);
  }

  list(body: string) {
    return body.trim();
  }

  listitem(text: string) {
    text = entityDecode(text);
    if (/\.\s*$/.test(text)) {
      return text + " ";
    } else {
      return text.replace(/(\s*)$/, ".$1") + " ";
    }
  }

  paragraph(text: string) {
    if (text === "") {
      return "";
    }
    return entityDecode(text) + "\n\n";
  }

  strong(text: string) {
    return entityDecode(text);
  }

  table() {
    return "";
  }

  tablecell() {
    return "";
  }

  tablerow() {
    return "";
  }

  text(text: string) {
    return entityDecode(text);
  }
}

export function summarizeMarkdown(markdown: string) {
  const summaryRenderer = new SummaryRenderer();
  let full = marked(markdown, { renderer: summaryRenderer });

  // Logic taken from https://github.com/fiatjaf/extract-summary/blob/master/index.js.
  // MIT license: https://github.com/fiatjaf/extract-summary/blob/master/package.json#L20
  const chars = full.split("");
  let summary = "";
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    summary += ch;
    if (
      (ch === "." && chars[i + 1] === "\n" && summary.length > 80) ||
      (ch === "." && chars[i + 1] === " " && summary.length > 80) ||
      (ch === "\n" && chars[i + 1] === "\n" && summary.length > 80)
    ) {
      // paragraph
      break;
    }
    if (ch === " " && summary.length >= 165) {
      // word break
      break;
    }
    if (summary.length > 180) {
      // hard limit
      summary = summary.slice(0, 170);
      break;
    }
  }

  return summary;
}
