import { FileSystem, normalizeURLPath } from "./filesystem.ts";
import { VersionInfo } from "./versions.ts";

type RawTableOfContents = Record<string, RawTableOfContentsItem>;

interface RawTableOfContentsItem {
  name: string;
  children: Record<string, string>;
}

export class TableOfContents {
  #raw: RawTableOfContents;

  constructor(raw: RawTableOfContents) {
    this.#raw = raw;
  }

  static async fromFs(
    fs: FileSystem,
    version: VersionInfo,
  ): Promise<TableOfContents | null> {
    const data = await fs.readAll(version, "/toc.json");
    if (data === null) return null;
    const text = new TextDecoder().decode(data);
    const raw = JSON.parse(text);
    return new TableOfContents(raw);
  }

  getName(path: string): string | null {
    const normalizedPath = normalizeURLPath(path);
    if (normalizedPath === null) return null;
    const [, a, b, ...rest] = normalizedPath.split("/");
    if (rest.length > 0 || a === undefined) return null;
    if (b === undefined) return this.#raw[a]?.name ?? null;
    return this.#raw[a]?.children[b] ?? null;
  }

  listItems(): Array<{
    name: string;
    slug: string;
    children: Array<{ name: string; slug: string }>;
  }> {
    return Object.entries(this.#raw).map(([slug, item]) => {
      const children = Object.entries(item.children ?? {}).map((
        [childSlug, childName],
      ) => ({
        name: childName,
        slug: childSlug,
      }));
      return {
        name: item.name,
        slug: slug,
        children,
      };
    });
  }
}
