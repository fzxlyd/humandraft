import { auditText } from "./audit.mjs";
import { runDeslopGates, summarizeDeslopGates } from "./deslop-gates.mjs";
import { scoreText } from "./score.mjs";

export function runQualityGate(text, options = {}) {
  const profile = options.profile ?? "general";
  const audit = auditText(text, { profile });
  const deslop = runDeslopGates(text);
  const deslopSummary = summarizeDeslopGates(deslop);
  const score = scoreText(text, { profile });
  const domain = runDomainGate(text, { profile });

  const blockers = [
    ...audit.findings.filter((finding) => finding.severity === "high").map(toAuditIssue),
    ...deslop.flatMap((currentGate) => currentGate.status === "blocker" ? currentGate.issues.map((issue) => toDeslopIssue(currentGate, issue)) : []),
    ...domain.blockers
  ];

  const warnings = [
    ...audit.findings.filter((finding) => finding.severity !== "high").map(toAuditIssue),
    ...deslop.flatMap((currentGate) => currentGate.status === "warning" ? currentGate.issues.map((issue) => toDeslopIssue(currentGate, issue)) : []),
    ...domain.warnings
  ];

  if (score.status === "fail") {
    blockers.push({
      id: "score-fail",
      message: `Writing score is ${score.score}/100.`,
      advice: "Revise weak dimensions before publication.",
      evidence: score.weak.join(", ")
    });
  } else if (score.status === "revise") {
    warnings.push({
      id: "score-revise",
      message: `Writing score is ${score.score}/100.`,
      advice: "Improve weak dimensions before final use.",
      evidence: score.weak.join(", ")
    });
  }

  return {
    profile,
    status: blockers.length > 0 ? "blocked" : warnings.length > 0 ? "warn" : "pass",
    summary: {
      blockers: blockers.length,
      warnings: warnings.length,
      auditScore: audit.score,
      writingScore: score.score,
      deslopIssues: deslopSummary.total
    },
    blockers,
    warnings,
    audit,
    deslop,
    score,
    domain
  };
}

export function renderGateReport(result, sourceName = "draft") {
  return [
    `# HumanDraft Gate: ${sourceName}`,
    "",
    `Profile: \`${result.profile}\``,
    `Status: **${result.status}**`,
    `Audit score: **${result.summary.auditScore}/100**`,
    `Writing score: **${result.summary.writingScore}/100**`,
    "",
    "## Blockers",
    "",
    ...(result.blockers.length === 0 ? ["- none"] : result.blockers.map(renderIssue)),
    "",
    "## Warnings",
    "",
    ...(result.warnings.length === 0 ? ["- none"] : result.warnings.map(renderIssue)),
    "",
    "## Score Dimensions",
    "",
    ...result.score.dimensions.map((item) => `- ${item.label}: ${item.score}/${item.max}`),
    ""
  ].join("\n");
}

function runDomainGate(text, options = {}) {
  if (options.profile !== "qiba") {
    return { blockers: [], warnings: [] };
  }

  return runQibaGate(text);
}

function runQibaGate(text) {
  const blockers = [];
  const warnings = [];
  const title = extractTitle(text);
  const hasHealthClaim = /体检|血糖|血脂|营养|致癌|补钙|嘌呤|空腹|医院|医生|慢病|儿童|老人/.test(text);

  if (title && /别吃饭|不能吃|一定|最科学|肯定没事/.test(title) && !/[？?]/.test(title)) {
    blockers.push({
      id: "qiba-misleading-title",
      message: "Qiba health titles must not state a risky or oversimplified conclusion.",
      advice: "Turn the title into a question, conflict, or misconception.",
      evidence: title
    });
  }

  if (hasHealthClaim && !/按.*?(医院|医生|体检机构|要求|医嘱)|需要核实|来源卡|要看/.test(text)) {
    blockers.push({
      id: "qiba-health-boundary",
      message: "Health or food-safety claims need a clear boundary.",
      advice: "Add wording such as '按医院/体检机构要求为准' or mark the claim as needing verification.",
      evidence: "health claim without boundary"
    });
  }

  if (!/【店外】/.test(text)) {
    warnings.push({
      id: "qiba-missing-outside-scene",
      message: "Qiba stories should start with pressure outside the restaurant.",
      advice: "Add a short outside scene that explains why the character enters now.",
      evidence: "missing 【店外】"
    });
  }

  if (!/【店内】/.test(text)) {
    blockers.push({
      id: "qiba-missing-inside-scene",
      message: "Qiba stories need the core turn inside the restaurant.",
      advice: "Move the discovery, correction, or decision into the table scene.",
      evidence: "missing 【店内】"
    });
  }

  if (/琦爸.*?(科学研究表明|专家指出|我告诉你|你们都错了|必须|一定)/.test(text)) {
    blockers.push({
      id: "qiba-qiba-lectures",
      message: "Qiba sounds like a lecturer or doctor.",
      advice: "Shorten the line and let a food/action detail carry the correction.",
      evidence: "琦爸 lecture pattern"
    });
  }

  if (/贝妈/.test(text) && !/贝妈.*?(拿|递|收|撤|合上|扎好|看了|经过|放下)/.test(text)) {
    warnings.push({
      id: "qiba-beima-no-action",
      message: "Beima appears but does not carry the scene through action.",
      advice: "Give Beima one useful action instead of explanatory dialogue.",
      evidence: "贝妈 without functional action"
    });
  }

  const visibleChars = Array.from(text.replace(/\s/g, "")).length;
  if (visibleChars < 650) {
    warnings.push({
      id: "qiba-too-short-for-story",
      message: "The story may be too short for a 90-second Qiba episode.",
      advice: "Add one concrete motive beat or table interaction.",
      evidence: `${visibleChars} visible chars`
    });
  }

  if (visibleChars > 1600) {
    warnings.push({
      id: "qiba-too-long-for-episode",
      message: "The story may be too long for a 90-120 second episode.",
      advice: "Cut repeated explanation, weak side characters, or duplicate beats.",
      evidence: `${visibleChars} visible chars`
    });
  }

  return { blockers, warnings };
}

function extractTitle(text) {
  const markdownTitle = text.match(/^#\s+(.+)$/m);
  if (markdownTitle) return markdownTitle[1].trim();

  const quotedTitle = text.match(/《[^》]+》/);
  return quotedTitle ? quotedTitle[0] : "";
}

function toAuditIssue(finding) {
  return {
    id: finding.id,
    message: finding.message,
    advice: finding.advice,
    evidence: finding.evidence
  };
}

function toDeslopIssue(currentGate, issue) {
  return {
    id: currentGate.id,
    message: currentGate.description,
    advice: currentGate.advice,
    evidence: issue.evidence
  };
}

function renderIssue(issue) {
  return `- ${issue.id}: ${issue.message} Evidence: \`${issue.evidence || "n/a"}\` Advice: ${issue.advice}`;
}
