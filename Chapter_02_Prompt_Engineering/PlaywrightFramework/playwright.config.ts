import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['allure-playwright', { resultsDir: 'allure-results' }]
  ],
  use: {
    baseURL: process.env.VWO_LOGIN_URL ?? 'https://app.wingify.com/#/login',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium', viewport: { width: 1440, height: 1000 } }
    },
    {
      name: 'firefox',
      use: { browserName: 'firefox', viewport: { width: 1440, height: 1000 } }
    },
    {
      name: 'webkit',
      use: { browserName: 'webkit', viewport: { width: 1440, height: 1000 } }
    }
  ]
});
