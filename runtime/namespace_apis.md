# Namespace API

The global Deno namespace contains APIs that are not web standard, including
APIs for reading from files, opening TCP sockets, serving HTTP, and executing
subprocesses, etc.

For a full list of Deno Namespace APIs, see the
[reference](https://deno.land/api@v$CLI_VERSION?s=Deno). Below we highlight some
of the most important.

## Errors

The Deno runtime comes with
[19 error classes](https://deno.land/api@v$CLI_VERSION#Errors) that can be
raised in response to a number of conditions.

Some examples are:

```sh
Deno.errors.NotFound;
Deno.errors.WriteZero;
```

They can be used as below:

```ts
try {
  const file = await Deno.open("./some/file.txt");
} catch (error) {
  if (error instanceof Deno.errors.NotFound) {
    console.error("the file was not found");
  } else {
    // otherwise re-throw
    throw error;
  }
}
```

## File System

The Deno runtime comes with
[various functions for working with files and directories](https://deno.land/api@v$CLI_VERSION#File_System).
You will need to use --allow-read and --allow-write permissions to gain access
to the file system.

Refer to the links below for code examples of how to use the file system
functions.

- [Reading files in several different ways](https://examples.deno.land/reading-files)
- [Reading files in streams](https://deno.land/manual@v$CLI_VERSION/examples/file_server)
- [Reading a text file (`Deno.readTextFile`)](https://deno.land/manual@v$CLI_VERSION/examples/read_write_files#reading-a-text-file)
- [Writing a text file (`Deno.writeTextFile`)](https://deno.land/manual@v$CLI_VERSION/examples/read_write_files#writing-a-text-file)

## I/O

The Deno runtime comes with
[built-in functions for working with resources and I/O](https://deno.land/api@v$CLI_VERSION#I/O).

Refer to the links below for code examples for common functions.

- [Closing resources (`Deno.close`)](https://doc.deno.land/deno/stable/~/Deno.close)
- [Seeking a certain position within the resource (`Deno.seek`)](https://doc.deno.land/deno/stable/~/Deno.seek)

## Network

The Deno runtime comes with
[built-in functions for dealing with connections to network ports](https://deno.land/api@v$CLI_VERSION#Network).

Refer to the links below for code examples for common functions.

- [Connect to the hostname and port (`Deno.connect`)](https://doc.deno.land/deno/stable/~/Deno.connect)
- [Announcing on the local transport address (`Deno.listen`)](https://doc.deno.land/deno/stable/~/Deno.listen)

## Sub Process

The Deno runtime comes with
[built-in functions for spinning up subprocesses](https://deno.land/api@v$CLI_VERSION#Sub_Process).

Refer to the links below for code samples of how to create a subprocess.

- [Creating a subprocess (`Deno.run`)](https://deno.land/manual@v$CLI_VERSION/examples/subprocess)
