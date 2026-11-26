const { BasePage } = require('../BasePage');

class Header extends BasePage {
  constructor(page) {
    super(page);
    this.signInLink = page.getByTestId('nav-sign-in');
    this.userMenu = page.getByTestId('nav-menu');
    this.signOutLink = page.getByTestId('nav-sign-out');
    this.cartLink = page.getByTestId('nav-cart');
    this.cartQuantity = page.getByTestId('cart-quantity');
  }

  async logout() {
    await this.click(this.userMenu, 'user menu');
    await this.click(this.signOutLink, 'sign out');
  }

  async openCart() {
    await this.click(this.cartLink, 'cart icon');
  }
}

module.exports = { Header };
