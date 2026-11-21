import express from "express";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { aiSettings, implementationRoot, jiraSettings, publicConfig } from "./config.mjs";
import {
  ServiceError,
  fetchJiraComments,
  fetchJiraIssue,
  looksLikeIssueKey,
  testJiraConnection,
  userIssueKey,
} from "./jira.mjs";
import { testLlmConnection } from "./llm.mjs";
import { generatePlan, loadTemplate, missingSections } from "./planner.mjs";

const asyncRoute = (handler) => (request, response, next) =>
  Promise.resolve(handler(request, response)).catch(next);

export function createApiRouter() {
  const api = express.Router();

  api.get("/config", (request, response) => {
    response.set("Cache-Control", "no-store").json(publicConfig());
  });

  api.post(
    "/jira/connection",
    asyncRoute(async (request, response) => {
      response.json({ message: await testJiraConnection(jiraSettings(request.body)) });
    }),
  );

  api.post(
    "/jira/issue",
    asyncRoute(async (request, response) => {
      const key = userIssueKey(request.body.issueKey);
      const settings = jiraSettings(request.body);
      const issue = await fetchJiraIssue(key, settings);
      const comments = await fetchJiraComments(key, settings);
      response.json({ issue, comments });
    }),
  );

  api.post(
    "/llm/connection",
    asyncRoute(async (request, response) => {
      response.json({ message: await testLlmConnection(aiSettings(request.body)) });
    }),
  );

  api.post(
    "/plan",
    asyncRoute(async (request, response) => {
      const body = request.body || {};
      const prompt = String(body.prompt || "").trim();
      if (!prompt) {
        throw new ServiceError("Enter a Jira issue key (for example KAN-4) or paste the ticket details.");
      }

      const template = await loadTemplate();
      const ai = aiSettings(body);

      let issue = null;
      let comments = [];
      let pasted = "";

      if (looksLikeIssueKey(prompt)) {
        const key = userIssueKey(prompt);
        const settings = jiraSettings(body);
        issue = await fetchJiraIssue(key, settings);
        comments = await fetchJiraComments(key, settings);
      } else {
        if (prompt.length < 40) {
          throw new ServiceError(
            "That does not look like a Jira issue key. Paste the full ticket text, or enter a key such as KAN-4.",
          );
        }
        pasted = prompt;
      }

      const result = await generatePlan({ issue, comments, pasted, ai, template });
      const missing = missingSections(result.plan, template);

      response.json({
        plan: result.plan,
        provider: result.provider,
        model: result.model,
        issueKey: issue?.key || null,
        issueUrl: issue?.url || null,
        issueSummary: issue?.summary || null,
        commentCount: comments.length,
        missingSections: missing,
        warnings: [
          ...(issue ? [] : ["No Jira issue was retrieved; the plan is based only on pasted text."]),
          ...(missing.length ? ["The model omitted some template sections. Review before sign-off."] : []),
        ],
      });
    }),
  );

  return api;
}

export function createApp({ serveStatic = false } = {}) {
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json({ limit: "512kb" }));

  app.use("/api", createApiRouter());

  if (serveStatic) {
    const dist = resolve(implementationRoot, "dist");
    if (!existsSync(dist)) console.warn("No production build found. Run `npm run build` first.");
    app.use(express.static(dist, { index: false, dotfiles: "deny" }));
    app.get("*", (request, response, next) => {
      if (request.path.startsWith("/api/")) return next();
      response.sendFile(resolve(dist, "index.html"));
    });
  }

  app.use((error, request, response, next) => {
    if (response.headersSent) return next(error);
    const status = error instanceof ServiceError ? error.status : 500;
    if (status >= 500) console.error(error);
    response.status(status).json({ error: error.message || "Unexpected server error." });
  });

  return app;
}
