# Test Cases — VWO Login Dashboard: Accessibility

Source: `../Input/Product Requirements Document_ VWO Login Dashboard.docx`  
Rules: `../AntiHalllucinationRule.md`  
Index: `README.md`

---

| ID | Title | Priority | Type | Precondition | Steps | Expected Result | PRD Ref |
|---|---|---|---|---|---|---|---|
| TC-080 | Full keyboard navigation | P2 | A | Login page loaded | 1) Traverse the form using Tab and Shift+Tab | All interactive elements reachable in logical order | FR-16 |
| TC-081 | Visible focus indicator | P2 | A | Login page loaded | 1) Tab through controls | Focus is visibly indicated on each control | FR-16 |
| TC-082 | Screen reader semantics | P2 | A | Screen reader enabled | 1) Navigate form with screen reader | Labels, roles, and states announced correctly | FR-16 |
| TC-083 | High contrast support | P3 | A | High contrast option available | 1) Enable high contrast 2) Inspect page | Content remains readable with sufficient contrast | FR-17 |
| TC-084 | Enter key submits form | P3 | A | Valid input present | 1) Focus a field 2) Press Enter | Form submits as with the Login control | FR-16 |
| TC-085 | Automated WCAG 2.1 AA scan | P2 | A | Login page loaded | 1) Run axe-core/Lighthouse | No critical violations against WCAG 2.1 AA | FR-16, WCAG |
| TC-086 | Error announced to assistive tech | P3 | A | Invalid input submitted | 1) Trigger validation error 2) Observe announcement | Error conveyed via live region or alert role. Implementation: Inference (low confidence) | FR-16 |
