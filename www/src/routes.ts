import { extname, join, RouteParams, Router } from "../deps.ts";
import { normalizeURLPath } from "./filesystem.ts";
import { decodeMarkdown, renderMarkdown, sanitizeText } from "./render.ts";
import { State } from "./state.ts";
import { TableOfContents } from "./table_of_contents.ts";
import { normalizeVersion } from "./versions.ts";

const router = new Router<RouteParams, State>();

router.get("/", (ctx) => {
  ctx.response.body = "Hello World";
});

router.get("/static/:path*", async (ctx) => {
  const path = normalizeURLPath(ctx.params.path ?? "");
  if (path === null) return;

  try {
    const file = await Deno.readFile(join(Deno.cwd(), "www/static", path));
    ctx.response.body = file;
    ctx.response.type = extname(path);
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      ctx.response.status = 404;
      ctx.response.body = "Not Found";
      return;
    }
    throw err;
  }
});

router.get("/:version/:path*", async (ctx) => {
  const path = ctx.params.path ?? "";

  // Parse the passed version. If it needed to be normalized, redirect to the
  // normalized version. If the version is unparsable, return a 404.
  const orignalVersion = ctx.params.version!;
  const version = normalizeVersion(orignalVersion);
  if (version === null) return;
  if (version.version !== orignalVersion) {
    ctx.response.redirect(
      `/${version.version}${path ? `/${path}` : ""}`,
    );
    return;
  }

  // If the user requested a bare path (without an extension), they want the
  // rendered page. If they are requesting a file with an extension, they
  // want the raw file.
  const extension = extname(path ?? "");
  if (extension === "") {
    const [sourceData, toc] = await Promise.all([
      ctx.state.fs.readAll(version, `${path}.md`),
      TableOfContents.fromFs(ctx.state.fs, version),
    ]);
    if (sourceData === null || toc === null) return;

    const pageName = toc.getName(path);
    if (pageName === null) return;

    const text = decodeMarkdown(sourceData, version);
    const html = renderMarkdown(text);

    const title = sanitizeText(`${pageName} | Deno Manual`);

    // TODO(lucacasonato): add meta description and meta og:description
    ctx.response.body = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta property="og:title" content="${title}" />
    <meta property="og:url" content="${ctx.request.url.href}" />
    <link rel="stylesheet" href="/static/normalize.css">
    <link rel="stylesheet" href="/static/main.css">
    <link rel="stylesheet" href="/static/markdown.css">
    <script src="/static/prism.js" defer></script>
  </head>
  <body>
    <div class="header"><div class="inner">
      <div class="title">
        <img src="/static/logo.svg"> Manual
      </div>
      <div class="version">
        <div class="label">Version</div>
        <div class="id">${version.version}</div>
      </div>
    </div></div>
    <div class="content">
      <div class="markdown-body">${html}</div>
    </div>
  </body>
</html>`;
    ctx.response.type = "html";
  } else {
    // Get the source of the file.
    // TODO(lucacasonato): this should be streaming in the future.
    const sourceData = await ctx.state.fs.readAll(version, path);
    if (sourceData === null) return;

    // We have to treat .md file specially because they contain the $STD_VERSION
    // string that needs to be replaced.
    if (extension === ".md") {
      const text = decodeMarkdown(sourceData, version);
      ctx.response.body = text;
      ctx.response.type = extension;
    } else {
      ctx.response.body = sourceData;
      ctx.response.type = extension;
    }
  }
});

export { router };
