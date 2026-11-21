import { ServiceError } from "./jira.mjs";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);
const GROQ_HOST = "api.groq.com";
const GROQ_PATH = "/openai/v1/chat/completions";
const GROQ_MODELS_PATH = "/openai/v1/models";
const TIMEOUT_MS = 120_000;

function providerName(ai) {
  return ai.provider === "ollama" ? "Ollama" : "Groq";
}

function ollamaBaseUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new ServiceError("Enter a valid Ollama URL, for example http://localhost:11434.");
  }
  if (!["http:", "https:"].includes(url.protocol)) throw new ServiceError("The Ollama URL must use http or https.");
  if (url.username || url.password) throw new ServiceError("The Ollama URL must not contain credentials.");
  if (!LOCAL_HOSTS.has(url.hostname)) {
    throw new ServiceError("Ollama connections are limited to localhost for this agent.");
  }
  return url;
}

async function groqGet(ai, path) {
  if (!ai.groqKey) {
    throw new ServiceError("Groq is not configured. Enter a Groq API key in Settings or set GROQ_API_KEY in .env.");
  }
  let response;
  try {
    response = await fetch(`https://${GROQ_HOST}${path}`, {
      headers: { Authorization: `Bearer ${ai.groqKey}`, Accept: "application/json" },
      signal: AbortSignal.timeout(20_000),
    });
  } catch (error) {
    throw new ServiceError(`Could not reach Groq: ${error.message}`, 502);
  }
  if (response.status === 401) throw new ServiceError("Groq rejected the API key.", 401);
  if (!response.ok) throw new ServiceError(`Groq returned HTTP ${response.status}.`, 502);
  return response.json();
}

export async function testLlmConnection(ai) {
  if (ai.provider === "ollama") {
    const base = ollamaBaseUrl(ai.ollamaUrl);
    let response;
    try {
      response = await fetch(new URL("/api/tags", base), { signal: AbortSignal.timeout(8_000) });
    } catch {
      throw new ServiceError(
        "Ollama is not reachable. Start it locally (ollama serve) and make sure the model is pulled.",
        502,
      );
    }
    if (!response.ok) throw new ServiceError(`Ollama returned HTTP ${response.status}.`, 502);
    const data = await response.json();
    const models = (data.models || []).map((model) => model.name);
    if (models.length === 0) return "Ollama is running, but no models are installed. Run: ollama pull llama3.2";
    const hasModel = models.some((name) => name === ai.ollamaModel || name.startsWith(`${ai.ollamaModel}:`));
    return hasModel
      ? `Ollama is running and ${ai.ollamaModel} is available.`
      : `Ollama is running. ${ai.ollamaModel} is not installed yet — run: ollama pull ${ai.ollamaModel}`;
  }

  const data = await groqGet(ai, GROQ_MODELS_PATH);
  const models = (data.data || []).map((model) => model.id);
  const hasModel = models.includes(ai.groqModel);
  return hasModel
    ? `Connected to Groq. ${ai.groqModel} is available.`
    : `Connected to Groq, but ${ai.groqModel} is not in your model list. Pick another model.`;
}

export async function callModel(ai, { system, user, temperature = 0 }) {
  if (ai.provider === "ollama") {
    const base = ollamaBaseUrl(ai.ollamaUrl);
    const url = new URL("/api/chat", base);
    let response;
    try {
      response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: ai.ollamaModel,
          stream: false,
          options: { temperature, seed: 42 },
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (error) {
      throw new ServiceError(`Ollama is unreachable: ${error.message}`, 502);
    }
    if (response.status === 404) {
      throw new ServiceError(`Ollama does not have the model "${ai.ollamaModel}". Run: ollama pull ${ai.ollamaModel}`, 502);
    }
    if (!response.ok) throw new ServiceError(`Ollama returned HTTP ${response.status}.`, 502);
    const data = await response.json();
    const content = data.message?.content?.trim();
    if (!content) throw new ServiceError("Ollama returned an empty response.", 502);
    return content;
  }

  if (!ai.groqKey) {
    throw new ServiceError("Groq is not configured. Enter a Groq API key in Settings or set GROQ_API_KEY in .env.");
  }
  let response;
  try {
    response = await fetch(`https://${GROQ_HOST}${GROQ_PATH}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ai.groqKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        model: ai.groqModel,
        temperature,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    throw new ServiceError(`Groq is unreachable: ${error.message}`, 502);
  }
  if (response.status === 401) throw new ServiceError("Groq rejected the API key. Check it in Settings.", 401);
  if (response.status === 429) throw new ServiceError("Groq rate limit hit. Wait a moment and try again.", 429);
  if (!response.ok) {
    const detail = (await response.text()).slice(0, 300);
    throw new ServiceError(`Groq returned HTTP ${response.status}${detail ? `: ${detail}` : "."}`, 502);
  }
  const data = await response.json();
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) throw new ServiceError("Groq returned an empty response.", 502);
  return content;
}

export { providerName };
