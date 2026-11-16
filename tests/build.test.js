import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { cp, mkdir, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

const root = fileURLToPath(new URL("../", import.meta.url));
const run = promisify(execFile);

test("the built project-site root opens the scenario and preserves related routes", async () => {
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), "failure-lab-build-"));
  try {
    await cp(path.join(root, "web"), path.join(temporaryRoot, "web"), { recursive: true });
    await mkdir(path.join(temporaryRoot, "scripts"));
    await mkdir(path.join(temporaryRoot, "docs"));
    await cp(path.join(root, "scripts", "build.js"), path.join(temporaryRoot, "scripts", "build.js"));
    await cp(path.join(root, "docs", "SCENARIO.md"), path.join(temporaryRoot, "docs", "SCENARIO.md"));
    await cp(path.join(root, "package.json"), path.join(temporaryRoot, "package.json"));
    await run(process.execPath, [path.join(temporaryRoot, "scripts", "build.js")]);

    const dist = path.join(temporaryRoot, "dist");
    const scenario = await readFile(path.join(dist, "index.html"), "utf8");
    assert.match(scenario, /id="mission-briefing"/);
    assert.match(scenario, /id="start-button"/);
    for (const [attribute, expected] of [
      ["./styles.css", "/failure-lab/styles.css"],
      ["./src/app.js", "/failure-lab/src/app.js"],
      ["./about/", "/failure-lab/about/"],
      ["./docs/SCENARIO.md", "/failure-lab/docs/SCENARIO.md"],
    ]) {
      assert.ok(scenario.includes(`"${attribute}"`));
      assert.equal(new URL(attribute, "https://example.test/failure-lab/").pathname, expected);
    }

    const legacy = await readFile(path.join(dist, "scenario", "index.html"), "utf8");
    assert.match(legacy, /content="0; url=\.\.\/"/);
    assert.match(await readFile(path.join(dist, "home", "index.html"), "utf8"), /Start Scenario 01/);
    assert.match(await readFile(path.join(dist, "about", "index.html"), "utf8"), /About \| Failure Lab/);
    assert.ok(await readFile(path.join(dist, "docs", "SCENARIO.md"), "utf8"));
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
});
