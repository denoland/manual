globalThis.process = { env: { NODE_ENV: "production" } };
const htmlEl = document.getElementsByTagName("html").item(0);
const prefersColorScheme = window.matchMedia("(prefers-color-scheme: dark)");
function update() {
  if (prefersColorScheme.matches) {
    htmlEl.setAttribute("data-theme", "dark");
  } else {
    htmlEl.setAttribute("data-theme", "light");
  }
}
update();
prefersColorScheme.addEventListener("change", () => update());

import docsearch from "./docsearch.js";

docsearch({
  container: "#docsearch",
  appId: "BH4D9OD16A",
  apiKey: "a05e65bb082b87ff0ae75506f1b29fce",
  indexName: "deno_manual",
  searchParameters: {
    facetFilters: ["version:latest"],
  },
});
