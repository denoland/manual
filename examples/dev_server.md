# Dev Server

Feel free to import TypeScript files in the script tag!

## Getting Started

- Without install: 

```shell
deno run hello-world.js deno run -A --unstable https://deno.land/x/dev_server/mod.ts --template hello_world
```
- Install & Run It:

```shell 
deno install -A --unstable https://deno.land/x/dev_server/mod.ts 
dev_server my_app --template hello_world
```

- Print help info:
```shell
dev_server -h
```

- Upgrade to the latest version:

```shell
deno cache --reload --unstable https://deno.land/x/dev_server/mod.ts
```

- Create project from template:

```shell
# Check from https://deno.land/x/dev_server/template/
dev_server my_app --template hello_world
dev_server my_app --template react
dev_server my_app --template angular
```
