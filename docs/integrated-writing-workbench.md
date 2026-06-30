# Integrated Writing Workbench

HumanDraft should absorb the strengths of the 10 tool types without becoming a loose pile of utilities.

## User Requirement

HumanDraft must eventually do three things well:

1. Write drafts that do not smell like AI.
2. Support higher-level styles, not only plain language.
3. Control writing quality through voice, taste, evidence, scene logic, and workflow.

## Capability Map

| Source Tool Type | What It Contributes | HumanDraft Module |
|---|---|---|
| Humanizer | Surface rewrite for generic AI patterns | Rewrite engine |
| Humanizer JSH | Chinese-specific humanization | Chinese voice packs |
| Stop Slop | Removes fluent low-information filler | Slop critic |
| Taste Skill | Adds aesthetic judgment and memorability | Taste critic and style packs |
| AI Flavor Remover | Fast before/after testing | Quick audit mode |
| Sure In Who | Turns report voice into speakable language | Oral style pack |
| New Skill | Learns a creator's recurring voice | Personal voice memory |
| Writing Agent | Full workflow from idea to publishing | Pipeline orchestrator |
| Check GPT Comparison Detection | Scores AI trace level | Detector adapter |
| Prompt Enhancer | Improves generation at the source | Brief and prompt compiler |

## Product Architecture

```text
brief
  -> prompt/brief enhancer
  -> research and evidence cards
  -> style pack selection
  -> draft composer
  -> critique engine
  -> rewrite contract
  -> constrained rewrite
  -> final audit
```

## Style Layers

HumanDraft should not have one generic "human" style. It should support layers:

- plain spoken: clear, direct, no official tone
- oral: can be read aloud naturally
- elevated: more literary or editorial, but still precise
- taste-first: vivid, memorable, image-driven
- personal: trained from the user's examples
- domain: food science, business writing, fiction, research, short video

## First Implementation

The current implementation adds a `compose` command:

```bash
node src/cli.mjs compose samples/brief-qiba-soup.json --style oral --profile qiba
```

This is not the final writing engine. It is the first pipeline skeleton:

- takes a structured brief
- applies a style pack
- writes a draft
- runs an audit on its own draft
- returns both the draft and the quality report

The key product principle is already present: writing and critique travel together.

