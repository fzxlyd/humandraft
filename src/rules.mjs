const rule = (id, severity, message, advice, patterns) => ({
  id,
  severity,
  message,
  advice,
  patterns
});

export const severityWeight = {
  low: 3,
  medium: 7,
  high: 12
};

export const builtInRules = [
  rule(
    "fake-suspense",
    "high",
    "Fake suspense without concrete stakes.",
    "Replace teaser language with a specific observed action, conflict, or question.",
    [
      /你绝对想不到/g,
      /接下来.*?(见证|揭晓|告诉你)/g,
      /隐藏着.*?(惊人|巨大|不可告人)/g,
      /悬念拉满/g,
      /you won't believe/gi,
      /what happened next/gi
    ]
  ),
  rule(
    "ai-cliche",
    "medium",
    "Common AI-style connective or summary phrase.",
    "Cut the phrase or replace it with a concrete transition.",
    [
      /在这个.*?时代/g,
      /值得注意的是/g,
      /综上所述/g,
      /不难发现/g,
      /引发.*?共鸣/g,
      /颠覆.*?认知/g,
      /赋能/g,
      /打造/g,
      /it is worth noting/gi,
      /in today's fast-paced world/gi,
      /delve into/gi,
      /game[- ]changer/gi
    ]
  ),
  rule(
    "unsupported-authority",
    "high",
    "Authority language appears without a visible source.",
    "Attach a source card, cite the source, or rewrite the claim with a safer boundary.",
    [
      /科学研究表明/g,
      /专家指出/g,
      /数据显示/g,
      /权威机构/g,
      /research shows/gi,
      /experts say/gi,
      /studies have shown/gi
    ]
  ),
  rule(
    "teacher-scold",
    "high",
    "The speaker sounds superior or scolding.",
    "Use shared language and explain the fact without humiliating the character or reader.",
    [
      /你们都错了/g,
      /这很简单/g,
      /其实很简单/g,
      /你不懂/g,
      /你们不懂/g
    ]
  ),
  rule(
    "empty-emotion",
    "medium",
    "Emotion is named instead of being shown.",
    "Show the physical action, facial expression, silence, or decision that carries the emotion.",
    [
      /温暖治愈/g,
      /让人泪目/g,
      /充满烟火气/g,
      /直击人心/g,
      /deeply moving/gi,
      /heartwarming/gi
    ]
  ),
  rule(
    "vague-thing",
    "low",
    "Vague nouns may be carrying too much weight.",
    "Name the object, action, or claim directly.",
    [
      /这个东西/g,
      /这件事情/g,
      /这些问题/g,
      /某种程度/g,
      /things like this/gi,
      /in some ways/gi
    ]
  )
];

export const profileRules = {
  general: [],
  qiba: [
    rule(
      "qiba-active-preaching",
      "high",
      "Qiba should not enter as a scolding teacher.",
      "Let the table scene trigger the correction. Qiba should sound like a calm working cook, not a lecturer.",
      [/琦爸.*?(你们都错了|其实很简单|早就知道)/g]
    ),
    rule(
      "qiba-food-claim-needs-evidence",
      "high",
      "Food-science content needs an evidence card.",
      "Add source notes before production: claim, source, boundary, and what must not be overstated.",
      [/营养/g, /嘌呤/g, /致癌/g, /杀菌/g, /补钙/g, /DHA/g]
    )
  ],
  story: [
    rule(
      "story-lazy-reveal",
      "medium",
      "The scene may rely on a lazy reveal.",
      "Show the causal step before the reveal, or plant a visible clue earlier.",
      [/原来/g, /突然/g, /没想到/g, /竟然/g]
    )
  ],
  research: [
    rule(
      "research-missing-citation",
      "high",
      "Research-style writing needs citations or source notes.",
      "Attach a source URL, paper title, official page, or evidence card.",
      [/研究/g, /报告/g, /论文/g, /调查/g, /citation needed/gi]
    )
  ]
};

export const knownProfiles = Object.keys(profileRules);
