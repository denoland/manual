## Using jsdom with Deno

[jsdom](https://github.com/jsdom/jsdom) is a pure JavaScript implementation of
many web standards, notably the WHATWG DOM and HTML Standards. It's main goal is
to be standards compliant and does not specifically consider performance.

If you are interested in server side rendering, then both
[deno-dom](./deno_dom.md) and [LinkeDOM](./linkedom.md) are better choices. If
you are trying to run code in a "virtual" browser that needs to be standards
based, then it is possible that jsdom is suitable for you.
