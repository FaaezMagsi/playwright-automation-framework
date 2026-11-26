const { defineConfig, devices } = require('@playwright/test');
const env = require('./config/env');

module.exports = defineConfig({
  testDir: './tests',
  outputDir: 'test-results',
  globalSetup: require.resolve('./fixtures/global-setup'),
  globalTeardown: require.resolve('./fixtures/global-teardown'),
  timeout: env.timeouts.test,
  expect: { timeout: env.timeouts.expect },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // Low parallelism: the application under test is a shared public demo.
  workers: process.env.CI ? 2 : 3,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['allure-playwright', {
      resultsDir: 'allure-results',
      environmentInfo: { application: 'Toolshop', baseUrl: env.baseUrl, apiUrl: env.apiUrl, node: process.version },
    }],
  ],
  use: {
    actionTimeout: env.timeouts.action,
    navigationTimeout: env.timeouts.navigation,
    // Toolshop marks elements with data-test, so getByTestId() maps to it.
    testIdAttribute: 'data-test',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'ui', testDir: './tests/ui', use: { ...devices['Desktop Chrome'], baseURL: env.baseUrl } },
    { name: 'api', testDir: './tests/api', use: { baseURL: env.apiUrl, extraHTTPHeaders: { Accept: 'application/json' } } },
  ],
});
