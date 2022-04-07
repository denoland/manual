## HTTP Server APIs (low level)

As of Deno 1.9 and later, _native_ HTTP server APIs were introduced which allow
users to create robust and performant web servers in Deno.

> ℹ️ These APIs were stabilized in Deno 1.13 and no longer require `--unstable`
> flag.

> ⚠️ You should probably not be using this API, as it is not easy to get right.
> Use the
> [higher level API in the standard library instead](./http_server_apis).

### Listening for a connection

In order to accept requests, first you need to listen for a connection on a
network port. To do this in Deno, you use `Deno.listen()`:

```ts
const server = Deno.listen({ port: 8080 });
```

> ℹ️ When supplying a port, Deno assumes you are going to listen on a TCP socket
> as well as bind to the localhost. You can specify `transport: "tcp"` to be
> more explicit as well as provide an IP address or hostname in the `hostname`
> property as well.

If there is an issue with opening the network port, `Deno.listen()` will throw,
so often in a server sense, you will want to wrap it in the `try ... catch`
block in order to handle exceptions, like the port already being in use.

You can also listen for a TLS connection (e.g. HTTPS) using `Deno.listenTls()`:

```ts
const server = Deno.listenTls({
  port: 8443,
  certFile: "localhost.crt",
  keyFile: "localhost.key",
  alpnProtocols: ["h2", "http/1.1"],
});
```

The `certFile` and `keyFile` options are required and point to the appropriate
certificate and key files for the server. They are relative to the CWD for Deno.
The `alpnProtocols` property is optional, but if you want to be able to support
HTTP/2 on the server, you add the protocols here, as the protocol negotiation
happens during the TLS negotiation with the client and server.

> ℹ️ Generating SSL certificates is outside of the scope of this documentation.
> There are many resources on the web which address this.

### Handling connections

Once we are listening for a connection, we need to handle the connection. The
return value of `Deno.listen()` or `Deno.listenTls()` is a `Deno.Listener` which
is an async iterable which yields up `Deno.Conn` connections as well as provide
a couple methods for handling connections.

To use it as an async iterable we would do something like this:

```ts
const server = Deno.listen({ port: 8080 });

for await (const conn of server) {
  // ...handle the connection...
}
```

Every connection made would yield up a `Deno.Conn` assigned to `conn`. Then
further processing can be applied to the connection.

There is also the `.accept()` method on the listener which can be used:

```ts
const server = Deno.listen({ port: 8080 });

while (true) {
  try {
    const conn = await server.accept();
    // ... handle the connection ...
  } catch (err) {
    // The listener has closed
    break;
  }
}
```

Whether using the async iterator or the `.accept()` method, exceptions can be
thrown and robust production code should handle these using `try ... catch`
blocks. Especially when it comes to accepting TLS connections, there can be many
conditions, like invalid or unknown certificates which can be surfaced on the
listener and might need handling in the user code.

A listener also has a `.close()` method which can be used to close the listener.

### Serving HTTP

Once a connection is accepted, you can use `Deno.serveHttp()` to handle HTTP
requests and responses on the connection. `Deno.serveHttp()` returns a
`Deno.HttpConn`. A `Deno.HttpConn` is like a `Deno.Listener` in that requests
the connection receives from the client are asynchronously yielded up as a
`Deno.RequestEvent`.

To deal with HTTP requests as async iterable it would look something like this:

```ts
const server = Deno.listen({ port: 8080 });

for await (const conn of server) {
  (async () => {
    const httpConn = Deno.serveHttp(conn);
    for await (const requestEvent of httpConn) {
      // ... handle requestEvent ...
    }
  })();
}
```

The `Deno.HttpConn` also has the method `.nextRequest()` which can be used to
await the next request. It would look something like this:

```ts
const server = Deno.listen({ port: 8080 });

while (true) {
  try {
    const conn = await server.accept();
    (async () => {
      const httpConn = Deno.serveHttp(conn);
      while (true) {
        try {
          const requestEvent = await httpConn.nextRequest();
          // ... handle requestEvent ...
        } catch (err) {
          // the connection has finished
          break;
        }
      }
    })();
  } catch (err) {
    // The listener has closed
    break;
  }
}
```

Note that in both cases we are using an IIFE to create an inner function to deal
with each connection. If we awaited the HTTP requests in the same function scope
as the one we were receiving the connections, we would be blocking accepting
additional connections, which would make it seem that our server was "frozen".
In practice, it might make more sense to have a separate function all together:

```ts
async function handle(conn: Deno.Conn) {
  const httpConn = Deno.serveHttp(conn);
  for await (const requestEvent of httpConn) {
    // ... handle requestEvent
  }
}

const server = Deno.listen({ port: 8080 });

for await (const conn of server) {
  handle(conn);
}
```

In the examples from this point on, we will focus on what would occur within an
example `handle()` function and remove the listening and connection
"boilerplate".

### HTTP Requests and Responses

HTTP requests and responses in Deno are essentially the inverse of web standard
[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). The
Deno HTTP Server API and the Fetch API leverage the
[`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) and
[`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) object
classes. So if you are familiar with the Fetch API you just need to flip them
around in your mind and now it is a server API.

As mentioned above, a `Deno.HttpConn` asynchronously yields up
`Deno.RequestEvent`s. These request events contain a `.request` property and a
`.respondWith()` method.

The `.request` property is an instance of the `Request` class with the
information about the request. For example, if we wanted to know what URL path
was being requested, we would do something like this:

```ts
async function handle(conn: Deno.Conn) {
  const httpConn = Deno.serveHttp(conn);
  for await (const requestEvent of httpConn) {
    const url = new URL(requestEvent.request.url);
    console.log(`path: ${url.pathname}`);
  }
}
```

The `.respondWith()` method is how we complete a request. The method takes
either a `Response` object or a `Promise` which resolves with a `Response`
object. Responding with a basic "hello world" would look like this:

```ts
async function handle(conn: Deno.Conn) {
  const httpConn = Deno.serveHttp(conn);
  for await (const requestEvent of httpConn) {
    await requestEvent.respondWith(
      new Response("hello world", {
        status: 200,
      }),
    );
  }
}
```

Note that we awaited the `.respondWith()` method. It isn't required, but in
practice any errors in processing the response will cause the promise returned
from the method to be rejected, like if the client disconnected before all the
response could be sent. While there may not be anything your application needs
to do, not handling the rejection will cause an "unhandled rejection" to occur
which will terminate the Deno process, which isn't so good for a server. In
addition, you might want to await the promise returned in order to determine
when to do any cleanup from for the request/response cycle.

The web standard `Response` object is pretty powerful, allowing easy creation of
complex and rich responses to a client, and Deno strives to provide a `Response`
object that as closely matches the web standard as possible, so if you are
wondering how to send a particular response, checkout out the documentation for
the web standard
[`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response).

### HTTP/2 Support

HTTP/2 support is effectively transparent within the Deno runtime. Typically
HTTP/2 is negotiated between a client and a server during the TLS connection
setup via
[ALPN](https://en.wikipedia.org/wiki/Application-Layer_Protocol_Negotiation). To
enable this, you need to provide the protocols you want to support when you
start listening via the `alpnProtocols` property. This will enable the
negotiation to occur when the connection is made. For example:

```ts
const server = Deno.listenTls({
  port: 8443,
  certFile: "localhost.crt",
  keyFile: "localhost.key",
  alpnProtocols: ["h2", "http/1.1"],
});
```

The protocols are provided in order of preference. In practice, the only two
protocols that are supported currently are HTTP/2 and HTTP/1.1 which are
expressed as `h2` and `http/1.1`.

Currently Deno does not support upgrading a plain-text HTTP/1.1 connection to an
HTTP/2 cleartext connection via the `Upgrade` header (see:
[#10275](https://github.com/denoland/deno/issues/10275)), so therefore HTTP/2
support is only available via a TLS/HTTPS connection.

### Serving WebSockets

> ℹ️ These APIs were stabilized in Deno 1.14 and no longer require the
> `--unstable` flag.

Deno can upgrade incoming HTTP requests to a WebSocket. This allows you to
handle WebSocket endpoints on your HTTP servers.

To upgrade an incoming `Request` to a WebSocket you use the
`Deno.upgradeWebSocket` function. This returns an object consisting of a
`Response` and a web standard `WebSocket` object. The returned response should
be used to respond to the incoming request using the `respondWith` method. Only
once `respondWith` is called with the returned response, the WebSocket is
activated and can be used.

Because the WebSocket protocol is symmetrical, the `WebSocket` object is
identical to the one that can be used for client side communication.
Documentation for it can be found
[on MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket).

> Note: We are aware that this API can be challenging to use, and are planning
> to switch to
> [`WebSocketStream`](https://github.com/ricea/websocketstream-explainer/blob/master/README.md)
> once it is stabilized and ready for use.

```ts
async function handle(conn: Deno.Conn) {
  const httpConn = Deno.serveHttp(conn);
  for await (const requestEvent of httpConn) {
    await requestEvent.respondWith(handleReq(requestEvent.request));
  }
}

function handleReq(req: Request): Response {
  const upgrade = req.headers.get("upgrade") || "";
  if (upgrade.toLowerCase() != "websocket") {
    return new Response("request isn't trying to upgrade to websocket.");
  }
  const { socket, response } = Deno.upgradeWebSocket(req);
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
