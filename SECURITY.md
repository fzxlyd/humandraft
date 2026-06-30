# Security Policy

HumanDraft is currently a local CLI with no network calls and no API keys required.

## Reporting A Vulnerability

Please open a GitHub issue if you find a security issue in the current implementation.

Do not include secrets, private drafts, or confidential writing samples in public issues. Use a minimal reproduction instead.

## Data Handling

The current CLI reads local text files and prints reports to stdout. It does not send draft text to any remote service.

Future LLM integrations should keep provider calls explicit and configurable.
