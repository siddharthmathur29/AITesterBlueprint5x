import { useCallback, useEffect, useMemo, useState } from "react";

const DEFAULT_JIRA = { baseUrl: "", email: "", token: "" };
const DEFAULT_AI = {
  provider: "groq",
  groqKey: "",
  groqModel: "openai/gpt-oss-120b",
  ollamaUrl: "http://localhost:11434",
  ollamaModel: "llama3.2",
};

async function postJson(path, body) {
  let response;
  try {
    response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("The local backend is unreachable. Is `npm run dev` still running?");
  }
  const text = await response.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Unexpected response from the backend (HTTP ${response.status}).`);
  }
  if (!response.ok) throw new Error(data.error || `Request failed (HTTP ${response.status}).`);
  return data;
}

export function useAgent() {
  const [config, setConfig] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [jira, setJira] = useState(DEFAULT_JIRA);
  const [ai, setAi] = useState(DEFAULT_AI);
  const [jiraStatus, setJiraStatus] = useState({ state: "idle", message: "" });
  const [aiStatus, setAiStatus] = useState({ state: "idle", message: "" });
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch("/api/config")
      .then((response) => response.json())
      .then((data) => {
        setConfig(data);
        setJira((current) => ({ ...current, baseUrl: data.jiraBaseUrl || "", email: data.jiraEmail || "" }));
        setAi((current) => ({
          ...current,
          provider: data.hasGroqKey ? "groq" : "ollama",
          groqModel: data.groqModel || current.groqModel,
          ollamaUrl: data.ollamaUrl || current.ollamaUrl,
          ollamaModel: data.ollamaModel || current.ollamaModel,
        }));
        setJiraStatus({
          state: data.hasJiraToken ? "info" : "idle",
          message: data.hasJiraToken ? "Credentials loaded from .env. Test the connection anytime." : "Add Jira credentials to continue.",
        });
        setAiStatus({
          state: data.hasGroqKey ? "info" : "idle",
          message: data.hasGroqKey ? "Groq key loaded from .env. Test or choose Ollama." : "Select a provider and test it.",
        });
      })
      .catch(() => setError("Could not load server configuration. Is the backend running?"));
  }, []);

  const jiraPayload = useCallback(
    () => ({ jiraBaseUrl: jira.baseUrl, jiraEmail: jira.email, jiraToken: jira.token }),
    [jira],
  );
  const aiPayload = useCallback(
    () => ({
      provider: ai.provider,
      groqApiKey: ai.groqKey,
      groqModel: ai.groqModel,
      ollamaUrl: ai.ollamaUrl,
      ollamaModel: ai.ollamaModel,
    }),
    [ai],
  );

  const testJira = useCallback(async () => {
    setBusy("jira");
    setJiraStatus({ state: "pending", message: "Connecting to Jira…" });
    try {
      const data = await postJson("/api/jira/connection", jiraPayload());
      setJiraStatus({ state: "success", message: data.message });
    } catch (issue) {
      setJiraStatus({ state: "error", message: issue.message });
    } finally {
      setBusy(null);
    }
  }, [jiraPayload]);

  const testAi = useCallback(async () => {
    setBusy("ai");
    setAiStatus({ state: "pending", message: `Connecting to ${ai.provider === "ollama" ? "Ollama" : "Groq"}…` });
    try {
      const data = await postJson("/api/llm/connection", aiPayload());
      setAiStatus({ state: "success", message: data.message });
    } catch (issue) {
      setAiStatus({ state: "error", message: issue.message });
    } finally {
      setBusy(null);
    }
  }, [ai.provider, aiPayload]);

  const generate = useCallback(async () => {
    if (busy) return;
    setBusy("plan");
    setError("");
    setResult(null);
    try {
      const data = await postJson("/api/plan", { ...jiraPayload(), ...aiPayload(), prompt });
      setResult(data);
      setHistory((items) =>
        [{ key: data.issueKey, summary: data.issueSummary, provider: data.provider, model: data.model, at: Date.now() }, ...items].slice(0, 6),
      );
    } catch (issue) {
      setError(issue.message);
    } finally {
      setBusy(null);
    }
  }, [aiPayload, busy, jiraPayload, prompt]);

  const clearResult = useCallback(() => setResult(null), []);

  const canGenerate = useMemo(() => prompt.trim().length > 0 && busy !== "plan", [prompt, busy]);

  return {
    config,
    settingsOpen,
    setSettingsOpen,
    jira,
    setJira,
    ai,
    setAi,
    jiraStatus,
    aiStatus,
    prompt,
    setPrompt,
    busy,
    error,
    setError,
    result,
    history,
    testJira,
    testAi,
    generate,
    clearResult,
    canGenerate,
  };
}
