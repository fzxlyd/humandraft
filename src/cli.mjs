#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { basename } from "node:path";
import { auditText } from "./audit.mjs";
import { renderMarkdownReport } from "./report.mjs";
import { knownProfiles } from "./rules.mjs";

async function main(argv) {
  const [command, filePath, ...rest] = argv;

  if (!command || command === "help" || command === "--help") {
    printHelp();
    return;
  }

  if (command !== "audit") {
    throw new Error(`Unknown command "${command}".`);
  }

  if (!filePath) {
    throw new Error("Missing file path.");
  }

  const profile = readOption(rest, "--profile") ?? "general";
  const text = await readFile(filePath, "utf8");
  const result = auditText(text, { profile });

  process.stdout.write(renderMarkdownReport(result, basename(filePath)));
}

function readOption(args, name) {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
}

function printHelp() {
  process.stdout.write(`HumanDraft

Usage:
  node src/cli.mjs audit <file> [--profile ${knownProfiles.join("|")}]

Examples:
  node src/cli.mjs audit samples/qiba-ai-ish.md --profile qiba
  node src/cli.mjs audit draft.md --profile story
`);
}

main(process.argv.slice(2)).catch((error) => {
  process.stderr.write(`HumanDraft error: ${error.message}\n`);
  process.exitCode = 1;
});
