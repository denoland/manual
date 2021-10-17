/** @jsx h */
import { h } from "../../deps.ts";
import { TableOfContents } from "../table_of_contents.ts";
import { VersionInfo, VersionType } from "../versions.ts";
import { ToC } from "./ToC.tsx";

export interface PageProps {
  title: string;
  summary: string;
  url: URL;
  githubUrl: URL | null;
  version: VersionInfo;
  toc: TableOfContents;
  mdBody: string;
  buildId: string;
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
      versionIdentifier = props.version.version.slice(0, 12);
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
        <meta name="description" content={props.summary} />
        <meta property="og:title" content={props.title} />
        <meta property="og:url" content={props.url.href} />
        <meta property="og:description" content={props.summary} />
        <link rel="stylesheet" href={`/static-${props.buildId}/gfm.css`} />
        <link
          rel="stylesheet"
          href={`/static-${props.buildId}/docsearch.css`}
        />
        <link rel="stylesheet" href={`/static-${props.buildId}/main.css`} />
        <script type="module" src={`/static-${props.buildId}/search.js`} />
        <link
          rel="preconnect"
          href="https://BH4D9OD16A-dsn.algolia.net"
          crossOrigin="true"
        />
      </head>
      <body
        data-color-mode="auto"
        data-light-theme="light"
        data-dark-theme="dark"
      >
        <div class="page">
          <div class="sidebar">
            <header>
              <a href="/" class="logo">
                <img
                  src={`/static-${props.buildId}/logo.svg`}
                  alt="deno logo"
                />
                <h3>Deno Manual</h3>
              </a>
              <div class="version">
                <div class="selector">{versionIdentifier}</div>
              </div>
              <div id="docsearch" />
            </header>
            <nav>
              <div class="toc">
                <ToC
                  toc={props.toc}
                  version={props.version}
                  currentPath={props.url.pathname}
                />
              </div>
            </nav>
          </div>
          <div class="content">
            {props.version.type === VersionType.Preview &&
              (
                <div class="warning-banner">
                  <div class="inner">
                    You are viewing documentation generated from a{" "}
                    <b>user contribution</b>{" "}
                    or an upcoming or past release. The contents of this
                    document may not have been reviewed by the Deno team.{" "}
                    <a href="/">
                      Click here to view the documentation for the latest
                      release.
                    </a>
                  </div>
                </div>
              )}
            <main>
              <div class="md">
                {props.githubUrl &&
                  (
                    <a class="edit-on-github" href={props.githubUrl.href}>
                      <span class="sr-only">GitHub</span>
                      <svg
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <title>Edit on GitHub</title>
                        <path
                          fill-rule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          clip-rule="evenodd"
                        >
                        </path>
                      </svg>
                    </a>
                  )}
                <article
                  class="markdown-body"
                  dangerouslySetInnerHTML={{ __html: props.mdBody }}
                />
              </div>
            </main>
          </div>
        </div>

        {
          /* <header class="header">
          <div class="inner">
            <div class="title">
              <img src={`/static-${props.buildId}/logo.svg`} alt="deno logo" />
              {" "}
              Manual
            </div>
            <div class="version">
              <div class="label">{versionLabel}</div>
              <div class="id">{versionIdentifier}</div>
            </div>
          </div>
        </header>
        <main>
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
        </main> */
        }
      </body>
    </html>
  );
}
