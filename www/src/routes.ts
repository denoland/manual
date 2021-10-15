import {
  extname,
  gfmCSS,
  h,
  join,
  renderToString,
  RouteParams,
  Router,
} from "../deps.ts";
import { normalizeURLPath } from "./filesystem.ts";
import { decodeMarkdown, renderMarkdown } from "./render.ts";
import { State } from "./state.ts";
import { TableOfContents } from "./table_of_contents.ts";
import { normalizeVersion } from "./versions.ts";
import { Page } from "./components/Page.tsx";

const router = new Router<RouteParams, State>();

router.get("/", (ctx) => {
  ctx.response.body = "Hello World";
});

router.get("/static/gfm.css", (ctx) => {
  ctx.response.body = gfmCSS;
  ctx.response.type = "text/css";
});

router.get("/static/:path*", async (ctx) => {
  const path = normalizeURLPath(ctx.params.path ?? "");
  if (path === null) return;

  try {
    const file = await Deno.readFile(
      join(Deno.cwd?.() ?? "./", "www/static", path),
    );
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

    const url = ctx.request.url;

    const text = decodeMarkdown(sourceData, version);
    const body = renderMarkdown(text, url.href);

    const title = `${pageName} | Deno Manual`;

    const html = "<!DOCTYPE html>" + renderToString(h(Page, {
      title,
      toc,
      version,
      url,
      mdBody: body,
    }));

    ctx.response.body = html;
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
