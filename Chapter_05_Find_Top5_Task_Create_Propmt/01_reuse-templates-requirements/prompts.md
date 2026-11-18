# Requirement Analysis and Gap Identification — Reusable QA Prompt Templates

**Framework variants:** RICE-POT · CLEAR · CRISP · STAR  
**Usage:** Replace all placeholders (for example `<url>`, `<requirements>`, and `<environment>`) with authorized project values. If information is missing, label it `Unknown` instead of assuming it. Never represent generated output as executed or verified without evidence.

---

**Goal:** Convert a PRD or story into testable requirements and a clear list of questions for the product team.

### 1A. RICE-POT Template

```text
R — Role:
Act as a QA requirement analyst experienced in functional and risk-based testing.

I — Instructions:
1. Read <requirements> and <acceptance_criteria> and <Description> for the module at <url>.
2. Extract testable behaviors, constraints, integrations, and out-of-scope items.
3. Identify ambiguities, contradictions, missing data, and external dependencies.
4. Suggest positive, negative, boundary, and integration scenarios only where supported.
5. Write one specific clarification question per distinct gap.

C — Context:
Application: <url>; module: <module>; environment: <environment>.
Source material: <requirements>; <acceptance_criteria>.

E — Example (format only, not a claimed requirement):
REQ-<id> | <behavior> | <source_reference> | <test_scenario> | <open_question>

P — Parameters:
Do not assume UI fields, messages, URL paths, timeouts, or business rules.
Label each item Specified, Proposed, or Blocked/Unknown. Keep source references exact.

O — Output:
Produce (1) requirement coverage table, (2) candidate scenarios,
(3) numbered gap register with count, severity/risk rationale, and questions.

T — Tonality:
Precise, neutral, audit-friendly, and suitable for a QA review meeting.
```

### 1B. CLEAR Template

```text
C — Context:
Review <requirements> for <module> at <url>. Identify testable rules and missing information.
L — Limits:
First extract stated requirements, then map possible tests, then identify gaps.
E — Example:
Use columns: ID | Requirement | Source | Proposed test | Gap | Clarification owner.
A — Action:
If <acceptance_criteria> or needed rules are absent, mark Unknown and ask focused questions.
R — Review:
Check the output for unsupported assumptions, duplicate gaps, and missing source links.
Return the gap count separately. Do not invent application behavior.
```

### 1C. CRISP Template

```text
C — Context: <module> on <url>; source: <requirements>; environment: <environment>.
R — Role: Act as a QA analyst preparing story refinement.
I — Instruction: Extract testable behaviors; flag ambiguities, missing acceptance criteria,
contradictions, dependencies, and candidate tests.
S — Specificity: Reference source sections. Do not invent behavior, policies, or validation messages.
For each gap include impact, specific question, and affected scenarios.
P — Presentation: Markdown tables titled Requirement Matrix and Gap Register, followed
by the number of distinct gaps and top clarification priorities.
```

### 1D. STAR Template

```text
S — Situation:
The QA team is evaluating <module> at <url> before implementation or testing.
The available source is <requirements> and <acceptance_criteria>.
T — Task:
Make the requirements testable and reveal missing information before test design.
A — Action:
Extract explicit requirements; map to potential scenarios; check conflicting/absent rules;
list exact source references; draft clarification questions.
R — Result:
Provide a coverage matrix and numbered gap register with a total gap count,
showing Verified-from-source versus Proposed versus Unknown. No fabricated answers.
```