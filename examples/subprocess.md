# Creating a Subprocess

## Concepts

- Deno is capable of spawning a subprocess via [Deno.run](/api?s=Deno.run).
- `--allow-run` permission is required to spawn a subprocess.
- Spawned subprocesses do not run in a security sandbox.
- Communicate with the subprocess via the [stdin](/api?s=Deno.stdin),
  [stdout](/api?s=Deno.stdout) and [stderr](/api?s=Deno.stderr) streams.
- Use a specific shell by providing its path/name and its string input switch,
  e.g. `Deno.run({cmd: ["bash", "-c", "ls -la"]});`

## Simple example

This example is the equivalent of running `'echo hello'` from the command line.

```ts
/**
 * subprocess_simple.ts
 */

// define command used to create the subprocess
const cmd = ["echo", "hello"];

// create subprocess
const p = Deno.run({ cmd });

// await its completion
await p.status();
```

> Note: If using Windows, the command above would need to be written differently
> because `echo` is not an executable binary (rather, it is a built-in shell
> command):

```ts
// define command used to create the subprocess
const cmd = ["cmd", "/c", "echo hello"];
```

Run it:

```shell
$ deno run --allow-run ./subprocess_simple.ts
hello
```

## Security

The `--allow-run` permission is required for creation of a subprocess. Be aware
that subprocesses are not run in a Deno sandbox and therefore have the same
permissions as if you were to run the command from the command line yourself.

## Communicating with subprocesses

By default when you use `Deno.run()` the subprocess inherits `stdin`, `stdout`
and `stderr` of the parent process. If you want to communicate with started
subprocess you can use `"piped"` option.

```ts
/**
 * subprocess.ts
 */
const fileNames = Deno.args;

const p = Deno.run({
  cmd: [
    "deno",
    "run",
    "--allow-read",
    "deno:std@$STD_VERSION/examples/cat.ts",
    ...fileNames,
  ],
  stdout: "piped",
  stderr: "piped",
});

// Reading the outputs closes their pipes
const [{ code }, rawOutput, rawError] = await Promise.all([
  p.status(),
  p.output(),
  p.stderrOutput(),
]);

if (code === 0) {
  await Deno.stdout.write(rawOutput);
} else {
  const errorString = new TextDecoder().decode(rawError);
  console.log(errorString);
}

Deno.exit(code);
```

When you run it:

```shell
$ deno run --allow-run ./subprocess.ts <somefile>
[file content]

$ deno run --allow-run ./subprocess.ts non_existent_file.md

Uncaught NotFound: No such file or directory (os error 2)
    at DenoError (deno/js/errors.ts:22:5)
    at maybeError (deno/js/errors.ts:41:12)
    at handleAsyncMsgFromRust (deno/js/dispatch.ts:27:17)
```

## Piping to files

This example is the equivalent of running `yes &> ./process_output` in bash.

```ts
/**
 * subprocess_piping_to_file.ts
 */

import { mergeReadableStreams } from "deno:std@$STD_VERSION/streams/merge.ts";

// create the file to attach the process to
const file = await Deno.open("./process_output.txt", {
  read: true,
  write: true,
  create: true,
});

// start the process
const process = Deno.run({
  cmd: ["yes"],
  stdout: "piped",
  stderr: "piped",
});

// example of combining stdout and stderr while sending to a file
const joined = mergeReadableStreams(
  process.stdout.readable,
  process.stderr.readable,
);

// returns a promise that resolves when the process is killed/closed
joined.pipeTo(file.writable).then(() => console.log("pipe join done"));

// manually stop process "yes" will never end on its own
setTimeout(() => {
  process.kill("SIGINT");
}, 100);
```

Run it:

```shell
$ deno run --allow-run ./subprocess_piping_to_file.ts
```
