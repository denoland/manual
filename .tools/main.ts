import { createFetchRequester } from "@algolia/requester-fetch";
import algoliasearch from "algoliasearch";
import dax from "dax";
import { MarkdownRecord, toRecords } from "markdown_records";
import { load } from "std/dotenv/mod.ts";
import toc from "../toc.json" assert { type: "json" };

export interface TableOfContents {
  [slug: string]: {
    name: string;
    children?: TableOfContents;
  } | string;
}

const MANUAL_INDEX = "manual";

dax.logStep("Generate manual search records...");

dax.logStep("Parsing manual toc...");

dax.logLight(`  ${Object.keys(toc).length} sections in toc.`);

interface SearchRecordHierarchy {
  [lvl: string]: string | null;
}

type SearchRecord = Omit<MarkdownRecord, "hierarchy"> & {
  objectID: string;
  docPath: string;
  level: number;
  hierarchy: SearchRecordHierarchy;
};

function mergeHierarchy(
  docHierarchy: string[],
  recordHierarchy: string[],
): [SearchRecordHierarchy, number] {
  const entries: [string, string | null][] = [];
  let count = 0;
  for (const item of docHierarchy) {
    entries.push([`lvl${count++}`, item]);
  }
  if (
    docHierarchy[docHierarchy.length - 1].toLowerCase() ===
      recordHierarchy[0]?.toLowerCase()
  ) {
    recordHierarchy.shift();
  }
  for (const item of recordHierarchy) {
    entries.push([`lvl${count++}`, item]);
  }
  const level = count;
  while (count < 7) {
    entries.push([`lvl${count++}`, null]);
  }
  return [Object.fromEntries(entries) as SearchRecordHierarchy, level];
}

function markdownToSearch(
  docHierarchy: string[],
  docPath: string,
  { hierarchy: recordHierarchy, ...record }: MarkdownRecord,
  idx: number,
): SearchRecord {
  const objectID = `${docPath}-${idx}`;
  const [hierarchy, level] = mergeHierarchy(docHierarchy, recordHierarchy);
  return {
    objectID,
    level,
    docPath,
    hierarchy,
    ...record,
  };
}

let searchRecords: SearchRecord[] = [];

async function travelToC(
  table: TableOfContents,
  parents: [name: string, id: string][],
) {
  for (const [id, section] of Object.entries(table)) {
    const name = typeof section === "string" ? section : section.name;
    const fullHierachy: [string, string][] = [...parents, [name, id]];
    let content: string;
    const fullId = fullHierachy.map(([_, id]) => id).join("/");
    try {
      content = await Deno.readTextFile(`../${fullId}.md`);
    } catch (err) {
      dax.logError(`Error attempting to read "/${fullId}.md".`);
      console.log(parents, id, section, err);
      continue;
    }
    const docPath = `/manual/${id}`;
    const nameHierarchy = fullHierachy.map(([name, _]) => name);
    dax.logLight(`  generating "${docPath}"...`);
    const records = (await toRecords(content))
      .map((record, i) => markdownToSearch(nameHierarchy, docPath, record, i));
    searchRecords = searchRecords.concat(records);

    if (typeof section !== "string" && section.children) {
      await travelToC(section.children, fullHierachy);
    }
  }
}

await travelToC(toc, []);
dax.logStep(`Uploading ${searchRecords.length} search records to algolia...`);

await load({ export: true });
const appId = Deno.env.get("ALGOLIA_APP_ID") ?? "";
const apiKey = Deno.env.get("ALGOLIA_API_KEY") ?? "";
const requester = createFetchRequester();
const app = algoliasearch(appId, apiKey, { requester });

dax.logLight(`  deleting objects from "${MANUAL_INDEX}"...`);
const manualIndex = app.initIndex(MANUAL_INDEX);
await manualIndex.clearObjects();

dax.logLight(`  uploading objects to "${MANUAL_INDEX}"...`);
const response = await app.multipleBatch(
  searchRecords.map((body) => ({
    indexName: MANUAL_INDEX,
    action: "addObject",
    body,
  })),
);

dax.logLight(`  uploaded ${response.objectIDs.length}.`);

dax.logStep("Done.");
// algolia holds open things for some reason...
Deno.exit(0);
