# Open-Source Landscape

This file organizes the projects collected on 2026-06-29 and extracts what HumanDraft should borrow.

## What Not To Build

Avoid building another generic chat box with buttons like "make shorter," "make professional," and "change tone." Those tools are easy to create and usually make writing more generic.

The stronger pattern is workflow: research, outline, critique, rewrite, evidence check, memory, and style rules.

## Projects Worth Studying

### PaperDebugger

URL: https://github.com/PaperDebugger/paperdebugger

What it is: A plugin-based multi-agent system for in-editor academic writing, review, and editing.

What to borrow:

- review happens inside the writing environment
- multiple critics can inspect the same text from different angles
- editing and reviewing are separate actions
- plugin architecture makes it possible to add domain reviewers

HumanDraft implication: create reviewers such as `SlopCritic`, `CausalityCritic`, `EvidenceCritic`, `VoiceCritic`, and `SceneLogicCritic`.

### avoid-ai-writing

URL: https://github.com/conorbronsdon/avoid-ai-writing

What it is: A skill for auditing and rewriting content to remove AI writing patterns.

What to borrow:

- name the problem directly
- maintain a blacklist of patterns
- rewrite only after identifying why the text smells wrong

HumanDraft implication: anti-slop checks should be first-class, not hidden inside a broad "style" score.

### STORM

URL: https://github.com/stanford-oval/storm

What it is: A knowledge curation system that researches a topic and generates a cited long report.

What to borrow:

- research precedes writing
- topic exploration should include multiple perspectives
- citations and source traceability matter

HumanDraft implication: for food science, medical, legal, finance, and technology claims, the writing tool should request evidence cards before final prose.

### GPT Researcher

URL: https://github.com/assafelovic/gpt-researcher

What it is: An autonomous deep research agent.

What to borrow:

- separation between research collection and final synthesis
- source-first workflow
- configurable research tasks

HumanDraft implication: the product should eventually support a `research pack` input, rather than forcing the writer to paste raw notes into a single prompt.

### saga

URL: https://github.com/Lanerra/saga

What it is: An agentic creative story-writing system using embeddings and knowledge graphs.

What to borrow:

- story memory needs structure, not just long context
- characters, places, rules, and prior events should be queryable
- causality can be represented as relationships

HumanDraft implication: short scripts and long stories both need a scene ledger and a causality ledger.

### Libriscribe

URL: https://github.com/guerra2fernando/libriscribe

What it is: A multi-agent book creation system.

What to borrow:

- split long writing into stages
- use specialized agents for concept, outline, drafting, editing, and polish
- keep the manuscript workflow visible

HumanDraft implication: create reusable pipelines, not one-shot prompts.

### WritingTools

URL: https://github.com/theJayTea/WritingTools

What it is: A system-wide writing assistant for grammar and transformations.

What to borrow:

- writing tools should work where the user already writes
- system-level shortcuts matter
- local and cloud model flexibility is useful

HumanDraft implication: after the CLI proves itself, build editor integrations before building a heavy web app.

### Vale

URL: https://github.com/vale-cli/vale

What it is: A configurable prose linter.

What to borrow:

- rules should be plain, inspectable, and team-shareable
- deterministic checks are valuable even when LLMs are available
- style rules should run in CI or editor workflows

HumanDraft implication: the rule engine must remain transparent.

## Product Synthesis

HumanDraft should combine four layers:

1. Research layer: source packs, evidence cards, claim tracing.
2. Memory layer: character, scene, topic, and voice ledgers.
3. Critique layer: multiple reviewers with inspectable rules.
4. Rewrite layer: constrained rewriting that must answer critique items.

The first release should focus on layer 3 because it is the easiest to make useful without depending on a model provider.

