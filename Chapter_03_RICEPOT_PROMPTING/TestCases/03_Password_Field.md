# Test Cases — VWO Login Dashboard: Password Field

Source: `../Input/Product Requirements Document_ VWO Login Dashboard.docx`  
Rules: `../AntiHalllucinationRule.md`  
Index: `README.md`

---

| ID | Title | Priority | Type | Precondition | Steps | Expected Result | PRD Ref |
|---|---|---|---|---|---|---|---|
| TC-020 | Password input masking | P1 | S | Login page loaded | 1) Enter a password 2) Observe field | Masking behavior not specified in PRD: Insufficient information to determine | FR-01 |
| TC-021 | Password strength indicator | P2 | UI | Login page loaded | 1) Enter passwords of increasing strength 2) Observe indicator | Strength feedback displayed. Criteria: Insufficient information to determine | FR-07 |
| TC-022 | Empty password on blur | P2 | N | Login page loaded | 1) Focus password 2) Blur without input | Validation feedback shown. Message text: Insufficient information to determine | FR-05 |
| TC-023 | Password complexity enforced | P2 | N | Reset or set-password screen | 1) Submit weak password 2) Submit strong password | Weak rejected, strong accepted. Rule values: Insufficient information to determine | FR-11 |
