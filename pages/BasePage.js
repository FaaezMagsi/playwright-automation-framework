// Reusable actions shared by every page object.
const logger = require('../utils/logger');
const waits = require('../utils/waits');
const dialogs = require('../utils/dialogs');
const { attachScreenshot } = require('../utils/screenshot');

class BasePage {
  constructor(page) {
    this.page = page;
    this.waits = waits;
  }

  async navigate(path = '/') {
    logger.info(`Navigate to ${path}`);
    await this.page.goto(path);
  }

  async click(locator, description) {
    logger.info(`Click ${description}`);
    await locator.click();
  }

  async fill(locator, value, description) {
    logger.info(`Fill ${description}`);
    await locator.fill(value);
  }

  async select(locator, option, description) {
    logger.info(`Select ${description}`);
    await locator.selectOption(option);
  }

  takeScreenshot(testInfo, name) {
    return attachScreenshot(this.page, testInfo, name);
  }

  handlePopup() {
    return dialogs.handleToast(this.page);
  }
}

module.exports = { BasePage };
