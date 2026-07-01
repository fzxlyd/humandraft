const gate = (id, label, severity, description, patterns, advice) => ({
  id,
  label,
  severity,
  description,
  patterns,
  advice
});

export const deslopGates = [
  gate(
    "gate-a-banned-phrases",
    "Gate A: banned AI phrases",
    "blocker",
    "Template phrases that make the text sound generated.",
    [
      /你绝对想不到/g,
      /原来我们都错了/g,
      /其实真相是/g,
      /在这个.*?时代/g,
      /值得注意的是/g,
      /总而言之/g,
      /综上所述/g,
      /温暖治愈/g,
      /直击人心/g,
      /人间烟火/g,
      /生活不易.*?热爱/g
    ],
    "Replace slogan-like phrases with a visible action, object, or line of dialogue."
  ),
  gate(
    "gate-b-routine-motion",
    "Gate B: routine body-language filler",
    "warning",
    "Overused body-language shortcuts often seen in AI fiction.",
    [
      /深吸一口气/g,
      /长舒一口气/g,
      /缓缓开口/g,
      /嘴角.*?上扬/g,
      /眼中闪过/g,
      /眼底闪过/g,
      /不禁/g,
      /微微/g,
      /淡淡/g
    ],
    "Keep the action only if it changes the scene. Otherwise use a more specific behavior."
  ),
  gate(
    "gate-c-psychology-telling",
    "Gate C: psychology is named, not shown",
    "warning",
    "The draft explains emotion instead of letting action carry it.",
    [
      /他很(?:焦虑|痛苦|温暖|感动|震惊|愧疚)/g,
      /她很(?:焦虑|痛苦|温暖|感动|震惊|愧疚)/g,
      /内心.*?(复杂|崩溃|触动|震动)/g,
      /情绪.*?(爆发|崩溃|释放)/g
    ],
    "Move the emotion into a small action, pause, unfinished sentence, or object interaction."
  ),
  gate(
    "gate-d-dialogue-polish",
    "Gate D: dialogue sounds written",
    "warning",
    "Characters speak in polished explanatory prose.",
    [
      /我认为.*?因为/g,
      /从某种意义上/g,
      /这说明/g,
      /我们应该/g,
      /关键在于/g
    ],
    "Shorten the line. Let one character say less than they know."
  ),
  gate(
    "gate-e-preachy-ending",
    "Gate E: preachy ending",
    "blocker",
    "The ending turns into a conclusion instead of an aftertaste.",
    [
      /这就是.*?(生活|人生|健康|亲情)/g,
      /也许.*?这才是/g,
      /愿我们/g,
      /从此以后.*?明白/g,
      /故事告诉我们/g
    ],
    "End on an action, a restrained line, or an unanswered question."
  ),
  gate(
    "gate-f-fake-authority",
    "Gate F: fake authority",
    "blocker",
    "Authority claims appear without a source or boundary.",
    [
      /科学研究表明/g,
      /专家指出/g,
      /权威机构/g,
      /数据显示/g,
      /最科学/g,
      /一定(?:能|会|可以)/g
    ],
    "Add an evidence card or soften the claim with a clear boundary."
  )
];

export function runDeslopGates(text) {
  return deslopGates.map((currentGate) => {
    const issues = collectIssues(text, currentGate);

    return {
      id: currentGate.id,
      label: currentGate.label,
      severity: currentGate.severity,
      status: issues.length === 0 ? "pass" : currentGate.severity,
      description: currentGate.description,
      advice: currentGate.advice,
      issues
    };
  });
}

export function summarizeDeslopGates(gates) {
  return {
    total: gates.reduce((sum, currentGate) => sum + currentGate.issues.length, 0),
    blockers: gates.filter((currentGate) => currentGate.status === "blocker").length,
    warnings: gates.filter((currentGate) => currentGate.status === "warning").length
  };
}

function collectIssues(text, currentGate) {
  const seen = new Set();

  return currentGate.patterns.flatMap((pattern) => {
    const matches = [...text.matchAll(pattern)];

    return matches.flatMap((match) => {
      const evidence = match[0];
      const key = `${currentGate.id}:${evidence}`;

      if (seen.has(key)) {
        return [];
      }

      seen.add(key);

      return {
        evidence,
        index: match.index ?? 0
      };
    });
  });
}
