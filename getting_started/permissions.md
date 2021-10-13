## Permissions

Deno is secure by default. Therefore, unless you specifically enable it, a
program run with Deno has no file, network, or environment access. Access to
security sensitive functionality requires that permissions have been granted to
an executing script through command line flags, or a runtime permission prompt.

For the following example `mod.ts` has been granted read-only access to the file
system. It cannot write to the file system, or perform any other security
sensitive functions.

```shell
deno run --allow-read mod.ts
```

### Permissions list

The following permissions are available:

- **--allow-env=\<allow-env\>** Allow environment access for things like getting
  and setting of environment variables. Since Deno 1.9, you can specify an
  optional, comma-separated list of environment variables to provide an
  allow-list of allowed environment variables.
- **--allow-hrtime** Allow high-resolution time measurement. High-resolution
  time can be used in timing attacks and fingerprinting.
- **--allow-net=\<allow-net\>** Allow network access. You can specify an
  optional, comma-separated list of IP addresses or hostnames (optionally with
  ports) to provide an allow-list of allowed network addresses.
- **--allow-ffi** Allow loading of dynamic libraries. Be aware that dynamic
  libraries are not run in a sandbox and therefore do not have the same security
  restrictions as the Deno process. Therefore, use with caution. Please note
  that --allow-ffi is an unstable feature.
- **--allow-read=\<allow-read\>** Allow file system read access. You can specify
  an optional, comma-separated list of directories or files to provide an
  allow-list of allowed file system access.
- **--allow-run=\<allow-run\>** Allow running subprocesses. Since Deno 1.9, You
  can specify an optional, comma-separated list of subprocesses to provide an
  allow-list of allowed subprocesses. Be aware that subprocesses are not run in
  a sandbox and therefore do not have the same security restrictions as the Deno
  process. Therefore, use with caution.
- **--allow-write=\<allow-write\>** Allow file system write access. You can
  specify an optional, comma-separated list of directories or files to provide
  an allow-list of allowed file system access.
- **-A, --allow-all** Allow all permissions. This enables all security sensitive
  functions. Use with caution.

### Configurable permissions

Some permissions allow you to grant access to a specific list of entities
(files, servers, etc) rather than to everything.

#### File system access

This example restricts file system access by allowing read-only access to the
`/usr` directory. In consequence the execution fails as the process was
attempting to read a file in the `/etc` directory:

```shell
$ deno run --allow-read=/usr https://deno.land/std@$STD_VERSION/examples/cat.ts /etc/passwd
error: Uncaught PermissionDenied: read access to "/etc/passwd", run again with the --allow-read flag
► $deno$/dispatch_json.ts:40:11
    at DenoError ($deno$/errors.ts:20:5)
    ...
```

Try it out again with the correct permissions by allowing access to `/etc`
instead:

```shell
deno run --allow-read=/etc https://deno.land/std@$STD_VERSION/examples/cat.ts /etc/passwd
```

`--allow-write` works the same as `--allow-read`.

> Note for Windows users: the `/etc` and `/usr` directories and the
> `/etc/passwd` file do not exist on Windows. If you want to run this example
> yourself, replace `/etc/passwd` with `C:\Windows\System32\Drivers\etc\hosts`,
> and `/usr` with `C:\Users`.

#### Network access

```js
// fetch.js
const result = await fetch("https://deno.land/");
```

This is an example of how to allow network access to specific hostnames or ip
addresses, optionally locked to a specified port:

```shell
# Multiple hostnames, all ports allowed
deno run --allow-net=github.com,deno.land fetch.js

# A hostname at port 80:
deno run --allow-net=deno.land:80 fetch.js

# An ipv4 address on port 443
deno run --allow-net=1.1.1.1:443 fetch.js

# A ipv6 address, all ports allowed
deno run --allow-net=[2606:4700:4700::1111] fetch.js
```

If `fetch.js` tries to establish network connections to any hostname or IP not
explicitly allowed, the relevant call will throw an exception.

Allow net calls to any hostname/ip:

```shell
deno run --allow-net fetch.js
```

#### Environment variables

```js
// env.js
Deno.env.get("HOME");
```

This is an example of how to allow access to environment variables:

```shell
# Allow all environment variables
deno run --allow-env env.js

# Allow access to only the HOME env var
deno run --allow-env=HOME env.js
```

> Note for Windows users: environment variables are case insensitive on Windows,
> so Deno also matches them case insensitively (on Windows only).

#### Subprocess permissions

Subprocesses are very powerful, and can be a little scary: they access system
resources irregardless of the permissions you granted to the Deno process that
spawns them. The `cat` program on unix systems can be used to read files from
disk. If you start this program through the `Deno.run` API it will be able to
read files from disk even if the parent Deno process can not read the files
directly. This is often referred to as privilege escalation.

Because of this, make sure you carefully consider if you want to grant a program
`--allow-run` access: it essentially invalidates the Deno security sandbox. If
you really need to spawn a specific executable, you can reduce the risk by
limiting which programs a Deno process can start by passing specific executable
names to the `--allow-run` flag.

```js
// run.js
const proc = Deno.run({ cmd: ["whoami"] });
```

```shell
# Allow only spawning a `whoami` subprocess:
deno run --allow-run=whoami run.js

# Allow running any subprocess:
deno run --allow-run run.js
```

You can only limit the executables that are allowed; if permission is granted to
execute it then any parameters can be passed. For example if you pass
`--allow-run=cat` then the user can use `cat` to read any file.

### Conference

Permission flags were explained by Ryan Dahl in his 2020 talk about the Deno
security model at Speakeasy JS:
https://www.youtube.com/watch?v=r5F6dekUmdE#t=34m57
