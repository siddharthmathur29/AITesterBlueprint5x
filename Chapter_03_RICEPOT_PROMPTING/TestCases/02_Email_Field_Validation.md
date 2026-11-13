# Test Cases — VWO Login Dashboard: Email Field Validation

Source: `../Input/Product Requirements Document_ VWO Login Dashboard.docx`  
Rules: `../AntiHalllucinationRule.md`  
Index: `README.md`

---

| ID | Title | Priority | Type | Precondition | Steps | Expected Result | PRD Ref |
|---|---|---|---|---|---|---|---|
| TC-010 | Valid email accepted | P1 | F | Login page loaded | 1) Enter user@example.com 2) Blur | No validation error shown | FR-05, FR-06 |
| TC-011 | Empty email on blur | P2 | N | Login page loaded | 1) Focus email 2) Blur without input | Validation feedback shown. Message text: Insufficient information to determine | FR-05 |
| TC-012 | Invalid email format on blur | P1 | N | Login page loaded | 1) Enter "abc" 2) Blur | Validation error shown. Message text: Insufficient information to determine | FR-05, FR-06 |
| TC-013 | Malformed email variants rejected | P2 | N | Login page loaded | 1) Enter each: "user@", "@example.com", "user@@example.com", "user name@example.com" 2) Blur | Each rejected with validation feedback; submit blocked | FR-06 |
| TC-014 | Valid format variants accepted | P3 | F | Login page loaded | 1) Enter user.name+tag@sub.example.co.in 2) Blur | No validation error | FR-06 |
| TC-015 | Leading/trailing whitespace handling | P3 | N | Login page loaded | 1) Enter " user@example.com " 2) Blur and submit | Behavior unspecified: Insufficient information to determine | FR-06 |
| TC-016 | Mobile email keyboard | P3 | UI | Mobile device or emulation | 1) Focus email field on mobile | Keyboard suitable for email entry is presented | FR-06 |
| TC-017 | Submit with valid email and empty password | P2 | N | Login page loaded | 1) Enter valid email 2) Leave password empty 3) Submit | Submission blocked with password validation feedback; message text: Insufficient information to determine | FR-05, FR-08 |
