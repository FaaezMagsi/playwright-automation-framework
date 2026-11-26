const { test, expect } = require('../../fixtures/test');
const users = require('../../data/users.json');
const { buildUser } = require('../../utils/dataFactory');

test.describe('Authentication', () => {
  test.beforeAll(() => { console.log('Authentication suite: start'); });
  test.afterAll(() => { console.log('Authentication suite: end'); });
  test.beforeEach(async ({ loginPage }) => { await loginPage.open(); });
  test.afterEach(async ({ page }, testInfo) => { console.log(`${testInfo.title}: finished at ${page.url()}`); });

  test('valid user can log in', async ({ loginPage, accountPage, header, newUser }, testInfo) => {
    await loginPage.login(newUser.email, newUser.password);
    await expect(accountPage.title).toBeVisible();
    await expect(header.userMenu).toContainText(newUser.first_name);
    await accountPage.takeScreenshot(testInfo, 'account page');
  });

  for (const data of users.invalidLogins) {
    test(`login is rejected: ${data.case}`, async ({ loginPage, header }) => {
      await loginPage.login(data.email, data.password);
      await expect(loginPage.error).toContainText(data.error);
      await expect(header.signInLink).toBeVisible();
    });
  }

  test('logged-in user can log out', async ({ loginPage, accountPage, header, newUser }) => {
    await loginPage.login(newUser.email, newUser.password);
    await expect(accountPage.title).toBeVisible();
    await header.logout();
    await expect(header.signInLink).toBeVisible();
  });

  test('new visitor can register', async ({ registerPage, page }) => {
    await registerPage.open();
    await registerPage.register(buildUser(users.template));
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
