import { ServiceError } from "./jira.mjs";

const HEADING_PATTERN = /^#{1,6}\s+(.+)$/;

const REQUIREMENT_HEADINGS = /(acceptance criteri|requirements?|scope|user story|business objective|definition of done|in scope)/i;

export function extractRequirements(description) {
  const lines = String(description || "").split("\n");
  const requirements = [];
  let currentHeading = "";
  let inRequirementSection = false;

  const push = (text) => {
    const clean = String(text || "").replace(/^\s*[-*]\s*/, "").replace(/\s+/g, " ").trim();
    if (clean.length < 8) return;
    if (/^insufficient information/i.test(clean)) return;
    requirements.push({ heading: currentHeading, text: clean });
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const heading = line.match(HEADING_PATTERN);
    if (heading) {
      currentHeading = heading[1].replace(/\*\*/g, "").trim();
      inRequirementSection = REQUIREMENT_HEADINGS.test(currentHeading);
      continue;
    }

    if (!inRequirementSection) continue;

    if (/^\s*[-*]\s+/.test(rawLine)) {
      push(line);
    } else if (/^\s*\d+\.\s+/.test(rawLine)) {
      push(line);
    } else if (line.length > 40 && !line.startsWith("|")) {
      push(line);
    }
  }

  const seen = new Set();
  return requirements
    .filter((item) => {
      const key = item.text.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 40)
    .map((item, index) => ({
      id: `REQ-${String(index + 1).padStart(2, "0")}`,
      source: item.heading || "Description",
      text: item.text,
    }));
}

export function buildRequirementsBlock({ issue, pastedPlan }) {
  const parts = [];

  if (issue) {
    const extracted = extractRequirements(issue.description);
    const acceptance = issue.acceptanceFields.flatMap((field) =>
      field.text
        .split("\n")
        .filter((line) => line.trim().length > 8)
        .map((line) => ({ heading: field.name, text: line.trim() })),
    );

    const combined = [];
    const seen = new Set();
    for (const item of [...acceptance, ...extracted]) {
      const key = item.text.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      combined.push(item);
    }

    if (combined.length === 0) {
      parts.push(
        `## Extracted Requirements\nNo numbered requirements could be extracted from the issue description. Use the description as source data and cite "Description" when mapping test cases.`,
      );
    } else {
      parts.push(
        `## Extracted Requirements (cite these IDs in the traceability and summary tables)\n${combined
          .slice(0, 40)
          .map((item, index) => `${`REQ-${String(index + 1).padStart(2, "0")}`} | source: ${item.heading || "Description"} | ${item.text}`)
          .join("\n")}`,
      );
    }

    parts.push(`\n## Full Issue Description\n${issue.description || "Insufficient information to determine."}`);
    if (issue.acceptanceFields.length) {
      parts.push(
        `\n## Acceptance Criteria Fields\n${issue.acceptanceFields
          .map((field) => `### ${field.name}\n${field.text}`)
          .join("\n\n")}`,
      );
    }
  } else {
    parts.push(`## Requirements Supplied As Pasted Text\n\n${pastedPlan}`);
  }

  return parts.join("\n");
}

export function ticketMetadata(issue) {
  if (!issue) return `No Jira issue retrieved.`;
  return `## Ticket Metadata
Key: ${issue.key}
URL: ${issue.url}
Summary: ${issue.summary}
Type: ${issue.type || "unknown"}
Status: ${issue.status || "unknown"}
Priority: ${issue.priority || "unknown"}
Project: ${issue.project || "unknown"}
Sprint: ${issue.sprint || "not provided"}
Fix Versions: ${issue.fixVersions.length ? issue.fixVersions.join(", ") : "none"}
Labels: ${issue.labels.length ? issue.labels.join(", ") : "none"}
Components: ${issue.components.length ? issue.components.join(", ") : "none"}`;
}

export function numberedRequirements(issue, pastedPlan) {
  if (!issue) return [];
  const extracted = extractRequirements(issue.description);
  const fromAcceptance = issue.acceptanceFields.flatMap((field) =>
    field.text
      .split("\n")
      .filter((line) => line.trim().length > 8)
      .map((line) => ({ heading: field.name, text: line.trim() })),
  );
  const seen = new Set();
  return [...fromAcceptance, ...extracted]
    .filter((item) => {
      const key = item.text.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 40)
    .map((item, index) => ({
      id: `REQ-${String(index + 1).padStart(2, "0")}`,
      text: item.text,
      source: item.heading || "Description",
    }));
}

export function verifyTraceability(generated, requirements) {
  if (requirements.length === 0) return { cited: [], uncited: [], unknownCitations: [] };

  const text = String(generated);

  const coverageRows = new Map();
  for (const line of text.split("\n")) {
    if (!line.trim().startsWith("|")) continue;
    const cells = line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
    if (cells.length < 3) continue;
    if (/^requirement/i.test(cells[0]) || /^[-:]+$/.test(cells[0])) continue;
    const requirementId = cells[0];
    if (!/^REQ-\d{1,3}$/i.test(requirementId)) continue;
    const testCaseCell = cells[2] || "";
    const ids = [...testCaseCell.matchAll(/\bTC-[A-Z]*\d{1,3}\b/g)].map((match) => match[0]);
    coverageRows.set(requirementId.toUpperCase(), ids);
  }

  const cited = [];
  const uncited = [];
  for (const requirement of requirements) {
    const rows = coverageRows.get(requirement.id);
    if (rows && rows.length > 0) {
      cited.push(requirement.id);
      continue;
    }
    const idPattern = new RegExp(`(^|[^A-Z0-9])${requirement.id}([^0-9]|$)`);
    const mapped = text.split("\n").some((line) => {
      if (!idPattern.test(line)) return false;
      if (/not covered|unverified|coverage gaps/i.test(line)) return false;
      return /\bTC-[A-Z]*\d{1,3}\b/.test(line);
    });
    if (mapped) cited.push(requirement.id);
    else uncited.push(requirement.id);
  }

  const known = new Set(requirements.map((requirement) => requirement.id));
  const unknown = new Set();
  for (const match of text.matchAll(/\bREQ-\d{1,3}\b/g)) {
    if (!known.has(match[0])) unknown.add(match[0]);
  }

  return { cited, uncited, unknownCitations: [...unknown] };
}

export function detectDuplicateTitles(generated) {
  const titles = [...generated.matchAll(/^### Test Case (TC-\d+): (.+)$/gm)].map((match) => ({
    id: match[1],
    title: match[2].trim().toLowerCase().replace(/[^a-z0-9 ]/g, ""),
  }));

  const seen = new Map();
  const duplicates = [];
  for (const item of titles) {
    if (seen.has(item.title)) {
      duplicates.push(`${seen.get(item.title)} and ${item.id} share the title "${item.title}"`);
    } else {
      seen.set(item.title, item.id);
    }
  }
  return { count: titles.length, duplicates };
}

export function readOptionalContext(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (text.length > 60_000) {
    throw new ServiceError("The supplied supporting document is too large. Paste only the relevant sections.");
  }
  return text;
}
