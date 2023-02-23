# First Steps

This page contains some examples to teach you about the fundamentals of Deno.

This document assumes that you have some prior knowledge of JavaScript,
especially about `async`/`await`. If you have no prior knowledge of JavaScript,
you might want to follow a guide
[on the basics of JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript)
before attempting to start with Deno.

## Hello World

Deno is a runtime for JavaScript/TypeScript which tries to be web compatible and
use modern features wherever possible.

Browser compatibility means a `Hello World` program in Deno is the same as the
one you can run in the browser.

Create a file locally called `first_steps.ts` and copy and paste the code line
below:

```ts
console.log("Welcome to Deno!");
```

## Running Deno programs

Now to run the program from the terminal:

```shell
deno run first_steps.ts
```

Deno also has the ability to execute scripts from URLs. Deno
[hosts a library](https://deno.land/std@0.103.0/examples) of example code, one
of which is a `Hello World` program. To run that hosted code, do:

```shell
deno run https://deno.land/std@0.103.0/examples/welcome.ts
```

## Making an HTTP request

Many programs use HTTP requests to fetch data from a web server. Let's write a
small program that fetches a file and prints its contents out to the terminal.
Just like in the browser you can use the web standard
[`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) API to
make HTTP calls.

In the `first_steps.ts` file you created above, paste the code below:

```ts
const url = Deno.args[0];
const res = await fetch(url);

const body = new Uint8Array(await res.arrayBuffer());
await Deno.stdout.write(body);
```

Let's walk through what this application does:

1. We get the first argument passed to the application, and store it in the
   `url` constant.
2. We make a request to the URL specified, await the response, and store it in
   the `res` constant.
3. We parse the response body as an
   [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer),
   await the response, and convert it into a
   [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
   to store in the `body` constant.
4. We write the contents of the `body` constant to `stdout`.

Try it out:

```shell
deno run first_steps.ts https://yirenlu.com/
```

or, from URL:

```shell
deno run https://deno.land/std@$STD_VERSION/examples/curl.ts https://example.com
```

You will see this program returns an error regarding network access so what did
we do wrong? You might remember from the introduction that Deno is a runtime
that is secure by default. This means you need to explicitly give programs
permission to do certain 'privileged' actions, such as access the network.

Try it out again with the correct permission flag:

```shell
deno run --allow-net=yirenlu.com first_steps.ts https://yirenlu.com/
```

or, from URL:

```shell
deno run --allow-net=example.com https://deno.land/std@$STD_VERSION/examples/curl.ts https://example.com
```

## Reading a file

Deno also provides APIs that do not come from the web. These are all contained
in the `Deno` global. You can find documentation for these built-in APIs here at
[`/api`](/api).

Filesystem APIs for example do not have a web standard form, so Deno provides
its own API.

In this program, each command-line argument is assumed to be a filename, the
file is opened, and printed to stdout.

```ts
const filenames = Deno.args;
for (const filename of filenames) {
  const file = await Deno.open(filename);
  await file.readable.pipeTo(Deno.stdout.writable);
}
```

The `ReadableStream.pipeTo(writable)` method here actually makes no more than
the necessary kernel→userspace→kernel copies. That is, the same memory from
which data is read from the file is written to stdout. This illustrates a
general design goal for I/O streams in Deno.

Again, here, we need to give --allow-read access to the program.

Try the program:

```shell
# macOS / Linux
deno run --allow-read https://deno.land/std@$STD_VERSION/examples/cat.ts /etc/hosts

# Windows
deno run --allow-read https://deno.land/std@$STD_VERSION/examples/cat.ts "C:\Windows\System32\Drivers\etc\hosts"
```

## Putting it all together in an HTTP server

One of the most common use cases for Deno is building an HTTP Server.

Create a new file called `http_server.ts` and copy and paste the code below:

```ts
import { serve } from "https://deno.land/std@0.157.0/http/server.ts";

const handler = async (_request: Request): Promise<Response> => {
  const resp = await fetch("https://api.github.com/users/denoland", {
    // The init object here has an headers object containing a
    // header that indicates what type of response we accept.
    // We're not specifying the method field since by default
    // fetch makes a GET request.
    headers: {
      accept: "application/json",
    },
  });

  return new Response(resp.body, {
    status: resp.status,
    headers: {
      "content-type": "application/json",
    },
  });
};

serve(handler);
```

Let's walk through what this program does.

1. Import the http server from `std/http` (standard library)
2. HTTP servers need a handler function. This function is called for every
   request that comes in. It must return a `Response`. The handler function can
   be asynchronous (it may return a `Promise`).
3. Use `fetch` to fetch the url.
4. Return the GitHub response as a response to the handler.
5. Finally, to start the server on the default port, call `serve` with the
   handler.

Now run the server. Note that you need to give network permissions.

```shell
deno run --allow-net http_server.ts
```

With the server listening on port `8000`, make a GET request to that endpoint.

```shell
curl http://localhost:8000
```

You will see a JSON response from the Deno GitHub page.

## More examples

You can find more examples in the [Examples](../examples) chapter and at
[Deno by Example](https://examples.deno.land/).
