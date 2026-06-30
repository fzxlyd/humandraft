# Positioning: Beyond "AI Humanizers"

HumanDraft lives in a crowded category. Many tools already promise to "remove AI traces" or "humanize" generated text.

This document explains the market map and why HumanDraft is different.

## The 10 Common Tool Types

| Category | Typical Tools | Main Job | Limitation |
|---|---|---|---|
| Rewrite humanizers | Humanizer, Humanizer JSH, AI Flavor Remover | Rewrite generated text to sound less machine-like | Often hides symptoms without explaining what failed |
| Slop removers | Stop Slop | Remove empty, fluent, low-information AI filler | Useful, but usually narrow and post-hoc |
| Oralization tools | Sure In Who | Turn report-style prose into speech-friendly language | Helps delivery, not necessarily evidence or logic |
| Aesthetic critics | Taste Skill | Improve taste, imagery, memorability, and texture | Hard to make reproducible without explicit criteria |
| Personal style tools | New Skill | Learn and reuse a creator's voice over time | Needs long-term examples and careful memory design |
| Full writing agents | Writing Agent | Cover ideation, drafting, editing, and publishing | Powerful but can become opaque and hard to control |
| AI detectors | Check GPT Comparison Detection | Estimate whether text looks AI-generated | Detection alone does not improve the draft |
| Prompt optimizers | Prompt Enhancer | Improve prompts to reduce AI style at generation time | Does not help already-written drafts |
| Grammar/style checkers | LanguageTool, write-good | Catch grammar or simple prose issues | Not designed for AI-specific writing failures |
| Research-first systems | STORM, GPT Researcher | Gather evidence before synthesis | Strong for facts, weaker for voice and scene logic |

## HumanDraft's Position

HumanDraft is not primarily a humanizer, and it is not merely a detector.

It is a writing workbench:

```text
brief -> style pack -> draft -> audit -> findings -> rewrite contract -> constrained rewrite
```

That means HumanDraft should:

1. Name the writing failure.
2. Show exact evidence from the text.
3. Explain why it hurts the reader experience.
4. Give a concrete rewrite instruction.
5. Preserve the author's voice where the text is already working.

## What HumanDraft Should Not Become

- A one-click "make this human" button.
- A black-box detector score.
- A prompt-pack marketplace.
- A content farm generator.
- A generic grammar checker.

## Strategic Difference

Most humanizers operate after the damage is done. They try to disguise generated text.

HumanDraft aims to make the writing process accountable:

- before drafting: require evidence and voice examples
- during drafting: apply style packs and profile-specific rules
- after drafting: produce findings and rewrite contracts
- later: connect to editor tools and team rule packs

## Product Rule

If a feature cannot explain *why* a draft is bad, it does not belong in the critique core.
