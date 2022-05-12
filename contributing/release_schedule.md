## Release Schedule

A new minor release for the `deno` cli is released every month, on the third
Thursday of the month.

There are usually two or three patch releases (done weekly) after a minor
releases; after that a merge window for new features opens for the upcoming
minor release.

The release dates for the upcoming minor releases are:

- 1.20.0: March 16, 2022
- 1.21.0: April 20, 2022
- 1.22.0: May 19, 2022

Stable releases can be found on the
[GitHub releases page](https://github.com/denoland/deno/releases).

### Canary channel

In addition to the stable channel described above, canaries are released
multiple times daily (for each commit on main). You can upgrade to the latest
canary release by running:

```
deno upgrade --canary
```

To update to a specific canary, pass the commit hash in the `--version` option:

```
deno upgrade --canary --version=973af61d8bb03c1709f61e456581d58386ed4952
```

To switch back to the stable channel, run `deno upgrade`.

Canaries can be downloaded from https://dl.deno.land.
