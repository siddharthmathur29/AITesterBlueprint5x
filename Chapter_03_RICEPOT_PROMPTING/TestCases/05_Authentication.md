# Test Cases — VWO Login Dashboard: Authentication

Source: `../Input/Product Requirements Document_ VWO Login Dashboard.docx`  
Rules: `../AntiHalllucinationRule.md`  
Index: `README.md`

---

| ID | Title | Priority | Type | Precondition | Steps | Expected Result | PRD Ref |
|---|---|---|---|---|---|---|---|
| TC-040 | Successful login with valid credentials | P1 | F | Active test account (data-dependent) | 1) Enter valid email and password 2) Submit | Authentication succeeds and user is redirected to the main dashboard | FR-01, FR-24 |
| TC-041 | Login with invalid password | P1 | N | Existing account (data-dependent) | 1) Enter valid email 2) Enter wrong password 3) Submit | Login rejected; error message shown; user remains on login page. Message text: Insufficient information to determine | FR-08, FR-25 |
| TC-042 | Login with unregistered email | P1 | N | Login page loaded | 1) Enter an email with no account 2) Enter any password 3) Submit | Login rejected with error feedback. Message text: Insufficient information to determine | FR-08 |
| TC-043 | Login with both credentials invalid | P2 | N | Login page loaded | 1) Enter invalid email and password 2) Submit | Login rejected with error feedback | FR-08 |
| TC-044 | Submit with both fields empty | P1 | N | Login page loaded | 1) Submit empty form | Submission blocked; both fields show required validation | FR-05, FR-08 |
| TC-045 | No sensitive data in error response | P2 | S | Login page loaded | 1) Trigger authentication failure 2) Inspect UI text and network response | Error exposes no password, stack trace, or internal detail | FR-08, FR-22 |
| TC-046 | Dashboard unreachable without authentication | P1 | S | No active session | 1) Request dashboard URL directly | Redirected to login; no protected content rendered | FR-25 |
| TC-047 | Loading feedback during authentication | P2 | UI | Login page loaded | 1) Submit valid credentials 2) Observe during request | Loading state shown until the request resolves | FR-15 |
| TC-048 | Successful login redirects seamlessly | P2 | F | Valid credentials (data-dependent) | 1) Complete login 2) Observe post-login navigation | Transition to dashboard completes without intermediate error page | FR-24 |
