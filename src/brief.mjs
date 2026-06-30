import { getTemplate, knownTemplates } from "./templates.mjs";

const DEFAULT_QIBA_TOPIC = "隔夜菜到底能不能吃";

export function generateBrief(input, options = {}) {
  const demand = normalizeInput(input);

  if (!demand) {
    throw new Error("Missing writing demand.");
  }

  const templateName = options.template ?? inferTemplate(demand);
  const template = getTemplate(templateName);
  const profile = options.profile ?? inferProfile(demand);
  const style = options.style ?? template.defaultStyle;
  const topic = inferTopic(demand, profile);
  const format = options.format ?? template.defaultFormat;

  return {
    title: titleFor(topic, templateName, profile),
    topic,
    demand,
    template: templateName,
    format,
    profile,
    style,
    audience: inferAudience(demand, profile),
    core_misbelief: inferMisbelief(topic, profile),
    correct_claim: inferClaim(topic, profile),
    scene: inferScene(topic, profile),
    claims: [inferClaim(topic, profile)],
    evidence: [inferEvidenceNeed(topic, profile)],
    turn: inferTurn(topic, profile),
    takeaway: inferTakeaway(topic, profile),
    beats: inferBeats(topic, templateName, profile),
    need_verify: inferNeedVerify(topic, profile),
    constraints: inferConstraints(templateName, profile)
  };
}

export function renderBriefJson(brief) {
  return `${JSON.stringify(brief, null, 2)}\n`;
}

function normalizeInput(input) {
  if (Array.isArray(input)) {
    return input.join(" ").trim();
  }

  return String(input ?? "").trim();
}

function inferTemplate(demand) {
  if (/公众号|长文|文章/.test(demand)) return "public-account";
  if (/口播|朗读|播客|旁白/.test(demand)) return "oral-script";
  if (/科普|解释|研究|证据|为什么/.test(demand)) return "science";
  if (/故事|短剧|剧情|一集|给我故事/.test(demand)) return "story";
  return "short-video";
}

function inferProfile(demand) {
  if (/琦爸|酒食|饭桌|饮食|隔夜菜|骨头汤|补钙|嘌呤|致癌|食物|菜|汤|肉|蛋|奶/.test(demand)) {
    return "qiba";
  }

  if (/研究|论文|报告|引用|证据/.test(demand)) {
    return "research";
  }

  if (/故事|短剧|剧情/.test(demand)) {
    return "story";
  }

  return "general";
}

function inferTopic(demand, profile) {
  const cleaned = demand
    .replace(/琦爸酒食[，,：:\s]*/g, "")
    .replace(/给我故事/g, "")
    .replace(/写一集/g, "")
    .replace(/来一集/g, "")
    .replace(/主题[:：]/g, "")
    .replace(/^[，,：:\s]+/g, "")
    .trim();

  if (!cleaned && profile === "qiba") {
    return DEFAULT_QIBA_TOPIC;
  }

  if (!cleaned) {
    return "一个需要说清楚的生活误区";
  }

  return cleaned.length > 36 ? `${Array.from(cleaned).slice(0, 36).join("")}...` : cleaned;
}

function titleFor(topic, templateName, profile) {
  if (profile === "qiba") {
    return `《琦爸酒食》：${topic}`;
  }

  const suffix = {
    "short-video": "短视频稿",
    "public-account": "公众号稿",
    "oral-script": "口播稿",
    story: "故事稿",
    science: "科普稿"
  }[templateName];

  return `${topic}${suffix ? `｜${suffix}` : ""}`;
}

function inferAudience(demand, profile) {
  if (profile === "qiba") {
    return "关心家常饮食、容易被饭桌老说法影响的普通家庭观众";
  }

  if (/创业|产品|用户/.test(demand)) {
    return "需要快速判断问题本质的业务读者";
  }

  return "对这个问题有兴趣但不想听套话的普通读者";
}

function inferMisbelief(topic, profile) {
  if (profile === "qiba") {
    return `饭桌上有人把“${topic}”当成一句不用再问的老经验。`;
  }

  return `读者可能已经听过关于“${topic}”的顺口说法，但没有看见具体边界。`;
}

function inferClaim(topic, profile) {
  if (profile === "qiba") {
    return `“${topic}”不能靠一句老话下结论，要看场景、做法、保存方式和人的实际需要。`;
  }

  return `把“${topic}”讲清楚，关键是先界定场景，再给出可执行判断。`;
}

function inferEvidenceNeed(topic, profile) {
  if (profile === "qiba") {
    return `需要补充食品安全或营养来源卡：${topic}的适用条件、风险边界、不能夸大的说法。`;
  }

  return `需要补充来源卡：${topic}的事实依据、适用边界、反例或限制。`;
}

function inferScene(topic, profile) {
  if (profile === "qiba") {
    return {
      who: "一位顾客",
      action: "端着刚打包的菜站在柜台前，话说得很笃定",
      line: `${topic}，老人都是这么说的。`,
      place: "琦爸酒食店内饭桌旁"
    };
  }

  return {
    who: "一个具体的人",
    action: "在一个具体场景里遇到这个问题",
    line: `这事到底该怎么判断？`,
    place: "可被拍出来的现实空间"
  };
}

function inferTurn(topic, profile) {
  if (profile === "qiba") {
    return `琦爸不急着反驳，只把问题往回拉：先别问老话对不对，先看这顿饭到底怎么吃。`;
  }

  return `不要先给结论，先让一个具体动作暴露问题。`;
}

function inferTakeaway(topic, profile) {
  if (profile === "qiba") {
    return `下次再听到“${topic}”这种说法，先问清楚条件，再决定怎么吃。`;
  }

  return `判断“${topic}”时，先问场景、边界和代价。`;
}

function inferBeats(topic, templateName, profile) {
  if (profile === "qiba") {
    return [
      "店外带着一个饭桌误解进来",
      "店内通过点菜、打包或夹菜动作露出问题",
      "琦爸用一句短话把老说法拆开",
      "贝妈补一个生活观察，不说教",
      "结尾停在一个克制动作或一句轻问"
    ];
  }

  const common = {
    "short-video": ["可见动作开场", "一句人话点题", "一个反例或边界", "给出可执行判断"],
    "public-account": ["具体场景", "问题拆解", "例子推进", "克制结尾"],
    "oral-script": ["像真人开口", "三段短节奏", "少解释多停顿", "一句可复述的收束"],
    story: ["人物带着压力出现", "误解造成动作", "小转折", "变化不要太大"],
    science: ["先界定说法", "讲适用条件", "列证据缺口", "落到日常判断"]
  };

  return common[templateName] ?? common["short-video"];
}

function inferNeedVerify(topic, profile) {
  if (profile === "qiba" || /研究|科学|营养|健康|安全|致癌|补钙|嘌呤/.test(topic)) {
    return [`核实“${topic}”的权威来源、适用条件和禁止夸大的边界。`];
  }

  return [];
}

function inferConstraints(templateName, profile) {
  const base = [
    "不要用假悬念",
    "不要用模板化总结",
    "不要把证据卡硬塞进角色台词",
    "每一段都要有具体动作或具体判断"
  ];

  if (profile === "qiba") {
    return [
      ...base,
      "店外有压力，店内有温度",
      "琦爸不能像专家讲课",
      "贝妈不能变成心理咨询师",
      "结尾不要升华，只留克制余味"
    ];
  }

  if (templateName === "science") {
    return [...base, "没有来源就标注需要核实", "不要把相关性写成因果"];
  }

  return base;
}

export { knownTemplates };
