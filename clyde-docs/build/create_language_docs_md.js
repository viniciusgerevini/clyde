import fs from "fs";
import { marked } from 'marked';

const languageRefFolder = "docs/en/2-language/";
const outputMd = "public/en/clyde_language.md";
const outputHtml = "public/en/clyde_language.html";
const docsBase = "https://thisisvini.com/clyde/en/"

const files = fs.readdirSync(languageRefFolder);

files.unshift("index.md");
files.pop();

let content = "";

for (let fileName of files) {
  const file = fs.readFileSync(`${languageRefFolder}${fileName}`, { encoding: 'utf8' });
  const lines = file.split("\n");
  const shouldBumpHeaders = fileName !== "index.md";

  let processingMetadata = lines[0].startsWith("<!-");
  let fileContent = "";
  for (let line of lines) {
    if (processingMetadata) {
      if (line.startsWith("-->")) {
        processingMetadata = false;
      }
      continue;
    }

    if (shouldBumpHeaders) {
      if (line.startsWith("#")) {
        line = "#" + line;
      }
    }

    const matches = line.matchAll(/\(\.{1,2}?((\/\d([^/|\)]+)))+\/?(index.md)?\)/g);
    for (let m of matches) {
      const rawLink = m[0];
      const newLink = rawLink.split("/").map(
        p => p.replace(/\d+\-/, '').replace(".md", ".html")
      ).join("/").replace(/^\(\.\.\//, docsBase);

      line = line.replace(rawLink, `(${newLink})`);
    }

    fileContent += line + "\n";
  }

  content += fileContent;
}

fs.writeFileSync(outputMd, content);
fs.writeFileSync(outputHtml, marked.parse(content));

