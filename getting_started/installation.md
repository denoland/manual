## Installation

Deno works on macOS, Linux, and Windows. Deno is a single binary executable. It
has no external dependencies.

On macOS, both M1 (arm64) and Intel (x64) executables are provided. On Linux and
Windows, only x64 is supported.

### Download and install

[deno_install](https://github.com/denoland/deno_install) provides convenience
scripts to download and install the binary.

Using Shell (macOS and Linux):

```shell
curl -fsSL https://deno.land/x/install/install.sh | sh
```

Using PowerShell (Windows):

```shell
iwr https://deno.land/x/install/install.ps1 -useb | iex
```

Using [Scoop](https://scoop.sh/) (Windows):

```shell
scoop install deno
```

Using [Chocolatey](https://chocolatey.org/packages/deno) (Windows):

```shell
choco install deno
```

Using [Homebrew](https://formulae.brew.sh/formula/deno) (macOS):

```shell
brew install deno
```

Using [Nix](https://nixos.org/download.html) (macOS and Linux):

```shell
nix-shell -p deno
```

Build and install from source using [Cargo](https://crates.io/crates/deno):

```shell
cargo install deno --locked
```

Deno binaries can also be installed manually, by downloading a zip file at
[github.com/denoland/deno/releases](https://github.com/denoland/deno/releases).
These packages contain just a single executable file. You will have to set the
executable bit on macOS and Linux.

### Docker

For more information and instructions on the official Docker images:
[https://github.com/denoland/deno_docker](https://github.com/denoland/deno_docker)

### Testing your installation

To test your installation, run `deno --version`. If this prints the Deno version
to the console the installation was successful.

Use `deno help` to see help text documenting Deno's flags and usage. Get a
detailed guide on the CLI [here](./command_line_interface.md).

### Updating

To update a previously installed version of Deno, you can run:

```shell
deno upgrade
```

This will fetch the latest release from
[github.com/denoland/deno/releases](https://github.com/denoland/deno/releases),
unzip it, and replace your current executable with it.

You can also use this utility to install a specific version of Deno:

```shell
deno upgrade --version 1.0.1
```

### Building from source

Information about how to build from source can be found in the
[`Contributing`](../contributing/building_from_source.md) chapter.
