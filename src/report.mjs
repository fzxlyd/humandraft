export function renderMarkdownReport(result, sourceName = "input") {
  const lines = [
    `# HumanDraft Audit: ${sourceName}`,
    "",
    `Profile: \`${result.profile}\``,
    `Score: **${result.score}/100**`,
    "",
    "## Summary",
    "",
    `- Total findings: ${result.summary.total}`,
    `- High: ${result.summary.high}`,
    `- Medium: ${result.summary.medium}`,
    `- Low: ${result.summary.low}`,
    ""
  ];

  if (result.findings.length === 0) {
    lines.push("No findings. This does not prove the draft is good; it means no enabled rule fired.");
    return `${lines.join("\n")}\n`;
  }

  lines.push("## Findings", "");

  for (const [index, finding] of result.findings.entries()) {
    lines.push(
      `### ${index + 1}. ${finding.id} (${finding.severity})`,
      "",
      finding.message,
      "",
      `Evidence: \`${finding.evidence.replaceAll("`", "'")}\``,
      "",
      `Advice: ${finding.advice}`,
      ""
    );
  }

  lines.push(
    "## Rewrite Contract",
    "",
    "Before rewriting, answer these questions:",
    "",
    "1. Which findings must be fixed first?",
    "2. What concrete action or evidence will replace each vague phrase?",
    "3. What should remain unchanged because it belongs to the writer's voice?",
    ""
  );

  return `${lines.join("\n")}\n`;
}
