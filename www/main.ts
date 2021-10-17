import { Application } from "./deps.ts";
import { FileSystem } from "./src/filesystem.ts";
import { router } from "./src/routes.ts";
import { State } from "./src/state.ts";

const app = new Application<State>({ contextState: "alias" });

app.state.fs = new FileSystem({ localEnabled: true });

// If the url ends with a trailing slash, redirect to the same url without the
// trailing slash.
app.use(async (ctx, next) => {
  const path = ctx.request.url.pathname;
  if (path.substr(-1) === "/" && path.length > 1) {
    ctx.response.redirect(path.substr(0, path.length - 1));
    return;
  }
  await next();
});

const CONTENT_SECURITY_POLICY =
  `default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self' https://*.algolia.net/ ; prefetch-src 'self'; base-uri 'none'; block-all-mixed-content; form-action 'none'`;

// Content security policy
app.use(async (ctx, next) => {
  await next();
  ctx.response.headers.set("content-security-policy", CONTENT_SECURITY_POLICY);
  ctx.response.headers.set("x-content-type-options", "no-sniff");
  ctx.response.headers.set("x-frame-options", "deny");
  ctx.response.headers.set("x-xss-protection", "1; mode=block");
});

app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("listen", (e) => {
  console.log(
    `%cListening on http://${e.hostname ?? "localhost"}:${e.port}`,
    "color:lime",
  );
});
await app.listen({ port: 8000 });
