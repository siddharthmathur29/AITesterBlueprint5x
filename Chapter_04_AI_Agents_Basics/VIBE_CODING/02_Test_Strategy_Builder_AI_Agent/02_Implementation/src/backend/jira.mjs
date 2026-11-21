import { serverConfig } from "./config.mjs";

const REQUEST_TIMEOUT_MS = 20_000;
const MAX_ISSUES = 60;

export class ServiceError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

export function assertHttpsUrl(value, label = "URL") {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new ServiceError(`${label} is not a valid URL.`);
  }
  if (url.protocol !== "https:") throw new ServiceError(`${label} must use HTTPS.`);
  if (url.username || url.password) throw new ServiceError(`${label} must not contain embedded credentials.`);
  return url;
}

function basicAuth(email, token) {
  return `Basic ${Buffer.from(`${email}:${token}`).toString("base64")}`;
}

export function looksLikeIssueKey(value) {
  return /^[A-Z][A-Z0-9_]*-\d{1,10}$/i.test(String(value || "").trim());
}

export function looksLikeProjectKey(value) {
  return /^[A-Z][A-Z0-9_]{0,19}$/i.test(String(value || "").trim());
}

export function normalizeProjectKey(value) {
  const key = String(value || "").trim().toUpperCase();
  if (!key) throw new ServiceError("Enter a Jira project key such as KAN.");
  if (!looksLikeProjectKey(key)) {
    throw new ServiceError("Enter a valid Jira project key (letters and digits, for example KAN).");
  }
  return key;
}

async function jiraFetch(path, settings) {
  if (!settings.baseUrl || !settings.email || !settings.token) {
    throw new ServiceError(
      "Jira is not configured. Add the site URL, email, and API token in Settings, or set JIRA_BASE_URL, JIRA_EMAIL, and JIRA_TOKEN in .env.",
    );
  }
  const base = assertHttpsUrl(settings.baseUrl, "The Jira site URL");
  if (serverConfig.jiraBaseUrl) {
    const configured = assertHttpsUrl(serverConfig.jiraBaseUrl, "The configured Jira site URL");
    if (configured.origin !== base.origin) {
      throw new ServiceError("The Jira site URL must match the host configured on the server.");
    }
  }

  let response;
  try {
    response = await fetch(new URL(path, `${base.origin}/`), {
      headers: {
        Accept: "application/json",
        Authorization: basicAuth(settings.email, settings.token),
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    throw new ServiceError(`Could not reach Jira: ${error.message}`, 502);
  }

  if (response.status === 401) {
    throw new ServiceError("Jira authentication failed. Check the email address and API token.", 401);
  }
  if (response.status === 403) {
    throw new ServiceError("Jira denied access. This account lacks permission for that project.", 403);
  }
  if (response.status === 404) {
    throw new ServiceError("Jira could not find that project. Check the key and your access.", 404);
  }
  if (!response.ok) {
    const detail = (await response.text()).slice(0, 300);
    throw new ServiceError(`Jira returned HTTP ${response.status}${detail ? `: ${detail}` : "."}`, 502);
  }
  return response.json();
}

export async function testJiraConnection(settings) {
  const me = await jiraFetch("/rest/api/3/myself", settings);
  return `Connected as ${me.displayName || me.emailAddress || "Jira user"}.`;
}

export async function fetchProject(key, settings) {
  const project = await jiraFetch(`/rest/api/3/project/${encodeURIComponent(key)}`, settings);
  const base = assertHttpsUrl(settings.baseUrl, "The Jira site URL");

  return {
    key: project.key,
    name: project.name || "",
    url: `${base.origin}/jira/software/projects/${project.key}/boards`,
    description: project.description || "",
    projectType: project.projectTypeKey || "",
    lead: project.lead?.displayName || "",
    issueTypes: (project.issueTypes || []).filter((type) => !type.subtask).map((type) => type.name),
    components: (project.components || []).map((component) => component.name),
    versions: (project.versions || []).map((version) => ({
      name: version.name,
      released: Boolean(version.released),
      releaseDate: version.releaseDate || "",
    })),
  };
}

export async function fetchProjectIssues(projectKey, settings) {
  const jql = `project = "${projectKey}" ORDER BY rank ASC`;
  const fields = "summary,description,issuetype,status,priority,labels,components,parent,fixVersions,created,updated";
  const data = await jiraFetch(
    `/rest/api/3/search/jql?jql=${encodeURIComponent(jql)}&maxResults=${MAX_ISSUES}&fields=${fields}`,
    settings,
  );

  return (data.issues || []).map((issue) => {
    const issueFields = issue.fields || {};
    return {
      key: issue.key,
      summary: issueFields.summary || "",
      type: issueFields.issuetype?.name || "",
      status: issueFields.status?.name || "",
      priority: issueFields.priority?.name || "",
      labels: issueFields.labels || [],
      components: (issueFields.components || []).map((component) => component.name),
      fixVersions: (issueFields.fixVersions || []).map((version) => version.name),
      parent: issueFields.parent?.key || "",
      description: adfToText(issueFields.description),
      created: issueFields.created || "",
    };
  });
}

export async function fetchEpics(projectKey, settings) {
  const jql = `project = "${projectKey}" AND issuetype = Epic ORDER BY rank ASC`;
  try {
    const data = await jiraFetch(
      `/rest/api/3/search/jql?jql=${encodeURIComponent(jql)}&maxResults=50&fields=summary,description,status`,
      settings,
    );
    return (data.issues || []).map((issue) => ({
      key: issue.key,
      summary: issue.fields?.summary || "",
      status: issue.fields?.status?.name || "",
      description: adfToText(issue.fields?.description),
    }));
  } catch {
    return [];
  }
}

export function adfToText(node) {
  if (node === null || node === undefined) return "";
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(adfToText).join("");
  if (typeof node !== "object") return "";

  const children = () => adfToText(node.content || []);

  switch (node.type) {
    case "doc":
      return children().trim();
    case "text": {
      const value = node.text || "";
      const marks = (node.marks || []).map((mark) => mark.type);
      if (marks.includes("code")) return `\`${value}\``;
      if (marks.includes("strong")) return `**${value}**`;
      if (marks.includes("em")) return `*${value}*`;
      return value;
    }
    case "paragraph":
      return `${children()}\n\n`;
    case "heading": {
      const level = Number(node.attrs?.level) || 3;
      return `${"#".repeat(Math.min(level, 6))} ${children()}\n\n`;
    }
    case "bulletList":
      return `${(node.content || []).map((item) => `- ${adfToText(item).trim().replace(/\n/g, "\n  ")}`).join("\n")}\n\n`;
    case "orderedList":
      return `${(node.content || [])
        .map((item, index) => `${index + 1}. ${adfToText(item).trim().replace(/\n/g, "\n   ")}`)
        .join("\n")}\n\n`;
    case "listItem":
      return children();
    case "blockquote":
      return `${children().trim().replace(/^/gm, "> ")}\n\n`;
    case "codeBlock":
      return `\`\`\`${node.attrs?.language || ""}\n${children().trim()}\n\`\`\`\n\n`;
    case "hardBreak":
      return "\n";
    case "inlineCard":
      return node.attrs?.url ? `<${node.attrs.url}>` : "";
    case "link":
      return node.attrs?.href ? `<${node.attrs.href}>` : "";
    case "mediaSingle":
    case "mediaGroup":
    case "media":
      return node.attrs?.alt ? `[media: ${node.attrs.alt}]` : "[media]";
    case "table":
    case "tableRow":
    case "tableCell":
    case "tableHeader":
      return children();
    case "panel":
      return `${children().trim()}\n\n`;
    case "rule":
      return "---\n\n";
    default:
      return children();
  }
}
