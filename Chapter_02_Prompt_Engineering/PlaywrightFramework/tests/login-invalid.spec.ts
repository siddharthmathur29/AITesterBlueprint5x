import { test, expect } from '../fixtures/test-fixtures';
import { invalidLogin } from '../utils/test-data';

test.describe('Invalid login', () => {
  test('rejects invalid credentials without granting dashboard access', async ({ loginPage, page }) => {
    await loginPage.enterEmail(invalidLogin.email);
    await loginPage.enterPassword(invalidLogin.password);
    await loginPage.submitLogin();

    await expect(loginPage.authenticationError).toBeVisible();
    await expect(loginPage.authenticationError).toHaveText(
      'Your email, password, IP address or location did not match'
    );
    await expect(page).toHaveURL(/app\.wingify\.com\/#\/login/);
  });

  test('rejects an invalid email format in the browser without submitting credentials', async ({ loginPage, page }) => {
    await loginPage.enterEmail('not-an-email');
    await loginPage.submitLogin();

    await expect(loginPage.email).toHaveValue('not-an-email');
    expect(await loginPage.hasEmailFormatError()).toBe(true);
    await expect(page).toHaveURL(/app\.wingify\.com\/#\/login/);
  });
});
