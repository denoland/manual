# Making Scripts Executable With #!Shebang

## Concepts

- [Deno.env] provides the environment variables.
- [env] runs a program in a modified environment.

## Overview

Making Deno scripts executable can be useful if you want to make, for example,
small tools.

## Example

In this program we give the context permission to access the environment
variables and print the Deno installation path.

```ts, ignore
#!/usr/bin/env -S deno run --allow-env

/**
 *  shebang.ts
 */

const path = Deno.env.get("DENO_INSTALL");

console.log("Deno Install Path:", path);
```

### Permissions

You may require to give the script execution permissions.

#### Linux

```shell
sudo chmod +x shebang.ts
```

### Execute

Start the script by calling it like any other command:

```shell
./shebang.ts
```

## Details

- A shebang has to be placed in the first line.

- `-S` splits the command into arguments.

<!----------------------------------------------------------------------------->

[Deno.env]: /api?s=Deno.env
[env]: https://www.man7.org/linux/man-pages/man1/env.1.html
