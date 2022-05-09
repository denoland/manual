## HTTP Server APIs

As of Deno 1.9 and later, _native_ HTTP server APIs were introduced which allow
users to create robust and performant web servers in Deno.

The API tries to leverage as much of the web standards as is possible as well as
tries to be simple and straightforward.

> ℹ️ These APIs were stabilized in Deno 1.13 and no longer require `--unstable`
> flag.

- [A "Hello World" server](#a-hello-world-server)
- [Inspecting the incoming request](#inspecting-the-incoming-request)
- [Responding with a response](#responding-with-a-response)
- [WebSocket support](#websocket-support)
- [HTTPS support](#https-support)
- [HTTP/2 support](#http2-support)
- [Automatic body compression](#automatic-body-compression)
- [Lower level APIs](#lower-level-http-server-apis)

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

```js
import { serve } from "https://deno.land/std@$STD_VERSION/http/server.ts";

serve(handler);
```

By default `serve` will listen on port `8000`, but this can be changed by
passing in a port number in the second argument options bag:

```js
import { serve } from "https://deno.land/std@$STD_VERSION/http/server.ts";

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
  let timer: number;
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
  return new Response(body.pipeThrough(new TextEncoderStream()), {
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
  let response, socket: WebSocket;
  try {
    ({ response, socket } = Deno.upgradeWebSocket(req));
  } catch {
    return new Response("request isn't trying to upgrade to websocket.");
  }
  socket.onopen = () => console.log("socket opened");
  socket.onmessage = (e) => {
    console.log("socket message:", e.data);
    socket.send(new Date().toString());
  };
  socket.onerror = (e) => console.log("socket errored:", e);
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

```js
import { serveTls } from "https://deno.land/std@$STD_VERSION/http/server.ts";

serveTls(handler, {
  port: 443,
  certFile: "./cert.pem",
  keyFile: "./key.pem",
});
```

### HTTP/2 support

HTTP/2 support it "automatic" when using the _native_ APIs with Deno. You just
need to create your server, and the server will handle HTTP/1 or HTTP/2 requests
seamlessly.

### Automatic body compression

As of Deno 1.20, the HTTP server has built in automatic compression of response
bodies. When a response is sent to a client, Deno determines if the response
body can be safely compressed. This compression happens within the internals of
Deno, so it is fast and efficient.

Currently Deno supports gzip and brotli compression. A body is automatically
compressed if the following conditions are true:

- The request has an
  [`Accept-Encoding`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding)
  header which indicates the requestor supports `br` for brotli or `gzip`. Deno
  will respect the preference of the
  [quality value](https://developer.mozilla.org/en-US/docs/Glossary/Quality_values)
  in the header.
- The response includes a
  [`Content-Type`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type)
  which is considered compressible. (The list is derived from
  [`jshttp/mime-db`](https://github.com/jshttp/mime-db/blob/master/db.json) with
  the actual list in the
  [code](https://github.com/denoland/deno/blob/$CLI_VERSION/ext/http/compressible.rs).)
- The response body is greater than 20 bytes.

When the response body is compressed, Deno will set the
[`Content-Encoding`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding)
header to reflect the encoding as well as ensure the
[`Vary`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header
is adjusted or added to indicate what request headers affected the response.

#### When is compression skipped?

In addition to the logic above, there are a few other reasons why a response
won't be compressed automatically:

- The response body is a stream. Currently only _static_ response bodies are
  supported. We will add streaming support in the future.
- The response contains a `Content-Encoding` header. This indicates your server
  has done some form of encoding already.
- The response contains a
  [`Content-Range`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Range)
  header. This indicates that your server is responding to a range request,
  where the bytes and ranges are negotiated outside of the control of the
  internals to Deno.
- The response has a
  [`Cache-Control`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
  header which contains a
  [`no-transform`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control#other)
  value. This indicates that your server doesn't want Deno or any downstream
  proxies to modify the response.

#### What happens to an `ETag` header?

When you set an
[`ETag`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) that is
not a weak validator and the body is compressed, Deno will change this to a weak
validator (`W/`). This is to ensure the proper behavior of clients and
downstream proxy services when validating the "freshness" of the content of the
response body.

### Lower level HTTP server APIs

This chapter focuses only on the high level HTTP server APIs. You should
probably use this API, as it handles all of the intricacies of parallel requests
on a single connection, error handling, and so on.

If you do want to learn more about the low level HTTP server APIs though, you
can [read more about them here](./http_server_apis_low_level).
