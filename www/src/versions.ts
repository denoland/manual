import { semver } from "../deps.ts";
import {
  cliToStd as cliToStdVersions,
  std as stdVersions,
} from "../versions.ts";

export type VersionInfo = {
  type: VersionType.Preview | VersionType.Local;
  version: string;
  stdVersion: string;
} | {
  type: VersionType.Release;
  version: string;
  stdVersion: string;
  /** If the version is a release where the docs still lived in the denoland/deno repo. */
  inOldRepo: boolean;
};

export enum VersionType {
  Release = "release",
  Preview = "preview",
  Local = "local",
}

const GIT_HASH_REGEXP = /^[\da-f]{40}$/;

export function normalizeVersion(version: string): VersionInfo | null {
  if (version === "local") {
    return {
      version: "local",
      type: VersionType.Local,
      stdVersion: stdVersions[0],
    };
  }
  if (GIT_HASH_REGEXP.test(version)) {
    return { version, type: VersionType.Preview, stdVersion: stdVersions[0] };
  }
  const cleaned = semver.clean(version);
  if (cleaned === null) return null;
  const inOldRepo = releaseFromOldRepo(cleaned);
  return {
    version: cleaned,
    type: VersionType.Release,
    inOldRepo,
    stdVersion: cliToStdVersions[cleaned],
  };
}

export function releaseFromOldRepo(version: string): boolean {
  return semver.lte(version, "1.12.0");
}
