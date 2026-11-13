# Test Cases — VWO Login Dashboard: Page Load and Interface

Source: `../Input/Product Requirements Document_ VWO Login Dashboard.docx`  
Rules: `../AntiHalllucinationRule.md`  
Index: `README.md`

---

| ID | Title | Priority | Type | Precondition | Steps | Expected Result | PRD Ref |
|---|---|---|---|---|---|---|---|
| TC-001 | Login page loads with VWO branding | P1 | Smoke | Network available | 1) Open https://app.vwo.com/login | Login form displayed with VWO branding, email field, password field, Login control, Remember Me, registration link | FR-01, FR-19 |
| TC-002 | Page load time under 2 seconds | P1 | P | Cold cache; defined connection profile | 1) Clear cache 2) Navigate 3) Measure load event | Load completes < 2s. Measurement profile: Inference (low confidence) | FR-23 |
| TC-003 | First input auto-focused | P3 | UI | Login page loaded | 1) Navigate to login 2) Observe focus | First input field has focus on load | FR-14 |
| TC-004 | Labels focus their input | P3 | A | Login page loaded | 1) Click email label 2) Click password label | Corresponding field receives focus | FR-14 |
| TC-005 | HTTPS-only access | P1 | S | DNS resolves | 1) Request http://app.vwo.com/login 2) Inspect scheme | Request served over HTTPS; plain HTTP redirects to HTTPS | FR-22 |
| TC-006 | Announcement banner with Light/Dark Mode | P3 | UI | Login page loaded | 1) Observe banner 2) Check theme controls | Banner and theme options visible per current UI announcement | FR-18 |
| TC-007 | Responsive layout at representative widths | P2 | UI | Login page loaded | 1) Set viewport 360x640 2) 768x1024 3) 1440x900 | No overflow/clipping; controls remain usable and touch-sized | FR-13 |
