export const templates = {
  "short-video": {
    label: "Short video",
    defaultFormat: "short-video",
    defaultStyle: "oral",
    promise: "turn one idea into a visible, shootable short-video script",
    sections: ["brief", "script", "shots", "self-audit"]
  },
  "public-account": {
    label: "Public account article",
    defaultFormat: "public-account",
    defaultStyle: "elevated",
    promise: "turn one idea into a readable WeChat-style article outline and draft",
    sections: ["hook", "argument", "examples", "takeaway"]
  },
  "oral-script": {
    label: "Oral script",
    defaultFormat: "oral-script",
    defaultStyle: "oral",
    promise: "make the draft speakable without report tone",
    sections: ["opening", "beats", "lines", "landing"]
  },
  story: {
    label: "Story",
    defaultFormat: "story",
    defaultStyle: "taste",
    promise: "build a human situation before the idea appears",
    sections: ["situation", "pressure", "turn", "aftertaste"]
  },
  science: {
    label: "Science explainer",
    defaultFormat: "science",
    defaultStyle: "plain",
    promise: "explain a claim with boundaries, evidence needs, and plain language",
    sections: ["claim", "boundary", "evidence", "daily decision"]
  }
};

export const knownTemplates = Object.keys(templates);

export function getTemplate(templateName = "short-video") {
  const template = templates[templateName];

  if (!template) {
    throw new Error(`Unknown template "${templateName}". Available templates: ${knownTemplates.join(", ")}`);
  }

  return template;
}
