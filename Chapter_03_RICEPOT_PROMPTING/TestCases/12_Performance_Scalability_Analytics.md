# Test Cases — VWO Login Dashboard: Performance, Scalability, and Analytics

Source: `../Input/Product Requirements Document_ VWO Login Dashboard.docx`  
Rules: `../AntiHalllucinationRule.md`  
Index: `README.md`

---

| ID | Title | Priority | Type | Precondition | Steps | Expected Result | PRD Ref |
|---|---|---|---|---|---|---|---|
| TC-110 | Static assets optimized | P3 | P | Login page loaded | 1) Inspect transferred assets and response headers | Images compressed, CSS/JS minified, CDN headers present | FR-23 |
| TC-111 | Concurrent login load test | P2 | P | Load-test environment and tooling | 1) Drive concurrent login attempts at agreed scale 2) Record latency and error rate | Success rate ≥ 95%, no degradation beyond agreed thresholds. Scale: Insufficient information to determine | FR-27, FR-23 |
| TC-112 | Availability target | P3 | P | Monitoring configured | 1) Review availability data for the measurement window | Uptime ≥ 99.9% | FR-27 |
| TC-113 | Login outcomes tracked in analytics | P3 | I | Analytics access | 1) Perform successful and failed logins 2) Inspect analytics events | Both outcomes recorded. Event names: Insufficient information to determine | FR-20 |

---
