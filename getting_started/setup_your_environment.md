## Set up your environment

The Deno CLI contains a lot of the tools that are commonly needed for developing
applications, including a full language server to help power your IDE of choice.
[Installing](./installation.md) is all you need to do to make these
[tools](./command_line_interface.md) available to you.

Outside of using Deno with your favorite IDE, this section also documents
[shell completions](#shell-completions) and
[environment variables](#environment-variables).

### Using an editor/IDE

There is broad support for Deno in editors/IDEs. The following sections provide
information about how to use Deno with editors. Most editors integrate directly
into Deno using the Language Server Protocol and the language server that is
integrated into the Deno CLI.

If you are trying to write or support a community integration to the Deno
language server, there is some
[documentation](https://github.com/denoland/deno/tree/main/cli/lsp#deno-language-server)
located in the Deno CLI code repository, but also feel free to join the
[Discord community](https://discord.gg/deno) in the `#dev-lsp` channel.

#### Visual Studio Code

There is an official extension for
[Visual Studio Code](https://code.visualstudio.com/) called
[vscode_deno](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno).
When installed, it will connect to the language server built into the Deno CLI.

Because most people work in mixed environments, the extension does not enable a
workspace as _Deno enabled_ by default, and it requires that the
`"deno.enabled"` flag to be set. You can change the settings yourself, or you
can choose `Deno: Initialize Workspace Configuration` from the command palette
to enable your project.

More information can be found in the
[Using Visual Studio Code](../vscode_deno.md) section of the manual.

#### JetBrains' IntelliJ IDEA and WebStorm

Currently support for [JetBrains](https://www.jetbrains.com/) IDEs is available
through [the Deno plugin](https://plugins.jetbrains.com/plugin/14382-deno).

Once installed, replace the content of
`External Libraries > Deno Library > lib > lib.deno.d.ts` with the output of
`deno types`. This will ensure the typings for the extension match the current
version. You will have to do this every time you update the version of Deno. For
more information on how to set-up your JetBrains IDE for Deno, read
[this comment](https://youtrack.jetbrains.com/issue/WEB-41607#focus=streamItem-27-4160152.0-0)
on YouTrack.

JetBrain's is considering migrating to the Deno language server (see:
[YouTrack WEB-48625](https://youtrack.jetbrains.com/issue/WEB-48625)). If you
are a user of JetBrains and Deno, voicing your support can continue help
JetBrains prioritize support.

#### vim/Neovim

Deno is well supported on both [vim](https://www.vim.org/) and
[Neovim](https://neovim.io/) via
[coc.nvim](https://github.com/neoclide/coc.nvim) and
[ALE](https://github.com/dense-analysis/ale). coc.nvim offers plugins to
integrate to the Deno language server while ALE supports it _out of the box_.

##### coc.nvim

Once you have
[coc.nvim installed](https://github.com/neoclide/coc.nvim/wiki/Install-coc.nvim)
installed, you need to install the required plugins via
`:CocInstall coc-tsserver coc-deno`.

Once the plugins are installed and you want to enable Deno for a workspace, run
the command `:CocCommand deno.initializeWorkspace` and you should be able to
utilize commands like `gd` (goto definition) and `gr` (go/find references).

##### ALE

ALE supports Deno via the Deno language server out of the box and in many uses
cases doesn't require additional configuration. Once you have
[ALE installed](https://github.com/dense-analysis/ale#installation) you can
perform the command
[`:help ale-typescript-deno`](https://github.com/dense-analysis/ale/blob/master/doc/ale-typescript.txt)
to get information on the configuration options available.

For more information on how to setup ALE (like key bindings) refer to the
[official documentation](https://github.com/dense-analysis/ale#usage).

#### Emacs

##### lsp-mode

Emacs supports Deno via the Deno language server using
[lsp-mode](https://emacs-lsp.github.io/lsp-mode/). Once
[lsp-mode is installed](https://emacs-lsp.github.io/lsp-mode/page/installation/)
it should support Deno, which can be
[configured](https://emacs-lsp.github.io/lsp-mode/page/lsp-deno/) to support
various settings.

##### eglot

You can also use built-in Deno language server by using
[`eglot`](https://github.com/joaotavora/eglot).

An example configuration for Deno via eglot:

```elisp
(add-to-list 'eglot-server-programs '((js-mode typescript-mode) . (eglot-deno "deno" "lsp")))

  (defclass eglot-deno (eglot-lsp-server) ()
    :documentation "A custom class for deno lsp.")

  (cl-defmethod eglot-initialization-options ((server eglot-deno))
    "Passes through required deno initialization options"
    (list :enable t
    :lint t))
```

#### Atom

The [Atom editor](https://atom.io) supports integrating with the Deno language
server via the [atom-ide-deno](https://atom.io/packages/atom-ide-deno) package.
`atom-ide-deno` requires that the Deno CLI be installed and the
[atom-ide-base](https://atom.io/packages/atom-ide-base) package to be installed
as well.

#### Sublime Text

[Sublime Text](https://www.sublimetext.com/) supports connecting to the Deno
language server via the [LSP package](https://packagecontrol.io/packages/LSP).
You may also want to install the
[TypeScript package](https://packagecontrol.io/packages/TypeScript) to get full
syntax highlighting.

Once you have the LSP package installed, you will want to add configuration to
your `.sublime-project` configuration like the below:

```jsonc
{
  "settings": {
    "LSP": {
      "deno": {
        "command": [
          "deno",
          "lsp"
        ],
        "initializationOptions": {
          // "config": "", // Sets the path for the config file in your project
          "enable": true,
          // "importMap": "", // Sets the path for the import-map in your project
          "lint": true,
          "unstable": false
        },
        "enabled": true,
        "languages": [
          {
            "languageId": "javascript",
            "scopes": ["source.js"],
            "syntaxes": [
              "Packages/Babel/JavaScript (Babel).sublime-syntax",
              "Packages/JavaScript/JavaScript.sublime-syntax"
            ]
          },
          {
            "languageId": "javascriptreact",
            "scopes": ["source.jsx"],
            "syntaxes": [
              "Packages/Babel/JavaScript (Babel).sublime-syntax",
              "Packages/JavaScript/JavaScript.sublime-syntax"
            ]
          },
          {
            "languageId": "typescript",
            "scopes": ["source.ts"],
            "syntaxes": [
              "Packages/TypeScript-TmLanguage/TypeScript.tmLanguage",
              "Packages/TypeScript Syntax/TypeScript.tmLanguage"
            ]
          },
          {
            "languageId": "typescriptreact",
            "scopes": ["source.tsx"],
            "syntaxes": [
              "Packages/TypeScript-TmLanguage/TypeScriptReact.tmLanguage",
              "Packages/TypeScript Syntax/TypeScriptReact.tmLanguage"
            ]
          }
        ]
      }
    }
  }
}
```

#### GitHub Codespaces

[GitHub Codespaces](https://github.com/features/codespaces) allows you develop
fully online or remotely on your local machine without needing to configure or
install Deno. It is currently in early access.

If a project is a Deno enabled project and contains the `.devcontainer`
configuration as part of the repository, opening the project in GitHub
Codespaces should just "work". If you are starting a new project, or you want to
add Deno support to an existing code space, it can be added by selecting the
`Codespaces: Add Development Container Configuration Files...` from the command
pallet and then selecting `Show All Definitions...` and then searching for the
`Deno` definition.

Once selected, you will need to rebuild your container so that the Deno CLI is
added to the container. After the container is rebuilt, the code space will
support Deno.

#### Kakoune

[Kakoune](http://kakoune.org/) supports connecting to the Deno language server
via the [kak-lsp](https://github.com/kak-lsp/kak-lsp) client. Once
[kak-lsp is installed](https://github.com/kak-lsp/kak-lsp#installation) an
example of configuring it up to connect to the Deno language server is by adding
the following to your `kak-lsp.toml`:

```toml
[language.deno]
filetypes = ["typescript", "javascript"]
roots = [".git"]
command = "deno"
args = ["lsp"]

[language.deno.initialization_options]
enable = true
lint = true
```

### Shell completions

Built into the Deno CLI is support to generate shell completion information for
the CLI itself. By using `deno completions <shell>`, the Deno CLI will output to
stdout the completions. Current shells that are supported:

- bash
- elvish
- fish
- powershell
- zsh

#### bash example

Output the completions and add them to the environment:

```
> deno completions bash > /usr/local/etc/bash_completion.d/deno.bash
> source /usr/local/etc/bash_completion.d/deno.bash
```

#### PowerShell example

Output the completions:

```
> deno completions powershell >> $profile
> .$profile
```

This will be create a Powershell profile at
`$HOME\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1`, and it
will be run whenever you launch the PowerShell.

#### zsh example

You should have a directory where the completions can be saved:

```
> mkdir ~/.zsh
```

Then output the completions:

```
> deno completions zsh > ~/.zsh/_deno
```

And ensure the completions get loaded in your `~/.zshrc`:

```shell
fpath=(~/.zsh $fpath)
autoload -Uz compinit
compinit -u
```

If after reloading your shell and completions are still not loading, you may
need to remove `~/.zcompdump/` to remove previously generated completions and
then `compinit` to generate them again.

#### zsh example with ohmyzsh and antigen

[ohmyzsh](https://github.com/ohmyzsh/ohmyzsh) is a configuration framework for
zsh and can make it easier to manage your shell configuration.
[antigen](https://github.com/zsh-users/antigen) is a plugin manager for zsh.

Create the directory to store the completions and output the completions:

```
> mkdir ~/.oh-my-zsh/custom/plugins/deno
> deno completions zsh > ~/.oh-my-zsh/custom/plugins/deno/_deno
```

Then your `.zshrc` might look something like this:

```shell
source /path-to-antigen/antigen.zsh

# Load the oh-my-zsh's library.
antigen use oh-my-zsh

antigen bundle deno
```

#### fish example

Output the completions to a `deno.fish` file into the completions directory in
the fish config folder:

```shell
deno completions fish > ~/.config/fish/completions/deno.fish
```

### Environment variables

There are a couple environment variables which can impact the behavior of Deno:

- `DENO_AUTH_TOKENS` - a list of authorization tokens which can be used to allow
  Deno to access remote private code. See the
  [Private modules and repositories](../linking_to_external_code/private.md)
  section for more details.
- `DENO_TLS_CA_STORE` - a list of certificate stores which will be used when
  establishing TLS connections. The available stores are `mozilla` and `system`.
  You can specify one, both or none. The order you specify the store determines
  the order in which certificate chains will be attempted to resolved. The
  default value is `mozilla`. The `mozilla` store will use the bundled mozilla
  certs provided by [`webpki-roots`](https://crates.io/crates/webpki-roots). The
  `system` store will use your platforms
  [native certificate store](https://crates.io/crates/rustls-native-certs). The
  exact set of mozilla certs will depend the version of Deno you are using. If
  you specify no certificate stores, then no trust will be given to any TLS
  connection without also specifying `DENO_CERT` or `--cert` or specifying a
  specific certificate per TLS connection.
- `DENO_CERT` - load a certificate authority from a PEM encoded file. This
  "overrides" the `--cert` option. See the
  [Proxies](../linking_to_external_code/proxies.md) section for more
  information.
- `DENO_DIR` - this will set the directory where cached information from the CLI
  is stored. This includes items like cached remote modules, cached transpiled
  modules, language server cache information and persisted data from local
  storage. This defaults to the operating systems default cache location and
  then under the `deno` path.
- `DENO_INSTALL_ROOT` - When using `deno install` where the installed scripts
  are stored. This defaults to `$HOME/.deno/bin`.
- `DENO_WEBGPU_TRACE` - The directory to use for WebGPU traces.
- `HTTP_PROXY` - The proxy address to use for HTTP requests. See the
  [Proxies](../linking_to_external_code/proxies.md) section for more
  information.
- `HTTPS_PROXY` - The proxy address to use for HTTPS requests. See the
  [Proxies](../linking_to_external_code/proxies.md) section for more
  information.
- `NO_COLOR` - If set, this will cause the Deno CLI to not send ASCII color
  codes when writing to stdout and stderr. See the website https://no-color.org/
  for more information on this _de facto_ standard. The value of this flag can
  be accessed at runtime without permission to read the environment variables by
  checking the value of `Deno.noColor`.
- `NO_PROXY` - Indicates hosts which should bypass the proxy set in the other
  environment variables. See the
  [Proxies](../linking_to_external_code/proxies.md) section for more
  information.
