/** @jsx h */
import { h } from "../../deps.ts";
import { TableOfContents, TableOfContentsItem } from "../table_of_contents.ts";
import { VersionInfo } from "../versions.ts";

export interface ToCProps {
  toc: TableOfContents;
  version: VersionInfo;
  currentPath: string;
}

export function ToC(props: ToCProps) {
  return (
    <ol class="list">
      {props.toc.listItems().map((item) => (
        <TocItem
          item={item}
          currentPath={props.currentPath}
          version={props.version}
        />
      ))}
    </ol>
  );
}

interface TocItemProps {
  item: TableOfContentsItem;
  version: VersionInfo;
  currentPath: string;
}

function TocItem(props: TocItemProps) {
  const path = `/${props.version.version}/${
    encodeURIComponent(props.item.slug)
  }`;
  const isActive = path === props.currentPath;
  return (
    <li
      class={isActive ? "active" : undefined}
      aria-current={isActive ? "page" : undefined}
    >
      <a href={path}>{props.item.name}</a>
      <ol class="list">
        {props.item.children.map((child) => {
          const childPath = `${path}/${encodeURIComponent(child.slug)}`;
          const isActive = childPath === props.currentPath;
          return (
            <li
              class={isActive ? "active" : undefined}
              aria-current={isActive ? "page" : undefined}
            >
              <a href={childPath}>{child.name}</a>
            </li>
          );
        })}
      </ol>
    </li>
  );
}
