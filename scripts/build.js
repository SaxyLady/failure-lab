import { access, cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const webDirectory = path.join(repositoryRoot, "web");
const outputDirectory = path.join(repositoryRoot, "dist");
const requiredFiles = [
  "index.html",
  "about/index.html",
  "scenario/index.html",
  "styles.css",
  "src/app.js",
  "src/model.js",
];

await rm(outputDirectory, { recursive: true, force: true });
await cp(webDirectory, outputDirectory, { recursive: true });
await mkdir(path.join(outputDirectory, "docs"), { recursive: true });
await cp(
  path.join(repositoryRoot, "docs", "SCENARIO.md"),
  path.join(outputDirectory, "docs", "SCENARIO.md"),
);

for (const file of requiredFiles) {
  await access(path.join(outputDirectory, file));
}
await access(path.join(outputDirectory, "docs", "SCENARIO.md"));

console.log(`Static production site built in ${path.relative(repositoryRoot, outputDirectory)}.`);
