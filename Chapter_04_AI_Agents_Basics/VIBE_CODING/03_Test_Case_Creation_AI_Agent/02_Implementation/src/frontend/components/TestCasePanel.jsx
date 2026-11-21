import React, { useState } from "react";
import { CaseOutput } from "./CaseOutput.jsx";

export function TestCasePanel({ agent }) {
  const [copied, setCopied] = useState("");

  async function copyCases() {
    if (!agent.result?.testCases) return;
    try {
      await navigator.clipboard.writeText(agent.result.testCases);
      setCopied("Copied");
    } catch {
      setCopied("Copy failed");
    }
    setTimeout(() => setCopied(""), 1400);
  }

  function downloadCases() {
    if (!agent.result?.testCases) return;
    const name = agent.result.issueKey ? `${agent.result.issueKey}_TestCases.md` : "TestCases_Draft.md";
    const blob = new Blob([agent.result.testCases], { type: "text/markdown" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = name;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  const trace = agent.result?.traceability;

  return (
    <section className="panel cases-panel" aria-label="Test cases">
      <div className="panel-head">
        <span className="eyebrow">Main page</span>
        <h1>Reply with Test Case</h1>
        <p className="subhead">
          Enter a Jira ticket or paste requirements. Each case is traced to the requirement it verifies.
        </p>
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
          value={agent.input.prompt}
          onChange={agent.updateInput("prompt")}
          onKeyDown={(event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === "Enter") agent.generate();
          }}
          placeholder="Enter a Jira key such as KAN-4, or paste the requirements and acceptance criteria…"
          disabled={Boolean(agent.busy)}
        />

        <button
          type="button"
          className="link-toggle"
          aria-expanded={agent.showContext}
          onClick={() => agent.setShowContext((open) => !open)}
        >
          {agent.showContext ? "− Hide approved plan / strategy context" : "+ Add approved test plan or strategy as context (optional)"}
        </button>

        {agent.showContext && (
          <div className="context-fields">
            <label htmlFor="planContext">Approved Test Plan (optional)</label>
            <textarea
              id="planContext"
              rows={3}
              value={agent.input.planContext}
              onChange={agent.updateInput("planContext")}
              placeholder="Paste the approved test plan to align scenarios. Treated as context, not confirmed requirements."
              disabled={Boolean(agent.busy)}
            />
            <label htmlFor="strategyContext">Approved Test Strategy (optional)</label>
            <textarea
              id="strategyContext"
              rows={3}
              value={agent.input.strategyContext}
              onChange={agent.updateInput("strategyContext")}
              placeholder="Paste the approved strategy for scope and tooling context."
              disabled={Boolean(agent.busy)}
            />
          </div>
        )}

        {agent.requirements.length > 0 && (
          <div className="req-preview">
            <strong>{agent.requirements.length} requirements detected</strong>
            <ul>
              {agent.requirements.slice(0, 5).map((requirement) => (
                <li key={requirement.id}>
                  <code>{requirement.id}</code> {requirement.text.slice(0, 110)}
                  {requirement.text.length > 110 ? "…" : ""}
                </li>
              ))}
            </ul>
            {agent.requirements.length > 5 && <span>+{agent.requirements.length - 5} more</span>}
          </div>
        )}

        <div className="prompt-actions">
          <span className="hint">Draft only — a QA owner must review before execution.</span>
          <button className="primary-button" type="submit" disabled={!agent.canGenerate}>
            {agent.busy === "cases" ? "Generating…" : "Generate test cases"}
          </button>
        </div>
      </form>

      {agent.error && (
        <p className="alert error" role="alert">
          {agent.error}
        </p>
      )}

      <div className="reply-area" aria-live="polite" aria-busy={agent.busy === "cases"}>
        {agent.busy === "cases" && (
          <div className="empty-state">
            <span className="spinner" aria-hidden="true" />
            <p>Reading requirements and designing test cases…</p>
          </div>
        )}

        {!agent.busy && !agent.result && !agent.error && (
          <div className="empty-state">
            <p className="empty-title">No test cases yet</p>
            <p>Enter a Jira issue key or paste requirements, then generate a draft set of test cases.</p>
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
                  <span className="badge">Pasted input</span>
                )}
                <span className="meta-text">
                  {agent.result.provider} · {agent.result.model} · {agent.result.testCaseCount} test cases
                  {agent.result.requirements?.length ? ` · ${agent.result.requirements.length} requirements` : ""}
                </span>
              </div>
              <div className="meta-actions">
                <button type="button" className="ghost-button" onClick={copyCases}>
                  {copied || "Copy"}
                </button>
                <button type="button" className="ghost-button" onClick={downloadCases}>
                  Download .md
                </button>
              </div>
            </div>

            {trace && agent.result.requirements?.length > 0 && (
              <div className="trace-summary">
                <div className="trace-item success">
                  <strong>{trace.cited.length}</strong>
                  <span>requirements cited</span>
                </div>
                <div className={`trace-item ${trace.uncited.length ? "warn" : ""}`}>
                  <strong>{trace.uncited.length}</strong>
                  <span>not cited</span>
                </div>
                <div className={`trace-item ${agent.result.duplicates.count ? "warn" : ""}`}>
                  <strong>{agent.result.duplicates.count}</strong>
                  <span>detailed cases</span>
                </div>
                {trace.unknownCitations.length > 0 && (
                  <div className="trace-item error">
                    <strong>{trace.unknownCitations.length}</strong>
                    <span>invented IDs</span>
                  </div>
                )}
              </div>
            )}

            {agent.result.warnings?.length > 0 && (
              <ul className="warnings">
                {agent.result.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            )}

            <CaseOutput markdown={agent.result.testCases} />
          </>
        )}
      </div>
    </section>
  );
}
