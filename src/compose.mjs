import { auditText } from "./audit.mjs";
import { stylePacks } from "./style-packs.mjs";

export function composeDraft(brief, options = {}) {
  const styleName = options.style ?? brief.style ?? "plain";
  const profile = options.profile ?? brief.profile ?? "general";
  const style = stylePacks[styleName];

  if (!style) {
    throw new Error(`Unknown style "${styleName}".`);
  }

  const draft = renderDraft(brief, style);
  const audit = auditText(draft, { profile });

  return {
    style: styleName,
    profile,
    draft,
    audit
  };
}

function renderDraft(brief, style) {
  const format = brief.format ?? "short-script";

  if (format === "short-script") {
    return renderShortScript(brief, style);
  }

  return renderArticle(brief, style);
}

function renderShortScript(brief, style) {
  const scene = brief.scene ?? {};
  const voice = brief.voice ?? "旁白";
  const claim = firstItem(brief.claims, "这件事需要重新说清楚。");
  const evidence = firstItem(brief.evidence, "先保留证据卡，再进入终稿。");
  const turn = brief.turn ?? "问题不在于大家没常识，而是这个说法传得太久了。";
  const takeaway = brief.takeaway ?? "下次遇到这个说法，先问一句：证据在哪里？";

  return [
    `# ${brief.title ?? brief.topic ?? "Untitled Draft"}`,
    "",
    `Style: ${style.label}`,
    "",
    "## Draft",
    "",
    `${scene.who ?? "有人"}${scene.action ? scene.action : "把话说到一半"}。`,
    "",
    `${scene.line ? `${scene.who ?? "他"}：“${scene.line}”` : "桌上安静了一下。这个说法，很多人都听过。"}`,
    "",
    `${voice}：${turn}`,
    "",
    `${voice}：${claim}`,
    "",
    `${voice}：这里先别急着下结论，证据是：${evidence}`,
    "",
    `${voice}：${takeaway}`,
    "",
    "## Style Contract",
    "",
    `- ${style.opening}`,
    `- ${style.sentence}`,
    `- ${style.texture}`,
    `- ${style.ending}`
  ].join("\n");
}

function renderArticle(brief, style) {
  const claim = firstItem(brief.claims, "The central claim still needs a sharper boundary.");
  const evidence = firstItem(brief.evidence, "Add a source card before final publication.");
  const takeaway = brief.takeaway ?? "A stronger draft should make the reader see the problem, not merely agree with it.";

  return [
    `# ${brief.title ?? brief.topic ?? "Untitled Draft"}`,
    "",
    `Style: ${style.label}`,
    "",
    brief.hook ?? style.opening,
    "",
    claim,
    "",
    `Evidence to carry the claim: ${evidence}`,
    "",
    takeaway,
    "",
    "## Style Contract",
    "",
    `- ${style.promise}`,
    `- ${style.texture}`
  ].join("\n");
}

function firstItem(items, fallback) {
  return Array.isArray(items) && items.length > 0 ? items[0] : fallback;
}
