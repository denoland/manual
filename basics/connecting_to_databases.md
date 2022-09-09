# Connecting to databases

The Deno community has published a number of third-party modules that make it easy to connect to popular databases like MySQL, Postgres, and MongoDB.

They are hosted at Deno's third-party module site.

## MySQL

[deno_mysql](https://deno.land/x/mysql@v2.10.2) is a MySQL and MariaDB database driver for Deno.

### Connect to MySQL with deno_mysql

```ts
import { Client } from "https://deno.land/x/mysql/mod.ts";

const client = await new Client().connect({
  hostname: "127.0.0.1",
  username: "root",
  db: "dbname",
  password: "password",
});
```


## Postgres

[deno-postgres](https://deno.land/x/postgres@v0.16.1) is a lightweight PostgreSQL driver for Deno focused on user experience.

### Connect to Postgres with deno-postgres

```ts
// deno run --allow-net --allow-read mod.ts
import { Client } from "https://deno.land/x/postgres@v0.16.1/mod.ts";

const client = new Client({
  user: "user",
  database: "test",
  hostname: "localhost",
  port: 5432,
});
await client.connect();

{
  const result = await client.queryArray("SELECT ID, NAME FROM PEOPLE");
  console.log(result.rows); // [[1, 'Carlos'], [2, 'John'], ...]
}

{
  const result = await client.queryArray
    `SELECT ID, NAME FROM PEOPLE WHERE ID = ${1}`;
  console.log(result.rows); // [[1, 'Carlos']]
}

{
  const result = await client.queryObject("SELECT ID, NAME FROM PEOPLE");
  console.log(result.rows); // [{id: 1, name: 'Carlos'}, {id: 2, name: 'Johnru'}, ...]
}

{
  const result = await client.queryObject
    `SELECT ID, NAME FROM PEOPLE WHERE ID = ${1}`;
  console.log(result.rows); // [{id: 1, name: 'Carlos'}]
}

await client.end();
```

## MongoDB

[deno_mongo](https://deno.land/x/mongo@v0.31.1) is a MongoDB database driver developed for Deno.

### Connect to MongoDB

```ts
import {
  Bson,
  MongoClient,
} from "https://deno.land/x/mongo@LATEST_VERSION/mod.ts";

const client = new MongoClient();

// Connecting to a Local Database
await client.connect("mongodb://127.0.0.1:27017");

// Connecting to a Mongo Atlas Database
await client.connect({
  db: "<db_name>",
  tls: true,
  servers: [
    {
      host: "<db_cluster_url>",
      port: 27017,
    },
  ],
  credential: {
    username: "<username>",
    password: "<password>",
    db: "<db_name>",
    mechanism: "SCRAM-SHA-1",
  },
});

// Connect using srv url
await client.connect(
  "mongodb+srv://<username>:<password>@<db_cluster_url>/<db_name>?authMechanism=SCRAM-SHA-1",
);

```