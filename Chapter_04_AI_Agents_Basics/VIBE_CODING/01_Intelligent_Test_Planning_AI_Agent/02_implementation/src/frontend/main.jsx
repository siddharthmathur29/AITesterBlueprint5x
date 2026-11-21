import React from "react";
import { createRoot } from "react-dom/client";
import { PlanPanel } from "./components/PlanPanel.jsx";
import { SettingsPanel } from "./components/SettingsPanel.jsx";
import { useAgent } from "./hooks/useAgent.js";
import "./styles.css";

function App() {
  const agent = useAgent();

  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Test Plan Agent home">
          <span className="brand-mark">TP</span>
          <span className="brand-text">
            Test Plan <b>Agent</b>
          </span>
        </a>
        <button
          className="ghost-button"
          type="button"
          aria-expanded={agent.settingsOpen}
          aria-controls="settings-panel"
          onClick={() => agent.setSettingsOpen((open) => !open)}
        >
          {agent.settingsOpen ? "Hide settings" : "Settings"}
        </button>
      </header>

      <div className={`layout ${agent.settingsOpen ? "" : "wide"}`}>
        <PlanPanel agent={agent} />
        {agent.settingsOpen && <SettingsPanel agent={agent} />}
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
