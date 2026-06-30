#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { basename } from "node:path";
import { auditText } from "./audit.mjs";
import { composeDraft } from "./compose.mjs";
import { renderMarkdownReport } from "./report.mjs";
import { knownProfiles } from "./rules.mjs";
import { knownStyles } from "./style-packs.mjs";

async function main(argv) {
  const [command, filePath, ...rest] = argv;

  if (!command || command === "help" || command === "--help") {
    printHelp();
    return;
  }

  if (!["audit", "compose"].includes(command)) {
    throw new Error(`Unknown command "${command}".`);
  }

  if (!filePath) {
    throw new Error("Missing file path.");
  }

  const profile = readOption(rest, "--profile") ?? "general";

  if (command === "audit") {
    const text = await readFile(filePath, "utf8");
    const result = auditText(text, { profile });
    process.stdout.write(renderMarkdownReport(result, basename(filePath)));
    return;
  }

  const style = readOption(rest, "--style");
  const brief = JSON.parse(await readFile(filePath, "utf8"));
  const result = composeDraft(brief, { profile, style });

  process.stdout.write(renderComposeReport(result, basename(filePath)));
}

function readOption(args, name) {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
}

function renderComposeReport(result, sourceName) {
  return [
    `# HumanDraft Compose: ${sourceName}`,
    "",
    `Style: \`${result.style}\``,
    `Profile: \`${result.profile}\``,
    `Audit score: **${result.audit.score}/100**`,
    "",
    result.draft,
    "",
    "## Self-Audit Summary",
    "",
    `- Total findings: ${result.audit.summary.total}`,
    `- High: ${result.audit.summary.high}`,
    `- Medium: ${result.audit.summary.medium}`,
    `- Low: ${result.audit.summary.low}`,
    "",
    "## Rewrite Contract",
    "",
    ...result.audit.findings.slice(0, 8).map((finding) => `- ${finding.severity}: ${finding.id} — ${finding.advice}`),
    ""
  ].join("\n");
}

function printHelp() {
  process.stdout.write(`HumanDraft

Usage:
  node src/cli.mjs audit <file> [--profile ${knownProfiles.join("|")}]
  node src/cli.mjs compose <brief.json> [--style ${knownStyles.join("|")}] [--profile ${knownProfiles.join("|")}]

Examples:
  node src/cli.mjs audit samples/qiba-ai-ish.md --profile qiba
  node src/cli.mjs compose samples/brief-qiba-soup.json --style oral --profile qiba
  node src/cli.mjs audit draft.md --profile story
`);
}

main(process.argv.slice(2)).catch((error) => {
  process.stderr.write(`HumanDraft error: ${error.message}\n`);
  process.exitCode = 1;
});
