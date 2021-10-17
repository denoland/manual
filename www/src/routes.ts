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
import { decodeMarkdown, renderMarkdown, summarizeMarkdown } from "./render.ts";
import { State } from "./state.ts";
import { TableOfContents } from "./table_of_contents.ts";
import { normalizeVersion } from "./versions.ts";
import { Page } from "./components/Page.tsx";
import { cliToStd } from "../versions.ts";

const BUILD_ID = Deno.env.get("DENO_DEPLOYMENT_ID") ||
  // @ts-ignore lib.dom does not support crypto.randomUUID
  crypto.randomUUID().slice(0, 8);

const router = new Router<RouteParams, State>();

router.get("/", (ctx) => {
  const version = Object.keys(cliToStd)[0];
  console.log(version.substring(1));
  ctx.response.redirect(`/${version}/introduction`);
});

router.get(`/static-${BUILD_ID}/gfm.css`, (ctx) => {
  ctx.response.body = gfmCSS;
  ctx.response.type = "text/css";
  ctx.response.headers.set("Cache-Control", "public, max-age=31536000");
});

router.get(`/static-${BUILD_ID}/:path*`, async (ctx) => {
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
  ctx.response.headers.set("Cache-Control", "public, max-age=31536000");
});

router.get("/:path*", async (ctx) => {
  const fullPath = normalizeURLPath(ctx.params.path ?? "");
  if (fullPath === null) return;

  // Try to parse the first segment as a version.
  const maybeVersion = fullPath.split("/")[1] || "";
  const version = normalizeVersion(maybeVersion);

  // Everything after that is the `path`
  const path = fullPath.split("/").slice(2).join("/");

  // If the first item is not a version, we redirect to ${latest}/${fullPath}
  if (version === null) {
    const version = Object.keys(cliToStd)[0].slice(1);
    ctx.response.redirect(
      `/${version}${fullPath}`,
    );
    return;
  }

  // If the path is empty, we redirect to `/introduction`
  if (path === "") {
    ctx.response.redirect(`/${version.version}/introduction`);
    return;
  }

  // If the parsed version does not match the version in the URL, it was
  // normalized, and we redirect to the normalized version.
  if (version.version !== maybeVersion) {
    ctx.response.redirect(
      `/${version.version}/${path}`,
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

    const githubUrl = ctx.state.fs.githubUrl(version, `${path}.md`);

    const pageName = toc.getName(path);
    if (pageName === null) return;

    const text = decodeMarkdown(sourceData, version);
    const body = renderMarkdown(text);

    const title = `${pageName} | Deno Manual`;

    const summary = summarizeMarkdown(text);

    const html = "<!DOCTYPE html>" + renderToString(h(Page, {
      title,
      summary,
      toc,
      version,
      url: ctx.request.url,
      githubUrl,
      mdBody: body,
      buildId: BUILD_ID,
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
