# Test Cases — VWO Login Dashboard

Generated with the RICE POT prompt in [`../TestCase_RICEPOT.md`](../TestCase_RICEPOT.md) from
[`../Input/Product Requirements Document_ VWO Login Dashboard.docx`](../Input/Product%20Requirements%20Document_%20VWO%20Login%20Dashboard.docx),
under the rules in [`../AntiHalllucinationRule.md`](../AntiHalllucinationRule.md).

| Field | Value |
|---|---|
| Application | https://app.vwo.com/login |
| Total test cases | 67 |
| Areas | 12 |
| Priority scale | P1 critical, P2 high, P3 medium |
| Type codes | F functional, N negative, S security, A accessibility, P performance, UI/UX, I integration |
| Date | 2026-11-13 |

---

## Files

| # | File | Area | Cases |
|---|---|---|---|
| 01 | [01_Page_Load_and_Interface.md](./01_Page_Load_and_Interface.md) | Page Load and Interface | 7 |
| 02 | [02_Email_Field_Validation.md](./02_Email_Field_Validation.md) | Email Field Validation | 8 |
| 03 | [03_Password_Field.md](./03_Password_Field.md) | Password Field | 4 |
| 04 | [04_Remember_Me.md](./04_Remember_Me.md) | Remember Me | 4 |
| 05 | [05_Authentication.md](./05_Authentication.md) | Authentication | 9 |
| 06 | [06_Password_Management.md](./06_Password_Management.md) | Password Management | 7 |
| 07 | [07_Registration_and_Support_Links.md](./07_Registration_and_Support_Links.md) | Registration and Support Links | 2 |
| 08 | [08_Theme_Branding_Visual_Design.md](./08_Theme_Branding_Visual_Design.md) | Theme, Branding, Visual Design | 4 |
| 09 | [09_Accessibility.md](./09_Accessibility.md) | Accessibility | 7 |
| 10 | [10_Session_and_Security.md](./10_Session_and_Security.md) | Session and Security | 6 |
| 11 | [11_Enterprise_Authentication.md](./11_Enterprise_Authentication.md) | Enterprise Authentication | 5 |
| 12 | [12_Performance_Scalability_Analytics.md](./12_Performance_Scalability_Analytics.md) | Performance, Scalability, Analytics | 4 |

---

## Missing / Unknown Information

| Ref | Missing information | Impact |
|---|---|---|
| MI-01 | No valid/invalid test credentials provided | TC-040, TC-041, TC-042, TC-043, TC-046, TC-050, TC-053, TC-056 are data-dependent |
| MI-02 | Exact error message copy for each failure type | Expected results state "Insufficient information to determine." |
| MI-03 | Password complexity rule values (length, character classes) | TC-054 cannot assert a specific policy |
| MI-04 | Session timeout and Remember Me persistence duration | TC-031, TC-090 cannot assert a timeframe |
| MI-05 | 2FA methods, enrollment flow, and test accounts | TC-100, TC-101 data-dependent |
| MI-06 | SSO test tenant / IdP configuration | TC-102, TC-103 data-dependent |
| MI-07 | Rate-limit / lockout threshold and window | TC-093 cannot assert a threshold |
| MI-08 | Analytics platform and event names | TC-113 verification method undefined |
| MI-09 | Responsive breakpoints and supported browser matrix | TC-007 uses representative viewports only |
| MI-10 | Whether light/dark preference persists across sessions | TC-072 marked as unverifiable from PRD |
| MI-11 | Definition of "standard connection" for the 2s target | TC-002 measurement profile is an assumption |
| MI-12 | Which PRD features are implemented in the live app | All cases are requirement-based; verify implementation before execution |
| MI-13 | Recovery options other than email | TC-050 covers email only; others unverifiable |

---

## Traceability Matrix

| Requirement | Test Case IDs |
|---|---|
| FR-01 Email/password authentication | TC-001, TC-020, TC-040 |
| FR-02 Session management and timeout | TC-031, TC-032, TC-090, TC-091, TC-094 |
| FR-03 Optional 2FA | TC-100, TC-101 |
| FR-04 SSO and social login | TC-102, TC-103, TC-104 |
| FR-05 Validation on blur | TC-010, TC-011, TC-012, TC-017, TC-022, TC-044 |
| FR-06 Email format and mobile keyboard | TC-010, TC-012, TC-013, TC-014, TC-015, TC-016 |
| FR-07 Password strength indicators | TC-021 |
| FR-08 Error messages | TC-017, TC-041, TC-042, TC-043, TC-044, TC-045 |
| FR-09 Forgot password and tokens | TC-050, TC-051, TC-052, TC-053, TC-055, TC-056 |
| FR-10 Recovery options | TC-050, TC-051 |
| FR-11 Password complexity | TC-023, TC-053, TC-054, TC-056 |
| FR-12 Remember Me | TC-030, TC-031, TC-032, TC-033 |
| FR-13 Responsive design | TC-007 |
| FR-14 Auto-focus and clickable labels | TC-003, TC-004 |
| FR-15 Loading states | TC-047 |
| FR-16 Accessibility | TC-033, TC-080, TC-081, TC-082, TC-084, TC-085, TC-086 |
| FR-17 High contrast | TC-083 |
| FR-18 Light/Dark mode and branding | TC-006, TC-070, TC-071, TC-072, TC-073 |
| FR-19 Registration link | TC-001, TC-060 |
| FR-20 Analytics tracking | TC-113 |
| FR-21 Rate limiting | TC-093 |
| FR-22 Encryption, HTTPS, secure storage | TC-005, TC-045, TC-091, TC-092, TC-095 |
| FR-23 Page load and asset optimization | TC-002, TC-110, TC-111 |
| FR-24 Dashboard transition | TC-040, TC-048 |
| FR-25 Unauthorized access prevention | TC-041, TC-046, TC-094 |
| FR-26 Support integration | TC-061 |
| FR-27 Success metrics and uptime | TC-111, TC-112 |

---

## Self-Validation Check

| Check | Result |
|---|---|
| Every test case mapped to a PRD requirement | Pass — no orphan cases |
| Test cases exceeding PRD scope | Pass — none; security-adjacent cases limited to observable behavior |
| Invented error messages or codes | Pass — unspecified copy marked "Insufficient information to determine" |
| Invented credentials or data | Pass — credential-dependent cases marked data-dependent (MI-01) |
| Invented thresholds, durations, or policies | Pass — marked unknown (MI-02 to MI-11) |
| Assumption of implemented features | Pass — implementation status flagged as unverified (MI-12) |
| Inference labelling | Pass — TC-002, TC-086, TC-091, TC-095 labelled "Inference (low confidence)" |
| Priority and type assigned to all cases | Pass |
| Positive, negative, boundary, security, accessibility, performance coverage | Pass |
| Duplicate test cases | Pass — none |
