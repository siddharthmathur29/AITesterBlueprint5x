# Test Case Creation — Reusable QA Prompt Templates

**Frameworks:** RICE-POT · CLEAR · CRISP · STAR  
**Purpose:** Generate comprehensive, atomic, traceable, review-ready manual test cases from approved requirements, acceptance criteria, and test planning documentation.

**Usage:** Replace placeholders such as `<application_url>`, `<module>`, `<requirements>`, `<test_plan>`, and `<environment>` with authorized project information.

If information is missing, label it `Unknown`, `Not Specified`, or `Pending Clarification`. Never invent expected results or present generated test cases as executed.

---

# 1. Objective

Act as a Senior QA Engineer / Test Lead responsible for designing high-quality test cases.

Analyze the supplied requirements, acceptance criteria, requirement analysis, and approved test plan.

Generate detailed test cases that validate:

- Functional requirements.
- Positive user journeys.
- Negative scenarios.
- Boundary and edge cases.
- Field-level validations.
- Business rules and workflows.
- Integration behavior.
- API and database validations, where applicable.
- Error handling and recovery.
- Regression scenarios.
- Relevant non-functional requirements.

Every test case must be independently understandable, reproducible, and executable by another QA engineer without needing undocumented assumptions.

---

# 2. Input Information

Application: `<application_name>`

Application URL: `<application_url>`

Module / Feature: `<module>`

Release: `<release_name>`

Environment: `<environment>`

Requirements / PRD: `<requirements>`

User Story: `<user_story>`

Acceptance Criteria: `<acceptance_criteria>`

Requirement Analysis Output: `<requirement_analysis>`

Approved Clarifications: `<approved_clarifications>`

Approved Test Plan: `<test_plan>`

Existing Test Cases: `<existing_test_cases>`

API Documentation: `<api_documentation>`

Database Details: `<database_details>`

Available Test Data: `<test_data>`

Additional Constraints: `<constraints>`

---

# 3. Framework Instructions

## 3A. RICE-POT Framework

### R — Role

Act as a Senior QA Engineer, Test Designer, and Test Automation Specialist with expertise in:

- Functional testing.
- Negative and positive testing.
- Boundary Value Analysis.
- Equivalence Partitioning.
- Decision Table Testing.
- State Transition Testing.
- Exploratory testing.
- Integration testing.
- API testing.
- Database validation.
- Regression testing.
- End-to-end testing.
- Risk-based testing.
- Manual and automation test design.

Think like an experienced tester who must identify defects before production deployment.

### I — Instructions

1. Review the supplied requirements and approved acceptance criteria.
2. Review the requirement analysis and approved gap clarifications.
3. Review the test plan and identify the applicable test scope.
4. Break down requirements into independently testable conditions.
5. Identify positive, negative, boundary, and edge-case scenarios.
6. Identify applicable test design techniques.
7. Create unique test case IDs.
8. Provide detailed preconditions and test data.
9. Write clear, sequential execution steps.
10. Define specific, observable expected results for each step.
11. Map every test case to its originating requirement or acceptance criterion.
12. Assign appropriate priority and test type.
13. Identify automation suitability without assuming all tests should be automated.
14. Identify duplicate, overlapping, and missing scenarios.
15. Perform an independent review before presenting the final test cases.

### C — Context

The test cases are being created for:

Application: `<application_name>`

Module: `<module>`

URL: `<application_url>`

Environment: `<environment>`

Requirements: `<requirements>`

Approved Test Plan: `<test_plan>`

The objective is to achieve sufficient functional and risk-based test coverage without creating redundant or unsupported test cases.

Consider:

- User roles and permissions.
- Valid and invalid inputs.
- Business rules.
- Data dependencies.
- Workflow transitions.
- Integration behavior.
- Error conditions.
- Existing functionality and regression impact.

### E — Example

Illustrative example only:

**TC-LOGIN-001 — Verify login with valid credentials**

| Field | Details |
|---|---|
| Test Case ID | TC-LOGIN-001 |
| Requirement ID | REQ-LOGIN-001 |
| Title | Verify login with valid credentials |
| Test Type | Functional / Positive |
| Priority | High |
| Preconditions | User account exists and is active |
| Test Data | Valid username and password |
| Step 1 | Navigate to the login page |
| Expected Result 1 | Login page is displayed |
| Step 2 | Enter valid credentials |
| Expected Result 2 | Credentials are accepted |
| Step 3 | Select the login action |
| Expected Result 3 | User is authenticated and redirected to the specified destination |
| Automation Suitability | Candidate for automation |
| Status | Not Executed |

The example demonstrates formatting only. Do not assume the actual application has these specific behaviors unless confirmed by the source requirements.

### P — Parameters

Follow these mandatory rules:

1. Never invent UI elements, field names, buttons, error messages, or navigation paths.
2. Never create expected results that are unsupported by requirements or approved clarification.
3. Mark missing expected results as `Pending Clarification`.
4. Every test case must have a unique ID.
5. Every test case must map to a requirement or an explicitly identified risk-based recommendation.
6. Each test case should validate one primary objective.
7. Avoid combining unrelated scenarios into a single test case.
8. Use separate test cases for materially different positive and negative conditions.
9. Include boundary testing only when valid boundaries or applicable rules are known.
10. Use realistic and controlled test data.
11. Do not use production credentials or sensitive production data.
12. Clearly identify dependent test data and account prerequisites.
13. Do not mark a test case as Passed or Failed during test design.
14. Use `Not Executed` as the default execution status.
15. Do not force automation for scenarios that require human judgment or are unsuitable for stable automation.
16. Do not duplicate existing test cases unless an explicit modification or additional coverage is needed.

### O — Output

Generate the test cases using the following structure.

#### A. Test Case Summary

| Metric | Count |
|---|---:|
| Total requirements reviewed | |
| Total requirements covered | |
| Total test scenarios identified | |
| Total test cases created | |
| Positive test cases | |
| Negative test cases | |
| Boundary / Edge test cases | |
| Integration test cases | |
| Regression test cases | |
| High-priority test cases | |
| Automation candidates | |
| Pending clarification scenarios | |

#### B. Detailed Test Case Repository

For every test case, provide:

| Field | Description |
|---|---|
| Test Case ID | Unique identifier |
| Requirement ID | Source requirement reference |
| Acceptance Criteria ID | Applicable AC reference |
| Test Scenario ID | Parent scenario reference |
| Test Case Title | Clear objective |
| Module | Application module |
| Test Type | Functional / Negative / Boundary / Integration / Regression / Other |
| Priority | Critical / High / Medium / Low |
| Preconditions | Conditions required before execution |
| Test Data | Specific input data or data requirements |
| Execution Steps | Sequential and numbered |
| Expected Results | Observable result for each step |
| Postconditions | Expected state after execution |
| Automation Suitability | Yes / No / Conditional / To Be Evaluated |
| Automation Rationale | Reason for classification |
| Execution Status | Not Executed |
| Remarks | Dependencies or clarification notes |

For multi-step test cases, use this structure:

| Step No. | Action / Test Steps | Test Data | Expected Result |
|---|---|---|---|
| 1 | First action | Input data | Expected observable outcome |
| 2 | Second action | Input data | Expected observable outcome |
| 3 | Third action | Input data | Expected observable outcome |

Expected results must be provided for every step wherever an outcome can be specified from the source material.

#### C. Test Scenario Coverage

Group test scenarios by:

1. Positive scenarios.
2. Negative scenarios.
3. Boundary Value Analysis.
4. Equivalence Partitioning.
5. Decision Table Testing.
6. State Transition Testing.
7. Integration scenarios.
8. Error handling and recovery.
9. Regression scenarios.
10. Security and authorization scenarios, where applicable.

Do not force every test design technique into every module. Use only relevant techniques.

#### D. Requirement Traceability Matrix

| Requirement ID | Requirement Description | Test Case IDs | Coverage Status | Remarks |
|---|---|---|---|---|
| REQ-001 | Source requirement | TC-001, TC-002 | Covered | |
| REQ-002 | Source requirement | TC-003 | Partial | |
| REQ-003 | Source requirement | | Not Covered | Clarification required |

Coverage classifications:

- Covered.
- Partially Covered.
- Not Covered.
- Blocked / Unknown.
- Not Applicable, with justification.

#### E. Test Data Matrix

| Data ID | Data Description | Input / Value | Expected Classification | Related Test Cases |
|---|---|---|---|---|
| TD-001 | Valid data | Confirmed value | Positive | TC-001 |
| TD-002 | Invalid data | Confirmed or proposed value | Negative | TC-002 |

Clearly distinguish confirmed test data from proposed test data.

#### F. Test Case Gap Register

Identify:

- Requirements without test coverage.
- Acceptance criteria without clear expected outcomes.
- Missing preconditions.
- Missing test data.
- Unclear validation rules.
- Missing error-handling requirements.
- Unspecified integration behavior.
- Unresolved dependencies.

For each gap provide:

| Gap ID | Description | Impact | Related Requirement | Clarification Question | Priority |
|---|---|---|---|---|---|

#### G. Automation Recommendation

Classify test cases as:

- Automation Candidate.
- Manual Only.
- Conditional Automation.
- Requires Further Evaluation.

Provide the rationale for each classification.

Consider:
- Execution frequency.
- Stability of functionality.
- Reusability.
- Data setup complexity.
- Maintenance overhead.
- Business criticality.
- Human judgment requirements.

Do not recommend automating everything.

### T — Tonality

Precise, technical, unambiguous, structured, and suitable for enterprise-level QA test repositories.

---

## 3B. CLEAR Framework

### C — Context

Create a complete test case repository for `<application_name>` and `<module>`.

Use the approved requirements, acceptance criteria, requirement analysis, and test plan.

The objective is to convert documented requirements into executable test cases that provide meaningful functional and risk-based coverage.

### L — Limits

1. Do not invent application behavior.
2. Do not assume unspecified validation rules.
3. Do not create unsupported error messages.
4. Do not assume field lengths, character restrictions, or numerical boundaries.
5. Do not create duplicate test cases.
6. Do not combine unrelated business conditions.
7. Do not omit negative scenarios when the requirements support them.
8. Do not create false expected results.
9. Do not classify test cases as executed.
10. Do not treat proposed scenarios as confirmed requirements.
11. Do not use actual sensitive production information in test data.
12. Do not create arbitrary test case quantities to meet a target.

### E — Example

Illustrative format:

**Requirement:** A user can access the application using an approved authentication method.

Candidate scenarios:

| Scenario ID | Scenario | Category |
|---|---|---|
| TS-001 | Verify successful authentication | Positive |
| TS-002 | Verify invalid authentication handling | Negative |
| TS-003 | Verify behavior for an inactive account | Negative |
| TS-004 | Verify behavior when required input is missing | Negative |
| TS-005 | Verify session behavior | Conditional |

These scenarios are examples only. Generate actual scenarios based on the supplied requirements.

### A — Action

1. Review the requirement analysis.
2. Review the approved test plan.
3. Identify testable requirements and acceptance criteria.
4. Decompose requirements into test scenarios.
5. Identify applicable test design techniques.
6. Generate detailed test cases.
7. Add preconditions, data, execution steps, and expected results.
8. Assign unique IDs, priority, and test types.
9. Establish requirement traceability.
10. Review coverage and identify missing cases.
11. Identify automation candidates.
12. Generate the final Markdown test case repository.

### R — Review

Perform the following quality checks:

- Is each test case linked to a requirement?
- Does each test case have a clear objective?
- Are the execution steps reproducible?
- Are expected results observable and unambiguous?
- Are negative scenarios included where relevant?
- Are boundary conditions supported by documented rules?
- Is test data realistic and sufficient?
- Are preconditions clearly documented?
- Are duplicate test cases eliminated?
- Are all acceptance criteria covered?
- Are missing expected results flagged?
- Are automation recommendations justified?
- Are test case IDs unique?
- Is execution status correctly set to Not Executed?

Return a Test Case Quality Summary containing:

- Total test cases generated.
- Total requirements covered.
- Total uncovered requirements.
- Total duplicate candidates identified.
- Total pending clarification items.
- Total automation candidates.
- Total manual-only scenarios.
- Overall readiness: Draft / Needs Clarification / Ready for Review.

---

## 3C. CRISP Framework

### C — Context

Application: `<application_name>`

Module: `<module>`

URL: `<application_url>`

Environment: `<environment>`

Requirements: `<requirements>`

Acceptance Criteria: `<acceptance_criteria>`

Requirement Analysis: `<requirement_analysis>`

Test Plan: `<test_plan>`

Generate detailed, traceable, execution-ready test cases.

### R — Role

Act as a Senior QA Engineer and Test Design Specialist responsible for functional coverage, defect prevention, test quality, and requirement traceability.

### I — Instruction

Analyze the requirements and create:

- Test scenarios.
- Positive test cases.
- Negative test cases.
- Boundary and edge cases.
- Business rule validations.
- Integration test cases.
- Regression test cases.
- API and database test cases, where applicable.
- Test data requirements.
- Automation recommendations.
- Requirement traceability.

### S — Specificity

Every test case must contain:

1. Unique Test Case ID.
2. Requirement and acceptance criteria reference.
3. Clear test case title.
4. Test objective.
5. Test type.
6. Priority.
7. Preconditions.
8. Test data.
9. Numbered execution steps.
10. Expected results for individual steps.
11. Postconditions, where applicable.
12. Automation suitability.
13. Execution status.

Additional requirements:

- One primary validation objective per test case.
- No vague instructions such as "check whether it works."
- Use specific actions and observable outcomes.
- Avoid unsupported assumptions.
- Keep test cases independent wherever possible.
- Clearly identify dependencies.
- Preserve exact source references.

### P — Presentation

Generate the output in structured Markdown.

Use the following sections:

1. Test Case Overview.
2. Test Scenario Inventory.
3. Detailed Test Cases.
4. Positive Test Cases.
5. Negative Test Cases.
6. Boundary and Edge Test Cases.
7. Integration Test Cases.
8. Regression Test Cases.
9. Test Data Matrix.
10. Requirement Traceability Matrix.
11. Automation Recommendations.
12. Test Case Gap Register.
13. Quality Review Summary.

Use consistent IDs:

- `TC-<MODULE>-001` for test cases.
- `TS-<MODULE>-001` for test scenarios.
- `REQ-001` for requirements, where source IDs are unavailable.
- `TD-001` for test data.
- `GAP-001` for coverage gaps.

Do not replace existing source requirement IDs.

---

## 3D. STAR Framework

### S — Situation

The QA team has completed requirement analysis and test planning for `<application_name>` and `<module>`.

The approved requirements and acceptance criteria must now be converted into a detailed test case repository.

The test cases will be used by manual testers, QA leads, and automation engineers.

### T — Task

Create a comprehensive test case repository that validates all applicable requirements.

Ensure coverage of:

- Normal business workflows.
- Invalid inputs and error conditions.
- Boundary conditions.
- Business rules.
- Integration behavior.
- Regression impact.
- Relevant security and authorization conditions.
- Relevant non-functional expectations.

### A — Action

1. Review approved source requirements.
2. Review requirement gaps and approved clarifications.
3. Review the test plan and identify applicable testing scope.
4. Identify individual test scenarios.
5. Apply appropriate test design techniques.
6. Create detailed, atomic test cases.
7. Define preconditions, data, steps, and expected results.
8. Map test cases to source requirements.
9. Check for duplicates and missing coverage.
10. Recommend appropriate automation candidates.
11. Perform a quality and completeness review.

### R — Result

Deliver a professional Markdown test case repository that includes:

- Unique and traceable test cases.
- Positive and negative coverage.
- Boundary and edge-case coverage.
- Detailed execution instructions.
- Clear expected results.
- Test data requirements.
- Requirement traceability.
- Automation recommendations.
- Coverage gaps and clarification questions.
- Final QA review assessment.

The generated test cases must remain in Not Executed status until actual execution evidence is available.

---

# 4. Final Test Case Quality Gate

Before delivering the final repository, validate the following:

| Validation | Expected Result |
|---|---|
| Requirement mapping | Every applicable case has a source reference |
| Scenario coverage | Relevant positive and negative scenarios included |
| Test case uniqueness | No duplicate test case IDs |
| Atomicity | One primary objective per test case |
| Preconditions | Clearly specified |
| Test data | Available or explicitly identified as missing |
| Execution steps | Sequential and reproducible |
| Expected results | Specific and observable |
| Boundary coverage | Based on documented limits |
| Negative testing | Relevant invalid conditions covered |
| Traceability | Requirement-to-test mapping complete |
| Automation | Suitability justified |
| Execution status | Not Executed |
| Assumptions | No hidden assumptions |
| Review | Outstanding issues documented |

---

# 5. Final Generation Instructions

1. Analyze all supplied source documents before generating test cases.
2. Use the approved requirement analysis and test plan as the primary design references.
3. Preserve original requirement IDs wherever available.
4. If the source documents conflict, flag the conflict rather than selecting an arbitrary interpretation.
5. If expected results are not specified, mark them Pending Clarification.
6. If a scenario is useful but not explicitly required, identify it as a Proposed Risk-Based Scenario.
7. Generate the most appropriate coverage, not an arbitrary number of test cases.
8. Review the entire output for completeness, consistency, and duplication.
9. Do not claim execution, validation, or approval without evidence.

**Output filename:** `TEST_CASES_<MODULE>_<RELEASE>.md`

**Document status:** Draft — Pending QA Review and Approval.