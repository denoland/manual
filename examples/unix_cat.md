# An Implementation of the Unix "cat" Program

## Concepts

- Use the Deno runtime API to output the contents of a file to the console.
- [Deno.args](https://api?s=Deno.args) accesses the command line arguments.
- [Deno.open](/api?s=Deno.open) is used to get a handle to a file.
- [copy](/std@$STD_VERSION/streams/conversion.ts?s=copy) is used to transfer
  data from the file to the output stream.
- Files should be closed when you are finished with them
- Modules can be run directly from remote URLs.

## Example

In this program each command-line argument is assumed to be a filename, the file
is opened, and printed to stdout (e.g. the console).

```ts
/**
 * cat.ts
 */
import { copy } from "https://deno.land/std@$STD_VERSION/streams/conversion.ts";
for (const filename of Deno.args) {
  const file = await Deno.open(filename);
  await copy(file, Deno.stdout);
  file.close();
}
```

To run the program:

```shell
deno run --allow-read https://deno.land/std@$STD_VERSION/examples/cat.ts /etc/passwd
```
