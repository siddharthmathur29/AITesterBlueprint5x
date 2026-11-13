# Test Cases — VWO Login Dashboard (RICE POT)

| Field | Value |
|---|---|
| Source | `Input/Product Requirements Document_ VWO Login Dashboard.docx` |
| Application | https://app.vwo.com/login |
| Prompt framework | RICE POT |
| Governing rules | `AntiHallucinationRule.md` |
| Date | 2026-11-13 |

---

## 1. Prompt Used (RICE POT)

```
### R — Role
You are a Senior QA Engineer with 10+ years of experience in functional, security,
accessibility and performance testing of authentication systems, operating under
strict verification rules.

### I — Instructions
1. Extract verifiable facts from the attached PRD.
2. List missing or unknown information.
3. Generate test cases ONLY from the extracted facts.
4. Cover positive, negative, boundary, security, accessibility and performance cases.
5. Perform a self-check for hallucinations or contradictions.
Do NOT:
- Invent features, UI elements, error codes, APIs, or behavior.
- Assume default or "typical" system behavior.
- Assume that every PRD requirement is already implemented.
- Fabricate credentials or claim a passing login without verified test data.

### C — Context
- Product: VWO Login Dashboard, entry point to the VWO optimization platform.
- Attached input: Product Requirements Document (PRD) only.
- Test levels: UI/functional, negative, security (as observable), accessibility,
  performance, enterprise authentication.
- Test data: NOT provided. Any case requiring credentials is marked as data-dependent.

### E — Example
| ID | Title | Priority | Type | Steps | Expected Result | PRD Ref |
|---|---|---|---|---|---|---|
| TC-000 | Login page loads | P1 | Smoke | 1) Open login URL | Login form with VWO branding is displayed | FR-01 |

### P — Parameters
- Deterministic output: same input → same output.
- Every assertion traceable to a PRD requirement.
- If information is missing or unclear: "Insufficient information to determine."
- If a detail is inferred: "Inference (low confidence)."
- No invented error messages, thresholds, timeouts, or credential values.
- Priority scale: P1 (critical), P2 (high), P3 (medium).

### O — Output
- Format: Markdown tables, one table per functional area.
- Columns in order: ID | Title | Priority | Type | Precondition | Steps | Expected Result | PRD Ref.
- Plus: Verified Facts, Missing/Unknown Information, Traceability Matrix, Self-Validation.

### T — Tone
Technical, precise, output-only. No marketing language, no speculation.
```

---

## 2. Step 1 — Verified Facts (extracted from PRD)

| Ref | Verified fact | PRD section |
|---|---|---|
| FR-01 | Login uses email + password authentication; page URL referenced is app.vwo.com/login | Authentication System → Login Process; Existing Features |
| FR-02 | Session management with configurable timeout | Authentication System → Login Process |
| FR-03 | Optional MFA/2FA support | Authentication System → Login Process |
| FR-04 | SSO integration for organizational accounts (SAML, OAuth) | Login Process; Third-Party Services |
| FR-05 | Field validation occurs on blur | User Input Validation |
| FR-06 | Email format validated; specialized mobile keyboard | User Input Validation |
| FR-07 | Password strength indicators shown | User Input Validation |
| FR-08 | Clear, actionable error messages for failed authentication | User Input Validation |
| FR-09 | Forgot password flow with secure token generation | Password Management |
| FR-10 | Email-based password recovery; multiple recovery options | Password Management |
| FR-11 | Enforced password complexity standards | Password Management |
| FR-12 | Remember Me checkbox exists | Existing Features |
| FR-13 | Responsive, mobile-optimized, touch-friendly interface | Interface Design |
| FR-14 | Auto-focus on first input; clickable labels | Interface Design |
| FR-15 | Loading state feedback during authentication | Interface Design |
| FR-16 | ARIA labels, keyboard navigation, screen reader support | Accessibility Features |
| FR-17 | High contrast mode option | Accessibility Features |
| FR-18 | Light and Dark Mode options in announcement banner | Existing Features; Theme Support |
| FR-19 | Account registration / free-trial link | Existing Features |
| FR-20 | Login success/failure tracked by analytics | Analytics Integration |
| FR-21 | Rate limiting against brute force | Compliance Standards |
| FR-22 | HTTPS/TLS enforced; encrypted transmission; encrypted password storage | Data Protection |
| FR-23 | Login page load target < 2 seconds on standard connections; CDN and asset optimization | Load Time Optimization |
| FR-24 | Redirect to main dashboard after successful authentication | VWO Core Platform |
| FR-25 | Dashboard must not be reachable without successful authentication | Business Objectives; Security Metrics |
| FR-26 | Support integration for login assistance | Customer Support |
| FR-27 | Page load, login success rate ≥ 95%, 99.9% uptime targets | Success Metrics and KPIs |

---

## 3. Step 2 — Missing / Unknown Information

| Ref | Missing information | Impact |
|---|---|---|
| MI-01 | No valid/invalid test credentials provided | TC-040, TC-041, TC-042, TC-043, TC-046, TC-050, TC-053, TC-056 are data-dependent |
| MI-02 | Exact error message copy for each failure type | Expected results state "message text: Insufficient information to determine." |
| MI-03 | Password complexity rule values (length, character classes) | TC-054 cannot assert a specific policy |
| MI-04 | Session timeout duration and Remember Me persistence duration | TC-031, TC-091 cannot assert a timeframe |
| MI-05 | 2FA methods, enrollment flow, and test accounts | TC-100, TC-101 data-dependent |
| MI-06 | SSO test tenant / IdP configuration | TC-102, TC-103 data-dependent |
| MI-07 | Rate-limit / lockout threshold and window | TC-093 cannot assert a threshold |
| MI-08 | Analytics platform and event names | TC-113 verification method undefined |
| MI-09 | Responsive breakpoints and supported browser matrix | TC-007 uses representative viewports only |
| MI-10 | Whether light/dark preference persists across sessions | TC-072 marked as unverifiable from PRD |
| MI-11 | Definition of "standard connection" for the 2s target | TC-002 measurement profile is an assumption |
| MI-12 | Which PRD features are actually implemented in the live app | All cases are requirement-based; verify implementation before execution |
| MI-13 | Recovery options other than email | TC-050 covers email only; others unverifiable |

---

## 4. Step 3 — Generated Test Cases (67)

Test cases are organized by area in [`TestCases/`](./TestCases/), one file per area:

| # | File | Area | Cases |
|---|---|---|---|
| 01 | [01_Page_Load_and_Interface.md](./TestCases/01_Page_Load_and_Interface.md) | Page Load and Interface | 7 |
| 02 | [02_Email_Field_Validation.md](./TestCases/02_Email_Field_Validation.md) | Email Field Validation | 8 |
| 03 | [03_Password_Field.md](./TestCases/03_Password_Field.md) | Password Field | 4 |
| 04 | [04_Remember_Me.md](./TestCases/04_Remember_Me.md) | Remember Me | 4 |
| 05 | [05_Authentication.md](./TestCases/05_Authentication.md) | Authentication | 9 |
| 06 | [06_Password_Management.md](./TestCases/06_Password_Management.md) | Password Management | 7 |
| 07 | [07_Registration_and_Support_Links.md](./TestCases/07_Registration_and_Support_Links.md) | Registration and Support Links | 2 |
| 08 | [08_Theme_Branding_Visual_Design.md](./TestCases/08_Theme_Branding_Visual_Design.md) | Theme, Branding, Visual Design | 4 |
| 09 | [09_Accessibility.md](./TestCases/09_Accessibility.md) | Accessibility | 7 |
| 10 | [10_Session_and_Security.md](./TestCases/10_Session_and_Security.md) | Session and Security | 6 |
| 11 | [11_Enterprise_Authentication.md](./TestCases/11_Enterprise_Authentication.md) | Enterprise Authentication | 5 |
| 12 | [12_Performance_Scalability_Analytics.md](./TestCases/12_Performance_Scalability_Analytics.md) | Performance, Scalability, Analytics | 4 |

The full index, missing-information log, and traceability matrix live in
[`TestCases/README.md`](./TestCases/README.md).

---

## 5. Step 4 — Self-Validation Check

| Check | Result |
|---|---|
| Every test case mapped to a PRD requirement | Pass — no orphan cases |
| Test cases exceeding PRD scope | Pass — none; security-adjacent cases limited to observable behavior |
| Invented error messages or codes | Pass — unspecified copy marked "Insufficient information to determine" |
| Invented credentials or data | Pass — all credential-dependent cases marked data-dependent (MI-01) |
| Invented thresholds, durations, or policies | Pass — marked unknown (MI-02 to MI-11) |
| Assumption of implemented features | Pass — implementation status flagged as unverified (MI-12) |
| Inference labelling | Pass — TC-002, TC-086, TC-091, TC-095 labelled "Inference (low confidence)" |
| Priority and type assigned to all cases | Pass |
| Positive, negative, boundary, security, accessibility, performance coverage | Pass |
| Duplicate test cases | Pass — none |

---

Generated from the provided PRD only. Features, messages, thresholds, and credentials not stated in the PRD are explicitly marked as unknown or low-confidence inference.
