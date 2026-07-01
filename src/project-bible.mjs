import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

export async function initProjectBible(projectDir, options = {}) {
  if (!projectDir) {
    throw new Error("Missing project directory.");
  }

  const profile = options.profile ?? "general";
  const force = Boolean(options.force);
  const files = projectBibleFiles(profile);
  const written = [];
  const skipped = [];

  await mkdir(projectDir, { recursive: true });
  await mkdir(join(projectDir, "bible"), { recursive: true });
  await mkdir(join(projectDir, "drafts"), { recursive: true });
  await mkdir(join(projectDir, "reports"), { recursive: true });

  for (const file of files) {
    const filePath = join(projectDir, file.path);
    await mkdir(dirname(filePath), { recursive: true });

    try {
      await writeFile(filePath, file.body, { flag: force ? "w" : "wx" });
      written.push(file.path);
    } catch (error) {
      if (error.code === "EEXIST") {
        skipped.push(file.path);
        continue;
      }

      throw error;
    }
  }

  return {
    projectDir,
    profile,
    written,
    skipped
  };
}

function projectBibleFiles(profile) {
  const base = [
    {
      path: "humandraft.json",
      body: JSON.stringify({
        profile,
        version: 1,
        gates: ["audit", "deslop", "score", "domain"],
        created_by: "humandraft"
      }, null, 2) + "\n"
    },
    {
      path: "bible/style.md",
      body: [
        "# Style Bible",
        "",
        "## Voice",
        "",
        "- write in human speech, not report language",
        "- prefer action before explanation",
        "- avoid fake suspense and summary slogans",
        "",
        "## Hard Bans",
        "",
        "- no fake authority",
        "- no preachy ending",
        "- no unsupported medical or safety claims",
        ""
      ].join("\n")
    },
    {
      path: "bible/episode-ledger.md",
      body: [
        "# Episode Ledger",
        "",
        "| Episode | Topic | Conflict | Food/Table Object | Ending Image | Repetition Risk |",
        "|---|---|---|---|---|---|",
        ""
      ].join("\n")
    },
    {
      path: "bible/evidence-cards.md",
      body: [
        "# Evidence Cards",
        "",
        "| Topic | Claim | Source Needed | Boundary | Forbidden Overclaim | Status |",
        "|---|---|---|---|---|---|",
        ""
      ].join("\n")
    },
    {
      path: "bible/rewrite-contracts.md",
      body: [
        "# Rewrite Contracts",
        "",
        "| Draft | Blocker | Required Fix | Verified |",
        "|---|---|---|---|",
        ""
      ].join("\n")
    }
  ];

  if (profile !== "qiba") {
    return base;
  }

  return [
    ...base,
    {
      path: "bible/qiba-characters.md",
      body: [
        "# Qiba Characters",
        "",
        "## 琦爸",
        "",
        "- calm restaurant owner",
        "- sees the table detail before explaining",
        "- uses short lines",
        "- must not sound like a doctor, teacher, or influencer",
        "",
        "## 贝妈",
        "",
        "- stabilizes the room through action",
        "- can soften embarrassment",
        "- must not become a therapist or moral narrator",
        "",
        "## Guest Rule",
        "",
        "- every guest enters with a credible pressure",
        "- the final change must be small and observable",
        ""
      ].join("\n")
    },
    {
      path: "bible/qiba-gates.md",
      body: [
        "# Qiba Gates",
        "",
        "- title must not state a risky health conclusion",
        "- story needs 【店外】 and 【店内】",
        "- core solution must appear inside 琦爸酒食",
        "- health claims need boundary or evidence-card status",
        "- no sermon ending",
        "- default complete story length: 90-120 seconds, roughly 800-1600 visible Chinese chars",
        ""
      ].join("\n")
    }
  ];
}
