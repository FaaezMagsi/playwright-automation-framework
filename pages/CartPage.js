const { BasePage } = require('./BasePage');

class CartPage extends BasePage {
  constructor(page) {
    super(page);
    this.titles = page.getByTestId('product-title');
    this.removeButtons = page.locator('table tbody a.btn-danger');
    this.emptyMessage = page.getByText(/cart is empty/i);
    this.proceedButton = page.getByTestId('proceed-1');
  }

  async removeFirstItem() {
    await this.click(this.removeButtons.first(), 'remove item');
  }

  async proceed() {
    await this.click(this.proceedButton, 'proceed to checkout');
  }
}

module.exports = { CartPage };
