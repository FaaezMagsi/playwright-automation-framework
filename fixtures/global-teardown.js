const logger = require('../utils/logger');

module.exports = async () => {
  logger.info('Global teardown: run finished');
};
