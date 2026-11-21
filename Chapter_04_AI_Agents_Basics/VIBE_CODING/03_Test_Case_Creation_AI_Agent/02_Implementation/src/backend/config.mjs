import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const implementationRoot = resolve(fileURLToPath(new URL(".", import.meta.url)), "../..");

if (!process.env.VERCEL) {
  const { default: dotenv } = await import("dotenv");
  const envCandidates = [
    resolve(implementationRoot, ".env"),
    resolve(implementationRoot, "../..", ".env"),
    resolve(implementationRoot, "../../..", ".env"),
    resolve(implementationRoot, "../../../..", ".env"),
  ];
  for (const path of envCandidates) {
    if (existsSync(path)) dotenv.config({ path, override: false, quiet: true });
  }
}

const firstDefined = (...values) => values.find((value) => value && String(value).trim()) || "";

export const serverConfig = {
  port: Number(process.env.PORT || 3002),
  jiraBaseUrl: firstDefined(process.env.JIRA_BASE_URL, process.env.BASE_URL),
  jiraEmail: firstDefined(process.env.JIRA_EMAIL, process.env.EMAIL),
  jiraToken: firstDefined(process.env.JIRA_TOKEN, process.env.API_TOKEN),
  groqApiKey: firstDefined(process.env.GROQ_API_KEY),
  groqModel: firstDefined(process.env.GROQ_MODEL) || "openai/gpt-oss-120b",
  ollamaUrl: firstDefined(process.env.OLLAMA_URL) || "http://localhost:11434",
  ollamaModel: firstDefined(process.env.OLLAMA_MODEL) || "llama3.2",
};

export function publicConfig() {
  return {
    jiraBaseUrl: serverConfig.jiraBaseUrl,
    jiraEmail: serverConfig.jiraEmail,
    hasJiraToken: Boolean(serverConfig.jiraToken),
    hasGroqKey: Boolean(serverConfig.groqApiKey),
    groqModel: serverConfig.groqModel,
    ollamaUrl: serverConfig.ollamaUrl,
    ollamaModel: serverConfig.ollamaModel,
  };
}

export function jiraSettings(body = {}) {
  return {
    baseUrl: normalizeBaseUrl(firstDefined(body.jiraBaseUrl, serverConfig.jiraBaseUrl)),
    email: firstDefined(body.jiraEmail, serverConfig.jiraEmail).trim(),
    token: firstDefined(body.jiraToken, serverConfig.jiraToken).trim(),
  };
}

export function aiSettings(body = {}) {
  return {
    provider: body.provider === "ollama" ? "ollama" : "groq",
    groqKey: firstDefined(body.groqApiKey, serverConfig.groqApiKey).trim(),
    groqModel: firstDefined(body.groqModel, serverConfig.groqModel).trim(),
    ollamaUrl: firstDefined(body.ollamaUrl, serverConfig.ollamaUrl).trim(),
    ollamaModel: firstDefined(body.ollamaModel, serverConfig.ollamaModel).trim(),
  };
}

export function normalizeBaseUrl(value) {
  return String(value || "").trim().replace(/\/+$/, "");
}
