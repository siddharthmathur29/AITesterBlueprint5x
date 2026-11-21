import React from "react";

function Status({ status }) {
  if (!status?.message) return null;
  return <p className={`status ${status.state}`} role="status">{status.message}</p>;
}

export function SettingsPanel({ agent }) {
  const { jira, setJira, ai, setAi, jiraStatus, aiStatus, busy, config, testJira, testAi } = agent;
  const disabled = Boolean(busy);

  return (
    <aside className="panel settings-panel" id="settings-panel" aria-label="Settings">
      <div className="panel-head">
        <span className="eyebrow">Settings</span>
        <h2>Connections</h2>
      </div>

      <section className="card">
        <h3>JIRA Connection</h3>
        <label htmlFor="jira-url">URL</label>
        <input
          id="jira-url"
          type="url"
          value={jira.baseUrl}
          disabled={disabled}
          onChange={(event) => setJira({ ...jira, baseUrl: event.target.value })}
          placeholder="https://your-team.atlassian.net"
        />
        <label htmlFor="jira-email">Email</label>
        <input
          id="jira-email"
          type="email"
          autoComplete="username"
          value={jira.email}
          disabled={disabled}
          onChange={(event) => setJira({ ...jira, email: event.target.value })}
          placeholder="you@company.com"
        />
        <label htmlFor="jira-token">Token</label>
        <input
          id="jira-token"
          type="password"
          autoComplete="new-password"
          value={jira.token}
          disabled={disabled}
          onChange={(event) => setJira({ ...jira, token: event.target.value })}
          placeholder={config?.hasJiraToken ? "Loaded from .env — leave blank to use it" : "Jira API token"}
        />
        <button className="secondary-button" type="button" onClick={testJira} disabled={disabled}>
          {busy === "jira" ? "Testing…" : "Test Connection"}
        </button>
        <Status status={jiraStatus} />
      </section>

      <section className="card">
        <h3>LLM Configuration</h3>

        <div className="provider-row" role="group" aria-label="LLM provider">
          <button
            type="button"
            className={`provider-chip ${ai.provider === "ollama" ? "active" : ""}`}
            aria-pressed={ai.provider === "ollama"}
            disabled={disabled}
            onClick={() => setAi({ ...ai, provider: "ollama" })}
          >
            1. Ollama Connection
          </button>
          <button
            type="button"
            className={`provider-chip ${ai.provider === "groq" ? "active" : ""}`}
            aria-pressed={ai.provider === "groq"}
            disabled={disabled}
            onClick={() => setAi({ ...ai, provider: "groq" })}
          >
            2. Groq.com (api key)
          </button>
        </div>

        {ai.provider === "ollama" ? (
          <>
            <label htmlFor="ollama-url">Ollama URL</label>
            <input
              id="ollama-url"
              type="url"
              value={ai.ollamaUrl}
              disabled={disabled}
              onChange={(event) => setAi({ ...ai, ollamaUrl: event.target.value })}
              placeholder="http://localhost:11434"
            />
            <label htmlFor="ollama-model">Model</label>
            <input
              id="ollama-model"
              value={ai.ollamaModel}
              disabled={disabled}
              onChange={(event) => setAi({ ...ai, ollamaModel: event.target.value })}
              placeholder="llama3.2"
            />
          </>
        ) : (
          <>
            <label htmlFor="groq-key">Groq API key</label>
            <input
              id="groq-key"
              type="password"
              autoComplete="new-password"
              value={ai.groqKey}
              disabled={disabled}
              onChange={(event) => setAi({ ...ai, groqKey: event.target.value })}
              placeholder={config?.hasGroqKey ? "Loaded from .env — leave blank to use it" : "gsk_…"}
            />
            <label htmlFor="groq-model">Model</label>
            <input
              id="groq-model"
              value={ai.groqModel}
              disabled={disabled}
              onChange={(event) => setAi({ ...ai, groqModel: event.target.value })}
              placeholder="openai/gpt-oss-120b"
            />
          </>
        )}

        <button className="secondary-button" type="button" onClick={testAi} disabled={disabled}>
          {busy === "ai" ? "Testing…" : ai.provider === "ollama" ? "Test Local LLM" : "Test Groq.com"}
        </button>
        <Status status={aiStatus} />
        <p className="privacy-note">
          {ai.provider === "ollama"
            ? "Ollama runs on this machine; ticket data never leaves your computer."
            : "Groq receives the ticket text to draft the plan. Secrets stay on the backend."}
        </p>
      </section>
    </aside>
  );
}
