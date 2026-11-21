CLEAR.md — Wingify / VWO Application Quality & Testing Guide
Framework: CLEAR = Context, Limits, Examples, Actions, Review
Application entry point: https://app.wingify.com/#/login
Purpose: Give an AI assistant, QA engineer, or automation agent a reliable, safety-conscious operating guide for understanding, testing, and documenting the application.

1. CONTEXT
1.1 Application under test
- Application name: Wingify application (the supplied entry point is the Wingify-hosted application at app.wingify.com).
- Starting URL: https://app.wingify.com/#/login
- Primary initial area: Login / authentication.
- Likely product context: VWO (Visual Website Optimizer), subject to confirmation from the live application and authorised project documentation.
- Environment: Do not assume that the URL points to a test, staging, or production environment. Establish the environment before executing tests that modify data.
1.2 Mission
Understand the application from observable behaviour and approved project artefacts, then produce accurate, traceable, maintainable quality deliverables. These may include:
- Application and feature analysis.
- Functional and non-functional test scenarios.
- Detailed test cases and test data.
- UI, API, integration, regression, smoke, and exploratory test coverage.
- Defect reports with reproducible evidence.
- Automation candidates and implementation plans.
- Execution summaries and release-readiness assessments.
The objective is risk-based confidence in the application—not maximum test-case count or automation for its own sake.
1.3 Sources of truth
Use information in this order:
1. Explicit user instructions and acceptance criteria for the current task.
2. Approved requirements, product specifications, user stories, and design documents.
3. Observable behaviour in the authorised application environment.
4. Existing project source code, API specifications, and approved test documentation.
5. Reasonable hypotheses, clearly labelled as assumptions and verified before being treated as facts.
If sources conflict, do not silently choose one. Record the conflict, its impact, and the clarification required.
1.4 Initial application discovery
Before writing comprehensive tests:
1. Open the supplied URL in an approved browser.
2. Record the page title, visible branding, URL, environment indicators, and initial state.
3. Capture the visible login-page controls and their labels.
4. Identify available authentication methods only when they are visibly present or documented.
5. Inspect validation messages, help links, password visibility controls, remember-me options, and navigation links if present.
6. Determine whether login requires a redirect, external identity provider, MFA, CAPTCHA, or account verification.
7. After authorised login, map the accessible navigation, major modules, user roles, and key workflows.
8. Record any inaccessible areas as not verified rather than assuming their behaviour.
Do not infer the complete application from the login page alone.
1.5 Expected deliverable quality
Every deliverable must be:
- Accurate and grounded in evidence.
- Complete for the explicitly requested scope.
- Traceable to requirements or clearly identified exploratory risks.
- Specific, unambiguous, and reproducible.
- Free from duplicate or contradictory test cases.
- Suitable for review by a QA lead, product owner, developer, or security reviewer.
2. LIMITS
2.1 Evidence and assumptions
- Never invent pages, features, buttons, APIs, roles, workflows, or expected results.
- Do not state that a feature exists unless it has been observed or supported by an authoritative requirement.
- Clearly label each item as Verified, Documented, Assumption, Not Tested, or Blocked, as appropriate.
- Do not treat a successful page load as proof that the application is fully functional.
- If the browser cannot render the application because JavaScript is required, use an approved interactive browser session; do not infer the UI from the loading shell.
2.2 Access and security
- Use only accounts, environments, data, and systems for which the user has explicit authorisation.
- Never request, expose, print, commit, or store passwords, access tokens, session cookies, API keys, recovery codes, or other secrets.
- Use approved secret-management mechanisms and masked configuration.
- Never attempt to bypass authentication, MFA, CAPTCHA, account verification, rate limits, tenant boundaries, or access controls.
- Do not perform brute-force, credential-stuffing, denial-of-service, destructive, or unauthorised penetration tests.
- Security testing beyond safe, approved checks requires explicit scope and authorisation.
- Do not access another customer's account or data.
- Avoid changing production data. Use a designated test environment and approved test accounts whenever possible.
- Before any action that creates, updates, deletes, publishes, launches, or sends data, confirm that the environment and test data are safe for that action.
2.3 Test execution boundaries
- Do not click destructive or irreversible controls merely to discover what they do.
- Do not create experiments, campaigns, goals, audiences, integrations, or other business objects unless the task explicitly authorises it.
- Do not send real emails, notifications, invitations, or external requests during testing without approval.
- Do not claim that a test passed unless it was actually executed and the result was observed.
- Do not fabricate screenshots, logs, API responses, execution times, defect IDs, or test results.
- If execution is unavailable, provide a test design and mark execution status Not Run.
2.4 Product and requirement boundaries
- Treat the supplied login URL as the entry point, not proof of all product capabilities.
- Do not assume SSO, passkey, Google sign-in, password reset, MFA, or any other authentication option is enabled. Verify it.
- Do not treat a previous ticket, example, or proposed feature as implemented functionality unless the current build confirms it.
- Do not expand scope silently. List out-of-scope areas and dependencies.
2.5 Automation boundaries
- Prefer stable, user-facing selectors and accessible attributes.
- Avoid brittle XPath expressions, arbitrary sleeps, hard-coded credentials, and environment-specific values in test code.
- Do not automate every scenario. Prioritise repeatable, deterministic, high-value regression checks.
- Keep test data isolated and clean up only data created by the test, where cleanup is authorised.
- Do not hide flaky behaviour with retries without investigating the root cause.
- Do not change application code or configuration unless explicitly requested.
3. EXAMPLES
The examples below are illustrative test-design patterns, not confirmation that the corresponding controls or features exist in the current application. First verify that a feature is present and in scope.
3.1 Login-page discovery checklist
Area	What to inspect	Evidence to record
Page identity	Branding, title, URL, environment	Screenshot, page title, URL
Input controls	Username/email and password fields, if present	Exact labels, input types, required indicators
Primary action	Sign-in or login button, if present	Exact text, enabled/disabled behaviour
Alternative sign-in	SSO, Google, passkey, or other options, if present	Visible label and resulting flow
Validation	Empty, malformed, or invalid values	Exact message and when it appears
Recovery	Forgot-password or account-recovery link, if present	Destination and observed flow
Security	MFA, CAPTCHA, account verification, if present	Trigger conditions and safe observations
Navigation	Help, privacy, terms, support links	Destination and availability
Responsive UI	Desktop, tablet, mobile layouts	Viewport and layout differences
Accessibility	Keyboard access, labels, focus, contrast	Reproducible observations


3.2 Example functional test cases
Use these only after confirming the relevant login controls and expected behaviour.
ID	Scenario	Preconditions	Steps	Expected result
AUTH-001	Open login page	Approved environment is available	Navigate to the supplied URL	Login page loads and presents the verified controls
AUTH-002	Submit with required fields empty	Login page is open	Leave required fields empty and activate the primary action	Required-field validation is displayed according to the specification
AUTH-003	Submit invalid email format	Email field exists	Enter an invalid email format and submit	Input is rejected with an appropriate validation message
AUTH-004	Submit invalid credentials	Approved test account is available	Enter deliberately invalid test credentials and submit once	Authentication is rejected without exposing sensitive details
AUTH-005	Submit valid credentials	Approved valid test account is available	Enter valid credentials and submit	User is authenticated and reaches the documented destination
AUTH-006	Password visibility	Password visibility control exists	Toggle visibility on and off	Password masking changes correctly; the value is not altered
AUTH-007	Keyboard navigation	Login page is open	Navigate controls using Tab, Shift+Tab, Enter, and Space as appropriate	Focus order is logical and controls are operable by keyboard
AUTH-008	Session behaviour	Session requirements are documented	Authenticate and observe the documented session behaviour	Session handling matches the approved security requirements
AUTH-009	Logout	Authenticated test session exists	Use the documented logout action	Session ends and protected pages are no longer accessible
AUTH-010	Protected-route access	Protected route is known and test account is logged out	Open the protected route directly	Application follows the documented unauthenticated access behaviour


3.3 Example defect report
Title: [Login] Required-field validation is not displayed when the sign-in form is submitted empty
- Environment: Record the exact environment and build.
- Precondition: Login page is open.
- Steps to reproduce:
  1. Leave all required fields empty.
  2. Activate the primary sign-in action.
- Actual result: Record exactly what happened. Do not use this example as an observed defect.
- Expected result: Required-field validation should match the approved requirements.
- Severity / Priority: Assess using the team's agreed definitions.
- Evidence: Attach a screenshot, timestamp, browser/version, and relevant sanitised console or network evidence.
- Requirement reference: Add the relevant story or acceptance criterion.
- Status: New / Open, according to the team's workflow.
3.4 Example automation structure
For a Java + Selenium + TestNG project, use a maintainable structure such as:
project-root/
├── pom.xml
├── README.md
├── CLEAR.md
├── src/
│   ├── main/
│   │   └── java/
│   │       ├── config/
│   │       ├── driver/
│   │       ├── pages/
│   │       ├── components/
│   │       └── utilities/
│   └── test/
│       ├── java/
│       │   ├── tests/
│       │   ├── listeners/
│       │   └── dataproviders/
│       └── resources/
│           ├── config/
│           ├── testdata/
│           └── testng.xml
└── reports/
Adapt this structure to the existing repository rather than duplicating or replacing an established framework.

Illustrative principles:
- Page objects encapsulate page-specific locators and interactions.
- Tests express business intent and assertions.
- Driver creation and teardown are centralised.
- Configuration is environment-driven.
- Test data contains no real credentials.
- Waits are explicit and condition-based.
- Screenshots and logs are captured on failure where safe.
- Test suites distinguish smoke, regression, and other approved categories.
- Parallel execution is enabled only when tests and test data are isolated.
4. ACTIONS
Follow this workflow for every application-analysis or testing task.
Phase 1 — Understand the request
1. Identify the feature, user story, defect, or workflow.
2. Identify the requested output: analysis, test plan, test cases, automation, execution, or report.
3. Capture scope, exclusions, environment, role, dependencies, and acceptance criteria.
4. Identify missing information that could change expected behaviour.
5. Ask focused clarification questions when a critical requirement is ambiguous. Do not fill gaps with invented behaviour.
Phase 2 — Discover and inspect
1. Open the authorised application URL.
2. Confirm the environment and current application state.
3. Inspect only the relevant pages and workflows.
4. Record controls, labels, transitions, validations, and observable outcomes.
5. Capture evidence without exposing secrets or personal/customer data.
6. Compare observed behaviour with approved requirements.
7. Maintain a list of verified facts, assumptions, gaps, and blockers.
Phase 3 — Analyse risk and coverage
Consider, where applicable:
- Positive and negative functional paths.
- Boundary values and input validation.
- Required, optional, malformed, and unsupported inputs.
- Authentication, authorisation, and session handling.
- Role and permission differences.
- Error handling, recovery, and retry behaviour.
- API and third-party integration behaviour.
- Data integrity and persistence.
- Browser, device, and responsive behaviour.
- Accessibility and keyboard operation.
- Performance and reliability under an approved test scope.
- Regression impact on related workflows.
Prioritise based on business impact, likelihood, exposure, and failure detectability. Do not assign arbitrary risk scores without defining the scoring scale.
Phase 4 — Produce the requested artefact
For a test plan, include:
1. Document control and version.
2. Objective.
3. Application and feature overview.
4. Scope and exclusions.
5. References and assumptions.
6. Test strategy and test types.
7. Test environment and configuration.
8. Test data and access requirements.
9. Test scenarios and traceability.
10. Entry and exit criteria.
11. Roles and responsibilities.
12. Schedule and dependencies, when known.
13. Defect management and reporting.
14. Risks, mitigations, and open questions.
15. Deliverables and sign-off.
For detailed test cases, include:
- Unique test-case ID.
- Requirement / acceptance-criteria reference.
- Scenario and objective.
- Preconditions.
- Test data.
- Numbered execution steps.
- Expected result for each meaningful step.
- Priority and test type.
- Automation suitability, with rationale.
- Execution status only when execution has occurred.
For automation work, include:
- Existing framework and repository assessment.
- Dependencies and supported versions.
- Proposed design and file locations.
- Reusable page/component objects.
- Data and environment strategy.
- Assertions and failure diagnostics.
- Execution commands.
- Reporting approach.
- Risks and maintenance considerations.
Phase 5 — Execute, if authorised
1. Confirm the target environment and test account.
2. Confirm that the selected test data is safe.
3. Run a small smoke check before broader execution.
4. Execute tests in the agreed order.
5. Capture actual results and evidence.
6. Report failures, blocked tests, and environmental issues separately.
7. Re-run only when justified; retain the original result and explain the re-run.
8. Clean up test-created data only when authorised.
Phase 6 — Report
Use these execution statuses consistently:
- Pass: Actual result matches the expected result.
- Fail: Actual result differs from the expected result.
- Blocked: Execution cannot proceed because of a dependency or access issue.
- Not Run: Test has not been executed.
- Not Applicable: The scenario is outside the confirmed scope, with a reason.
- Inconclusive: Evidence is insufficient to determine pass or fail.
Provide a concise summary of coverage, results, critical defects, blockers, risks, and outstanding decisions. Never convert a designed test case into a passed test without execution evidence.
5. REVIEW
Before presenting or committing any deliverable, perform every applicable review below.
5.1 Context review
- [ ] Correct application and supplied URL are identified.
- [ ] Environment is identified or explicitly marked unknown.
- [ ] Scope and exclusions are clear.
- [ ] Requirements and acceptance criteria are referenced.
- [ ] Verified facts are separated from assumptions.
- [ ] Unavailable or inaccessible functionality is marked as not verified.
5.2 Completeness review
- [ ] All in-scope requirements have corresponding coverage.
- [ ] Positive and negative scenarios are considered.
- [ ] Boundary, validation, and error paths are considered.
- [ ] Authentication, authorisation, and session scenarios are considered where relevant.
- [ ] Integration and data-persistence risks are considered where relevant.
- [ ] UI, accessibility, responsive, and browser coverage are considered where relevant.
- [ ] Dependencies, risks, and open questions are documented.
- [ ] No requirement has been silently omitted.
5.3 Test-case quality review
- [ ] Every test case has a unique ID.
- [ ] Titles describe one clear scenario.
- [ ] Preconditions and test data are explicit.
- [ ] Steps are numbered, actionable, and reproducible.
- [ ] Expected results are observable and unambiguous.
- [ ] Each test case has traceability to a requirement or is labelled exploratory.
- [ ] Priority and test type are meaningful.
- [ ] Duplicate, overlapping, contradictory, and redundant cases are removed.
- [ ] Tests do not depend on execution order unless that dependency is stated.
5.4 Technical and security review
- [ ] No secrets or real credentials are present.
- [ ] No unauthorised or destructive action is proposed.
- [ ] Environment-specific values are configurable.
- [ ] Automation design uses maintainable selectors and waits.
- [ ] Test data is isolated and safe.
- [ ] Logs and screenshots do not expose sensitive information.
- [ ] Tool, framework, and dependency versions are not invented.
5.5 Evidence and reporting review
- [ ] Every claimed execution result has supporting evidence.
- [ ] Pass, Fail, Blocked, Not Run, Not Applicable, and Inconclusive are used correctly.
- [ ] Defects include reproducible steps and actual-versus-expected behaviour.
- [ ] Screenshots, logs, timestamps, and build details are included where available.
- [ ] Limitations and untested areas are disclosed.
- [ ] No fabricated metrics, defect IDs, or sign-offs are included.
5.6 Final approval gate
Do not describe a deliverable as reviewed, approved, complete, or release-ready unless the relevant review has actually been performed and the required evidence is available.

If any critical requirement is unclear, any high-risk area is untested, or any required evidence is missing:
1. State the gap.
2. Explain its impact.
3. Identify the owner or decision needed, if known.
4. Mark the deliverable Pending Review or Blocked, as appropriate.
5. Do not imply sign-off.
6. REQUIRED RESPONSE FORMAT FOR AI AGENTS
For work performed under this file, structure the response as follows:
Understanding
- Requested feature/task:
- Application/environment:
- Scope:
- Requirements reviewed:
Findings
- Verified observations:
- Assumptions:
- Gaps and ambiguities:
- Risks:
Work completed
- Artefacts or tests created:
- Files changed:
- Tests executed:
- Execution evidence:
Review
- Coverage review:
- Quality/security review:
- Outstanding issues:
- Review status: Reviewed, Pending Review, Blocked, or Not Applicable.
Final outcome
Give a concise, evidence-based conclusion. Clearly distinguish what was inspected, what was created, and what was actually executed.
7. OPERATING PRINCIPLE
Be evidence-driven, explicit about uncertainty, conservative with access, and thorough in review.

When information is missing, ask or mark it as unknown. When behaviour is unverified, do not invent it. When a test has not run, do not call it passed. Quality and traceability take precedence over speed and volume.