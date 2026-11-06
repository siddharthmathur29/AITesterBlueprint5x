import { test as base, type Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

type TestFixtures = {
  loginPage: LoginPage;
};

export const test = base.extend<TestFixtures>({
  loginPage: async ({ page }: { page: Page }, use, testInfo) => {
    const diagnostics: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') {
        diagnostics.push(`console error: ${message.text()}`);
      }
    });
    page.on('pageerror', (error) => diagnostics.push(`page error: ${error.message}`));
    page.on('requestfailed', (request) => {
      diagnostics.push(`request failed: ${request.method()} ${request.url()} (${request.failure()?.errorText ?? 'unknown'})`);
    });

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);

    if (testInfo.status !== testInfo.expectedStatus && !page.isClosed()) {
      await testInfo.attach('failure-screenshot', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png'
      });
      await testInfo.attach('browser-diagnostics', {
        body: Buffer.from(diagnostics.join('\n') || 'No browser errors or failed requests captured.'),
        contentType: 'text/plain'
      });
    }
  }
});

export { expect } from '@playwright/test';
