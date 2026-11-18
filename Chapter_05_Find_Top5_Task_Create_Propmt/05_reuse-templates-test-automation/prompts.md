# UI Test Automation Script Creation / Review — Reusable QA Prompt Templates

**Framework variants:** RICE-POT · CLEAR · CRISP · STAR  
**Usage:** Replace all placeholders (for example `<url>`, `<requirements>`, and `<environment>`) with authorized project values. If information is missing, label it `Unknown` instead of assuming it. Never represent generated output as executed or verified without evidence.

---

**Goal:** Create or improve maintainable UI automation while respecting existing framework conventions. Use Selenium/Java or Playwright/TypeScript according to supplied project context; do not pretend both are already implemented.

### 3A. RICE-POT Template

```text
R — Role:
Act as a UI automation engineer specializing in <framework> and <language>.

I — Instructions:
1. Review <test_cases>, <existing_code>, and <project_structure>.
2. Identify reusable page objects/components, locators, setup, fixtures, and assertions.
3. Produce or revise code for <module> at <url> using project conventions.
4. Avoid sleeps, duplicate locators, brittle selectors, and hidden dependencies.
5. Include commands to run and a short code-review checklist.

C — Context:
Framework: <framework>; language: <language>; app: <url>;
environment: <environment>; project structure: <project_structure>;
verified locators/DOM evidence: <ui_evidence>.

E — Example (format only):
Test: <scenario_name> -> Page method: <action> -> Assertion: <documented_outcome>

P — Parameters:
Use only confirmed locators and behavior. If DOM or config is absent, use explicit
TODO placeholders and ask for evidence; don't invent selectors or credentials.
Prefer robust waits and independent tests. Keep secrets in approved environment config.

O — Output:
(1) File tree/changed files, (2) complete code blocks per file,
(3) commands and prerequisites, (4) assumptions/TODOs, (5) review checklist.

T — Tonality:
Practical, precise, maintainable, and review-ready.
```

### 3B. CLEAR Template

```text
C — Concise:
Implement or review <test_cases> for <url> using <framework>/<language>.
L — Logical:
Inspect <project_structure>, map scenarios to page methods, implement assertions,
then describe how to run and troubleshoot.
E — Explicit:
Follow <coding_standards>; prefer reusable locators and proper waits; output full
changed files and exact run commands.
A — Adaptive:
If selectors, dependencies, or expected results are absent, write TODOs and request
<ui_evidence> rather than guessing.
R — Reflective:
Review the code for flaky waits, hardcoded secrets, poor isolation, and unsupported
assertions. State clearly that generated code has not been executed.
```

### 3C. CRISP Template

```text
C — Context: <url>, <module>, <test_cases>, <existing_code>, <project_structure>.
R — Role: Act as a code-review-focused <framework>/<language> automation engineer.
I — Instruction: Generate/refactor maintainable test and page-object code for the
supplied scenarios, with fixtures and assertions consistent with the project.
S — Specificity: No hardcoded credentials, guessed locators, fixed delays, or invented
page flows. Flag unknown DOM/config inputs as TODOs. Respect <coding_standards>.
P — Presentation: File paths and complete code blocks, followed by run commands,
verification steps, and a list of missing inputs. Do not claim a successful run.
```

### 3D. STAR Template

```text
S — Situation:
The team needs stable UI automation for <module> at <url>. Existing framework:
<framework> / <language>; starter code: <existing_code>.
T — Task:
Implement or improve <test_cases> without increasing flakiness.
A — Action:
Review <project_structure> and <ui_evidence>, choose verified locators, implement
page methods and independent tests, avoid arbitrary sleeps, add documented assertions.
R — Result:
Provide proposed files, code, run commands, assumptions, and a review checklist.
Mark unresolved locators/flows explicitly; generated tests are not reported as passed.
```