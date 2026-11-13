# Test Cases — VWO Login Dashboard: Session and Security (Observable)

Source: `../Input/Product Requirements Document_ VWO Login Dashboard.docx`  
Rules: `../AntiHalllucinationRule.md`  
Index: `README.md`

---

| ID | Title | Priority | Type | Precondition | Steps | Expected Result | PRD Ref |
|---|---|---|---|---|---|---|---|
| TC-090 | Idle session timeout | P1 | S | Authenticated session | 1) Remain idle beyond timeout 2) Perform action | Session expires and re-authentication is required. Duration: Insufficient information to determine | FR-02 |
| TC-091 | Session cookie protections | P2 | S | Authenticated session | 1) Inspect cookies in dev tools | Session cookie uses Secure/HttpOnly attributes. SameSite: Inference (low confidence) | FR-22, FR-02 |
| TC-092 | Credentials not persisted in plaintext | P1 | S | After failed and successful logins | 1) Inspect local/session storage, URL, and console logs | No plaintext password present | FR-22 |
| TC-093 | Brute-force protection | P1 | S | Login page loaded | 1) Submit repeated failed logins 2) Observe responses | Requests throttled or account protected. Threshold: Insufficient information to determine | FR-21 |
| TC-094 | Logout invalidates session | P2 | S | Authenticated session | 1) Log out 2) Use browser Back 3) Request dashboard URL | Authenticated content is not restored from cache or history | FR-02, FR-25 |
| TC-095 | Session token not guessable | P3 | S | Authenticated session | 1) Capture session token 2) Inspect format and entropy | Token is randomly generated and not sequential. Method: Inference (low confidence) | FR-22 |
