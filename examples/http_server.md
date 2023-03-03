# Simple HTTP Web Server

## Concepts

- Use Deno's integrated HTTP server to run your own web server.

## Overview

With just a few lines of code you can run your own HTTP web server with control
over the response status, request headers and more.

**webserver.ts**:

```ts
import { serve } from "https://deno.land/std@$STD_VERSION/http/server.ts";

const port = 8080;

const handler = (request: Request): Response => {
  const body = `Your user-agent is:\n\n${
    request.headers.get("user-agent") ?? "Unknown"
  }`;

  return new Response(body, { status: 200 });
};

await serve(handler, { port });
```

Then run this with:

```shell
deno run --allow-net webserver.ts
```

Then navigate to `http://localhost:8080/` in a browser.