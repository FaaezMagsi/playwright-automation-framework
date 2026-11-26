const fs = require('fs');
const logger = require('../utils/logger');
const env = require('../config/env');

module.exports = async () => {
  fs.rmSync(logger.LOG_DIR, { recursive: true, force: true });
  logger.info(`Global setup: UI=${env.baseUrl} API=${env.apiUrl}`);
};
