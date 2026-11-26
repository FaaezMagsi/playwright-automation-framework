const fs = require('fs');
const logger = require('../utils/logger');
const env = require('../config/env');

/** Explicit wait until the application answers, so tests never start against a booting server. */
async function waitUntilUp(url, timeoutMs = 300_000) {
  const deadline = Date.now() + timeoutMs;
  let last = '';
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
      last = `HTTP ${response.status}`;
    } catch (error) {
      last = error.message;
    }
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
  throw new Error(`${url} is not reachable: ${last}`);
}

module.exports = async () => {
  fs.rmSync(logger.LOG_DIR, { recursive: true, force: true });
  logger.info(`Global setup: UI=${env.baseUrl} API=${env.apiUrl}`);
  await waitUntilUp(env.baseUrl);
  await waitUntilUp(`${env.apiUrl}/status`);
  logger.info('Application is reachable');
};
