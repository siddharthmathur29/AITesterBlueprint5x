# Test Cases — VWO Login Dashboard: Password Management

Source: `../Input/Product Requirements Document_ VWO Login Dashboard.docx`  
Rules: `../AntiHalllucinationRule.md`  
Index: `README.md`

---

| ID | Title | Priority | Type | Precondition | Steps | Expected Result | PRD Ref |
|---|---|---|---|---|---|---|---|
| TC-050 | Forgot password entry point | P1 | F | Login page loaded | 1) Activate the forgot-password control | Recovery flow displayed with email input | FR-09, FR-10 |
| TC-051 | Reset email for registered address | P1 | F | Account with accessible mailbox (data-dependent) | 1) Submit registered email 2) Check mailbox | Reset email with a tokenized link received | FR-09 |
| TC-052 | Reset request for unregistered address | P2 | N | Login page loaded | 1) Submit unknown email | Response shown. Whether it reveals account existence: Insufficient information to determine | FR-09 |
| TC-053 | Password reset with valid token | P1 | F | Valid reset token (data-dependent) | 1) Open reset link 2) Set compliant new password 3) Submit | Password updated and confirmation shown | FR-09, FR-11 |
| TC-054 | Weak password rejected at reset | P2 | N | Valid reset token | 1) Submit a weak password | Rejected with policy feedback. Policy values: Insufficient information to determine | FR-11 |
| TC-055 | Expired or reused token rejected | P2 | S | Previously used/expired token | 1) Open the token link again 2) Submit new password | Request rejected; no password change | FR-09 |
| TC-056 | New password valid, old password invalid | P1 | F | Completed reset (data-dependent) | 1) Log in with old password 2) Log in with new password | Old password rejected; new password accepted | FR-09, FR-11 |
