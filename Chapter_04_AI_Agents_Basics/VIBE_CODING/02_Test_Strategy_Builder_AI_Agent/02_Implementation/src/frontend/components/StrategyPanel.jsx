import React, { useState } from "react";
import { StrategyOutput } from "./StrategyOutput.jsx";

const FIELDS = [
  { name: "projectName", label: "Project name", placeholder: "e.g. VWO Authentication Enhancements", required: true },
  { name: "application", label: "Application / product", placeholder: "e.g. Visual Website Optimizer" },
  { name: "projectType", label: "Project type", placeholder: "e.g. Web application, API, mobile" },
  { name: "technology", label: "Technology stack", placeholder: "e.g. React, Node.js, PostgreSQL" },
  { name: "businessCriticality", label: "Business criticality", placeholder: "e.g. High — customer-facing revenue path" },
];

export function StrategyPanel({ agent }) {
  const [copied, setCopied] = useState("");
  const { project, setProject } = agent;

  const update = (name) => (event) => setProject({ ...project, [name]: event.target.value });

  async function copyStrategy() {
    if (!agent.result?.strategy) return;
    try {
      await navigator.clipboard.writeText(agent.result.strategy);
      setCopied("Copied");
    } catch {
      setCopied("Copy failed");
    }
    setTimeout(() => setCopied(""), 1400);
  }

  function downloadStrategy() {
    if (!agent.result?.strategy) return;
    const name = agent.result.projectKey
      ? `${agent.result.projectKey}_TestStrategy.md`
      : "TestStrategy_Draft.md";
    const blob = new Blob([agent.result.strategy], { type: "text/markdown" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = name;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return (
    <section className="panel strategy-panel" aria-label="Test strategy">
      <div className="panel-head">
        <span className="eyebrow">Main page</span>
        <h1>Reply with Test Strategy Builder</h1>
        <p className="subhead">
          Describe the project, or give a Jira project key. The builder drafts a project-level test strategy — never a
          story-level test plan.
        </p>
      </div>

      <form
        className="project-form"
        onSubmit={(event) => {
          event.preventDefault();
          agent.generate();
        }}
      >
        <div className="field-grid">
          {FIELDS.map((field) => (
            <div key={field.name} className="field">
              <label htmlFor={field.name}>
                {field.label}
                {field.required && <span className="req"> *</span>}
              </label>
              <input
                id={field.name}
                value={project[field.name]}
                onChange={update(field.name)}
                placeholder={field.placeholder}
                disabled={Boolean(agent.busy)}
              />
            </div>
          ))}
        </div>

        <label htmlFor="testingScope">Testing scope</label>
        <textarea
          id="testingScope"
          rows={2}
          value={project.testingScope}
          onChange={update("testingScope")}
          placeholder="e.g. Overall application testing ahead of the Q1 release"
          disabled={Boolean(agent.busy)}
        />

        <label htmlFor="notes">Additional requirements / notes</label>
        <textarea
          id="notes"
          rows={3}
          value={project.notes}
          onChange={update("notes")}
          placeholder="Known constraints, integrations, compliance needs, release timeline…"
          disabled={Boolean(agent.busy)}
        />

        <label htmlFor="projectKey">Jira project key (optional)</label>
        <input
          id="projectKey"
          value={project.projectKey}
          onChange={update("projectKey")}
          placeholder="e.g. KAN — pulls project, epics, and issues"
          disabled={Boolean(agent.busy)}
        />

        <div className="prompt-actions">
          <span className="hint">Draft only — a QA Lead / Test Manager must approve before sign-off.</span>
          <button className="primary-button" type="submit" disabled={!agent.canGenerate}>
            {agent.busy === "strategy" ? "Building strategy…" : "Build strategy"}
          </button>
        </div>
      </form>

      {agent.error && (
        <p className="alert error" role="alert">
          {agent.error}
        </p>
      )}

      <div className="reply-area" aria-live="polite" aria-busy={agent.busy === "strategy"}>
        {agent.busy === "strategy" && (
          <div className="empty-state">
            <span className="spinner" aria-hidden="true" />
            <p>Reading project information and drafting the strategy…</p>
          </div>
        )}

        {!agent.busy && !agent.result && !agent.error && (
          <div className="empty-state">
            <p className="empty-title">No strategy yet</p>
            <p>Add project details or a Jira project key, then build a draft test strategy.</p>
          </div>
        )}

        {agent.result && (
          <>
            <div className="result-meta">
              <div>
                {agent.result.projectKey ? (
                  <a href={agent.result.projectUrl} target="_blank" rel="noreferrer" className="issue-link">
                    {agent.result.projectKey}
                  </a>
                ) : (
                  <span className="badge">Project input only</span>
                )}
                <span className="meta-text">
                  {agent.result.provider} · {agent.result.model}
                  {agent.result.projectKey ? ` · ${agent.result.epicCount} epics · ${agent.result.issueCount} issues` : ""}
                </span>
              </div>
              <div className="meta-actions">
                <button type="button" className="ghost-button" onClick={copyStrategy}>
                  {copied || "Copy"}
                </button>
                <button type="button" className="ghost-button" onClick={downloadStrategy}>
                  Download .md
                </button>
              </div>
            </div>

            {agent.result.warnings?.length > 0 && (
              <ul className="warnings">
                {agent.result.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            )}

            <StrategyOutput markdown={agent.result.strategy} />
          </>
        )}
      </div>
    </section>
  );
}
