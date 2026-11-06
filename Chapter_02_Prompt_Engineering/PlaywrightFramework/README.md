# Wingify Playwright Framework

TypeScript UI automation for the Wingify login page at `https://app.wingify.com/#/login`.
Locators use XPath, and page interactions are encapsulated in `pages/LoginPage.ts`.

## Setup

```bash
npm install
npx playwright install chromium firefox webkit
cp .env.example .env
```

Keep `.env` local. Do not put production credentials in source control.

## Run tests

```bash
npm test
npm run test:headed
npm run test:valid
npm run test:invalid
npm run test:debug
```

The valid SSO test is skipped unless `VWO_SSO_EMAIL` and `VWO_DASHBOARD_URL` are set in `.env`.
It submits the SSO email and waits for the configured final dashboard URL. If the identity
provider requires user interaction, run it headed and complete that provider's sign-in in the
opened browser. The identity-provider page and its locators are intentionally not assumed.

The invalid-credentials test uses a reserved `.invalid` email address and a non-secret dummy
password. It verifies the authentication failure shown by the application; it does not use or
guess a real account.

## Allure reports

```bash
npm run allure:generate
npm run allure:open
```

The Playwright HTML report is also written to `playwright-report/`. Both report directories,
test output, and local environment files are ignored by Git.
