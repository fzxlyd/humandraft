export const stylePacks = {
  plain: {
    label: "Plain spoken",
    promise: "clear, human, and easy to read aloud",
    opening: "Start with a concrete thing someone can see.",
    sentence: "Use short sentences and everyday words.",
    texture: "Prefer action over explanation.",
    ending: "End with one useful sentence, not a slogan."
  },
  elevated: {
    label: "Elevated editorial",
    promise: "calm, precise, and memorable without sounding ornate",
    opening: "Start with a small observed detail that points to a bigger idea.",
    sentence: "Use varied rhythm, but keep claims exact.",
    texture: "Add one image or contrast that helps the reader see the idea.",
    ending: "End with a line that lands quietly."
  },
  oral: {
    label: "Speakable script",
    promise: "natural when read aloud",
    opening: "Start like a person talking to another person.",
    sentence: "Keep sentences breath-sized.",
    texture: "Use pauses, questions, and concrete objects.",
    ending: "End with a line someone could repeat to a friend."
  },
  taste: {
    label: "Taste-first",
    promise: "specific, visual, and less generic",
    opening: "Start with the sharpest image, not the broadest statement.",
    sentence: "Remove safe adjectives unless they reveal taste.",
    texture: "Add a surprising but accurate detail.",
    ending: "Leave a small aftertaste instead of a summary."
  }
};

export const knownStyles = Object.keys(stylePacks);
