# TCP echo Server

## Concepts

- Listening for TCP port connections with
  [Deno.listen](https://doc.deno.land/deno/stable/~/Deno.listen).
- Use
  [copy](https://doc.deno.land/https://deno.land/std@$STD_VERSION/streams/conversion.ts/~/copy)
  to take inbound data and redirect it to be outbound data.

## Example

This is an example of a server which accepts connections on port 8080, and
returns to the client anything it sends.

```ts
/**
 * echo_server.ts
 */
import { copy } from "https://deno.land/std@$STD_VERSION/streams/conversion.ts";
const listener = Deno.listen({ port: 8080 });
console.log("listening on 0.0.0.0:8080");
for await (const conn of listener) {
  copy(conn, conn).finally(() => conn.close());
}
```

Run with:

```shell
deno run --allow-net echo_server.ts
```

To test it, try sending data to it with
[netcat](https://en.wikipedia.org/wiki/Netcat) (Linux/MacOS only). Below
`'hello world'` is sent over the connection, which is then echoed back to the
user:

```shell
$ nc localhost 8080
hello world
hello world
```

Like the [cat.ts example](./unix_cat.md), the `copy()` function here also does
not make unnecessary memory copies. It receives a packet from the kernel and
sends back, without further complexity.
