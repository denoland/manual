import { Application } from "https://deno.land/x/oak@v8.0.0/mod.ts";

const app = new Application();

app.use((ctx) => {
  ctx.response.body = "Hello World!";
});

app.addEventListener("listen", (e) => {
  console.log(
    `%cListening on http://${e.hostname ?? "localhost"}:${e.port}`,
    "color:lime",
  );
});
await app.listen({ port: 8000 });
