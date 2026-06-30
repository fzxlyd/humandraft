const { Plugin, Notice, requestUrl } = require("obsidian");

module.exports = class HumanDraftPlugin extends Plugin {
  async onload() {
    this.addCommand({
      id: "humandraft-brief-selection",
      name: "Generate brief from selection",
      editorCallback: async (editor) => {
        const demand = editor.getSelection().trim();

        if (!demand) {
          new Notice("Select a writing demand first.");
          return;
        }

        try {
          const response = await requestUrl({
            url: "http://127.0.0.1:8787/api/brief",
            method: "POST",
            contentType: "application/json",
            body: JSON.stringify({ demand })
          });

          editor.replaceSelection(`\n\n\`\`\`json\n${JSON.stringify(response.json.brief, null, 2)}\n\`\`\`\n`);
        } catch (error) {
          new Notice("Start HumanDraft first: npx humandraft web");
        }
      }
    });
  }
};
