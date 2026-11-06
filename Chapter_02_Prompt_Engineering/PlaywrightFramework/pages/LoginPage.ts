import type { Locator, Page } from '@playwright/test';

const defaultLoginUrl = 'https://app.wingify.com/#/login';

export class LoginPage {
  readonly loginForm: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly rememberMe: Locator;
  readonly rememberMeLabel: Locator;
  readonly signInButton: Locator;
  readonly authenticationError: Locator;
  readonly ssoEntryButton: Locator;
  readonly ssoEmail: Locator;
  readonly ssoSubmitButton: Locator;

  constructor(
    private readonly page: Page,
    private readonly loginUrl = process.env.VWO_LOGIN_URL ?? defaultLoginUrl
  ) {
    this.loginForm = page.locator("//form[@id='js-login-form']");
    this.email = page.locator("//input[@id='login-username' and @type='email']");
    this.password = page.locator("//input[@id='login-password' and @type='password']");
    this.rememberMe = page.locator("//form[@id='js-login-form']//input[@id='checkbox-remember' and @type='checkbox']");
    this.rememberMeLabel = page.locator("//form[@id='js-login-form']//label[@for='checkbox-remember']");
    this.signInButton = page.locator("//form[@id='js-login-form']//button[@id='js-login-btn' and @type='submit']");
    this.authenticationError = page.locator("//div[@id='js-notification-box-msg']");
    this.ssoEntryButton = page.locator("//button[normalize-space(.)='Sign in using SSO']");
    this.ssoEmail = page.locator("//form[@id='js-sso-form']//input[@id='sso-email' and @type='email']");
    this.ssoSubmitButton = page.locator("//form[@id='js-sso-form']//button[@id='js-sso-login-btn' and @type='submit']");
  }

  async goto(): Promise<void> {
    await this.perform('open the login page', async () => {
      await this.page.goto(this.loginUrl, { waitUntil: 'commit' });
      await this.requireVisible(this.email, 'login email field');
    });
  }

  async enterEmail(email: string): Promise<void> {
    await this.perform('enter the login email', async () => {
      await this.requireVisible(this.email, 'login email field');
      await this.email.fill(email);
    });
  }

  async enterPassword(password: string): Promise<void> {
    await this.perform('enter the login password', async () => {
      await this.requireVisible(this.password, 'login password field');
      await this.password.fill(password);
    });
  }

  async selectRememberMe(): Promise<void> {
    await this.perform('select Remember me', async () => {
      await this.requireVisible(this.rememberMeLabel, 'Remember me control');
      await this.rememberMeLabel.click();
    });
  }

  async submitLogin(): Promise<void> {
    await this.perform('submit the login form', async () => {
      await this.requireVisible(this.signInButton, 'login submit button');
      await this.signInButton.click();
    });
  }

  async openSso(): Promise<void> {
    await this.perform('open the SSO login form', async () => {
      await this.requireVisible(this.ssoEntryButton, 'SSO entry button');
      await this.ssoEntryButton.click();
      await this.requireVisible(this.ssoEmail, 'SSO email field');
    });
  }

  async enterSsoEmail(email: string): Promise<void> {
    await this.perform('enter the SSO email', async () => {
      await this.requireVisible(this.ssoEmail, 'SSO email field');
      await this.ssoEmail.fill(email);
    });
  }

  async submitSso(): Promise<void> {
    await this.perform('submit the SSO form', async () => {
      await this.requireVisible(this.ssoSubmitButton, 'SSO submit button');
      await this.ssoSubmitButton.click();
    });
  }

  async hasEmailFormatError(): Promise<boolean> {
    await this.requireVisible(this.email, 'login email field');
    return this.email.evaluate((element) => (element as HTMLInputElement).validity.typeMismatch);
  }

  private async requireVisible(locator: Locator, description: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    const count = await locator.count();
    if (count !== 1) {
      throw new Error(`Expected exactly one ${description}, found ${count}.`);
    }
  }

  private async perform(action: string, operation: () => Promise<void>): Promise<void> {
    try {
      await operation();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`LoginPage could not ${action}: ${message}`, { cause: error });
    }
  }
}
