# Connecting to databases

The Deno community has published a number of third-party modules that make it
easy to connect to popular databases like MySQL, Postgres, and MongoDB.

They are hosted at Deno's third-party module site
[deno.land/x](https://deno.land/x).

## MySQL

[deno_mysql](https://deno.land/x/mysql) is a MySQL and MariaDB database driver
for Deno.

### Connect to MySQL with deno_mysql

```ts, ignore
import { Client } from "https://deno.land/x/mysql/mod.ts";

const client = await new Client().connect({
  hostname: "127.0.0.1",
  username: "root",
  db: "dbname",
  password: "password",
});
```

## Postgres

[postgresjs](https://deno.land/x/postgresjs) is a full featured Postgres client
for Node.js and Deno.

### Connect to Postgres with postgresjs

```js, ignore
import postgres from "https://deno.land/x/postgresjs/mod.js";

const sql = postgres("postgres://username:password@host:port/database");
```

## MongoDB

[deno_mongo](https://deno.land/x/mongo) is a MongoDB database driver developed
for Deno.

### Connect to MongoDB with deno_mongo

```ts, ignore
import { MongoClient } from "https://deno.land/x/mongo@LATEST_VERSION/mod.ts";

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

## SQLite

There are two primary solutions to connect to SQLite in Deno:

### Connect to SQLite with the FFI Module

[sqlite3](https://deno.land/x/sqlite3) provides JavaScript bindings to the
SQLite3 C API, using Deno FFI.

```ts, ignore
import { Database } from "https://deno.land/x/sqlite3@LATEST_VERSION/mod.ts";

const db = new Database("test.db");

db.close();
```

### Connect to SQLite with the WASM-Optimized Module

[sqlite](https://deno.land/x/sqlite) is a SQLite module for JavaScript and
TypeScript. The wrapper is targeted at Deno and uses a version of SQLite3
compiled to WebAssembly (WASM).

```ts, ignore
import { DB } from "https://deno.land/x/sqlite/mod.ts";

const db = new DB("test.db");

db.close();
```

## Firebase

To connect to Firebase with Deno, import the
[firestore npm module](https://firebase.google.com/docs/firestore/quickstart)
with the [skypak CDN](https://www.skypack.dev/). To learn more about using npm
modules in Deno via CDN read [here](../basics/node/cdns.md)

### Connect to Firebase with the firestore npm module

```js, ignore
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";

import {
  addDoc,
  collection,
  connectFirestoreEmulator,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  getFirestore,
  query,
  QuerySnapshot,
  setDoc,
  where,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";

const app = initializeApp({
  apiKey: Deno.env.get("FIREBASE_API_KEY"),
  authDomain: Deno.env.get("FIREBASE_AUTH_DOMAIN"),
  projectId: Deno.env.get("FIREBASE_PROJECT_ID"),
  storageBucket: Deno.env.get("FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: Deno.env.get("FIREBASE_MESSING_SENDER_ID"),
  appId: Deno.env.get("FIREBASE_APP_ID"),
  measurementId: Deno.env.get("FIREBASE_MEASUREMENT_ID"),
});
const db = getFirestore(app);
const auth = getAuth(app);
```

## Supabase

To connect to Supabase with Deno, import the
[supabase-js npm module](https://supabase.com/docs/reference/javascript) with
the [esm.sh CDN](https://esm.sh/). To learn more about using npm modules in Deno
via CDN read [here](../basics/node/cdns.md)

### Connect to Supabase with the supabase-js npm module

```js, ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const options = {
  schema: "public",
  headers: { "x-my-custom-header": "my-app-name" },
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
};

const supabase = createClient(
  "https://xyzcompany.supabase.co",
  "public-anon-key",
  options,
);
```

## ORMs

The idea with ORMs (object relational mapping) is to define your data models as
classes that can be persisted to a database. The classes and their instances
then provide you with a programmatic API to read and write data in the database.

Deno has support for a number of popular ORMs, including Prisma and DenoDB.

### DenoDB

[Denodb](https://deno.land/x/denodb) is a Deno-specific ORM database. ORM
(object-relational mapping) databases allow instances of classes to be persisted
to a database.

#### Connect to DenoDB

```ts, ignore
import {
  Database,
  DataTypes,
  Model,
  PostgresConnector,
} from "https://deno.land/x/denodb/mod.ts";

const connection = new PostgresConnector({
  host: "...",
  username: "user",
  password: "password",
  database: "airlines",
});

const db = new Database(connection);
```

## GraphQL

GraphQL is an API query language that is often used to compose disparate data
sources into client centric APIs. To set up a GraphQL API, you first need to set
up a GraphQL server. This server exposes your data as a GraphQL API that your
client applications can query for data.

### Server (GQL)

The simplest way to run a GraphQL API server in Deno is to use
[gql](https://deno.land/x/gql), an universal GraphQL HTTP middleware for Deno.

#### Run a GraphQL API Server with gql

```ts, ignore
import { Server } from "https://deno.land/std@$STD_VERSION/http/server.ts";
import { GraphQLHTTP } from "https://deno.land/x/gql/mod.ts";
import { makeExecutableSchema } from "https://deno.land/x/graphql_tools@0.0.2/mod.ts";
import { gql } from "https://deno.land/x/graphql_tag@0.0.1/mod.ts";

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => `Hello World!`,
  },
};

const schema = makeExecutableSchema({ resolvers, typeDefs });

const s = new Server({
  handler: async (req) => {
    const { pathname } = new URL(req.url);

    return pathname === "/graphql"
      ? await GraphQLHTTP<Request>({
        schema,
        graphiql: true,
      })(req)
      : new Response("Not Found", { status: 404 });
  },
  port: 3000,
});

s.listenAndServe();

console.log(`Started on http://localhost:3000`);
```

### Client

To make GraphQL client calls in Deno, import the
[graphql npm module](https://www.npmjs.com/package/graphql) with the
[esm CDN](https://esm.sh/). To learn more about using npm modules in Deno via
CDN read [here](../basics/node/cdns.md)

#### Make GraphQL client calls with the graphql npm module

```js, ignore
import { buildSchema, graphql } from "https://esm.sh/graphql";

const schema = buildSchema(`
type Query {
  hello: String
}
`);

const rootValue = {
  hello: () => {
    return "Hello world!";
  },
};

const response = await graphql({
  schema,
  source: "{ hello }",
  rootValue,
});

console.log(response);
```
