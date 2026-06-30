# Integrations

HumanDraft keeps the core engine in the CLI so editor integrations can stay thin.

## CLI First

After the package is published to npm:

```bash
npx humandraft audit draft.md --profile qiba
npx humandraft brief "琦爸酒食，给我故事：骨头汤补钙" --profile qiba --template story
npx humandraft write "公众号，AI写作为什么一听就是AI" --template public-account
npx humandraft web --port 8787
```

Before npm publication, use the GitHub package directly:

```bash
npx github:fzxlyd/humandraft write "琦爸酒食，给我故事：骨头汤补钙" --profile qiba --template story
```

## Web UI

Run:

```bash
npx humandraft web
```

Then open:

```text
http://127.0.0.1:8787
```

The local server exposes:

- `POST /api/brief`
- `POST /api/compose`
- `POST /api/audit`

## VS Code

The `integrations/vscode` folder is a starter extension. It provides commands that call the CLI from the editor terminal:

- `HumanDraft: Open Web UI`
- `HumanDraft: Brief From Selection`
- `HumanDraft: Write From Selection`

## Obsidian

The `integrations/obsidian` folder is a starter plugin. It expects the local Web UI server to be running and sends the selected text to `/api/brief`.

This keeps private drafts local and avoids requiring API keys inside the editor plugin.
