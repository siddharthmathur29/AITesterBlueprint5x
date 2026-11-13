# Test Cases — VWO Login Dashboard: Enterprise Authentication

Source: `../Input/Product Requirements Document_ VWO Login Dashboard.docx`  
Rules: `../AntiHalllucinationRule.md`  
Index: `README.md`

---

| ID | Title | Priority | Type | Precondition | Steps | Expected Result | PRD Ref |
|---|---|---|---|---|---|---|---|
| TC-100 | 2FA challenge on enabled account | P1 | F | Account with 2FA enabled (data-dependent) | 1) Log in with valid credentials 2) Provide valid second factor | Second-factor challenge presented, then dashboard access | FR-03 |
| TC-101 | Invalid second factor rejected | P1 | N | Account with 2FA enabled (data-dependent) | 1) Log in 2) Provide invalid code | Access denied; retry or recovery path offered | FR-03 |
| TC-102 | SSO login for organizational account | P1 | I | SSO test tenant (data-dependent) | 1) Start SSO login 2) Authenticate at IdP 3) Return to app | Authenticated and redirected to the dashboard | FR-04 |
| TC-103 | Expired SSO assertion rejected | P2 | S | SSO test tenant (data-dependent) | 1) Complete SSO with an expired assertion | Login rejected; no session created | FR-04 |
| TC-104 | Social login availability | P3 | I | Identity provider configured | 1) Select Google/Microsoft login 2) Complete flow | Login completes if the provider is enabled. Availability: Insufficient information to determine | FR-04 |
