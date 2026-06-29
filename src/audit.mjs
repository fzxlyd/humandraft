import { builtInRules, knownProfiles, profileRules, severityWeight } from "./rules.mjs";

export function auditText(text, options = {}) {
  const profile = options.profile ?? "general";

  if (!knownProfiles.includes(profile)) {
    throw new Error(`Unknown profile "${profile}". Available profiles: ${knownProfiles.join(", ")}`);
  }

  const rules = [...builtInRules, ...profileRules[profile]];
  const findings = rules.flatMap((currentRule) => runRule(text, currentRule));
  const structureFindings = runStructureChecks(text, profile);
  const allFindings = [...findings, ...structureFindings];

  return {
    profile,
    score: scoreFindings(allFindings),
    summary: summarize(allFindings),
    findings: allFindings
  };
}

function runRule(text, currentRule) {
  const seen = new Set();

  return currentRule.patterns.flatMap((pattern) => {
    const matches = [...text.matchAll(pattern)];

    return matches.flatMap((match) => {
      const key = `${currentRule.id}:${match[0]}`;

      if (seen.has(key)) {
        return [];
      }

      seen.add(key);

      return {
        id: currentRule.id,
        severity: currentRule.severity,
        message: currentRule.message,
        advice: currentRule.advice,
        evidence: match[0],
        index: match.index ?? 0
      };
    });
  });
}

function runStructureChecks(text, profile) {
  const findings = [];
  const paragraphs = text.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean);
  const longParagraphs = paragraphs.filter((paragraph) => visibleLength(paragraph) > 180);

  for (const paragraph of longParagraphs) {
    findings.push({
      id: "long-paragraph",
      severity: "medium",
      message: "Long paragraph may hide multiple ideas.",
      advice: "Split by action, claim, or turn in thought.",
      evidence: excerpt(paragraph),
      index: text.indexOf(paragraph)
    });
  }

  const concreteActionCount = countMatches(text, [
    /端着/g,
    /夹/g,
    /放/g,
    /走/g,
    /坐/g,
    /看/g,
    /拿/g,
    /倒/g,
    /问/g,
    /说/g,
    /停/g
  ]);
  const abstractionCount = countMatches(text, [/认知/g, /价值/g, /共鸣/g, /时代/g, /问题/g, /真相/g]);

  if (abstractionCount >= concreteActionCount + 3) {
    findings.push({
      id: "abstraction-heavy",
      severity: "medium",
      message: "The text leans more on abstract labels than concrete actions.",
      advice: "Add visible behavior: who does what, where, with what object, and what changes.",
      evidence: `abstract=${abstractionCount}, concrete_action=${concreteActionCount}`,
      index: 0
    });
  }

  if (profile === "qiba" && !/[奶妈爸琦糖王].*?[：:]/.test(text) && !/“.*?”/.test(text)) {
    findings.push({
      id: "qiba-no-table-dialogue",
      severity: "high",
      message: "Qiba-style scripts need a real table scene before explanation.",
      advice: "Start with a natural action and one short line from a family member or customer.",
      evidence: "No obvious scene dialogue found.",
      index: 0
    });
  }

  return findings;
}

function scoreFindings(findings) {
  const penalty = findings.reduce((sum, finding) => sum + severityWeight[finding.severity], 0);
  return Math.max(0, 100 - penalty);
}

function summarize(findings) {
  return {
    total: findings.length,
    high: findings.filter((finding) => finding.severity === "high").length,
    medium: findings.filter((finding) => finding.severity === "medium").length,
    low: findings.filter((finding) => finding.severity === "low").length
  };
}

function countMatches(text, patterns) {
  return patterns.reduce((sum, pattern) => sum + [...text.matchAll(pattern)].length, 0);
}

function visibleLength(text) {
  return Array.from(text).length;
}

function excerpt(text) {
  const chars = Array.from(text);
  return chars.length <= 90 ? text : `${chars.slice(0, 90).join("")}...`;
}
