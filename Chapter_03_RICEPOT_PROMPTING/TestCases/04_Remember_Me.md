# Test Cases — VWO Login Dashboard: Remember Me

Source: `../Input/Product Requirements Document_ VWO Login Dashboard.docx`  
Rules: `../AntiHalllucinationRule.md`  
Index: `README.md`

---

| ID | Title | Priority | Type | Precondition | Steps | Expected Result | PRD Ref |
|---|---|---|---|---|---|---|---|
| TC-030 | Remember Me checkbox present | P2 | F | Login page loaded | 1) Observe form controls | Checkbox with associated label is present. Default state: Insufficient information to determine | FR-12 |
| TC-031 | Remembered session persists | P2 | F | Valid credentials (data-dependent) | 1) Select Remember Me 2) Log in 3) Close and reopen browser 4) Open app URL | Session restored without re-authentication. Duration: Insufficient information to determine | FR-02, FR-12 |
| TC-032 | Session not persisted when unchecked | P2 | S | Valid credentials (data-dependent) | 1) Leave Remember Me unchecked 2) Log in 3) Close and reopen browser 4) Open app URL | Authentication required again | FR-02, FR-12 |
| TC-033 | Remember Me toggles via keyboard | P3 | A | Login page loaded | 1) Tab to checkbox 2) Press Space | State toggles and is announced | FR-12, FR-16 |
