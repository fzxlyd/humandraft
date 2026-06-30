# Using HumanDraft For Our Own Stories

This document explains how we should use HumanDraft for projects such as `琦爸酒食` and `7号关口`.

## Honest Current Status

HumanDraft is not yet a magic story machine.

Today it is useful as:

- a story gate
- a bad-draft detector
- a rewrite-contract generator
- a style and evidence checklist
- a structured brief-to-draft skeleton

It is not yet enough to replace a human story editor.

The practical rule is:

```text
Do not ask HumanDraft to "write a good episode."
Ask it to:
1. read a project bible
2. write from a structured brief
3. audit the result
4. produce a rewrite contract
5. rewrite only against the failed checks
```

## The Workflow

```text
Project bible
  -> episode brief
  -> compose draft
  -> audit
  -> rewrite contract
  -> human decision
  -> constrained rewrite
  -> final audit
```

## For 琦爸酒食

`琦爸酒食` needs a hard story gate because weak drafts tend to become fake warmth.

### Required Inputs

- fixed location rules
- recurring characters
- episode topic
- crisis or pressure
- reason to enter the restaurant
- what is discovered inside the restaurant
- what solution appears inside the restaurant
- final cold question or non-preachy aftertaste
- safety constraints for minors, patients, elderly people, and dependents

### Hard Rejection Checks

Reject the draft if:

- the protagonist enters the restaurant for no urgent human reason
- the solution happens outside the restaurant
- suffering is manufactured through neglect or unsafe behavior
- Qiba or Beima acts like a therapist or miracle worker
- the ending becomes a slogan
- the story explains feelings instead of showing actions
- the episode relies on fake suspense rather than visible pressure

### How To Run

```bash
node src/cli.mjs compose samples/brief-qiba-story.json --style oral --profile qiba
node src/cli.mjs audit draft.md --profile qiba
```

## For 7号关口

`7号关口` can use HumanDraft, but only after its project bible is explicit.

If the tool does not know the world rules, it will make generic checkpoint fiction.

### Required Project Bible

Before writing, provide:

- what "7号关口" is
- where it is
- who controls it
- what can and cannot pass through it
- what happens if someone violates the rule
- recurring characters
- the moral pressure of the world
- visual tone
- forbidden tropes
- episode structure

### Hard Rejection Checks

Reject the draft if:

- the gate rule changes for convenience
- a character acts without survival logic
- the crisis is only announced, not shown
- the ending is a twist with no planted cause
- the world feels like generic sci-fi/fantasy wallpaper
- dialogue exists only to explain lore
- the story has "mystery" but no concrete stakes

### How To Run

```bash
node src/cli.mjs compose samples/brief-gate7.json --style elevated --profile story
node src/cli.mjs audit draft.md --profile story
```

## What A Good Output Should Look Like

HumanDraft should not just output prose. It should output:

1. Draft
2. Self-audit score
3. Top failed checks
4. Rewrite contract
5. What must not be changed

The most important section is the rewrite contract.

If the rewrite contract is weak, the writing will stay weak.

## Current Limitation

The current `compose` command outputs a development draft, not a final production script.

It may place evidence-card language directly into the draft. That is useful for internal review, but should not appear in final dialogue, narration, subtitles, or video prompts.

Production rule:

```text
Evidence cards guide the writer.
They do not appear as on-screen lines.
```

Before a script is approved, move evidence notes into the audit section and rewrite the spoken text into natural human language.

## Next Product Step

To make this truly useful for our own story projects, add:

- `project bible` input
- `episode brief` schema
- `story gate` profile
- `qiba-story` profile
- `gate7` profile
- separation between internal evidence notes and spoken script
- automatic rewrite from failed checks
- before/after comparison to catch fact loss and voice flattening
