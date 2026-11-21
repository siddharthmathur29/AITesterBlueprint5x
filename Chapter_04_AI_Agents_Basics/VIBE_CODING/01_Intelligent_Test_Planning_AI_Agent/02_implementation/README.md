# Test Plan Agent

An AI agent that turns a Jira ticket into a structured draft test plan, following the template at
`../01_plan/TestPlan_Template.md`.

Give it a Jira key (for example `KAN-4`) or paste ticket text. The backend reads the ticket from
Jira, sends it to an LLM with the template and strict anti-hallucination rules, and returns a plan
organized section-by-section with a `HUMAN REVIEW GATE` at the end.

## Live deployment

**https://jira-test-plan-agent.vercel.app**

Secrets live in Vercel project env vars (Production), never in the repo.

## Requirements

- Node.js 20 or newer
- A Jira Cloud site with an API token
- Groq API key **or** Ollama running locally

## Setup

```sh
cd Chapter_04_AI_Agents_Basics/VIBE_CODING/01_Intelligent_Test_Planning_AI_Agent/02_implementation
npm install
npm run dev
```

Open <http://localhost:3000>.

Production build:

```sh
npm run build     # writes to ./dist
npm start         # serves the built app on http://localhost:3000
```

## Configuration

Secrets stay on the backend. The server loads `.env` from this order (first file found wins per key):

1. `02_implementation/.env` (local override, gitignored)
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
PORT=3000
```

The older names `BASE_URL`, `EMAIL`, and `API_TOKEN` are also accepted for compatibility.

Anything entered in **Settings** overrides the environment for that request but is never persisted
to disk or browser storage. The backend never returns or logs token values.

> Note: the root `.env` currently holds an expired Jira token (returns 401). The working token is in
> `Chapter_04_AI_Agents_Basics/.env`.

## How it works

| Step | Endpoint | What happens |
|------|----------|--------------|
| Load config | `GET /api/config` | Reports which credentials are present (booleans, never values) |
| Test Jira | `POST /api/jira/connection` | Calls `/rest/api/3/myself` |
| Load ticket | `POST /api/jira/issue` | Fetches the issue, converts ADF to text, pulls acceptance-criteria fields and comments |
| Test LLM | `POST /api/llm/connection` | Ollama: `/api/tags`; Groq: `/openai/v1/models` |
| Generate | `POST /api/plan` | Retrieves the ticket, fills the template, returns Markdown + warnings |

The agent prompt enforces:

- Exact template headings, section order, table columns, and the review gate.
- Missing information is written exactly: `Insufficient information to determine.`
- Proposed activities are prefixed `Proposed:`; every scenario cites an AC, a scope item, or a named gap.
- Ticket text is treated as data, never as instructions.
- Deterministic settings (`temperature: 0`, fixed seed for Ollama) where the provider supports it.

After generation the backend checks the plan for missing template sections and surfaces a warning in
the UI if the model dropped any.

## Verification performed

Live against the configured Jira site and Groq (`openai/gpt-oss-120b`):

- `GET /api/config` — reports both Jira and Groq credentials as present.
- `POST /api/jira/connection` — connected as the configured Atlassian user.
- `POST /api/jira/issue` — `KAN-4` loaded with description, scope, and acceptance-criteria detection.
- `POST /api/llm/connection` — Groq key valid, model available; Ollama reachable locally.
- `POST /api/plan` — real plan generated for `KAN-4`, all 8 template sections + review gate present.
- Error paths — invalid key (`404`), too-short paste, empty prompt (button disabled), duplicate submit blocked.
- UI — headless Chrome end-to-end run: type key → generate → loading state → rendered plan with tables.
- `npm run build` + `npm start` — production bundle serves HTML, assets, and API correctly.

## Deploying to Vercel

The app runs as Express behind five serverless functions under `api/`:

```
api/config.mjs
api/plan.mjs
api/jira/connection.mjs
api/jira/issue.mjs
api/llm/connection.mjs
```

Each wraps the shared Express app via `src/backend/vercel.mjs`. `src/backend/app.mjs` holds the
routes; `src/backend/server.mjs` is the local listener and is not used on Vercel.

Set these env vars in the Vercel project (Production), then deploy:

```sh
vercel env add JIRA_BASE_URL production
vercel env add JIRA_EMAIL production
vercel env add JIRA_TOKEN production
vercel env add GROQ_API_KEY production
vercel env add GROQ_MODEL production   # optional, defaults to openai/gpt-oss-120b
vercel deploy --prod
```

Note: Vercel cannot reach `localhost:11434`, so **Ollama only works when running this app locally**.
Use Groq on the deployment.

The test-plan template is embedded at build time (`scripts/sync-template.mjs` →
`src/backend/template.generated.mjs`) because Vercel only uploads this directory. Re-run
`npm run build` (which runs the sync) to pick up template edits from `../01_plan/`.

## Limitations

- Jira is read-only; the agent never creates or edits issues.
- Authentication-failure, permission-denied, and rate-limit paths are coded and unit-checked by
  response status, but not all were exercised against a live failing account.
- Ollama generation was not run end-to-end (only `gemma3:1b` is pulled; the default model is
  `llama3.2`). Pull it first with `ollama pull llama3.2`.
- Plans are drafts and must be reviewed by a QA owner.
- Ollama is unavailable on the Vercel deployment (no localhost); use it only in local dev.
