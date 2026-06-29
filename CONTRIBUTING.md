# Contributing

HumanDraft welcomes contributions that make AI-assisted writing less generic, less careless, and more accountable.

## Good First Contributions

- Add anti-slop rules with real examples.
- Add domain profiles such as `marketing`, `fiction`, `academic`, or `short-video`.
- Improve report wording so findings are sharper and more useful.
- Add tests for false positives and false negatives.
- Add sample drafts and expected audit behavior.

## Rule Guidelines

Each rule should include:

- a clear problem name
- severity
- concrete evidence pattern
- actionable advice
- regression tests when possible

Avoid vague rules like "make this better." HumanDraft should tell writers exactly what broke and what kind of fix is needed.

## Design Philosophy

HumanDraft critiques before it rewrites. Rewriting features are welcome, but they should be tied to findings and acceptance checks.

