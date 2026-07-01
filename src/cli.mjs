#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { basename } from "node:path";
import { auditText } from "./audit.mjs";
import { generateBrief, renderBriefJson, knownTemplates } from "./brief.mjs";
import { composeDraft } from "./compose.mjs";
import { runDeslopGates } from "./deslop-gates.mjs";
import { runQualityGate, renderGateReport } from "./gate.mjs";
import { initProjectBible } from "./project-bible.mjs";
import { renderMarkdownReport } from "./report.mjs";
import { knownProfiles } from "./rules.mjs";
import { scoreText } from "./score.mjs";
import { knownStyles } from "./style-packs.mjs";

async function main(argv) {
  const [command, ...rest] = argv;

  if (!command || command === "help" || command === "--help") {
    printHelp();
    return;
  }

  if (!["audit", "compose", "brief", "write", "gate", "score", "deslop", "init", "web", "templates"].includes(command)) {
    throw new Error(`Unknown command "${command}".`);
  }

  if (command === "templates") {
    process.stdout.write(renderTemplates());
    return;
  }

  const cliProfile = readOption(rest, "--profile");

  if (command === "audit") {
    const filePath = firstPositional(rest);
    if (!filePath) throw new Error("Missing file path.");
    const text = await readFile(filePath, "utf8");
    const profile = cliProfile ?? "general";
    const result = auditText(text, { profile });
    process.stdout.write(renderMarkdownReport(result, basename(filePath)));
    return;
  }

  if (command === "gate") {
    const filePath = firstPositional(rest);
    if (!filePath) throw new Error("Missing file path.");
    const text = await readFile(filePath, "utf8");
    const profile = cliProfile ?? "general";
    const result = runQualityGate(text, { profile });
    process.stdout.write(renderGateReport(result, basename(filePath)));
    if (result.status === "blocked") process.exitCode = 2;
    if (result.status === "warn") process.exitCode = 1;
    return;
  }

  if (command === "score") {
    const filePath = firstPositional(rest);
    if (!filePath) throw new Error("Missing file path.");
    const text = await readFile(filePath, "utf8");
    const profile = cliProfile ?? "general";
    const result = scoreText(text, { profile });
    process.stdout.write(renderScoreReport(result, basename(filePath)));
    return;
  }

  if (command === "deslop") {
    const filePath = firstPositional(rest);
    if (!filePath) throw new Error("Missing file path.");
    const text = await readFile(filePath, "utf8");
    const result = runDeslopGates(text);
    process.stdout.write(renderDeslopReport(result, basename(filePath)));
    return;
  }

  if (command === "init") {
    const projectDir = firstPositional(rest);
    const profile = cliProfile ?? "general";
    const force = rest.includes("--force");
    const result = await initProjectBible(projectDir, { profile, force });
    process.stdout.write(renderInitReport(result));
    return;
  }

  if (command === "brief") {
    const template = readOption(rest, "--template");
    const style = readOption(rest, "--style");
    const demand = positional(rest).join(" ");
    const brief = generateBrief(demand, { profile: cliProfile, style, template });
    process.stdout.write(renderBriefJson(brief));
    return;
  }

  if (command === "write") {
    const template = readOption(rest, "--template");
    const style = readOption(rest, "--style");
    const demand = positional(rest).join(" ");
    const brief = generateBrief(demand, { profile: cliProfile, style, template });
    const result = composeDraft(brief, { profile: brief.profile, style: brief.style });
    process.stdout.write(renderComposeReport(result, "one-line-demand"));
    return;
  }

  if (command === "web") {
    const port = Number(readOption(rest, "--port") ?? "8787");
    const host = readOption(rest, "--host") ?? "127.0.0.1";
    const { startServer } = await import("./server.mjs");
    await startServer({ host, port });
    return;
  }

  const filePath = firstPositional(rest);
  if (!filePath) throw new Error("Missing file path.");
  const style = readOption(rest, "--style");
  const brief = JSON.parse(await readFile(filePath, "utf8"));
  const result = composeDraft(brief, { profile: cliProfile, style });

  process.stdout.write(renderComposeReport(result, basename(filePath)));
}

function readOption(args, name) {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
}

function positional(args) {
  const values = [];

  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];
    if (value.startsWith("--")) {
      index += 1;
      continue;
    }
    values.push(value);
  }

  return values;
}

function firstPositional(args) {
  return positional(args)[0];
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
  humandraft audit <file> [--profile ${knownProfiles.join("|")}]
  humandraft gate <file> [--profile ${knownProfiles.join("|")}]
  humandraft score <file> [--profile ${knownProfiles.join("|")}]
  humandraft deslop <file>
  humandraft init <project-dir> [--profile ${knownProfiles.join("|")}] [--force]
  humandraft brief "<one-line demand>" [--template ${knownTemplates.join("|")}] [--profile ${knownProfiles.join("|")}]
  humandraft write "<one-line demand>" [--template ${knownTemplates.join("|")}] [--style ${knownStyles.join("|")}]
  humandraft compose <brief.json> [--style ${knownStyles.join("|")}] [--profile ${knownProfiles.join("|")}]
  humandraft web [--port 8787]
  humandraft templates

Examples:
  npx humandraft audit samples/qiba-ai-ish.md --profile qiba
  npx humandraft gate draft.md --profile qiba
  npx humandraft score draft.md --profile qiba
  npx humandraft init ./qiba-project --profile qiba
  npx humandraft brief "琦爸酒食，隔夜菜到底能不能吃" --profile qiba
  npx humandraft write "给我故事：骨头汤补钙" --profile qiba --template story
  npx humandraft web --port 8787
`);
}

function renderInitReport(result) {
  return [
    `# HumanDraft Project Initialized`,
    "",
    `Project: \`${result.projectDir}\``,
    `Profile: \`${result.profile}\``,
    "",
    "## Written",
    "",
    ...(result.written.length === 0 ? ["- none"] : result.written.map((file) => `- ${file}`)),
    "",
    "## Skipped",
    "",
    ...(result.skipped.length === 0 ? ["- none"] : result.skipped.map((file) => `- ${file}`)),
    ""
  ].join("\n");
}

function renderScoreReport(result, sourceName) {
  return [
    `# HumanDraft Score: ${sourceName}`,
    "",
    `Profile: \`${result.profile}\``,
    `Score: **${result.score}/100**`,
    `Status: **${result.status}**`,
    "",
    "## Dimensions",
    "",
    ...result.dimensions.map((item) => `- ${item.label}: ${item.score}/${item.max}`),
    "",
    "## Weak Dimensions",
    "",
    ...(result.weak.length === 0 ? ["- none"] : result.weak.map((item) => `- ${item}`)),
    ""
  ].join("\n");
}

function renderDeslopReport(gates, sourceName) {
  return [
    `# HumanDraft Deslop Gates: ${sourceName}`,
    "",
    ...gates.map((currentGate) => [
      `## ${currentGate.label}`,
      "",
      `Status: **${currentGate.status}**`,
      `Advice: ${currentGate.advice}`,
      "",
      ...(currentGate.issues.length === 0
        ? ["- none"]
        : currentGate.issues.map((issue) => `- \`${issue.evidence}\``)),
      ""
    ].join("\n")),
    ""
  ].join("\n");
}

function renderTemplates() {
  return [
    "HumanDraft templates:",
    "",
    ...knownTemplates.map((template) => `- ${template}`),
    ""
  ].join("\n");
}

main(process.argv.slice(2)).catch((error) => {
  process.stderr.write(`HumanDraft error: ${error.message}\n`);
  process.exitCode = 1;
});
