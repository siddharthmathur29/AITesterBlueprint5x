# Test Cases — \<JIRA-KEY>: \<FEATURE / STORY TITLE>

> **Status: DRAFT — pending human review.**  
> Test cases are not approved until the QA Lead / Test Owner signs off.

## 1. Test Case Overview

- **Jira ID:**
- **Feature / Module:**
- **User Story / Requirement:**
- **Application / Product:**
- **Release / Sprint:**
- **Test Case Author:**
- **Reviewer:**
- **Created Date:**
- **Test Case Version:**
- **Related Test Plan:**
- **Related Test Strategy:**

## 2. Test Coverage & Traceability

| Requirement / AC ID | Requirement Description | Test Case IDs | Coverage Status |
|---|---|---|---|
| AC-01 | | | Covered / Not Covered |
| AC-02 | | | Covered / Not Covered |
| AC-03 | | | Covered / Not Covered |

- **Total Requirements Identified:**
- **Requirements Covered:**
- **Requirements Not Covered:**
- **Coverage Gaps:**
- **Unverified Requirements:**

## 3. Test Case Summary

| Test Case ID | Priority | Test Type | Scenario | Preconditions | Expected Result | Maps to (AC / Requirement) |
|---|---|---|---|---|---|---|
| TC-001 | P0 | Positive | | | | AC-01 |
| TC-002 | P1 | Negative | | | | AC-02 |
| TC-003 | P1 | Boundary | | | | AC-03 |

### Test Case Classification

- **Positive Testing:** Validate expected behavior with valid inputs.
- **Negative Testing:** Validate application behavior with invalid or unexpected inputs.
- **Boundary Testing:** Validate minimum, maximum, and edge conditions.
- **Functional Testing:** Validate business functionality.
- **UI Testing:** Validate interface elements and user interactions.
- **API Testing:** Validate endpoints, requests, responses, and error handling.
- **Integration Testing:** Validate communication between dependent systems.
- **Security Testing:** Validate authentication, authorization, and access restrictions where applicable.
- **Regression Testing:** Validate that existing functionality remains unaffected.

## 4. Detailed Test Cases

### Test Case TC-001: \<Test Case Title>

| Field | Details |
|---|---|
| Test Case ID | TC-001 |
| Jira ID | |
| Test Scenario ID | TS-001 |
| Test Case Title | |
| Module / Feature | |
| Requirement / AC Reference | |
| Test Type | Positive / Negative / Boundary |
| Test Category | Functional / UI / API / Integration / Regression |
| Priority | P0 / P1 / P2 / P3 |
| Severity (if applicable) | Critical / High / Medium / Low |
| Test Level | Unit / Integration / System / Acceptance |
| Preconditions | |
| Dependencies | |
| Test Data | |
| Test Environment | |
| Execution Type | Manual / Automation / Both |
| Automation Status | Not Automated / Automated / Not Suitable |
| Tags | |

### Test Execution Steps

| Step No. | Action / Test Steps | Test Data / Input | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| 1 | | | | | Not Executed |
| 2 | | | | | Not Executed |
| 3 | | | | | Not Executed |
| 4 | | | | | Not Executed |

### Execution Details

- **Execution Status:** Not Executed / Pass / Fail / Blocked / Not Applicable.
- **Executed By:**
- **Execution Date:**
- **Build / Version:**
- **Environment:**
- **Defect ID (if failed):**
- **Evidence / Screenshot / Logs:**
- **Execution Comments:**

### Postconditions

- Expected application state after execution.
- Any data cleanup or reset required.
- Any dependent workflow affected.

---

## 5. Test Data Management

| Data ID | Data Description | Input Values | Expected Behavior | Data Type |
|---|---|---|---|---|
| TD-001 | Valid data | | | Positive |
| TD-002 | Invalid data | | | Negative |
| TD-003 | Boundary data | | | Boundary |
| TD-004 | Missing / Null data | | | Negative |

- **Test Data Source:**
- **Data Creation Requirements:**
- **Data Cleanup Requirements:**
- **Sensitive Data Considerations:**

## 6. Negative & Boundary Test Coverage

| Test Case ID | Validation Area | Input / Condition | Expected Result | Priority |
|---|---|---|---|---|
| TC-NEG-001 | Invalid input | | | P1 |
| TC-NEG-002 | Missing mandatory field | | | P1 |
| TC-BND-001 | Minimum allowed value | | | P1 |
| TC-BND-002 | Maximum allowed value | | | P1 |
| TC-BND-003 | Values beyond limits | | | P1 |
| TC-NEG-003 | Unauthorized access | | | P1 |

> Only include validations applicable to the actual requirements. Do not invent business rules or expected results.

## 7. API Test Cases (If Applicable)

| Test Case ID | API / Endpoint | Method | Request / Input | Expected Status Code | Expected Response | Validation |
|---|---|---|---|---|---|---|
| TC-API-001 | | GET / POST / PUT / DELETE | | | | |
| TC-API-002 | | | | | | |

### API Validation Checklist

- HTTP status codes.
- Response body and schema.
- Mandatory and optional fields.
- Data types and field validations.
- Authentication and authorization.
- Error response handling.
- Invalid and missing parameters.
- Response headers.
- Data persistence.
- Response time, where applicable.

## 8. UI Test Cases (If Applicable)

| Test Case ID | UI Component | Validation | Expected Result | Priority |
|---|---|---|---|---|
| TC-UI-001 | Page / Screen | Page loading | | P1 |
| TC-UI-002 | Button | Click behavior | | P1 |
| TC-UI-003 | Input Field | Field validation | | P1 |
| TC-UI-004 | Navigation | Navigation behavior | | P2 |

### UI Validation Checklist

- Page layout and alignment.
- Labels and placeholder text.
- Mandatory field indicators.
- Button visibility and functionality.
- Error and success messages.
- Responsive behavior.
- Browser compatibility.
- Keyboard navigation and accessibility, where applicable.

## 9. Test Execution Summary

| Metric | Count |
|---|---|
| Total Test Cases | |
| Executed | |
| Passed | |
| Failed | |
| Blocked | |
| Not Executed | |
| Not Applicable | |
| Defects Identified | |

- **Execution Pass Percentage:**
- **Critical Defects:**
- **High-Priority Defects:**
- **Overall Execution Status:**
- **Outstanding Issues:**

## 10. Automation Readiness & Recommendations

| Test Case ID | Automation Suitability | Reason | Recommended Tool | Automation Status |
|---|---|---|---|---|
| TC-001 | High / Medium / Low | | Selenium / Playwright | Pending |
| TC-002 | High / Medium / Low | | REST Assured / Karate | Pending |

- **Automation Candidates:**
- **Manual-Only Scenarios:**
- **Framework Dependencies:**
- **Required Test Data:**
- **Automation Priority:**
- **Expected Automation Benefits:**

> Automation suitability must be based on stability, repeatability, business value, and maintenance effort. Do not recommend automating every test case.

## 11. Risks & Assumptions

- **Assumptions Made:**
- **Unconfirmed Business Rules:**
- **Missing Requirements:**
- **External Dependencies:**
- **Test Environment Risks:**
- **Data Availability Risks:**
- **Potential Coverage Gaps:**

## 12. Entry & Exit Criteria

### Entry Criteria

- Requirements and acceptance criteria are available.
- Test cases are reviewed and approved.
- Test environment is accessible.
- Required test data is available.
- Build is deployed and ready for testing.
- Dependencies are available.

### Exit Criteria

- All planned test cases are executed.
- Agreed test coverage is achieved.
- Critical and high-priority defects are resolved or formally accepted.
- Failed test cases are investigated.
- Regression impact is assessed.
- Execution evidence is captured.
- Test execution summary is prepared.
- QA sign-off is obtained.

---

# HUMAN REVIEW GATE

> **AI-generated test cases must remain in DRAFT until reviewed and approved by the QA owner.**

### Review Findings

- **I assumed:**
  - …
- **I could not confirm:**
  - …
- **I identified missing scenarios:**
  - …
- **I identified requirement ambiguities:**
  - …
- **I could not derive expected results for:**
  - …
- **I recommend additional coverage for:**
  - …

### Test Case Review Checklist

| Review Item | Status | Reviewer Comments |
|---|---|---|
| Requirements traceability verified | Pending | |
| Positive scenarios reviewed | Pending | |
| Negative scenarios reviewed | Pending | |
| Boundary scenarios reviewed | Pending | |
| Expected results validated | Pending | |
| Test data reviewed | Pending | |
| Preconditions and dependencies verified | Pending | |
| Duplicate test cases checked | Pending | |
| Automation suitability reviewed | Pending | |
| Coverage gaps addressed | Pending | |

### Final Approval

- **Prepared By:**
- **Reviewed By:**
- **Approved By:**
- **Approval Date:**
- **Version:**

**Final Status:** DRAFT — Awaiting QA Owner Approval.

**Important:** Do not automatically execute test cases, generate automation scripts, or mark requirements as covered until the relevant human review and approval are completed.