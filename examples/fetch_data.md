# Fetch data

## Concepts

- Like browsers, Deno implements web standard APIs such as
  [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
- Deno is secure by default, meaning explicit permission must be granted to
  access the network.
- See also: Deno's [permissions](../getting_started/permissions.md) model.

## Overview

When building any sort of web application developers will usually need to
retrieve data from somewhere else on the web. This works no differently in Deno
than in any other JavaScript application, just call the `fetch()` method. For
more information on fetch read the
[MDN documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

The exception with Deno occurs when running a script which makes a call over the
web. Deno is secure by default which means access to IO (Input / Output) is
prohibited. To make a call over the web Deno must be explicitly told it is ok to
do so. This is achieved by adding the `--allow-net` flag to the `deno run`
command.

## Example

**Command:** `deno run --allow-net fetch.ts`

```js
/**
 * Output: JSON Data
 */
const jsonResponse = await fetch("https://api.github.com/users/denoland");
const jsonData = await jsonResponse.json();
console.log(jsonData);

/**
 * Output: HTML Data
 */
const textResponse = await fetch("https://deno.land/");
const textData = await textResponse.text();
console.log(textData);

/**
 * Output: Error Message
 */
try {
  await fetch("https://does.not.exist/");
} catch (error) {
  console.log(error);
}
```
