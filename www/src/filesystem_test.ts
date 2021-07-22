import { assert, assertEquals } from "../test_deps.ts";
import { FileSystem, normalizeURLPath } from "./filesystem.ts";
import { VersionInfo, VersionType } from "./versions.ts";

const URL_NORMALIZATION_CASES: [string, string | null][] = [
  ["/", "/"],
  ["", "/"],
  ["/foo", "/foo"],
  ["/../foo", "/foo"],
  ["/foo/bar", "/foo/bar"],
  ["/foo/../bar", "/bar"],
  ["/foo/./bar", "/foo/bar"],
  ["/foo bar", "/foo%20bar"],
  ["https://deno.land", "/https://deno.land"],
];

for (const [version, expected] of URL_NORMALIZATION_CASES) {
  Deno.test(`normalize url path: '${version}'`, () => {
    const actual = normalizeURLPath(version);
    assertEquals(actual, expected);
  });
}

const SOURCE_URL_CASES: [VersionInfo, string, string | null, number | null][] =
  [
    [
      {
        type: VersionType.Preview,
        version: "b54017ffac827d1b6be1f33955c055aac75610a1",
      },
      "introduction.md",
      "https://raw.githubusercontent.com/denoland/manual/b54017ffac827d1b6be1f33955c055aac75610a1/introduction.md",
      2692,
    ],
    [
      {
        type: VersionType.Release,
        version: "1.0.0",
        inOldRepo: true,
      },
      "introduction.md",
      "https://deno.land/x/deno@v1.0.0/docs/introduction.md",
      3146,
    ],
    [
      {
        type: VersionType.Release,
        version: "1.0.0-rc2",
        inOldRepo: true,
      },
      "introduction.md",
      "https://deno.land/x/deno@v1.0.0-rc2/docs/introduction.md",
      3146,
    ],
    [
      {
        type: VersionType.Release,
        version: "1.12.1",
        inOldRepo: false,
      },
      "introduction.md",
      "https://deno.land/x/manual@v1.12.1/introduction.md",
      2692,
    ],
    [
      {
        type: VersionType.Release,
        version: "1.12.1",
        inOldRepo: false,
      },
      "../introduction.md",
      "https://deno.land/x/manual@v1.12.1/introduction.md",
      2692,
    ],
    [
      {
        type: VersionType.Release,
        version: "1.12.1",
        inOldRepo: false,
      },
      "/getting_started/installation.md",
      "https://deno.land/x/manual@v1.12.1/getting_started/installation.md",
      2213,
    ],
    [
      {
        type: VersionType.Release,
        version: "1.12.1",
        inOldRepo: false,
      },
      "/does_not_exist.md",
      "https://deno.land/x/manual@v1.12.1/does_not_exist.md",
      null,
    ],
    [
      {
        type: VersionType.Local,
        version: "local",
      },
      "introduction.md",
      null,
      null,
    ],
  ];

for (const [version, path, expectedUrl, expectedLength] of SOURCE_URL_CASES) {
  const fs = new FileSystem();
  Deno.test(`fs source url: '${path}' @ '${version.version}'`, () => {
    const actual = fs.sourceUrl(version, path);
    assertEquals(actual?.href ?? null, expectedUrl);
  });

  Deno.test(`fs read all: '${path}' @ '${version.version}'`, async () => {
    const actual = await fs.readAll(version, path);
    assertEquals(actual?.byteLength ?? null, expectedLength);
  });
}

Deno.test("fs source url: 'introduction.md' @ 'local'", () => {
  const fs = new FileSystem({ localEnabled: true });
  const version: VersionInfo = { type: VersionType.Local, version: "local" };
  const actual = fs.sourceUrl(version, "introduction.md");
  assert(actual);
  assertEquals(actual.protocol, "file:");
  assert(actual.href.endsWith("/introduction.md"));
});

Deno.test("fs read all: 'introduction.md' @ 'local'", async () => {
  const fs = new FileSystem({ localEnabled: true });
  const version: VersionInfo = { type: VersionType.Local, version: "local" };
  const actual = await fs.readAll(version, "introduction.md");
  assert(actual!.byteLength > 0);
});
