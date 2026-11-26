const { BasePage } = require('./BasePage');

class ProductPage extends BasePage {
  constructor(page) {
    super(page);
    this.name = page.getByTestId('product-name');
    this.price = page.getByTestId('unit-price');
    this.description = page.getByTestId('product-description');
    this.addToCartButton = page.getByTestId('add-to-cart');
  }

  async addToCart() {
    await this.click(this.addToCartButton, 'add to cart');
    return this.handlePopup();
  }
}

module.exports = { ProductPage };
