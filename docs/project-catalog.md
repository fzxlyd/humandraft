# Project Catalog

This catalog records the projects reviewed on 2026-06-29 and how HumanDraft should use them.

## Adopt The Pattern

| Project | Link | What To Borrow | HumanDraft Module |
|---|---|---|---|
| PaperDebugger | https://github.com/PaperDebugger/paperdebugger | In-editor multi-agent review, plugin reviewers | Critique layer |
| avoid-ai-writing | https://github.com/conorbronsdon/avoid-ai-writing | Direct anti-AI-writing audit | Slop critic |
| STORM | https://github.com/stanford-oval/storm | Research before synthesis, cited reports | Evidence layer |
| GPT Researcher | https://github.com/assafelovic/gpt-researcher | Deep research task orchestration | Evidence layer |
| saga | https://github.com/Lanerra/saga | Knowledge graph and embeddings for story memory | Memory layer |
| Libriscribe | https://github.com/guerra2fernando/libriscribe | Multi-stage book creation pipeline | Workflow layer |
| WritingTools | https://github.com/theJayTea/WritingTools | System-wide utility UX | Integration layer |
| Vale | https://github.com/vale-cli/vale | Configurable prose linting | Rule engine |

## Useful But Not Central

| Project | Link | Notes |
|---|---|---|
| OpenDraft | https://github.com/federicodeponte/opendraft | Strong academic-writing workflow; useful for citation validation ideas. |
| StoryCraftr | https://github.com/raestrada/storycraftr | Lightweight CLI for worldbuilding and outlines. |
| ProseFlow | https://github.com/LSXPrime/ProseFlow | Universal text processor; useful for desktop integration ideas. |
| wordflow | https://github.com/poloclub/wordflow | Social/customizable writing assistant; useful for interaction design. |
| write-assist-ai | https://github.com/ra-jeev/write-assist-ai | Small VS Code rewriter; useful for editor-extension shape. |
| LanguageTool | https://github.com/languagetool-org/languagetool | Grammar and style checking; too broad for HumanDraft's core. |
| write-good | https://github.com/btford/write-good | Classic English prose linter; useful as a simplicity reference. |
| verbalized-sampling | https://github.com/CHATS-lab/verbalized-sampling | Diversity technique for avoiding mode collapse; useful later for rewrite candidate generation. |

## Defer

| Project Type | Why To Defer |
|---|---|
| Generic tone changers | They often intensify AI voice instead of reducing it. |
| One-click article generators | They optimize volume, not judgment. |
| Full video-generation suites | Useful downstream, but they do not solve writing quality. |
| Heavy web apps | Too much surface area before the critique core is proven. |

## Combined Product Thesis

The strongest product is not a writer. It is a writing room:

1. Researcher brings evidence.
2. Memory keeper remembers characters, scenes, and claims.
3. Critics attack the draft from different angles.
4. Rewriter fixes only what the critics proved is broken.
5. Editor decides what remains in the author's voice.

HumanDraft starts with the critics because that is where AI writing fails most visibly.
