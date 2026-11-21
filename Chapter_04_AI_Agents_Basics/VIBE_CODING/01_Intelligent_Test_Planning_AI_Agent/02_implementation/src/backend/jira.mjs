import { serverConfig } from "./config.mjs";

const REQUEST_TIMEOUT_MS = 20_000;

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

export class ServiceError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

function basicAuth(email, token) {
  return `Basic ${Buffer.from(`${email}:${token}`).toString("base64")}`;
}

export function userIssueKey(value) {
  const key = String(value || "").trim();
  if (!/^[A-Z][A-Z0-9_]*-\d{1,10}$/i.test(key)) {
    throw new ServiceError("Enter a valid Jira issue key such as KAN-4, or paste the ticket details.");
  }
  return key.toUpperCase();
}

export function looksLikeIssueKey(value) {
  return /^[A-Z][A-Z0-9_]*-\d{1,10}$/i.test(String(value || "").trim());
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
    throw new ServiceError("Jira denied access. This account lacks permission to read the issue.", 403);
  }
  if (response.status === 404) {
    throw new ServiceError("Jira could not find that issue. Check the issue key and your access.", 404);
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

export async function fetchJiraIssue(key, settings) {
  const issue = await jiraFetch(
    `/rest/api/3/issue/${encodeURIComponent(key)}?expand=names`,
    settings,
  );
  const names = issue.names || {};
  const fields = issue.fields || {};

  const acceptanceFields = Object.entries(fields)
    .filter(([id, value]) => {
      const name = names[id] || "";
      if (id === "description" || !/acceptance criteria/i.test(name)) return false;
      return value !== null && value !== undefined && String(adfToText(value)).trim() !== "";
    })
    .map(([id, value]) => ({ name: names[id] || id, text: adfToText(value) }));

  const base = assertHttpsUrl(settings.baseUrl, "The Jira site URL");

  return {
    key: issue.key,
    url: `${base.origin}/browse/${issue.key}`,
    summary: fields.summary || "",
    type: fields.issuetype?.name || "",
    status: fields.status?.name || "",
    priority: fields.priority?.name || "",
    project: fields.project?.name || "",
    labels: fields.labels || [],
    components: (fields.components || []).map((component) => component.name),
    created: fields.created || "",
    updated: fields.updated || "",
    parent: fields.parent ? `${fields.parent.key} ${fields.parent.fields?.summary || ""}`.trim() : "",
    subtasks: (fields.subtasks || []).map((subtask) => `${subtask.key} ${subtask.fields?.summary || ""}`.trim()),
    description: adfToText(fields.description),
    acceptanceFields,
  };
}

export async function fetchJiraComments(key, settings) {
  try {
    const data = await jiraFetch(
      `/rest/api/3/issue/${encodeURIComponent(key)}/comment?maxResults=20&orderBy=-created`,
      settings,
    );
    return (data.comments || [])
      .map((comment) => ({
        author: comment.author?.displayName || "Unknown",
        created: comment.created || "",
        body: adfToText(comment.body),
      }))
      .filter((comment) => comment.body.trim());
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
