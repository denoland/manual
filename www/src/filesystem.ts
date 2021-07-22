//! This module is responsible for returning the raw source of a file based on
//! its name and a version.

import { join, toFileUrl } from "../deps.ts";
import { VersionInfo, VersionType } from "./versions.ts";

export class FileSystem {
  #localEnabled = true;

  constructor(opts: { localEnabled?: boolean } = {}) {
    this.#localEnabled = opts.localEnabled ?? false;
  }

  async readAll(
    version: VersionInfo,
    path: string,
  ): Promise<Uint8Array | null> {
    const url = this.sourceUrl(version, path);
    if (url === null) return null;
    switch (url.protocol) {
      case "file:": {
        const buf = await Deno.readFile(url);
        return buf;
      }
      case "https:": {
        const resp = await fetch(url);
        if (resp.status !== 200) {
          await resp.body?.cancel();
          if (resp.status === 404) return null;
          throw new Error(`Fetching '${url}' failed: ${resp.status}`);
        }
        const ab = await resp.arrayBuffer();
        return new Uint8Array(ab);
      }
      default: {
        throw new Error(`Unsupported protocol: ${url.protocol}`);
      }
    }
  }

  sourceUrl(version: VersionInfo, path: string): URL | null {
    // Normalize the provided path
    const normalizedPath = normalizeURLPath(path);
    if (normalizedPath === null) return null;

    switch (version.type) {
      case VersionType.Local: {
        if (!this.#localEnabled) {
          // If local file access is not enabled, don't allow "local" versions.
          return null;
        }
        const path = join(Deno.cwd(), normalizedPath);
        return toFileUrl(path);
      }
      case VersionType.Preview: {
        return new URL(
          `https://raw.githubusercontent.com/denoland/manual/${version.version}${normalizedPath}`,
        );
      }
      case VersionType.Release: {
        if (version.inOldRepo) {
          return new URL(
            `https://deno.land/x/deno@v${version.version}/docs${normalizedPath}`,
          );
        } else {
          return new URL(
            `https://deno.land/x/manual@v${version.version}${normalizedPath}`,
          );
        }
      }
    }
  }
}

// Normalize a path for use in a URL. Returns null if the path is unparsable.
export function normalizeURLPath(path: string): string | null {
  try {
    const pathUrl = new URL("file:///");
    pathUrl.pathname = path;
    return pathUrl.pathname;
  } catch {
    return null;
  }
}
