// Custom fixtures. Playwright's page fixture creates and closes the browser
// context; these add page objects, logging and screenshot-on-failure.
const base = require('@playwright/test');
const logger = require('../utils/logger');
const { attachScreenshot } = require('../utils/screenshot');
const { autoHandleDialogs } = require('../utils/dialogs');
const { ApiClient } = require('../utils/apiClient');
const { buildUser } = require('../utils/dataFactory');
const users = require('../data/users.json');
const apiData = require('../data/api.json');
const env = require('../config/env');
const { LoginPage } = require('../pages/LoginPage');
const { RegisterPage } = require('../pages/RegisterPage');
const { HomePage } = require('../pages/HomePage');
const { ProductPage } = require('../pages/ProductPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');
const { AccountPage } = require('../pages/AccountPage');
const { Header } = require('../pages/components/Header');

const test = base.test.extend({
  // Runs for every test: attaches that test's log lines to the report.
  testLog: [async ({}, use, testInfo) => {
    logger.drain();
    logger.info(`START ${testInfo.title}`);
    await use();
    logger.info(`END ${testInfo.title} -> ${testInfo.status} (${testInfo.duration} ms)`);
    await testInfo.attach('test-log', { body: logger.drain(), contentType: 'text/plain' });
  }, { auto: true }],

  page: async ({ page }, use, testInfo) => {
    autoHandleDialogs(page);
    page.on('pageerror', (error) => logger.warn(`Page error: ${error.message}`));
    await use(page);
    if (testInfo.status !== testInfo.expectedStatus) {
      await attachScreenshot(page, testInfo, 'failure').catch((e) => logger.error(`Screenshot failed: ${e.message}`));
    }
  },

  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  registerPage: async ({ page }, use) => use(new RegisterPage(page)),
  homePage: async ({ page }, use) => use(new HomePage(page)),
  productPage: async ({ page }, use) => use(new ProductPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
  accountPage: async ({ page }, use) => use(new AccountPage(page)),
  header: async ({ page }, use) => use(new Header(page)),

  // A fresh account created through the API, independent of other tests.
  newUser: async ({ playwright }, use) => {
    const context = await playwright.request.newContext({ baseURL: env.apiUrl, extraHTTPHeaders: { Accept: 'application/json' } });
    const user = buildUser(users.template);
    const response = await new ApiClient(context).post(apiData.endpoints.register, { data: user });
    base.expect(response.status, JSON.stringify(response.body)).toBe(201);
    await use(user);
    await context.dispose();
  },
});

module.exports = { test, expect: base.expect };
