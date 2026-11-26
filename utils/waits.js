// Explicit wait helpers. Implicit waiting is provided by Playwright's
// auto-waiting, bounded by actionTimeout / navigationTimeout / expect.timeout.
const waits = {
  visible: (locator, timeout) => locator.waitFor({ state: 'visible', timeout }),
  hidden: (locator, timeout) => locator.waitFor({ state: 'hidden', timeout }),
  urlContains: (page, fragment, timeout) => page.waitForURL((url) => url.href.includes(fragment), { timeout }),
  /** Starts listening for an API response; call before the triggering action. */
  apiResponse: (page, urlPart, method = 'GET') =>
    page.waitForResponse((res) => res.url().includes(urlPart) && res.request().method() === method && res.ok()),
};

module.exports = waits;
