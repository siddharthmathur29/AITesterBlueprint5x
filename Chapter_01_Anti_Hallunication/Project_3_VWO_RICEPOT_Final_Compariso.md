# Project 3 - VWO Login Test Case Generation: RICE-POT and Anti-Hallucination

**Assignment:** Generate VWO login test cases without and with anti-hallucination rules; identify information gaps; provide missing information; regenerate test cases; compare the outputs and assess accuracy.

**Application under test:** https://app.wingify.com/#/login  
**Requirement source:** *Product Requirements Document: VWO Login Dashboard* (7 pages, supplied in the assignment).  
**Other source:** *VWO Test Case Analysis.pdf* (Version B result generated independently from the PRD).  
**Methodology:** RICE-POT (Role, Instructions, Context, Example, Parameters, Output, Tone).

> **Evidence distinction.** Versions A and B below are outputs supplied from separate ChatGPT conversations. Version C is the evidence-informed revision prepared for this assignment from the previously observed VWO UI and reported local Playwright outcomes. It is *not* presented as an independently executed second application test run. The exact full text of the initial prompts was not supplied here; the prompt templates in Section 1 are faithful working reconstructions, not verbatim transcripts.

## Executive summary

| Measure | Version A - without rules | Version B - with rules | Version C - supplied evidence |
|---|---|---|---|
| Designed test cases | 12 | 26 | 26 scenarios reconciled and triaged |
| Explicit distinct information-gap topics | Not systematically counted | **20 (G01-G20)** | Same 20 tracked; **6 partially informed**, **14 without new evidence**, **0 fully closed** |
| Case readiness | Not classified | 2 ready; 10 need UI verification; 14 blocked | 4 locally evidenced UI behaviors; 1 valid-login test skipped; remaining coverage unverified/blocked |
| Fabricated implementation specifics | Multiple unsupported specifics | Avoids invented messages, timeouts, URL, OTP type, etc. | Replaces some unspecified details with observed UI behavior |
| Application tests executed in generating these documents | None in Version A | None in Version B | Earlier local Playwright runs were reported separately; no new tests were executed for this report |

**Overall finding:** The anti-hallucination rules produced a more traceable and cautious design. They did not prove that more features exist, and they did not execute tests. The change from 12 to 26 cases also represents expanded test coverage, so the count alone is not a valid measure of accuracy.

## 1. Prompt designs for reproducing the experiment

### Version A - RICE-POT prompt without explicit anti-hallucination rules

- **Role:** Act as an experienced QA Test Engineer.
- **Instructions:** Use the attached VWO Login Dashboard PRD to design functional, negative, security, and usability test cases for the VWO login page.
- **Context:** Target https://app.wingify.com/#/login. Use the provided PRD.
- **Example:** Provide a row with test ID, scenario, preconditions/test data, steps, expected result, and priority.
- **Parameters:** Focus on authentication, validation, password recovery, sessions, MFA, SSO, security, and dashboard navigation.
- **Output:** Produce a structured Markdown test-case table.
- **Tone:** Clear and professional.

This is a *reconstruction of the baseline prompt format*, because the literal original prompt message was not provided. Version A results below are the actual output copied into the conversation.

### Version B - Same RICE-POT request plus anti-hallucination rules

Keep the same base RICE-POT request and add these six rules:

1. **No assumptions:** Do not invent application behavior, exact validation copy, redirects, security thresholds, or authentication workflows.
2. **Source traceability:** Reference the relevant PRD page and section for every test; distinguish requirements from observed behavior.
3. **Identify missing information:** Where necessary specifics are absent, write **"Insufficient information to determine."**
4. **No fabricated expected results:** Do not invent OTP lengths, lockout durations, password rules, session lengths, or UI details.
5. **Clarification required:** List distinct missing details, ask specific resolution questions, and identify affected test cases.
6. **Explicit readiness:** Classify cases as **Ready for Execution**, **Requires UI Verification**, or **Blocked - Requires Additional Information**. Never represent test design as test execution.

**Controlled comparison:** Both prompts use the same PRD. Version B did *not* use any earlier live UI observations or Playwright results, as stated by its PDF source.

## 2. Version A - 12 baseline test cases (without anti-hallucination)

This table preserves the substance, test data, and stated outcomes in the baseline provided by the user. Expected results below are **claims made by the baseline output**, not independently verified system behavior.

| ID | Scenario | Data/preconditions | Steps | Version A expected result | Priority |
|---|---|---|---|---|---|
| A01 | Valid login | Registered email and valid password | Submit valid credentials | User redirects to `/#/dashboard` | High |
| A02 | Invalid login | Registered email and incorrect password | Submit credentials | `Invalid email or password` | High |
| A03 | Both fields blank | Empty email and password | Click Sign in | `Email is required` and `Password is required` | High |
| A04 | Malformed email | `invalidemail` | Submit malformed email | `Please enter a valid email address` | Medium |
| A05 | Forgot Password | Registered email | Click recovery, enter email, submit | Route `/#/forgot-password`; reset link sent | High |
| A06 | Remember Me | Valid credentials, Remember Me enabled | Check option, sign in, reopen browser | Session persists for **30 days** | Medium |
| A07 | MFA | MFA-enabled account | Submit valid credentials | **Six-digit SMS** verification code sent | High |
| A08 | Rate limiting | Incorrect password | Attempt login five times | Locked out for **15 minutes** | High |
| A09 | Password rules | `abc123` | Enter weak password and try login | Requires **eight characters and a special character** | Medium |
| A10 | SSO/social login | Google or enterprise SSO account | Select provider | Redirects to identity provider | Medium |
| A11 | HTTPS security | Login URL | Inspect connection | HTTPS with valid TLS certificate | High |
| A12 | Dashboard | Authenticated user | Sign in and inspect dashboard | User account info and VWO features displayed | High |

**Baseline issue:** Eleven scenarios (A01-A10 and A12) contain at least one implementation-specific claim or unsupported condition requiring verification. A11 aligns with the HTTPS requirement, although actual TLS behavior still requires checking. This is the baseline's stated audit conclusion, not a count of confirmed application defects.

## 3. Version B - 26 PRD-traceable cases (with anti-hallucination)

The following table distills the **26 cases in the uploaded Version B PDF**, retaining IDs, scenarios, source page, and recorded readiness. This version contains **no executed test outcomes**.

| ID | Scenario | PRD page | Version B readiness | Missing/conditional detail |
|---|---|---:|---|---|
| B01 | Valid email/password login | 2, 4 | Blocked | Authorized account; exact dashboard destination |
| B02 | Invalid credentials | 2 | UI verification | Exact error message |
| B03 | Empty email and password | 2, 6 | Blocked | Empty-field behavior and exact feedback |
| B04 | Invalid email format | 2 | UI verification | On-blur feedback and wording |
| B05 | Password strength feedback | 2 | UI verification | Applicable screen, thresholds, labels |
| B06 | Password complexity enforcement | 2 | Blocked | Rules and applicable creation/reset workflow |
| B07 | Forgot Password and recovery | 2 | Blocked | Recovery details, token expiry, account access |
| B08 | Remember Me | 2, 5 | Blocked | Meaning and persistence duration |
| B09 | Session timeout | 2 | Blocked | Idle/absolute timeouts and session-expiry behavior |
| B10 | MFA | 2 | Blocked | Factor, challenge rules, test account |
| B11 | Enterprise SSO | 2, 4 | Blocked | Identity provider, tenant, configuration |
| B12 | Social login | 4 | Blocked | Enabled providers and deployment status |
| B13 | Brute-force/rate limiting | 3 | Blocked | Threshold, scope, response, authorized environment |
| B14 | HTTPS enforcement | 3 | Ready for execution | Must actually inspect TLS/network behavior |
| B15 | New-user registration link | 2, 4 | UI verification | Link and signup destination |
| B16 | Initial focus and clickable labels | 3 | UI verification | Deployed behavior not confirmed |
| B17 | Authentication loading feedback | 3 | UI verification | Actual loading indicator |
| B18 | Keyboard and screen-reader support | 3 | UI verification | Real keyboard/accessible control behavior |
| B19 | High-contrast option | 3 | UI verification | Availability and activation |
| B20 | Light/dark mode | 3 | UI verification | Availability and persistence |
| B21 | Responsive login UI | 3 | UI verification | Supported viewports/breakpoints |
| B22 | Login page performance | 4 | Blocked | Definition of 2-second measurement and standard connection |
| B23 | Password storage security | 3 | Blocked | Authorized backend/security audit evidence |
| B24 | Login analytics integration | 4 | Blocked | Event schema and analytics access |
| B25 | WCAG 2.1 AA evaluation | 6 | Ready for execution | Formal audit still needs to be performed |
| B26 | Returning-user context preservation | 5 | Blocked | Expected remembered content and session conditions |

**Version B totals (as reported in source):** 26 designed; 2 ready for execution, 10 require UI verification, 14 blocked. Both 'ready' cases are *not* shown as executed.

## 4. Twenty distinct information gaps identified by Version B

The gap IDs, clarification areas, and affected case IDs below follow the uploaded Version B report.

| Gap | Missing information / clarification | Affected B tests | Evidence now supplied? |
|---|---|---|---|
| G01 | Canonical environment and approved login/post-login URLs | B01, B07, B11, B12, B14, B15 | **Partial:** tested login host known; post-login route unknown |
| G02 | Authorized accounts, recovery access, MFA/enterprise fixtures, credential delivery | B01, B02, B07-B12, B24, B26 | **Partial:** lack of valid account established; synthetic invalid inputs possible |
| G03 | Blank/malformed/invalid login behavior, exact messages, timing/on-blur validation | B02-B04 | **Partial:** observed generic message after submitting three input scenarios; blur behavior unknown |
| G04 | Password length, allowed chars, complexity requirements | B06 | No new evidence |
| G05 | Password strength indicator screen, thresholds, labels | B05 | No new evidence |
| G06 | Recovery steps, email/token method, expiry, reuse, confirmation | B07 | **Partial:** Forgot Password navigation route verified; reset submission unknown |
| G07 | Remember Me semantics and persistence period | B08 | No new evidence |
| G08 | Idle and absolute session timeout, expiration response | B09, B26 | No new evidence |
| G09 | Enabled MFA factors, challenge expiry, retries, recovery | B10 | No new evidence |
| G10 | Enterprise SSO providers, protocols, test tenant | B11 | No new evidence |
| G11 | Social login providers and rollout status | B12 | No new evidence |
| G12 | Rate-limit threshold, window, scope, throttle response | B13 | No new evidence |
| G13 | Which Phase 1-3 features are actually deployed | B05, B10-B12, B15-B21, B24 | **Partial:** core login and Forgot Password button observed, not full rollout |
| G14 | Registration/free-trial destination and expected workflow | B15 | No new evidence |
| G15 | Light/dark/high-contrast activation and persistence | B19-B20 | No new evidence |
| G16 | Official browsers, devices, viewports, accessibility settings | B21 | **Partial:** Chromium desktop tested; official support matrix unknown |
| G17 | 'Standard connection', page-load metric, device/cache/repeat-run settings | B22 | No new evidence |
| G18 | Approved password hashing and audit artifacts | B23 | No new evidence |
| G19 | Login analytics schema, reporting, and verification access | B24 | No new evidence |
| G20 | Which previous-session activity should be restored | B26 | No new evidence |

**Gap count:** 20 distinct topics. After adding previously observed evidence, **6 topics are partially informed** (G01, G02, G03, G06, G13, G16); **14 have no new supporting evidence**; **none is fully closed**. This is an evidence-progress assessment, not a claim that fourteen product features are broken.

## 5. Information supplied after Version B (the controlled new evidence)

These observations were reported by the learner during the earlier Playwright assignment. They were **not** included in Version A or B generation.

| Evidence ID | Observation / evidence | Limits |
|---|---|---|
| E01 | Login page used for testing: `https://app.wingify.com/#/login` | PRD mentions `app.vwo.com`; canonical product environment not confirmed |
| E02 | Email locator: `page.getByRole('textbox', { name: 'Email address' })` | Observed in Playwright Codegen on that UI version |
| E03 | Password locator: `page.getByRole('textbox', { name: 'Password' })` | Observed in Playwright Codegen |
| E04 | Sign in locator: `page.getByRole('button', { name: 'Sign in', exact: true })` | Observed in Playwright Codegen |
| E05 | Invalid credentials, blank fields, and malformed-email submission displayed `Your email, password, IP address or location did not match` | Only the top-level message was confirmed; separate field-level/on-blur validation was **not ruled out** |
| E06 | Forgot Password button locator: `page.getByRole('button', { name: 'Forgot Password?' })` | Recovery form contents not documented |
| E07 | Clicking Forgot Password navigated to `https://app.wingify.com/#/forgot-password` | Does not prove reset-email/token behavior |
| E08 | No authorized VWO login credentials; `VWO_TEST_EMAIL`/`VWO_TEST_PASSWORD` deliberately empty; valid-login Playwright test reported skipped | Successful login/dashboard behavior cannot be asserted |
| E09 | Individual VWO UI tests for invalid login, blank submission, malformed submission and Forgot Password navigation were reported passed using Chromium | Test implementation evidence is *not* the same as proving broad feature compliance; no new run was performed for this comparison |

All observations are limited to the learner's earlier test sessions; the hosted product may change.

## 6. Version C - regenerated, evidence-informed test cases

These are **revised test-design cases**, not automatically passed tests. They keep the same 26 scenario IDs for direct comparison to Version B.

| C ID | Scenario | Revised test/expected behavior from available evidence | Current status |
|---|---|---|---|
| C01 | Valid login | Read authorized credentials from `.env`; use `test.skip()` when missing. Verify dashboard only after valid login and actual destination are observed. | **Skipped locally**; authorized account unavailable |
| C02 | Invalid login | Fill synthetic invalid email/password, click Sign in, assert visible message `Your email, password, IP address or location did not match`. | **Passed locally (reported)** |
| C03 | Blank submission | Leave both fields empty, click Sign in, assert observed generic message. Do **not** assert invented field-specific errors. | **Passed locally (reported)** |
| C04 | Malformed email | Submit `invalidemail` with synthetic invalid password; assert observed generic message. Test separate on-blur email validation only after observation. | **Passed for submit behavior (reported)**; blur unverified |
| C05 | Strength feedback | Inspect applicable entry/reset screen for an indicator. Do not assert strength labels without UI/requirements. | UI verification pending |
| C06 | Password complexity | Test on authorized registration/reset workflow once explicit requirements are available; do not infer login-field rules. | Blocked |
| C07 | Password recovery | Click observed `Forgot Password?` button and assert `https://app.wingify.com/#/forgot-password`; keep reset-email/token test separate. | **Navigation passed locally (reported)**; full recovery blocked |
| C08 | Remember Me | Verify control exists, then define persisted state/duration from approved policy. | Blocked |
| C09 | Session timeout | Test with authorized user against configured idle/absolute timeout. | Blocked |
| C10 | MFA | Use approved MFA-enabled test account; factor and steps not specified. | Blocked |
| C11 | Enterprise SSO | Validate only after approved provider and tenant are supplied. | Blocked |
| C12 | Social login | Discover whether social provider is enabled in target release; then test with approved account. | Blocked / feature availability unknown |
| C13 | Rate limiting | No repeated login attempts against public service. Requires authorized sandbox and explicit thresholds. | Blocked |
| C14 | HTTPS | Verify HTTPS page navigation and inspect TLS/network behavior; `https://` in the URL alone is not a complete security audit. | Not yet executed as dedicated test |
| C15 | Registration link | Identify actual control and destination before asserting signup workflow. | UI verification pending |
| C16 | Focus and labels | Inspect initial focus and click-to-focus behavior; derive actual accessible labels from UI. | UI verification pending |
| C17 | Loading state | Observe in controlled authentication request; do not invent spinner behavior. | UI verification pending |
| C18 | Keyboard/screen reader | Validate Tab sequence, Enter interactions, accessible names, and assistive-tech behavior. | Accessibility testing pending |
| C19 | High-contrast control | Confirm control is deployed and define activation expectations. | UI verification pending |
| C20 | Light/dark mode | Confirm real controls; no assumption that marketing banner means feature is deployed. | UI verification pending |
| C21 | Responsive layout | Execute against agreed device/viewport matrix; Chromium desktop alone does not prove mobile support. | Device/UI verification pending |
| C22 | Performance | PRD target is under 2 seconds, but test requires agreed load event, device and connection. | Blocked on measurement profile |
| C23 | Password storage | Obtain authorized architecture/audit evidence; UI tests cannot prove hashing. | Blocked |
| C24 | Analytics tracking | Use approved analytics event schema and access; login UI observation is insufficient. | Blocked |
| C25 | WCAG 2.1 AA | Perform targeted automated and manual checks against applicable WCAG criteria; no blanket compliance claim. | Dedicated audit not executed |
| C26 | Returning context | Need authorized account and explicit activity/restoration requirements. | Blocked |

**Rerun notes:** The user's prior Chromium full-suite summary was **6 passed / 1 skipped**, but that run included **two default Playwright example tests**. After identifying and removing those sample tests, the intended VWO-only suite comprises **four runnable test cases and one conditional skipped case**. The learner reported the individual four VWO tests passed; the final post-cleanup combined count was not separately pasted into this chat. Therefore, do not present a new measured VWO-only total without a fresh run.

## 7. Side-by-side accuracy comparison

| Topic | Version A claim without rules | Version B response with rules | Version C after user evidence | Why this matters |
|---|---|---|---|---|
| Invalid login | `Invalid email or password` | Exact text: insufficient information | Observed generic message with email/password/IP/location | Prevents hardcoding a wrong assertion |
| Empty fields | `Email is required` + `Password is required` | Empty validation details unavailable | Generic top-level error observed; field-level behavior unknown | Separates observed response from assumed field validation |
| Malformed email | `Please enter a valid email address` | Exact on-blur response unavailable | Generic error observed **on submit**; blur still unverified | Prevents claiming dedicated email-format validation based on submit only |
| Successful login | `/#/dashboard` | Destination unknown; account required | Keep conditional/skip without credentials | Avoids fabricating route or a passing login |
| Forgot Password | Reset email sent | Process and expiry unknown | Navigation to `/#/forgot-password` observed; reset delivery unknown | Keeps navigation and recovery fulfillment separate |
| Remember Me | Persists 30 days | Duration unspecified | Still unknown | No invented session retention period |
| MFA | Six-digit SMS | Factor and challenge unknown | Still unknown | Avoids assuming MFA provider/method |
| Rate limit | Five failures -> 15-min lock | Threshold and response unknown | Still unknown; do not stress public login | Avoids unsafe/unverified security tests |
| Password rules | Eight chars and special char | Password policy unknown | Still unknown | Avoids fabricated requirements |
| HTTPS/WCAG | Simple broad success expectations | Dedicated requirements-based assessments | Audits still pending | Prevents false security/compliance certification |

### Assessment against the five assignment instructions

1. **Generate without rules:** Completed by Version A with 12 cases; output preserved above.
2. **Apply anti-hallucination rules:** Completed by Version B with 26 requirements-traced cases, conditional expected results, and statuses.
3. **Find and count gaps:** Completed: **20 distinct missing-information topics**, individually listed in Section 4.
4. **Provide missing info and regenerate/compare:** Previously observed information supplied in Section 5; revised design and comparison in Sections 6-7. **Six topics only partially informed; request clarification for the rest.**
5. **Evaluate accuracy:** The rules improve **traceability, honesty about unknowns, prioritization, and suitability of assertions**. Not enough evidence exists to claim every new test is accurate or that the product meets the requirements.

## 8. Conclusion and limitations

The anti-hallucination rules made the resulting test design more defensible, especially by replacing unsupported exact error copy, token types, thresholds, and redirect URLs with explicit unknowns and clarification questions. Supplying actual UI observations made four login/recovery-navigation cases more precise without claiming features outside the observed behavior.

**Limits of this exercise:** No full authenticated VWO test account was available; the Version B PDF reports *no test execution*; 20 gap topics remain open in full or in part; a 26-vs-12 case comparison also reflects wider scope; and local previous Playwright execution is reported separately. Therefore, the conclusion is **improved test-case specification quality**, not verified overall application quality.

## 9. Submission checklist

- [x] Version A: 12 generated baseline test cases captured.
- [x] Version B: 26 generated requirements-based cases and 20 identified information gaps captured.
- [x] Information gaps tracked by IDs G01-G20 and linked to test cases.
- [x] Earlier live UI findings added after the initial independent generations.
- [x] Version C: evidence-informed revision and before/after comparison prepared.
- [ ] Run the final VWO-only Playwright suite again if an updated execution summary is required.
- [ ] Save this Markdown report under `Chapter_02_Anti_Hallucination/` in your GitHub project and push.
- [ ] Publish the GitHub file link and short summary in SDET Club assignment comments.

---

**Attribution:** Test-case generation exercise based on the VWO PRD supplied by Pramod Dutta / SDET Club as part of the AI 5X assignment. Screens and test results reflect learner-reported observations, not independent verification by this report's author.