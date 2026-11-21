import React, { useState } from "react";
import { PlanOutput } from "./PlanOutput.jsx";

export function PlanPanel({ agent }) {
  const [copied, setCopied] = useState("");

  async function copyPlan() {
    if (!agent.result?.plan) return;
    try {
      await navigator.clipboard.writeText(agent.result.plan);
      setCopied("Copied");
    } catch {
      setCopied("Copy failed");
    }
    setTimeout(() => setCopied(""), 1400);
  }

  function downloadPlan() {
    if (!agent.result?.plan) return;
    const name = agent.result.issueKey ? `${agent.result.issueKey}_TestPlan.md` : "TestPlan_Draft.md";
    const blob = new Blob([agent.result.plan], { type: "text/markdown" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = name;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return (
    <section className="panel plan-panel" aria-label="Test plan">
      <div className="panel-head">
        <span className="eyebrow">Main page</span>
        <h1>Reply with Test Plan</h1>
      </div>

      <form
        className="prompt-form"
        onSubmit={(event) => {
          event.preventDefault();
          agent.generate();
        }}
      >
        <label htmlFor="prompt">Prompt (JIRA Ticket)</label>
        <textarea
          id="prompt"
          rows={4}
          value={agent.prompt}
          onChange={(event) => agent.setPrompt(event.target.value)}
          onKeyDown={(event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === "Enter") agent.generate();
          }}
          placeholder="Enter a Jira key such as KAN-4, or paste the ticket description and acceptance criteria…"
        />
        <div className="prompt-actions">
          <span className="hint">Draft only — a QA owner must review before sign-off.</span>
          <button className="primary-button" type="submit" disabled={!agent.canGenerate}>
            {agent.busy === "plan" ? "Generating…" : "Generate plan"}
          </button>
        </div>
      </form>

      {agent.error && (
        <p className="alert error" role="alert">
          {agent.error}
        </p>
      )}

      <div className="reply-area" aria-live="polite" aria-busy={agent.busy === "plan"}>
        {agent.busy === "plan" && (
          <div className="empty-state">
            <span className="spinner" aria-hidden="true" />
            <p>Reading the ticket and drafting the test plan…</p>
          </div>
        )}

        {!agent.busy && !agent.result && !agent.error && (
          <div className="empty-state">
            <p className="empty-title">No plan yet</p>
            <p>Enter a Jira ticket key or paste ticket details, then generate a draft test plan.</p>
          </div>
        )}

        {agent.result && (
          <>
            <div className="result-meta">
              <div>
                {agent.result.issueKey ? (
                  <a href={agent.result.issueUrl} target="_blank" rel="noreferrer" className="issue-link">
                    {agent.result.issueKey}
                  </a>
                ) : (
                  <span className="badge">Pasted text</span>
                )}
                <span className="meta-text">
                  {agent.result.provider} · {agent.result.model}
                  {agent.result.commentCount ? ` · ${agent.result.commentCount} comments` : ""}
                </span>
              </div>
              <div className="meta-actions">
                <button type="button" className="ghost-button" onClick={copyPlan}>
                  {copied || "Copy"}
                </button>
                <button type="button" className="ghost-button" onClick={downloadPlan}>
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

            <PlanOutput markdown={agent.result.plan} />
          </>
        )}
      </div>
    </section>
  );
}
