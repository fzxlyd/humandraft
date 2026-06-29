# HumanDraft

HumanDraft is an open-source writing workbench for people who are tired of AI text that sounds polished, empty, and dead on arrival.

The goal is not to create yet another "AI writer." The goal is to build a writing system that can:

- detect AI-sounding habits before they reach readers
- force claims to carry evidence
- check whether a scene has ordinary human logic
- preserve a writer's voice instead of flattening it
- help teams turn prompts, rules, examples, and edits into a repeatable workflow

## Why This Exists

Most AI writing tools optimize for output volume. They produce paragraphs that look complete but fail in the places humans notice immediately:

- fake suspense
- generic emotional wording
- missing everyday common sense
- unsupported "research says" claims
- characters acting like prompt variables
- conclusions that arrive without earned causality

HumanDraft starts from the opposite assumption: the first job is critique, not generation.

## What We Are Borrowing

HumanDraft combines patterns from several stronger open-source projects:

- [PaperDebugger](https://github.com/PaperDebugger/paperdebugger): editor-side multi-agent review
- [avoid-ai-writing](https://github.com/conorbronsdon/avoid-ai-writing): explicit anti-AI-writing audit
- [STORM](https://github.com/stanford-oval/storm): research-first drafting with citations
- [GPT Researcher](https://github.com/assafelovic/gpt-researcher): source gathering before synthesis
- [saga](https://github.com/Lanerra/saga): long-form memory and knowledge graph direction
- [Libriscribe](https://github.com/guerra2fernando/libriscribe): multi-stage book workflow
- [WritingTools](https://github.com/theJayTea/WritingTools): system-level writing utilities
- [Vale](https://github.com/vale-cli/vale): configurable prose linting

See [docs/landscape.md](docs/landscape.md) for the full analysis.
See [docs/project-catalog.md](docs/project-catalog.md) for the broader project catalog.

## MVP

The first working piece is a local CLI:

```bash
node src/cli.mjs audit samples/qiba-ai-ish.md --profile qiba
```

It returns a Markdown report with:

- overall score
- high-risk findings
- rule-level evidence
- rewrite advice
- profile-specific checks

This is intentionally deterministic. LLM rewriting can come later, after the review framework is stable.

## Project Shape

```text
docs/
  landscape.md          Open-source project analysis
  product-blueprint.md  Product thesis and roadmap
  architecture.md       System design
src/
  audit.mjs             Rule engine
  cli.mjs               CLI entry point
  report.mjs            Markdown report rendering
  rules.mjs             Built-in rule catalog
samples/
  qiba-ai-ish.md        Example text to audit
test/
  audit.test.mjs        Minimal regression tests
```

## Design Principles

1. Critique before generation.
2. Evidence before authority.
3. Scene logic before plot tricks.
4. Specific voice before generic polish.
5. Rules should be inspectable, editable, and shareable.

## Status

This is a seed project. The current CLI is useful as a proof of direction, not as a finished writing assistant.
