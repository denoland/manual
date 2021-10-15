import { assertEquals } from "../test_deps.ts";
import { std as stdVersions } from "../versions.ts";
import { normalizeVersion, VersionInfo, VersionType } from "./versions.ts";

const cases: [string, VersionInfo | null][] = [
  ["v1.12.1", {
    type: VersionType.Release,
    version: "1.12.1",
    inOldRepo: false,
    stdVersion: "0.102.0",
  }],
  ["1.12.1", {
    type: VersionType.Release,
    version: "1.12.1",
    inOldRepo: false,
    stdVersion: "0.102.0",
  }],
  ["1.12.0", {
    type: VersionType.Release,
    version: "1.12.0",
    inOldRepo: true,
    stdVersion: "0.101.0",
  }],
  ["1.11.1", {
    type: VersionType.Release,
    version: "1.11.1",
    inOldRepo: true,
    stdVersion: "0.99.0",
  }],
  ["0.42.0", {
    type: VersionType.Release,
    version: "0.42.0",
    inOldRepo: true,
    stdVersion: "0.42.0",
  }],
  ["a.0.0", null],
  ["b54017ffac827d1b6be1f33955c055aac75610a1", {
    type: VersionType.Preview,
    version: "b54017ffac827d1b6be1f33955c055aac75610a1",
    stdVersion: stdVersions[0],
  }],
  ["b54017ffac827d1b6be1f33955c055aac75610a1a", null],
  ["B54017ffac827d1b6be1f33955c055aac75610a1", null],
  ["b54017ffac827d1b6be1f33955c055aac75610a", null],
];

for (const [version, expected] of cases) {
  Deno.test(`normalize version: '${version}'`, () => {
    const actual = normalizeVersion(version);
    assertEquals(actual, expected);
  });
}
