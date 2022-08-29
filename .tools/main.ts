import { createFetchRequester } from "@algolia/requester-fetch";
import algoliasearch from "algoliasearch";
import dax from "dax";
import { MarkdownRecord, toRecords } from "markdown_records";
import { config } from "std/dotenv/mod.ts";

interface Section {
  name: string;
  children?: {
    [child: string]: string;
  };
}

interface TableOfContents {
  [section: string]: Section;
}

const MANUAL_INDEX = "manual_new";

dax.logStep("Generate manual search records...");

dax.logStep("Parsing manual toc...");

const toc: TableOfContents =
  (await import("../toc.json", { assert: { type: "json" } })).default;

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

for (const [id, section] of Object.entries(toc)) {
  let content: string;
  try {
    content = await Deno.readTextFile(`../${id}.md`);
  } catch (err) {
    dax.logError(`Error attempting to read "/${id}.md".`);
    console.log(err);
    continue;
  }
  const docPath = `/manual/${id}`;
  const hierarchy = [section.name];
  dax.logLight(`  generating "${docPath}"...`);
  const records = (await toRecords(content))
    .map((record, i) => markdownToSearch(hierarchy, docPath, record, i));
  searchRecords = searchRecords.concat(records);
  if (section.children) {
    for (const [childId, child] of Object.entries(section.children)) {
      let content: string;
      try {
        content = await Deno.readTextFile(`../${id}/${childId}.md`);
      } catch (err) {
        dax.logError(`Error attempting to read "/${id}/${childId}.md".`);
        console.log(err);
        continue;
      }
      const docPath = `/manual/${id}/${childId}`;
      const hierarchy = [section.name, child];
      dax.logLight(`  generating "${docPath}"...`);
      const records = (await toRecords(content))
        .map((record, i) => markdownToSearch(hierarchy, docPath, record, i));
      searchRecords = searchRecords.concat(records);
    }
  }
}

dax.logStep(`Uploading ${searchRecords.length} search records to algolia...`);

await config({ export: true });
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
