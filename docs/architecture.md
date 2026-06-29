# Architecture

HumanDraft is built as a layered review pipeline.

## Pipeline

```text
Input text
  -> segmentation
  -> deterministic rule audit
  -> profile-specific audit
  -> finding aggregation
  -> score
  -> report
```

Later versions can add:

```text
research pack
  -> claim tracing
  -> evidence cards
  -> source risk labels

project memory
  -> character ledger
  -> scene ledger
  -> causality ledger
  -> voice examples

LLM rewrite
  -> critique-bound rewrite
  -> acceptance checks
  -> diff review
```

## Core Concepts

### Finding

A finding is an actionable critique:

```js
{
  id: "fake-suspense",
  severity: "high",
  message: "Avoid teaser suspense without concrete stakes.",
  evidence: "你绝对想不到...",
  advice: "Replace the teaser with an observed action or conflict."
}
```

### Rule

A rule is a deterministic function over text.

Rules should be:

- readable
- testable
- easy to disable
- easy to explain

### Profile

A profile activates domain-specific checks.

Examples:

- `general`: broad anti-slop and clarity checks
- `qiba`: food-science short-video script checks
- `story`: causality and character checks
- `research`: evidence and citation checks

## Why Start Deterministic

LLMs are useful for rewriting, but they are also the source of the problem. Deterministic checks create a stable floor:

- they are cheap
- they can run offline
- they are explainable
- they can be tested
- they make later LLM output accountable

