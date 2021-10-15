//! This module is responsible for preparing and rendering the markdown files in
//! the manual.

import { render } from "../deps.ts";
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
