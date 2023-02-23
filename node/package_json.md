# package.json Compatibility

To help migrate projects to only using a _deno.json_ file or no configuration
file at all, or to use Deno in existing Node applications, Deno supports
resolving dependencies based on a package.json file in the current or an
ancestor directory.

**package.json**

```json
{
  "name": "@deno/my-example-project",
  "description": "An example app created with Deno",
  "type": "module",
  "scripts": {
    "dev": "deno run --allow-env --allow-sys main.ts"
  },
  "dependencies": {
    "chalk": "^5.2"
  }
}
```

**main.ts**

```ts, ignore
import chalk from "chalk";

console.log(chalk.green("Hello from Deno!"));
```

To run:

```shell, ignore
> deno run --allow-env --allow-sys main.ts
Hello from Deno!
```

Or we can also execute package.json scripts via `deno task`:

```shell, ignore
> deno task dev
Hello from Deno!
```
