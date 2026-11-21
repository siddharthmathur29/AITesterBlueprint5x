import React from "react";
import { createRoot } from "react-dom/client";
import { StrategyPanel } from "./components/StrategyPanel.jsx";
import { SettingsPanel } from "./components/SettingsPanel.jsx";
import { useStrategy } from "./hooks/useStrategy.js";
import "./styles.css";

function App() {
  const agent = useStrategy();

  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Test Strategy Builder home">
          <span className="brand-mark">TS</span>
          <span className="brand-text">
            Test Strategy <b>Builder</b>
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
        <StrategyPanel agent={agent} />
        {agent.settingsOpen && <SettingsPanel agent={agent} />}
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
