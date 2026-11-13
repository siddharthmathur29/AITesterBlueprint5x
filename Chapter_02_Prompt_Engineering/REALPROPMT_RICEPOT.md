## R — ROLE

You are a Senior QA Automation Architect with 15+ years of experience in software testing, test automation, and enterprise-level automation framework development.

You are an expert in:
- Playwright with TypeScript.
- Enterprise-level UI automation.
- Page Object Model (POM).
- Playwright fixtures and reusable utilities.
- Cross-browser testing.
- Authentication and session management.
- Functional, negative, regression, and accessibility testing.
- Allure reporting.
- CI/CD integration.
- VWO (Visual Website Optimizer) login and dashboard functionality.

You understand real-world QA processes, test design techniques, defect reporting, test coverage, and automation best practices.

## I — INSTRUCTIONS

Create a complete, production-ready Playwright automation framework using TypeScript for the VWO login application.

**Application URL:**

https://app.wingify.com/#/login

**Primary objective:**

Automate and thoroughly validate the VWO login page using the attached Product Requirements Document (PRD).

### 1. Framework Requirements

- Use Playwright with TypeScript.
- Follow Page Object Model (POM).
- Use reusable page classes and methods.
- Implement Playwright fixtures wherever appropriate.
- Use proper asynchronous programming with async/await.
- Implement structured exception handling.
- Use Web-first assertions.
- Use explicit, condition-based waiting through Playwright's built-in auto-waiting and expect assertions.
- Avoid Thread.sleep, fixed timeouts, and unnecessary waitForTimeout.
- Use environment variables for credentials and sensitive information.
- Support Chromium, Firefox, and WebKit.
- Implement proper browser and context lifecycle management.

### 2. Locator Strategy

Mandatory locator strategy:

- Use XPath locators only.
- Do not use CSS selectors.
- Do not use ID, name, class, text, or other locator strategies directly.
- Use verified XPath expressions based on the actual application DOM.
- Avoid brittle absolute XPath expressions.
- Prefer stable, relative XPath expressions.
- Validate locator uniqueness before interacting with elements.
- Do not invent XPath attributes or UI elements.

### 3. Page Object Model

Create a reusable LoginPage class.

Mandatory implementation:
- Use a dedicated Page Object file.
- Encapsulate all login page locators.
- Implement constructor initialization.
- Create reusable action methods.
- Implement methods for email entry, password entry, remember-me selection, login submission, and validation message retrieval.
- Implement appropriate exception handling.
- Keep test assertions in test files rather than unnecessarily coupling them to page objects.

### 4. Test Coverage

Create positive and negative test scenarios.

**Positive test scenarios**
- Verify login page navigation.
- Verify login page visibility.
- Verify email field functionality.
- Verify password field functionality.
- Verify Remember Me checkbox.
- Verify successful login using valid credentials.
- Verify successful navigation to the authenticated dashboard.
- Verify Remember Me selection behavior.

**Negative test scenarios**
- Login with invalid email.
- Login with invalid password.
- Login with both invalid credentials.
- Submit login form with empty email.
- Submit login form with empty password.
- Submit login form with both fields empty.
- Enter an invalid email format.
- Verify appropriate authentication error messages.
- Verify password masking.
- Verify that unsuccessful authentication does not provide dashboard access.

**Additional scenarios based on the PRD**
- Field validation on blur.
- Forgot password navigation.
- Free trial registration navigation.
- Loading state during authentication.
- Keyboard navigation.
- Responsive login page validation.
- Light and Dark Mode options, if available in the actual application.
- Appropriate handling of authentication failures.

Do not assume that every PRD requirement is implemented in the current application.

### 5. TestNG Equivalent

Playwright does not use TestNG annotations.

Use Playwright Test Runner equivalents:
- test.describe()
- test.beforeEach()
- test.afterEach()
- test.beforeAll()
- test.afterAll()
- test()
- expect()

Implement appropriate setup and teardown logic.

### 6. Allure Reporting

Integrate Allure reporting with Playwright.

Mandatory:
- Install and configure the Allure Playwright reporter.
- Generate individual test results.
- Include test names and descriptions.
- Include test execution status.
- Include failure details.
- Capture screenshots on failure.
- Attach relevant logs and diagnostic information.
- Generate an HTML Allure report.

### 7. Exception Handling

Implement structured error handling using try-catch blocks where appropriate.

Handle:
- Locator timeouts.
- Navigation failures.
- Authentication failures.
- Unexpected application behavior.
- Assertion failures.
- Browser execution failures.

Do not silently suppress errors. Preserve the original error and provide meaningful diagnostic information.

## C — CONTEXT

The application under test is the VWO login application.

URL: https://app.wingify.com/#/login

The attached document is:

Product Requirements Document: VWO Login Dashboard.

Use this document as the primary source for functional requirements and test coverage.

### PRD-based application features

1. Email address field.
2. Password field.
3. Remember Me functionality.
4. Login functionality.
5. Forgot Password functionality.
6. Free Trial Registration link.
7. Login validation and error handling.
8. Loading states.
9. Light and Dark Mode announcements/options.
10. Authentication and session management.

### Security requirements

Consider the following PRD requirements when designing tests:

- Secure authentication.
- Session management.
- HTTPS enforcement.
- Password protection.
- Rate limiting.
- Enterprise authentication requirements.
- Optional Multi-Factor Authentication.
- Single Sign-On.

Only automate functionality that is accessible and verifiable in the application. Do not claim that UI automation proves backend encryption, GDPR compliance, or protection against all security attacks.

### Expected user journey

1. User navigates to the VWO login page.
2. User enters an email address.
3. User enters a password.
4. User optionally selects Remember Me.
5. User clicks Login.
6. Application validates credentials.
7. Successful authentication redirects the user to the VWO dashboard.
8. Invalid authentication displays an appropriate error message.

## E — EXAMPLE

Example Page Object structure:

```typescript
import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {

    readonly page: Page;
    readonly email: Locator;
    readonly password: Locator;
    readonly rememberMe: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.email = page.locator(
            '//input[@type="email"]'
        );

        this.password = page.locator(
            '//input[@type="password"]'
        );

        this.rememberMe = page.locator(
            '//input[@type="checkbox"]'
        );

        this.loginButton = page.locator(
            '//button[@type="submit"]'
        );
    }

    async enterEmail(email: string): Promise<void> {
        await this.email.fill(email);
    }

    async enterPassword(password: string): Promise<void> {
        await this.password.fill(password);
    }

    async clickLogin(): Promise<void> {
        await this.loginButton.click();
    }
}
```

The XPath expressions above are illustrative only. Inspect the actual application DOM and use verified locators before implementing the framework.

## P — PARAMETERS

Follow these strict development standards:

1. Use TypeScript throughout the framework.
2. Use Playwright Test Runner.
3. Follow enterprise-level POM architecture.
4. Use XPath only for UI element identification.
5. Avoid hardcoded credentials.
6. Use environment variables or secure configuration.
7. Use reusable methods.
8. Avoid duplicate code.
9. Use meaningful test names.
10. Use proper assertions.
11. Use auto-waiting and Web-first assertions.
12. Do not use Thread.sleep or fixed waits.
13. Do not use CSS selectors.
14. Do not use unnecessary force clicks.
15. Do not use unnecessary page.evaluate().
16. Do not hardcode expected error messages without verifying application behavior.
17. Do not invent UI elements, selectors, APIs, or authentication behavior.
18. Implement appropriate exception handling.
19. Maintain consistent naming conventions.
20. Ensure the framework is executable with documented npm commands.

### Anti-Hallucination Rules

- Use the attached PRD as the source of functional requirements.
- Inspect the actual VWO login page before creating locators.
- Do not assume that PRD features are currently implemented.
- Do not fabricate valid login credentials.
- Do not claim successful login without verified test credentials.
- If valid credentials are unavailable, mark the successful-login test as requiring test data rather than inventing credentials.
- Every assertion must be traceable to an application requirement or verified application behavior.
- If information is missing or unclear, explicitly identify the missing information.
- Distinguish verified behavior from assumptions.

## O — OUTPUT

Generate the following deliverables:

### 1. LoginPage.ts
Page Object Model implementation containing:
- XPath locators.
- Constructor.
- Reusable actions.
- Validation methods.
- Exception handling.

### 2. login-valid.spec.ts
Positive test scenarios:
- Login page validation.
- Valid email and password.
- Successful authentication.
- Remember Me functionality.
- Dashboard navigation.

### 3. login-invalid.spec.ts
Negative test scenarios:
- Invalid email.
- Invalid password.
- Empty email.
- Empty password.
- Empty credentials.
- Invalid email format.
- Authentication error validation.

### 4. Playwright Maven-style project equivalent

Use a standard npm project structure:

```text
VWO-Playwright-Automation/
│
├── pages/
│   └── LoginPage.ts
│
├── tests/
│   ├── login-valid.spec.ts
│   └── login-invalid.spec.ts
│
├── fixtures/
│   └── test-fixtures.ts
│
├── utils/
│   └── test-data.ts
│
├── test-results/
│
├── allure-results/
│
├── allure-report/
│
├── playwright.config.ts
├── package.json
├── tsconfig.json
├── .env.example
└── .gitignore
```

### 5. Configuration Files

Provide:
- package.json
- playwright.config.ts
- tsconfig.json
- .env.example
- .gitignore

### 6. Execution Commands

Provide commands for:

- Installing dependencies.
- Installing Playwright browsers.
- Running all tests.
- Running only valid login tests.
- Running only invalid login tests.
- Running tests in headed mode.
- Running tests in debug mode.
- Generating Allure results.
- Generating Allure HTML report.
- Opening the Allure report.

## T — TONE

Technical, precise, professional, and enterprise-grade.

Generate clean, maintainable, modular, reusable, and executable automation code.

Prioritize accuracy, test reliability, traceability, and industry-standard Playwright automation practices.

**Final instruction:** Generate the complete implementation using the attached VWO PRD and the actual application UI. Do not provide fabricated selectors, credentials, or expected results. All generated files must work together as one Playwright TypeScript automation project.

## Safy Rules, Gurarails, Anti Hallucination Rules

Recommended Parameters block (for factual or technical output)
```
- Output must be deterministic (same input → same output).
- Every assertion must be traceable to a provided input.
- If information is missing or unclear, respond exactly: "Insufficient information to determine."
- If a detail is inferred, label it exactly: "Inference (low confidence)".
- Do not invent features, IDs, APIs, error codes, UI elements, or behavior.
- Do not assume default or "typical" system behavior.