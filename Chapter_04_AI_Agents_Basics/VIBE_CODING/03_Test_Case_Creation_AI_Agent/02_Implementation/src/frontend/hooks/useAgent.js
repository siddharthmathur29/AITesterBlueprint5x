import { useCallback, useEffect, useMemo, useState } from "react";

const DEFAULT_JIRA = { baseUrl: "", email: "", token: "" };
const DEFAULT_AI = {
  provider: "groq",
  groqKey: "",
  groqModel: "openai/gpt-oss-120b",
  ollamaUrl: "http://localhost:11434",
  ollamaModel: "llama3.2",
};
const DEFAULT_INPUT = { prompt: "", planContext: "", strategyContext: "" };

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
  const [input, setInput] = useState(DEFAULT_INPUT);
  const [showContext, setShowContext] = useState(false);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [requirements, setRequirements] = useState([]);

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
          message: data.hasJiraToken
            ? "Credentials loaded from .env. Test the connection anytime."
            : "Add Jira credentials to retrieve issues.",
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

  const loadIssue = useCallback(async () => {
    const key = input.prompt.trim();
    if (!key) {
      setRequirements([]);
      return;
    }
    try {
      const data = await postJson("/api/jira/issue", { ...jiraPayload(), issueKey: key });
      setRequirements(data.requirements || []);
    } catch {
      setRequirements([]);
    }
  }, [input.prompt, jiraPayload]);

  const generate = useCallback(async () => {
    if (busy) return;
    setBusy("cases");
    setError("");
    setResult(null);
    try {
      const data = await postJson("/api/testcases", { ...jiraPayload(), ...aiPayload(), ...input });
      setResult(data);
      if (data.requirements?.length) setRequirements(data.requirements);
    } catch (issue) {
      setError(issue.message);
    } finally {
      setBusy(null);
    }
  }, [aiPayload, busy, input, jiraPayload]);

  const updateInput = useCallback(
    (name) => (event) => setInput((current) => ({ ...current, [name]: event.target.value })),
    [],
  );

  const canGenerate = useMemo(() => input.prompt.trim().length > 0 && busy !== "cases", [input.prompt, busy]);

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
    input,
    updateInput,
    showContext,
    setShowContext,
    requirements,
    loadIssue,
    busy,
    error,
    setError,
    result,
    testJira,
    testAi,
    generate,
    canGenerate,
  };
}
