import express from "express";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { aiSettings, implementationRoot, jiraSettings, publicConfig } from "./config.mjs";
import {
  ServiceError,
  fetchEpics,
  fetchProject,
  fetchProjectIssues,
  looksLikeProjectKey,
  normalizeProjectKey,
  testJiraConnection,
} from "./jira.mjs";
import { testLlmConnection } from "./llm.mjs";
import { generateStrategy, loadTemplate, missingSections } from "./strategy.mjs";

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
    "/jira/project",
    asyncRoute(async (request, response) => {
      const key = normalizeProjectKey(request.body.projectKey);
      const settings = jiraSettings(request.body);
      const project = await fetchProject(key, settings);
      const epics = await fetchEpics(key, settings);
      const issues = await fetchProjectIssues(key, settings);
      response.json({ project, epics, issues });
    }),
  );

  api.post(
    "/llm/connection",
    asyncRoute(async (request, response) => {
      response.json({ message: await testLlmConnection(aiSettings(request.body)) });
    }),
  );

  api.post(
    "/strategy",
    asyncRoute(async (request, response) => {
      const body = request.body || {};
      const projectInput = {
        projectName: String(body.projectName || "").trim(),
        application: String(body.application || "").trim(),
        projectType: String(body.projectType || "").trim(),
        technology: String(body.technology || "").trim(),
        testingScope: String(body.testingScope || "").trim(),
        businessCriticality: String(body.businessCriticality || "").trim(),
        notes: String(body.notes || "").trim(),
      };
      const projectKey = String(body.projectKey || "").trim();

      const hasInput = Object.values(projectInput).some(Boolean);
      if (!hasInput && !projectKey) {
        throw new ServiceError(
          "Provide project information (at least a project name) or a Jira project key to build a strategy.",
        );
      }

      let project = null;
      let epics = [];
      let issues = [];

      if (projectKey) {
        const key = normalizeProjectKey(projectKey);
        const settings = jiraSettings(body);
        project = await fetchProject(key, settings);
        epics = await fetchEpics(key, settings);
        issues = await fetchProjectIssues(key, settings);
      }

      const template = await loadTemplate();
      const ai = aiSettings(body);
      const result = await generateStrategy({ projectInput, project, epics, issues, ai, template });
      const missing = missingSections(result.strategy, template);

      response.json({
        strategy: result.strategy,
        provider: result.provider,
        model: result.model,
        projectKey: project?.key || null,
        projectName: project?.name || projectInput.projectName || null,
        projectUrl: project?.url || null,
        issueCount: issues.length,
        epicCount: epics.length,
        missingSections: missing,
        warnings: [
          ...(project ? [] : ["No Jira project was retrieved; the strategy is based only on the information you supplied."]),
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
