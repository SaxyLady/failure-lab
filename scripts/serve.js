import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../web/", import.meta.url));
const port = Number(process.env.PORT ?? 4173);
const files = new Map([
  ["/", ["index.html", "text/html; charset=utf-8"]],
  ["/index.html", ["index.html", "text/html; charset=utf-8"]],
  ["/home/", ["home/index.html", "text/html; charset=utf-8"]],
  ["/home/index.html", ["home/index.html", "text/html; charset=utf-8"]],
  ["/about/", ["about/index.html", "text/html; charset=utf-8"]],
  ["/about/index.html", ["about/index.html", "text/html; charset=utf-8"]],
  ["/scenario/", ["scenario/index.html", "text/html; charset=utf-8"]],
  ["/scenario/index.html", ["scenario/index.html", "text/html; charset=utf-8"]],
  ["/retry-storm/", ["retry-storm/index.html", "text/html; charset=utf-8"]],
  ["/retry-storm/index.html", ["retry-storm/index.html", "text/html; charset=utf-8"]],
  ["/styles.css", ["styles.css", "text/css; charset=utf-8"]],
  ["/src/app.js", ["src/app.js", "text/javascript; charset=utf-8"]],
  ["/src/model.js", ["src/model.js", "text/javascript; charset=utf-8"]],
  ["/src/retry-storm-app.js", ["src/retry-storm-app.js", "text/javascript; charset=utf-8"]],
  ["/src/retry-storm-model.js", ["src/retry-storm-model.js", "text/javascript; charset=utf-8"]],
  ["/docs/SCENARIO.md", ["../docs/SCENARIO.md", "text/markdown; charset=utf-8"]],
  ["/docs/SCENARIO-02.md", ["../docs/SCENARIO-02.md", "text/markdown; charset=utf-8"]],
]);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new RangeError("PORT must be an integer between 1 and 65535.");
}

const server = createServer(async (request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" }).end();
    return;
  }

  const pathname = new URL(request.url, "http://127.0.0.1").pathname;
  const file = files.get(pathname);
  if (!file) {
    response.writeHead(404).end("Not found");
    return;
  }

  const [relativePath, contentType] = file;
  const body = await readFile(path.join(root, relativePath));
  response.writeHead(200, {
    "Content-Type": contentType,
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  response.end(request.method === "HEAD" ? undefined : body);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Failure Lab available at http://127.0.0.1:${port}`);
});

server.on("error", (error) => {
  console.error("Could not start the local server:", error);
  process.exitCode = 1;
});
