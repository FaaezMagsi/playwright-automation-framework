const { BasePage } = require('./BasePage');

class HomePage extends BasePage {
  constructor(page) {
    super(page);
    this.searchInput = page.getByTestId('search-query');
    this.searchButton = page.getByTestId('search-submit');
    this.searchTerm = page.getByTestId('search-term');
    this.noResults = page.getByTestId('no-results');
    this.productCards = page.locator('a[data-test^="product-"]');
    this.productNames = page.getByTestId('product-name');
  }

  async open() {
    await this.navigate('/');
    await this.waits.visible(this.productNames.first());
  }

  async search(term) {
    await this.fill(this.searchInput, term, `search term "${term}"`);
    const response = this.waits.apiResponse(this.page, (call) => call.includes('/products') && call.includes(term));
    await this.click(this.searchButton, 'search button');
    await response;
  }

  async filterByCategory(name) {
    const checkbox = this.page.getByRole('checkbox', { name, exact: true });
    const response = this.waits.apiResponse(this.page, (call) => call.includes('by_category'));
    await this.click(checkbox, `category "${name}"`);
    await response;
  }

  async openFirstProduct() {
    const name = (await this.productNames.first().innerText()).trim();
    await this.click(this.productCards.first(), `product "${name}"`);
    return name;
  }

  /** Opens the first product that is in stock and returns its name. */
  async openFirstAvailableProduct() {
    const card = this.productCards.filter({ hasNot: this.page.getByTestId('out-of-stock') }).first();
    const name = (await card.getByTestId('product-name').innerText()).trim();
    await this.click(card, `product "${name}"`);
    return name;
  }
}

module.exports = { HomePage };
