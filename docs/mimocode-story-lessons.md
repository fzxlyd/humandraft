# Lessons Absorbed From mimoCode-story

HumanDraft does not copy `mimoCode-story` directly. That project is a MiMo Code skill pack, while HumanDraft is a portable CLI/Web workbench.

Useful ideas absorbed:

- split writing, diagnosis, repair, and review into separate phases
- run quality gates after drafting instead of relying on taste alone
- treat AI smell as multiple failure modes, not one generic "humanize" pass
- use blocker/warning status so bad drafts cannot pass silently
- score writing with visible dimensions instead of a vague overall judgment

HumanDraft upgrades those ideas into portable modules:

- `src/deslop-gates.mjs`: six inspectable anti-slop gates
- `src/score.mjs`: deterministic writing rubric
- `src/gate.mjs`: unified blocker/warning gate
- `src/project-bible.mjs`: lightweight project bible and tracking scaffold
- `humandraft gate <file>`: publish-or-revise decision surface
- `humandraft init <dir> --profile qiba`: recurring project setup

What HumanDraft intentionally does not copy:

- MiMo-only slash commands
- child-agent-only execution assumptions
- heavy long-novel directory conventions
- brittle global skill paths
- version-drifted atom registries

The goal is simple: take the workflow discipline, keep the product portable.
