//! This module is responsible for preparing and rendering the markdown files in
//! the manual.

import { ammonia, pulldown } from "../deps.ts";
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
export function renderMarkdown(markdown: string): string {
  const html = pulldown.html(markdown, {
    footnotes: true,
    smartPunctuation: true,
    strikethrough: true,
    tables: true,
    tasklists: true,
  });
  return ammonia.clean(html);
}
