# An Implementation of the Unix "cat" Program

## Concepts

- Use the Deno runtime API to output the contents of a file to the console.
- [Deno.args](/api?s=Deno.args) accesses the command line arguments.
- [Deno.open](/api?s=Deno.open) is used to get a handle to a file.
- [Deno.stdout.writable](/api?s=Deno.stdout.writable) is used to get a writable
  stream to the console standard output.
- [Deno.FsFile.readable](/api?s=Deno.FsFile#prop_readable) is used to get a
  readable stream from the file. (This readable stream closes the file when it
  is finished reading, so it is not necessary to close the file explicitly.)
- Modules can be run directly from remote URLs.

## Example

In this program each command-line argument is assumed to be a filename, the file
is opened, and printed to stdout (e.g. the console).

```ts
/**
 * cat.ts
 */
for (const filename of Deno.args) {
  const file = await Deno.open(filename);
  await file.readable.pipeTo(Deno.stdout.writable);
}
```

To run the program:

```shell
deno run --allow-read deno:std@$STD_VERSION/examples/cat.ts /etc/passwd
```
