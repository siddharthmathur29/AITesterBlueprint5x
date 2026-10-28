# Test Plan — KAN-4: Add a pass key and SSO Login to VMO Login Page

Status: Draft — pending human review
Author: GitHub Copilot
Date: 2026-10-28
Project: VWO / Bingify
Company context: VWO is an A/B testing platform used to optimize website experiences. This work affects the authentication layer on the VWO login page and must preserve existing sign-in flows while introducing Passkey and SSO options.

---

## 1. Scope & Objectives

### Objective
Validate that the VWO login page offers users a secure and convenient login experience through Passkey and SSO without breaking the existing email/password and Google login flows.

### In scope
- Add "Sign in using SSO" option to the VWO login page.
- Add "Sign in with Passkey" option to the VWO login page.
- Display both options below the existing "Sign in with Google" option.
- Support successful and unsuccessful authentication flows for Passkey and SSO.
- Display guidance when Passkey authentication is unavailable or unsupported.
- Maintain existing login functionality and compatibility with supported browsers and devices.

### Out of scope
- New identity provider onboarding beyond the specified SSO flow.
- Backend IdP setup or enterprise admin configuration tasks.
- Broad redesign of the login page beyond the requested option placement and UX wording.

---

## 2. Gaps & Questions for the author

| # | Area | Finding | Question to author |
|---|------|---------|--------------------|
| 1 | Functional | ⚠️ Ambiguous | Which SSO method is required: SAML, OAuth, OIDC, or a specific enterprise provider? |
| 2 | Functional | ⚠️ Ambiguous | What should be the exact click behavior when users select "Sign in using SSO" and which destination/URL is expected? |
| 3 | Functional | ⚠️ Ambiguous | What is the expected fallback UX when the browser/device does not support Passkey? |
| 4 | Functional | ⚠️ Ambiguous | Are there any specific error messages or copy requirements for unsupported Passkey or failed SSO attempts? |
| 5 | Data & environment | ⚠️ Ambiguous | Which browsers and devices are in scope for Passkey support (for example, Chrome, Safari, Edge, iOS/macOS)? |
| 6 | Security | ❌ Missing | Which roles/permissions or tenant-specific restrictions apply to SSO users and Passkey users? |
| 7 | Security | ⚠️ Ambiguous | Are there required security checks for phishing protection, multi-factor fallback, or session binding? |
| 8 | Non-functional | ❌ Missing | What are the performance expectations for page load, login latency, and failed authentication retry behavior? |
| 9 | Accessibility | ❌ Missing | Are there specific keyboard, screen-reader, and focus-order requirements for the new buttons and error states? |
| 10 | Integration | ⚠️ Ambiguous | Which third-party or internal identity services are expected to be integrated for this release? |

### Additional notes
This ticket provides a clear user story and scope but does not yet define the exact enterprise SSO provider, browser matrix, available error messages, or accessibility acceptance criteria. Those details are required for a complete test sign-off.

---

## 3. Test Scenarios (P0/P1/P2)

| ID | Priority | Type | Scenario | Maps to |
|---|---|---|---|---|
| TS-01 | P0 | Positive | User opens the VWO login page and sees the existing Google login option plus the new "Sign in using SSO" and "Sign in with Passkey" options below it. | Scope statement; UI placement |
| TS-02 | P0 | Positive | A user selects "Sign in using SSO" and is redirected to the configured SSO flow successfully. | User story; SSO functionality |
| TS-03 | P0 | Positive | A user selects "Sign in with Passkey" and authenticates successfully using a supported platform/browser. | User story; Passkey functionality |
| TS-04 | P0 | Negative | A user attempts SSO login with an invalid or expired identity token and sees an appropriate error message. | Error handling |
| TS-05 | P0 | Negative | A user attempts Passkey authentication when the device/browser does not support it and receives clear guidance. | Unsupported device guidance |
| TS-06 | P0 | Negative | Existing email/password login continues to work without regression after the UI change. | Preserve existing login functionality |
| TS-07 | P1 | Boundary | User tries Passkey or SSO on a supported browser with disabled credentials, blocked permissions, or unavailable device key. | Error and unsupported states |
| TS-08 | P1 | Positive | User uses keyboard-only navigation and is able to reach and activate both new login options. | Accessibility and usability |
| TS-09 | P1 | Negative | Screen-reader users can identify the purpose of each option and the outcome of failed attempts through accessible labels and messages. | Accessibility requirements |
| TS-10 | P1 | Positive | On mobile devices or browser emulation, the new options are visible, usable, and aligned correctly. | Responsive compatibility |
| TS-11 | P2 | Negative | User initiates login during a network failure, timeout, or provider outage and receives stable, non-breaking feedback. | Resilience |
| TS-12 | P2 | Positive | Login page remains stable when a user toggles between provider options and retries auth multiple times. | Recovery flow |

---

## 4. Test Data & Environment

### Test data
- Active VWO user account with email/password authentication.
- Test account configured for Google login.
- SSO-enabled account / tenant for enterprise login testing.
- Passkey-enabled user profile on a supported browser or device.
- Unsupported device/browser scenario for Passkey fallback testing.
- Invalid/expired SSO token or certificate scenario.
- User with blocked or disabled platform authenticator.

### Environment / configuration
- QA/Staging environment with login page loaded.
- Browser matrix: Chrome, Edge, Firefox, Safari (where available).
- Mobile test coverage: iOS Safari and Chrome on Android if applicable.
- Feature flags for login methods and identity provider configuration.
- Network conditions: normal, slow, and denied network conditions for retry and timeout validation.

### Roles / permissions
- Standard user login.
- Enterprise login / SSO user.
- Device with local security credentials configured for Passkey.
- User with unsupported or disabled Passkey capability.

---

## 5. Risks & Assumptions

### Assumptions made
- The login page uses a standard UI pattern with primary social auth buttons and additional provider options.
- "Sign in using SSO" likely routes to an external identity provider workflow.
- "Sign in with Passkey" is expected to use WebAuthn/passkey support and browser/platform credentials.
- Existing Google login remains in place and is not replaced by new options.

### Risks
- Passkey support may vary across browsers and devices, leading to inconsistent UX.
- SSO integration may fail for tenant-specific login URLs, domains, or certificates.
- Incomplete accessibility support could prevent keyboard and assistive technology users from navigating the new controls.
- Security checks may be missing for expired sessions, invalid tokens, or replay attempts.

---

## 6. Entry / Exit Criteria

### Entry criteria
- VWO login page build is available in QA/staging.
- Passkey and SSO configuration is enabled for test environments.
- Test users and SSO test tenant are available.
- Login page acceptance criteria and design references are approved or clarified.

### Exit criteria
- All P0 and high-priority scenarios pass.
- No critical or high-severity defects remain open.
- Error guidance and unsupported flows are validated.
- Accessibility and regression checks for login flows pass.
- Human reviewer confirms sign-off on assumptions and open questions.

---

## 7. Human Review Gate

- I assumed: SSO will use a standard provider flow with a redirect-based login experience and Passkey will rely on supported WebAuthn capabilities.
- I could not confirm: exact SSO provider type, browser matrix, required copy, enterprise tenant configuration, and accessibility acceptance criteria.
- Open questions blocking sign-off:
  1. Which SSO provider or protocol is required?
  2. What exact destination and no-provider fallback UX should the "Sign in using SSO" option use?
  3. Which browsers/devices are officially supported for Passkey?
  4. What are the expected error messages and guidance copy for unsupported Passkey or failed SSO login?
  5. Are there explicit accessibility requirements for keyboard, screen-reader, and focus management?
- Approve or edit before I continue with detailed test cases or automation.

---

## 8. Summary

KAN-4 introduces additional login options to the VWO login page and should be tested as a sign-in experience change, not simply as a UI add-on. The priority is to ensure no regression to existing authentication while validating successful and failed Passkey/SSO transactions, unsupported device scenarios, accessibility, and secure user guidance.
