import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { initProjectBible } from "../src/project-bible.mjs";

test("initProjectBible creates qiba tracking files", async () => {
  const dir = await mkdtemp(join(tmpdir(), "humandraft-qiba-"));
  const result = await initProjectBible(dir, { profile: "qiba" });

  assert.equal(result.profile, "qiba");
  assert.ok(result.written.includes("bible/qiba-gates.md"));

  const gates = await readFile(join(dir, "bible", "qiba-gates.md"), "utf8");
  assert.match(gates, /title must not state/);
  assert.match(gates, /90-120 seconds/);
});

test("initProjectBible skips existing files by default", async () => {
  const dir = await mkdtemp(join(tmpdir(), "humandraft-general-"));
  await initProjectBible(dir, { profile: "general" });
  const result = await initProjectBible(dir, { profile: "general" });

  assert.ok(result.skipped.includes("humandraft.json"));
});
