# Building a Word Finder App with Deno

## Getting Started

In this tutorial we'll create a simple Word Finder web application using Deno. No prior knowledge of Deno is required.

## Introduction

Our Word Finder application will take a pattern string provided by the user and return all words in the English dictionary that match the pattern. The pattern can include alphabetical characters as well as `_` and `?`. The `?` can stand for any letter that isn't present in the pattern. `_` can stand for any letter.

For example, the pattern `c?t` matches "cat" and "cut". The pattern `go?d` matches the words "goad" and "gold" (but not "good"). 

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/fe855a02-b26a-4d80-b601-65bd31cbc099/Untitled.png)

## Building the View

We can use EJS to create a simple UI for our Word Finder app. EJS is a templating language that lets you easily generate HTML using Javascript. The code below creates a form that lets the user submit a pattern string. It also displays a list of words if specified as shown in the screenshot above.

```jsx
// index.ejs

<html>
    <head>
        <title>Deno Word Finder</title>
        <meta name="version" content="1.0">
    </head>
    <body>
        <h1>Deno Word Finder</h1>

        <form id="perform-search" name="perform-search" method="get" action="/api/search">
            <label for="search-text">Search text:</label>
            <input id="search-text" name="search-text" type="text" value="<%= pattern %>" />
            <input type="submit" />
        </form>

        <% if(words.length != 0) { %>
            <p id="search-result-count" data-count="<%= words.length %>">Words found: <%= words.length %></p>
		        <ul id="search-result" name="search-results">
            <% for(var i = 0; i < words.length; i++) { %>
                <li> <%= words[i] %> </li>
            <% } %>
            </ul>
        <% } %>
    </body>
</html>
```

## Searching the Dictionary

We also need a simple search function which scans the dictionary and returns all words that match the specified pattern. The function below takes a pattern and dictionary and then returns all matched words.

```jsx
// search.js

export function search(pattern, dictionary) {

  // Create regex pattern that excludes characters already present in word
	let excludeRegex = '';
  for (let i = 0; i < pattern.length; i++) {
    const c = pattern[i]
    if(c != '?' && c != '_') {
      excludeRegex += '^' + c;
    }
  }
  excludeRegex = '[' + excludeRegex + ']';

  // Let question marks only match characters not already present in word
  let searchPattern = pattern.replace(/\?/g, excludeRegex);

  // Let underscores match anything
  searchPattern = '^' + searchPattern.replace(/\_/g, '[a-z]') + '$';

  // Find all words in dictionary that match pattern
	let matches = [];
  for (let i = 0; i < dictionary.length; i++) {
    const word = dictionary[i];
    if(word.match(new RegExp(searchPattern))) {
      matches.push(word)
    }
  }

  return matches;
}
```

## Running a Deno Server

[Oak](https://deno.land/x/oak@v11.1.0) is a framework that lets you easily setup a server in Deno (analogous to Javascript's Express) and we'll be using it to host our application. Our server will use our search function to populate our EJS template with data and then return the HTML back to the viewer. We can conveniently rely on the `/usr/share/dict/words` file as our dictionary which is a standard file present on most Unix-like operating systems. We'll also be relying on [dejs](https://github.com/syumai/dejs) which is a EJS templating engine built for Deno.

```jsx
// server.js

import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { renderFileToString } from "https://deno.land/x/dejs/mod.ts";
import { search } from './search.js';

const dictionary = (await Deno.readTextFile('/usr/share/dict/words')).split('\n');

const app = new Application();
const port = 8080;

const router = new Router();

router.get("/", async (ctx) => {
  ctx.response.body = await renderFileToString("./index.ejs", {
    pattern: '',
    words: [],
  });
});

router.get("/api/search", async (ctx) => {
  const pattern = ctx.request.url.searchParams.get('search-text') 
  ctx.response.body = await renderFileToString("./index.ejs", {
    pattern: pattern,
    words: search(pattern, dictionary),
  });
});

app.use(router.routes());
app.use(router.allowedMethods());

console.log('Listening at http://localhost:' + port);
await app.listen({ port });
```

We can start our server with the following command. Note we need to explicitly grant access to the file system and network because Deno is secure by default.

```bash
deno run --allow-read --allow-net server.js
```

Now if you visit [http://localhost:8080](http://localhost:8080/) you should be able to view the Word Finder app.

## Example Code

You can find the entire example code [here](https://github.com/awelm/deno-word-finder).