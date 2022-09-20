# Web Frameworks

One of the great things about Node is the thriving ecosystem of tools and frameworks built around it that has made developers' lives' easier.

Deno offers support for many of these Node.js native frameworks/tools/libraries. However, you might not get the best experience or performance.

Additionally, a native ecosystem of tools and frameworks is growing around Deno. Most likely, if you're building a more complex application, you'll want to use one of these Deno-native web frameworks.

## Fresh

[Fresh](https://fresh.deno.dev/) is the most popular web framework for Deno.
It uses a model where you send no JavaScript to clients by default. The majority
of rendering is done on a server, and the client is only responsible for
re-rendering small
[islands of interactivity](https://jasonformat.com/islands-architecture/). This
means the developer explicitly opts in to client side rendering for specific
components.

## Aleph

[Aleph.js](https://alephjs-alephjs-org-next.deno.dev/docs/get-started) is the
second most popular web framework for Deno. It gives you the same sort of
quick-start with React as Create-React-App. Like Next.js, Aleph provides SSR and
SSG out of the box in order to allow developers to create SEO-friendly apps. In
addition, Aleph provides some other built-in features that don’t come out of the
box in Next.js, such as:

- Hot Reloading (Using React Fast Refresh)
- ESM Import Syntax (No need for webpack)
- TypeScript-Ready

## What are the equivalents of top Node frameworks in Deno?

- Express -> Oak
- Create-React-App -> Fresh


fresh (5104 MAU)
lume (2932 MAU)
aleph (732 MAU)
ultra (257 MAU)
alosaur (169 MAU)
dext (63 MAU)