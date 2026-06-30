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

  if (format === "short-script" || format === "short-video") {
    return renderShortScript(brief, style);
  }

  if (format === "oral-script") {
    return renderOralScript(brief, style);
  }

  if (format === "story") {
    return renderStory(brief, style);
  }

  if (format === "science") {
    return renderScience(brief, style);
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
    `Template: ${brief.template ?? brief.format ?? "short-script"}`,
    "",
    "## 本集 Brief",
    "",
    `- 核心误区：${brief.core_misbelief ?? "需要补清楚误区。"} `,
    `- 正确说法：${brief.correct_claim ?? claim}`,
    `- 需要核实：${Array.isArray(brief.need_verify) && brief.need_verify.length > 0 ? brief.need_verify.join("；") : "暂无"}`,
    "",
    "## 剧本正文",
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
    "## 分镜提示",
    "",
    ...shotLines(brief),
    "",
    "## Style Contract",
    "",
    `- ${style.opening}`,
    `- ${style.sentence}`,
    `- ${style.texture}`,
    `- ${style.ending}`
  ].join("\n");
}

function renderOralScript(brief, style) {
  const claim = firstItem(brief.claims, brief.correct_claim ?? "先把这件事说清楚。");
  const beats = Array.isArray(brief.beats) ? brief.beats : [];

  return [
    `# ${brief.title ?? brief.topic ?? "Untitled Oral Script"}`,
    "",
    `Style: ${style.label}`,
    "",
    "## 口播稿",
    "",
    `先别急着给“${brief.topic ?? "这个问题"}”下结论。`,
    "",
    "我们把它放回一个真实场景里看。",
    "",
    ...beats.map((beat) => `- ${beat}`),
    "",
    claim,
    "",
    brief.takeaway ?? "最后落到一个普通人明天就能用的判断。",
    "",
    "## Style Contract",
    "",
    `- ${style.opening}`,
    `- ${style.sentence}`,
    `- ${style.ending}`
  ].join("\n");
}

function renderStory(brief, style) {
  const scene = brief.scene ?? {};
  const beats = Array.isArray(brief.beats) ? brief.beats : [];

  return [
    `# ${brief.title ?? brief.topic ?? "Untitled Story"}`,
    "",
    `Style: ${style.label}`,
    "",
    "## 故事",
    "",
    `${scene.place ?? "一个具体空间"}，${scene.who ?? "一个人"}${scene.action ?? "停了一下"}。`,
    "",
    `${scene.line ? `他说：“${scene.line}”` : "这句话不是为了制造悬念，而是把问题摆到桌面上。"}`,
    "",
    ...beats.map((beat, index) => `${index + 1}. ${beat}`),
    "",
    `转折：${brief.turn ?? "解决方法必须从场景内部长出来。"}`,
    "",
    `余味：${brief.takeaway ?? "不要替人物总结人生，只留下一个动作。"}`,
    "",
    "## Style Contract",
    "",
    `- ${style.texture}`,
    `- ${style.ending}`
  ].join("\n");
}

function renderScience(brief, style) {
  const claim = firstItem(brief.claims, brief.correct_claim ?? "This claim needs a boundary.");
  const evidence = firstItem(brief.evidence, "Add an evidence card before publication.");

  return [
    `# ${brief.title ?? brief.topic ?? "Untitled Explainer"}`,
    "",
    `Style: ${style.label}`,
    "",
    "## 科普稿",
    "",
    `要说清楚“${brief.topic ?? "这个问题"}”，先把场景说窄。`,
    "",
    `核心判断：${claim}`,
    "",
    `证据缺口：${evidence}`,
    "",
    `生活判断：${brief.takeaway ?? "把结论落到一个可执行选择上。"}`,
    "",
    "## Style Contract",
    "",
    `- ${style.promise}`,
    `- ${style.sentence}`,
    `- ${style.texture}`
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

function shotLines(brief) {
  const beats = Array.isArray(brief.beats) && brief.beats.length > 0
    ? brief.beats
    : ["人物动作暴露问题", "一句话点破误区", "给出生活判断"];

  return beats.slice(0, 5).map((beat, index) => `- 镜头 ${index + 1}：${beat}`);
}
