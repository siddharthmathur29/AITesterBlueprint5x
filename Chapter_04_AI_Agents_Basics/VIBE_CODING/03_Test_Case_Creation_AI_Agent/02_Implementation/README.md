# Test Case Creator

An AI agent that converts Jira requirements into detailed, traceable, executable **test cases** —
following `../01_plan/TestCase_Template.md`.

This is a **test case** generator. It does not write a project strategy or a story-level test plan
narrative; it produces per-requirement cases with steps, expected results, and traceability.

## Live deployment

**https://test-case-creator-agent.vercel.app**

Secrets live in Vercel project env vars (Production), never in the repo.

## Requirements

- Node.js 20 or newer
- A Jira Cloud site with an API token (optional — pasted requirements work too)
- Groq API key **or** Ollama running locally

## Setup

```sh
cd Chapter_04_AI_Agents_Basics/VIBE_CODING/03_Test_Case_Creation_AI_Agent/02_Implementation
npm install
npm run dev
```

Open <http://localhost:3002> (the other two agents use 3000 and 3001).

Production build:

```sh
npm run build
npm start
```

## Configuration

Secrets stay on the backend. `.env` is loaded from, in order (first file found wins per key):

1. `02_Implementation/.env`
2. `Chapter_04_AI_Agents_Basics/.env`
3. repository root `.env`

```dotenv
JIRA_BASE_URL=https://your-team.atlassian.net
JIRA_EMAIL=you@example.com
JIRA_TOKEN=your-jira-api-token
GROQ_API_KEY=gsk_your-groq-key

# optional
GROQ_MODEL=openai/gpt-oss-120b
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

Legacy names `BASE_URL`, `EMAIL`, `API_TOKEN` are also accepted. Settings entered in the UI override
the environment for that request but are never persisted. The backend never returns or logs secrets.

## How it works

| Step | Endpoint | What happens |
|------|----------|--------------|
| Load config | `GET /api/config` | Reports which credentials exist (booleans, never values) |
| Test Jira | `POST /api/jira/connection` | Calls `/rest/api/3/myself` |
| Load ticket + requirements | `POST /api/jira/issue` | Fetches the issue, converts ADF, extracts numbered requirements |
| Test LLM | `POST /api/llm/connection` | Ollama `/api/tags`; Groq `/openai/v1/models` |
| Generate | `POST /api/testcases` | Builds requirement context, fills the template, returns cases + traceability |

### Requirement extraction and traceability

The backend extracts requirements from the issue description and acceptance-criteria fields and
numbers them `REQ-01`, `REQ-02`, … before calling the model. The prompt requires every case to cite
these exact IDs.

After generation the backend verifies:

- **Coverage** — for each requirement, reads the Section 2 coverage row and checks whether the
  "Test Case IDs" cell actually contains a case ID. A requirement is `cited` only if it maps to a real
  case, not merely because its ID appears somewhere in the document.
- **Invented IDs** — any `REQ-xx` in the output that was never extracted is flagged.
- **Duplicates** — detailed case titles are compared for near-duplicates.
- **Missing sections** — headings are compared against the template, normalizing Unicode dashes.

The UI shows these as trace summary tiles and warnings, so coverage gaps are visible instead of hidden.

## Usage

1. Enter a Jira key (for example `KAN-4`) or paste requirements.
2. Optionally expand **Add approved test plan or strategy as context** and paste those documents.
   They are treated as unverified context, never as confirmed requirements.
3. Select the LLM provider in Settings and test the connection.
4. Select **Generate test cases**.

Results stay **DRAFT** with a `HUMAN REVIEW GATE` and a test case review checklist until a QA owner
approves them.

## Verification performed

Live against the configured Jira site and Groq (`openai/gpt-oss-120b`):

- `GET /api/config` — reports both Jira and Groq credentials present.
- `POST /api/jira/connection` — connected as the configured Atlassian user.
- `POST /api/jira/issue` — `KAN-4` loaded with 8 extracted requirements.
- `POST /api/llm/connection` — Groq key valid; Ollama reachable locally.
- `POST /api/testcases` — 12/12 template sections, 9 detailed cases, 8/8 requirements cited, 0 invented IDs, 0 duplicates.
- Error paths — invalid issue key (`404`), token-per-minute limit (`429` with retry hint), empty input, and duplicate submits blocked.
- UI — headless Chrome end-to-end on the deployed URL: fill input → generate → loading state → 12 sections, 23–25 tables, 200+ rows, trace tiles, review gate.
- `npm run build` + `npm start` — production bundle serves HTML, assets, and API.

## Known limitations

- Groq's **free tier is 8,000 tokens per minute**. A full generation uses most of that window, so
  consecutive runs can hit `413`/`429`; the UI now reports the retry delay. Retry after ~30–60s.
- Jira is read-only; the agent never creates or edits issues.
- Requirement extraction is heuristic (headings such as "Acceptance Criteria", "Scope",
  "User Story", plus bullets). Unstructured descriptions may yield few or no `REQ-xx` entries, in
  which case the model maps cases to "Description" instead.
- Ollama end-to-end generation was not verified (only `gemma3:1b` is pulled; default is `llama3.2`).
- Ollama is unavailable on Vercel (no localhost). Use Groq on the deployment.
- Test cases are drafts and must be reviewed by a QA owner.
