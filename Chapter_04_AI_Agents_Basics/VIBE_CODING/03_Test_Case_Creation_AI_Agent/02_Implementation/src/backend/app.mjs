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
  validateIssueKey,
} from "./jira.mjs";
import { testLlmConnection } from "./llm.mjs";
import {
  countTestCases,
  generateTestCases,
  loadTemplate,
  missingSections,
} from "./cases.mjs";
import { numberedRequirements } from "./requirements.mjs";

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
      const key = validateIssueKey(request.body.issueKey);
      const settings = jiraSettings(request.body);
      const issue = await fetchJiraIssue(key, settings);
      const comments = await fetchJiraComments(key, settings);
      response.json({ issue, comments, requirements: numberedRequirements(issue) });
    }),
  );

  api.post(
    "/llm/connection",
    asyncRoute(async (request, response) => {
      response.json({ message: await testLlmConnection(aiSettings(request.body)) });
    }),
  );

  api.post(
    "/testcases",
    asyncRoute(async (request, response) => {
      const body = request.body || {};
      const input = String(body.prompt || "").trim();
      if (!input) {
        throw new ServiceError("Enter a Jira issue key (for example KAN-4) or paste the requirements.");
      }

      const template = await loadTemplate();
      const ai = aiSettings(body);

      let issue = null;
      let comments = [];
      let pasted = "";

      if (looksLikeIssueKey(input)) {
        const key = validateIssueKey(input);
        const settings = jiraSettings(body);
        issue = await fetchJiraIssue(key, settings);
        comments = await fetchJiraComments(key, settings);
      } else {
        if (input.length < 40) {
          throw new ServiceError(
            "That does not look like a Jira issue key. Paste the full requirements, or enter a key such as KAN-4.",
          );
        }
        pasted = input;
      }

      const result = await generateTestCases({
        issue,
        comments,
        pasted,
        planContext: body.planContext,
        strategyContext: body.strategyContext,
        ai,
        template,
      });

      const missing = missingSections(result.testCases, template);
      const warnings = [
        ...(issue ? [] : ["No Jira issue was retrieved; test cases are based only on the pasted requirements."]),
        ...(missing.length ? ["The model omitted some template sections. Review before sign-off."] : []),
        ...(result.duplicates.duplicates.length
          ? [`Possible duplicate test cases: ${result.duplicates.duplicates.join("; ")}`]
          : []),
        ...(result.traceability.uncited.length
          ? [`Requirements without a citing test case: ${result.traceability.uncited.join(", ")}`]
          : []),
        ...(result.traceability.unknownCitations.length
          ? [`Output cites requirement IDs that do not exist: ${result.traceability.unknownCitations.join(", ")}`]
          : []),
      ];

      response.json({
        testCases: result.testCases,
        provider: result.provider,
        model: result.model,
        issueKey: issue?.key || null,
        issueUrl: issue?.url || null,
        issueSummary: issue?.summary || null,
        commentCount: comments.length,
        testCaseCount: countTestCases(result.testCases),
        requirements: result.requirements,
        traceability: result.traceability,
        duplicates: result.duplicates,
        missingSections: missing,
        warnings,
      });
    }),
  );

  return api;
}

export function createApp({ serveStatic = false } = {}) {
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json({ limit: "1mb" }));
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
