const dimension = (id, label, weight, check) => ({ id, label, weight, check });

const generalDimensions = [
  dimension("specific-opening", "Specific opening", 10, (text) => scoreBy(text, [/门外|桌上|雨|灯|手机|袋|碗|筷|锅|菜单/], 2)),
  dimension("concrete-action", "Concrete action", 12, (text) => scoreBy(text, [/端|夹|放|推|拿|递|坐|站|看|停|收|撤|扎|翻/], 5)),
  dimension("human-motive", "Human motive", 12, (text) => scoreBy(text, [/怕|烦|躲|催|担心|不好看|晚了|不想|舍不得|挂不住/], 3)),
  dimension("dialogue", "Speakable dialogue", 10, (text) => scoreDialogue(text)),
  dimension("anti-slop", "Anti-slop", 12, (text) => scoreAntiSlop(text)),
  dimension("causality", "Causality", 10, (text) => scoreBy(text, [/所以|那|因为|刚才|去年|平时|明早|结果|后来|不一会儿/], 3)),
  dimension("aftertaste", "Aftertaste", 10, (text) => scoreAftertaste(text)),
  dimension("pacing", "Pacing", 12, (text) => scorePacing(text)),
  dimension("boundary", "Claim boundary", 12, (text) => scoreClaimBoundary(text))
];

const qibaDimensions = [
  ...generalDimensions,
  dimension("qiba-table", "Qiba table scene", 10, (text) => scoreBy(text, [/琦爸|贝妈|白粥|米饭|豆腐|蒸蛋|汤|菜|菜单|厨房|出餐口/], 5)),
  dimension("qiba-role-balance", "Qiba/Beima role balance", 10, (text) => scoreQibaRoleBalance(text))
];

export function scoreText(text, options = {}) {
  const profile = options.profile ?? "general";
  const dimensions = profile === "qiba" ? qibaDimensions : generalDimensions;
  const scoredDimensions = dimensions.map((currentDimension) => {
    const raw = clamp(currentDimension.check(text), 0, 1);

    return {
      id: currentDimension.id,
      label: currentDimension.label,
      weight: currentDimension.weight,
      score: Math.round(raw * currentDimension.weight),
      max: currentDimension.weight
    };
  });

  const total = scoredDimensions.reduce((sum, currentDimension) => sum + currentDimension.score, 0);
  const max = scoredDimensions.reduce((sum, currentDimension) => sum + currentDimension.max, 0);
  const normalized = Math.round((total / max) * 100);

  return {
    profile,
    score: normalized,
    status: normalized >= 88 ? "pass" : normalized >= 75 ? "revise" : "fail",
    dimensions: scoredDimensions,
    weak: scoredDimensions
      .filter((currentDimension) => currentDimension.score / currentDimension.max < 0.65)
      .map((currentDimension) => currentDimension.id)
  };
}

function scoreBy(text, patterns, target) {
  const count = patterns.reduce((sum, pattern) => sum + countPattern(text, pattern), 0);
  return Math.min(1, count / target);
}

function scoreDialogue(text) {
  const lines = [...text.matchAll(/“[^”]+”/g)].map((match) => match[0]);
  if (lines.length === 0) return 0;

  const longLines = lines.filter((line) => Array.from(line).length > 42).length;
  const lectureLines = lines.filter((line) => /认为|说明|应该|关键|事实上|实际上/.test(line)).length;
  return clamp(1 - (longLines + lectureLines * 1.5) / Math.max(lines.length, 1), 0, 1);
}

function scoreAntiSlop(text) {
  const bad = [
    /你绝对想不到/g,
    /原来我们都错了/g,
    /其实真相是/g,
    /在这个.*?时代/g,
    /温暖治愈/g,
    /直击人心/g,
    /故事告诉我们/g
  ].reduce((sum, pattern) => sum + [...text.matchAll(pattern)].length, 0);

  return bad === 0 ? 1 : Math.max(0, 1 - bad * 0.18);
}

function scoreAftertaste(text) {
  const ending = Array.from(text).slice(-180).join("");
  if (/故事告诉我们|愿我们|这就是|从此以后.*?明白/.test(ending)) return 0.2;
  if (/没说话|没再|窗外|放在旁边|撤走|停了一下|看着/.test(ending)) return 1;
  return 0.65;
}

function scorePacing(text) {
  const paragraphs = text.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean);
  if (paragraphs.length < 6) return 0.45;

  const longParagraphs = paragraphs.filter((part) => Array.from(part).length > 180).length;
  return clamp(1 - longParagraphs / Math.max(paragraphs.length, 1), 0.2, 1);
}

function scoreClaimBoundary(text) {
  const healthClaim = /体检|血糖|血脂|营养|致癌|补钙|嘌呤|空腹|医生|医院|慢病|儿童|老人/.test(text);
  if (!healthClaim) return 1;
  return /按.*?(要求|医嘱)|医生|医院|体检机构|需要核实|来源卡|不能.*?绝对|要看/.test(text) ? 1 : 0.25;
}

function scoreQibaRoleBalance(text) {
  const hasQiba = /琦爸/.test(text);
  const hasBeima = /贝妈/.test(text);
  const qibaLecture = /琦爸.*?(专家|科学研究|我告诉你|你们都错了)/.test(text);
  const beimaAction = /贝妈.*?(拿|递|收|撤|合上|扎好|看了|经过)/.test(text);

  if (!hasQiba || !hasBeima) return 0.3;
  if (qibaLecture) return 0.45;
  return beimaAction ? 1 : 0.75;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function countPattern(text, pattern) {
  const globalPattern = pattern.global ? pattern : new RegExp(pattern.source, `${pattern.flags}g`);
  return [...text.matchAll(globalPattern)].length;
}
