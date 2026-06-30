# Product Blueprint

## One-Line Positioning

HumanDraft is a writing review engine that turns AI-assisted drafts into evidence-aware, causally coherent, voice-preserving prose.

## Core User

The first user is a creator or editor who already uses LLMs but distrusts the output.

They do not need another blank chat box. They need a reviewer that says:

- this sounds fake
- this claim needs evidence
- this scene would not happen this way
- this character is acting for the outline, not for themselves
- this paragraph has no concrete action

## Initial Use Cases

### 1. Short Video Script Review

Input: a 60-120 second script.

Output:

- AI-slop findings
- scene logic check
- audience clarity check
- evidence-risk check
- rewrite instructions

### 2. Knowledge Content Review

Input: an article or script with factual claims.

Output:

- unsupported claim list
- vague authority language
- citation requirements
- places where a safer claim boundary is needed

### 3. Fiction / Story Review

Input: a scene or chapter.

Output:

- causality breaks
- character-motivation gaps
- fake suspense
- exposition overload
- continuity hints

## MVP Features

- Local CLI audit
- Built-in rule profiles:
  - `general`
  - `qiba`
  - `story`
  - `research`
- Markdown report output
- JSON output later
- Custom rule packs later

## Differentiators

1. Anti-slop is not a side feature.
2. The system critiques before it rewrites.
3. It treats evidence as a writing dependency.
4. It checks everyday scene logic, not only grammar.
5. It is open and inspectable.
6. It can absorb humanizer, detector, taste, style-memory, and prompt-enhancement workflows without becoming a black box.

## Roadmap

### Phase 0: Deterministic Critique Core

- Rule engine
- CLI
- Markdown reports
- Sample profiles
- Regression tests

### Phase 1: Rewrite Contracts

Each finding becomes a rewrite task:

```text
Finding: fake suspense
Instruction: remove teaser language and replace it with a concrete observed action.
Acceptance: the rewritten paragraph must include who, where, and what changed.
```

### Phase 2: Evidence Packs

- claim extraction
- source card attachment
- unsupported claim warnings
- risk labels

### Phase 3: Memory Ledgers

- character ledger
- scene ledger
- topic ledger
- voice ledger

### Phase 4: Editor Integration

- VS Code extension
- Obsidian plugin
- system clipboard tool
- optional web UI

### Phase 5: Humanizer Compatibility Layer

- compare a draft before/after external humanizer tools
- keep an audit trail of what changed
- flag rewrites that remove facts, voice, or scene logic
- support "rewrite only after critique" workflows

## Non-Goals

- One-click viral content generator
- Prompt marketplace
- Generic grammar checker
- SEO content farm
- Pure chatbot interface
