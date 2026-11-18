# Test Planning — Reusable QA Prompt Templates

**Frameworks:** RICE-POT · CLEAR · CRISP · STAR  
**Purpose:** Generate a comprehensive, risk-based, review-ready software test plan from approved requirements and requirement analysis outputs.

**Usage:** Replace placeholders such as `<application_url>`, `<module>`, `<requirements>`, `<requirement_analysis>`, and `<environment>` with authorized project information. If information is missing, explicitly mark it as `Unknown`, `Not Provided`, or `Pending Confirmation`. Never invent project decisions, timelines, resources, or execution results.

---

# 1. Objective

Act as a Senior QA Manager / Test Architect responsible for preparing a professional software test plan.

Analyze the approved requirements, acceptance criteria, and requirement analysis results to establish:

- Testing objectives and scope.
- Functional and non-functional testing coverage.
- Test strategy and test approach.
- Test levels and testing types.
- Test environment and test data requirements.
- Resource and responsibility allocation.
- Test execution schedule and dependencies.
- Entry and exit criteria.
- Risk assessment and mitigation.
- Test deliverables and reporting.
- Test completion and sign-off criteria.

The final document must be suitable for review by QA leadership, Product Owners, Business Analysts, Developers, and project stakeholders.

---

# 2. Input Information

Application: `<application_name>`

Application URL: `<application_url>`

Module / Feature: `<module>`

Project / Release: `<release_name>`

Environment: `<environment>`

Requirements / PRD: `<requirements>`

User Story: `<user_story>`

Acceptance Criteria: `<acceptance_criteria>`

Requirement Analysis Output: `<requirement_analysis>`

Approved Clarifications: `<approved_clarifications>`

Existing Test Documentation: `<existing_test_documentation>`

Available Test Tools: `<test_tools>`

Team / Resources: `<team_resources>`

Target Release Date: `<release_date>`

Additional Constraints: `<constraints>`

---

# 3. Framework Instructions

## 3A. RICE-POT Framework

### R — Role

Act as a Senior QA Manager, Test Architect, and Risk-Based Testing Specialist with experience in:

- Functional and integration testing.
- Regression and smoke testing.
- System and end-to-end testing.
- API and UI testing.
- Database validation.
- Cross-browser and compatibility testing.
- Performance, security, and usability testing.
- Agile and release-based testing.
- Manual and automation testing strategies.

Think from the perspective of a QA leader responsible for product quality and release readiness.

### I — Instructions

1. Review all supplied requirements, acceptance criteria, and requirement analysis outputs.
2. Identify the features and modules included in the release.
3. Define testing scope, exclusions, dependencies, and constraints.
4. Identify applicable testing levels and testing types.
5. Define a risk-based testing approach.
6. Determine which scenarios should be automated and which should remain manual.
7. Identify test environment, test data, and infrastructure requirements.
8. Define test execution phases, responsibilities, and dependencies.
9. Establish measurable entry and exit criteria.
10. Identify release risks, mitigation strategies, and unresolved decisions.
11. Prepare a complete test plan using a professional QA documentation structure.

### C — Context

The test plan is being created for `<application_name>`, specifically the `<module>` module.

The plan must be based on the available approved project documentation.

Consider:
- Business objectives.
- User workflows.
- Technical dependencies.
- Integration points.
- Existing functionality that could be affected.
- Release constraints.
- Identified requirement gaps.
- Project-specific quality risks.

Do not treat proposed recommendations as approved project decisions.

### E — Example

Illustrative format only:

| Test Area | Testing Approach | Priority | Coverage | Execution Type |
|---|---|---|---|---|
| Login | Positive and negative authentication | High | Valid and invalid login | Manual + Automation |
| API | Request and response validation | High | Status, schema, authorization | Automation |
| Regression | Existing functionality validation | High | Impacted modules | Manual + Automation |

The example is a formatting reference, not a statement about the actual application.

### P — Parameters

Follow these rules:

1. Do not invent application features, business rules, test environments, or integrations.
2. Separate confirmed information from recommendations.
3. Use `Specified`, `Proposed`, `Unknown`, and `Pending Approval` wherever appropriate.
4. Do not assign actual execution dates without a confirmed schedule.
5. Do not assign team members without supplied resource information.
6. Do not assume automation feasibility without considering application architecture, stability, and tool availability.
7. Do not classify every test as high priority.
8. Use risk-based prioritization based on business impact, likelihood, and technical exposure.
9. Identify dependencies that could block testing.
10. Do not claim tests have been executed, passed, or approved.

### O — Output

Produce a complete Test Plan with the following sections:

1. Document Control
2. Introduction
3. Objective
4. Application and Feature Overview
5. Testing Scope
   - In Scope
   - Out of Scope
6. Test Objectives
7. Test Strategy
8. Test Approach
9. Testing Levels
10. Testing Types
11. Functional Test Coverage
12. Non-Functional Test Coverage
13. Regression Testing Strategy
14. Automation Testing Strategy
15. Test Environment and Infrastructure
16. Test Data Requirements
17. Test Tools and Technologies
18. Roles and Responsibilities
19. Test Execution Approach
20. Test Schedule and Milestones
21. Dependencies and Constraints
22. Risk Assessment and Mitigation
23. Entry Criteria
24. Exit Criteria
25. Defect Reporting and Management
26. Test Deliverables
27. Test Metrics and Reporting
28. Test Closure and Sign-off
29. Assumptions and Open Questions
30. Review and Approval

For each applicable section, include:
- Description.
- Testing approach.
- Responsible role, if known.
- Relevant dependencies.
- Status or confirmation requirement.

### T — Tonality

Professional, precise, structured, risk-focused, and suitable for enterprise QA documentation.

---

## 3B. CLEAR Framework

### C — Context

Create a comprehensive test plan for `<application_name>` and `<module>` using the approved requirements, acceptance criteria, and requirement analysis results.

The plan must explain how the QA team will validate the product against its functional and quality expectations.

### L — Limits

Follow these boundaries:

1. Do not create test scope from unsupported assumptions.
2. Do not add non-functional requirements unless supported by project requirements or clearly identified as recommendations.
3. Do not assume the application architecture or technology stack.
4. Do not invent environments, browsers, devices, integrations, or test data.
5. Do not commit to test dates, estimates, or resource allocations without evidence.
6. Keep testing strategy separate from actual test execution.
7. Preserve all unresolved requirement gaps and their impact on the test plan.
8. Avoid unnecessary testing activities that do not apply to the module.
9. Clearly distinguish mandatory testing from recommended testing.

### E — Example

Use the following format for test strategy:

| Test Type | Objective | Scope | Priority | Approach | Status |
|---|---|---|---|---|---|
| Functional | Validate business requirements | Confirmed features | High | Manual / Automation | Proposed |
| Regression | Identify unintended impact | Impacted modules | High | Manual / Automation | Proposed |
| Performance | Assess response and throughput | If applicable | Unknown | To be confirmed | Pending |

### A — Action

1. Analyze all supplied source documents.
2. Build the test scope and identify exclusions.
3. Map requirements to applicable testing activities.
4. Identify risks, dependencies, and testing constraints.
5. Recommend a suitable test strategy.
6. Define test execution phases and responsibilities.
7. Define entry and exit criteria with measurable conditions wherever evidence permits.
8. Establish test deliverables and reporting metrics.
9. Identify missing information and prepare clarification questions.
10. Generate the complete Markdown test plan.

### R — Review

Before finalizing:

- Verify every in-scope feature has a testing approach.
- Verify testing types are relevant to the application.
- Verify no unsupported requirements have been introduced.
- Verify risks have corresponding mitigation actions.
- Verify entry and exit criteria are measurable.
- Verify dependencies and blockers are documented.
- Verify automation recommendations are justified.
- Verify all known gaps are reflected in the plan.
- Check for duplicate sections and inconsistent terminology.

Return a review summary containing:

- Total requirements reviewed.
- Total requirements covered by the plan.
- Total unresolved gaps.
- Total identified risks.
- Missing project inputs.
- Sections requiring stakeholder approval.
- Overall document readiness: Draft / Needs Clarification / Ready for Review.

---

## 3C. CRISP Framework

### C — Context

Application: `<application_name>`

Module: `<module>`

Release: `<release_name>`

Environment: `<environment>`

Source Documents: `<requirements>`, `<acceptance_criteria>`, `<requirement_analysis>`.

Prepare a test plan that translates approved requirements into a structured testing strategy.

### R — Role

Act as an experienced QA Manager and Test Architect responsible for quality planning, risk management, test coverage, resource planning, and release readiness.

### I — Instruction

Create a comprehensive test plan covering:

- Testing objectives and scope.
- Functional and non-functional validation.
- Test levels and types.
- Risk-based test prioritization.
- Automation and manual testing strategy.
- Test data and environment planning.
- Test execution and defect management.
- Dependencies, assumptions, and constraints.
- Entry and exit criteria.
- Deliverables and sign-off.

### S — Specificity

1. Every test scope item must be traceable to a source requirement, or marked as a recommendation.
2. Identify the applicable testing type for each feature.
3. Provide a reason for high-risk classifications.
4. Define measurable exit criteria wherever possible.
5. Identify test environment and data dependencies.
6. Distinguish between mandatory and optional testing.
7. Include specific clarification questions for missing project inputs.
8. Identify any requirement that cannot be adequately planned due to ambiguity.
9. Do not create fictional timelines or resource allocations.

### P — Presentation

Generate the final output as a professional Markdown document.

Use:

- Clear hierarchical headings.
- Markdown tables for scope, strategy, risks, responsibilities, and schedules.
- Numbered lists for execution phases.
- Unique identifiers for requirements, risks, and deliverables.
- Consistent priority and status terminology.

Include a final Test Plan Review Checklist.

---

## 3D. STAR Framework

### S — Situation

The QA team is preparing to validate `<application_name>` and the `<module>` functionality for `<release_name>`.

The team has received approved requirements, acceptance criteria, and requirement analysis documentation.

A structured test plan is required before detailed test case design and execution.

### T — Task

Develop a comprehensive, risk-based test plan that:

- Defines the testing scope.
- Establishes testing objectives and strategy.
- Identifies required test types and levels.
- Plans test environments and data.
- Identifies resources, dependencies, and risks.
- Defines execution, defect management, and reporting.
- Establishes entry, exit, and sign-off criteria.

### A — Action

1. Review the approved requirements and analysis.
2. Identify in-scope and out-of-scope features.
3. Map requirements to appropriate testing activities.
4. Evaluate functional and non-functional quality risks.
5. Develop the test strategy and execution approach.
6. Recommend manual and automation coverage.
7. Identify missing resources and project dependencies.
8. Establish measurable test completion criteria.
9. Create the complete test plan.
10. Perform an independent quality review of the document.

### R — Result

Deliver a review-ready Test Plan in Markdown format that includes:

- Complete test planning documentation.
- Requirement-to-testing traceability.
- Risk and mitigation register.
- Test strategy and execution approach.
- Test environment and data requirements.
- Entry and exit criteria.
- Test deliverables and sign-off requirements.
- Open questions and pending approvals.
- Final document quality assessment.

The result must represent a planning document, not evidence of completed testing.

---

# 4. Final Quality Gate

Before delivering the document, perform these checks:

| Validation | Expected Result |
|---|---|
| Requirement coverage | All supplied requirements mapped or explicitly excluded |
| Scope | In-scope and out-of-scope clearly defined |
| Test strategy | Relevant testing types justified |
| Risk management | Risks have impact and mitigation |
| Environment | Unknown details explicitly identified |
| Test data | Data requirements documented |
| Automation | Recommendations justified |
| Entry / Exit | Conditions measurable where possible |
| Traceability | Source references preserved |
| Completeness | All required sections present |
| Assumptions | No hidden assumptions |
| Approval | Pending decisions clearly identified |

**Final instruction:** Generate the test plan only after reviewing all available inputs. If essential information is missing, produce the best possible draft, mark the affected sections, and raise clarification questions. Do not silently fill gaps.

**Output filename:** `TEST_PLAN_<MODULE>_<RELEASE>.md`

**Document status:** Draft — Pending QA and stakeholder review.