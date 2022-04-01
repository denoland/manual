# Task runner

> ⚠️ `deno task` was introduced in Deno v1.20 and is unstable. It may
> drastically change in the future.

`deno task` provides a cross platform way to define and execute custom commands
specific to a codebase.

To get started, define your commands in your codebase's
[Deno configuration file](../getting_started/configuration_file) under a
`"tasks"` key.

For example:

```jsonc
{
  "tasks": {
    "data": "deno task collect && deno task analyze",
    "collect": "deno run --allow-read=. --allow-write=. scripts/collect.js",
    "analyze": "deno run --allow-read=. scripts/analyze.js"
  }
}
```

## Listing tasks

To get an output showing all the defined tasks, run:

```sh
deno task
```

## Executing a task

To execute a specific task, run:

```shell
deno task task-name [additional args]...
```

In the example above, to run the `data` task we would do:

```shell
deno task data
```

## Syntax

`deno task` uses a cross platform shell that's a subset of sh/bash to execute
defined tasks.

### Boolean lists

Boolean lists provide a way to execute additional commands based on the exit
code of the initial command. They separate commands using the `&&` and `||`
operators.

The `&&` operator provides a way to execute a command and if it _succeeds_ (has
an exit code of `0`) it will execute a second command:

```sh
deno run --allow-read=. --allow-write=. collect.ts && deno run --allow-read=. analyze.ts
```

The `||` operator is the opposite. It provides a way to execute a command and
only if it _fails_ (has a non-zero exit code) it will execute a second command:

```sh
deno run --allow-read=. --allow-write=. collect.ts || deno run play_sad_music.ts
```

### Sequential lists

Sequential lists are similar to boolean lists, but execute regardless of whether
the previous command in the list passed or failed. Commands are separated with a
semi-colon (`;`).

```sh
deno run output_data.ts ; deno run --allow-net server/main.ts
```

### Async commands

Async commands provide a way to make a command execute asynchronously. This can
be useful when starting multiple processes. To make a command asynchronous, add
an `&` to the end of it. For example the following would execute
`sleep 1 && deno run --allow-net client/main.ts` and
`deno run --allow-net server/main.ts` at the same time:

```sh
sleep 1 && deno run --allow-net client/main.ts & deno run --allow-net server/main.ts
```

### Environment variables

Environment variables are defined like the following:

```sh
export VAR_NAME=value
```

Here's an example of using one in a task with shell variable substitution and
then with it being exported as part of the environment of the spawned Deno
process (note that in the JSON configuration file the double quotes would need
to be escaped with backslashes):

```sh
export VAR=hello && echo $VAR && deno eval "console.log('Deno: ' + Deno.env.get('VAR'))"
```

Would output:

```
hello
Deno: hello
```

#### Setting environment variables for a command

To specify environment variable(s) before a command, list them like so:

```
VAR=hello VAR2=bye deno run main.ts
```

This will export those environment variable specifically for the following
command.

### Shell variables

Shell variables are similar to environment variables, but won't be exported to
spawned commands. They are defined with the following syntax:

```sh
VAR_NAME=value
```

If we use a shell variable instead of an environment variable in a similar
example to what's shown in the previous "Environment variables" section:

```sh
VAR=hello && echo $VAR && deno eval "console.log('Deno: ' + Deno.env.get('VAR'))"
```

We will get the following output:

```
hello
Deno: undefined
```

Shell variables can be useful when we want to re-use a value, but don't want it
available in any spawned processes.

### Pipelines

Pipelines provide a way to pipe the output of one command to another. Currently
only piping stdout is supported.

The following command pipes the stdout output "Hello" to the stdin of the
spawned Deno process:

```sh
echo Hello | deno run main.ts
```

To pipe stdout and stderr, use `|&` instead:

```sh
deno eval 'console.log(1); console.error(2);' |& deno run main.ts
```

### Command substitution

The `$(command)` syntax provides a way to use the output of a command in other
commands that get executed.

For example, to provide the output of getting the latest git revision to another
command you could do the following:

```sh
deno run main.ts $(git rev-parse HEAD)
```

Another example using a shell variable:

```sh
REV=$(git rev-parse HEAD) && deno run main.ts $REV && echo $REV
```

### Negate exit code

To negate the exit code, add an exclamation point and space before a command:

```sh
# change the exit code from 1 to 0
! deno eval 'Deno.exit(1);'
```

### Future syntax

We are planning to support
[redirects](https://github.com/denoland/deno_task_shell/issues/5) and
[glob expansion](https://github.com/denoland/deno_task_shell/issues/6) in the
future.

## Built-in commands

`deno task` ships with several built-in commands that work the same out of the
box on Windows, Mac, and Linux.

- [`cp`](https://man7.org/linux/man-pages/man1/cp.1.html) - Copies files.
- [`mv`](https://man7.org/linux/man-pages/man1/mv.1.html) - Moves files.
- [`rm`](https://man7.org/linux/man-pages/man1/rm.1.html) - Remove files or
  directories.
  - Ex: `rm -rf [FILE]...` - Commonly used to recursively delete files or
    directories.
- [`mkdir`](https://man7.org/linux/man-pages/man1/mkdir.1.html) - Makes
  directories.
  - Ex. `mkdir -p DIRECTORY...` - Commonly used to make a directory and all its
    parents with no error if it exists.
- [`pwd`](https://man7.org/linux/man-pages/man1/pwd.1.html) - Prints the name of
  the current/working directory.
- [`sleep`](https://man7.org/linux/man-pages/man1/sleep.1.html) - Delays for a
  specified amount of time.
  - Ex. `sleep 1` to sleep for 1 second or `sleep 0.5` to sleep for half a
    second
- [`echo`](https://man7.org/linux/man-pages/man1/echo.1.html) - Displays a line
  of text.
- [`exit`](https://man7.org/linux/man-pages/man1/exit.1p.html) - Causes the
  shell to exit.

If you find a useful flag missing on a command or have any suggestions for
additional commands that should be supported out of the box, then please
[open an issue](https://github.com/denoland/deno_task_shell/issues) on the
[deno_task_shell](https://github.com/denoland/deno_task_shell/) repo.

Note that if you wish to execute any of these commands in a non-cross platform
way on Mac or Linux, then you may do so by running it through `sh`:
`sh -c <command>` (ex. `sh -c cp source destination`).
