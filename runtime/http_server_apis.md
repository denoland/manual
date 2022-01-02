## HTTP Server APIs

As of Deno 1.9 and later, _native_ HTTP server APIs were introduced which allow
users to create robust and performant web servers in Deno.

The API tries to leverage as much of the web standards as is possible as well as
tries to be simple and straightforward.

> ℹ️ These APIs were stabilized in Deno 1.13 and no longer require `--unstable`
> flag.

### A "Hello World" server

To start a HTTP server on a given port, you can use the `serve` function from
[`std/http`](https://deno.land/std@$STD_VERSION/http). This function takes a
handler function that will be called for each incoming request, and is expected
to return a response (or a promise resolving to a response).

Here is an example of a handler function that returns a "Hello, World!" response
for each request:

```ts
function handler(req: Request): Response {
  return new Response("Hello, World!");
}
```

> ℹ️ The handler can also return a `Promise<Response>`, which means it can be an
> `async` function.

To then listen on a port and handle requests you need to call the `serve`
function from the `https://deno.land/std@$STD_VERSION/http/server.ts` module,
passing in the handler as the first argument:

```ts
import { serve } from "https://deno.land/std@$STD_VERSION/http/server.ts";

serve(handler);
```

By default `serve` will listen on port `8000`, but this can be changed by
passing in a port number in the second argument options bag:

```ts
// To listen on port 4242.
serve(handler, { port: 4242 });
```

This same options bag can also be used to configure some other options, such as
the hostname to listen on.

### Inspecting the incoming request

Most servers will not answer with the same response for every request. Instead
they will change their answer depending on various aspects of the request: the
HTTP method, the headers, the path, or the body contents.

The request is passed in as the first argument to the handler function. Here is
an example showing how to extract various parts of the request:

```ts
async function handler(req: Request): Promise<Response> {
  console.log("Method:", req.method);

  const url = new URL(req.url);
  console.log("Path:", url.pathname);
  console.log("Query parameters:", url.searchParams);

  console.log("Headers:", req.headers);

  if (req.body) {
    const body = await req.text();
    console.log("Body:", body);
  }

  return new Response("Hello, World!");
}
```

> ⚠️ Be aware that the `req.text()` call can fail if the user hangs up the
> connection before the body is fully received. Make sure to handle this case.
> Do note this can happen in all methods that read from the request body, such
> as `req.json()`, `req.formData()`, `req.arrayBuffer()`,
> `req.body.getReader().read()`, `req.body.pipeTo()`, etc.

### Responding with a response

Most servers also do not respond with "Hello, World!" to every request. Instead
they might respond with different headers, status codes, and body contents (even
body streams).

Here is an example of returning a response with a 404 status code, a JSON body,
and a custom header:

```ts
function handler(req: Request): Response {
  const body = JSON.stringify({ message: "NOT FOUND" });
  return new Response(body, {
    status: 404,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
}
```

Response bodies can also be streams. Here is an example of a response that
returns a stream of "Hello, World!" repeated every second:

```ts
function handler(req: Request): Response {
  let timer;
  const body = new ReadableStream({
    async start(controller) {
      timer = setInterval(() => {
        controller.enqueue("Hello, World!\n");
      }, 1000);
    },
    cancel() {
      clearInterval(timer);
    },
  });
  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
```

> ℹ️ Note the `cancel` function here. This is called when the client hangs up
> the connection. This is important to make sure that you handle this case, as
> otherwise the server will keep queuing up messages forever, and eventually run
> out of memory.

> ⚠️ Beware that the response body stream is "cancelled" when the client hangs
> up the connection. Make sure to handle this case. This can surface itself as
> an error in a `write()` call on a `WritableStream` object that is attached to
> the response body `ReadableStream` object (for example through a
> `TransformStream`).

### WebSocket support

Deno can upgrade incoming HTTP requests to a WebSocket. This allows you to
handle WebSocket endpoints on your HTTP servers.

To upgrade an incoming `Request` to a WebSocket you use the
`Deno.upgradeWebSocket` function. This returns an object consisting of a
`Response` and a web standard `WebSocket` object. This response must be returned
from the handler for the upgrade to happen. If this is not done, no WebSocket
upgrade will take place.

Because the WebSocket protocol is symmetrical, the `WebSocket` object is
identical to the one that can be used for client side communication.
Documentation for it can be found
[on MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket).

> ℹ️ We are aware that this API can be challenging to use, and are planning to
> switch to
> [`WebSocketStream`](https://github.com/ricea/websocketstream-explainer/blob/master/README.md)
> once it is stabilized and ready for use.

```ts
function handler(req: Request): Response {
  const upgrade = req.headers.get("upgrade") || "";
  let socket, response;
  try {
    res = Deno.upgradeWebSocket(req);
    socket = res.socket;
    response = res.response;
  } catch {
    return new Response("request isn't trying to upgrade to websocket.");
  }
  socket.onopen = () => console.log("socket opened");
  socket.onmessage = (e) => {
    console.log("socket message:", e.data);
    socket.send(new Date().toString());
  };
  socket.onerror = (e) => console.log("socket errored:", e.message);
  socket.onclose = () => console.log("socket closed");
  return response;
}
```

WebSockets are only supported on HTTP/1.1 for now. The connection the WebSocket
was created on can not be used for HTTP traffic after a WebSocket upgrade has
been performed.

### HTTPS support

> ℹ️ To use HTTPS, you will need a valid TLS certificate and a private key for
> your server.

To use HTTPS, use `serveTls` from the
`https://deno.land/std@$STD_VERSION/http/server.ts` module instead of `serve`.
This takes two extra arguments in the options bag: `certFile` and `keyFile`.
These are paths to the certificate and key files, respectively.

```ts
import { serveTls } from "https://deno.land/std@$STD_VERSION/http/server.ts";

serveTls(handler, {
  port: 443,
  certFile: "./cert.pem",
  keyFile: "./key.pem",
});
```

### Lower level HTTP server APIs

This chapter focuses only on the high level HTTP server APIs. You should
probably use this API, as it handles all of the intricacies of parallel requests
on a single connection, error handling, and so on.

If you do want to learn more about the low level HTTP server APIs though, you
can [read more about them here](./http_server_apis_low_level).
