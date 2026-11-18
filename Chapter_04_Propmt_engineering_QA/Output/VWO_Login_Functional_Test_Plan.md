# Functional Test Plan: VWO Login Module

| Field | Details |
|---|---|
| Test Plan ID | TP-VWO-LOGIN-001 |
| Title | VWO Login Module Functional Test Plan |
| Application | VWO login page — https://app.vwo.com/ |
| Version | 1.0 |
| Status | Draft for review |
| Prepared on | 2026-11-14 |

## 1. Objective

Verify that registered users can sign in with valid credentials, that invalid credentials do not grant access, that email and password are mandatory, and that successful authentication opens the authenticated dashboard.

## 2. Scope

### In scope

- Login using valid credentials for an approved test account.
- Login attempts using invalid credentials.
- Submission with email missing, password missing, and both fields missing.
- Verification that successful authentication opens the authenticated dashboard.
- Verification that unsuccessful authentication does not open the authenticated dashboard.

### Out of scope

- Registration, password reset, SSO, MFA, and social login.
- Password complexity, password length, or account lockout rules.
- Exact validation or authentication error wording.
- Session duration, remember-me behavior, and logout behavior.
- Security properties that cannot be established by the supplied functional requirements.

These features may be added after requirements and test data are approved.

## 3. Test Approach

1. Review the approved requirements, test account, and target environment before execution.
2. Execute the test scenarios in a supported browser using the application UI.
3. Use a known, authorized test account for the valid-login scenario. Do not use production user credentials.
4. Use designated invalid test credentials for negative authentication testing. Coordinate repeated attempts with the application owner to avoid triggering account protection.
5. Record the observed result, actual URL/page, browser, environment, and evidence for each scenario.
6. Report failures through the agreed defect-tracking process and retest after fixes.

**Recommendation:** Run the core scenarios on the team's primary supported browser first. Add other browsers and viewport sizes once the supported-browser matrix is confirmed.

## 4. Test Scenarios

### 4.1 Requirements-based scenarios

| ID | Type | Scenario | Preconditions / Test data | Steps | Expected result |
|---|---|---|---|---|---|
| VWO-LOGIN-001 | Positive | Registered user logs in with valid credentials | Approved active test account; logged-out state | Open the login page; enter the account's valid email and password; submit | Login succeeds and the authenticated dashboard opens. |
| VWO-LOGIN-002 | Negative | Login is attempted with invalid credentials | Logged-out state; approved invalid credential set | Open the login page; enter invalid credentials; submit | Access is not granted; the authenticated dashboard does not open. Exact error presentation: **Requires clarification**. |
| VWO-LOGIN-003 | Negative | Email is omitted | Logged-out state | Leave email empty; enter a password; submit | Login is not successful and the authenticated dashboard does not open. The application must enforce the email requirement. Exact validation behavior: **Requires clarification**. |
| VWO-LOGIN-004 | Negative | Password is omitted | Logged-out state | Enter an email; leave password empty; submit | Login is not successful and the authenticated dashboard does not open. The application must enforce the password requirement. Exact validation behavior: **Requires clarification**. |
| VWO-LOGIN-005 | Negative | Both required fields are omitted | Logged-out state | Leave email and password empty; submit | Login is not successful and the authenticated dashboard does not open. Both fields are mandatory. Exact validation behavior: **Requires clarification**. |
| VWO-LOGIN-006 | Positive | Dashboard access follows successful authentication | Approved active test account; logged-out state | Complete a successful login; observe the resulting page | The authenticated dashboard is displayed after successful login. This also verifies the postcondition of VWO-LOGIN-001. |

### 4.2 Boundary and clarification scenarios

The supplied requirements do not define whitespace handling, email syntax validation, field size limits, case normalization, or other input boundaries. These behaviors must not be assigned pass/fail expectations until clarified.

| ID | Scenario to consider | Expected result |
|---|---|---|
| VWO-LOGIN-B01 | Email contains only whitespace | **Requires clarification** — confirm whether whitespace is treated as an empty mandatory value. |
| VWO-LOGIN-B02 | Password contains only whitespace | **Requires clarification** — confirm whether whitespace is treated as an empty mandatory value or submitted as a password. |
| VWO-LOGIN-B03 | Email format is malformed | **Requires clarification** — no email syntax-validation rule was supplied. |
| VWO-LOGIN-B04 | Email/password at supported minimum and maximum lengths | **Requires clarification** — field limits and expected behavior were not supplied. |

## 5. Environment and Test Data

### Environment needs

- VWO login application available at the approved test URL. The supplied URL is `https://app.vwo.com/`; confirm the correct test or staging environment before execution.
- Network access to the application and its authentication dependencies.
- A supported browser and version, to be confirmed by the product team.
- An approved test user with valid credentials and permission to access the authenticated dashboard.
- A designated invalid credential set or approved method for generating invalid attempts.
- Access to the agreed defect-tracking system.

### Test data

| Data | Need | Handling |
|---|---|---|
| Valid email and password | VWO-LOGIN-001 and VWO-LOGIN-006 | Obtain from the account owner through an approved secret-sharing method; do not store credentials in this document or source control. |
| Invalid credentials | VWO-LOGIN-002 | Use approved non-production test data; confirm attempt limits with the application owner. |
| Missing-field inputs | VWO-LOGIN-003 through VWO-LOGIN-005 | Leave the respective UI field blank; no credential value is required for the omitted field. |

## 6. Entry and Exit Criteria

### Test-plan entry criteria

- The login requirements in this plan are approved.
- A target environment and supported browser are identified.
- Test accounts and authorized credential-handling procedures are available.
- The application is reachable and test execution is authorized.

### Test-plan exit criteria

- All approved in-scope scenarios have a recorded result.
- Every failure has a defect record or a documented disposition.
- Blocking defects and unresolved requirement questions are reported to stakeholders.

**Recommendation:** Consider the functional test cycle complete when all in-scope scenarios have been executed, no unresolved critical or high-severity defects remain, and stakeholders accept any remaining known issues. Severity definitions and acceptance thresholds require team agreement.

### Test execution entry criteria

- Entry criteria above are met.
- The test user is in a known logged-out state.
- The test data is confirmed and the test environment is stable.

### Test execution exit criteria

- Each in-scope scenario is marked Pass, Fail, Blocked, or Not Run with evidence as appropriate.
- Defects are filed for failed scenarios and retests are recorded.
- Any blocked or not-run scenario includes its reason.

### Test closure criteria

- Execution results and defect status are reviewed with stakeholders.
- Outstanding risks and clarification items are handed over.
- Test evidence is stored in the team's approved location.

## 7. Test Deliverables

- This functional test plan.
- Execution record with scenario ID, result, environment, browser, date, and evidence reference.
- Defect reports for observed failures.
- Test closure summary, including unresolved risks and clarification items.

**Recommendation:** Maintain the execution record in the team's standard test-management tool if one is available.

## 8. Test Execution

For each scenario:

1. Record the environment, browser/version, date, and tester.
2. Start from the login page and confirm the session is logged out.
3. Follow the scenario steps without changing the approved test data.
4. Compare the observed result with the stated expected result.
5. Record Pass, Fail, Blocked, or Not Run and attach evidence without exposing credentials.
6. Restore the logged-out state before the next scenario.

### Defect reporting procedure

For each failure, record:

- Scenario ID and concise defect title.
- Environment and browser/version.
- Preconditions and reproducible steps.
- Expected and actual behavior.
- Evidence with secrets and personal data removed.
- Severity and priority using the team's agreed definitions.

**Requires clarification:** Defect tracker, required fields, severity/priority definitions, and escalation process.

## 9. Test Schedule

No dates, staffing, or release milestones were supplied.

**Recommendation:** Schedule test-data/environment confirmation before execution, followed by functional execution, defect retesting, and a closure review. Add dates and owners after release planning.

## 10. Tools

- Supported web browser and developer tools, as approved by the team.
- Approved test-management and defect-tracking tools.
- Approved secure credential storage or secret-sharing method.

Specific product/tool choices are **Requires clarification**.

## 11. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| No approved valid test account is available | Successful login and dashboard access cannot be verified | Request a dedicated test account and verify access before execution. |
| Test URL points to production or an unintended environment | Risk of affecting real users or data | Confirm environment and authorization with the application owner before testing. |
| Repeated invalid attempts trigger account protections | Test account may be temporarily restricted | Coordinate attempt volume and reset/unlock process with the owner. |
| Error wording and field-validation behavior are unspecified | Expected results may be interpreted inconsistently | Keep assertions to the supplied requirements and resolve open questions before adding detailed expectations. |
| Dashboard access is not independently identifiable | Successful authentication may be difficult to verify consistently | Ask the product owner to identify the canonical authenticated dashboard page or indicator. |

## 12. Risks and Open Questions

1. Is `https://app.vwo.com/` the approved environment for this test cycle, or should a non-production URL be used?
2. Which browsers and versions are officially supported?
3. What page or stable indicator defines that the authenticated dashboard has opened?
4. What validation behavior is expected when email or password is blank?
5. Should whitespace-only input count as empty?
6. Is email-format validation required, and what formats are accepted?
7. Are there input length limits or case-normalization rules?
8. What is the approved source and lifecycle for valid and invalid test credentials?
9. What invalid-attempt limits or account-lockout protections must testing observe?
10. Which test-management and defect-tracking tools and severity definitions should be used?

Unspecified behavior remains **Requires clarification**; it is not treated as an assumed requirement.

## 13. Approvals

| Role | Name | Approval / Date |
|---|---|---|
| Product owner | Requires clarification | |
| QA lead | Requires clarification | |
| Application / environment owner | Requires clarification | |
