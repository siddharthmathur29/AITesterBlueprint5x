export const invalidLogin = {
  email: process.env.VWO_INVALID_LOGIN_EMAIL ?? 'playwright.invalid@example.invalid',
  password: process.env.VWO_INVALID_LOGIN_PASSWORD ?? 'not-a-real-password'
};
