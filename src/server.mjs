import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { generateBrief } from "./brief.mjs";
import { composeDraft } from "./compose.mjs";
import { auditText } from "./audit.mjs";
import { runDeslopGates } from "./deslop-gates.mjs";
import { runQualityGate, renderGateReport } from "./gate.mjs";
import { renderMarkdownReport } from "./report.mjs";
import { scoreText } from "./score.mjs";

const INDEX_URL = new URL("../web/index.html", import.meta.url);

export async function startServer(options = {}) {
  const host = options.host ?? "127.0.0.1";
  const port = options.port ?? 8787;
  const server = createServer(handleRequest);

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, () => {
      server.off("error", reject);
      resolve();
    });
  });

  process.stdout.write(`HumanDraft web UI running at http://${host}:${port}\n`);
  return server;
}

async function handleRequest(request, response) {
  try {
    if (request.method === "GET" && request.url === "/") {
      const html = await readFile(INDEX_URL, "utf8");
      send(response, 200, html, "text/html; charset=utf-8");
      return;
    }

    if (request.method === "POST" && request.url === "/api/brief") {
      const body = await readJson(request);
      const brief = generateBrief(body.demand, body);
      sendJson(response, 200, { brief });
      return;
    }

    if (request.method === "POST" && request.url === "/api/compose") {
      const body = await readJson(request);
      const brief = body.brief ?? generateBrief(body.demand, body);
      const result = composeDraft(brief, { profile: brief.profile, style: brief.style });
      sendJson(response, 200, result);
      return;
    }

    if (request.method === "POST" && request.url === "/api/audit") {
      const body = await readJson(request);
      const result = auditText(body.text ?? "", { profile: body.profile ?? "general" });
      sendJson(response, 200, {
        ...result,
        markdown: renderMarkdownReport(result, "web-input")
      });
      return;
    }

    if (request.method === "POST" && request.url === "/api/gate") {
      const body = await readJson(request);
      const result = runQualityGate(body.text ?? "", { profile: body.profile ?? "general" });
      sendJson(response, 200, {
        ...result,
        markdown: renderGateReport(result, "web-input")
      });
      return;
    }

    if (request.method === "POST" && request.url === "/api/score") {
      const body = await readJson(request);
      sendJson(response, 200, scoreText(body.text ?? "", { profile: body.profile ?? "general" }));
      return;
    }

    if (request.method === "POST" && request.url === "/api/deslop") {
      const body = await readJson(request);
      sendJson(response, 200, { gates: runDeslopGates(body.text ?? "") });
      return;
    }

    send(response, 404, "Not found", "text/plain; charset=utf-8");
  } catch (error) {
    sendJson(response, 400, { error: error.message });
  }
}

async function readJson(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function sendJson(response, status, data) {
  send(response, status, JSON.stringify(data, null, 2), "application/json; charset=utf-8");
}

function send(response, status, body, type) {
  response.writeHead(status, {
    "content-type": type,
    "cache-control": "no-store"
  });
  response.end(body);
}
