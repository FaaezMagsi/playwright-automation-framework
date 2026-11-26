const { BasePage } = require('./BasePage');

class AccountPage extends BasePage {
  constructor(page) {
    super(page);
    this.title = page.getByTestId('page-title');
  }
}

module.exports = { AccountPage };
