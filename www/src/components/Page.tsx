/** @jsx h */
import { h } from "../../deps.ts";
import { TableOfContents } from "../table_of_contents.ts";
import { VersionInfo, VersionType } from "../versions.ts";
import { ToC } from "./ToC.tsx";

export interface PageProps {
  title: string;
  url: URL;
  version: VersionInfo;
  toc: TableOfContents;
  mdBody: string;
}

// TODO(lucacasonato): add meta description and meta og:description
// TODO(lucacasonato): version identifier should be link to commit / release notes
// TODO(lucacasonato): add "Go to latest" CTA for preview warning

export function Page(props: PageProps) {
  let versionLabel: string;
  let versionIdentifier: string;

  switch (props.version.type) {
    case VersionType.Release:
      versionLabel = "Release";
      versionIdentifier = `v${props.version.version}`;
      break;
    case VersionType.Preview:
      versionLabel = "Commit";
      versionIdentifier = props.version.version.slice(0, 6);
      break;
    case VersionType.Local:
      versionLabel = "Local";
      versionIdentifier = "dev";
      break;
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{props.title}</title>
        <meta property="og:title" content={props.title} />
        <meta property="og:url" content={props.url.href} />
        <link rel="stylesheet" href="/static/gfm.css" />
        <link rel="stylesheet" href="/static/main.css" />
      </head>
      <body
        data-color-mode="auto"
        data-light-theme="light"
        data-dark-theme="dark"
      >
        <header class="header">
          <div class="inner">
            <div class="title">
              <img src="/static/logo.svg" alt="deno logo" /> Manual
            </div>
            <div class="version">
              <div class="label">{versionLabel}</div>
              <div class="id">{versionIdentifier}</div>
            </div>
          </div>
        </header>
        <main>
          {props.version.type === VersionType.Preview &&
            (
              <div class="warning-banner">
                <div class="inner">
                  You are viewing documentation generated from a{" "}
                  <b>user contribution</b>{" "}
                  or an upcoming or past release. The contents of this document
                  may not have been reviewed by the Deno team.
                </div>
              </div>
            )}
          <div class="main">
            <div class="toc">
              <ToC
                toc={props.toc}
                version={props.version}
                currentPath={props.url.pathname}
              />
            </div>
            <div class="content">
              <div
                class="markdown-body"
                dangerouslySetInnerHTML={{ __html: props.mdBody }}
              />
            </div>
            <div class="toc-balancer" />
          </div>
        </main>
      </body>
    </html>
  );
}
