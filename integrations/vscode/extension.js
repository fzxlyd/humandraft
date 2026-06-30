const vscode = require("vscode");

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("humandraft.openWebUi", () => {
      runInTerminal("npx humandraft web --port 8787");
      vscode.env.openExternal(vscode.Uri.parse("http://127.0.0.1:8787"));
    }),
    vscode.commands.registerCommand("humandraft.briefFromSelection", () => {
      runSelectionCommand("brief");
    }),
    vscode.commands.registerCommand("humandraft.writeFromSelection", () => {
      runSelectionCommand("write");
    })
  );
}

function runSelectionCommand(command) {
  const editor = vscode.window.activeTextEditor;
  const text = editor ? editor.document.getText(editor.selection).trim() : "";

  if (!text) {
    vscode.window.showWarningMessage("Select a writing demand first.");
    return;
  }

  runInTerminal(`npx humandraft ${command} ${shellQuote(text)}`);
}

function runInTerminal(command) {
  const terminal = vscode.window.createTerminal("HumanDraft");
  terminal.show();
  terminal.sendText(command);
}

function shellQuote(value) {
  return `'${value.replace(/'/g, "'\\''")}'`;
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
