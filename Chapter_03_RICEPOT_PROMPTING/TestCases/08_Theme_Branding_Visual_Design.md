# Test Cases — VWO Login Dashboard: Theme, Branding, and Visual Design

Source: `../Input/Product Requirements Document_ VWO Login Dashboard.docx`  
Rules: `../AntiHalllucinationRule.md`  
Index: `README.md`

---

| ID | Title | Priority | Type | Precondition | Steps | Expected Result | PRD Ref |
|---|---|---|---|---|---|---|---|
| TC-070 | Light mode renders correctly | P3 | UI | Theme control available | 1) Select Light 2) Inspect page | Page renders in light theme with legible contrast | FR-18 |
| TC-071 | Dark mode renders correctly | P3 | UI | Theme control available | 1) Select Dark 2) Inspect page | Page renders in dark theme with legible contrast | FR-18 |
| TC-072 | Theme preference persists | P3 | UI | Theme changed | 1) Reload page 2) Reopen session | Persistence behavior unspecified: Insufficient information to determine | FR-18 |
| TC-073 | Brand consistency | P3 | UI | Login page loaded | 1) Compare logo and palette with VWO design system | Branding matches the VWO design system | FR-18 |
