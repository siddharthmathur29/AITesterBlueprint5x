import { test, expect } from '../fixtures/test-fixtures';

const ssoEmail = process.env.VWO_SSO_EMAIL;
const dashboardUrl = process.env.VWO_DASHBOARD_URL;
const ssoTimeout = Number(process.env.VWO_SSO_TIMEOUT_MS ?? 120_000);

test.describe('Valid login and SSO', () => {
  test('shows the login form and accepts email and password input', async ({ loginPage }) => {
    await expect(loginPage.email).toBeVisible();
    await expect(loginPage.password).toBeVisible();
    await expect(loginPage.signInButton).toBeVisible();

    await loginPage.enterEmail('playwright.check@example.invalid');
    await loginPage.enterPassword('not-a-real-password');

    await expect(loginPage.email).toHaveValue('playwright.check@example.invalid');
    await expect(loginPage.password).toHaveValue('not-a-real-password');
    await expect(loginPage.password).toHaveAttribute('type', 'password');
  });

  test('allows Remember me to be selected', async ({ loginPage }) => {
    await expect(loginPage.rememberMe).not.toBeChecked();
    await loginPage.selectRememberMe();
    await expect(loginPage.rememberMe).toBeChecked();
  });

  test('authenticates a valid SSO user and reaches the configured dashboard', async ({ loginPage, page }) => {
    test.skip(
      !ssoEmail || !dashboardUrl,
      'Set VWO_SSO_EMAIL and VWO_DASHBOARD_URL in .env to enable the valid SSO test.'
    );
    test.setTimeout(ssoTimeout + 30_000);

    await loginPage.openSso();
    await loginPage.enterSsoEmail(ssoEmail!);
    await loginPage.submitSso();

    await expect(page).toHaveURL(dashboardUrl!, { timeout: ssoTimeout });
  });
});
