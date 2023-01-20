# Node and npm Modules

Deno has native backwards compatibility with Node.js and npm modules. To import
native Node modules, `node:` specifiers are used. To import npm modules, `npm:`
specifiers are used.

```js
import chalk from "npm:chalk@5";
import { readFile } from "node:fs";
```
