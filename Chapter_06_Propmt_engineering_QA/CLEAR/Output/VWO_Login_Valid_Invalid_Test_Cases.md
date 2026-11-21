# VWO Login — Valid and Invalid Test Cases

| Document field | Value |
|---|---|
| Application | Wingify / VWO login |
| Entry URL | `https://app.wingify.com/#/login` |
| Environment | Unknown; confirm before execution |
| Status | Pending Review |
| Execution status | Not Run |

## Requirements and evidence notes

The supplied `CLEAR.md` identifies the login URL and includes illustrative valid- and invalid-credential test patterns (`AUTH-005` and `AUTH-004`). It does not provide an approved test environment, credentials, or the exact authenticated destination. The cases below use those examples as scenario references, not as evidence that either case has been executed or that an environment-specific detail has been verified.

Do not put real passwords, tokens, cookies, or recovery data in this document. Obtain test credentials through an approved secret-management process.

## TC-VWO-LOGIN-001 — Login with valid credentials

| Field | Details |
|---|---|
| Requirement reference | `CLEAR.md` §3.2, illustrative example `AUTH-005`; confirm against approved project acceptance criteria |
| Objective | Verify that an authorised registered test user can authenticate and reach the authenticated destination. |
| Priority | High — proposed; confirm with the QA/product owner |
| Test type | Positive, functional, authentication |
| Preconditions | 1. The target environment and test authorization have been confirmed. 2. The login page is available. 3. An approved, active test account is available and its credentials are accessible through an approved secret store. 4. The user is logged out. |
| Test data | Valid test-account email and password, retrieved securely at execution time. Do not copy secret values into test reports or screenshots. |
| Automation suitability | Suitable for automation when a stable non-production test account and a reliable way to identify the authenticated destination are available. Keep secrets outside source control and mask them in logs. |
| Execution status | Not Run |

### Steps and expected results

| Step | Action | Expected result |
|---|---|---|
| 1 | Navigate to `https://app.wingify.com/#/login` in the approved environment. | The login page loads and is ready for interaction. If it does not, record the environment and observed state; do not assume the cause. |
| 2 | Enter the approved test account email. | The email value is accepted by the login form. |
| 3 | Enter the corresponding password using the approved secure test-data method. | The password is entered without being exposed in the test report, logs, or evidence. |
| 4 | Submit the login form once. | The application processes the authentication attempt. |
| 5 | Observe the resulting page and verify the authenticated state using the product-approved dashboard URL or another stable authenticated-page indicator. | Authentication succeeds and the authenticated dashboard/destination is displayed. The exact URL or indicator is **Requires clarification** before execution. |

**Pass criteria:** Step 5 confirms the approved authenticated destination is reached.  
**Fail criteria:** Credentials are confirmed valid but access is denied, or the approved authenticated destination is not reached.  
**Blocked criteria:** No approved test account, environment, or dashboard indicator is available.  
**Evidence to capture:** Environment/build if available, browser/version, timestamp, final page/URL or approved authenticated indicator, and sanitized screenshot. Never capture or publish credential values.

## TC-VWO-LOGIN-002 — Reject invalid credentials

| Field | Details |
|---|---|
| Requirement reference | `CLEAR.md` §3.2, illustrative example `AUTH-004`; confirm against approved project acceptance criteria |
| Objective | Verify that an invalid credential pair is rejected and does not grant access to the authenticated destination. |
| Priority | High — proposed; confirm with the QA/product owner |
| Test type | Negative, functional, authentication |
| Preconditions | 1. The target environment and test authorization have been confirmed. 2. The login page is available. 3. An approved invalid test credential pair is prepared; do not use another person’s account. 4. The user is logged out. |
| Test data | A designated invalid test credential pair supplied or approved by the application owner. Do not guess credentials or perform repeated attempts. |
| Automation suitability | Suitable for automation when using approved, isolated test data and a controlled attempt rate. Keep values out of source control and reports. |
| Execution status | Not Run |

### Steps and expected results

| Step | Action | Expected result |
|---|---|---|
| 1 | Navigate to `https://app.wingify.com/#/login` in the approved environment. | The login page loads and is ready for interaction. If it does not, record the environment and observed state; do not assume the cause. |
| 2 | Enter the approved invalid test email. | The value is entered in the email field. |
| 3 | Enter the corresponding invalid test password. | The password is entered without being exposed in the test report, logs, or evidence. |
| 4 | Submit the login form once. | The application rejects the credential pair; authentication is not granted. Exact message text and presentation are **Requires clarification** and must not be invented. |
| 5 | Verify the application has not reached the authenticated dashboard or another authenticated state. | The user remains unauthenticated. The observed rejection state is recorded without assuming an exact error message. |

**Pass criteria:** The application rejects the invalid pair and access to the authenticated destination is not granted.  
**Fail criteria:** The invalid pair authenticates or an authenticated destination is reached.  
**Blocked criteria:** The environment, approved invalid test data, or safe test authorization is unavailable.  
**Safety:** Perform one approved attempt only. Stop if account-protection, CAPTCHA, MFA, or rate-limit controls are triggered; do not bypass them.  
**Evidence to capture:** Environment/build if available, browser/version, timestamp, sanitized rejection state, and confirmation that no authenticated destination was reached. Do not include credential values.

## Open items before execution

1. Confirm whether the supplied URL is a test, staging, or production environment and whether execution is authorized there.
2. Provide access to an approved valid test account and designated invalid test data using an approved secret-management method.
3. Identify the canonical authenticated dashboard URL or stable indicator.
4. Confirm the expected invalid-login response at a behavioral level; exact copy is not specified in the supplied guide.

Until these items are resolved, both test cases remain **Not Run**. No execution result is claimed.
