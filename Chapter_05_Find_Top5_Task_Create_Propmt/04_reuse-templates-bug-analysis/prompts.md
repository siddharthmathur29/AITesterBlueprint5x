# Bug Report Generation and Defect Analysis — Reusable QA Prompt Templates

**Framework variants:** RICE-POT · CLEAR · CRISP · STAR  
**Usage:** Replace all placeholders (for example `<url>`, `<requirements>`, and `<environment>`) with authorized project values. If information is missing, label it `Unknown` instead of assuming it. Never represent generated output as executed or verified without evidence.

---

**Goal:** Convert actual observations into reproducible defect reports, and distinguish verified causes from hypotheses.

### 4A. RICE-POT Template

```text
R — Role:
Act as a software QA engineer experienced in defect reporting and triage.

I — Instructions:
1. Read <observed_behavior>, <expected_behavior>, <reproduction_steps>, and <evidence>.
2. Determine whether the evidence establishes a discrepancy with a requirement.
3. Rewrite reproduction steps so another engineer can follow them.
4. Suggest severity/priority with a short rationale, distinguishing the two.
5. List missing data and possible investigation areas, not invented root causes.

C — Context:
Module: <module>; application: <url>; environment: <environment>;
build: <build_version>; evidence: <evidence>; source: <requirements>.

E — Example (structure only):
BUG-<id> | <short_summary> | <steps> | <observed> | <expected> | <evidence_link>

P — Parameters:
Do not invent logs, stack traces, screenshots, occurrence frequency, business
impact, defect IDs, or a confirmed root cause. If the requirement is unavailable,
mark expected behavior Unverified and recommend clarification.

O — Output:
A Jira-ready bug report: Title | Environment | Build | Preconditions |
Steps | Actual | Expected | Evidence | Reproducibility | Proposed severity |
Proposed priority | Open questions. Add hypothesis separately if useful.

T — Tonality:
Objective, concise, neutral, and developer-friendly.
```

### 4B. CLEAR Template

```text
C — Concise:
Draft a reproducible defect report for <module> at <url> from <evidence>.
L — Logical:
Check the requirement, summarize the discrepancy, write numbered steps, and
assess impact only from supplied information.
E — Explicit:
Include environment, build, actual, expected, evidence, reproducibility, severity,
priority, and next questions.
A — Adaptive:
If <expected_behavior> is undocumented or reproduction details are missing, mark
Unverified/Needs clarification; do not fill gaps with invented facts.
R — Reflective:
Check for neutral wording, independently actionable steps, and unsupported root-cause
claims. Clearly label technical hypotheses as hypotheses.
```

### 4C. CRISP Template

```text
C — Context: <url>, <module>, <environment>, <build_version>, <evidence>.
R — Role: Act as a QA defect triage analyst.
I — Instruction: Convert <observed_behavior> and <reproduction_steps> into a concise,
reproducible issue; compare with <expected_behavior> from <requirements>.
S — Specificity: Suggest severity and priority with rationale; never invent evidence,
frequency, reproducibility, logs, or a confirmed cause. State missing inputs.
P — Presentation: Jira-style issue with title, preconditions, steps, actual,
expected, evidence, impact, proposed severity/priority, and open questions.
```

### 4D. STAR Template

```text
S — Situation:
A suspected defect was observed on <module> at <url> in <environment>.
Evidence: <evidence>. Reproduction steps: <reproduction_steps>.
T — Task:
Prepare a complete defect report suitable for engineering review.
A — Action:
Compare <observed_behavior> with <expected_behavior> and <requirements>; write
reproduction steps; propose an impact-based severity; list unknowns and hypotheses.
R — Result:
Return a Jira-ready issue with traceable evidence and clear uncertainty labels.
Do not fabricate observed data or assert a root cause without evidence.
```